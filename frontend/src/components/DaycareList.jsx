import React from 'react';
import DaycareCard from './DaycareCard';

const DaycareList = ({ daycares, error, loading, userLocation, favorites, onToggleFavorite }) => {
    // Simple haversine formula to calculate distance in km if user location is known
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return null;
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);  // deg2rad below
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-700 p-4 rounded-md">
                <p className="font-bold">Error loading daycares:</p>
                <p>{error}</p>
            </div>
        );
    }

    if (!daycares || daycares.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-100 shadow-sm mt-4">
                <h3 className="text-lg font-medium text-gray-900">No daycares found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your filters to see more results.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {daycares.map(daycare => (
                <DaycareCard
                    key={daycare.id}
                    daycare={daycare}
                    distance={calculateDistance(userLocation.lat, userLocation.lng, daycare.latitude, daycare.longitude)}
                    isFavorite={favorites.some(f => f.id === daycare.id)}
                    onToggleFavorite={onToggleFavorite}
                />
            ))}
        </div>
    );
};

export default DaycareList;
