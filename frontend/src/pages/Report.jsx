import { useState, useRef } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import { Upload, Loader2, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

export default function Report() {
    const themeContext = useTheme();

    // ✅ Supports BOTH theme systems
    const isDark = themeContext.darkmode ?? themeContext.theme === "dark";

    const [category, setCategory] = useState('Road');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    /* ---------------- CAMERA LOGIC ---------------- */

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
            toast.error("Could not access camera");
            setIsCameraOpen(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(t => t.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0);
        canvas.toBlob(blob => {
            setImage(new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' }));
            stopCamera();
            toast.success("Photo captured!");
        }, 'image/jpeg');
    };

    /* ---------------- SUBMIT LOGIC ---------------- */

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!location.trim()) return toast.error("Please enter the location");
        if (!image) return toast.error("Please upload an image");

        try {
            setSubmitting(true);
            const token = localStorage.getItem('token');

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:201/api';

            // 1️⃣ Signature
            const sigRes = await fetch(`${API_URL}/complaints/upload-signature`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const sig = await sigRes.json();
            if (!sigRes.ok) throw new Error(sig.message);

            // 2️⃣ Upload Image
            const formData = new FormData();
            formData.append('file', image);
            formData.append('api_key', sig.apiKey);
            formData.append('timestamp', sig.timestamp);
            formData.append('signature', sig.signature);
            formData.append('folder', 'village_reports');

            const uploadRes = await fetch(
                `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
                { method: 'POST', body: formData }
            );
            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) throw new Error(uploadData.error?.message);

            // 3️⃣ Submit Complaint
            await fetch(`${API_URL}/complaints`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    category,
                    description,
                    address: location,
                    latitude: 0,
                    longitude: 0,
                    image: uploadData.secure_url
                })
            });

            toast.success("Complaint submitted successfully!");
            navigate('/dashboard');

        } catch (err) {
            toast.error(err.message || "Submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    /* ---------------- UI ---------------- */

    return (
        <div
            className={`pt-20 min-h-screen
            ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
        >
            <div className="max-w-2xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-extrabold mb-8">
                    Report an Issue
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className={`space-y-6 p-6 rounded-2xl shadow-lg
                    ${isDark ? "bg-gray-800" : "bg-white"}`}
                >
                    {/* CATEGORY */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className={`w-full rounded-md px-3 py-2 border
                            ${isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                        >
                            <option>Road</option>
                            <option>Water</option>
                            <option>Electricity</option>
                            <option>Sanitation</option>
                            <option>Other</option>
                        </select>
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            rows={4}
                            required
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className={`w-full rounded-md px-3 py-2 border
                            ${isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                        />
                    </div>

                    {/* IMAGE */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Image Proof</label>

                        {!isCameraOpen ? (
                            <div className="flex justify-center gap-6 py-6 border-2 border-dashed rounded-lg">
                                <label className="cursor-pointer text-blue-600 flex flex-col items-center">
                                    <Upload />
                                    <span className="text-sm mt-1">Upload</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={e => setImage(e.target.files?.[0] || null)}
                                    />
                                </label>

                                <button type="button" onClick={startCamera} className="text-blue-600 flex flex-col items-center">
                                    <Camera />
                                    <span className="text-sm mt-1">Camera</span>
                                </button>
                            </div>
                        ) : (
                            <div className="relative">
                                <video ref={videoRef} autoPlay className="w-full h-64 rounded-lg bg-black" />
                                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-4">
                                    <button type="button" onClick={capturePhoto} className="bg-white p-3 rounded-full">
                                        <div className="h-4 w-4 bg-red-600 rounded-full" />
                                    </button>
                                    <button type="button" onClick={stopCamera} className="px-4 py-2 bg-black/70 text-white rounded-full">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {image && (
                            <p className="text-sm text-green-500 mt-2">
                                Selected: {image.name}
                            </p>
                        )}

                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    {/* LOCATION */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <input
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            placeholder="Near school, main road..."
                            className={`w-full rounded-md px-3 py-2 border
                            ${isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                        />
                    </div>

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
                    >
                        {submitting && <Loader2 className="animate-spin h-4 w-4" />}
                        Submit Complaint
                    </button>
                </form>
            </div>
        </div>
    );
}
