import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar.jsx";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);

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

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setImageFile(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => data.append(key, val));
      if (imageFile) data.append("image", imageFile);

      const res = await axios.put(
        `https://algotronn-backend.vercel.app/product/${editingProduct._id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Product updated successfully");
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update product");
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
                  <button style={styles.deleteButton} onClick={() => deleteProduct(product._id)} disabled={deletingId === product._id}>
                    {deletingId === product._id ? "Deleting..." : "Delete"}
                  </button>
                  <button style={styles.editButton} onClick={() => handleEditClick(product)}>Edit</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editingProduct && (
        <div style={styles.modal}>
          <form onSubmit={handleEditSubmit} style={styles.form}>
            <h3>Edit Product</h3>
            <input name="name" value={formData.name || ""} onChange={handleEditChange} placeholder="Name" />
            <input name="description" value={formData.description || ""} onChange={handleEditChange} placeholder="Description" />
            <input name="type" value={formData.type || ""} onChange={handleEditChange} placeholder="Type (public/duplicate)" />
            <input name="stock" value={formData.stock} onChange={handleEditChange} placeholder="Stock (true/false)" />
            <input name="price" value={formData.price || ""} onChange={handleEditChange} placeholder="Price" />
            <input name="originalPrice" value={formData.originalPrice || ""} onChange={handleEditChange} placeholder="Original Price" />
            <input name="discount" value={formData.discount || ""} onChange={handleEditChange} placeholder="Discount" />
            <input name="summary" value={formData.summary || ""} onChange={handleEditChange} placeholder="Summary" />
            <input name="dailyPL" value={formData.dailyPL || ""} onChange={handleEditChange} placeholder="Daily P&L" />
            <input name="publicType" value={formData.publicType || ""} onChange={handleEditChange} placeholder="Public Type" />
            <input name="tradetronLink" value={formData.tradetronLink || ""} onChange={handleEditChange} placeholder="Tradetron Link" />
            <input name="sorttype" value={formData.sorttype || ""} onChange={handleEditChange} placeholder="Sort Type" />
            <input name="isPriced" value={formData.isPriced} onChange={handleEditChange} placeholder="Is Priced (true/false)" />
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <div>
              <button type="submit">Update</button>
              <button type="button" onClick={() => setEditingProduct(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

const styles = {
  container: { padding: "20px", fontFamily: "Arial", maxWidth: "1000px", margin: "auto" },
  heading: { textAlign: "center", marginBottom: "20px" },
  list: { listStyle: "none", padding: 0 },
  card: {
    display: "flex", gap: "20px", alignItems: "center",
    border: "1px solid #ddd", borderRadius: "10px", padding: "15px", marginBottom: "15px"
  },
  image: { width: "150px", height: "150px", objectFit: "cover", borderRadius: "10px" },
  details: { flex: 1 },
  deleteButton: {
    padding: "8px 16px", backgroundColor: "#ff4d4f", color: "#fff",
    border: "none", borderRadius: "5px", cursor: "pointer", marginRight: "10px"
  },
  editButton: {
    padding: "8px 16px", backgroundColor: "#1890ff", color: "#fff",
    border: "none", borderRadius: "5px", cursor: "pointer"
  },
  modal: {
    background: "#f5f5f5", padding: "20px", borderRadius: "10px",
    width: "90%", maxWidth: "500px", margin: "20px auto"
  },
  form: {
    display: "flex", flexDirection: "column", gap: "10px"
  }
};

export default ProductList;