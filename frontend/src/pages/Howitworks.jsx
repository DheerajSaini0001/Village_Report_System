import { MessageSquareWarning, ShieldCheck, MapPin } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function HowItWorks() {
    const themeContext = useTheme();

    // ✅ Works with BOTH theme systems
    const isDark = themeContext.darkmode ?? themeContext.theme === "dark";

    return (
        <div
            className={`pt-20 transition-colors duration-300
            ${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
        >
            <section className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
                {/* HEADER */}
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                        How It Works
                    </h2>
                    <p className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
                        Everything you need to report issues
                    </p>
                </div>

                {/* CARDS */}
                <div className="mx-auto mt-20 grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {[
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
                    ].map((item, i) => (
                        <div
                            key={i}
                            className={`group rounded-2xl p-8 border transition-all duration-300
                            hover:-translate-y-1 hover:shadow-xl
                            ${isDark
                                ? "bg-gray-800/80 border-gray-700 hover:shadow-black/40"
                                : "bg-white border-gray-200 hover:shadow-gray-300/60"
                            }`}
                        >
                            {/* ICON */}
                            <div
                                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl
                                ${isDark ? "bg-blue-900/40" : "bg-blue-100"}`}
                            >
                                <item.icon
                                    className={`h-6 w-6
                                    ${isDark ? "text-blue-400" : "text-blue-600"}`}
                                />
                            </div>

                            {/* TITLE */}
                            <h3 className="text-lg font-semibold">
                                {item.title}
                            </h3>

                            {/* DESCRIPTION */}
                            <p
                                className={`mt-3 text-sm leading-6
                                ${isDark ? "text-gray-400" : "text-gray-600"}`}
                            >
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default HowItWorks;
