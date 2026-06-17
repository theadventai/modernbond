'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { timeAgo, checkModerator, type Category, type FeedPost, type Report } from '@/lib/forum';
import type { User } from '@supabase/supabase-js';

type Tab = 'reports' | 'posts' | 'comments' | 'categories';

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isMod, setIsMod] = useState(false);
  const [tab, setTab] = useState<Tab>('reports');

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsMod(await checkModerator(user?.id));
      setLoading(false);
    })();
  }, []);

  return (
    <section className="forum-page">
      <div className="forum-bg"></div>
      <div className="tex"></div>
      <div className="forum-inner">
        <div className="forum-header reveal on">
          <div className="sec-label" style={{ justifyContent: 'center' }}>Staff Only</div>
          <h1 className="forum-title">Moderation<br /><span>Dashboard</span></h1>
          <p className="forum-sub">Reports · Posts · Comments · Categories</p>
        </div>

        {loading ? (
          <div className="forum-loading">Loading…</div>
        ) : !user ? (
          <div className="forum-empty">You need to <Link href="/account" className="pillar-link">log in</Link> to access this page.</div>
        ) : !isMod ? (
          <div className="forum-empty"><strong>Not authorized.</strong> This area is for moderators only.</div>
        ) : (
          <>
            <div className="admin-tabs">
              {(['reports', 'posts', 'comments', 'categories'] as Tab[]).map(t => (
                <button key={t} className={'admin-tab' + (tab === t ? ' active' : '')} onClick={() => setTab(t)}>
                  {t}
                </button>
              ))}
            </div>
            {tab === 'reports' && <ReportsPanel />}
            {tab === 'posts' && <PostsPanel />}
            {tab === 'comments' && <CommentsPanel />}
            {tab === 'categories' && <CategoriesPanel modId={user.id} />}
          </>
        )}
      </div>
    </section>
  );
}

