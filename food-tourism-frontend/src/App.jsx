import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Import CSS
import './App.css'

// --- AUTH PAGES ---
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'

// --- MERCHANT ACTOR ---
import MerchantLayout from './components/Layout/MerchantLayout';
import Overview from './pages/Merchant/Overview';
import MenuManagement from './pages/Merchant/MenuManagement';
import OrderManagement from './pages/Merchant/OrderManagement';

// --- ADMIN ACTOR ---
import AdminLayout from './components/Layout/AdminLayout';
import AdminStats from './pages/Admin/AdminStats';
import UserManagement from './pages/Admin/UserManagement';
import ApproveStore from './pages/Admin/ApproveStore';
import TourManagement from './pages/Admin/TourManagement';

// --- USER ACTOR ---
import UserLayout from './components/Layout/UserLayout';
import Explore from './pages/User/Explore';
import FoodTourList from './pages/User/FoodTourList';
import RestaurantDetail from './pages/User/RestaurantDetail';
import Profile from './pages/User/Profile';

function App() {
  return (
    <Router>
      <div className="App bg-[#020617]">
        <Routes>
          {/* 1. AUTH ROUTES */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 2. MERCHANT ROUTES */}
          <Route path="/merchant" element={<MerchantLayout />}>
            <Route path="dashboard" element={<Overview />} />
            <Route path="menu" element={<MenuManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
          
          {/* 3. ADMIN ROUTES */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminStats />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="approve" element={<ApproveStore />} />
            <Route path="tours" element={<TourManagement />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* 4. USER/PUBLIC ROUTES */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Explore />} />
            <Route path="tours" element={<FoodTourList />} />
            <Route path="restaurant/:id" element={<RestaurantDetail />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* 5. 404 HANDLING */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App