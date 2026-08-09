import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
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