import { Link } from 'react-router-dom';
import { MessageSquareWarning, ShieldCheck, MapPin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Home() {
    const themeContext = useTheme();

    // ✅ Supports BOTH theme systems
    const isDark = themeContext.darkmode ?? themeContext.theme === "dark";

    return (
        <div
            className={`pt-20 transition-colors duration-300
            ${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
        >
            {/* HERO SECTION */}
            <section
                className={`relative isolate px-6 lg:px-8
                ${isDark
                        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
                        : "bg-gradient-to-br from-blue-50 via-white to-blue-100"
                    }`}
            >
                <div className="mx-auto max-w-2xl py-32 sm:py-40 lg:py-48 text-center">
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
                        Gram <span className="text-blue-600">Samasya</span>
                    </h1>

                    <p
                        className={`mt-6 text-lg leading-8
                        ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                        Empowering villagers to report issues directly to the administration.
                        Track progress, ensure transparency, and build a stronger community together.
                    </p>

                    <div className="mt-10 flex justify-center gap-x-6">
                        <Link
                            to="/feed"
                            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white
                            shadow-lg hover:bg-blue-700 transition"
                        >
                            Get Started
                        </Link>

                        <Link
                            to="/report"
                            className={`rounded-xl px-6 py-3 text-sm font-semibold border transition
                            ${isDark
                                    ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            Report Issue
                        </Link>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            
        </div>
    );
}
