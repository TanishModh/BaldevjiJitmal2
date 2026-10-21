import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { KeyRound, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

function sanitizeNextUrl(url) {
  if (!url || !url.startsWith('/') || url.startsWith('//')) return '';
  return url;
}

// Allowed store owner passcodes (forgiving of whitespace and common casing)
const VALID_PASSCODES = [
  'baldevjiadmin@1937',
  'baldevji1937',
  'bj1937',
  (import.meta.env.VITE_ADMIN_PASSCODE || '').toLowerCase(),
].filter(Boolean);

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = sanitizeNextUrl(searchParams.get('next'));
  const [authType, setAuthType] = useState('passcode'); // 'passcode' | 'account'
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [passcode, setPasscode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Auto-redirect if already authenticated via session or passcode
  useEffect(() => {
    const isPasscodeActive =
      sessionStorage.getItem('bj_admin_session') === 'true' ||
      localStorage.getItem('bj_admin_session') === 'true';

    if (isPasscodeActive) {
      navigate(next || '/admin', { replace: true });
      return;
    }

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate(next || '/admin', { replace: true });
      }
    });

    supabase.auth.getSession().then(({ data: sessionData }) => {
      if (sessionData.session) {
        navigate(next || '/admin', { replace: true });
      }
    });

    return () => {
      data.subscription?.unsubscribe();
    };
  }, [navigate, next]);

  // Handle Passcode Unlock
  const handlePasscodeSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const cleanPass = (passcode || '').trim().toLowerCase();
    let allowed = [...VALID_PASSCODES];
    try {
      const cached = JSON.parse(localStorage.getItem('bj_site_settings_cache') || '{}');
      if (cached?.adminPasscode) allowed.push(cached.adminPasscode.trim().toLowerCase());
    } catch (_) {}

    if (allowed.includes(cleanPass)) {
      sessionStorage.setItem('bj_admin_session', 'true');
      localStorage.setItem('bj_admin_session', 'true');
      toast.success('Welcome, Baldevji Jitmal Administrator');
      setTimeout(() => {
        navigate(next || '/admin', { replace: true });
      }, 250);
    } else {
      toast.error('Invalid passcode. Check your owner credentials.');
      setLoading(false);
    }
  };

  // Handle Supabase Email Auth
  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + (next || '/admin'),
          },
        });

        if (error) {
          toast.error(error.message);
          return;
        }

        toast.success('Account created! Please check your email for the confirmation link.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast.error(error.message);
          return;
        }

        // Also ensure admin session is established
        sessionStorage.setItem('bj_admin_session', 'true');
        toast.success('Signed in successfully');
        navigate(next || '/admin', { replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto px-5 py-16 sm:py-24 animate-rise">
      <div className="text-center mb-6">
        <div className="inline-grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary mb-3">
          <ShieldCheck size={24} />
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium">Baldevji Jitmal</p>
        <h1 className="font-display text-3xl sm:text-4xl text-primary mt-1">Admin Portal</h1>
        <div className="gold-divider mx-auto my-4 w-16"></div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Manage your catalogue, site content, store theme, and customer inquiries.
        </p>
      </div>

      {/* Auth Method Selector */}
      <div className="flex border-b border-border mb-6">
        <button
          type="button"
          onClick={() => setAuthType('passcode')}
          className={`flex-1 py-2.5 text-xs uppercase tracking-[0.12em] font-medium transition flex items-center justify-center gap-1.5 border-b-2 -mb-px ${
            authType === 'passcode'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-primary'
          }`}
        >
          <KeyRound size={14} /> Store Passcode
        </button>
        <button
          type="button"
          onClick={() => setAuthType('account')}
          className={`flex-1 py-2.5 text-xs uppercase tracking-[0.12em] font-medium transition flex items-center justify-center gap-1.5 border-b-2 -mb-px ${
            authType === 'account'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-primary'
          }`}
        >
          <Mail size={14} /> Supabase Email
        </button>
      </div>

      {/* Tab 1: Owner Passcode Form */}
      {authType === 'passcode' && (
        <form
          onSubmit={handlePasscodeSubmit}
          className="bg-card border border-border rounded-md p-6 space-y-4 shadow-soft"
        >
          <div>
            <label className="text-xs uppercase tracking-wider text-foreground/80 font-medium">
              Owner Master Passcode
            </label>
            <input
              type="password"
              required
              autoFocus
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter master admin passcode"
              className="mt-1 w-full bg-background border border-input rounded-md px-3 py-2.5 outline-none focus:border-primary text-sm tracking-wider"
            />
            <p className="text-[11px] text-muted-foreground mt-1.5">
              Instant access for store managers and editors.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !passcode.trim()}
            className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-md text-xs uppercase tracking-[0.14em] hover:bg-primary/90 disabled:opacity-60 transition shadow-soft font-semibold inline-flex items-center justify-center gap-2"
          >
            {loading ? 'Verifying…' : 'Unlock Dashboard'}
            <ArrowRight size={14} />
          </button>
        </form>
      )}

      {/* Tab 2: Supabase Email/Password Form */}
      {authType === 'account' && (
        <form
          onSubmit={handleAccountSubmit}
          className="bg-card border border-border rounded-md p-6 space-y-4 shadow-soft"
        >
          <div>
            <label className="text-xs uppercase tracking-wider text-foreground/80 font-medium">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="mt-1 w-full bg-background border border-input rounded-md px-3 py-2.5 outline-none focus:border-primary text-sm"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-foreground/80 font-medium">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full bg-background border border-input rounded-md px-3 py-2.5 outline-none focus:border-primary text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-md text-xs uppercase tracking-[0.14em] hover:bg-primary/90 disabled:opacity-60 transition shadow-soft font-semibold"
          >
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="w-full text-xs text-muted-foreground hover:text-primary transition-colors text-center"
          >
            {mode === 'signin'
              ? 'Need a new Supabase account? Sign up'
              : 'Already have an account? Sign in'}
          </button>
        </form>
      )}
    </section>
  );
}
