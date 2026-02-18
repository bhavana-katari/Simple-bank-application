import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Info,
  Landmark,
  History,
  TrendingUp,
  PlusCircle,
  AlertCircle,
  LogIn,
  UserPlus,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bank } from './logic/Bank';
import { SavingsAccount } from './logic/SavingsAccount';
import { CurrentAccount } from './logic/CurrentAccount';
import { Account } from './logic/Account';

type View = 'landing' | 'create' | 'login' | 'dashboard';

function App() {
  const [bank] = useState(new Bank());
  const [accounts, setAccounts] = useState<Account[]>([]); // Keep accounts in state
  const [currentView, setCurrentView] = useState<View>('landing');
  const [activeAccountNum, setActiveAccountNum] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // Computed active account
  const activeAccount = activeAccountNum ? bank.getAccount(activeAccountNum) : null;

  // Form states
  const [accNum, setAccNum] = useState('');
  const [accName, setAccName] = useState('');
  const [balance, setBalance] = useState('');
  const [limit, setLimit] = useState('');
  const [createType, setCreateType] = useState<'savings' | 'current'>('savings');

  // Transaction state
  const [transAmount, setTransAmount] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('bank_accounts');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Clear current bank accounts to avoid duplicates on re-mount
      bank.getAllAccounts().length = 0;
      parsed.forEach((a: any) => {
        if (a.type === 'SavingsAccount') {
          bank.addAccount(new SavingsAccount(a.accountNumber, a.accountHolder, a.balance));
        } else {
          bank.addAccount(new CurrentAccount(a.accountNumber, a.accountHolder, a.balance, a.overdraftLimit));
        }
      });
      setAccounts([...bank.getAllAccounts()]);
    }
  }, [bank]);

  const saveToStorage = () => {
    const data = bank.getAllAccounts().map(acc => {
      const details = acc.getDetails();
      if (acc instanceof CurrentAccount) {
        return { ...details, overdraftLimit: acc.getOverdraftLimit() };
      }
      return details;
    });
    localStorage.setItem('bank_accounts', JSON.stringify(data));
  };

  const notify = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const initialBalance = parseFloat(balance);
      if (isNaN(initialBalance)) throw new Error("Invalid balance");

      if (createType === 'savings') {
        if (initialBalance < 1000) {
          notify("Savings account requires min $1000", "error");
          return;
        }
        bank.addAccount(new SavingsAccount(accNum, accName, initialBalance));
      } else {
        bank.addAccount(new CurrentAccount(accNum, accName, initialBalance, parseFloat(limit) || 0));
      }
      setAccounts([...bank.getAllAccounts()]);
      saveToStorage();
      notify("Account created successfully!", "success");
      setCurrentView('landing');
      resetForms();
    } catch (err) {
      notify("Creation failed. Please check your inputs.", "error");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const acc = bank.getAccount(accNum);
    if (acc && acc.getDetails().accountHolder.toLowerCase() === accName.toLowerCase()) {
      setActiveAccountNum(acc.getAccountNumber());
      setCurrentView('dashboard');
      notify("Login successful!", "success");
    } else {
      notify("Invalid Account Number or Name", "error");
    }
  };

  const handleTransaction = (type: 'deposit' | 'withdraw') => {
    if (!activeAccount || !transAmount) return;
    const amount = parseFloat(transAmount);
    if (isNaN(amount) || amount <= 0) {
      notify("Please enter a valid amount", "error");
      return;
    }

    if (type === 'deposit') {
      const msg = activeAccount.deposit(amount);
      notify(msg, "success");
    } else {
      const res = activeAccount.withdraw(amount);
      notify(res.message, res.success ? "success" : "error");
    }

    saveToStorage();
    setTransAmount('');
    // Trigger re-render by updating accounts state
    setAccounts([...bank.getAllAccounts()]);
  };

  const handleAddInterest = () => {
    if (activeAccount instanceof SavingsAccount) {
      const msg = activeAccount.calculateInterest(5);
      notify(msg, "success");
      saveToStorage();
      setAccounts([...bank.getAllAccounts()]);
    }
  };

  const resetForms = () => {
    setAccNum('');
    setAccName('');
    setBalance('');
    setLimit('');
  };

  const logout = () => {
    setActiveAccountNum(null);
    setCurrentView('landing');
    resetForms();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-12 min-h-screen flex flex-col justify-center">
      <AnimatePresence mode="wait">

        {/* Landing View */}
        {currentView === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold tracking-tight mb-4">NexBank <span className="text-indigo-500">Fusion</span></h1>
            <p className="text-xl text-slate-400 mb-12">Premium Digital Banking Experience</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <button
                onClick={() => setCurrentView('create')}
                className="glass-card p-8 flex flex-col items-center gap-4 hover:border-indigo-500 group"
              >
                <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  <UserPlus size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Open New Account</h3>
                  <p className="text-sm text-slate-400 mt-1">Start your journey with us today</p>
                </div>
              </button>

              <button
                onClick={() => setCurrentView('login')}
                className="glass-card p-8 flex flex-col items-center gap-4 hover:border-emerald-500 group"
              >
                <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <LogIn size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Already a Member</h3>
                  <p className="text-sm text-slate-400 mt-1">Access your account dashboard</p>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* Create Account View */}
        {currentView === 'create' && (
          <motion.div
            key="create"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card p-8 md:p-12 max-w-xl mx-auto w-full"
          >
            <button onClick={() => setCurrentView('landing')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
              <ChevronLeft size={20} /> Back to Landing
            </button>
            <h2 className="text-3xl font-bold mb-8">Create New Account</h2>

            <div className="flex gap-4 mb-8 p-1 bg-white/5 rounded-2xl">
              <button
                onClick={() => setCreateType('savings')}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${createType === 'savings' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Savings
              </button>
              <button
                onClick={() => setCreateType('current')}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${createType === 'current' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Current
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4">
              <input required className="input-glass" placeholder="Account Number" value={accNum} onChange={e => setAccNum(e.target.value)} />
              <input required className="input-glass" placeholder="Account Holder Full Name" value={accName} onChange={e => setAccName(e.target.value)} />
              <input required type="number" className="input-glass" placeholder={createType === 'savings' ? "Initial Deposit (Min $1000)" : "Initial Deposit"} value={balance} onChange={e => setBalance(e.target.value)} />
              {createType === 'current' && (
                <input required type="number" className="input-glass" placeholder="Overdraft Limit" value={limit} onChange={e => setLimit(e.target.value)} />
              )}
              <button type="submit" className="btn-primary w-full justify-center text-lg py-4 mt-4">
                Verify & Create Account
              </button>
            </form>
          </motion.div>
        )}

        {/* Login View */}
        {currentView === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card p-8 md:p-12 max-w-xl mx-auto w-full"
          >
            <button onClick={() => setCurrentView('landing')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
              <ChevronLeft size={20} /> Back to Landing
            </button>
            <h2 className="text-3xl font-bold mb-8">Member Login</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-slate-400 ml-1">Account Number</label>
                <input required className="input-glass" placeholder="Enter your account number" value={accNum} onChange={e => setAccNum(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400 ml-1">Account Holder Name</label>
                <input required className="input-glass" placeholder="Full Name as registered" value={accName} onChange={e => setAccName(e.target.value)} />
              </div>
              <button type="submit" className="btn-primary w-full justify-center text-lg py-4 mt-4">
                <LogIn size={20} /> Open Dashboard
              </button>
            </form>
          </motion.div>
        )}

        {/* Dashboard View */}
        {currentView === 'dashboard' && activeAccount && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full space-y-8"
          >
            <header className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold">Welcome, {activeAccount.getDetails().accountHolder}</h2>
                <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">{activeAccount.getAccountNumber()}</p>
              </div>
              <button onClick={logout} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 font-semibold">
                <LogOut size={20} /> Logout
              </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Account Summary Card */}
              <div className="lg:col-span-2 glass-card p-10 flex flex-col justify-between bg-gradient-to-br from-indigo-500/10 to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Landmark size={120} />
                </div>
                <div>
                  <p className="text-sm text-indigo-400 font-bold uppercase tracking-widest mb-4">
                    {activeAccount instanceof SavingsAccount ? 'Savings Account' : 'Current Account'}
                  </p>
                  <h3 className="text-6xl font-bold tracking-tighter">
                    ${activeAccount.getBalance().toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h3>
                </div>
                <div className="mt-12 flex gap-8">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Status</p>
                    <p className="text-emerald-500 font-semibold flex items-center gap-1"><TrendingUp size={14} /> Active</p>
                  </div>
                  {activeAccount instanceof CurrentAccount && (
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold mb-1">Overdraft Limit</p>
                      <p className="text-slate-200 font-semibold">${activeAccount.getOverdraftLimit()}</p>
                    </div>
                  )}
                  {activeAccount instanceof SavingsAccount && (
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold mb-1">Interest Rate</p>
                      <p className="text-emerald-500 font-semibold">5% APY</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Transaction panel */}
              <div className="glass-card p-8 space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <History size={20} className="text-indigo-400" /> Transactions
                </h3>

                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Amount</label>
                  <input
                    type="number"
                    className="input-glass py-3"
                    placeholder="0.00"
                    value={transAmount}
                    onChange={e => setTransAmount(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => handleTransaction('deposit')}
                    className="btn-primary w-full justify-center bg-emerald-500 hover:bg-emerald-600 h-14"
                  >
                    <ArrowUpRight size={20} /> Deposit Funds
                  </button>
                  <button
                    onClick={() => handleTransaction('withdraw')}
                    className="btn-primary w-full justify-center bg-slate-700 hover:bg-slate-600 h-14"
                  >
                    <ArrowDownLeft size={20} /> Withdraw Funds
                  </button>
                  {activeAccount instanceof SavingsAccount && (
                    <button
                      onClick={handleAddInterest}
                      className="mt-2 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <TrendingUp size={18} /> Apply Monthly Interest
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Account Details Box */}
            <div className="glass-card p-8">
              <h4 className="font-bold flex items-center gap-2 mb-6">
                <Info size={18} className="text-indigo-400" /> Account Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                <div>
                  <p className="text-slate-500 mb-1">Account Holder</p>
                  <p className="text-lg font-semibold">{activeAccount.getDetails().accountHolder}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Account Number</p>
                  <p className="text-lg font-semibold font-mono tracking-wider">{activeAccount.getAccountNumber()}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Created Date</p>
                  <p className="text-lg font-semibold">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-4 rounded-full shadow-2xl z-[100] flex items-center gap-3 border font-medium ${notification.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
          >
            {notification.type === 'success' ? <PlusCircle size={20} /> : <AlertCircle size={20} />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
