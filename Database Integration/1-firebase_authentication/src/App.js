import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { UserProvider } from './UserContext.js';
import SignUp from './SignUp';
import SignIn from './SignIn';
import ResetPassword from './ResetPassword';
import { useUser } from './UserContext.js';

const App = () => {
    return (
        <UserProvider>
            <Router>
                <div className="flex flex-col items-center min-h-screen bg-gray-100">
                    <h1 className="text-3xl font-bold my-8">Firebase Authentication in MERN Stack</h1>
                    <nav className="mb-4">
                        <Link to="/signup" className="mr-4 text-blue-500">Sign Up</Link>
                        <Link to="/signin" className="mr-4 text-blue-500">Sign In</Link>
                        <Link to="/resetpassword" className="text-blue-500">Reset Password</Link>
                    </nav>
                    <Routes>
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/resetpassword" element={<ResetPassword />} />
                        <Route path="/" element={<Home />} />
                    </Routes>
                </div>
            </Router>
        </UserProvider>
    );
};

const Home = () => {
    const { user } = useUser();

    return (
        <div className="text-center">
            <h2 className="text-xl">Welcome to Firebase Authentication Example</h2>
            {user ? (
                <div>
                    <p>User Email: {user.email}</p>
                    <p>User UID: {user.uid}</p>
                </div>
            ) : (
                <p>Please sign in to see your details.</p>
            )}
        </div>
    );
};

export default App;
