import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState({});
  let componentMounted = true;

  const dispatch = useDispatch();

  const addProduct = (product) => {
    const productWithVariants = {
      ...product,
      selectedSize: selectedVariants[product.id]?.size || "",
      selectedColor: selectedVariants[product.id]?.color || "",
    };
    dispatch(addCart(productWithVariants));
  };

  const handleVariantChange = (productId, variantType, value) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [variantType]: value,
      },
    }));
  };

  // Mock variant data - in a real app, this would come from the API
  const getVariantsForProduct = (product) => {
    const variants = {
      sizes: [],
      colors: [],
    };

    // Add sample variants based on product category
    if (
      product.category === "men's clothing" ||
      product.category === "women's clothing"
    ) {
      variants.sizes = ["XS", "S", "M", "L", "XL", "XXL"];
      variants.colors = ["Black", "White", "Navy", "Gray", "Red"];
    } else if (product.category === "electronics") {
      variants.sizes = ["128GB", "256GB", "512GB"];
      variants.colors = ["Black", "White", "Silver", "Gold"];
    } else if (product.category === "jewelery") {
      variants.sizes = ["Small", "Medium", "Large"];
      variants.colors = ["Gold", "Silver", "Rose Gold"];
    }

    return variants;
  };

  // Function to get hex color codes for color names
  const getColorHex = (colorName) => {
    const colorMap = {
      Black: "#000000",
      White: "#FFFFFF",
      Navy: "#001f3f",
      Gray: "#808080",
      Red: "#FF4136",
      Silver: "#DDDDDD",
      Gold: "#FFD700",
      "Rose Gold": "#E8B4B8",
    };
    return colorMap[colorName] || "#CCCCCC";
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products/");
      if (componentMounted) {
        const products = await response.json();
        // Add mock stock data to each product
        const productsWithStock = products.map((product) => ({
          ...product,
          stock: Math.floor(Math.random() * 20) + 1, // Random stock between 1-20, some might be 0 for out of stock
        }));

        // Make some products out of stock (stock = 0) randomly
        const productsWithSomeOutOfStock = productsWithStock.map((product) => ({
          ...product,
          stock: Math.random() < 0.2 ? 0 : product.stock, // 20% chance to be out of stock
        }));

        setData(productsWithSomeOutOfStock);
        setFilter(productsWithSomeOutOfStock);
        setLoading(false);
      }

      return () => {
        componentMounted = false;
      };
    };

    getProducts();
  }, []);

  useEffect(() => {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    if (window.bootstrap) {
      tooltipTriggerList.map((tooltipTriggerEl) => {
        return new window.bootstrap.Tooltip(tooltipTriggerEl);
      });
    }
  }, [filter]); // Re-initialize when products change

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  };

  const filterInStock = () => {
    const inStockProducts = data.filter((item) => item.stock > 0);
    setFilter(inStockProducts);
  };

  const filterOutOfStock = () => {
    const outOfStockProducts = data.filter((item) => item.stock === 0);
    setFilter(outOfStockProducts);
  };

  const ShowProducts = () => {
    return (
      <>
        <div className="buttons text-center py-5">
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => setFilter(data)}
          >
            All
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("men's clothing")}
          >
            Men's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("women's clothing")}
          >
            Women's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("jewelery")}
          >
            Jewelery
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("electronics")}
          >
            Electronics
          </button>

          {/* Stock Filter Buttons */}
          <div className="mt-2">
            <button
              className="btn btn-outline-success btn-sm m-2"
              onClick={filterInStock}
            >
              <i className="fa-solid fa-check me-1"></i>
              In Stock Only
            </button>
            <button
              className="btn btn-outline-danger btn-sm m-2"
              onClick={filterOutOfStock}
            >
              <i className="fa-solid fa-times me-1"></i>
              Out of Stock
            </button>
          </div>
        </div>

        {filter.map((product) => {
          const variants = getVariantsForProduct(product);
          const isOutOfStock = product.stock === 0;

          return (
            <div key={product.id} className="col-md-4 col-12 mb-4">
              <div
                className={`card h-100 ${isOutOfStock ? "opacity-75" : ""}`}
                key={product.id}
              >
                <Link
                  to={"/product/" + product.id}
                  className="text-decoration-none text-dark"
                >
                  <div
                    className="card-img-container p-3"
                    style={{
                      height: "250px",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      className="card-img-top"
                      src={product.image}
                      alt="Card"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        width: "auto",
                        height: "auto",
                      }}
                    />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{product.title}</h5>
                    <p className="card-text flex-grow-1">
                      {product.description.substring(0, 90)}...
                    </p>
                  </div>
                  <ul className="list-unstyled text-end">
                    <li className="list-group-item lead pe-3">
                      <strong>$ {product.price}</strong>
                    </li>
                    <li className="list-group-item pe-3">
                      {product.stock > 0 ? (
                        <span
                          className={`badge ${
                            product.stock <= 5 ? "bg-warning" : "bg-success"
                          }`}
                        >
                          {product.stock <= 5
                            ? `Only ${product.stock} left`
                            : `In Stock (${product.stock})`}
                        </span>
                      ) : (
                        <span className="badge bg-danger">Out of Stock</span>
                      )}
                    </li>
                  </ul>
                </Link>

                {/* Variant Selection with Buttons */}
                <div className="card-body">
                  {variants.sizes.length > 0 && (
                    <div className="mb-3">
                      <label className="form-label small text-muted fw-bold">
                        Size:
                      </label>
                      <div className="d-flex flex-wrap gap-2 mt-1">
                        {variants.sizes.map((size, index) => (
                          <button
                            key={index}
                            type="button"
                            className={`btn btn-sm ${
                              selectedVariants[product.id]?.size === size
                                ? "btn-dark"
                                : "btn-outline-dark"
                            }`}
                            disabled={isOutOfStock}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!isOutOfStock) {
                                handleVariantChange(product.id, "size", size);
                              }
                            }}
                            onFocus={(e) => e.preventDefault()}
                            onMouseDown={(e) => e.preventDefault()}
                            style={{
                              minWidth: "45px",
                              fontSize: "12px",
                              scrollSnapAlign: "none",
                              opacity: isOutOfStock ? 0.5 : 1,
                            }}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {variants.colors.length > 0 && (
                    <div className="mb-3">
                      <label className="form-label small text-muted fw-bold">
                        Color:
                      </label>
                      <div className="d-flex flex-wrap gap-2 mt-1">
                        {variants.colors.map((color, index) => (
                          <button
                            key={index}
                            type="button"
                            className={`btn p-0 ${
                              selectedVariants[product.id]?.color === color
                                ? "border-dark"
                                : "border-secondary"
                            }`}
                            disabled={isOutOfStock}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!isOutOfStock) {
                                handleVariantChange(product.id, "color", color);
                              }
                            }}
                            onFocus={(e) => e.preventDefault()}
                            onMouseDown={(e) => e.preventDefault()}
                            style={{
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                              backgroundColor: getColorHex(color),
                              borderWidth:
                                selectedVariants[product.id]?.color === color
                                  ? "2px"
                                  : "1px",
                              position: "relative",
                              opacity: isOutOfStock ? 0.5 : 1,
                            }}
                            title={color}
                          >
                            {/* White border for white color visibility */}
                            {color === "White" && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "2px",
                                  left: "2px",
                                  right: "2px",
                                  bottom: "2px",
                                  borderRadius: "50%",
                                  border: "1px solid #ddd",
                                }}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="card-body mt-auto d-flex justify-content-end align-items-end p-4">
                  <button
                    className={`btn px-3 py-2 ${
                      product.stock > 0 ? "btn-dark" : "btn-secondary"
                    }`}
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title={product.stock > 0 ? "Add to cart" : "Out of stock"}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (product.stock > 0) {
                        toast.success("Added to cart");
                        addProduct(product);
                      } else {
                        toast.error("This product is out of stock");
                      }
                    }}
                  >
                    {product.stock > 0 ? (
                      <i className="fa-solid fa-cart-plus"></i>
                    ) : (
                      <span className="small">Out of Stock</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };
  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">Latest Products</h2>
            <p className="text-center text-muted">
              Showing {filter.length} products
              {filter.length !== data.length && ` of ${data.length} total`}
              {" • "}
              {filter.filter((p) => p.stock > 0).length} in stock
              {filter.filter((p) => p.stock === 0).length > 0 &&
                `, ${filter.filter((p) => p.stock === 0).length} out of stock`}
            </p>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;
