import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/Momo.svg';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setMessage('');

        const formData = new FormData();
        formData.append('username', form.username);
        formData.append('password', form.password);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok && result.status) {
                const decoded = jwtDecode(result.token);
                const role = decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                if (role === 'Admin') {
                    navigate('/admin');
                } else if (role === 'User') {
                    navigate('/');
                } else {
                    navigate('/');
                }
            } else {
                setMessage(result.message || 'Login failed');
                setErrors(result.validationErrors || {});
            }
        } catch (err) {
            setMessage('An unexpected error occurred.');
            console.log(err);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
            <main className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-accent text-xl font-bold">
                        <img className="w-8" src={logo} alt="Momos Logo" />
                    </div>
                </div>

                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-gray-800">Sign in to your account</h1>
                </div>

                {message && (
                    <div className="text-sm text-red-600 text-center">{message}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5" aria-label="Login Form">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            required
                            value={form.username}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-4 py-2 border ${errors.Username ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg shadow-sm focus:ring-accent focus:border-accent`}
                        />
                        {errors.Username && (
                            <p className="text-sm text-red-500 mt-1">{errors.Username}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            value={form.password}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-4 py-2 border ${errors.Password ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg shadow-sm focus:ring-accent focus:border-accent`}
                        />
                        {errors.Password && (
                            <p className="text-sm text-red-500 mt-1">{errors.Password}</p>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full bg-accent text-white py-2 rounded-lg font-medium hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 transition"
                        >
                            Login
                        </button>
                    </div>

                    <div className="text-right">
                        <a href="#" className="text-sm text-accent hover:underline">
                            Forgot Password?
                        </a>
                    </div>
                </form>

                <p className="text-sm text-center text-gray-600">
                    Don't have an account?
                    <a href="#" className="text-accent font-medium hover:underline"> Sign up</a>
                </p>
            </main>
        </div>
    );
};

export default Login;
