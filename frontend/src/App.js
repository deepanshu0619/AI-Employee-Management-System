import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';
import AIRecommendations from './components/AIRecommendations';

// Pages
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
};

const PageTransition = ({ children }) => (
  <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
    {children}
  </motion.div>
);
const Dashboard = () => {
  return (
    <PageTransition>
      <div className="container" style={{ marginTop: '2rem' }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Employee Roster</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Manage your workforce with AI-powered insights</p>
        </div>
      </div>
      
      {/* We pass a dummy setter as Dashboard doesn't need all employees state, but AI Insights page will */}
      <EmployeeList />
      </div>
    </PageTransition>
  );
};

const AIPage = () => {
  const [allEmployees, setAllEmployees] = useState([]);
  
  return (
    <PageTransition>
      <div className="container" style={{ marginTop: '2rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>AI Insights Studio</h1>
      <p style={{ color: 'var(--text-muted)', margin: '0 0 2rem 0' }}>Leverage Llama 4 for advanced workforce analytics</p>
      
      {/* EmployeeList fetches data and updates allEmployees state */}
      <div style={{ display: 'none' }}>
        <EmployeeList setAllEmployees={setAllEmployees} />
      </div>
      
      <AIRecommendations employees={allEmployees} />
      </div>
    </PageTransition>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/add" element={
          <ProtectedRoute>
            <PageTransition><EmployeeForm /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/ai" element={
          <ProtectedRoute>
            <AIPage />
          </ProtectedRoute>
        } />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <AnimatedRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
