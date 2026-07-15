import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center items-center p-4 font-sans relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-1/4 w-[40%] h-[40%] bg-[#ffcc00] rounded-full blur-[150px] opacity-[0.07] pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-[#111111] rounded-2xl p-8 shadow-2xl z-10 relative border border-[#333333]">
        <div className="flex justify-center mb-6">
          <div className="bg-[#ffcc00]/10 p-4 rounded-full border border-[#ffcc00]/20">
            <Lock className="text-[#ffcc00]" size={32} strokeWidth={2} />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-wide uppercase">
          Omega <span className="text-[#ffcc00]">Resume</span>
        </h2>
        <p className="text-center text-gray-400 mb-8 text-sm font-mono tracking-wider">SECURE ACCESS REQUIRED</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center font-mono">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-[#ffcc00] focus:border-[#ffcc00] transition-all placeholder:text-gray-600 font-mono"
              placeholder="Enter your identifier"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-[#ffcc00] focus:border-[#ffcc00] transition-all placeholder:text-gray-600 font-mono"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#ffcc00] hover:bg-[#e6b800] text-black font-bold tracking-widest uppercase rounded-xl px-4 py-3.5 transition-all mt-6 text-sm font-mono shadow-[0_0_15px_rgba(255,204,0,0.3)] hover:shadow-[0_0_25px_rgba(255,204,0,0.5)]"
          >
            Authenticate
          </button>
        </form>
        
        <div className="mt-8 text-center pt-6 border-t border-[#333333]">
          <p className="text-xs text-gray-500 font-mono">
            TEST CREDENTIALS: <strong className="text-[#ffcc00] font-normal">admin</strong> / <strong className="text-[#ffcc00] font-normal">password</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
