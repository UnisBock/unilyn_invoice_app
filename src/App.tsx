import React, { useState, useEffect } from 'react';
import { Download, Printer, Settings, History, LayoutDashboard, LogOut, Sparkles, User as UserIcon } from 'lucide-react';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import { HistorySection } from './components/HistorySection';
import { SettingsSection } from './components/SettingsSection';
import { LoginPage } from './components/LoginPage';
import { DEFAULT_INVOICE_DATA, BUSINESS_INFO } from './constants';
import { InvoiceData, AuthState, User } from './types';
import { generatePDF, generateDeliveryNote } from './utils/pdfGenerator';
import { motion, AnimatePresence } from 'motion/react';

import logo from './assets/logo.png';

type View = 'create' | 'history' | 'settings';

export default function App() {
  const [view, setView] = useState<View>('create');
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(DEFAULT_INVOICE_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [auth, setAuth] = useState<AuthState>({ user: null, isAuthenticated: false });
  const [history, setHistory] = useState<InvoiceData[]>([]);
  const [settings, setSettings] = useState(BUSINESS_INFO);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchInvoices();
      fetchSettings();
      fetchNextInvoiceNumber();
      if (auth.user?.role === 'admin') {
        fetchUsers();
      }
    }
  }, [auth.isAuthenticated]);

  const fetchInvoices = async () => {
    const res = await fetch('/api/invoices');
    const data = await res.json();
    setHistory(data);
  };

  const fetchSettings = async () => {
    const res = await fetch('/api/settings');
    const data = await res.json();
    if (Object.keys(data).length > 0) {
      setSettings(prev => ({ ...prev, ...data }));
    }
  };

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
  };

  const fetchNextInvoiceNumber = async () => {
    const res = await fetch('/api/invoices/next-number');
    const { nextNumber } = await res.json();
    setInvoiceData(prev => ({ ...prev, invoiceNumber: nextNumber }));
  };

  const handleLogin = async (username: string, password: string) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) {
      setAuth({ user: data.user, isAuthenticated: true });
    } else {
      throw new Error(data.message);
    }
  };

  const handleUpdateSettings = async (newSettings: any) => {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    });
    setSettings(newSettings);
  };

  const handleAddUser = async (username: string, password: string, role: 'admin' | 'user') => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role })
    });
    const data = await res.json();
    if (data.success) {
      fetchUsers();
    } else {
      throw new Error(data.message);
    }
  };

  const handleSave = async (silent = false) => {
    if (!silent) setIsSaving(true);
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData)
      });
      const data = await res.json();
      if (data.success) {
        fetchInvoices();
        if (!invoiceData.id) {
          fetchNextInvoiceNumber();
        }
        if (!silent) alert('Invoice saved successfully!');
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error('Error saving:', error);
      if (!silent) alert('Error saving: ' + error.message);
    } finally {
      if (!silent) setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await handleSave(true);
      generatePDF(invoiceData);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewInvoice = () => {
    setInvoiceData(DEFAULT_INVOICE_DATA);
    fetchNextInvoiceNumber();
    setView('create');
  };

  if (!auth.isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-sans selection:bg-amber-100">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-stone-200 hidden lg:flex flex-col p-6 z-20">
        <div className="flex items-center justify-center mb-10">
          <div className="w-full aspect-square bg-stone-50 rounded-2xl flex items-center justify-center overflow-hidden p-2 border border-stone-100">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setView('create')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${view === 'create' ? 'bg-amber-50 text-amber-700' : 'text-stone-500 hover:bg-stone-50'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Create Invoice
          </button>
          <button 
            onClick={() => setView('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${view === 'history' ? 'bg-amber-50 text-amber-700' : 'text-stone-500 hover:bg-stone-50'}`}
          >
            <History className="w-5 h-5" />
            History
          </button>
          <button 
            onClick={() => setView('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${view === 'settings' ? 'bg-amber-50 text-amber-700' : 'text-stone-500 hover:bg-stone-50'}`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </nav>

        <div className="pt-6 border-t border-stone-100 space-y-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-stone-50 rounded-xl">
            <div className="w-8 h-8 bg-stone-200 rounded-lg flex items-center justify-center text-stone-500">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-stone-900 truncate">{auth.user?.username}</p>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{auth.user?.role}</p>
            </div>
          </div>
          <button 
            onClick={() => setAuth({ user: null, isAuthenticated: false })}
            className="w-full flex items-center gap-3 px-4 py-3 text-stone-400 hover:text-red-500 transition-all font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 md:p-8 lg:p-12">
        <AnimatePresence mode="wait">
          {view === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-stone-900 mb-2">New Invoice</h1>
                  <p className="text-stone-500 font-medium">Create and manage professional invoices in seconds.</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleNewInvoice}
                    className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all shadow-md shadow-orange-100"
                  >
                    New Invoice
                  </button>
                  <button 
                    onClick={() => handleSave()}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-900 text-white rounded-xl font-semibold hover:bg-blue-950 transition-all shadow-md shadow-blue-900/20 disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50"
                  >
                    <Download className={isGenerating ? "w-4 h-4 animate-bounce" : "w-4 h-4"} />
                    {isGenerating ? 'Generating...' : 'Download'}
                  </button>
                </div>
              </header>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 max-w-7xl">
                <div className="space-y-8">
                  <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-widest mb-4">
                    <Sparkles className="w-4 h-4" />
                    Invoice Editor
                  </div>
                  <InvoiceForm data={invoiceData} onChange={setInvoiceData} />
                </div>
                <div className="hidden xl:block">
                  <div className="flex items-center gap-2 text-stone-400 font-bold text-xs uppercase tracking-widest mb-4">
                    Live Preview
                  </div>
                  <InvoicePreview data={invoiceData} />
                </div>
              </div>
            </motion.div>
          )}

          {view === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <HistorySection 
                invoices={history} 
                onView={(inv) => {
                  setInvoiceData(inv);
                  setView('create');
                }} 
              />
            </motion.div>
          )}

          {view === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SettingsSection 
                settings={settings} 
                users={users}
                onUpdateSettings={handleUpdateSettings}
                onAddUser={handleAddUser}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
