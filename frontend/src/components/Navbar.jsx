import React from 'react';
import { Link } from 'react-router-dom';
import { Baby, User, LogIn } from 'lucide-react';

const Navbar = ({ user, handleLogout, setShowLogin }) => {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.02)] transition-all">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                {/* Logo Area */}
                <Link to="/" className="flex items-center space-x-3 group">
                    <div className="bg-sky-500 p-2 rounded-xl text-white group-hover:bg-sky-600 transition-colors shadow-sm">
                        <Baby size={24} strokeWidth={2.5} />
                    </div>
                    <span className="text-2xl font-extrabold text-gray-900 tracking-tight ml-2">
                        Daycare <span className="text-sky-500">Discovery</span>
                    </span>
                </Link>

                {/* Centered Navigation */}
                <nav className="hidden md:flex flex-1 justify-center">
                    <ul className="flex space-x-8 text-sm font-bold text-slate-600">
                        <li>
                            <Link to="/" className="hover:text-sky-500 hover:-translate-y-0.5 inline-block transition-transform duration-300">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className="hover:text-sky-500 hover:-translate-y-0.5 inline-block transition-transform duration-300">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:text-sky-500 hover:-translate-y-0.5 inline-block transition-transform duration-300">
                                Contact
                            </Link>
                        </li>
                        <li>
                            <Link to="/compare" className="text-sky-500 font-extrabold hover:text-sky-600 hover:-translate-y-0.5 inline-block transition-transform duration-300 flex items-center">
                                ⚖️ Compare
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="hidden sm:flex text-slate-700 font-bold hover:text-sky-500 transition-colors items-center">
                                <User size={18} className="mr-2 text-sky-500" />
                                Parent Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-bold text-slate-500 hover:text-red-500 px-4 py-2 transition-colors rounded-full hover:bg-red-50"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setShowLogin(true)}
                                className="text-sm font-extrabold text-slate-600 hover:text-sky-500 transition-colors flex items-center px-4 py-2 rounded-full hover:bg-slate-50"
                            >
                                <LogIn size={18} className="mr-2" />
                                Log in
                            </button>
                            <button
                                onClick={() => setShowLogin(true)}
                                className="bg-sky-500 text-white hover:bg-sky-600 text-sm font-extrabold px-6 py-2.5 rounded-full shadow-[0_4px_20px_-2px_rgba(14,165,233,0.4)] hover:shadow-[0_4px_20px_-2px_rgba(14,165,233,0.6)] hover:-translate-y-0.5 transition-all duration-300 flex items-center"
                            >
                                <User size={16} className="mr-2" />
                                Sign Up
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
