"use client";
import { useState } from 'react';
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8FAFB' }}>
      <div className="w-full max-w-md p-8">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold mb-2" style={{ color: '#23272F' }}>Rate My Broker.</h1>
          <p className="text-sm" style={{ color: '#A3A9B6' }}>Welcome back! Please enter your details.</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-sm p-8" style={{ border: '1px solid #E5E7EB' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#23272F' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border text-sm"
                style={{ 
                  background: '#F8FAFB',
                  border: '1px solid #E5E7EB',
                  color: '#23272F'
                }}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#23272F' }}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border text-sm pr-10"
                  style={{ 
                    background: '#F8FAFB',
                    border: '1px solid #E5E7EB',
                    color: '#23272F'
                  }}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-300"
                  style={{ color: '#E9F366' }}
                  disabled={isLoading}
                />
                <label htmlFor="remember" className="ml-2 text-sm" style={{ color: '#A3A9B6' }}>
                  Remember me
                </label>
              </div>
              <Link href="/auth/forgot-password" className="text-sm font-medium" style={{ color: '#23272F' }}>
                Forgot password?
              </Link>
            </div>
            {(error || authError) && (
              <div className="text-sm text-red-600 text-center">{error || authError}</div>
            )}
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-lg font-semibold text-white text-sm transition"
              style={{ 
                background: '#23272F',
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: '#E5E7EB' }}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2" style={{ background: 'white', color: '#A3A9B6' }}>
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button
              className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg border text-sm font-medium transition"
              style={{ 
                borderColor: '#E5E7EB',
                color: '#23272F',
                background: '#F8FAFB',
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
              disabled={isLoading}
            >
              <FaGoogle />
              Google
            </button>
            <button
              className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg border text-sm font-medium transition"
              style={{ 
                borderColor: '#E5E7EB',
                color: '#23272F',
                background: '#F8FAFB',
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
              disabled={isLoading}
            >
              <FaGithub />
              GitHub
            </button>
          </div>
        </div>

        {/* Register Link */}
        <p className="text-center mt-6 text-sm" style={{ color: '#A3A9B6' }}>
          Don't have an account?{' '}
          <Link href="/auth/register" className="font-medium" style={{ color: '#23272F' }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
} 