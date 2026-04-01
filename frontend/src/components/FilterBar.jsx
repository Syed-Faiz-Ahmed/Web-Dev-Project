import React from 'react';

const FilterBar = ({ filters, setFilters, onGetLocation, userLocation }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-6 border border-gray-100 flex flex-wrap gap-4 items-center">
            <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Min Fee (₹)</label>
                <input
                    type="number"
                    name="min_fee"
                    value={filters.min_fee}
                    onChange={handleChange}
                    className="border border-gray-300 rounded px-3 py-2 w-28 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. 8000"
                />
            </div>

            <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Max Fee (₹)</label>
                <input
                    type="number"
                    name="max_fee"
                    value={filters.max_fee}
                    onChange={handleChange}
                    className="border border-gray-300 rounded px-3 py-2 w-28 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. 20000"
                />
            </div>

            <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Min Rating</label>
                <select
                    name="min_rating"
                    value={filters.min_rating}
                    onChange={handleChange}
                    className="border border-gray-300 rounded px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                    <option value="">Any</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                </select>
            </div>

            <div className="flex flex-col ml-auto">
                <label className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Sort By</label>
                <select
                    name="sort"
                    value={filters.sort}
                    onChange={handleChange}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                    <option value="best_match">Best Match</option>
                    <option value="lowest_fee">Lowest Fee</option>
                    <option value="highest_rated">Highest Rated</option>
                </select>
            </div>

            <div className="flex items-center ml-4">
                <input
                    type="checkbox"
                    id="is_verified"
                    name="is_verified"
                    checked={filters.is_verified}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="is_verified" className="ml-2 block text-sm font-medium text-gray-700">
                    Verified Only
                </label>
            </div>

            <div className="flex items-center ml-auto">
                <button
                    onClick={onGetLocation}
                    className={`flex items-center justify-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-sm font-bold text-white ${userLocation?.lat ? 'bg-green-600 hover:bg-green-700 hover:shadow-green-500/30' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {userLocation?.lat ? 'Location Found' : 'Use My Location'}
                </button>
            </div>
        </div>
    );
};

export default FilterBar;
