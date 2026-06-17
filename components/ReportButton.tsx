'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { fileReport } from '@/lib/forum';

export default function ReportButton({
  target, userId,
}: {
  target: { postId?: string; commentId?: string };
  userId: string | undefined;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) { router.push('/account'); return; }
    if (!reason.trim()) return;
    setState('sending');
    const { error } = await fileReport(userId, target, reason.trim());
    if (error) { setState('idle'); alert(error.message); return; }
    setState('done');
    setTimeout(() => { setOpen(false); setReason(''); setState('idle'); }, 1800);
  }

  if (state === 'done') return <span className="report-done">✓ Reported — thank you</span>;

  return (
    <span className="report-wrap">
      {!open ? (
        <button
          type="button"
          className="report-btn"
          onClick={() => { if (!userId) { router.push('/account'); return; } setOpen(true); }}
        >
          ⚑ Report
        </button>
      ) : (
        <form className="report-form" onSubmit={submit}>
          <input
            className="forum-input"
            placeholder="Why are you reporting this?"
            value={reason}
            maxLength={500}
            onChange={e => setReason(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn-pink btn-small" disabled={state === 'sending'}>
            {state === 'sending' ? 'Sending…' : 'Submit'}
          </button>
          <button type="button" className="report-btn" onClick={() => { setOpen(false); setReason(''); }}>Cancel</button>
        </form>
      )}
    </span>
  );
}
