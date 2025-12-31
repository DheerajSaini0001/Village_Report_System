import { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { Plus, Calendar } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Dashboard() {
    const themeContext = useTheme();
    const isDark = themeContext.darkmode ?? themeContext.theme === "dark";

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const { data } = await api.get('/complaints/my');
                setComplaints(data);
            } catch (error) {
                console.error("Failed to fetch complaints", error);
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Resolved':
                return isDark
                    ? 'bg-green-900/40 text-green-300'
                    : 'bg-green-100 text-green-800';
            case 'In Progress':
                return isDark
                    ? 'bg-blue-900/40 text-blue-300'
                    : 'bg-blue-100 text-blue-800';
            default:
                return isDark
                    ? 'bg-yellow-900/40 text-yellow-300'
                    : 'bg-yellow-100 text-yellow-800';
        }
    };

    if (loading) {
        return (
            <div
                className={`pt-20 min-h-screen flex items-center justify-center
                ${isDark ? "bg-gray-900 text-gray-400" : "bg-gray-50 text-gray-500"}`}
            >
                Loading your complaints…
            </div>
        );
    }

    return (
        <div
            className={`pt-20 min-h-screen
            ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* HEADER */}
                <div
                    className={`rounded-2xl p-6 mb-10
                    ${isDark
                        ? "bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700"
                        : "bg-gradient-to-r from-blue-50 to-white border border-gray-200"
                    }`}
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tight">
                                My Complaints
                            </h2>
                            <p className={`mt-1 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                Track the progress of issues you’ve reported
                            </p>
                        </div>

                        <Link
                            to="/report"
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5
                            text-sm font-semibold text-white hover:bg-blue-700 transition shadow-lg"
                        >
                            <Plus className="h-5 w-5" />
                            Report New Issue
                        </Link>
                    </div>
                </div>

                {/* GRID */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {complaints.map((complaint) => (
                        <div
                            key={complaint._id}
                            className={`group rounded-2xl overflow-hidden transition-all duration-300
                            hover:-translate-y-1 hover:shadow-2xl
                            ${isDark
                                ? "bg-gray-800/80 border border-gray-700 hover:shadow-black/40"
                                : "bg-white border border-gray-200 hover:shadow-gray-300/60"
                            }`}
                        >
                            {/* IMAGE */}
                            <div
                                className={`relative h-48
                                ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
                            >
                                <img
                                    src={complaint.image}
                                    alt={complaint.category}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />

                                <span
                                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur
                                    ${getStatusStyle(complaint.status)}`}
                                >
                                    {complaint.status}
                                </span>
                            </div>

                            {/* CONTENT */}
                            <div className="p-5">
                                <h3 className="text-lg font-semibold">
                                    {complaint.category}
                                </h3>

                                <p
                                    className={`mt-2 text-sm line-clamp-3
                                    ${isDark ? "text-gray-400" : "text-gray-600"}`}
                                >
                                    {complaint.description}
                                </p>

                                <div
                                    className={`mt-4 flex items-center text-xs
                                    ${isDark ? "text-gray-500" : "text-gray-400"}`}
                                >
                                    <Calendar className="h-4 w-4 mr-2" />
                                    {new Date(complaint.createdAt).toLocaleDateString()}
                                </div>

                                {complaint.adminComment && (
                                    <div
                                        className={`mt-4 rounded-xl p-3
                                        ${isDark
                                            ? "bg-gray-700/60 text-gray-300"
                                            : "bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        <p className="text-xs font-semibold uppercase mb-1">
                                            Admin Response
                                        </p>
                                        <p className="text-sm">
                                            {complaint.adminComment}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* EMPTY STATE */}
                    {complaints.length === 0 && (
                        <div
                            className={`col-span-full rounded-2xl py-20 text-center
                            ${isDark
                                ? "bg-gray-800 text-gray-400"
                                : "bg-white text-gray-500"
                            }`}
                        >
                            <p className="text-xl font-semibold mb-2">
                                No complaints yet
                            </p>
                            <p className="text-sm mb-6">
                                Start by reporting your first issue
                            </p>
                            <Link
                                to="/report"
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5
                                text-sm font-semibold text-white hover:bg-blue-700 transition"
                            >
                                <Plus className="h-5 w-5" />
                                Report Issue
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
