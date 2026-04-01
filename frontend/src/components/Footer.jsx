import React from 'react';
import { Baby, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-slate-300 pt-20 pb-10 border-t border-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center space-x-3 group inline-flex mb-2">
                            <div className="bg-sky-500 p-2 rounded-xl text-white group-hover:bg-sky-400 transition-colors shadow-sm">
                                <Baby size={24} strokeWidth={2.5} />
                            </div>
                            <span className="text-2xl font-extrabold text-white tracking-tight">
                                Daycare <span className="text-sky-500">Discovery</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Empowering parents to find safe, nurturing, and verified childcare facilities with complete transparency.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all duration-300">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all duration-300">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all duration-300">
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>

                    {/* For Parents */}
                    <div>
                        <h4 className="text-lg font-extrabold text-white mb-6 uppercase tracking-wider text-sm">For Parents</h4>
                        <ul className="space-y-4">
                            <li><Link to="/about" className="hover:text-sky-400 transition-colors">Browse Daycares</Link></li>
                            <li><Link to="/compare" className="hover:text-sky-400 transition-colors">Compare Facilities</Link></li>
                            <li><a href="#" className="hover:text-sky-400 transition-colors">Safety Standards</a></li>
                            <li><a href="#" className="hover:text-sky-400 transition-colors">Parent Resources</a></li>
                            <li><a href="#" className="hover:text-sky-400 transition-colors">FAQ</a></li>
                        </ul>
                    </div>

                    {/* For Daycares */}
                    <div>
                        <h4 className="text-lg font-extrabold text-white mb-6 uppercase tracking-wider text-sm">For Daycares</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="hover:text-sky-400 transition-colors">List Your Center</a></li>
                            <li><a href="#" className="hover:text-sky-400 transition-colors">Provider Dashboard</a></li>
                            <li><a href="#" className="hover:text-sky-400 transition-colors">Success Stories</a></li>
                            <li><a href="#" className="hover:text-sky-400 transition-colors">Pricing Plans</a></li>
                            <li><a href="#" className="hover:text-sky-400 transition-colors">Help Center</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-extrabold text-white mb-6 uppercase tracking-wider text-sm">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <MapPin className="text-sky-500 shrink-0 mt-1" size={18} />
                                <span className="text-slate-400">123 Childcare Ave, Suite 100<br/>San Francisco, CA 94107</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="text-sky-500 shrink-0" size={18} />
                                <span className="text-slate-400">+1 (800) 555-CARE</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="text-sky-500 shrink-0" size={18} />
                                <span className="text-slate-400">hello@daycarediscovery.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-slate-500 text-sm mb-4 md:mb-0">
                        &copy; 2026 Daycare Discovery Platform. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-sm text-slate-500">
                        <a href="#" className="hover:text-sky-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-sky-400 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-sky-400 transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
