import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Activity, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const { user, logout } = useAuth();
    const themeContext = useTheme();
    const isDark = themeContext.darkmode ?? themeContext.theme === "dark";

    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const NavLink = ({ to, children }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 group
                ${isActive
                        ? (isDark ? "text-blue-400" : "text-blue-600")
                        : (isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900")
                    }`}
            >
                {children}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform origin-left transition-transform duration-300 ease-out
                    ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                />
            </Link>
        );
    };

    return (
        <nav
            className={`fixed w-full top-0 z-50 transition-all duration-300 border-b
            ${scrolled
                    ? (isDark ? "bg-gray-900/90 border-gray-800 backdrop-blur-md shadow-lg" : "bg-white/90 border-gray-200 backdrop-blur-md shadow-md")
                    : (isDark ? "bg-gray-900/0 border-transparent" : "bg-white/0 border-transparent") // Transparent at top
                }
            ${!scrolled && (isDark ? "bg-gray-900" : "bg-white")} // Fallback if not absolute top but need bg
            `}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">

                    {/* LOGO */}
                    <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className={`p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg`}>
                            <Activity className="h-6 w-6" />
                        </div>
                        <span className={`text-2xl font-extrabold tracking-tight
                            ${isDark ? "text-white" : "text-gray-900"}`}>
                            Gram<span className="text-blue-600">Samasya</span>
                        </span>
                    </div>

                    {/* DESKTOP MENU */}
                    <div className="hidden md:flex items-center space-x-6">
                        {user ? (
                            <>
                                <NavLink to="/feed">Feed</NavLink>
                                <NavLink to={user.role === 'admin' ? '/admin' : '/dashboard'}>Dashboard</NavLink>

                                <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2" />

                                <div className="flex items-center gap-4">
                                    <ThemeToggle />
                                    <button
                                        onClick={handleLogout}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border
                                        ${isDark
                                                ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                                                : "border-red-200 text-red-600 hover:bg-red-50"}`}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login">Login</NavLink>
                                <Link
                                    to="/register"
                                    className="px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all duration-300 shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                >
                                    Get Started
                                </Link>
                                <div className="ml-2">
                                    <ThemeToggle />
                                </div>
                            </>
                        )}
                    </div>

                    {/* MOBILE TOGGLE */}
                    <div className="flex items-center gap-4 md:hidden">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-2 rounded-lg transition-colors
                            ${isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}`}
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE MENU */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
                ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                ${isDark ? "bg-gray-900 border-b border-gray-800" : "bg-white border-b border-gray-200"}`}>

                <div className="px-4 pt-2 pb-6 space-y-2">
                    {user ? (
                        <>
                            <Link to="/feed" className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors
                                ${isDark ? "text-gray-300 hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                                Community Feed
                            </Link>
                            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}
                                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors
                                ${isDark ? "text-gray-300 hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                                Dashboard
                            </Link>
                            <button onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-4 py-3 mt-4 rounded-lg text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                <LogOut className="h-5 w-5" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors
                                ${isDark ? "text-gray-300 hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                                Sign In
                            </Link>
                            <Link to="/register" className="block w-full text-center px-4 py-3 mt-2 rounded-lg text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md">
                                Join Now
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
