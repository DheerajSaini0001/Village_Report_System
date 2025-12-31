import { useState, useEffect } from 'react';
import api from '../api/api';
import toast from 'react-hot-toast';
import { Loader2, MapPin, Calendar, Filter } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Feed() {
    const themeContext = useTheme();

    // ✅ Supports BOTH theme systems
    const isDark = themeContext.darkmode ?? themeContext.theme === "dark";

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", "Road", "Water", "Electricity", "Sanitation", "Other"];

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const { data } = await api.get('/complaints/feed');
                setComplaints(data);
            } catch (error) {
                console.error('Error fetching feed:', error);
                toast.error('Failed to load recent issues');
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, []);

    const filteredComplaints = selectedCategory === "All"
        ? complaints
        : complaints.filter(c => c.category === selectedCategory);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return isDark
                    ? 'bg-yellow-900/40 text-yellow-200 border border-yellow-700/50'
                    : 'bg-yellow-50 text-yellow-700 border border-yellow-200';
            case 'In Progress':
                return isDark
                    ? 'bg-blue-900/40 text-blue-200 border border-blue-700/50'
                    : 'bg-blue-50 text-blue-700 border border-blue-200';
            case 'Resolved':
                return isDark
                    ? 'bg-green-900/40 text-green-200 border border-green-700/50'
                    : 'bg-green-50 text-green-700 border border-green-200';
            default:
                return isDark
                    ? 'bg-gray-800 text-gray-300'
                    : 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div
                className={`flex justify-center items-center h-screen
                ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
            >
                <Loader2
                    className={`animate-spin h-8 w-8
                    ${isDark ? "text-blue-500" : "text-blue-600"}`}
                />
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen pt-20 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300
            ${isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}
        >
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Village{" "}
                        <span className={`bg-clip-text text-transparent bg-gradient-to-r ${isDark ? "from-blue-400 to-purple-400" : "from-blue-600 to-indigo-600"}`}>
                            Pulse
                        </span>
                    </h1>
                    <p
                        className={`max-w-2xl mx-auto text-lg leading-relaxed
                        ${isDark ? "text-gray-400" : "text-gray-600"}`}
                    >
                        Stay updated with the latest community reports and resolutions.
                        Transparency builds trust.
                    </p>
                </div>

                {/* FILTERS */}
                <div className="flex justify-center mb-10 overflow-x-auto pb-4 no-scrollbar">
                    <div className={`inline-flex rounded-xl p-1 shadow-sm border
                        ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                                ${selectedCategory === cat
                                        ? (isDark ? "bg-blue-600 text-white shadow-md" : "bg-blue-600 text-white shadow-md")
                                        : (isDark ? "text-gray-400 hover:text-white hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50")
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredComplaints.length === 0 ? (
                    <div
                        className={`max-w-md mx-auto text-center py-16 rounded-3xl border-2 border-dashed
                        ${isDark ? "border-gray-700 bg-gray-800/50" : "border-gray-300 bg-white"}`}
                    >
                        <Filter className={`h-12 w-12 mx-auto mb-4 ${isDark ? "text-gray-600" : "text-gray-400"}`} />
                        <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>No issues found</h3>
                        <p className={isDark ? "text-gray-400" : "text-gray-500"}>
                            Try selecting a different category or report a new issue.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {filteredComplaints.map((complaint) => (
                            <div
                                key={complaint._id}
                                className={`group relative flex flex-col rounded-3xl transition-all duration-300 hover:-translate-y-2
                                ${isDark
                                        ? "bg-gray-800 border border-gray-700 shadow-xl hover:shadow-2xl hover:shadow-blue-900/20"
                                        : "bg-white border border-gray-100 shadow-lg hover:shadow-xl hover:shadow-blue-200/50"
                                    }`}
                            >
                                {/* IMAGE CONTAINER */}
                                <div className="relative h-60 w-full overflow-hidden rounded-t-3xl">
                                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                                    <img
                                        src={complaint.image}
                                        alt={complaint.category}
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-80" />

                                    {/* Status Badge */}
                                    <div className="absolute top-4 right-4">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-md
                                            ${getStatusColor(complaint.status)}`}
                                        >
                                            {complaint.status}
                                        </span>
                                    </div>

                                    {/* Category Badge */}
                                    <div className="absolute bottom-4 left-4">
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold shadow-sm">
                                            {complaint.category}
                                        </span>
                                    </div>
                                </div>

                                {/* CARD CONTENT */}
                                <div className="flex flex-1 flex-col p-6">
                                    <div className="flex-1">
                                        <h3 className={`text-xl font-bold mb-3 line-clamp-2 leading-snug
                                            ${isDark ? "text-white group-hover:text-blue-400" : "text-gray-900 group-hover:text-blue-600"}
                                            transition-colors duration-200`}>
                                            {complaint.description}
                                        </h3>

                                        <div className={`flex items-center gap-2 text-sm mb-6
                                            ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                            <MapPin className="h-4 w-4 flex-shrink-0 text-blue-500" />
                                            <span className="truncate">{complaint.address || 'Location unavailable'}</span>
                                        </div>
                                    </div>

                                    {/* CARD FOOTER */}
                                    <div className={`pt-4 mt-auto border-t flex justify-between items-center text-xs font-medium uppercase tracking-wide
                                        ${isDark ? "border-gray-700 text-gray-500" : "border-gray-100 text-gray-400"}`}>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span>Reported</span>
                                        </div>
                                        <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                                            {new Date(complaint.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
