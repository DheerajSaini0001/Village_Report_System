import { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { Plus, Calendar } from 'lucide-react';

export default function Dashboard() {
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-green-100 text-green-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        My Complaints
                    </h2>
                </div>
                <div className="mt-4 flex md:ml-4 md:mt-0">
                    <Link
                        to="/report"
                        className="ml-3 inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                        Report New Issue
                    </Link>
                </div>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {complaints.map((complaint) => (
                    <div key={complaint._id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                        <div className="h-48 w-full bg-gray-200 relative">
                            <img src={complaint.image} alt={complaint.category} className="h-full w-full object-cover" />
                            <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                                {complaint.status}
                            </span>
                        </div>
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">{complaint.category}</h3>
                            <p className="mt-2 max-w-xl text-sm text-gray-500">
                                {complaint.description}
                            </p>
                            <div className="mt-4 flex items-center text-sm text-gray-500 gap-4">
                                <div className="flex items-center">
                                    <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                                    {new Date(complaint.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            {complaint.adminComment && (
                                <div className="mt-4 bg-gray-50 p-3 rounded-md">
                                    <p className="text-sm font-medium text-gray-900">Admin Response:</p>
                                    <p className="text-sm text-gray-600">{complaint.adminComment}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {complaints.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No complaints found. Start by reporting an issue!
                    </div>
                )}
            </div>
        </div>
    );
}
