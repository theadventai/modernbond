'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toggleVote } from '@/lib/forum';

export default function VoteCol({
  postId, initialScore, initialVote, userId,
}: {
  postId: string;
  initialScore: number;
  initialVote: number;
  userId: string | undefined;
}) {
  const router = useRouter();
  const [score, setScore] = useState(initialScore);
  const [vote, setVote] = useState(initialVote);

  async function handle(value: number) {
    if (!userId) { router.push('/account'); return; }
    const { delta, newVote } = await toggleVote(userId, postId, value, vote);
    setScore(s => s + delta);
    setVote(newVote);
  }

  return (
    <div className="vote-col">
      <button className={'vote-btn vote-up' + (vote === 1 ? ' voted' : '')} aria-label="Upvote" onClick={e => { e.preventDefault(); handle(1); }}>▲</button>
      <span className="vote-score">{score}</span>
      <button className={'vote-btn vote-down' + (vote === -1 ? ' voted' : '')} aria-label="Downvote" onClick={e => { e.preventDefault(); handle(-1); }}>▼</button>
    </div>
  );
}
