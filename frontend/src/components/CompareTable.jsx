import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';

import { realisticDaycareImages } from '../imageBank';

const CompareTable = () => {
    const { compareQueue, removeDaycareFromCompare, clearCompareQueue } = useCompare();

    /**
     * Algorithmic Utility: O(N) Linear Scan for Extremes
     * Scans through the bounded queue (max N=3) to find the absolute min/max value of a specific property.
     * 
     * @param {Array} daycares - The queue of daycares to scan.
     * @param {String} property - The object key to evaluate (e.g., 'monthly_fee', 'overall_rating').
     * @param {String} type - 'min' or 'max' to denote the extreme to search for.
     * @returns {Number|Null} - The extreme value found, or null if array is empty/invalid.
     */
    const evaluateMatrixExtremes = (daycares, property, type) => {
        if (!daycares || daycares.length === 0) return null;

        // O(N) evaluation using array boundaries
        let extremeValue = Number(daycares[0][property]);

        for (let i = 1; i < daycares.length; i++) {
            const val = Number(daycares[i][property]);
            if (type === 'min') {
                if (val < extremeValue) extremeValue = val;
            } else if (type === 'max') {
                if (val > extremeValue) extremeValue = val;
            }
        }

        return extremeValue;
    };

    if (compareQueue.length === 0) {
        return (
            <div className="max-w-7xl mx-auto py-20 px-4 text-center">
                <div className="text-6xl mb-4">⚖️</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Comparison Matrix is Empty</h2>
                <p className="text-gray-500 mb-8 max-w-lg mx-auto">
                    You haven't added any daycares to compare yet. Browse our verified facilities and click the "Compare" icon to build your matrix!
                </p>
                <Link to="/" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">
                    Find Daycares
                </Link>
            </div>
        );
    }

    // Pre-calculate algorithmic extremes for conditional UI rendering (O(N) operations)
    const minFee = evaluateMatrixExtremes(compareQueue, 'monthly_fee', 'min');
    const maxRating = evaluateMatrixExtremes(compareQueue, 'overall_rating', 'max');
    const maxSeats = evaluateMatrixExtremes(compareQueue, 'available_seats', 'max');

    // UI Formatting helpers
    const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Side-by-Side Comparison</h2>
                    <p className="mt-2 text-lg text-gray-500">Analyze your shortlisted facilities logically. Best metrics are highlighted in <span className="text-green-600 font-bold bg-green-50 px-1 rounded">green</span>.</p>
                </div>
                <button
                    onClick={clearCompareQueue}
                    className="text-sm border border-red-300 text-red-600 hover:bg-red-50 font-semibold px-4 py-2 rounded transition-colors"
                >
                    Clear Matrix
                </button>
            </div>

            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 table-fixed">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-1/4">
                                Data Points
                            </th>
                            {compareQueue.map((daycare) => (
                                <th key={`header-${daycare.id}`} scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 relative">
                                    <div className="flex justify-between items-start">
                                        <div className="pr-4">
                                            <Link to={`/daycare/${daycare.id}`} className="hover:text-indigo-600 font-bold text-lg line-clamp-1">{daycare.name}</Link>
                                            {daycare.is_verified && <span className="inline-block mt-1 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">✓ Verified</span>}
                                        </div>
                                        <button
                                            onClick={() => removeDaycareFromCompare(daycare.id)}
                                            className="text-gray-400 hover:text-red-500 bg-white shadow-sm border rounded-full p-1"
                                            title="Remove from comparison"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <img src={realisticDaycareImages[daycare.id % realisticDaycareImages.length]} alt={daycare.name} className="mt-3 w-full h-32 object-cover rounded-md shadow-sm border border-gray-200" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">

                        {/* Rating Row ($O(N)$ evaluation styling) */}
                        <tr>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 bg-gray-50 border-r border-gray-100">Overall Rating</td>
                            {compareQueue.map(daycare => {
                                const isWinner = Number(daycare.overall_rating) === maxRating;
                                return (
                                    <td key={`rating-${daycare.id}`} className={`whitespace-nowrap px-3 py-4 text-sm ${isWinner ? 'bg-green-50 font-bold text-green-800 border border-green-200' : 'text-gray-500'}`}>
                                        <span className="text-yellow-500 mr-1">★</span> {Number(daycare.overall_rating).toFixed(1)} <span className="text-xs text-gray-400 font-normal">({daycare.review_count} reviews)</span>
                                    </td>
                                );
                            })}
                        </tr>

                        {/* Monthly Fee Row ($O(N)$ evaluation styling) */}
                        <tr>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 bg-gray-50 border-r border-gray-100">Monthly Fee</td>
                            {compareQueue.map(daycare => {
                                const isWinner = Number(daycare.monthly_fee) === minFee;
                                return (
                                    <td key={`fee-${daycare.id}`} className={`whitespace-nowrap px-3 py-4 text-sm ${isWinner ? 'bg-green-50 font-bold text-green-800 border border-green-200' : 'text-gray-500'}`}>
                                        {formatCurrency(daycare.monthly_fee)}
                                    </td>
                                );
                            })}
                        </tr>

                        {/* Registration Fee Row */}
                        <tr>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 bg-gray-50 border-r border-gray-100">Registration Fee</td>
                            {compareQueue.map(daycare => (
                                <td key={`reg-${daycare.id}`} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {formatCurrency(daycare.registration_fee)}
                                </td>
                            ))}
                        </tr>

                        {/* Available Seats Row ($O(N)$ evaluation styling) */}
                        <tr>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 bg-gray-50 border-r border-gray-100">Available Seats</td>
                            {compareQueue.map(daycare => {
                                const isWinner = Number(daycare.available_seats) === maxSeats;
                                return (
                                    <td key={`seats-${daycare.id}`} className={`whitespace-nowrap px-3 py-4 text-sm ${isWinner ? 'bg-green-50 font-bold text-green-800 border border-green-200' : 'text-gray-500'}`}>
                                        {daycare.available_seats} <span className="text-xs font-normal text-gray-400">/ {daycare.total_seats} total</span>
                                    </td>
                                );
                            })}
                        </tr>

                        {/* Age Groups Row */}
                        <tr>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 bg-gray-50 border-r border-gray-100">Age Groups</td>
                            {compareQueue.map(daycare => (
                                <td key={`age-${daycare.id}`} className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                                    {daycare.age_groups_accepted?.join(', ')} Years
                                </td>
                            ))}
                        </tr>

                    </tbody>
                </table>
            </div>
            {compareQueue.length < 3 && (
                <p className="text-sm text-gray-500 mt-4 text-right pr-4">
                    Queue Capacity: {compareQueue.length} / 3. Add more daycares to run full algorithm.
                </p>
            )}
        </div>
    );
};

export default CompareTable;
