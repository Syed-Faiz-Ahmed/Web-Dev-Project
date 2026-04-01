import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: "Are all daycares on this platform licensed?",
            answer: "Yes! Every single daycare facility listed on our platform undergoes a rigorous verification process. We verify their state licensing, health inspection records, and ensure they meet basic safety standards before they can appear in our search results."
        },
        {
            question: "How do I schedule a tour with a facility?",
            answer: "Once you find a daycare you like, simply click 'View Details' to go to their profile, then click the 'Book Inquiry' button. You can select your preferred tour dates, and the center director will contact you directly to confirm."
        },
        {
            question: "Can I compare multiple daycares side-by-side?",
            answer: "Absolutely. Click the 'Compare' scale icon on any daycare card to add it to your comparison tray. Once you have up to 3 selected, you can view a detailed side-by-side matrix of their prices, hours, and features."
        },
        {
            question: "Is there a fee to use this platform?",
            answer: "No, our Discovery Platform is completely free for parents to search, compare, and contact daycares. We believe finding the right care for your child should be as accessible and stress-free as possible."
        }
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="py-24 bg-slate-50 border-t border-slate-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                        Frequently Asked <span className="text-sky-500">Questions</span>
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Got questions about how our platform works? We've got answers.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isActive = activeIndex === index;
                        return (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className={`bg-white rounded-2xl border-2 transition-colors duration-300 overflow-hidden ${isActive ? 'border-sky-500 shadow-md' : 'border-slate-100 hover:border-sky-200'}`}
                            >
                                <button 
                                    className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none"
                                    onClick={() => toggleFAQ(index)}
                                >
                                    <span className="font-bold text-gray-900 text-lg pr-4">{faq.question}</span>
                                    <ChevronDown 
                                        className={`text-slate-400 shrink-0 transition-transform duration-300 ${isActive ? 'rotate-180 text-sky-500' : ''}`} 
                                    />
                                </button>
                                
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="px-6 pb-6 pt-2 text-slate-600 leading-relaxed border-t border-slate-50 mx-6">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
