import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes } from 'react-router-dom';
import { routes } from './routes.config';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {routes}
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
