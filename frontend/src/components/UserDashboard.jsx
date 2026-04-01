import React, { useState, useEffect } from 'react';
import { fetchUserDashboard, fetchUserInquiries, updateInquiryStatus } from '../api';
import { Link } from 'react-router-dom';
import { realisticDaycareImages } from '../imageBank';

const InquiryCard = ({ inq }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [status, setStatus] = useState(inq.status || 'Sent');
    const [isUpdating, setIsUpdating] = useState(false);

    const statusMap = {
        'Sent': 0,
        'Viewed': 1,
        'Replied': 2
    };

    const currentIndex = statusMap[status] ?? 0;
    const steps = ['Sent', 'Viewed by Daycare', 'Replied'];

    const sentDate = new Date(inq.created_at).toLocaleDateString();

    // Create a mock timestamp for replied if applicable
    const repliedDate = status === 'Replied'
        ? new Date(new Date(inq.created_at).getTime() + 86400000).toLocaleDateString()
        : "Pending";

    const handleSimulateReply = async () => {
        if (status === 'Replied' || isUpdating) return;
        setIsUpdating(true);
        try {
            const result = await updateInquiryStatus(inq.id);
            if (result.inquiry && result.inquiry.status) {
                setStatus(result.inquiry.status); // Update local active Stepper UI State
            }
        } catch (error) {
            console.error("Failed to simulate status hop:", error);
            alert("Simulation failed, backend server might be unreachable.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start mb-6 w-full">
                <div>
                    <h4 className="text-xl font-bold text-indigo-700">
                        <Link to={`/daycare/${inq.daycare_id}`} className="hover:underline">
                            {inq.daycare_name || "Daycare Facility"}
                        </Link>
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">Child Age: <span className="font-semibold text-gray-700">{inq.child_age}</span></p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                    ${status === 'Replied' ? 'bg-green-100 text-green-800' :
                        status === 'Viewed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-600'}`}>
                    {status}
                </span>
            </div>

            {/* Tailwind Stepper Timeline */}
            <div className="mb-6 relative w-full pt-2 px-2">
                {/* Connecting Line (Background) */}
                <div className="absolute top-6 left-6 right-6 h-1 lg:left-10 lg:right-10 bg-gray-200 rounded-full"></div>

                {/* Connecting Line (Active) */}
                <div className="absolute top-6 left-6 h-1 lg:left-10 bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `calc(${(currentIndex / 2) * 100}% - ${(currentIndex / 2) * 20}px)` }}></div>

                <div className="relative flex justify-between w-full">
                    {steps.map((step, index) => {
                        const isCompleted = index <= currentIndex;
                        return (
                            <div key={step} className="flex flex-col items-center w-1/3">
                                {/* Node */}
                                <div className={`w-9 h-9 flex items-center justify-center rounded-full border-4 z-10 transition-colors duration-300
                                    ${isCompleted ? 'bg-indigo-600 border-indigo-100 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                                    {isCompleted ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                                    )}
                                </div>
                                <span className={`text-xs font-semibold mt-2 text-center w-full ${isCompleted ? 'text-indigo-700' : 'text-gray-500'}`}>
                                    {step}
                                </span>
                                {index === 0 && <span className="text-[10px] text-gray-400 mt-0.5">{sentDate}</span>}
                                {index === 2 && <span className="text-[10px] text-gray-400 mt-0.5">{repliedDate}</span>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* View Message Toggle & Simulator */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center w-full">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors focus:outline-none"
                >
                    {isExpanded ? (
                        <>Hide Message <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg></>
                    ) : (
                        <>View Message <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></>
                    )}
                </button>

                {status !== 'Replied' && (
                    <button
                        onClick={handleSimulateReply}
                        disabled={isUpdating}
                        className={`text-xs px-3 py-1.5 rounded font-medium border transition-colors shadow-sm
                        ${isUpdating ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300'}`}
                    >
                        {isUpdating ? 'Simulating...' : 'Simulate Daycare Reply'}
                    </button>
                )}
            </div>

            {isExpanded && (
                <div className="mt-3 p-4 bg-gray-50 rounded-lg text-gray-700 text-sm italic border-l-4 border-indigo-300 animate-fade-in-up text-left">
                    "{inq.message}"
                </div>
            )}
        </div>
    );
};

const UserDashboard = ({ user }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [savedDaycares, setSavedDaycares] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            try {
                // Fetch saved daycares
                const dashData = await fetchUserDashboard();
                setSavedDaycares(dashData.savedDaycares || []);

                // Fetch inquiries
                const inqData = await fetchUserInquiries();
                setInquiries(inqData || []);
            } catch (err) {
                console.error("Failed to load dashboard data:", err);
                setError("Failed to load dashboard data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadDashboardData();
        }
    }, [user]);

    if (!user) return <div className="text-center py-20">Please log in to view your dashboard.</div>;

    const renderProfile = () => (
        <div className="bg-white shadow rounded-lg p-8 border border-gray-100 animate-fade-in-up">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                    <p className="mt-1 text-lg text-gray-900 font-semibold">{user.name}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-500">Email Address</label>
                    <p className="mt-1 text-lg text-gray-900 font-semibold">{user.email}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-500">Account Status</label>
                    <span className="inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active & Verified
                    </span>
                </div>
            </div>
        </div>
    );

    const renderInquiries = () => (
        <div className="bg-white shadow rounded-lg p-8 border border-gray-100 animate-fade-in-up">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">My Inquiries</h3>
            {inquiries.length === 0 ? (
                <p className="text-gray-500">You haven't made any inquiries yet.</p>
            ) : (
                <div className="space-y-6">
                    {inquiries.map((inq) => (
                        <InquiryCard key={inq.id} inq={inq} />
                    ))}
                </div>
            )}
        </div>
    );

    const renderFavorites = () => (
        <div className="bg-white shadow rounded-lg p-8 border border-gray-100 animate-fade-in-up">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Saved Daycares</h3>
            {savedDaycares.length === 0 ? (
                <p className="text-gray-500">You haven't saved any daycares yet. Browse the home page and click the heart icon to save them!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedDaycares.map((daycare) => (
                        <div key={daycare.id} className="flex flex-col border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white">
                            <img src={realisticDaycareImages[daycare.id % realisticDaycareImages.length]} alt={daycare.name} className="w-full h-40 object-cover" />
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-1">{daycare.name}</h4>
                                    <p className="text-sm text-gray-500 mb-2">⭐ {Number(daycare.overall_rating).toFixed(1)}/5.0 - {daycare.review_count || 0} reviews</p>
                                    <p className="text-lg font-bold text-indigo-600">₹{Number(daycare.monthly_fee).toLocaleString('en-IN')}<span className="text-sm font-normal text-gray-500">/mo</span></p>
                                </div>
                                <div className="mt-4">
                                    <Link to={`/daycare/${daycare.id}`} className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold border border-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded transition-colors inline-block w-full text-center">
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">

            {/* Sidebar */}
            <div className="w-full md:w-64 shrink-0">
                <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-100 sticky top-4">
                    <div className="p-6 bg-indigo-600 text-white text-center">
                        <div className="w-16 h-16 bg-white text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3 shadow-inner">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-xl font-bold">{user.name}</h2>
                        <p className="text-indigo-200 text-sm">Parent Member</p>
                    </div>
                    <nav className="p-2 space-y-1">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full text-left px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                            👤 My Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('inquiries')}
                            className={`w-full text-left px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'inquiries' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                            📨 My Inquiries
                        </button>
                        <button
                            onClick={() => setActiveTab('favorites')}
                            className={`w-full text-left px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'favorites' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                            ❤️ Saved Daycares
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-h-[500px]">
                {loading ? (
                    <div className="bg-white shadow rounded-lg p-8 border border-gray-100 text-center flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
                ) : (
                    <>
                        {activeTab === 'profile' && renderProfile()}
                        {activeTab === 'inquiries' && renderInquiries()}
                        {activeTab === 'favorites' && renderFavorites()}
                    </>
                )}
            </div>

        </div>
    );
};

export default UserDashboard;
