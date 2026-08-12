import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import API from '../api/axios';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await API.get('/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // har 30 sec refresh
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBellClick = async () => {
    setShowDropdown(!showDropdown);

    if (!showDropdown && unreadCount > 0) {
      try {
        const token = localStorage.getItem('token');
        await API.put(
          '/notifications/mark-all-read',
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center relative">
      <Link to="/" className="text-xl font-bold text-blue-600">
        Lost & Found
      </Link>

      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="text-gray-700">Hi, {user.name}</span>
            <Link to="/post" className="text-blue-500 hover:underline">
              Post Item
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="text-purple-600 hover:underline">
                Admin
              </Link>
            )}

            {/* Bell icon */}
            <div className="relative">
              <button onClick={handleBellClick} className="relative p-1">
                🔔
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded border z-50 max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        className={`p-3 text-sm border-b ${
                          n.read ? 'bg-white' : 'bg-blue-50'
                        }`}
                      >
                        {n.message}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
            <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;