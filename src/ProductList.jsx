import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar.jsx";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(null);

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
    setImage(null);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    if (image) form.append("image", image);

    try {
      const res = await axios.put(`https://algotronn-backend.vercel.app/product/${editingProduct._id}`, form);
      const updated = res.data.product;
      setProducts(products.map((p) => (p._id === updated._id ? updated : p)));
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <Navbar />

      <div style={styles.container}>
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
                  <button style={styles.editButton} onClick={() => handleEditClick(product)}>
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit Popup Form */}
      {editingProduct && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Edit Product</h2>
            <form onSubmit={handleEditSubmit}>
              <input type="text" name="name" value={formData.name || ""} onChange={handleFormChange} placeholder="Name" required />
              <textarea name="description" value={formData.description || ""} onChange={handleFormChange} placeholder="Description" required />
              <select name="type" value={formData.type} onChange={handleFormChange} required>
                <option value="public">Public</option>
                <option value="duplicate">Duplicate</option>
              </select>
              <label>
                <input type="checkbox" name="stock" checked={formData.stock || false} onChange={handleFormChange} />
                In Stock
              </label>
              {formData.type === "duplicate" && (
                <>
                  <input type="number" name="price" value={formData.price || ""} onChange={handleFormChange} placeholder="Price" />
                  <input type="number" name="originalPrice" value={formData.originalPrice || ""} onChange={handleFormChange} placeholder="Original Price" />
                  <input type="number" name="discount" value={formData.discount || ""} onChange={handleFormChange} placeholder="Discount" />
                </>
              )}
              {formData.type === "public" && (
                <>
                  <input type="text" name="summary" value={formData.summary || ""} onChange={handleFormChange} placeholder="Summary" />
                  <input type="text" name="dailyPL" value={formData.dailyPL || ""} onChange={handleFormChange} placeholder="Daily P&L" />
                  <input type="text" name="publicType" value={formData.publicType || ""} onChange={handleFormChange} placeholder="Public Type" />
                </>
              )}
              <input type="text" name="tradetronLink" value={formData.tradetronLink || ""} onChange={handleFormChange} placeholder="Tradetron Link" />
              <input type="text" name="sorttype" value={formData.sorttype || ""} onChange={handleFormChange} placeholder="Sort Type" />
              <label>
                <input type="checkbox" name="isPriced" checked={formData.isPriced || false} onChange={handleFormChange} />
                Priced
              </label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <div style={{ marginTop: "10px" }}>
                <button type="submit" style={styles.saveButton}>Save</button>
                <button type="button" onClick={() => setEditingProduct(null)} style={styles.cancelButton}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
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
    marginRight: "10px"
  },
  editButton: {
    padding: "8px 16px",
    backgroundColor: "#1890ff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  modalOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },
  modal: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "400px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
  },
  saveButton: {
    padding: "8px 16px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    marginRight: "10px",
    cursor: "pointer"
  },
  cancelButton: {
    padding: "8px 16px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default ProductList;