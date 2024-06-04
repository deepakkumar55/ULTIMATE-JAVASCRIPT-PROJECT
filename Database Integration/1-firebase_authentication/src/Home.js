// create simple Home component after login and before login 

import React from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';

const Home = () => {
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            alert('User signed out successfully!');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="flex flex-col space-y-4 max-w-md mx-auto p-8 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-center">Home</h2>
            <p className="text-center">Welcome, {auth.currentUser.email}</p>
            <button onClick={handleSignOut} className="p-2 bg-red-500 text-white rounded">Sign Out</button>
            <Link to="/reset-password" className="text-blue-500">Reset Password</Link>
        </div>
    );
}

export default Home;