import React, { useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem('dod_admin_auth');
    if (!isAuth) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('dod_admin_auth');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <nav className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/admin" className="text-xl font-black text-indigo-400">D&D ADMIN</Link>
          <div className="flex gap-4 text-sm font-bold">
            <Link to="/admin/dares" className="hover:text-white text-slate-400">Dares</Link>
            <Link to="/admin/dodges" className="hover:text-white text-slate-400">Dodges</Link>
            <Link to="/admin/difficulties" className="hover:text-white text-slate-400">Difficulty</Link>
            <Link to="/admin/patterns" className="hover:text-white text-slate-400">Patterns</Link>
            <button onClick={handleLogout} className="text-rose-500 hover:text-rose-400 ml-4">Logout</button>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;