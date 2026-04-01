import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import About from './components/About';
import Contact from './components/Contact';
import DaycareProfile from './components/DaycareProfile';
import LoginModal from './components/LoginModal';
import UserDashboard from './components/UserDashboard';
import CompareTable from './components/CompareTable';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import { CompareProvider } from './context/CompareContext';
import { fetchFavorites, addFavorite, removeFavorite } from './api';

function App() {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [showLogin, setShowLogin] = useState(false);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if (user) {
            fetchFavorites().then(data => setFavorites(data)).catch(console.error);
        } else {
            setFavorites([]);
        }
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const handleToggleFavorite = async (e, daycareId) => {
        e.preventDefault(); // Prevent link navigation if inside a Link
        if (!user) {
            setShowLogin(true);
            return;
        }

        const isFav = favorites.some(f => f.id === daycareId);
        try {
            if (isFav) {
                await removeFavorite(daycareId);
                setFavorites(prev => prev.filter(f => f.id !== daycareId));
            } else {
                await addFavorite(daycareId);
                setFavorites(prev => [...prev, { id: daycareId }]);
            }
        } catch (err) {
            console.error("Failed to toggle favorite:", err);
            alert("Failed to update favorites. Please try again.");
        }
    };
    return (
        <CompareProvider>
            <RecentlyViewedProvider>
                <Router>
                    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
                        <Navbar user={user} handleLogout={handleLogout} setShowLogin={setShowLogin} />

                        <main className="flex-1 container mx-auto px-4 pb-12">
                            <Routes>
                                <Route path="/" element={<HomePage favorites={favorites} onToggleFavorite={handleToggleFavorite} />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/contact" element={<Contact />} />
                                <Route path="/daycare/:id" element={<DaycareProfile favorites={favorites} onToggleFavorite={handleToggleFavorite} user={user} setShowLogin={setShowLogin} />} />
                                <Route path="/compare" element={<CompareTable />} />

                                {/* Protected Dashboard Route */}
                                <Route path="/dashboard" element={
                                    user ? <UserDashboard user={user} /> : <div className="text-center py-20 text-gray-500">Please sign in to view your dashboard.</div>
                                } />
                            </Routes>

                            {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLoginSuccess={setUser} />}
                        </main>

                        <Footer />
                    </div>
                </Router>
            </RecentlyViewedProvider>
        </CompareProvider>
    );
}

export default App;
