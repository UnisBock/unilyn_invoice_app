import React, { useState } from 'react';
import { LogIn, Shield, User as UserIcon, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import logo from '../assets/logo.png';

interface LoginPageProps {
  onLogin: (username: string, password: string) => Promise<void>;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await onLogin(username, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden"
      >
        <div className="bg-stone-900 p-8 text-white text-center">
          <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden p-2">
            <img src={logo} alt="Unilyn Media Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Unilyn Media</h1>
          <p className="text-stone-400 text-sm mt-1">Invoice Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                <UserIcon className="w-3 h-3" />
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-3 h-3" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 text-center"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-all shadow-lg shadow-stone-200 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            )}
          </button>

          <div className="pt-4 text-center">
            <p className="text-xs text-stone-400 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              Secure Admin Access Only
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
