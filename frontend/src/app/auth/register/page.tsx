"use client";
import { useState } from 'react';
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register, error: authError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await register(name, email, password);
    } catch (err: any) {
      if (err && typeof err === 'object' && Array.isArray(err.errors)) {
        setError(err); // Store the whole error object
      } else if (err && typeof err === 'object' && 'message' in err) {
        setError((err as any).message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed');
      }
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
          <p className="text-sm" style={{ color: '#A3A9B6' }}>Create your account to get started.</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-sm p-8" style={{ border: '1px solid #E5E7EB' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#23272F' }}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border text-sm"
                style={{ 
                  background: '#F8FAFB',
                  border: '1px solid #E5E7EB',
                  color: '#23272F'
                }}
                placeholder="Enter your full name"
                required
                disabled={isLoading}
              />
            </div>
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
                  placeholder="Create a password"
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
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#23272F' }}>Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border text-sm pr-10"
                  style={{ 
                    background: '#F8FAFB',
                    border: '1px solid #E5E7EB',
                    color: '#23272F'
                  }}
                  placeholder="Confirm your password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            {/* Error display logic */}
            {typeof error === 'object' && error !== null && Array.isArray((error as any).errors) ? (
              <ul className="text-sm text-red-600 text-center mt-2">
                {(error as any).errors.map((e: any, idx: number) => (
                  <li key={idx}>{e.message}</li>
                ))}
              </ul>
            ) : error && (
              <div className="text-sm text-red-600 text-center">{error}</div>
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
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-indigo-700">Terms of Service</Link> and{' '}
              <Link href="/privacy" className="underline hover:text-indigo-700">Privacy Policy</Link>.
            </p>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center mt-6 text-sm" style={{ color: '#A3A9B6' }}>
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium" style={{ color: '#23272F' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
} 