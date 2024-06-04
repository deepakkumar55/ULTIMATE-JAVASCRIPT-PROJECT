import React, { useState } from 'react';
import { auth } from './firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const ResetPassword = () => {
    const [email, setEmail] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            alert('Password reset email sent!');
        } catch (error) {
            console.error('Error resetting password:', error);
        }
    };

    return (
        <form onSubmit={handleResetPassword} className="flex flex-col space-y-4 max-w-md mx-auto p-8 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-center">Reset Password</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="p-2 border border-gray-300 rounded"
                required
            />
            <button type="submit" className="p-2 bg-blue-500 text-white rounded">Reset Password</button>
        </form>
    );
};

export default ResetPassword;
