import React from 'react';
import DaycareCard from './DaycareCard';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const RecommendedSection = ({ recommended, favorites, onToggleFavorite, userLocation }) => {
    if (!recommended || recommended.length === 0) return null;

    return (
        <section className="py-20 bg-slate-50 border-y border-slate-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-3 mb-10 pb-4 border-b-2 border-orange-500 inline-flex">
                    <Sparkles className="text-orange-500" size={28} />
                    <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Recommended For You
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recommended.map((daycare, index) => (
                        <motion.div 
                            key={daycare.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <DaycareCard
                                daycare={daycare}
                                userLocation={userLocation}
                                isFavorite={favorites?.some(f => f.id === daycare.id)}
                                onToggleFavorite={onToggleFavorite}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RecommendedSection;
