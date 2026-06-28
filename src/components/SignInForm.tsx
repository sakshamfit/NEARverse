import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface SignInFormProps {
  onSignedIn: (user: any) => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({ onSignedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (data.user) {
        onSignedIn(data.user);
        // Optionally redirect to home
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) throw authError;
      // Note: The user will be redirected to the callback URL and handled by auth state change
    } catch (err: any) {
      setError(err.message || 'An error occurred with Google sign-in');
      console.error('Google sign in error:', err);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (data.user) {
        // Send email verification etc.
        alert('Please check your email to complete registration');
        onSignedIn(data.user);
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('Sign up error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20">
        <div className="pt-10 px-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Welcome to Nearverse
            </h2>
            <p className="text-sm text-gray-600">
              Connect with people nearby based on location and skills
            </p>
          </div>
        </div>

        <form className="mt-8 space-y-6 px-8" onSubmit={handleEmailSignIn}>
          <div className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              className="block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6 transition-all duration-200 hover:shadow-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6 transition-all duration-200 hover:shadow-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-all duration-200"
                />
                <span className="ml-2">Remember me</span>
              </label>
            </div>
            {error ? (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            ) : null}
            <button type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus-ring-offset-2 focus-ring-indigo-500 disabled:opacity-50 transition-all duration-200 transform hover:-translate-y-05 active:translate-y-0"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign in with Email'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 px-8 space-y-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center py-3 px-4 border border-gray-200 hover:border-gray-300 text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="w-5 h-5 flex items-center justify-center bg-white rounded-full shadow-sm">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="h-4 w-4" />
              </div>
              <span className="text-gray-800">
                {googleLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-3 w-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Continue with Google'
                )}
              </span>
            </div>
          </button>
        </div>

        <div className="border-t border-gray-200 pt-6 px-8">
          <p className="text-sm text-gray-500">
            Don’t have an account?
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200" onClick={handleSignUp}>
              Sign up
            </a>
          </p>
        </div>

        <div className="pb-8 px-8 text-center text-xs text-gray-400">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
};