import React from 'react';
import DaycareCard from './DaycareCard';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';

const RecentlyViewed = ({ favorites, onToggleFavorite, userLocation }) => {
    const { recentDaycares } = useRecentlyViewed();

    if (!recentDaycares || recentDaycares.length === 0) return null;

    return (
        <div className="mb-12 animate-fade-in-up">
            <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl text-blue-500">⏱️</span>
                <h3 className="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 pb-1 inline-block">Recently Viewed</h3>
            </div>
            <p className="text-gray-500 text-sm mb-4">Your 5 most recently viewed daycare profiles.</p>
            <div className="flex overflow-x-auto space-x-6 pb-4 snap-x snap-mandatory hide-scrollbar group">
                {recentDaycares.map(daycare => (
                    <div key={daycare.id} className="min-w-[300px] md:min-w-[400px] snap-center shrink-0">
                        <DaycareCard
                            daycare={daycare}
                            userLocation={userLocation}
                            isFavorite={favorites?.some(f => f.id === daycare.id)}
                            onToggleFavorite={onToggleFavorite}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentlyViewed;
