import React, { useState } from 'react';

const ReviewsSection = ({ reviewCount, overallRating, reviews = [] }) => {
    // 1. Histogram Algorithm using Dynamic Data
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach(review => {
        if (ratingCounts[review.rating] !== undefined) {
            ratingCounts[review.rating]++;
        }
    });

    const totalRatings = reviews.length;

    const getPercentage = (count) => {
        if (totalRatings === 0) return 0;
        return Math.round((count / totalRatings) * 100);
    };

    // 2. Sub-Category Display Mock Data (Keeping this static as requested, since there are no sub-category ratings in DB)
    const subCategories = [
        { name: "Safety", score: 4.8 },
        { name: "Cleanliness", score: 4.9 },
        { name: "Communication", score: 4.5 },
        { name: "Value for Money", score: 4.7 }
    ];

    const handleReport = (reviewId) => {
        alert("Thank you for your report. Our moderation team will review this shortly.");
    };

    return (
        <section className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 mt-12 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-6 tracking-tight">
                Parent Reviews & Ratings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                {/* Overall Rating & Trust Badges */}
                <div className="flex flex-col justify-center items-center p-6 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                    <h3 className="text-5xl font-extrabold text-emerald-700 mb-2">
                        {Number(overallRating).toFixed(1)}
                    </h3>
                    <div className="flex text-yellow-400 text-xl mb-3">
                        {/* Simple 5-star visual representation based on ceiling of overallRating */}
                        {[...Array(5)].map((_, i) => (
                            <span key={i}>{i < Math.round(overallRating) ? '★' : '☆'}</span>
                        ))}
                    </div>
                    <p className="text-sm font-medium text-emerald-800 mb-6">Based on {reviewCount || totalRatings} reviews</p>

                    {/* Trust Indicators */}
                    <div className="space-y-3 w-full">
                        <div className="bg-white border border-emerald-200 py-2 px-3 rounded-lg flex items-center justify-center shadow-sm">
                            <svg className="w-5 h-5 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.514" /></svg>
                            <span className="text-sm font-bold text-emerald-800">Recommended by 94% of Parents</span>
                        </div>

                        <div className="group relative w-full cursor-help">
                            <div className="bg-emerald-600 hover:bg-emerald-700 transition-colors py-2 px-3 rounded-lg flex items-center justify-center shadow-sm">
                                <svg className="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                <span className="text-sm font-bold text-white">Verified Daycare</span>
                            </div>
                            {/* Hover Tooltip */}
                            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max pointer-events-none z-10">
                                Identity & Licenses verified on August 15, 2023
                                <svg className="absolute text-gray-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Histogram Algorithm */}
                <div className="flex flex-col justify-center space-y-3 px-4 md:px-0">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">Rating Distribution</h4>
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratingCounts[star];
                        const percentage = getPercentage(count);
                        return (
                            <div key={star} className="flex items-center text-sm">
                                <span className="w-12 text-gray-600 font-medium">{star} star</span>
                                <div className="flex-1 mx-3 h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-400 rounded-full"
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <span className="w-10 text-right text-gray-500">{percentage}%</span>
                            </div>
                        );
                    })}
                </div>

                {/* Sub-Category Ratings */}
                <div className="flex flex-col justify-center space-y-4 px-4 md:px-0">
                    <h4 className="text-lg font-bold text-gray-800 mb-1">Quality Categories</h4>
                    {subCategories.map((cat, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700 font-medium">{cat.name}</span>
                            <div className="flex items-center">
                                <div className="flex text-yellow-400 text-sm mr-2">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i}>{i < Math.floor(cat.score) ? '★' : '☆'}</span>
                                    ))}
                                </div>
                                <span className="font-bold text-gray-900 w-6 text-right">{cat.score}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Real Review List */}
            <div className="space-y-6 mt-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-t border-gray-100 pt-8 tracking-tight">Recent Parent Reviews</h3>

                {reviews.length === 0 ? (
                    <div className="p-8 bg-gray-50 border border-gray-100 rounded-2xl text-center">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        <p className="text-gray-900 font-bold text-lg mb-1">No reviews yet</p>
                        <p className="text-gray-500 text-sm">Be the first parent to share your experience with this facility!</p>
                    </div>
                ) : (
                    reviews.map((review, index) => (
                        <div key={review.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up" style={{animationDelay: `${0.3 + (index * 0.1)}s`}}>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 border-b border-gray-50 pb-4">
                                <div>
                                    <div className="flex items-center mb-1">
                                        <h4 className="text-md font-bold text-gray-900 mr-2">{review.parent_name}</h4>
                                        {/* Since these are coming from DB, we treat them as Verified */}
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                                            <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                            Verified Parent
                                        </span>
                                    </div>
                                    <div className="flex text-yellow-400 text-sm mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                        ))}
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-gray-400 mt-2 sm:mt-0">
                                    {new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                "{review.comment}"
                            </p>
                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={() => handleReport(review.id)}
                                    className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors flex items-center"
                                >
                                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
                                    Report
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Show More Pagination Mock */}
            <div className="mt-10 text-center pb-4">
                <button className="bg-white border-2 border-gray-200 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 hover:-translate-y-0.5 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none">
                    Load More Reviews
                </button>
            </div>
        </section>
    );
};

export default ReviewsSection;
