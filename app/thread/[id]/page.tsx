'use client';

import { useEffect, useState, useCallback } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { timeAgo, getMyVotes, type FeedPost, type Comment } from '@/lib/forum';
import VoteCol from '@/components/VoteCol';
import type { User } from '@supabase/supabase-js';

export default function ThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: postId } = use(params);
  const [user, setUser] = useState<User | null>(null);
  const [post, setPost] = useState<FeedPost | null>(null);
  const [myVote, setMyVote] = useState(0);
  const [notFound, setNotFound] = useState(false);
  const [comments, setComments] = useState<Comment[] | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      const { data: p, error } = await supabase.from('post_feed').select('*').eq('id', postId).single();
      if (error || !p) { setNotFound(true); return; }
      setPost(p as FeedPost);
      document.title = p.title + ' — Community | Modern Bond';
      const votes = await getMyVotes(user?.id, [p.id]);
      setMyVote(votes[p.id] || 0);
    })();
  }, [postId]);

  const loadComments = useCallback(async () => {
    const { data, error } = await supabase.from('comments')
      .select('*, profiles(username)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    if (error) { setComments([]); return; }
    setComments((data || []) as Comment[]);
  }, [postId]);

  useEffect(() => { loadComments(); }, [loadComments]);

  if (notFound) {
    return (
      <section className="forum-page">
        <div className="forum-bg"></div><div className="tex"></div>
        <div className="forum-inner"><div className="forum-loading">Post not found.</div></div>
      </section>
    );
  }

  return (
    <section className="forum-page">
      <div className="forum-bg"></div>
      <div className="tex"></div>
      <div className="forum-inner">
        <div id="thread-view">
          <Link href="/community" className="thread-back">← Back to The Community</Link>

          <div id="thread-post">
            {post && (
              <article className="post-row post-row-full" data-id={post.id}>
                <VoteCol postId={post.id} initialScore={post.score} initialVote={myVote} userId={user?.id} />
                <div className="post-main">
                  <div className="post-meta">
                    <span className="post-cat">{post.category_name}</span>
                    <span>@{post.username}</span> · <span>{timeAgo(post.created_at)}</span>
                  </div>
                  <h1 className="thread-title">{post.title}</h1>
                  <div className="thread-body" style={{ whiteSpace: 'pre-wrap' }}>{post.body}</div>
                </div>
              </article>
            )}
          </div>

          <div className="comments-section">
            <h2 className="comments-h"><span>{comments?.length ?? 0}</span> Comments</h2>

            <ReplyForm postId={postId} parentId={null} user={user} onPosted={loadComments} placeholder="Join the conversation…" buttonLabel="Comment" />

            <div id="comment-tree">
              {comments === null ? (
                <div className="forum-loading">Loading comments…</div>
              ) : comments.length === 0 ? (
                <div className="forum-empty">No comments yet — say something real.</div>
              ) : (
                <CommentTree comments={comments} parentKey="root" depth={0} postId={postId} user={user} onPosted={loadComments} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Recursive comment tree ─────────────────────────────────────── */
function CommentTree({
  comments, parentKey, depth, postId, user, onPosted,
}: {
  comments: Comment[];
  parentKey: string;
  depth: number;
  postId: string;
  user: User | null;
  onPosted: () => void;
}) {
  const children = comments.filter(c => (c.parent_id || 'root') === parentKey);
  if (!children.length) return null;
  return (
    <>
      {children.map(c => (
        <CommentNode key={c.id} comment={c} comments={comments} depth={depth} postId={postId} user={user} onPosted={onPosted} />
      ))}
    </>
  );
}

function CommentNode({
  comment, comments, depth, postId, user, onPosted,
}: {
  comment: Comment;
  comments: Comment[];
  depth: number;
  postId: string;
  user: User | null;
  onPosted: () => void;
}) {
  const router = useRouter();
  const [replyOpen, setReplyOpen] = useState(false);

  function toggleReply() {
    if (!user) { router.push('/account'); return; }
    setReplyOpen(o => !o);
  }

  return (
    <div className={'comment' + (depth > 0 ? ' comment-nested' : '')} data-id={comment.id}>
      <div className="comment-meta">
        <span className="comment-author">@{comment.profiles?.username || 'member'}</span> · {timeAgo(comment.created_at)}
      </div>
      <div className="comment-body" style={{ whiteSpace: 'pre-wrap' }}>{comment.body}</div>
      <button className="comment-reply-btn" onClick={toggleReply}>Reply</button>
      <div className="comment-reply-slot">
        {replyOpen && (
          <ReplyForm postId={postId} parentId={comment.id} user={user} inline onPosted={() => { setReplyOpen(false); onPosted(); }} placeholder="Write a reply…" buttonLabel="Reply" />
        )}
      </div>
      {depth < 6 && (
        <CommentTree comments={comments} parentKey={comment.id} depth={depth + 1} postId={postId} user={user} onPosted={onPosted} />
      )}
    </div>
  );
}

/* ── Reply / comment form ───────────────────────────────────────── */
function ReplyForm({
  postId, parentId, user, onPosted, placeholder, buttonLabel, inline,
}: {
  postId: string;
  parentId: string | null;
  user: User | null;
  onPosted: () => void;
  placeholder: string;
  buttonLabel: string;
  inline?: boolean;
}) {
  const router = useRouter();
  const [body, setBody] = useState('');
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { router.push('/account'); return; }
    if (!body.trim()) return setMsg({ text: 'Write something first.', ok: false });
    setMsg({ text: 'Posting…', ok: true });
    const { error } = await supabase.from('comments').insert({
      post_id: postId, parent_id: parentId, author: user.id, body: body.trim(),
    });
    if (error) return setMsg({ text: error.message, ok: false });
    setBody('');
    setMsg(null);
    onPosted();
  }

  return (
    <form className={inline ? 'inline-reply' : undefined} onSubmit={onSubmit}>
      <textarea rows={inline ? 3 : 4} placeholder={placeholder} value={body} onChange={e => setBody(e.target.value)} required />
      {msg && msg.text && <div className={'forum-msg ' + (msg.ok ? 'forum-msg-ok' : 'forum-msg-err')} style={{ display: 'block' }}>{msg.text}</div>}
      <button type="submit" className="btn-pink btn-small">{buttonLabel}</button>
    </form>
  );
}
