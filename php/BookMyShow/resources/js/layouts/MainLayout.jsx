import React from 'react';
import Header from '../Header';
import Footer from '../Footer';

function MainLayout({ children, pageTitle }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header pageTitle={pageTitle} />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default MainLayout;
