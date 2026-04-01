import React from 'react';

const About = () => {
    return (
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-24 bg-gray-50 my-8 rounded-3xl shadow-sm">

            {/* Hero Section */}
            <div className="text-center space-y-6">
                <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                    Empowering Parents to <span className="text-indigo-600">Find the Best Care</span>
                </h1>
                <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
                    Daycare Discovery was built with a simple premise: finding reliable, verified childcare should be as transparent and seamless as booking your favorite hotel.
                </p>
            </div>

            {/* Stats Bar */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    <div className="p-4">
                        <p className="text-5xl font-bold text-indigo-600 mb-2">100+</p>
                        <p className="text-lg font-medium text-gray-600">Verified Daycares</p>
                    </div>
                    <div className="p-4">
                        <p className="text-5xl font-bold text-indigo-600 mb-2">500+</p>
                        <p className="text-lg font-medium text-gray-600">Happy Parents</p>
                    </div>
                    <div className="p-4">
                        <p className="text-5xl font-bold text-indigo-600 mb-2">24/7</p>
                        <p className="text-lg font-medium text-gray-600">Dedicated Support</p>
                    </div>
                </div>
            </div>

            {/* Mission & Vision (Two Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        We aim to bridge the gap between busy parents and high-quality early childhood education centers. By leveraging deep data analysis and geolocation matching, we surface facilities that perfectly align with your budget, specific location, and uncompromising quality standards.
                    </p>
                </div>
                <div className="space-y-6 bg-indigo-50 p-10 rounded-3xl">
                    <h2 className="text-3xl font-bold text-indigo-900">Our Vision</h2>
                    <p className="text-lg text-indigo-800 leading-relaxed">
                        We visualize a future where the anxiety of childcare hunting is completely eliminated. A unified platform where rigorous verification, parent community reviews, and instant real-time inquiry bookings are standard procedure.
                    </p>
                </div>
            </div>

            {/* Tech Stack Section */}
            <div className="text-center pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Built With Modern Architecture</h3>
                <div className="flex flex-wrap justify-center gap-6">
                    <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-40 hover:shadow-md transition-shadow">
                        <span className="text-4xl mb-3">🐘</span>
                        <span className="font-bold text-gray-700">PostgreSQL</span>
                        <span className="text-xs text-gray-500 mt-1">Database</span>
                    </div>
                    <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-40 hover:shadow-md transition-shadow">
                        <span className="text-4xl mb-3">🚂</span>
                        <span className="font-bold text-gray-700">Express</span>
                        <span className="text-xs text-gray-500 mt-1">Backend</span>
                    </div>
                    <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-40 hover:shadow-md transition-shadow">
                        <span className="text-4xl mb-3">⚛️</span>
                        <span className="font-bold text-gray-700">React</span>
                        <span className="text-xs text-gray-500 mt-1">Frontend</span>
                    </div>
                    <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-40 hover:shadow-md transition-shadow">
                        <span className="text-4xl mb-3">🟢</span>
                        <span className="font-bold text-gray-700">Node.js</span>
                        <span className="text-xs text-gray-500 mt-1">Runtime</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
