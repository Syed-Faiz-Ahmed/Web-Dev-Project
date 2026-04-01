import React from 'react';
import { MapPin, Calendar, IndianRupee, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSearch = ({ filters, setFilters, onGetLocation, userLocation, onSearch }) => {
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSearchClick = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch();
        }
    };

    return (
        <section className="relative bg-white pt-24 pb-20 sm:pt-32 sm:pb-24 overflow-hidden rounded-b-[3rem] sm:rounded-b-[4rem] mb-12 border-b border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.02)]">
            {/* Background Blobs for Design System */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-sky-100/50 blur-3xl opacity-60"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-teal-50/50 blur-3xl opacity-60"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center animate-fade-in-up">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-5xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6"
                >
                    Find the Perfect <span className="text-sky-500 relative inline-block">
                        Daycare
                        <svg className="absolute w-full h-3 -bottom-1 left-0 text-sky-200" viewBox="0 0 100 10" preserveAspectRatio="none">
                            <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="transparent" strokeLinecap="round"/>
                        </svg>
                    </span><br/> for Your Child
                </motion.h1>
                
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-12"
                >
                    Discover highly-rated, verified childcare centers in your neighborhood.
                </motion.p>

                {/* Airbnb-style Pill Search Bar */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 p-2 sm:p-3 max-w-4xl mx-auto flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 relative z-20"
                >
                    {/* Location Section */}
                    <div className="flex-1 w-full sm:w-auto flex items-center px-4 sm:px-6 sm:border-r border-slate-200">
                        <MapPin className="text-sky-500 mr-3 shrink-0" size={24} />
                        <div className="flex flex-col text-left w-full relative group">
                            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Location</label>
                            <input 
                                type="text"
                                placeholder={userLocation?.lat ? "Using your location" : "Where are you looking?"}
                                readOnly
                                className="w-full bg-transparent focus:outline-none text-sm text-slate-600 placeholder-slate-400 mt-1 cursor-pointer truncate"
                                onClick={onGetLocation}
                            />
                            {/* Hover tooltip */}
                            <div className="absolute top-full left-0 mt-2 hidden group-hover:block bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
                                Click to use precise GPS
                            </div>
                        </div>
                    </div>

                    {/* Child Age Section */}
                    <div className="flex-1 w-full sm:w-auto flex items-center px-4 sm:px-6 sm:border-r border-slate-200">
                        <Calendar className="text-sky-500 mr-3 shrink-0" size={24} />
                        <div className="flex flex-col text-left w-full">
                            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Child Age</label>
                            <select 
                                name="age_group"
                                className="w-full bg-transparent focus:outline-none text-sm text-slate-600 mt-1 cursor-pointer appearance-none"
                                defaultValue=""
                            >
                                <option value="" disabled className="text-slate-400">Select group...</option>
                                <option value="infant">Infant (0-1 yr)</option>
                                <option value="toddler">Toddler (1-3 yrs)</option>
                                <option value="preschool">Preschool (3-5 yrs)</option>
                                <option value="schoolage">After School (5+ yrs)</option>
                            </select>
                        </div>
                    </div>

                    {/* Max Budget Section */}
                    <div className="flex-1 w-full sm:w-auto flex items-center px-4 sm:px-6">
                        <IndianRupee className="text-sky-500 mr-3 shrink-0" size={24} />
                        <div className="flex flex-col text-left w-full">
                            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Max Budget</label>
                            <input
                                type="number"
                                name="max_fee"
                                value={filters.max_fee}
                                onChange={handleChange}
                                className="w-full bg-transparent focus:outline-none text-sm text-slate-600 placeholder-slate-400 mt-1"
                                placeholder="Any budget (₹)"
                            />
                        </div>
                    </div>

                    {/* Search Button */}
                    <button 
                        onClick={handleSearchClick}
                        className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white rounded-full p-4 sm:px-8 sm:py-4 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:scale-105 transition-all duration-300 flex justify-center items-center flex-shrink-0"
                    >
                        <Search size={24} className="sm:mr-2" />
                        <span className="font-extrabold text-lg hidden sm:block">Search</span>
                    </button>
                </motion.div>

                {/* Popular Tags */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm"
                >
                    <span className="text-slate-500 font-medium mr-2">Popular:</span>
                    {['Montessori', 'After School', 'Verified Centers', '24/7 Security'].map((tag) => (
                        <span key={tag} className="bg-slate-50 border border-slate-200 text-slate-600 px-4 py-1.5 rounded-full hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 cursor-pointer transition-colors shadow-sm">
                            {tag}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSearch;
