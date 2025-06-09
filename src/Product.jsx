import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar.jsx';
import './Addproduct.css';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'duplicate',
    price: '',
    originalPrice: '',
    discount: '',
    summary: '',
    dailyPL: '',
    publicType: '',
    tradetronLink: '', // Existing new field
    sorttype: '',      // ✅ Added sorttype field
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('type', formData.type);
      data.append('stock', true); // Always true

      if (formData.type === 'duplicate') {
        data.append('isPriced', true);
        data.append('price', formData.price);
        data.append('originalPrice', formData.originalPrice);
        data.append('discount', formData.discount);
      } else {
        data.append('isPriced', false);
      }

      data.append('summary', formData.summary);
      data.append('dailyPL', formData.dailyPL);
      data.append('publicType', formData.publicType);
      data.append('tradetronLink', formData.tradetronLink);
      data.append('sorttype', formData.sorttype);  // ✅ Append sorttype

      if (formData.image) {
        data.append('image', formData.image);
      }

      const res = await axios.post('https://algotronn-backend.vercel.app/add-product', data);
      alert('Product uploaded successfully!');
      console.log(res.data);
    } catch (error) {
      console.error('Error uploading product:', error);
      alert('Upload failed!');
    }
  };

  return (
    <>
      <Navbar />

      <form className="form-container" onSubmit={handleSubmit}>
        <h2>Add New Product</h2>

        <label></label>
        <select name="type" onChange={handleChange} value={formData.type}>
          <option value="duplicate">Duplicate</option>
          <option value="public">Public</option>
        </select>

        <label>Name</label>
        <input type="text" name="name" onChange={handleChange} value={formData.name} required />

        <label>Description</label>
        <textarea name="description" onChange={handleChange} value={formData.description} required />

        {formData.type === 'duplicate' && (
          <>
            <label>Price</label>
            <input type="number" name="price" onChange={handleChange} value={formData.price} />

            <label>Original Price</label>
            <input type="number" name="originalPrice" onChange={handleChange} value={formData.originalPrice} />

            <label>Discount (%)</label>
            <input type="number" name="discount" onChange={handleChange} value={formData.discount} />
          </>
        )}

        <label>Summary</label>
        <textarea name="summary" onChange={handleChange} value={formData.summary} />

        <label>Daily P/L</label>
        <input type="text" name="dailyPL" onChange={handleChange} value={formData.dailyPL} />

        <label> Type</label>
        <input type="text" name="publicType" onChange={handleChange} value={formData.publicType} />

        <label>Tradetron Link</label>
        <input
          type="text"
          name="tradetronLink"
          onChange={handleChange}
          value={formData.tradetronLink}
          placeholder="https://www.tradetron.tech/..."
        />

<label>Sort Type</label>
<select name="sorttype" onChange={handleChange} value={formData.sorttype} required>
  <option value="">-- Select Sort Type --</option>
  <option value="buying">Buying strategies</option>
  <option value="selling">Selling strategies</option>
<option value="collaborate">Collaborated strategies</option>
</select>

        <label>Image</label>
        <input type="file" name="image" accept="image/*" onChange={handleChange} required />

        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default AddProduct;