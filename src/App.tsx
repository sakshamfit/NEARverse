import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { SignInForm } from './components/SignInForm';
import { ProfileSetup } from './components/ProfileSetup';
import { Home } from './pages/Home';

function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile();
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile();
        } else {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      } else if (data) {
        setProfile(data);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="relative h-14 w-14 mx-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">N</span>
              </div>
            </div>
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-gray-900">Nearverse</h1>
          <p className="mt-2 text-gray-500">Connecting people by location and skills</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<SignInForm onSignedIn={(user) => { setUser(user); fetchProfile(); }} />} />
          <Route path="/auth/callback" element={
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-white">
              <div className="text-center">
                <div className="relative h-14 w-14 mx-auto">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg animate-spin">
                      <span className="text-white text-sm font-bold">N</span>
                    </div>
                  </div>
                </div>
                <h2 className="mt-4 text-xl font-extrabold text-gray-900">Processing login...</h2>
              </div>
            </div>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    );
  }

  if (!profile) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<ProfileSetup user={user} onProfileComplete={(profile) => setProfile(profile)} isEdit={false} />} />
          <Route path="/profile" element={<ProfileSetup user={user} onProfileComplete={(profile) => setProfile(profile)} isEdit={true} />} />
          <Route path="*" element={<Navigate to="/profile" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Nearverse
                </span>
                <div className="ml-10 flex items-baseline space-x-4">
                  <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200">
                    Map
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l1.178-.789a1 1 0 00-1.423-.36A5.002 5.002 0 002 8zm9 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="search"
                    placeholder="Search people or skills..."
                    className="block w-full pl-10 pr-4 py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:truncate transition-all duration-200 hover:border-indigo-300 focus:border-indigo-500"
                  />
                </div>
                <button onClick={signOut} className="flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus-ring-offset-2 focus-ring-indigo-500 transition-all duration-200 transform hover:-translate-y-05">
                  <span className="mr-2">Sign out</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="mt-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<ProfileSetup user={user} onProfileComplete={(profile) => setProfile(profile)} isEdit={true} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;