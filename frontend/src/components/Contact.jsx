import React, { useState } from 'react';

const Contact = () => {
    const [status, setStatus] = useState('idle');

    const handleSendMessage = (e) => {
        e.preventDefault();
        setStatus('submitting');
        // Simulate a network request
        setTimeout(() => {
            setStatus('success');
            // Reset to idle after 5 seconds
            setTimeout(() => setStatus('idle'), 5000);
        }, 800);
    };

    return (
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Let's Get in Touch</h1>
                <p className="mt-4 text-xl text-gray-500">
                    Whether you're a parent with a question or a facility looking to partner, we're here to help.
                </p>
            </div>

            <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-2">

                    {/* Left Column - Contact Info */}
                    <div className="bg-indigo-600 p-12 text-white flex flex-col justify-between">
                        <div>
                            <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
                            <div className="space-y-8">
                                <div className="flex items-start">
                                    <span className="text-2xl mr-4 opacity-80">📍</span>
                                    <div>
                                        <p className="font-semibold text-lg">Bangalore HQ</p>
                                        <p className="text-indigo-100 mt-1">Level 4, Innovator's Hub<br />Indiranagar, Bengaluru<br />Karnataka 560038</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-2xl mr-4 opacity-80">📞</span>
                                    <p className="font-semibold text-lg">+91 80 4567 8900</p>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-2xl mr-4 opacity-80">✉️</span>
                                    <p className="font-semibold text-lg">hello@daycarediscovery.in</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12">
                            <p className="text-indigo-200 text-sm">Operating Hours: Mon-Fri, 9:00 AM - 6:00 PM (IST)</p>
                        </div>
                    </div>

                    {/* Right Column - Contact Form */}
                    <div className="p-12">
                        <form className="space-y-6" onSubmit={handleSendMessage}>

                            {/* Success Banner */}
                            {status === 'success' && (
                                <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 flex items-center shadow-sm animate-pulse-once">
                                    <svg className="w-5 h-5 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium">Message Sent! Our team will reach out to you within 24 hours.</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                <input required type="text" className="block w-full border border-gray-300 rounded-lg py-3 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" placeholder="John Doe" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input required type="email" className="block w-full border border-gray-300 rounded-lg py-3 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" placeholder="john@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <select required className="block w-full border border-gray-300 rounded-lg py-3 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-shadow">
                                        <option value="" disabled selected>Select an option</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="partner">Partner with Us (For Daycares)</option>
                                        <option value="support">Technical Support</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea required rows="4" className="block w-full border border-gray-300 rounded-lg py-3 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" placeholder="How can we help you?"></textarea>
                            </div>

                            <div>
                                <button
                                    disabled={status === 'submitting' || status === 'success'}
                                    type="submit"
                                    className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white transition-all
                                        ${status === 'submitting' ? 'bg-indigo-400 cursor-not-allowed' : status === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}
                                >
                                    {status === 'submitting' ? 'Sending...' : status === 'success' ? 'Sent!' : 'Send Message'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
