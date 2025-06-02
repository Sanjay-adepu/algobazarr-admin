import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar.jsx";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [imageFiles, setImageFiles] = useState({});
  const [uploadingId, setUploadingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://algotronn-backend.vercel.app/products");
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to fetch products.");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      setDeletingId(id);
      await axios.delete(`https://algotronn-backend.vercel.app/product/${id}`);
      setProducts((prev) => prev.filter((product) => product._id !== id));
      alert("Product deleted successfully.");
    } catch (error) {
      console.error("Error deleting product:", error.response?.data || error.message);
      alert("Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleFileChange = (e, id) => {
    setImageFiles((prev) => ({ ...prev, [id]: e.target.files[0] }));
  };

  const handleImageUpload = async (product) => {
    const file = imageFiles[product.id];

    if (!file || !(file instanceof File)) {
      alert("Please select a valid image file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploadingId(product.id);

      const res = await axios.put(
        `https://algotronn-backend.vercel.app/product/${product.id}/image`,
        formData
      );

      const updatedProduct = res.data.product;

      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );

      alert("Image updated successfully!");
    } catch (error) {
      console.error("Error updating image:", error.response?.data || error.message);
      alert(`Failed to update image. Reason: ${error.response?.data?.message || error.message}`);
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
                <img src={product.imageUrl} alt={product.name} style={styles.image} />
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

                  <div style={{ marginTop: "10px" }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, product.id)}
                    />
                    <button
                      onClick={() => handleImageUpload(product)}
                      disabled={uploadingId === product.id}
                      style={{ ...styles.uploadButton, marginLeft: "10px" }}
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
    padding: "6px 12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default ProductList;