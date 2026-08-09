import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/useAuth';

function ItemDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await API.get(`/items/${id}`);
        setItem(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await API.put(
        `/items/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItem(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!item) return <p className="text-center mt-10">Item not found.</p>;

  const isOwner = user && item.postedBy._id === user.id;

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

      {item.image && (
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}

      <span
        className={`text-xs font-semibold px-2 py-1 rounded ${
          item.type === 'lost' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
        }`}
      >
        {item.type.toUpperCase()}
      </span>

      <h1 className="text-2xl font-bold mt-2">{item.title}</h1>
      <p className="text-gray-600 mt-2">{item.description}</p>

      <div className="mt-4 text-sm text-gray-500 space-y-1">
        <p>📍 Location: {item.location}</p>
        <p>📅 Date: {new Date(item.date).toLocaleDateString()}</p>
        <p>🏷️ Category: {item.category}</p>
        <p>👤 Posted by: {item.postedBy.name}</p>
        <p>📌 Status: <span className="font-semibold">{item.status}</span></p>
      </div>

      {user && !isOwner && item.status === 'open' && (
        <button
          onClick={() => handleStatusChange('claimed')}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Claim This Item
        </button>
      )}

      {isOwner && (
        <div className="mt-6 flex gap-3">
          {item.status !== 'resolved' && (
            <button
              onClick={() => handleStatusChange('resolved')}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Mark Resolved
            </button>
          )}
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default ItemDetail;