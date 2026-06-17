'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase, type Profile } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

type Msg = { text: string; ok: boolean } | null;

function MsgLine({ msg }: { msg: Msg }) {
  if (!msg || !msg.text) return null;
  return <div className={'forum-msg ' + (msg.ok ? 'forum-msg-ok' : 'forum-msg-err')} style={{ display: 'block' }}>{msg.text}</div>;
}

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recovery, setRecovery] = useState(false);

  const loadUser = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(data);
    } else {
      setProfile(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Returning from a password-reset email fires PASSWORD_RECOVERY — show the
    // "set new password" form instead of the profile editor.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(event => {
      if (event === 'PASSWORD_RECOVERY') { setRecovery(true); setLoading(false); }
    });
    loadUser();
    return () => subscription.unsubscribe();
  }, [loadUser]);

  return (
    <section className="forum-page">
      <div className="forum-bg"></div>
      <div className="tex"></div>
      <div className="forum-inner">
        <div className="forum-header reveal on">
          <div className="sec-label" style={{ justifyContent: 'center' }}>Membership</div>
          <h1 className="forum-title">Join the<br /><span>Movement.</span></h1>
          <p className="forum-sub">Free account · Post in the community · Member perks</p>
        </div>

        {loading ? (
          <div className="forum-loading">Loading…</div>
        ) : recovery ? (
          <ResetPasswordForm onDone={() => { setRecovery(false); setLoading(true); loadUser(); }} />
        ) : user && profile ? (
          <ProfileEditor
            user={user}
            profile={profile}
            onProfileChange={setProfile}
            onLogout={async () => { await supabase.auth.signOut(); router.push('/'); }}
          />
        ) : (
          <AuthBox onAuthed={() => router.push('/community')} />
        )}
      </div>
    </section>
  );
}

/* ── Signup / Login ─────────────────────────────────────────────── */
function AuthBox({ onAuthed }: { onAuthed: () => void }) {
  const [tab, setTab] = useState<'signup' | 'login'>('signup');
  const [signupMsg, setSignupMsg] = useState<Msg>(null);
  const [loginMsg, setLoginMsg] = useState<Msg>(null);
  const [forgot, setForgot] = useState(false);
  const [forgotMsg, setForgotMsg] = useState<Msg>(null);
  const [oauthMsg, setOauthMsg] = useState<Msg>(null);

  async function onSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const username = (f.elements.namedItem('username') as HTMLInputElement).value.trim();
    const email = (f.elements.namedItem('email') as HTMLInputElement).value.trim();
    const password = (f.elements.namedItem('password') as HTMLInputElement).value;
    if (username.length < 3) return setSignupMsg({ text: 'Username must be at least 3 characters.', ok: false });
    setSignupMsg({ text: 'Creating your account…', ok: true });
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { username } } });
    if (error) return setSignupMsg({ text: error.message, ok: false });
    if (data.user && !data.session) {
      return setSignupMsg({ text: 'Check your email to confirm your account, then log in here.', ok: true });
    }
    onAuthed();
  }

  async function onLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const email = (f.elements.namedItem('email') as HTMLInputElement).value.trim();
    const password = (f.elements.namedItem('password') as HTMLInputElement).value;
    setLoginMsg({ text: 'Logging in…', ok: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setLoginMsg({ text: error.message, ok: false });
    onAuthed();
  }

  async function onForgot(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const email = (f.elements.namedItem('email') as HTMLInputElement).value.trim();
    if (!email.includes('@')) return setForgotMsg({ text: 'Enter a valid email address.', ok: false });
    setForgotMsg({ text: 'Sending reset link…', ok: true });
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account`,
    });
    if (error) return setForgotMsg({ text: error.message, ok: false });
    setForgotMsg({ text: 'Check your email for a link to reset your password.', ok: true });
  }

  async function oauth(provider: 'google' | 'apple') {
    setOauthMsg({ text: 'Redirecting…', ok: true });
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/account` },
    });
    if (error) setOauthMsg({ text: error.message, ok: false });
  }

  return (
    <div className="account-card">
      <div className="oauth-row">
        <button type="button" className="oauth-btn" onClick={() => oauth('google')}>
          <GoogleIcon /> Continue with Google
        </button>
        <button type="button" className="oauth-btn" onClick={() => oauth('apple')}>
          <AppleIcon /> Continue with Apple
        </button>
      </div>
      <MsgLine msg={oauthMsg} />
      <div className="auth-divider">or with email</div>

      <div className="auth-tabs">
        <button className={'auth-tab' + (tab === 'signup' ? ' active' : '')} onClick={() => { setTab('signup'); setForgot(false); }}>Sign Up</button>
        <button className={'auth-tab' + (tab === 'login' ? ' active' : '')} onClick={() => { setTab('login'); setForgot(false); }}>Log In</button>
      </div>

      {tab === 'signup' && (
        <form className="auth-form" style={{ display: 'flex' }} onSubmit={onSignup}>
          <div>
            <label className="forum-label" htmlFor="signup-username">Username</label>
            <input id="signup-username" name="username" className="forum-input" type="text" minLength={3} maxLength={24} autoComplete="username" placeholder="How the community sees you" required />
          </div>
          <div>
            <label className="forum-label" htmlFor="signup-email">Email</label>
            <input id="signup-email" name="email" className="forum-input" type="email" autoComplete="email" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="forum-label" htmlFor="signup-password">Password</label>
            <input id="signup-password" name="password" className="forum-input" type="password" minLength={8} autoComplete="new-password" placeholder="8+ characters" required />
          </div>
          <MsgLine msg={signupMsg} />
          <button type="submit" className="btn-pink">Create Account</button>
        </form>
      )}

      {tab === 'login' && !forgot && (
        <form className="auth-form" style={{ display: 'flex' }} onSubmit={onLogin}>
          <div>
            <label className="forum-label" htmlFor="login-email">Email</label>
            <input id="login-email" name="email" className="forum-input" type="email" autoComplete="email" required />
          </div>
          <div>
            <label className="forum-label" htmlFor="login-password">Password</label>
            <input id="login-password" name="password" className="forum-input" type="password" autoComplete="current-password" required />
          </div>
          <button type="button" className="auth-forgot" onClick={() => { setForgot(true); setForgotMsg(null); }}>Forgot password?</button>
          <MsgLine msg={loginMsg} />
          <button type="submit" className="btn-pink">Log In</button>
        </form>
      )}

      {tab === 'login' && forgot && (
        <form className="auth-form" style={{ display: 'flex' }} onSubmit={onForgot}>
          <div>
            <label className="forum-label" htmlFor="forgot-email">Email</label>
            <input id="forgot-email" name="email" className="forum-input" type="email" autoComplete="email" placeholder="you@example.com" required />
          </div>
          <MsgLine msg={forgotMsg} />
          <button type="submit" className="btn-pink">Send Reset Link</button>
          <button type="button" className="auth-forgot" onClick={() => { setForgot(false); setForgotMsg(null); }}>← Back to log in</button>
        </form>
      )}
    </div>
  );
}

