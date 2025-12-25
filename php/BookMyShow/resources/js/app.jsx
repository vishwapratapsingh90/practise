import './bootstrap';
import '../css/app.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes } from 'react-router-dom';
import { routes } from './routes.config';
import { ThemeProvider } from './ThemeContext';

function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    {routes}
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

const container = document.getElementById('app');

// This checks if the container already has a React root before creating a new one,
// preventing the duplicate root error during hot module replacement (HMR).
if (container && !container._reactRootContainer) {
    const root = ReactDOM.createRoot(container);
    root.render(<App />);
}
