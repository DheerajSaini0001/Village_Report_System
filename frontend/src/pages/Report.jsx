import { useState, useRef } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import { Upload, Loader2, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Report() {
    const [category, setCategory] = useState('Road');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState(''); // Changed to string for manual input
    const [locationStatus, setLocationStatus] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    const startCamera = async () => {
        setIsCameraOpen(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            toast.error("Could not access camera");
            setIsCameraOpen(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            const video = videoRef.current;

            // Set canvas size to match video dimension
            canvasRef.current.width = video.videoWidth;
            canvasRef.current.height = video.videoHeight;

            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

            canvasRef.current.toBlob((blob) => {
                const file = new File([blob], "captured-photo.jpg", { type: "image/jpeg" });
                setImage(file);
                stopCamera();
                toast.success("Photo captured!");
            }, 'image/jpeg');
        }
    };

    // GPS Location logic removed as per request

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!location.trim()) {
            toast.error("Please enter the location.");
            return;
        }

        if (!image) {
            toast.error("Please upload an image.");
            return;
        }

        try {
            setSubmitting(true);
            const token = localStorage.getItem('token');

            // 1. Get Upload Signature
            const sigResponse = await fetch('http://localhost:201/api/complaints/upload-signature', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const sigData = await sigResponse.json();
            if (!sigResponse.ok) throw new Error(sigData.message || 'Could not get upload credentials');

            const { signature, timestamp, cloudName, apiKey } = sigData;

            // 2. Upload to Cloudinary
            const uploadData = new FormData();
            uploadData.append('file', image);
            uploadData.append('api_key', apiKey);
            uploadData.append('timestamp', timestamp);
            uploadData.append('signature', signature);
            uploadData.append('folder', 'village_reports');

            const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: uploadData
            });
            const cloudinaryData = await cloudinaryRes.json();
            if (!cloudinaryRes.ok) throw new Error(cloudinaryData.error?.message || 'Image upload failed');

            const imageUrl = cloudinaryData.secure_url;

            // 3. Submit Complaint with Image URL
            const finalData = {
                category,
                description,
                address: location,
                latitude: 0,
                longitude: 0,
                image: imageUrl
            };

            const response = await fetch('http://localhost:201/api/complaints', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(finalData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit report');
            }

            toast.success("Complaint submitted successfully!");
            navigate('/dashboard');
        } catch (error) {
            console.error("Error submitting report", error);
            toast.error(error.message || "Failed to submit report. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Report an Issue</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-gray-900 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    >
                        <option>Road</option>
                        <option>Water</option>
                        <option>Electricity</option>
                        <option>Sanitation</option>
                        <option>Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        rows={4}
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Image Proof</label>
                    <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                        <div className="space-y-4 text-center w-full">
                            {!isCameraOpen ? (
                                <div className="flex justify-center gap-6">
                                    <div className="text-center">
                                        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-2">
                                            <Upload className="h-6 w-6" />
                                        </div>
                                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none hover:text-blue-500">
                                            <span>Upload File</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} accept="image/*" />
                                        </label>
                                    </div>
                                    <div className="border-l border-gray-200"></div>
                                    <div className="text-center">
                                        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-2">
                                            <Camera className="h-6 w-6" />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={startCamera}
                                            className="font-medium text-blue-600 hover:text-blue-500"
                                        >
                                            Take Photo
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative">
                                    <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover rounded-lg bg-black"></video>
                                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                                        <button
                                            type="button"
                                            onClick={capturePhoto}
                                            className="bg-white rounded-full p-4 shadow-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="h-4 w-4 rounded-full bg-red-600 border border-white ring-2 ring-red-600"></div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={stopCamera}
                                            className="bg-gray-800/80 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            <canvas ref={canvasRef} className="hidden"></canvas>

                            <div className="text-xs text-center text-gray-500">
                                {image ? (
                                    <p className="text-sm text-green-600 font-medium">
                                        Selected: {image.name}
                                        <button type="button" onClick={() => setImage(null)} className="ml-2 text-red-500 underline">Remove</button>
                                    </p>
                                ) : (
                                    'PNG, JPG, GIF up to 10MB'
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                        type="text"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter the location (e.g. Main Street, Near School)"
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                            Submitting...
                        </>
                    ) : (
                        'Submit Complaint'
                    )}
                </button>
            </form>
        </div>
    );
}
