import React from 'react';
import Header from '../Header';
import Footer from '../Footer';

function MainLayout({ children, pageTitle }) {
    return (
        <>
            <Header pageTitle={pageTitle} />
            {children}
            <Footer />
        </>
    );
}

export default MainLayout;
