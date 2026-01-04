import React, { createContext, useContext, useEffect } from 'react';
import { theme } from './theme';
import { initFlowbite } from 'flowbite';

const ThemeContext = createContext(theme);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    useEffect(() => {
        // Initialize Flowbite components (modals, dropdowns, etc.)
        initFlowbite();
    }, []);

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};
