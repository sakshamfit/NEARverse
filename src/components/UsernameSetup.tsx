import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface UsernameSetupProps {
  user: User;
  onComplete: (profile: any) => void;
}

export function UsernameSetup({ user, onComplete }: UsernameSetupProps) {
  const [username, setUsername] = useState('');
  const [profession, setProfession] = useState('Developer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const professions = ['Developer', 'Doctor', 'Chef', 'Electrician', 'Designer', 'Photographer', 'Teacher', 'Mechanic'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if username is taken
      const { data: existing } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase())
        .single();

      if (existing) {
        throw new Error('Username already taken. Please choose another.');
      }

      // Create profile
      const { data: profile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: username.toLowerCase(),
          name: username,
          profession,
          avatar_color: '#7c3aed',
          trust_score: 50,
          connect_coins: 100,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      onComplete(profile);
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
          <p className="auth-tagline">Choose your unique username</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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
            <small>Only letters, numbers and underscores. This will be your @username</small>
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

          {error && <div className="auth-error">{error}</div>}

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating Profile...' : 'Enter NEARverse'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Welcome, {user.email}</p>
          <p className="small">You can change your profession later</p>
        </div>
      </div>
    </div>
  );
}