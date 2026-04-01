import React from 'react';
import { Quote, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const Testimonials = () => {
    const reviews = [
        {
            text: "This platform saved us weeks of searching! We found the perfect Montessori school just 5 minutes from our home, complete with verified reviews.",
            author: "Sarah Jenkins",
            role: "Mother of 3yo",
            avatar: "https://i.pravatar.cc/150?img=32"
        },
        {
            text: "I loved being able to compare the facilities side-by-side using the Compare tool. The center we chose has been phenomenal for my son's growth.",
            author: "Michael Chen",
            role: "Father of 2yo",
            avatar: "https://i.pravatar.cc/150?img=11"
        },
        {
            text: "As a working mom, the transparent pricing and immediate tour booking features were a total game-changer. Highly recommend this site!",
            author: "Emily Ross",
            role: "Mother of 6mo",
            avatar: "https://i.pravatar.cc/150?img=44"
        }
    ];

    return (
        <section className="py-24 bg-white border-t border-slate-100 relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                        Loved by <span className="text-sky-500">Parents</span>
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Don't just take our word for it—see what real families have to say about their experience finding care.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            className="bg-slate-50 p-8 rounded-3xl border border-slate-200 relative group hover:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300"
                        >
                            <Quote className="absolute top-6 right-8 text-sky-200 opacity-50 group-hover:scale-110 transition-transform duration-500" size={64} />
                            
                            <div className="flex text-yellow-400 mb-6 relative z-10">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={18} fill="currentColor" className="mr-1 shadow-sm" />
                                ))}
                            </div>
                            
                            <p className="text-slate-700 italic leading-relaxed mb-8 relative z-10 text-lg">
                                "{review.text}"
                            </p>
                            
                            <div className="flex items-center mt-auto border-t border-slate-200 pt-6 relative z-10">
                                <img src={review.avatar} alt={review.author} className="w-12 h-12 rounded-full border-2 border-white shadow-sm mr-4" />
                                <div>
                                    <h4 className="font-extrabold text-gray-900 text-sm">{review.author}</h4>
                                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{review.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
