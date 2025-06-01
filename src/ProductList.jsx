import React, { useEffect, useState } from 'react';
import axios from 'axios';
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    type: 'duplicate',
    price: '',
    originalPrice: '',
    discount: '',
    summary: '',
    dailyPL: '',
    publicType: '',
    tradetronLink: '',
    sorttype: '',
    image: null,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('https://algotronn-backend.vercel.app/products');
      setProducts(res.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setEditFormData({
      name: product.name || '',
      description: product.description || '',
      type: product.type || 'duplicate',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      discount: product.discount || '',
      summary: product.summary || '',
      dailyPL: product.dailyPL || '',
      publicType: product.publicType || '',
      tradetronLink: product.tradetronLink || '',
      sorttype: product.sorttype || '',
      image: null,
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setEditFormData({ ...editFormData, [name]: files[0] });
    } else {
      setEditFormData({ ...editFormData, [name]: value });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', editFormData.name);
      data.append('description', editFormData.description);
      data.append('type', editFormData.type);
      data.append('stock', true);

      if (editFormData.type === 'duplicate') {
        data.append('isPriced', true);
        data.append('price', editFormData.price);
        data.append('originalPrice', editFormData.originalPrice);
        data.append('discount', editFormData.discount);
      } else {
        data.append('isPriced', false);
      }

      data.append('summary', editFormData.summary);
      data.append('dailyPL', editFormData.dailyPL);
      data.append('publicType', editFormData.publicType);
      data.append('tradetronLink', editFormData.tradetronLink);
      data.append('sorttype', editFormData.sorttype);

      if (editFormData.image) {
        data.append('image', editFormData.image);
      }

      await axios.put(
        `https://algotronn-backend.vercel.app/product/${selectedProduct.id}`,
        data
      );

      setIsEditModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product.');
    }
  };

  return (
    <div>
      <h2 style={styles.heading}>Product List</h2>
      <div style={styles.productContainer}>
        {products.map((product) => (
          <div key={product.id} style={styles.card}>
            <img src={product.imageUrl} alt={product.name} style={styles.image} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <button style={styles.editButton} onClick={() => openEditModal(product)}>
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Edit Product</h2>
            <form onSubmit={handleEditSubmit}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleEditChange}
              />

              <label>Description</label>
              <textarea
                name="description"
                value={editFormData.description}
                onChange={handleEditChange}
              />

              <label>Type</label>
              <select
                name="type"
                value={editFormData.type}
                onChange={handleEditChange}
              >
                <option value="duplicate">Duplicate</option>
                <option value="buying">Buying</option>
                <option value="selling">Selling</option>
              </select>

              {editFormData.type === 'duplicate' && (
                <>
                  <label>Price</label>
                  <input
                    type="number"
                    name="price"
                    value={editFormData.price}
                    onChange={handleEditChange}
                  />
                  <label>Original Price</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={editFormData.originalPrice}
                    onChange={handleEditChange}
                  />
                  <label>Discount</label>
                  <input
                    type="number"
                    name="discount"
                    value={editFormData.discount}
                    onChange={handleEditChange}
                  />
                </>
              )}

              <label>Summary</label>
              <textarea
                name="summary"
                value={editFormData.summary}
                onChange={handleEditChange}
              />

              <label>Daily PL</label>
              <input
                type="text"
                name="dailyPL"
                value={editFormData.dailyPL}
                onChange={handleEditChange}
              />

              <label>Public Type</label>
              <input
                type="text"
                name="publicType"
                value={editFormData.publicType}
                onChange={handleEditChange}
              />

              <label>Tradetron Link</label>
              <input
                type="text"
                name="tradetronLink"
                value={editFormData.tradetronLink}
                onChange={handleEditChange}
              />

              <label>Sort Type</label>
              <input
                type="text"
                name="sorttype"
                value={editFormData.sorttype}
                onChange={handleEditChange}
              />

              <label>Image</label>
              <input type="file" name="image" onChange={handleEditChange} />

              <div style={{ marginTop: '20px' }}>
                <button type="submit" style={styles.saveButton}>Save</button>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  heading: {
    textAlign: 'center',
    margin: '20px 0',
  },
  productContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
  },
  card: {
    border: '1px solid #ccc',
    padding: '16px',
    borderRadius: '8px',
    width: '250px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '6px',
  },
  editButton: {
    marginTop: '10px',
    backgroundColor: '#1890ff',
    color: '#fff',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    width: '500px',
    maxHeight: '90vh',
    overflowY: 'auto',
    borderRadius: '10px',
  },
  saveButton: {
    backgroundColor: 'green',
    color: 'white',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '5px',
    marginRight: '10px',
    cursor: 'pointer',
  },
  cancelButton: {
    backgroundColor: 'gray',
    color: 'white',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default ProductList;