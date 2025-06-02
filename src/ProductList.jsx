import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar.jsx";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [form, setForm] = useState({}); // stores form field values

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://algotronn-backend.vercel.app/products");
      setProducts(res.data.products || []);
    } catch (error) {
      alert("Failed to fetch products.");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      setDeletingId(id);
      await axios.delete(`https://algotronn-backend.vercel.app/product/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      alert("Product deleted.");
    } catch (error) {
      alert("Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  };

  const openEditForm = (product) => {
    setEditProduct(product);
    setForm(product); // preload form with existing data
    setEditImage(null); // reset
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditImageChange = (e) => {
    setEditImage(e.target.files[0]);
  };

  const handleEditSubmit = async () => {
    if (!editProduct) return;
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (editImage) {
      formData.append("image", editImage);
    }

    try {
      const res = await axios.put(
        `https://algotronn-backend.vercel.app/product/${editProduct.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updated = res.data.product;
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      alert("Product updated!");
      setEditProduct(null); // close modal
    } catch (error) {
      alert("Update failed: " + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2>Product List</h2>

        {products.map((product) => (
          <div key={product._id} style={styles.card}>
            <img src={product.imageUrl} alt={product.name} style={styles.image} />
            <div style={styles.details}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Type: {product.type}</p>

              {product.type === "duplicate" && (
                <>
                  <p>Price: ₹{product.price}</p>
                  <p>Original Price: ₹{product.originalPrice}</p>
                  <p>Discount: {product.discount}%</p>
                </>
              )}

              <button onClick={() => openEditForm(product)} style={styles.editButton}>Edit</button>
              <button onClick={() => deleteProduct(product._id)} style={styles.deleteButton}>
                {deletingId === product._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}

        {/* ✅ Edit Popup */}
        {editProduct && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h3>Edit Product</h3>

              <input name="name" value={form.name || ""} onChange={handleEditInputChange} placeholder="Name" />
              <input name="description" value={form.description || ""} onChange={handleEditInputChange} placeholder="Description" />
              <input name="type" value={form.type || ""} onChange={handleEditInputChange} placeholder="Type" />
              <input name="summary" value={form.summary || ""} onChange={handleEditInputChange} placeholder="Summary" />
              <input name="dailyPL" value={form.dailyPL || ""} onChange={handleEditInputChange} placeholder="Daily P&L" />
              <input name="publicType" value={form.publicType || ""} onChange={handleEditInputChange} placeholder="Public Type" />
              <input name="price" value={form.price || ""} onChange={handleEditInputChange} placeholder="Price" />
              <input name="originalPrice" value={form.originalPrice || ""} onChange={handleEditInputChange} placeholder="Original Price" />
              <input name="discount" value={form.discount || ""} onChange={handleEditInputChange} placeholder="Discount" />
              <input name="tradetronLink" value={form.tradetronLink || ""} onChange={handleEditInputChange} placeholder="Tradetron Link" />
              <input name="sorttype" value={form.sorttype || ""} onChange={handleEditInputChange} placeholder="Sort Type" />

              <label>
                Stock:
                <input
                  type="checkbox"
                  checked={form.stock === true || form.stock === "true"}
                  onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.checked }))}
                />
              </label>

              <label>
                Is Priced:
                <input
                  type="checkbox"
                  checked={form.isPriced === true || form.isPriced === "true"}
                  onChange={(e) => setForm((prev) => ({ ...prev, isPriced: e.target.checked }))}
                />
              </label>

              <input type="file" accept="image/*" onChange={handleEditImageChange} />
              <button onClick={handleEditSubmit}>Save</button>
              <button onClick={() => setEditProduct(null)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const styles = {
  container: { padding: "20px", maxWidth: "1000px", margin: "auto" },
  card: { display: "flex", border: "1px solid #ccc", padding: "10px", marginBottom: "10px" },
  image: { width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px" },
  details: { marginLeft: "20px", flex: 1 },
  deleteButton: { backgroundColor: "#ff4d4f", color: "#fff", border: "none", padding: "6px 12px", marginTop: "10px" },
  editButton: { backgroundColor: "#007bff", color: "#fff", border: "none", padding: "6px 12px", marginTop: "10px", marginRight: "10px" },
  modalOverlay: {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center"
  },
  modal: {
    backgroundColor: "#fff", padding: "20px", borderRadius: "10px",
    width: "90%", maxWidth: "500px", display: "flex", flexDirection: "column", gap: "10px"
  }
};

export default ProductList;