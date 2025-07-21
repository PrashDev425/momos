import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LogoutButton = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Important for HttpOnly cookies
      });

      let result = {};
      try {
        result = await response.json(); // May fail if response body is empty
      } catch (_) {
        // Ignore JSON parsing error if response body is empty
      }

      if (response.ok) {
        navigate('/admin/login');
      } else {
        setError(result.message || 'Logout failed.');
      }
    } catch (err) {
      setError('Network error.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="text-red-600 mb-2">
          {error}
        </div>
      )}
      <button
        onClick={handleLogout}
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent hover:bg-red-700'
        } transition`}
      >
        {loading ? 'Logging out...' : 'Logout'}
      </button>
    </>
  );
};

export default LogoutButton;
