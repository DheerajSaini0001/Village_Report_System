import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
    const themeContext = useTheme();

    // ✅ Supports BOTH theme systems
    const isDark = themeContext.darkmode ?? themeContext.theme === "dark";

    const [loginMethod, setLoginMethod] = useState('otp');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/users/login-otp', { email });
            setOtpSent(true);
            toast.success("OTP sent to your email!");
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/users/verify-otp', { email, otp });
            login(data.token, data);
            toast.success("Login successful!");
            navigate(data.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/users/login', { email, password });
            login(data.token, data);
            toast.success("Login successful!");
            navigate(data.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8
            ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
        >
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold tracking-tight">
                    Sign in to your account
                </h2>

                {/* LOGIN METHOD TOGGLE */}
                <div className="mt-4 flex justify-center space-x-4">
                    {["password", "otp"].map(method => (
                        <button
                            key={method}
                            onClick={() => {
                                setLoginMethod(method);
                                setOtpSent(false);
                            }}
                            className={`px-4 py-2 text-sm font-medium rounded-md
                            ${loginMethod === method
                                ? isDark
                                    ? "bg-blue-900/30 text-blue-300"
                                    : "bg-blue-100 text-blue-700"
                                : isDark
                                    ? "text-gray-400 hover:text-gray-200"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {method === "password" ? "Password" : "OTP (Email)"}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                {loginMethod === 'password' ? (
                    <form className="space-y-6" onSubmit={handlePasswordLogin}>
                        <div>
                            <label className="block text-sm font-medium">
                                Email address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`mt-2 block w-full rounded-md border px-3 py-2 text-sm
                                ${isDark
                                    ? "bg-gray-800 border-gray-600 text-white"
                                    : "bg-white border-gray-300 text-gray-900"
                                }`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`mt-2 block w-full rounded-md border px-3 py-2 text-sm
                                ${isDark
                                    ? "bg-gray-800 border-gray-600 text-white"
                                    : "bg-white border-gray-300 text-gray-900"
                                }`}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:bg-blue-400"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>
                ) : (
                    <form
                        className="space-y-6"
                        onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
                    >
                        <div>
                            <label className="block text-sm font-medium">
                                Email address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={otpSent}
                                className={`mt-2 block w-full rounded-md border px-3 py-2 text-sm
                                ${isDark
                                    ? "bg-gray-800 border-gray-600 text-white disabled:bg-gray-700"
                                    : "bg-white border-gray-300 text-gray-900 disabled:bg-gray-100"
                                }`}
                            />
                        </div>

                        {otpSent && (
                            <div>
                                <label className="block text-sm font-medium">
                                    Enter OTP
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className={`mt-2 block w-full rounded-md border px-3 py-2 text-sm
                                    ${isDark
                                        ? "bg-gray-800 border-gray-600 text-white"
                                        : "bg-white border-gray-300 text-gray-900"
                                    }`}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:bg-blue-400"
                        >
                            {otpSent
                                ? loading ? "Verifying..." : "Verify OTP & Login"
                                : loading ? "Sending OTP..." : "Send OTP"}
                        </button>

                        {otpSent && (
                            <button
                                type="button"
                                onClick={() => setOtpSent(false)}
                                className="w-full text-center text-sm text-blue-600 hover:text-blue-500"
                            >
                                Use a different email
                            </button>
                        )}
                    </form>
                )}

                <p className={`mt-10 text-center text-sm
                ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    Not a member?{' '}
                    <Link
                        to="/register"
                        className="font-semibold text-blue-600 hover:text-blue-500"
                    >
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}
