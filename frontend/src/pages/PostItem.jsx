import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

function PostItem() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    type: 'lost',
    location: '',
    date: '',
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');

      // FormData banate hain kyunki file bhejni hai (JSON se nahi ho sakta)
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      if (image) data.append('image', image);

      await API.post('/items', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Post an Item</h2>

      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

      <form onSubmit={handleSubmit}>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <input
          type="text"
          name="title"
          placeholder="Title (e.g. Black Wallet)"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          rows="3"
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        >
          <option>Electronics</option>
          <option>Documents</option>
          <option>Accessories</option>
          <option>Books</option>
          <option>Other</option>
        </select>

        <input
          type="text"
          name="location"
          placeholder="Location (e.g. Canteen)"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <label className="block text-sm text-gray-600 mb-1">Photo (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 mb-4 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Post Item
        </button>
      </form>
    </div>
  );
}

export default PostItem;