import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    type: '',
    location: '',
  });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== '')
      );
      const res = await API.get('/items', { params });
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', type: '', location: '' });
    setTimeout(fetchItems, 0);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Lost & Found Items</h1>

      <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          name="search"
          placeholder="Search by title..."
          value={filters.search}
          onChange={handleFilterChange}
          className="flex-1 min-w-[150px] p-2 border rounded"
        />

        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">All Types</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">All Categories</option>
          <option>Electronics</option>
          <option>Documents</option>
          <option>Accessories</option>
          <option>Books</option>
          <option>Other</option>
        </select>

        <input
          type="text"
          name="location"
          placeholder="Location..."
          value={filters.location}
          onChange={handleFilterChange}
          className="p-2 border rounded w-40"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
        <button
          type="button"
          onClick={clearFilters}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
        >
          Clear
        </button>
      </form>

      {loading ? (
        <p className="text-center mt-10">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">No items found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <Link
              to={`/items/${item._id}`}
              key={item._id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-32 object-cover rounded mb-2"
                />
              )}
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  item.type === 'lost' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}
              >
                {item.type.toUpperCase()}
              </span>
              <h2 className="text-lg font-bold mt-2">{item.title}</h2>
              <p className="text-gray-600 text-sm mt-1">{item.description.slice(0, 60)}...</p>
              <p className="text-gray-500 text-xs mt-2">📍 {item.location}</p>
              <p className="text-gray-500 text-xs">Status: {item.status}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;


