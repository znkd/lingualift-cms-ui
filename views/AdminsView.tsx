
import React, { useState } from 'react';
import { MOCK_ADMINS, ICONS } from '../constants';

const AdminsView: React.FC = () => {
  const [admins, setAdmins] = useState(MOCK_ADMINS);

  const toggleStatus = (id: string) => {
    setAdmins(admins.map(a => 
      a.id === id ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Admin Accounts</h2>
          <p className="text-slate-500 font-medium">Section 2.2: Managing internal authorized personnel.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all font-black text-sm shadow-xl shadow-slate-200 active:scale-95">
          {ICONS.Add}
          Create Admin Account
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Authorized Personnel Registry</p>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-white border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Username</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Authority Level</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Auth Login</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Security Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {admins.map((admin) => (
              <tr key={admin.id} className={`hover:bg-slate-50/50 transition-all ${admin.status === 'inactive' ? 'opacity-60' : ''}`}>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm uppercase shadow-lg shadow-indigo-100">
                      {admin.username.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-900">{admin.username}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${
                    admin.role === 'super' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {admin.role} ACCESS
                  </span>
                </td>
                <td className="px-6 py-5 text-sm font-bold text-slate-400">{admin.lastLogin || 'Never'}</td>
                <td className="px-6 py-5 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    admin.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${admin.status === 'active' ? 'bg-green-600' : 'bg-red-500'}`}></span>
                    {admin.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                   <div className="flex items-center justify-end gap-1">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-all">{ICONS.Edit}</button>
                    <button 
                      onClick={() => toggleStatus(admin.id)}
                      className={`p-2 transition-all ${admin.status === 'active' ? 'text-slate-400 hover:text-red-600' : 'text-green-500 hover:text-green-700'}`}
                    >
                      {admin.status === 'active' ? ICONS.Delete : ICONS.Show}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex items-center gap-4">
        <div className="w-10 h-10 bg-indigo-200 rounded-xl flex items-center justify-center text-indigo-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div>
          <p className="text-sm font-black text-indigo-900 uppercase tracking-widest">Security Note</p>
          <p className="text-sm text-indigo-700">New admins must be manually added by a Super Admin. Self-registration is strictly disabled to prevent unauthorized access.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminsView;
