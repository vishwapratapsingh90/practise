import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { useTheme } from './ThemeContext';

function Header() {
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <div className={`${theme.classes.flexBetween} ${theme.classes.px.lg} ${theme.classes.py.md} ${theme.classes.bgHeader} ${theme.classes.shadow.sm}`}>
            <button
                onClick={() => navigate('/')}
                className={theme.classes.btnIcon}
            >
                <FaHome />
            </button>
            <div className="text-lg font-medium text-gray-900">
                Welcome Guest!
            </div>
        </div>
    );
}

export default Header;
