import React from 'react';
import { Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Registration from './pages/Registration';
import AdminDashboard from './pages/admin/Dashboard';
import CustomerDashboard from './pages/customer/Dashboard';

const t = window.config?.translations?.messages || {};

export const routes = (
    <>
        <Route path="/" element={<MainLayout pageTitle={window.config?.appName || 'React App'}><Home /></MainLayout>} />
        <Route path="/login" element={<MainLayout pageTitle={t.login || "Login"}><Login /></MainLayout>} />
        <Route path="/registration" element={<MainLayout pageTitle={t.registration || "Registration"}><Registration /></MainLayout>} />
        <Route path="/admin/dashboard" element={<MainLayout pageTitle={t.adminDashboard || "Admin Dashboard"}><AdminDashboard /></MainLayout>} />
        <Route path="/customer/dashboard" element={<MainLayout pageTitle={t.customerDashboard || "Customer Dashboard"}><CustomerDashboard /></MainLayout>} />
    </>
);
