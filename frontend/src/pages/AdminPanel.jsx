import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/useAuth';

function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [statsRes, itemsRes, usersRes] = await Promise.all([
          API.get('/admin/stats', { headers }),
          API.get('/items', { headers }),
          API.get('/admin/users', { headers }),
        ]);

        setStats(statsRes.data);
        setItems(itemsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDelete = async (itemId) => {
    if (!window.confirm('Delete this item?')) return;
    setError('');
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.filter((item) => item._id !== itemId));
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold">{stats.totalItems}</p>
            <p className="text-sm text-gray-500">Total Items</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-red-500">{stats.openItems}</p>
            <p className="text-sm text-gray-500">Open</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-blue-500">{stats.claimedItems}</p>
            <p className="text-sm text-gray-500">Claimed</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-green-500">{stats.resolvedItems}</p>
            <p className="text-sm text-gray-500">Resolved</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
            <p className="text-sm text-gray-500">Users</p>
          </div>
        </div>
      )}

      {/* Items Table */}
      <h2 className="text-xl font-bold mb-4">All Items</h2>
      <div className="bg-white rounded-lg shadow overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Posted By</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="p-3">{item.title}</td>
                <td className="p-3">{item.type}</td>
                <td className="p-3">{item.status}</td>
                <td className="p-3">{item.postedBy?.name}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Users Table */}
      <h2 className="text-xl font-bold mb-4">All Users</h2>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPanel;