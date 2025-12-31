import { Link } from 'react-router-dom';
import {
    Facebook,
    Twitter,
    Instagram,
    MessageCircle,
    Mail,
    Phone,
    MapPin,
    ExternalLink
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
    const themeContext = useTheme();

    // ✅ Supports BOTH systems
    const isDark = themeContext.darkmode ?? themeContext.theme === "dark";

    return (
        <footer
            className={`pt-16 pb-8 transition-colors duration-300
            ${isDark ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* ABOUT */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">
                            Gram
                            <span className="text-blue-600">Samasya</span>
                        </h3>

                        <p className={`text-sm leading-relaxed mb-6
                        ${isDark ? "text-gray-400" : "text-gray-700"}`}>
                            A citizen-first platform to report local issues like road damage,
                            drainage problems, streetlight failures, and sanitation concerns.
                            Your voice matters — together we build a better community.
                        </p>

                        <div className="flex space-x-4">
                            {[Facebook, Twitter, Instagram, MessageCircle].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className={`${isDark
                                        ? "text-gray-400 hover:text-blue-400"
                                        : "text-gray-500 hover:text-blue-600"
                                        } transition-colors`}
                                >
                                    <Icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* QUICK LINKS */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 relative inline-block">
                            Quick Links
                            <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-blue-600"></span>
                        </h3>

                        <ul className="space-y-3 text-sm">
                            {[
                                { to: "/report", label: "Report an Issue" },
                                { to: "/dashboard", label: "Track Complaint" },
                                { to: "/feed", label: "All Issues" },
                                { to: "/how-it-works", label: "How It Works" }
                            ].map(link => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className={`flex items-center gap-2 transition-colors
                                        ${isDark
                                                ? "text-gray-400 hover:text-blue-400"
                                                : "text-gray-700 hover:text-blue-600"
                                            }`}
                                    >
                                        <ExternalLink className="h-3 w-3" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CATEGORIES */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 relative inline-block">
                            Categories
                            <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-blue-600"></span>
                        </h3>

                        <ul className="grid gap-2 text-sm">
                            {[
                                "Road Issues",
                                "Water Supply",
                                "Drainage",
                                "Street Lights",
                                "Cleanliness"
                            ].map(cat => (
                                <li
                                    key={cat}
                                    className={`flex items-center gap-2
                                    ${isDark ? "text-gray-400" : "text-gray-700"}`}
                                >
                                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                    {cat}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CONTACT */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 relative inline-block">
                            Contact Us
                            <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-blue-600"></span>
                        </h3>

                        <div className="space-y-4 text-sm">
                            <div className={`flex items-start gap-3
                            ${isDark ? "text-gray-400" : "text-gray-700"}`}>
                                <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                                <p>
                                    Village Panchayat Office,<br />
                                    District Center, State - 123456
                                </p>
                            </div>

                            <div className={`flex items-center gap-3
                            ${isDark ? "text-gray-400" : "text-gray-700"}`}>
                                <Mail className="h-5 w-5 text-blue-600" />
                                <a
                                    href="mailto:support@gramsamasya.in"
                                    className="hover:text-blue-600 transition-colors"
                                >
                                    support@gramsamasya.in
                                </a>
                            </div>

                            <div className={`flex items-center gap-3
                            ${isDark ? "text-gray-400" : "text-gray-700"}`}>
                                <Phone className="h-5 w-5 text-blue-600" />
                                <p>+91 98765 43210</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM */}
                <div
                    className={`border-t pt-8 mt-8 text-center md:flex md:justify-between md:items-center
                    ${isDark ? "border-gray-800" : "border-gray-200"}`}
                >
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} Gram Samasya. All Rights Reserved.
                    </p>
                    <p className="text-sm text-gray-500 mt-2 md:mt-0">
                        Developed for Community Welfare <span className="text-red-500">❤️</span>
                    </p>
                </div>

            </div>
        </footer>
    );
}
