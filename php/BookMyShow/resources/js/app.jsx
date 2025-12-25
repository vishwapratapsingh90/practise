import './bootstrap';
import '../css/app.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes } from 'react-router-dom';
import { routes } from './routes.config';
import Header from './Header';
import Footer from './Footer';
import { ThemeProvider } from './ThemeContext';

function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Header />
                <Routes>
                    {routes}
                </Routes>
                <Footer />
            </BrowserRouter>
        </ThemeProvider>
    );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
