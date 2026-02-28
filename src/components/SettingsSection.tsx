import React, { useState } from 'react';
import { Settings as SettingsIcon, Globe, Mail, Phone, MapPin, DollarSign, Save, Shield, UserPlus, Trash2 } from 'lucide-react';
import { BUSINESS_INFO } from '../constants';
import { User } from '../types';
import { motion } from 'motion/react';

interface SettingsSectionProps {
  settings: typeof BUSINESS_INFO;
  users: User[];
  onUpdateSettings: (settings: typeof BUSINESS_INFO) => Promise<void>;
  onAddUser: (username: string, password: string, role: 'admin' | 'user') => Promise<void>;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ settings, users, onUpdateSettings, onAddUser }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user');
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await onUpdateSettings(localSettings);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingUser(true);
    try {
      await onAddUser(newUsername, newPassword, newRole);
      setNewUsername('');
      setNewPassword('');
    } finally {
      setIsAddingUser(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight text-stone-900 flex items-center gap-3">
          <SettingsIcon className="w-6 h-6 text-amber-600" />
          Settings
        </h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Business Info */}
        <section className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-600" />
            Business Information
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Business Name</label>
              <input
                type="text"
                value={localSettings.name}
                onChange={(e) => setLocalSettings({ ...localSettings, name: e.target.value })}
                className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Email</label>
                <input
                  type="email"
                  value={localSettings.email}
                  onChange={(e) => setLocalSettings({ ...localSettings, email: e.target.value })}
                  className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Website</label>
                <input
                  type="text"
                  value={localSettings.website}
                  onChange={(e) => setLocalSettings({ ...localSettings, website: e.target.value })}
                  className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Address</label>
              <input
                type="text"
                value={localSettings.address}
                onChange={(e) => setLocalSettings({ ...localSettings, address: e.target.value })}
                className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Currency Code</label>
                <input
                  type="text"
                  value={localSettings.currency}
                  onChange={(e) => setLocalSettings({ ...localSettings, currency: e.target.value })}
                  className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-all shadow-lg shadow-stone-200 disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </section>

        {/* User Management */}
        <section className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-600" />
            User Management
          </h3>

          <form onSubmit={handleAddUser} className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-4">
            <h4 className="text-sm font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add New User
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="px-4 py-2 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="px-4 py-2 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>
            <div className="flex items-center gap-4">
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as 'admin' | 'user')}
                className="px-4 py-2 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button
                type="submit"
                disabled={isAddingUser}
                className="flex-1 px-6 py-2 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all shadow-md shadow-amber-100 disabled:opacity-50"
              >
                {isAddingUser ? 'Adding...' : 'Add User'}
              </button>
            </div>
          </form>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Existing Users</h4>
            <div className="divide-y divide-stone-100">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center text-stone-500 font-bold text-sm">
                      {user.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 text-sm">{user.username}</p>
                      <p className="text-xs text-stone-400 font-medium uppercase tracking-widest">{user.role}</p>
                    </div>
                  </div>
                  {user.username !== 'admin' && (
                    <button className="p-2 text-stone-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
