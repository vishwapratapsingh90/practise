import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';

function Footer() {
    const theme = useTheme();

    return (
        <div className={`${theme.classes.bgFooter} text-gray-100 ${theme.classes.py.md} text-center mt-auto`}>
            <p>&copy; {new Date().getFullYear()} {window.config?.appName || 'React App'}. All rights reserved.</p>
        </div>
    );
}

export default Footer;
