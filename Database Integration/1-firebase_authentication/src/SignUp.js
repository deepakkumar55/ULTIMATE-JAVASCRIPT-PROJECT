import React, { useState } from 'react';
import { auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert('User signed up successfully!');
        } catch (error) {
            console.error('Error signing up:', error);
        }
    };

    return (
        <form onSubmit={handleSignUp} className="flex flex-col space-y-4 max-w-md mx-auto p-8 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-center">Sign Up</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="p-2 border border-gray-300 rounded"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="p-2 border border-gray-300 rounded"
                required
            />
            <button type="submit" className="p-2 bg-blue-500 text-white rounded">Sign Up</button>
        </form>
    );
};

export default SignUp;
