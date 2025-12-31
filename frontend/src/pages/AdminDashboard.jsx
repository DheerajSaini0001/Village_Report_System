import { useEffect, useState } from 'react';
import api from '../api/api';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
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
            setComplaints(complaints.map(c => c._id === id ? { ...c, status: newStatus } : c));
            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const openGoogleMaps = (lat, lng) => {
        window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
    };

    const filteredComplaints = filter === 'All'
        ? complaints
        : complaints.filter(c => c.status === filter);

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

            <div className="mb-6">
                <label className="mr-2 font-medium text-gray-700">Filter by Status:</label>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-1"
                >
                    <option>All</option>
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                </select>
            </div>

            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Details</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Reporter</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {filteredComplaints.map((complaint) => (
                            <tr key={complaint._id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 max-w-xs">
                                    <div className="flex items-center">
                                        <div className="h-20 w-20 flex-shrink-0">
                                            <img className="h-20 w-20 rounded-md object-cover" src={complaint.image} alt="" />
                                        </div>
                                        <div className="ml-4 truncate">
                                            <div className="font-medium text-gray-900 truncate" title={complaint.description}>{complaint.description.substring(0, 50)}...</div>
                                            <div className="text-gray-500 text-xs mt-1">
                                                <button
                                                    onClick={() => openGoogleMaps(complaint.location.latitude, complaint.location.longitude)}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    View Location
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800">
                                        {complaint.category}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    <div className="text-gray-900">{complaint.user?.name || 'Unknown'}</div>
                                    <div className="text-gray-500">{complaint.user?.mobile || 'No Mobile'}</div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    <select
                                        value={complaint.status}
                                        onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                                        className={`rounded-full px-2 py-1 text-xs font-semibold leading-5 border-0 cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                                                complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        const form = e.target;
                                        const input = form.elements.comment;
                                        await api.put(`/complaints/${complaint._id}`, { adminComment: input.value });
                                        toast.success('Comment updated');
                                        fetchComplaints(); // Refresh
                                    }} className="flex gap-2">
                                        <input
                                            name="comment"
                                            defaultValue={complaint.adminComment}
                                            placeholder="Add comment..."
                                            className="border rounded px-2 py-1 text-xs w-32"
                                        />
                                        <button type="submit" className="text-blue-600 hover:text-blue-900 text-xs">Save</button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
