import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useUser();
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
            navigate('/');
        } catch (error) {
            console.error('Error signing in:', error);
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            setUser(result.user);
            navigate('/');
        } catch (error) {
            console.error('Error signing in with Google:', error);
        }
    };

    return (
        <div className="flex flex-col space-y-4 max-w-md mx-auto p-8 bg-white shadow-md rounded-lg">
            <form onSubmit={handleSignIn}>
                <h2 className="text-2xl font-bold text-center">Sign In</h2>
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
                <button type="submit" className="p-2 bg-blue-500 text-white rounded">Sign In</button>
            </form>
            <button onClick={handleGoogleSignIn} className="p-2 bg-red-500 text-white rounded">Sign In with Google</button>
        </div>
    );
};

export default SignIn;
