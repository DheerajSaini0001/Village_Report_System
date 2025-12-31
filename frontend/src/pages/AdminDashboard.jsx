import { useEffect, useState } from 'react';
import api from '../api/api';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

export default function AdminDashboard() {
    const { theme } = useTheme();
    const darkmode = theme === 'dark';

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const { data } = await api.get('/complaints');
            setComplaints(data);
        } catch (error) {
            console.error("Failed to fetch complaints", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.put(`/complaints/${id}`, { status: newStatus });
            setComplaints(prev =>
                prev.map(c => c._id === id ? { ...c, status: newStatus } : c)
            );
            toast.success(`Status updated to ${newStatus}`);
        } catch {
            toast.error("Failed to update status");
        }
    };

    const handleApprovalToggle = async (id, currentStatus) => {
        try {
            await api.put(`/complaints/${id}`, { isApproved: !currentStatus });
            setComplaints(prev =>
                prev.map(c => c._id === id ? { ...c, isApproved: !currentStatus } : c)
            );
            toast.success(currentStatus ? 'Removed from Feed' : 'Added to Feed');
        } catch {
            toast.error("Failed to update feed visibility");
        }
    };

    const openGoogleMaps = (lat, lng) => {
        window.open(
            `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
            '_blank'
        );
    };

    const filteredComplaints =
        filter === 'All'
            ? complaints
            : complaints.filter(c => c.status === filter);

    if (loading) {
        return (
            <div className={`p-8 text-center ${darkmode ? "text-gray-400" : "text-gray-600"}`}>
                Loading...
            </div>
        );
    }

    return (
        <div className={`min-h-screen pt-30 transition-colors duration-300 py-8 ${darkmode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
            <div className="max-w-7xl mx-auto px-4">

                {/* TITLE */}
                <h1 className="text-3xl font-bold mb-8">
                    Admin Dashboard
                </h1>

                {/* FILTER */}
                <div className="mb-6">
                    <label className="mr-2 font-medium">
                        Filter by Status:
                    </label>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className={`rounded-md border px-2 py-1
                        ${darkmode
                                ? "bg-gray-800 text-white border-gray-600"
                                : "bg-white text-gray-900 border-gray-300"}`}
                    >
                        <option>All</option>
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                    </select>
                </div>

                {/* TABLE */}
                <div className="overflow-hidden rounded-lg shadow">
                    <table className="min-w-full">
                        <thead className={`${darkmode ? "bg-gray-800" : "bg-gray-300"}`}>
                            <tr>
                                {["Details", "Category", "Reporter", "Status", "Feed", "Action"].map(h => (
                                    <th
                                        key={h}
                                        className="px-4 py-3 text-left text-sm font-semibold"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className={`${darkmode ? "bg-gray-900" : "bg-white"}`}>
                            {filteredComplaints.map((complaint) => (
                                <tr
                                    key={complaint._id}
                                    className={`border-t ${darkmode ? "border-gray-700" : "border-gray-200"}`}
                                >
                                    {/* DETAILS */}
                                    <td className="px-4 py-4 text-sm">
                                        <div className="flex gap-4">
                                            <img
                                                src={complaint.image}
                                                alt=""
                                                className="h-20 w-20 rounded object-cover"
                                            />
                                            <div>
                                                <p className="font-medium">
                                                    {complaint.description.slice(0, 50)}...
                                                </p>
                                                <button
                                                    onClick={() =>
                                                        openGoogleMaps(
                                                            complaint.location.latitude,
                                                            complaint.location.longitude
                                                        )
                                                    }
                                                    className="text-blue-500 text-xs mt-1"
                                                >
                                                    View Location
                                                </button>
                                            </div>
                                        </div>
                                    </td>

                                    {/* CATEGORY */}
                                    <td className="px-4 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs
                                        ${darkmode ? "bg-gray-700" : "bg-gray-200"}`}>
                                            {complaint.category}
                                        </span>
                                    </td>

                                    {/* REPORTER */}
                                    <td className="px-4 py-4 text-sm">
                                        <div>{complaint.user?.name || "Unknown"}</div>
                                        <div className="text-xs text-gray-400">
                                            {complaint.user?.mobile || "No Mobile"}
                                        </div>
                                    </td>

                                    {/* STATUS */}
                                    <td className="px-4 py-4 text-sm">
                                        <select
                                            value={complaint.status}
                                            onChange={(e) =>
                                                handleStatusChange(complaint._id, e.target.value)
                                            }
                                            className={`rounded-full px-2 py-1 text-xs
                                            ${darkmode ? "bg-gray-800 text-white" : "bg-gray-200"}`}
                                        >
                                            <option>Pending</option>
                                            <option>In Progress</option>
                                            <option>Resolved</option>
                                        </select>
                                    </td>

                                    {/* FEED */}
                                    <td className="px-4 py-4 text-sm">
                                        <button
                                            onClick={() =>
                                                handleApprovalToggle(
                                                    complaint._id,
                                                    complaint.isApproved
                                                )
                                            }
                                            className={`px-3 py-1 rounded-full text-xs
                                            ${complaint.isApproved
                                                    ? "bg-green-600 text-white"
                                                    : darkmode
                                                        ? "bg-gray-700 text-white"
                                                        : "bg-gray-300 text-gray-900"}`}
                                        >
                                            {complaint.isApproved ? "Shown" : "Hidden"}
                                        </button>
                                    </td>

                                    {/* ACTION */}
                                    <td className="px-4 py-4 text-sm">
                                        <form
                                            onSubmit={async (e) => {
                                                e.preventDefault();
                                                const input = e.target.comment;
                                                await api.put(`/complaints/${complaint._id}`, {
                                                    adminComment: input.value
                                                });
                                                toast.success("Comment updated");
                                                fetchComplaints();
                                            }}
                                            className="flex gap-2"
                                        >
                                            <input
                                                name="comment"
                                                defaultValue={complaint.adminComment}
                                                placeholder="Comment..."
                                                className={`w-32 px-2 py-1 text-xs rounded border
                                                ${darkmode
                                                        ? "bg-gray-800 text-white border-gray-600"
                                                        : "bg-white border-gray-300"}`}
                                            />
                                            <button className="text-blue-500 text-xs">
                                                Save
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
