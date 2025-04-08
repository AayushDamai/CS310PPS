import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/InputForm.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState('');
    const navigate = useNavigate();

    const handleAdminLogin = async () => {
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok && data.role === 'Admin') {
                navigate('/admin-dashboard'); // Redirect to admin dashboard
            } else if (res.ok) {
                setResponse('Access denied. Admins only.');
            } else {
                setResponse(data.message);
            }
        } catch (error) {
            setResponse('Error connecting to the server.');
        }
    };

    return (
        <div className="input-form">
            <h2>Admin Login</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleAdminLogin}>Login</button>
            <p>{response || "Waiting for input..."}</p>
        </div>
    );
};

export default AdminLogin;