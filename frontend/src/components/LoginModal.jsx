import React, { useState } from 'react';
import { loginUser, registerUser } from '../api';

const LoginModal = ({ onClose, onLoginSuccess }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            let data;
            if (isLoginMode) {
                data = await loginUser({ email: formData.email, password: formData.password });
            } else {
                data = await registerUser(formData);
                alert("Registration successful! We've sent you a welcome email.");
            }

            // Save token and pass user back to App
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            onLoginSuccess(data.user);
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || "Authentication failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} aria-hidden="true"></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                            {isLoginMode ? 'Welcome Back' : 'Create an Account'}
                        </h3>
                        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">{error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLoginMode && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input
                                        type="text" name="name" required={!isLoginMode} value={formData.name} onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500" placeholder="Jane Doe"
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    type="email" name="email" required value={formData.email} onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500" placeholder="jane@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password" name="password" required value={formData.password} onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500" placeholder="••••••••"
                                />
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md font-bold shadow-md transition-colors mt-4">
                                {loading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Register')}
                            </button>
                        </form>

                        <div className="mt-4 text-center text-sm text-gray-600">
                            {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                            <button type="button" onClick={() => setIsLoginMode(!isLoginMode)} className="text-indigo-600 font-bold hover:underline focus:outline-none">
                                {isLoginMode ? 'Register here' : 'Sign in here'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
