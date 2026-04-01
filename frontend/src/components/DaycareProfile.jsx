import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchDaycareById, submitInquiry } from '../api';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import ReviewsSection from './ReviewsSection';

import { realisticDaycareImages } from '../imageBank';

const DaycareProfile = ({ favorites, onToggleFavorite, user, setShowLogin }) => {
    const { id } = useParams();
    const daycareId = parseInt(id);
    const [daycare, setDaycare] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const { addDaycare } = useRecentlyViewed();

    // Form state
    const [formData, setFormData] = useState({
        parent_name: user?.name || '',
        parent_email: user?.email || '',
        child_age: '',
        message: ''
    });
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await fetchDaycareById(id);
                // In case the API returns nested data format { data: {} }
                const fetchedDaycare = data.data ? data.data : data;
                setDaycare(fetchedDaycare);
                addDaycare(fetchedDaycare);
            } catch (err) {
                setError(err.message || "Failed to load daycare profile.");
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, [id]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (loading) return <div className="text-center py-20 text-indigo-600 font-semibold animate-pulse">Loading Profile...</div>;
    if (error) return <div className="text-center py-20 text-red-600 bg-red-50 rounded-lg">{error}</div>;
    if (!daycare) return <div className="text-center py-20">Daycare not found.</div>;

    // Generate mock carousel images based on primary image
    const heroImage = realisticDaycareImages[daycare.id % realisticDaycareImages.length];
    // Using ultra realistic gallery images to avoid generic stock look
    const galleryImages = [
        realisticDaycareImages[(daycare.id + 1) % realisticDaycareImages.length],
        realisticDaycareImages[(daycare.id + 2) % realisticDaycareImages.length],
        realisticDaycareImages[(daycare.id + 3) % realisticDaycareImages.length],
    ];

    const isFavorite = favorites?.some(f => f.id === daycareId) || false;

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmitInquiry = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            await submitInquiry({
                ...formData,
                daycare_id: daycare.id,
                daycare_name: daycare.name
            });
            setShowModal(false);
            setFormData({
                parent_name: user?.name || '',
                parent_email: user?.email || '',
                child_age: '',
                message: ''
            });
            alert('Inquiry sent successfully! Please check your email.');
        } catch (err) {
            console.error(err);
            alert('Failed to send inquiry. Please try again later.');
        } finally {
            setSubmitLoading(false);
        }
    };

    // --- Phase 14: Time-Based Contact Validation ---
    const checkOperatingHours = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const timeInMinutes = hours * 60 + minutes;

        // 7:30 AM = 7 * 60 + 30 = 450 minutes
        // 7:00 PM = 19 * 60 = 1140 minutes
        return timeInMinutes >= 450 && timeInMinutes <= 1140;
    };

    const isCallAvailable = checkOperatingHours();

    // --- Phase 14: WhatsApp Linking ---
    // Note for Demo: Temporarily hardcode your real phone number here to demonstrate WA messaging!
    const waNumber = "919008052674";
    const waMessage = encodeURIComponent(`Hi, I found ${daycare.name} on Daycare Discovery and I have an inquiry.`);
    const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

    return (
        <div className="max-w-6xl mx-auto py-8">
            {/* Back Nav */}
            <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Search Results
            </Link>

            {/* Header & Hero grid */}
            <div className="mb-8">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center">
                            {daycare.name}
                            {daycare.is_verified && (
                                <button
                                    onClick={() => setShowVerificationModal(true)}
                                    className="ml-4 bg-green-500 hover:bg-green-600 transition-colors text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm align-middle flex items-center"
                                >
                                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                    Verified
                                </button>
                            )}
                        </h1>
                        <div className="mt-2 flex items-center text-lg text-gray-600">
                            <span className="text-yellow-500 font-bold mr-1">{Number(daycare.overall_rating).toFixed(1)}</span>
                            <span className="text-yellow-500 mr-2">★</span>
                            <span>({daycare.review_count} reviews)</span>
                            <span className="mx-3 text-gray-300">|</span>
                            <span>Bengaluru</span>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <button onClick={(e) => onToggleFavorite(e, daycareId)} className={`bg-white border text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium shadow-sm transition-colors flex items-center ${isFavorite ? 'border-red-300 text-red-600' : 'border-gray-300'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-1.5 ${isFavorite ? 'text-red-500' : 'text-gray-400'}`} viewBox="0 0 20 20" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isFavorite ? "0" : "2"}>
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            {isFavorite ? 'Saved' : 'Save'}
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/40 hover:-translate-y-0.5 px-8 py-2.5 rounded-lg font-bold shadow-lg transition-all duration-300"
                        >
                            Book Inquiry
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 h-96 rounded-xl overflow-hidden">
                    <div className="md:col-span-2 md:row-span-2 h-full">
                        <img src={heroImage} alt={`${daycare.name} main facility`} className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" />
                    </div>
                    <div className="md:col-span-1 md:row-span-1 h-full hidden md:block">
                        <img src={galleryImages[0]} alt="Activity area" className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" />
                    </div>
                    <div className="md:col-span-1 md:row-span-1 h-full hidden md:block">
                        <img src={galleryImages[1]} alt="Playground" className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" />
                    </div>
                    <div className="md:col-span-2 md:row-span-1 h-full hidden md:block">
                        <img src={galleryImages[2]} alt="Classroom" className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Details */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-5 tracking-tight">About this facility</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            Welcome to {daycare.name}, a premier childcare facility dedicated to fostering early childhood development in a safe, nurturing, and highly verified environment. We believe in play-based learning and cognitive growth tailored to the specific needs of different age groups.
                        </p>
                    </section>

                    <section className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 mt-8 mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4 tracking-tight">Facility Features & Safety</h2>

                        <div className="space-y-8">
                            {/* Safety Category */}
                            <div>
                                <h3 className="text-lg font-bold text-indigo-700 mb-4 flex items-center">
                                    <span className="bg-indigo-100 p-1.5 rounded mr-2 text-xl">🛡️</span> Safety & Security
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <span className="text-indigo-500 mr-3 text-xl">📹</span>
                                        <span className="font-medium">24/7 CCTV Monitoring</span>
                                    </div>
                                    <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <span className="text-indigo-500 mr-3 text-xl">🚪</span>
                                        <span className="font-medium">Secure Access Controls</span>
                                    </div>
                                    <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <span className="text-indigo-500 mr-3 text-xl">👨‍✈️</span>
                                        <span className="font-medium">On-site Security Guard</span>
                                    </div>
                                    <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <span className="text-indigo-500 mr-3 text-xl">🔥</span>
                                        <span className="font-medium">Fire Safety Compliant</span>
                                    </div>
                                </div>
                            </div>

                            {/* Health & Meals Category */}
                            <div>
                                <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center">
                                    <span className="bg-green-100 p-1.5 rounded mr-2 text-xl">🩺</span> Health & Meals
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <span className="text-green-500 mr-3 text-xl">🍎</span>
                                        <span className="font-medium">Nutritious Hot Meals</span>
                                    </div>
                                    <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <span className="text-green-500 mr-3 text-xl">🥦</span>
                                        <span className="font-medium">Veg & Non-Veg Options</span>
                                    </div>
                                    <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <span className="text-green-500 mr-3 text-xl">⚕️</span>
                                        <span className="font-medium">First-Aid Certified Staff</span>
                                    </div>
                                    <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <span className="text-green-500 mr-3 text-xl">🛏️</span>
                                        <span className="font-medium">Dedicated Sick Bay</span>
                                    </div>
                                </div>
                            </div>

                            {/* Comfort Category */}
                            <div>
                                <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center">
                                    <span className="bg-blue-100 p-1.5 rounded mr-2 text-xl">✨</span> Comfort & Play
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <span className="text-blue-500 mr-3 text-xl">❄️</span>
                                        <span className="font-medium">Air Conditioned Rooms</span>
                                    </div>
                                    <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <span className="text-blue-500 mr-3 text-xl">🧸</span>
                                        <span className="font-medium">Soft Play Area</span>
                                    </div>
                                    <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <span className="text-blue-500 mr-3 text-xl">📚</span>
                                        <span className="font-medium">Early Reading Library</span>
                                    </div>
                                    <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <span className="text-blue-500 mr-3 text-xl">🎨</span>
                                        <span className="font-medium">Art & Crafts Studio</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Phase 13: Reviews UI */}
                    <ReviewsSection
                        reviewCount={daycare.review_count}
                        overallRating={daycare.overall_rating}
                        reviews={daycare.reviews || []}
                    />

                </div>

                {/* Right Column - Key Info Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 sticky top-4">
                        <h3 className="text-xl font-bold text-gray-900 border-b pb-4 mb-4">Key Information</h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1 font-medium">Monthly Fee</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(daycare.monthly_fee)}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mb-1 font-medium">Registration Fee</p>
                                <p className="text-md font-semibold text-gray-700">{formatCurrency(daycare.registration_fee)}</p>
                            </div>

                            <hr className="border-gray-50" />

                            <div>
                                <p className="text-sm text-gray-500 mb-1 font-medium">Operating Hours</p>
                                <p className="text-md text-gray-800">8:00 AM - 6:30 PM</p>
                                <p className="text-xs text-gray-400">Monday to Friday</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mb-1 font-medium">Age Groups Accepted</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {daycare.age_groups_accepted?.map(age => (
                                        <span key={age} className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-md">
                                            {age} Years
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mb-1 font-medium mt-2">Availability</p>
                                <p className={`text-md font-bold ${daycare.available_seats < 5 ? 'text-red-600' : 'text-green-600'}`}>
                                    {daycare.available_seats} spots left
                                </p>
                            </div>

                            <button
                                onClick={() => setShowModal(true)}
                                className="w-full bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/40 hover:-translate-y-0.5 px-6 py-3.5 rounded-xl font-bold shadow-lg transition-all duration-300 mt-6 block text-center"
                            >
                                Contact Facility
                            </button>

                            {/* Phase 14: Contact Action Bar */}
                            <div className="flex flex-col space-y-3 mt-4 pt-4 border-t border-gray-100">
                                <p className="text-sm font-bold text-gray-900 mb-1">Direct Contact Options</p>

                                <a
                                    href={isCallAvailable ? `tel:${daycare.phone_number || '919876543210'}` : '#'}
                                    className={`flex justify-center items-center px-4 py-2.5 rounded-lg font-bold shadow-sm transition-colors text-sm
                                        ${isCallAvailable ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                    onClick={(e) => { if (!isCallAvailable) e.preventDefault(); }}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    {isCallAvailable ? 'Call Center' : 'Call available at 7:30 AM'}
                                </a>

                                <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex justify-center items-center bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2.5 rounded-lg font-bold shadow-sm transition-colors text-sm"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 001.91 6.467L.203 23.824l5.512-1.423A11.972 11.972 0 0011.944 24 12 12 0 1011.944 0m0 20.312a9.92 9.92 0 01-5.068-1.383l-.364-.216-3.763.98.995-3.667-.238-.376A9.926 9.926 0 012.016 12C2.016 6.512 6.48 2.048 11.944 2.048 17.408 2.048 21.872 6.512 21.872 12c0 5.488-4.464 9.952-9.928 9.952m5.454-7.445c-.299-.149-1.767-.872-2.042-.971-.274-.1-.473-.149-.672.15-.2.3-.772.97-.946 1.17-.174.199-.348.224-.648.075-.298-.15-1.26-.464-2.4-1.48-.888-.79-1.488-1.764-1.662-2.064-.174-.3-.018-.462.132-.612.134-.133.298-.348.448-.522.149-.174.199-.298.299-.497.1-.2.05-.373-.025-.522-.075-.15-.672-1.62-.921-2.217-.242-.58-.488-.5-.672-.51-.174-.01-.373-.01-.572-.01-.199 0-.522.075-.796.374-.274.3-1.045 1.02-1.045 2.488 0 1.468 1.07 2.887 1.219 3.086.15.2 2.106 3.21 5.1 4.5.713.308 1.268.492 1.701.63.714.227 1.365.195 1.88.118.574-.085 1.767-.721 2.016-1.418.25-.697.25-1.294.175-1.418-.075-.124-.274-.2-.573-.348" /></svg>
                                    WhatsApp
                                </a>

                                <a
                                    href={`mailto:${daycare.email || 'info@daycare.com'}?subject=Inquiry from Daycare Discovery`}
                                    className="flex justify-center items-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg font-bold shadow-sm transition-colors text-sm"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    Email
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inquiry Modal */}
            {showModal && (
                <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowModal(false)}></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleSubmitInquiry}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <h3 className="text-2xl leading-6 font-bold text-gray-900 mb-4" id="modal-title">
                                                Send Inquiry to {daycare.name}
                                            </h3>
                                            <div className="mt-2 space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Your Name</label>
                                                    <input required type="text" name="parent_name" value={formData.parent_name} onChange={handleFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500" placeholder="Jane Doe" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                                    <input required type="email" name="parent_email" value={formData.parent_email} onChange={handleFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500" placeholder="jane@example.com" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Child's Age (Months/Years)</label>
                                                    <input required type="text" name="child_age" value={formData.child_age} onChange={handleFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500" placeholder="e.g. 2 Years" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Message</label>
                                                    <textarea required rows="3" name="message" value={formData.message} onChange={handleFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500" placeholder="I am interested in scheduling a tour..."></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100">
                                    <button disabled={submitLoading} type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors">
                                        {submitLoading ? 'Sending...' : 'Send Inquiry'}
                                    </button>
                                    <button disabled={submitLoading} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Phase 14: Verification Modal */}
            {showVerificationModal && (
                <div className="fixed z-[60] inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowVerificationModal(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full border border-gray-100">
                            <div className="bg-emerald-600 px-4 py-5 sm:p-6 text-center">
                                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white shadow-lg mb-4">
                                    <svg className="h-10 w-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <h3 className="text-2xl leading-6 font-extrabold text-white" id="modal-title">
                                    Trust & Safety Verified
                                </h3>
                                <p className="text-emerald-100 mt-2 text-sm font-medium">This facility has passed our rigorous 4-step security check.</p>
                            </div>

                            <div className="px-6 py-6 bg-white">
                                <ul className="space-y-5">
                                    <li className="flex">
                                        <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm border border-emerald-200">1</div>
                                        <div className="ml-4">
                                            <h4 className="text-md font-bold text-gray-900">Document Check</h4>
                                            <p className="mt-1 text-sm text-gray-500 leading-relaxed">We verified government licenses, operating permits, and fire safety compliance certificates.</p>
                                        </div>
                                    </li>
                                    <li className="flex">
                                        <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm border border-emerald-200">2</div>
                                        <div className="ml-4">
                                            <h4 className="text-md font-bold text-gray-900">Photo Upload</h4>
                                            <p className="mt-1 text-sm text-gray-500 leading-relaxed">All facility photos were geo-tagged and visually inspected by our moderation team.</p>
                                        </div>
                                    </li>
                                    <li className="flex">
                                        <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm border border-emerald-200">3</div>
                                        <div className="ml-4">
                                            <h4 className="text-md font-bold text-gray-900">Information Review</h4>
                                            <p className="mt-1 text-sm text-gray-500 leading-relaxed">Pricing, age groups, and available spots were cross-checked with the facility manager directly.</p>
                                        </div>
                                    </li>
                                    <li className="flex">
                                        <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm border border-emerald-200">4</div>
                                        <div className="ml-4">
                                            <h4 className="text-md font-bold text-gray-900">Parent Confirmation</h4>
                                            <p className="mt-1 text-sm text-gray-500 leading-relaxed">At least 3 verified parents have confirmed their children actively attend this facility.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-3 bg-white text-base font-bold text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors"
                                    onClick={() => setShowVerificationModal(false)}
                                >
                                    Close Window
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DaycareProfile;