/* ── Set-new-password form (after clicking the reset email link) ───── */
function ResetPasswordForm({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState<Msg>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) return setMsg({ text: 'Password must be at least 8 characters.', ok: false });
    if (password !== confirm) return setMsg({ text: "Passwords don't match.", ok: false });
    setMsg({ text: 'Updating…', ok: true });
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return setMsg({ text: error.message, ok: false });
    setMsg({ text: 'Password updated! Taking you to your account…', ok: true });
    setTimeout(onDone, 1200);
  }

  return (
    <div className="account-card">
      <div className="profile-section-title" style={{ marginBottom: '14px' }}>Set a New Password</div>
      <form className="auth-form" style={{ display: 'flex' }} onSubmit={onSubmit}>
        <input className="forum-input" type="password" minLength={8} autoComplete="new-password" placeholder="New password (8+ characters)" value={password} onChange={e => setPassword(e.target.value)} required />
        <input className="forum-input" type="password" autoComplete="new-password" placeholder="Confirm new password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
        <MsgLine msg={msg} />
        <button type="submit" className="btn-pink">Update Password</button>
      </form>
    </div>
  );
}

/* ── Provider icons ────────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 12.54c-.03-2.6 2.13-3.85 2.22-3.91-1.21-1.77-3.1-2.02-3.77-2.04-1.6-.16-3.13.94-3.95.94-.81 0-2.07-.92-3.4-.9-1.75.03-3.36 1.02-4.26 2.58-1.82 3.16-.47 7.84 1.31 10.41.87 1.26 1.9 2.67 3.26 2.62 1.31-.05 1.8-.85 3.39-.85 1.58 0 2.02.85 3.4.82 1.4-.02 2.29-1.28 3.15-2.55.99-1.46 1.4-2.87 1.42-2.95-.03-.01-2.72-1.04-2.75-4.13zM14.6 4.97c.72-.88 1.21-2.1 1.08-3.31-1.04.04-2.3.69-3.05 1.56-.67.78-1.25 2.02-1.09 3.21 1.16.09 2.34-.59 3.06-1.46z" />
    </svg>
  );
}

/* ── Profile editor ─────────────────────────────────────────────── */
function ProfileEditor({
  user, profile, onProfileChange, onLogout,
}: {
  user: User;
  profile: Profile;
  onProfileChange: (p: Profile) => void;
  onLogout: () => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [avatarMsg, setAvatarMsg] = useState<Msg>(null);
  const [usernameMsg, setUsernameMsg] = useState<Msg>(null);
  const [emailMsg, setEmailMsg] = useState<Msg>(null);
  const [passwordMsg, setPasswordMsg] = useState<Msg>(null);

  const [username, setUsername] = useState(profile.username || '');
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  async function onAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setAvatarMsg({ text: 'Image must be under 5 MB.', ok: false });
    setAvatarMsg({ text: 'Uploading…', ok: true });
    const ext = file.name.split('.').pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (upErr) return setAvatarMsg({ text: upErr.message, ok: false });
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
    const { error: dbErr } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
    if (dbErr) return setAvatarMsg({ text: dbErr.message, ok: false });
    onProfileChange({ ...profile, avatar_url: publicUrl });
    setAvatarMsg({ text: 'Photo updated!', ok: true });
    setTimeout(() => setAvatarMsg(null), 3000);
  }

  async function onSaveUsername() {
    const val = username.trim();
    if (val.length < 3) return setUsernameMsg({ text: 'Username must be at least 3 characters.', ok: false });
    if (val.length > 24) return setUsernameMsg({ text: 'Username must be 24 characters or fewer.', ok: false });
    setUsernameMsg({ text: 'Saving…', ok: true });
    const { error } = await supabase.from('profiles').update({ username: val }).eq('id', user.id);
    if (error) return setUsernameMsg({ text: error.message.includes('unique') ? 'That username is already taken.' : error.message, ok: false });
    onProfileChange({ ...profile, username: val });
    setUsernameMsg({ text: 'Username updated!', ok: true });
    setTimeout(() => setUsernameMsg(null), 3000);
  }

  async function onSaveEmail() {
    const val = email.trim();
    if (!val.includes('@')) return setEmailMsg({ text: 'Enter a valid email address.', ok: false });
    setEmailMsg({ text: 'Sending confirmation…', ok: true });
    const { error } = await supabase.auth.updateUser({ email: val });
    if (error) return setEmailMsg({ text: error.message, ok: false });
    setEmailMsg({ text: 'Check your new email address for a confirmation link.', ok: true });
  }

  async function onSavePassword() {
    if (password.length < 8) return setPasswordMsg({ text: 'Password must be at least 8 characters.', ok: false });
    if (password !== passwordConfirm) return setPasswordMsg({ text: "Passwords don't match.", ok: false });
    setPasswordMsg({ text: 'Updating…', ok: true });
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return setPasswordMsg({ text: error.message, ok: false });
    setPassword('');
    setPasswordConfirm('');
    setPasswordMsg({ text: 'Password updated!', ok: true });
    setTimeout(() => setPasswordMsg(null), 3000);
  }

  const joined = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '';

  return (
    <div className="account-card profile-edit-card">
      {/* Avatar */}
      <div className="profile-section" style={{ textAlign: 'center' }}>
        <div className="avatar-wrap">
          {profile.avatar_url ? (
            <img className="avatar-img" src={profile.avatar_url} alt="" />
          ) : (
            <div className="avatar-placeholder">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="18" r="8" fill="rgba(233,30,140,0.5)" />
                <path d="M8 42c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="rgba(233,30,140,0.5)" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </div>
        <input ref={fileInput} type="file" accept="image/*" style={{ display: 'none' }} onChange={onAvatar} />
        <button className="btn-outline btn-small" style={{ marginTop: '14px' }} onClick={() => fileInput.current?.click()}>Change Photo</button>
        <MsgLine msg={avatarMsg} />
      </div>

      {/* Username */}
      <div className="profile-section">
        <div className="profile-section-title">Username</div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input className="forum-input" type="text" minLength={3} maxLength={24} autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} />
          <button className="btn-pink btn-small" style={{ whiteSpace: 'nowrap' }} onClick={onSaveUsername}>Save</button>
        </div>
        <MsgLine msg={usernameMsg} />
      </div>

      {/* Email */}
      <div className="profile-section">
        <div className="profile-section-title">Email Address</div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input className="forum-input" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
          <button className="btn-pink btn-small" style={{ whiteSpace: 'nowrap' }} onClick={onSaveEmail}>Update</button>
        </div>
        <MsgLine msg={emailMsg} />
      </div>

      {/* Password */}
      <div className="profile-section">
        <div className="profile-section-title">Change Password</div>
        <input className="forum-input" type="password" minLength={8} autoComplete="new-password" placeholder="New password (8+ characters)" style={{ marginBottom: '10px' }} value={password} onChange={e => setPassword(e.target.value)} />
        <input className="forum-input" type="password" autoComplete="new-password" placeholder="Confirm new password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} />
        <MsgLine msg={passwordMsg} />
        <button className="btn-pink btn-small" style={{ marginTop: '12px' }} onClick={onSavePassword}>Update Password</button>
      </div>

      {/* Member since + actions */}
      <div className="profile-section" style={{ borderBottom: 'none' }}>
        <div className="profile-row" style={{ border: 'none', padding: '0 0 16px' }}>
          <span className="forum-label">Member Since</span>
          <span className="profile-value">{joined}</span>
        </div>
        <div className="profile-actions">
          <Link href="/community" className="btn-pink btn-small">Go to The Community</Link>
          <button className="btn-outline btn-small" onClick={onLogout}>Log Out</button>
        </div>
      </div>
    </div>
  );
}
