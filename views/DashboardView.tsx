
import React from 'react';
import { ICONS, MOCK_QUESTIONS, MOCK_ADMINS } from '../constants';
import { QuestionType } from '../types';

const DashboardView: React.FC = () => {
  // Calculated stats based on existing data
  const totalQuestions = MOCK_QUESTIONS.length;
  const activeQuestions = MOCK_QUESTIONS.filter(q => q.status === 'active').length;
  const totalAdmins = MOCK_ADMINS.length;
  const listeningQuestions = MOCK_QUESTIONS.filter(q => q.type === QuestionType.LISTENING).length;

  const mainStats = [
    { label: 'Total Test Assets', value: totalQuestions, icon: ICONS.PlacementTests, color: 'bg-indigo-600', sub: 'Questions in database' },
    { label: 'Active Items', value: activeQuestions, icon: ICONS.Show, color: 'bg-emerald-600', sub: 'Publicly accessible' },
    { label: 'Authorized Admins', value: totalAdmins, icon: ICONS.Admins, color: 'bg-slate-900', sub: 'Management accounts' },
    { label: 'Listening Media', value: listeningQuestions, icon: ICONS.Import, color: 'bg-amber-500', sub: 'Audio linked assets' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">CMS Overview</h2>
        <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em] mt-1">Placement Test & Admin Management Portal</p>
      </div>

      {/* Top Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((s, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
            <div className={`w-12 h-12 rounded-2xl text-white flex items-center justify-center shadow-lg ${s.color} group-hover:scale-110 transition-transform mb-6`}>
              {s.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
              <span className="text-4xl font-black text-slate-900 tracking-tighter">{s.value}</span>
              <p className="text-xs text-slate-400 font-medium mt-1">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Placement Test Summary */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
            Section 2.1: Test Asset Distribution
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                  {ICONS.PlacementTests}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-wider">Structured Entry Count</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Database items (CRUD enabled)</p>
                </div>
              </div>
              <span className="text-lg font-black text-slate-900">{totalQuestions}</span>
            </div>

            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
                  {ICONS.Import}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-wider">Media Association Rate</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Audio/Image linked topics</p>
                </div>
              </div>
              <span className="text-lg font-black text-slate-900">
                {Math.round((MOCK_QUESTIONS.filter(q => q.mediaUrl).length / totalQuestions) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Account Registry Summary */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-white border border-white/5">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px]"></div>
          <h3 className="text-xl font-black mb-8 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-white rounded-full"></div>
            Section 2.2: Management Access
          </h3>
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-indigo-400">
                  {ICONS.Admins}
                </div>
                <div>
                  <p className="text-sm font-black text-white uppercase tracking-wider">Internal Admin Users</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Assigned designated accounts</p>
                </div>
              </div>
              <span className="text-2xl font-black text-white">{totalAdmins}</span>
            </div>

            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>Access Levels</span>
                <span className="text-white">Active Registry</span>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-[10px] font-black rounded-lg border border-indigo-500/20 uppercase">Super Admin: 1</span>
                <span className="px-3 py-1 bg-slate-700 text-slate-400 text-[10px] font-black rounded-lg border border-slate-600 uppercase">Standard Admin: {totalAdmins - 1}</span>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">
                System Initialized with Hardcoded Root Admin
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
