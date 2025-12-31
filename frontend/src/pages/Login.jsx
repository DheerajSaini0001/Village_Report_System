import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import toast from 'react-hot-toast';

export default function Login() {
    const [loginMethod, setLoginMethod] = useState('otp'); // 'password' or 'otp'
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
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
                <div className="mt-4 flex justify-center space-x-4">
                    <button
                        onClick={() => { setLoginMethod('password'); setOtpSent(false); }}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${loginMethod === 'password' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Password
                    </button>
                    <button
                        onClick={() => { setLoginMethod('otp'); setOtpSent(false); }}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${loginMethod === 'otp' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        OTP (Email)
                    </button>
                </div>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                {loginMethod === 'password' ? (
                    <form className="space-y-6" onSubmit={handlePasswordLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form className="space-y-6" onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={otpSent} className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm disabled:bg-gray-100" />
                            </div>
                        </div>

                        {otpSent && (
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium leading-6 text-gray-900">
                                    Enter OTP
                                </label>
                                <div className="mt-2">
                                    <input id="otp" type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" placeholder="6-digit OTP" />
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed"
                            >
                                {otpSent ? (loading ? 'Verifying...' : 'Verify OTP & Login') : (loading ? 'Sending OTP...' : 'Send OTP')}
                            </button>
                            {otpSent && (
                                <button type="button" onClick={() => setOtpSent(false)} className="mt-2 w-full text-center text-sm text-blue-600 hover:text-blue-500">
                                    Use a different email
                                </button>
                            )}
                        </div>
                    </form>
                )}

                <p className="mt-10 text-center text-sm text-gray-500">
                    Not a member?{' '}
                    <Link to="/register" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}
