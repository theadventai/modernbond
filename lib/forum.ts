import { supabase } from './supabase';

export type Category = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
};

export type FeedPost = {
  id: string;
  title: string;
  body: string;
  score: number;
  comment_count: number;
  created_at: string;
  username: string;
  category_name: string;
  category_slug: string;
};

export type Comment = {
  id: string;
  post_id: string;
  parent_id: string | null;
  author: string;
  body: string;
  created_at: string;
  profiles: { username: string } | null;
};

export type Report = {
  id: string;
  reason: string;
  status: 'open' | 'resolved' | 'dismissed';
  created_at: string;
  reporter: string;
  reporter_username: string;
  post_id: string | null;
  post_title: string | null;
  post_body: string | null;
  post_author: string | null;
  comment_id: string | null;
  comment_body: string | null;
  comment_author: string | null;
};

/** True if the current user has is_moderator set. */
export async function checkModerator(userId: string | undefined): Promise<boolean> {
  if (!userId) return false;
  const { data } = await supabase.from('profiles').select('is_moderator').eq('id', userId).single();
  return !!data?.is_moderator;
}

/** File a report against a post or a comment. */
export async function fileReport(
  reporter: string,
  target: { postId?: string; commentId?: string },
  reason: string
) {
  return supabase.from('reports').insert({
    reporter,
    post_id: target.postId ?? null,
    comment_id: target.commentId ?? null,
    reason,
  });
}

export function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60); if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60); if (h < 24) return h + 'h ago';
  const d = Math.floor(h / 24); if (d < 30) return d + 'd ago';
  const mo = Math.floor(d / 30); if (mo < 12) return mo + 'mo ago';
  return Math.floor(mo / 12) + 'y ago';
}

/** Returns a map of postId → vote value (1 or -1) for the current user. */
export async function getMyVotes(userId: string | undefined, postIds: string[]): Promise<Record<string, number>> {
  if (!userId || !postIds.length) return {};
  const { data } = await supabase.from('votes').select('post_id,value').eq('user_id', userId).in('post_id', postIds);
  const map: Record<string, number> = {};
  (data || []).forEach(v => { map[v.post_id] = v.value; });
  return map;
}

/**
 * Toggle a vote. Returns the score delta to apply and the resulting vote state
 * (1, -1, or 0 for no vote). Mirrors the original forum-scripts.js logic.
 */
export async function toggleVote(
  userId: string,
  postId: string,
  value: number,
  currentVote: number
): Promise<{ delta: number; newVote: number }> {
  if (currentVote === value) {
    // Clicking the same button again removes the vote
    await supabase.from('votes').delete().eq('user_id', userId).eq('post_id', postId);
    return { delta: -value, newVote: 0 };
  }
  // New vote, or switching from the opposite vote
  await supabase.from('votes').upsert({ user_id: userId, post_id: postId, value });
  const hadOther = currentVote === -value;
  return { delta: hadOther ? value * 2 : value, newVote: value };
}
