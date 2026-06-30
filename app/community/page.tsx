'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { timeAgo, getMyVotes, type Category, type FeedPost } from '@/lib/forum';
import VoteCol from '@/components/VoteCol';
import type { User } from '@supabase/supabase-js';

type Sort = 'hot' | 'new';

export default function CommunityPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCat, setActiveCat] = useState('all');
  const [sort, setSort] = useState<Sort>('hot');

  const [posts, setPosts] = useState<FeedPost[] | null>(null);
  const [myVotes, setMyVotes] = useState<Record<string, number>>({});
  const [feedError, setFeedError] = useState<string | null>(null);

  const [composerOpen, setComposerOpen] = useState(false);

  // Initial load: auth + categories
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      const { data: cats } = await supabase.from('categories').select('*').order('id');
      setCategories(cats || []);
    })();
  }, []);

  const loadFeed = useCallback(async () => {
    setPosts(null);
    setFeedError(null);
    let q = supabase.from('post_feed').select('*');
    if (activeCat !== 'all') q = q.eq('category_slug', activeCat);
    q = sort === 'new'
      ? q.order('created_at', { ascending: false })
      : q.order('score', { ascending: false }).order('created_at', { ascending: false });
    const { data, error } = await q.limit(50);
    if (error) { setFeedError(error.message); setPosts([]); return; }
    const list = (data || []) as FeedPost[];
    setPosts(list);
    const { data: { user } } = await supabase.auth.getUser();
    setMyVotes(await getMyVotes(user?.id, list.map(p => p.id)));
  }, [activeCat, sort]);

  useEffect(() => { loadFeed(); }, [loadFeed]);

  function onNewPostClick() {
    if (!user) { router.push('/account'); return; }
    setComposerOpen(o => !o);
  }

  return (
    <section className="forum-page">
      <div className="forum-bg"></div>
      <div className="tex"></div>
      <div className="forum-inner">
        <div className="forum-header reveal on">
          <div className="sec-label" style={{ justifyContent: 'center' }}>The Community</div>
          <h1 className="forum-title">Real Talk.<br /><span>Real Connection.</span></h1>
          <p className="forum-sub">Connect · Share · Grow</p>
        </div>

        <div id="forum-feed">
          <div className="forum-toolbar">
            <div id="category-tabs">
              <button className={'cat-tab' + (activeCat === 'all' ? ' active' : '')} onClick={() => setActiveCat('all')}>All</button>
              {categories.map(c => (
                <button
                  key={c.id}
                  className={'cat-tab' + (activeCat === c.slug ? ' active' : '')}
                  title={c.description || ''}
                  onClick={() => setActiveCat(c.slug)}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="sort-group">
                <button className={'sort-btn' + (sort === 'hot' ? ' active' : '')} onClick={() => setSort('hot')}>🔥 Hot</button>
                <button className={'sort-btn' + (sort === 'new' ? ' active' : '')} onClick={() => setSort('new')}>✦ New</button>
              </div>
              <button className="btn-pink btn-small" onClick={onNewPostClick}>+ New Post</button>
            </div>
          </div>

          {composerOpen && (
            <Composer
              categories={categories}
              userId={user!.id}
              onPosted={() => { setComposerOpen(false); loadFeed(); }}
            />
          )}

          <div id="post-list">
            {posts === null ? (
              <div className="forum-loading">Loading the conversation…</div>
            ) : feedError ? (
              <div className="forum-loading">Couldn&apos;t load posts: {feedError}</div>
            ) : posts.length === 0 ? (
              <div className="forum-empty">No posts here yet. <strong>Be the first to start the conversation.</strong></div>
            ) : (
              posts.map(p => (
                <article className="post-row" key={p.id} data-id={p.id}>
                  <VoteCol postId={p.id} initialScore={p.score} initialVote={myVotes[p.id] || 0} userId={user?.id} />
                  <Link className="post-main" href={`/thread/${p.id}`}>
                    <div className="post-meta">
                      {p.avatar_url && (
                        <img
                          src={p.avatar_url}
                          alt={p.username}
                          className="post-avatar"
                          style={{ width: '28px', height: '28px', borderRadius: '50%', marginRight: '8px', verticalAlign: 'middle' }}
                        />
                      )}
                      <span className="post-cat">{p.category_name}</span>
                      <span>@{p.username}</span> · <span>{timeAgo(p.created_at)}</span>
                    </div>
                    <h3 className="post-title">{p.title}</h3>
                    <div className="post-snippet">{p.body.slice(0, 180)}{p.body.length > 180 ? '…' : ''}</div>
                    <div className="post-foot">💬 {p.comment_count} {p.comment_count === 1 ? 'comment' : 'comments'}</div>
                  </Link>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── New post composer ──────────────────────────────────────────── */
function Composer({
  categories, userId, onPosted,
}: {
  categories: Category[];
  userId: string;
  onPosted: () => void;
}) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? 0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim().length < 3) return setMsg({ text: 'Give your post a title (3+ characters).', ok: false });
    if (!body.trim()) return setMsg({ text: 'Write something in the body.', ok: false });
    setMsg({ text: 'Posting…', ok: true });
    const { error } = await supabase.from('posts').insert({
      author: userId, category_id: Number(categoryId), title: title.trim(), body: body.trim(),
    });
    if (error) return setMsg({ text: error.message, ok: false });
    onPosted();
  }

  return (
    <div id="composer" style={{ display: 'block' }}>
      <form onSubmit={onSubmit}>
        <label className="forum-label" htmlFor="composer-category">Category</label>
        <select id="composer-category" className="forum-select" value={categoryId} onChange={e => setCategoryId(Number(e.target.value))}>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <label className="forum-label" htmlFor="composer-title">Title</label>
        <input id="composer-title" className="forum-input" type="text" maxLength={200} placeholder="What do you want to talk about?" value={title} onChange={e => setTitle(e.target.value)} required />
        <label className="forum-label" htmlFor="composer-body">Body</label>
        <textarea id="composer-body" className="forum-textarea" rows={5} maxLength={10000} placeholder="Say something real…" value={body} onChange={e => setBody(e.target.value)} required />
        {msg && msg.text && <div className={'forum-msg ' + (msg.ok ? 'forum-msg-ok' : 'forum-msg-err')} style={{ display: 'block' }}>{msg.text}</div>}
        <div><button type="submit" className="btn-pink btn-small">Post It</button></div>
      </form>
    </div>
  );
}
