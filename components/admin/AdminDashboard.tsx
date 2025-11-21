import React from 'react';
import { Link } from 'react-router-dom';

const DashboardCard: React.FC<{ title: string; desc: string; link: string; color: string }> = ({ title, desc, link, color }) => (
  <Link to={link} className={`block p-6 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 transition-all hover:scale-[1.02] hover:shadow-xl`}>
    <h3 className={`text-xl font-black mb-2 ${color}`}>{title}</h3>
    <p className="text-slate-400 text-sm">{desc}</p>
  </Link>
);

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard 
          title="Manage Dares" 
          desc="Add, edit, or remove dare cards." 
          link="/admin/dares" 
          color="text-indigo-400" 
        />
        <DashboardCard 
          title="Manage Dodges" 
          desc="Add, edit, or remove dodge penalties." 
          link="/admin/dodges" 
          color="text-rose-400" 
        />
        <DashboardCard 
          title="Difficulty Presets" 
          desc="Configure difficulty groups." 
          link="/admin/difficulties" 
          color="text-emerald-400" 
        />
        <DashboardCard 
          title="Card Patterns" 
          desc="Script card sequences for specific scenarios." 
          link="/admin/patterns" 
          color="text-amber-400" 
        />
      </div>
      <div className="mt-12 pt-12 border-t border-slate-800">
         <Link to="/" className="text-slate-500 hover:text-white underline">← Return to Game</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;