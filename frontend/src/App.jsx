import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import PostDetail from './pages/PostDetail';
import PostCreate from './pages/PostCreate';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';
import Chat from './pages/Chat';

function App() {
  const { loading, token } = useAuth();

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', paddingTop: '100px' }}><span className="loader"></span></div>;
  }

  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={!token ? <Home /> : <Navigate to="/feed" />} />
          <Route path="/login" element={!token ? <Auth isLogin={true} /> : <Navigate to="/feed" />} />
          <Route path="/register" element={!token ? <Auth isLogin={false} /> : <Navigate to="/feed" />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/post/create" element={<PostCreate />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/post/:id/edit" element={<PostCreate isEdit={true} />} />
            <Route path="/chat" element={<Chat />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
