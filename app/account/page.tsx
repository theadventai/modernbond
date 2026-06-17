'use client';

import { useEffect, useRef, useState } from 'react';
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

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(data);
      }
      setLoading(false);
    })();
  }, []);

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

  return (
    <div className="account-card">
      <div className="auth-tabs">
        <button className={'auth-tab' + (tab === 'signup' ? ' active' : '')} onClick={() => setTab('signup')}>Sign Up</button>
        <button className={'auth-tab' + (tab === 'login' ? ' active' : '')} onClick={() => setTab('login')}>Log In</button>
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

      {tab === 'login' && (
        <form className="auth-form" style={{ display: 'flex' }} onSubmit={onLogin}>
          <div>
            <label className="forum-label" htmlFor="login-email">Email</label>
            <input id="login-email" name="email" className="forum-input" type="email" autoComplete="email" required />
          </div>
          <div>
            <label className="forum-label" htmlFor="login-password">Password</label>
            <input id="login-password" name="password" className="forum-input" type="password" autoComplete="current-password" required />
          </div>
          <MsgLine msg={loginMsg} />
          <button type="submit" className="btn-pink">Log In</button>
        </form>
      )}
    </div>
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
