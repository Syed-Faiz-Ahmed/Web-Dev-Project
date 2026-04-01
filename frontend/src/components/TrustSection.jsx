import React from 'react';
import { CheckCircle, Heart, Shield, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const TrustSection = () => {
    const trustFeatures = [
        {
            icon: CheckCircle,
            title: "Verified Centers",
            description: "Every daycare is strictly vetted, licensed, and inspected for full compliance and safety.",
            bgColor: "bg-sky-100",
            iconColor: "text-sky-500"
        },
        {
            icon: Heart,
            title: "Happy Parents",
            description: "Over 10,000+ families have found their perfect childcare match using our platform.",
            bgColor: "bg-pink-100",
            iconColor: "text-pink-500"
        },
        {
            icon: Shield,
            title: "Safe & Secure",
            description: "Top-tier data privacy and background-checked providers ensure complete peace of mind.",
            bgColor: "bg-emerald-100",
            iconColor: "text-emerald-500"
        },
        {
            icon: Star,
            title: "Trusted Reviews",
            description: "100% authentic ratings and reviews from verified parents who have used these facilities.",
            bgColor: "bg-purple-100",
            iconColor: "text-purple-500"
        }
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                        Why Parents <span className="text-sky-500">Trust Us</span>
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        We take the guesswork out of finding reliable childcare so you can focus on what matters most.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {trustFeatures.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:-translate-y-2 hover:shadow-xl transition-all duration-300 text-center group"
                            >
                                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 ${feature.bgColor}`}>
                                    <Icon className={feature.iconColor} size={36} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-xl font-extrabold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default TrustSection;
