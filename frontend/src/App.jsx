import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import FaceCapturePage from './pages/FaceCapturePage';
import Home from './pages/Home';
import AccidentReport from './pages/AccidentReport';

const App = () => {
    const [capturedFace, setCapturedFace] = useState(null);
    
    // Check if user is logged in
    const isAuthenticated = () => {
        const user = localStorage.getItem('currentUser');
        return !!user;
    };

    // Check if face is verified in this session
    const isFaceVerified = () => {
        return sessionStorage.getItem('faceVerified') === 'true';
    };

    const RequireAuth = ({ children }) => {
        return isAuthenticated() ? children : <Navigate to="/login" replace />;
    };

    const RequireFace = ({ children }) => {
        if (!isAuthenticated()) {
             return <Navigate to="/login" replace />;
        }
        if (!isFaceVerified()) {
            return <Navigate to="/face-capture" replace />;
        }
        return children;
    };

    return (
        <Routes>
            {/* Root route: Redirect based on auth and face status */}
            <Route 
                path="/" 
                element={
                    isAuthenticated() 
                        ? (isFaceVerified() ? <Navigate to="/home" replace /> : <Navigate to="/face-capture" replace />)
                        : <Navigate to="/login" replace />
                } 
            />
            
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/face-capture" element={
                <RequireAuth>
                    <FaceCapturePage setCapturedFace={setCapturedFace} />
                </RequireAuth>
            } />
            
            <Route path="/home" element={
                <RequireFace>
                    <Home />
                </RequireFace>
            } />
            
            <Route path="/report" element={
                <RequireFace>
                    <AccidentReport capturedFace={capturedFace} />
                </RequireFace>
            } />
        </Routes>
    );
};

export default App;