/* ── Reports queue ──────────────────────────────────────────────── */
function ReportsPanel() {
  const [reports, setReports] = useState<Report[] | null>(null);

  const load = useCallback(async () => {
    setReports(null);
    const { data } = await supabase
      .from('report_queue')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false });
    setReports((data || []) as Report[]);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function deleteContent(r: Report) {
    if (!confirm('Delete this content permanently? This cannot be undone.')) return;
    if (r.post_id) await supabase.from('posts').delete().eq('id', r.post_id);
    else if (r.comment_id) await supabase.from('comments').delete().eq('id', r.comment_id);
    // Deleting the content cascade-removes its reports; just reload.
    load();
  }

  async function dismiss(r: Report) {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('reports').update({
      status: 'dismissed', resolved_at: new Date().toISOString(), resolved_by: user?.id,
    }).eq('id', r.id);
    load();
  }

  if (reports === null) return <div className="forum-loading">Loading reports…</div>;
  if (!reports.length) return <div className="forum-empty">No open reports. <strong>The community is clean.</strong></div>;

  return (
    <div className="admin-list">
      {reports.map(r => {
        const isPost = !!r.post_id;
        const body = isPost ? r.post_body : r.comment_body;
        const author = isPost ? r.post_author : r.comment_author;
        return (
          <div className="admin-row" key={r.id}>
            <div className="admin-row-main">
              <div className="admin-row-meta">
                <span className="admin-tag">{isPost ? 'Post' : 'Comment'}</span>
                reported by <strong>@{r.reporter_username}</strong> · {timeAgo(r.created_at)}
              </div>
              {isPost && r.post_title && <div className="admin-row-title">{r.post_title}</div>}
              <div className="admin-row-body">{(body || '(content removed)').slice(0, 240)}</div>
              <div className="admin-row-sub">by @{author || 'unknown'} · reason: <em>{r.reason}</em></div>
            </div>
            <div className="admin-row-actions">
              {isPost && r.post_id && <Link href={`/thread/${r.post_id}`} className="btn-outline btn-small">View</Link>}
              <button className="btn-outline btn-small" onClick={() => dismiss(r)}>Dismiss</button>
              <button className="admin-del-btn" onClick={() => deleteContent(r)}>Delete</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── All posts ──────────────────────────────────────────────────── */
function PostsPanel() {
  const [posts, setPosts] = useState<FeedPost[] | null>(null);

  const load = useCallback(async () => {
    setPosts(null);
    const { data } = await supabase.from('post_feed').select('*').order('created_at', { ascending: false }).limit(200);
    setPosts((data || []) as FeedPost[]);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function del(id: string) {
    if (!confirm('Delete this post and all its comments? This cannot be undone.')) return;
    await supabase.from('posts').delete().eq('id', id);
    load();
  }

  if (posts === null) return <div className="forum-loading">Loading posts…</div>;
  if (!posts.length) return <div className="forum-empty">No posts yet.</div>;

  return (
    <div className="admin-list">
      {posts.map(p => (
        <div className="admin-row" key={p.id}>
          <div className="admin-row-main">
            <div className="admin-row-meta"><span className="admin-tag">{p.category_name}</span>@{p.username} · {timeAgo(p.created_at)} · {p.comment_count} comments</div>
            <div className="admin-row-title">{p.title}</div>
            <div className="admin-row-body">{p.body.slice(0, 200)}</div>
          </div>
          <div className="admin-row-actions">
            <Link href={`/thread/${p.id}`} className="btn-outline btn-small">View</Link>
            <button className="admin-del-btn" onClick={() => del(p.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── All comments ───────────────────────────────────────────────── */
type AdminComment = {
  id: string;
  body: string;
  created_at: string;
  post_id: string;
  profiles: { username: string } | null;
  posts: { title: string } | null;
};

function CommentsPanel() {
  const [comments, setComments] = useState<AdminComment[] | null>(null);

  const load = useCallback(async () => {
    setComments(null);
    const { data } = await supabase
      .from('comments')
      .select('id, body, created_at, post_id, profiles(username), posts(title)')
      .order('created_at', { ascending: false })
      .limit(200);
    setComments((data || []) as unknown as AdminComment[]);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function del(id: string) {
    if (!confirm('Delete this comment and any replies? This cannot be undone.')) return;
    await supabase.from('comments').delete().eq('id', id);
    load();
  }

  if (comments === null) return <div className="forum-loading">Loading comments…</div>;
  if (!comments.length) return <div className="forum-empty">No comments yet.</div>;

  return (
    <div className="admin-list">
      {comments.map(c => (
        <div className="admin-row" key={c.id}>
          <div className="admin-row-main">
            <div className="admin-row-meta">@{c.profiles?.username || 'member'} · {timeAgo(c.created_at)} · on &ldquo;{c.posts?.title || '—'}&rdquo;</div>
            <div className="admin-row-body">{c.body.slice(0, 240)}</div>
          </div>
          <div className="admin-row-actions">
            <Link href={`/thread/${c.post_id}`} className="btn-outline btn-small">View</Link>
            <button className="admin-del-btn" onClick={() => del(c.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Categories ─────────────────────────────────────────────────── */
function CategoriesPanel({ modId }: { modId: string }) {
  void modId;
  const [cats, setCats] = useState<Category[] | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from('categories').select('*').order('id');
    setCats((data || []) as Category[]);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (name.trim().length < 2) return setMsg({ text: 'Name is too short.', ok: false });
    if (cleanSlug.length < 2) return setMsg({ text: 'Slug is too short.', ok: false });
    setMsg({ text: 'Adding…', ok: true });
    const { error } = await supabase.from('categories').insert({ name: name.trim(), slug: cleanSlug, description: description.trim() || null });
    if (error) return setMsg({ text: error.message.includes('duplicate') ? 'That slug already exists.' : error.message, ok: false });
    setName(''); setSlug(''); setDescription(''); setMsg({ text: 'Category added.', ok: true });
    load();
    setTimeout(() => setMsg(null), 2500);
  }

  async function del(id: number) {
    if (!confirm('Delete this category? Posts in it must be moved or removed first.')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) { alert(error.message.includes('foreign key') ? 'Cannot delete — posts still use this category.' : error.message); return; }
    load();
  }

  return (
    <div>
      <form className="auth-form admin-cat-form" style={{ display: 'flex' }} onSubmit={add}>
        <div className="admin-cat-fields">
          <input className="forum-input" placeholder="Name (e.g. Wellness)" value={name} onChange={e => setName(e.target.value)} />
          <input className="forum-input" placeholder="slug (e.g. wellness)" value={slug} onChange={e => setSlug(e.target.value)} />
        </div>
        <input className="forum-input" placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
        {msg && msg.text && <div className={'forum-msg ' + (msg.ok ? 'forum-msg-ok' : 'forum-msg-err')} style={{ display: 'block' }}>{msg.text}</div>}
        <button type="submit" className="btn-pink btn-small">Add Category</button>
      </form>

      <div className="admin-list" style={{ marginTop: '24px' }}>
        {(cats || []).map(c => (
          <div className="admin-row" key={c.id}>
            <div className="admin-row-main">
              <div className="admin-row-title">{c.name} <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-cond)', fontSize: '13px' }}>/{c.slug}</span></div>
              <div className="admin-row-body">{c.description || <em>No description</em>}</div>
            </div>
            <div className="admin-row-actions">
              <button className="admin-del-btn" onClick={() => del(c.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
