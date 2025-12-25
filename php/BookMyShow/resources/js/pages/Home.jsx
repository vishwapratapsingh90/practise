import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';

function Home() {
    const navigate = useNavigate();
    const theme = useTheme();
    const t = window.config?.translations?.messages || {};

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center ${theme.classes.bgPrimary} text-white text-center ${theme.classes.p.md}`}>
            <h1 className="underline text-6xl mb-5 font-bold">
                {window.config?.appName || 'React App'}
            </h1>
            <p className="text-2xl mb-10 max-w-2xl">
                {t.welcome_title}. {t.welcome_subtitle}
            </p>

            <button
                onClick={() => navigate('/login')}
                className={theme.classes.btnPrimary}
            >
                {t.login_signup || 'Login / Sign Up'}
            </button>

            <div className={`${theme.classes.mt.xl} flex ${theme.classes.gap.lg} flex-wrap justify-center`}>
                <div className="text-center">
                    <div className="text-5xl mb-2.5">🎬</div>
                    <h3>{t.movies || 'Movies'}</h3>
                    <p className="text-sm opacity-90">{t.movies_desc || 'Latest releases'}</p>
                </div>
                <div className="text-center">
                    <div className="text-5xl mb-2.5">🎭</div>
                    <h3>{t.events || 'Events'}</h3>
                    <p className="text-sm opacity-90">{t.events_desc || 'Live shows'}</p>
                </div>
                <div className="text-center">
                    <div className="text-5xl mb-2.5">🎪</div>
                    <h3>{t.theater || 'Theater'}</h3>
                    <p className="text-sm opacity-90">{t.theater_desc || 'Stage plays'}</p>
                </div>
            </div>
        </div>
    );
}

export default Home;
