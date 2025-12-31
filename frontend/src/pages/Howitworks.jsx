import { Link } from 'react-router-dom';
import { MessageSquareWarning, ShieldCheck, MapPin, CheckCircle, Upload, Bell } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function HowItWorks() {
    const themeContext = useTheme();
    const isDark = themeContext.darkmode ?? themeContext.theme === "dark";

    const steps = [
        {
            icon: Upload,
            title: "Report an Issue",
            description: "Submit a complaint with photo proof and location details in just a few clicks."
        },
        {
            icon: MapPin,
            title: "Auto Geo-Tagging",
            description: "Your location is automatically attached to help authorities identify the exact problem area."
        },
        {
            icon: ShieldCheck,
            title: "Admin Review",
            description: "Local authorities receive and review your complaint on their dashboard."
        },
        {
            icon: Bell,
            title: "Track Progress",
            description: "Monitor the status of your complaint from Pending to In Progress to Resolved."
        },
        {
            icon: CheckCircle,
            title: "Issue Resolved",
            description: "Receive updates and confirmation when your issue has been successfully resolved."
        }
    ];

    const features = [
        {
            title: "Easy Reporting",
            desc: "Report issues like road damage, water supply, or sanitation in seconds.",
            icon: MessageSquareWarning
        },
        {
            title: "Geo-Tagging",
            desc: "Automatically attach location data for accurate and faster resolution.",
            icon: MapPin
        },
        {
            title: "Admin Dashboard",
            desc: "Authorities track, update, and resolve complaints efficiently.",
            icon: ShieldCheck
        }
    ];

    return (
        <div
            className={`transition-colors duration-300
            ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
        >
            {/* HERO */}
            <section className="px-6 lg:px-8 py-20 text-center">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
                        How <span className="text-blue-600">Gram Samasya</span> Works
                    </h1>
                    <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        A simple, transparent platform connecting villagers with local authorities
                        to solve community issues efficiently.
                    </p>
                </div>
            </section>

            {/* STEPS */}
            <section className="max-w-5xl mx-auto px-6 lg:px-8 py-16">
                <div className="space-y-12">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`flex flex-col md:flex-row items-center gap-8
                            ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                        >
                            {/* Icon */}
                            <div
                                className={`flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center
                                ${isDark ? "bg-blue-900/40" : "bg-blue-100"}`}
                            >
                                <step.icon className={`h-10 w-10 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                                    <span className={`text-sm font-bold px-3 py-1 rounded-full
                                        ${isDark ? "bg-gray-800 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                                        Step {index + 1}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                                <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FEATURES */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                        Key Features
                    </h2>
                    <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        Everything you need to report and track community issues
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {features.map((item, i) => (
                        <div
                            key={i}
                            className={`rounded-2xl p-8 border transition-all duration-300
                            hover:-translate-y-1 hover:shadow-xl
                            ${isDark
                                    ? "bg-gray-800/80 border-gray-700 hover:shadow-black/40"
                                    : "bg-white border-gray-200 hover:shadow-gray-300/60"
                                }`}
                        >
                            <div
                                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl
                                ${isDark ? "bg-blue-900/40" : "bg-blue-100"}`}
                            >
                                <item.icon
                                    className={`h-6 w-6
                                    ${isDark ? "text-blue-400" : "text-blue-600"}`}
                                />
                            </div>

                            <h3 className="text-lg font-semibold mb-2">
                                {item.title}
                            </h3>

                            <p className={`text-sm leading-6
                                ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className={`py-20 ${isDark ? "bg-gray-800" : "bg-blue-50"}`}>
                <div className="max-w-3xl mx-auto text-center px-6">
                    <h2 className="text-3xl font-extrabold mb-4">
                        Ready to Make a Difference?
                    </h2>
                    <p className={`text-lg mb-8 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        Join thousands of villagers using Gram Samasya to build better communities.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            to="/register"
                            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold
                            hover:bg-blue-700 transition shadow-lg"
                        >
                            Get Started
                        </Link>
                        <Link
                            to="/feed"
                            className={`px-6 py-3 rounded-xl font-semibold border transition
                            ${isDark
                                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            View Feed
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
