import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, Button, Avatar, EmptyState, StatCard } from '../../components/ui';
import { useToast } from '../../components/Toast';
import FundingApprovalCard from '../../components/FundingApprovalCard';
import { useWorkflow, respondCollab, timeAgo, isMemberOf, CURRENT_STUDENT } from '../../store/workflow';

/**
 * Action Center: everything waiting on the student.
 *   - funding they must approve as team leader
 *   - industry reviews that need a reply
 *   - team invites / mentor requests (incoming + sent)
 */
export default function StudentActions() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fundings, reviews, requests } = useWorkflow();

  const fundingToApprove = useMemo(
    () => fundings.filter(f => f.status === 'awaiting_leader' && f.leaderId === CURRENT_STUDENT.id),
    [fundings],
  );
  const reviewsToReply = useMemo(
    () => reviews.filter(r => r.status === 'open' && isMemberOf(r.teamName, CURRENT_STUDENT.id)),
    [reviews],
  );
  const incoming = requests.filter(r => r.direction === 'incoming');
  const outgoing = requests.filter(r => r.direction === 'outgoing');
  const pendingIncoming = incoming.filter(r => r.status === 'pending');
  const total = fundingToApprove.length + reviewsToReply.length + pendingIncoming.length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>Action Center</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          {total === 0 ? "You're all caught up." : `${total} thing${total > 1 ? 's' : ''} waiting on you.`}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Funding to approve" value={fundingToApprove.length} accent={fundingToApprove.length > 0} />
        <StatCard label="Reviews to reply" value={reviewsToReply.length} />
        <StatCard label="Invites to answer" value={pendingIncoming.length} />
      </div>

      {total === 0 && outgoing.length === 0 && (
        <EmptyState icon="✅" title="Nothing needs your attention" body="Funding approvals, review replies and team invites will show up here." />
      )}

      {fundingToApprove.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-semibold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>Funding awaiting your approval</h2>
          <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>You're the team leader, so the project is marked Funded only after you confirm.</p>
          <div className="flex flex-col gap-3">
            {fundingToApprove.map(f => <FundingApprovalCard key={f.id} record={f} />)}
          </div>
        </section>
      )}

      {reviewsToReply.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>Reviews that need a reply</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/student/reviews')}>Open reviews →</Button>
          </div>
          <div className="flex flex-col gap-2">
            {reviewsToReply.map(r => (
              <Card key={r.id} className="p-4 flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{r.projectTitle}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.reviewerName}, {r.reviewerOrg} · {timeAgo(r.createdAt)}</p>
                </div>
                <Badge variant="warning">Changes requested</Badge>
              </Card>
            ))}
          </div>
        </section>
      )}

      {incoming.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-semibold mb-3" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>Invites for you</h2>
          <div className="flex flex-col gap-3">
            {incoming.map(r => (
              <Card key={r.id} className="p-4">
                <div className="flex items-start gap-3 flex-wrap">
                  <Avatar initials={r.from.avatar} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{r.projectTitle}</p>
                    <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>
                      {r.from.name} · {r.from.institution} · {timeAgo(r.createdAt)}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{r.reason}</p>
                  </div>
                  {r.status === 'pending' ? (
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="secondary" size="sm" onClick={() => { respondCollab(r.id, 'declined'); toast('Invite declined.', 'info'); }}>Decline</Button>
                      <Button size="sm" onClick={() => { respondCollab(r.id, 'accepted'); toast(`You joined "${r.projectTitle}". Find it in My Projects.`, 'success'); }}>Accept</Button>
                    </div>
                  ) : (
                    <Badge variant={r.status === 'accepted' ? 'success' : 'danger'}>{r.status === 'accepted' ? '✓ Joined' : '✕ Declined'}</Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {outgoing.length > 0 && (
        <section>
          <h2 className="text-base font-semibold mb-3" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>Requests you sent</h2>
          <div className="flex flex-col gap-2">
            {outgoing.map(r => (
              <Card key={r.id} className="p-4 flex items-center gap-3 flex-wrap">
                <Avatar initials={r.to.avatar} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    {r.to.name} <span className="text-xs font-normal" style={{ color: 'var(--muted-foreground)' }}>· {r.kind === 'mentor' ? 'mentor' : 'teammate'}</span>
                  </p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.projectTitle} · {timeAgo(r.createdAt)}</p>
                </div>
                {r.status === 'pending' ? (
                  <div className="flex items-center gap-2">
                    <Badge variant="pending">Pending</Badge>
                    {/* Demo only: there are no other logged-in users yet, so you can answer on their behalf. */}
                    <Button variant="ghost" size="sm" onClick={() => respondCollab(r.id, 'accepted')}>Demo: mark accepted</Button>
                  </div>
                ) : (
                  <Badge variant={r.status === 'accepted' ? 'success' : 'danger'}>{r.status === 'accepted' ? '✓ Accepted' : '✕ Declined'}</Badge>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
