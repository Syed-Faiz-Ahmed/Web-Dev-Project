import React, { useState, useEffect } from 'react';
import FilterBar from './FilterBar';
import DaycareList from './DaycareList';
import HeroSearch from './HeroSearch';
import RecommendedSection from './RecommendedSection';
import TrustSection from './TrustSection';
import Testimonials from './Testimonials';
import FAQ from './FAQ';
import RecentlyViewed from './RecentlyViewed';
import DaycareMap from './DaycareMap';
import { fetchDaycares, fetchRecommendedDaycares } from '../api';

const HomePage = ({ favorites, onToggleFavorite }) => {
    const [daycares, setDaycares] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState({ lat: null, lng: null });
    const [geoError, setGeoError] = useState(null);

    // Recommended State
    const [recommended, setRecommended] = useState([]);
    const [loadingRecommended, setLoadingRecommended] = useState(true);

    const [filters, setFilters] = useState({
        min_fee: '',
        max_fee: '',
        min_rating: '',
        is_verified: false,
        sort: 'best_match'
    });

    // Track debounced filters to prevent excessive API calls
    const [debouncedFilters, setDebouncedFilters] = useState(filters);

    // Debounce the filter state
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilters(filters);
        }, 500);
        return () => clearTimeout(handler);
    }, [filters]);

    const handleGetLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setGeoError(null);
                },
                (err) => {
                    console.warn("Geolocation Error:", err.message);
                    setGeoError("Location access denied or unavailable. Distance-based features will be disabled.");
                }
            );
        } else {
            setGeoError("Geolocation is not supported by your browser.");
        }
    };

    // Fetch Recommended once on load
    useEffect(() => {
        const loadRecommended = async () => {
            try {
                const data = await fetchRecommendedDaycares();
                setRecommended(data);
            } catch (err) {
                console.error("Failed to load recommendations:", err);
            } finally {
                setLoadingRecommended(false);
            }
        };
        loadRecommended();
    }, []);

    // Fetch data whenever debounced filters or userLocation changes
    useEffect(() => {
        const loadDaycares = async () => {
            setLoading(true);
            setError(null);

            try {
                const params = { ...debouncedFilters };
                // If sorting by best match and we have location, pass it
                if (filters.sort === 'best_match' && userLocation.lat && userLocation.lng) {
                    params.userLat = userLocation.lat;
                    params.userLng = userLocation.lng;
                }

                // Clean out empty string params
                Object.keys(params).forEach(key => {
                    if (params[key] === '') delete params[key];
                });

                const data = await fetchDaycares(params);
                setDaycares(data.data || []);
            } catch (err) {
                setError(err.message || 'Failed to fetch daycares');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadDaycares();
    }, [debouncedFilters, userLocation.lat, userLocation.lng]);

    return (
        <div className="space-y-20 animate-fade-in-up">
            <HeroSearch 
                filters={filters} 
                setFilters={setFilters} 
                onGetLocation={handleGetLocation} 
                userLocation={userLocation} 
            />
            {geoError && (
                <div className="text-center -mt-10">
                    <p className="text-sm text-yellow-600 bg-yellow-50 inline-block px-3 py-1 rounded-full border border-yellow-200">
                        ⚠️ {geoError}
                    </p>
                </div>
            )}

            {/* Recommended Section (New Design System Component) */}
            <RecommendedSection 
                recommended={recommended} 
                favorites={favorites} 
                onToggleFavorite={onToggleFavorite} 
                userLocation={userLocation} 
            />

            {/* Recently Viewed Section */}
            <RecentlyViewed favorites={favorites} onToggleFavorite={onToggleFavorite} userLocation={userLocation} />

            {/* Phase 16: Interactive Map Component */}
            <div className="mb-20 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <DaycareMap daycares={daycares} />
            </div>

            <div className="mb-12 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                <FilterBar filters={filters} setFilters={setFilters} onGetLocation={handleGetLocation} userLocation={userLocation} />
            </div>

            <div className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <p className="text-sm text-gray-600 mb-6 font-medium bg-gray-100 inline-block px-3 py-1 rounded-full">
                    Showing {daycares.length} results
                </p>

                <DaycareList
                    daycares={daycares}
                    error={error}
                    loading={loading}
                    userLocation={userLocation}
                    favorites={favorites}
                    onToggleFavorite={onToggleFavorite}
                />
            </div>

            {/* Trust Section */}
            <TrustSection />

            {/* Testimonials */}
            <Testimonials />

            {/* FAQ */}
            <FAQ />
        </div>
    );
};

export default HomePage;
