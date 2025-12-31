import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import toast from 'react-hot-toast';
import { Locate, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Register() {
    const themeContext = useTheme();

    // ✅ Supports BOTH theme systems
    const isDark = themeContext.darkmode ?? themeContext.theme === "dark";

    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
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
                let msg = 'Unable to retrieve location';
                if (error.code === 1) msg = 'Location permission denied';
                else if (error.code === 2) msg = 'Location unavailable';
                else if (error.code === 3) msg = 'Location request timed out';
                toast.error(msg);
                setGettingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/users/register-otp', formData);
            setStep(2);
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
        <div
            className={`flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8
            ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
        >
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold tracking-tight">
                    Create your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                {step === 1 ? (
                    <form className="space-y-6" onSubmit={handleRegister}>
                        {[
                            { label: "Full Name", name: "name", type: "text" },
                            { label: "Email Address", name: "email", type: "email" },
                            { label: "Mobile Number", name: "mobile", type: "tel" }
                        ].map(field => (
                            <div key={field.name}>
                                <label className="block text-sm font-medium">
                                    {field.label}
                                </label>
                                <input
                                    name={field.name}
                                    type={field.type}
                                    required
                                    onChange={handleChange}
                                    className={`mt-2 block w-full rounded-md border px-3 py-2 text-sm
                                    ${isDark
                                        ? "bg-gray-800 border-gray-600 text-white"
                                        : "bg-white border-gray-300 text-gray-900"
                                    }`}
                                />
                            </div>
                        ))}

                        {/* ADDRESS */}
                        <div>
                            <label className="block text-sm font-medium">
                                Address / Location
                            </label>
                            <div className="mt-2 flex gap-2">
                                <input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className={`block w-full rounded-md border px-3 py-2 text-sm
                                    ${isDark
                                        ? "bg-gray-800 border-gray-600 text-white"
                                        : "bg-white border-gray-300 text-gray-900"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={handleGetLocation}
                                    disabled={gettingLocation}
                                    className={`px-3 py-2 rounded-md border
                                    ${isDark
                                        ? "border-blue-700 text-blue-300 bg-blue-900/30"
                                        : "border-blue-300 text-blue-700 bg-blue-50"
                                    }`}
                                >
                                    {gettingLocation
                                        ? <Loader2 className="h-4 w-4 animate-spin" />
                                        : <Locate className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="block text-sm font-medium">
                                Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                onChange={handleChange}
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
                            {loading ? "Saving & Sending OTP..." : "Register"}
                        </button>
                    </form>
                ) : (
                    <form className="space-y-6" onSubmit={handleVerifyRegisterOtp}>
                        <p className={`text-center text-sm
                        ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            OTP sent to <strong>{formData.email}</strong>
                        </p>

                        <div>
                            <label className="block text-sm font-medium">
                                Enter Verification OTP
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:bg-blue-400"
                        >
                            {loading ? "Verifying..." : "Verify & Complete Registration"}
                        </button>
                    </form>
                )}

                <p className={`mt-10 text-center text-sm
                ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    Already a member?{' '}
                    <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
