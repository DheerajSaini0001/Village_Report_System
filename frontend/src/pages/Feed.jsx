import { useState, useEffect } from 'react';
import api from '../api/api';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function Feed() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Resolved': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-2">
                    Village <span className="text-blue-600">Pulse</span>
                </h1>
                <p className="max-w-2xl mx-auto text-lg text-gray-600">
                    Stay updated with the latest community reports and resolutions.
                </p>
            </div>

            {complaints.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow">
                    <p className="text-gray-500">No recent issues reported.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {complaints.map((complaint) => (
                        <div key={complaint._id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
                            <div className="relative h-56 w-full overflow-hidden bg-gray-200">
                                <img
                                    src={complaint.image}
                                    alt={complaint.category}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                                    <span className={`text-xs font-bold uppercase tracking-wider ${complaint.status === 'Resolved' ? 'text-green-600' :
                                            complaint.status === 'In Progress' ? 'text-blue-600' : 'text-yellow-600'
                                        }`}>
                                        {complaint.status}
                                    </span>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                    <span className="inline-block px-2 py-1 rounded bg-white/20 backdrop-blur-md text-white text-xs font-medium border border-white/30">
                                        {complaint.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                    {complaint.description}
                                </h3>
                                <div className="flex items-center text-sm text-gray-500 mb-4">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        {complaint.address || 'Unknown Location'}
                                    </span>
                                </div>
                                <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-xs text-gray-400 font-medium uppercase tracking-wide">
                                    <span>REPORTED</span>
                                    <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
