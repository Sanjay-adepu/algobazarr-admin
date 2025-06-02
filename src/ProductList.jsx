import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar.jsx";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [imageFiles, setImageFiles] = useState({}); // Track selected image files per product

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://algotronn-backend.vercel.app/products");
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      setDeletingId(id);
      await axios.delete(`https://algotronn-backend.vercel.app/product/${id}`);
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleImageChange = (productId, file) => {
    setImageFiles({ ...imageFiles, [productId]: file });
  };

  const handleImageUpload = async (product) => {
    const file = imageFiles[product.id];
    if (!file) return alert("Please select an image to upload.");

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploadingId(product.id);
      const res = await axios.put(
        `https://algotronn-backend.vercel.app/product/${product.id}/image`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updatedProduct = res.data.product;
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      alert("Image updated successfully!");
    } catch (error) {
      console.error("Error updating image:", error);
      alert("Failed to update image.");
    } finally {
      setUploadingId(null);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <Navbar />
      <div className="product-list-container" style={styles.container}>
        <h2 style={styles.heading}>Product List</h2>
        {products.length === 0 ? (
          <p>Loading....</p>
        ) : (
          <ul style={styles.list}>
            {products.map((product) => (
              <li key={product._id} style={styles.card}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={styles.image}
                />
                <div style={styles.details}>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p><strong>Type:</strong> {product.type}</p>
                  {product.type === "duplicate" && (
                    <>
                      <p><strong>Price:</strong> ₹{product.price}</p>
                      <p><strong>Original Price:</strong> ₹{product.originalPrice}</p>
                      <p><strong>Discount:</strong> {product.discount}%</p>
                    </>
                  )}
                  {product.type === "public" && (
                    <>
                      <p><strong>Summary:</strong> {product.summary}</p>
                      <p><strong>Daily P&L:</strong> {product.dailyPL}</p>
                      <p><strong>Public Type:</strong> {product.publicType}</p>
                    </>
                  )}

                  {/* Image Upload Section */}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(product.id, e.target.files[0])}
                    />
                    <button
                      onClick={() => handleImageUpload(product)}
                      style={styles.uploadButton}
                      disabled={uploadingId === product.id}
                    >
                      {uploadingId === product.id ? "Uploading..." : "Update Image"}
                    </button>
                  </div>

                  <button
                    style={styles.deleteButton}
                    onClick={() => deleteProduct(product._id)}
                    disabled={deletingId === product._id}
                  >
                    {deletingId === product._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "1000px",
    margin: "auto"
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px"
  },
  list: {
    listStyle: "none",
    padding: 0
  },
  card: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "15px"
  },
  image: {
    width: "150px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "10px"
  },
  details: {
    flex: 1
  },
  deleteButton: {
    padding: "8px 16px",
    backgroundColor: "#ff4d4f",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px"
  },
  uploadButton: {
    padding: "8px 16px",
    backgroundColor: "#1890ff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
    marginRight: "10px"
  }
};

export default ProductList;