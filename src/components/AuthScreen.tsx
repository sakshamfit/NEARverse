import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthScreenProps {
  onAuthSuccess: (user: User, profile: any) => void;
}

export function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [profession, setProfession] = useState('Developer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const professions = ['Developer', 'Doctor', 'Chef', 'Electrician', 'Designer', 'Photographer', 'Teacher', 'Mechanic'];

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        // Check if username is taken
        const { data: existing } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username.toLowerCase())
          .single();

        if (existing) {
          throw new Error('Username already taken. Please choose another.');
        }

        // Sign up
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        if (authData.user) {
          // Create profile
          const { error: profileError } = await supabase.from('profiles').insert({
            id: authData.user.id,
            username: username.toLowerCase(),
            name: username,
            profession,
            avatar_color: '#7c3aed',
            trust_score: 50,
            connect_coins: 100,
          });

          if (profileError) throw profileError;

          // Auto login after signup
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single();

            onAuthSuccess(user, profile);
          }
        }
      } else {
        // Login
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (loginError) throw loginError;

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          onAuthSuccess(user, profile);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-text">NEAR</span>
            <span className="logo-world">VERSE</span>
          </div>
          <p className="auth-tagline">Play Online. Work Offline.</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => setMode('signup')}
          >
            Create Account
          </button>
          <button 
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Sign In
          </button>
        </div>

        <form onSubmit={handleAuth} className="auth-form">
          {mode === 'signup' && (
            <>
              <div className="form-group">
                <label>Username (unique)</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="yourname"
                  required
                  minLength={3}
                  maxLength={20}
                  pattern="[a-zA-Z0-9_]+"
                />
                <small>Only letters, numbers and underscores</small>
              </div>

              <div className="form-group">
                <label>Your Profession</label>
                <select 
                  value={profession} 
                  onChange={(e) => setProfession(e.target.value)}
                >
                  {professions.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account & Enter World' : 'Sign In'}
          </button>
        </form>

        {/* Google Login Button */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            margin: '20px 0',
            color: '#64748b',
            fontSize: '13px'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(148,163,184,0.3)' }}></div>
            <span>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(148,163,184,0.3)' }}></div>
          </div>

          <button 
            type="button"
            onClick={async () => {
              setLoading(true);
              setError('');
              try {
                const { error } = await supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: {
                    redirectTo: window.location.origin
                  }
                });
                if (error) throw error;
              } catch (err: any) {
                setError(err.message || 'Google sign-in failed');
                setLoading(false);
              }
            }}
            style={{
              width: '100%',
              padding: '14px',
              background: 'white',
              color: '#222',
              border: '1px solid rgba(148,163,184,0.3)',
              borderRadius: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <span>🔵</span> Continue with Google
          </button>
        </div>

        <div className="auth-footer">
          <p>Every player gets a unique username</p>
          <p className="small">Your avatar will reflect your profession</p>
        </div>
      </div>
    </div>
  );
}