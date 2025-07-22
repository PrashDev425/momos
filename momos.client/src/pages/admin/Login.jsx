import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import logo from '../../assets/Momo.svg';

const Login = () => {
    const navigate = useNavigate();
    const { setUser } = useUser();

    const [form, setForm] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const toCamelCase = (str) => str.charAt(0).toLowerCase() + str.slice(1);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
                body: formData,
                credentials: 'include'
            });

            let result = {};
            try {
                result = await response.json();
            } catch (err) {
                console.error("Invalid JSON:", err);
            }

            if (response.ok && result.status) {
                // Fetch user info
                const userRes = await fetch('/user', { credentials: 'include' });

                if (userRes.ok) {
                    const userInfo = await userRes.json();
                    setUser(userInfo);

                    if (userInfo.role === 'Admin') {
                        navigate('/admin/momo');
                    } else {
                        navigate('/');
                    }
                } else {
                    setMessage('Login succeeded, but failed to fetch user info.');
                }
            } else {
                // Handle validation errors
                if (result?.hasValidationErrors && result?.validationErrors) {
                    const fixedErrors = {};
                    for (const key in result.validationErrors) {
                        fixedErrors[toCamelCase(key)] = result.validationErrors[key];
                    }
                    setErrors(fixedErrors);
                } else {
                    setMessage(result?.message || `Request failed with status ${response.status}`);
                }
            }
        } catch (err) {
            console.error(err);
            setMessage('An unexpected error occurred.');
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
                    <h1 className="text-2xl font-semibold text-gray-800">Log in to your account</h1>
                </div>

                {message && <div className="text-sm text-red-600 text-center">{message}</div>}

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
                            className={`mt-1 block w-full px-4 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-accent focus:border-accent`}
                        />
                        {errors.username && errors.username.map((err, idx) => (
                            <p key={idx} className="text-sm text-red-500 mt-1">{err}</p>
                        ))}
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
                            className={`mt-1 block w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-accent focus:border-accent`}
                        />
                        {errors.password && errors.password.map((err, idx) => (
                            <p key={idx} className="text-sm text-red-500 mt-1">{err}</p>
                        ))}
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
