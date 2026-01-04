import React from 'react';
import Header from '../components/Header';
import MenuGroup from '../components/MenuGroup';
import Footer from '../components/Footer';

function MainLayout({ children, pageTitle }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header pageTitle={pageTitle} />
            <MenuGroup />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default MainLayout;
