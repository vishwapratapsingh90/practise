import React from 'react';
import { Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import CustomerDashboard from './pages/customer/Dashboard';

export const routes = (
    <>
        <Route path="/" element={<MainLayout pageTitle="Home"><Home /></MainLayout>} />
        <Route path="/login" element={<MainLayout pageTitle="Login"><Login /></MainLayout>} />
        <Route path="/admin/dashboard" element={<MainLayout pageTitle="Admin Dashboard"><AdminDashboard /></MainLayout>} />
        <Route path="/customer/dashboard" element={<MainLayout pageTitle="Customer Dashboard"><CustomerDashboard /></MainLayout>} />
    </>
);
