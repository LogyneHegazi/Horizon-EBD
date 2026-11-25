import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';

import CreateListing from './pages/CreateListing';
import MyListings from './pages/MyListings';

import MyReviews from './pages/MyReviews';
import WriteReview from './pages/WriteReview';

import './App.css';

function App() {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem('user'))
    );

    const handleLogin = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <BrowserRouter>
            <Header user={user} onLogout={handleLogout} />

            <Routes>
                <Route path="/" element={<Home />} />

                <Route
                    path="/register"
                    element={<Register onLogin={handleLogin} />}
                />

                <Route
                    path="/login"
                    element={<Login onLogin={handleLogin} />}
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute user={user}>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/create-listing"
                    element={
                        <ProtectedRoute user={user}>
                            <CreateListing />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/my-listings"
                    element={
                        <ProtectedRoute user={user}>
                            <MyListings />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/my-reviews"
                    element={
                        <ProtectedRoute user={user}>
                            <MyReviews />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/review/:sessionId/:tutorId"
                    element={
                        <ProtectedRoute user={user}>
                            <WriteReview />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
