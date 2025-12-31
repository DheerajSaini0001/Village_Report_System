import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import toast from 'react-hot-toast';
import { Locate, Loader2 } from 'lucide-react';

export default function Register() {
    const [step, setStep] = useState(1); // 1: Email, 2: Details + OTP
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        mobile: '',
        address: ''
    });
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return;
        }

        setGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const locString = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
                setFormData(prev => ({ ...prev, address: locString }));
                toast.success('Location acquired!');
                setGettingLocation(false);
            },
            (error) => {
                console.error(error);
                let msg = 'Unable to retrieve location';
                if (error.code === 1) msg = 'Location permission denied. Please enable in browser settings.';
                else if (error.code === 2) msg = 'Location unavailable. Ensure GPS is on.';
                else if (error.code === 3) msg = 'Location request timed out.';

                toast.error(msg);
                setGettingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // First send all data to be saved + send OTP
            await api.post('/users/register-otp', formData);
            setStep(2); // Move to OTP verification step
            toast.success("Details saved. OTP sent to your email!");
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyRegisterOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Verify OTP and Create User
            const { data } = await api.post('/users/register-verify', {
                otp,
                ...formData
            });
            login(data.token, data);
            toast.success("Account verified! Welcome.");
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Create your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                {step === 1 ? (
                    <form className="space-y-6" onSubmit={handleRegister}>
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">Full Name</label>
                            <div className="mt-2">
                                <input name="name" type="text" required onChange={handleChange} className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                            <div className="mt-2">
                                <input name="email" type="email" required onChange={handleChange} className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">Mobile Number</label>
                            <div className="mt-2">
                                <input name="mobile" type="tel" required onChange={handleChange} className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">Address / Location</label>
                            <div className="mt-2 flex gap-2">
                                <input
                                    name="address"
                                    type="text"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                    placeholder="Enter address or pickup location"
                                />
                                <button
                                    type="button"
                                    onClick={handleGetLocation}
                                    disabled={gettingLocation}
                                    className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    title="Use Current Location"
                                >
                                    {gettingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <Locate className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                            <div className="mt-2">
                                <input name="password" type="password" required onChange={handleChange} className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-400"
                            >
                                {loading ? 'Saving & Sending OTP...' : 'Register'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form className="space-y-6" onSubmit={handleVerifyRegisterOtp}>
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                OTP sent to <strong>{formData.email}</strong>
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">Enter Verification OTP</label>
                            <div className="mt-2">
                                <input name="otp" type="text" placeholder="6-digit OTP" required value={otp} onChange={(e) => setOtp(e.target.value)} className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-400"
                            >
                                {loading ? 'Verifying...' : 'Verify & Complete Registration'}
                            </button>
                        </div>
                    </form>
                )}

                <p className="mt-10 text-center text-sm text-gray-500">
                    Already a member?{' '}
                    <Link to="/login" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
