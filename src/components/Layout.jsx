import React from 'react';
import Header from '@components/Header';
import Footer from '@components/Footer';

export default function Layout({
    children,
    showHeader = true,
    showFooter = true
}) {
    return (
        <div className='app-container'>
            {showHeader && <Header />}
            <main className='main-content'>{children}</main>
            {showFooter && <Footer />}
        </div>
    );
}

