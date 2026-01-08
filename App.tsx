
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import DashboardView from './views/DashboardView';
import PlacementTestsView from './views/PlacementTestsView';
import AdminsView from './views/AdminsView';
import LessonsView from './views/LessonsView';

const TOKEN_KEY = 'linguaLift_admin_token';
const EXPIRY_KEY = 'linguaLift_token_expiry';
const REMEMBER_ME_KEY = 'linguaLift_remember_me';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [loginForm, setLoginForm] = useState({ username: '', password: '', rememberMe: false });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const expiry = localStorage.getItem(EXPIRY_KEY);
      
      if (token && expiry) {
        if (Date.now() < parseInt(expiry)) {
          setIsAuthenticated(true);
        } else {
          handleLogout();
        }
      }
    };
    checkAuth();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Aligned with Section 2.2: Assigned Admin Login Only
    setTimeout(() => {
      if (loginForm.username === 'admin' && loginForm.password === 'admin') {
        const eightHours = 8 * 60 * 60 * 1000;
        const expiryTime = Date.now() + eightHours;
        
        localStorage.setItem(TOKEN_KEY, 'mock_jwt_token_auth_verified');
        localStorage.setItem(EXPIRY_KEY, expiryTime.toString());
        if (loginForm.rememberMe) {
          localStorage.setItem(REMEMBER_ME_KEY, loginForm.username);
        }
        
        setIsAuthenticated(true);
      } else {
        alert('Authentication Failed: Invalid Credentials.');
      }
      setIsLoading(false);
    }, 1200);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    setActiveTab('dashboard');
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'lessons': return <LessonsView />;
      case 'placement-tests': return <PlacementTestsView />;
      case 'admins': return <AdminsView />;
      default: return <DashboardView />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-10 border border-white/10">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] mx-auto flex items-center justify-center text-white text-4xl font-black mb-6 shadow-2xl shadow-indigo-500/30">L</div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">LinguaLift CMS</h1>
              <p className="text-slate-500 mt-3 font-bold uppercase text-[10px] tracking-[0.2em]">Authorized Access Only</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin Username</label>
                <input 
                  type="text" 
                  required
                  placeholder="admin"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-bold"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-bold"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                />
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={loginForm.rememberMe}
                    onChange={(e) => setLoginForm({...loginForm, rememberMe: e.target.checked})}
                    className="w-5 h-5 accent-indigo-600 rounded-lg cursor-pointer transition-all" 
                  />
                  <span className="text-xs font-black text-slate-500 group-hover:text-indigo-600 transition-colors uppercase tracking-wider">Keep Session Alive</span>
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-70 active:scale-[0.97]"
              >
                {isLoading ? (
                  <span className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : 'Secure Portal Login'}
              </button>
            </form>
          </div>
          <p className="text-center text-slate-500 mt-8 text-xs font-black uppercase tracking-widest">
            &copy; 2026 LinguaLift CMS Operational Portal
          </p>
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
      {renderActiveView()}
    </Layout>
  );
};

export default App;
