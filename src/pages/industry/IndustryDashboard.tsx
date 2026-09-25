import { useMemo, useState } from 'react';
import { Card, StatCard, StageBadge, Badge, Button, VirtualIdCard } from '../../components/ui';
import { useToast } from '../../components/Toast';
import { MOCK_INDUSTRY_PROJECTS } from '../../data/mock';
import FundModal from '../../components/FundModal';
import ProjectReviewModal from '../../components/ProjectReviewModal';
import { useWorkflow, latestFunding, CURRENT_INDUSTRY } from '../../store/workflow';
import { useNavigate } from 'react-router-dom';

export default function IndustryDashboard() {
  const { toast } = useToast();
  const { fundings, reviews } = useWorkflow();
  const [fundModal, setFundModal] = useState<string | null>(null);
  const [viewModal, setViewModal] = useState<string | null>(null);

  // A project only becomes "Funded" after the TEAM LEADER approves the funding on the student side.
  const rows = useMemo(
    () => MOCK_INDUSTRY_PROJECTS.map(p => {
      const funding = latestFunding(fundings, p.id);
      const lastReview = reviews
        .filter(r => r.projectId === p.id && r.reviewerId === CURRENT_INDUSTRY.id)
        .sort((a, b) => b.createdAt - a.createdAt)[0];
      return { ...p, funding, lastReview, stage: funding?.status === 'confirmed' ? 'Funded' : p.stage };
    }),
    [fundings, reviews],
  );

  const confirmed = fundings.filter(f => f.status === 'confirmed');
  const pending = fundings.filter(f => f.status === 'awaiting_leader');
  const sum = (list: typeof fundings) => list.reduce((a, f) => a + f.amountLakh, 0);

  const fundTarget = rows.find(p => p.id === fundModal);
  const viewTarget = rows.find(p => p.id === viewModal);

  const navigate = useNavigate();
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
            Industry Dashboard
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            {CURRENT_INDUSTRY.name} · {CURRENT_INDUSTRY.org} · {CURRENT_INDUSTRY.title}
          </p>
        </div>
        <VirtualIdCard id={CURRENT_INDUSTRY.id} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Problems Posted" value={3} sub="2 active" />
        <StatCard label="Teams Working" value={14} sub="on your problems" accent />
        <StatCard
          label="Projects Funded"
          value={confirmed.length}
          sub={`₹${sum(confirmed)}L confirmed${pending.length ? ` · ₹${sum(pending)}L awaiting leaders` : ''}`}
        />
        <StatCard label="Students Reached" value={47} />
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
          Student Projects on Your Problems
        </h2>
        <Button variant="secondary" size="sm" onClick={() => navigate("/industry/discover")}>
          View all
        </Button>
      </div>

      <div className="flex flex-col gap-3 mb-8">
        {rows.map(p => {
          const f = p.funding;
          const locked = f?.status === 'awaiting_leader' || f?.status === 'confirmed';
          return (
            <Card key={p.id} className="p-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{p.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                    {p.team} · {p.institution} · {p.members} members
                  </p>
                </div>
                <StageBadge stage={p.stage} />
                {f?.status === 'confirmed' && <Badge variant="success">₹{f.amountLakh}L funded</Badge>}
                {f?.status === 'awaiting_leader' && <Badge variant="pending">₹{f.amountLakh}L · awaiting {f.leaderName.split(' ')[0]}</Badge>}
                {f?.status === 'declined' && <Badge variant="danger">Declined by leader</Badge>}
                {p.lastReview?.status === 'open' && <Badge variant="warning">Review sent</Badge>}
                {p.lastReview?.status === 'addressed' && <Badge variant="info">Team replied</Badge>}
                {p.lastReview?.status === 'resolved' && <Badge variant="success">Review resolved</Badge>}
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--secondary)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${p.progress}%`, background: 'var(--primary)' }} />
                  </div>
                  <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{p.progress}%</span>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {/* <Button variant="ghost" size="sm" onClick={() => toast(`Mentorship request sent for "${p.title}"`, 'success')}>
                    Mentor
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => toast(`Workshop invitation sent to team working on "${p.title}"`, 'info')}>
                    Workshop
                  </Button> */}
                  <Button variant="secondary" size="sm" disabled={locked} onClick={() => setFundModal(p.id)}>
                    {f?.status === 'confirmed' ? '✓ Funded' : f?.status === 'awaiting_leader' ? 'Awaiting leader' : f?.status === 'declined' ? 'Fund again' : 'Fund'}
                  </Button>
                  <Button size="sm" onClick={() => setViewModal(p.id)}>Review →</Button>
                </div>
              </div>
              {f?.status === 'declined' && f.declineNote && (
                <p className="text-xs mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)', color: '#f87171' }}>
                  {f.leaderName} declined: {f.declineNote}
                </p>
              )}
            </Card>
          );
        })}
      </div>

      {fundTarget && <FundModal project={fundTarget} onClose={() => setFundModal(null)} />}
      {viewTarget && <ProjectReviewModal project={viewTarget} onClose={() => setViewModal(null)} />}
    </div>
  );
}
