import { useMemo, useState } from 'react';
import { StatCard, Badge, EmptyState } from '../../components/ui';
import { ReviewThread } from '../../components/ProjectReviewModal';
import { useWorkflow, isMemberOf, CURRENT_STUDENT } from '../../store/workflow';

type Tab = 'all' | 'reply' | 'waiting' | 'resolved';

/**
 * Industry reviews on your teams' projects.
 * Reviewers write what's wrong and what to improve; you reply here with the changes you made.
 */
export default function Review() {
  const { reviews } = useWorkflow();
  const [tab, setTab] = useState<Tab>('all');

  const mine = useMemo(
    () => reviews.filter(r => isMemberOf(r.teamName, CURRENT_STUDENT.id)).sort((a, b) => b.createdAt - a.createdAt),
    [reviews],
  );
  const needsReply = mine.filter(r => r.status === 'open');
  const waiting = mine.filter(r => r.status === 'addressed');
  const resolved = mine.filter(r => r.status === 'resolved');

  const shown = tab === 'reply' ? needsReply : tab === 'waiting' ? waiting : tab === 'resolved' ? resolved : mine;
  const tabs: { id: Tab; label: string; n: number }[] = [
    { id: 'all', label: 'All', n: mine.length },
    { id: 'reply', label: 'Needs your reply', n: needsReply.length },
    { id: 'waiting', label: 'Waiting on reviewer', n: waiting.length },
    { id: 'resolved', label: 'Resolved', n: resolved.length },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>Industry Reviews</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Feedback from industry partners on your projects. Reply with the changes you make.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Needs your reply" value={needsReply.length} accent={needsReply.length > 0} />
        <StatCard label="Waiting on reviewer" value={waiting.length} />
        <StatCard label="Resolved" value={resolved.length} />
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg border font-medium"
            style={{
              background: tab === t.id ? 'var(--primary)' : 'transparent',
              borderColor: tab === t.id ? 'var(--primary)' : 'var(--border)',
              color: tab === t.id ? 'white' : 'var(--muted-foreground)',
            }}>
            {t.label} <Badge>{t.n}</Badge>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState
          icon="💬"
          title={mine.length === 0 ? 'No reviews yet' : 'Nothing in this tab'}
          body={mine.length === 0
            ? 'When an industry partner opens your project, their review shows up here.'
            : 'Try another tab to see the rest of your reviews.'}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {shown.map(r => <ReviewThread key={r.id} review={r} viewer="student" />)}
        </div>
      )}
    </div>
  );
}
