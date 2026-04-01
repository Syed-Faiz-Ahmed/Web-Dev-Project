import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';

import { realisticDaycareImages } from '../imageBank';

const DaycareCard = ({ daycare, distance, isFavorite, onToggleFavorite }) => {
    const { addDaycareToCompare } = useCompare();
    // Format currency in Indian Rupees
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Dynamic image setup per requirement
    // Use the pool of 50 highly realistic images based on daycare ID
    const imgUrl = realisticDaycareImages[daycare.id % realisticDaycareImages.length];

    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-2">
            <div className="relative h-56 bg-gray-200 group overflow-hidden rounded-t-2xl">
                <Link to={`/daycare/${daycare.id}`} className="block w-full h-full">
                    <img
                        src={imgUrl}
                        alt={daycare.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>

                <div className="absolute top-4 w-full px-4 flex justify-between items-start">
                    <div>
                        {daycare.is_verified && (
                            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                ✓ Verified
                            </span>
                        )}
                    </div>

                    <div className="flex space-x-2">
                        <button onClick={(e) => onToggleFavorite(e, daycare.id)} className={`bg-white/90 hover:bg-white p-2.5 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${isFavorite ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`} title={isFavorite ? "Remove from Favorites" : "Save to Favorites"}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                        <button
                            onClick={(e) => { e.preventDefault(); addDaycareToCompare(daycare); }}
                            className="bg-white/90 hover:bg-white p-2.5 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 text-gray-500 hover:text-indigo-600 transition-all duration-300"
                            title="Add to Compare Matrix"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1.5">
                    <Link to={`/daycare/${daycare.id}`} className="flex-1 pr-2">
                        <h3 className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1 tracking-tight" title={daycare.name}>{daycare.name}</h3>
                    </Link>
                </div>

                <div className="flex items-center text-sm mb-3">
                    <div className="flex items-center text-yellow-500 px-1">
                        <span className="font-bold">{Number(daycare.overall_rating).toFixed(1)}</span>
                        <span className="ml-1 text-base leading-none">★</span>
                    </div>
                    <span className="text-gray-500 ml-1">
                        ({daycare.review_count || 0} reviews)
                    </span>
                </div>

                {distance !== undefined && distance !== null && (
                    <p className="text-sm text-indigo-600 font-semibold mb-4 flex items-center bg-indigo-50 w-max px-2.5 py-1 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {distance.toFixed(1)} km away
                    </p>
                )}

                <div className="mt-auto space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-center group">
                        <span className="group-hover:text-gray-900 transition-colors">Monthly Fee</span>
                        <span className="font-bold text-gray-900 text-base">{formatCurrency(daycare.monthly_fee)}</span>
                    </div>
                    <div className="flex justify-between items-center group">
                        <span className="group-hover:text-gray-900 transition-colors">Reg. Fee</span>
                        <span className="font-semibold text-gray-700">{formatCurrency(daycare.registration_fee)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-50 -mx-5 px-5 py-2.5 mt-2 border-t border-gray-100">
                        <span className="text-gray-600 font-medium text-xs uppercase tracking-wider">Seats Left</span>
                        <span className={`font-bold px-2 py-0.5 rounded text-xs ${daycare.available_seats < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {daycare.available_seats} / {daycare.total_seats}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DaycareCard;
