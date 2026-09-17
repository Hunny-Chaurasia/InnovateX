import { useState } from 'react';
import { Card, Badge, Button, EmptyState, Avatar } from '../../components/ui';
import { useToast } from '../../components/Toast';
import { MOCK_PROBLEMS } from '../../data/mock';

const DOMAINS = ['All', 'Technology', 'Healthcare', 'Environment', 'Education', 'Finance'];

type Problem = typeof MOCK_PROBLEMS[0];

function ProblemDetailModal({ problem, onClose }: { problem: Problem; onClose: () => void }) {
  const { toast } = useToast();
  const [applied, setApplied] = useState(false);

  const handleSolve = () => {
    setApplied(true);
    toast(`You've started working on "${problem.title}"`, 'success');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <div className="w-full max-w-lg rounded-2xl border flex flex-col max-h-[90vh]" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}
            >
              {problem.logo}
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight mb-0.5" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
                {problem.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{problem.company}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--muted-foreground)' }}>✕</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          <div className="flex flex-wrap gap-1.5">
            {problem.tags.map(t => <Badge key={t}>{t}</Badge>)}
            <Badge variant="info">{problem.domain}</Badge>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--muted-foreground)' }}>
              Problem Statement
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>
              {problem.company} is seeking innovative student teams to develop a solution for{' '}
              <strong>{problem.title}</strong>. The project involves applying cutting-edge technology
              to address real operational challenges, with access to company mentors, relevant datasets,
              and the possibility of deployment in a live environment upon completion.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg" style={{ background: 'var(--muted)' }}>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Teams Working On This</p>
              <p className="text-xl font-bold mt-0.5" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
                {problem.applicants}
              </p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'var(--muted)' }}>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Posted</p>
              <p className="text-xl font-bold mt-0.5" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
                {problem.postedDays}d ago
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg border" style={{ background: 'rgba(124,58,237,0.06)', borderColor: 'rgba(124,58,237,0.2)' }}>
            <p className="text-xs font-medium mb-1" style={{ color: 'var(--accent)' }}>What you get</p>
            <ul className="text-xs flex flex-col gap-1" style={{ color: 'var(--muted-foreground)' }}>
              <li>✓ Direct mentorship from {problem.company} engineers</li>
              <li>✓ Access to relevant datasets and infrastructure</li>
              <li>✓ Potential for real-world deployment and funding</li>
              <li>✓ Certificate of completion and LinkedIn recommendation</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t" style={{ borderColor: 'var(--border)' }}>
          <Button variant="secondary" onClick={onClose} className="flex-1">Close</Button>
          <Button
            onClick={handleSolve}
            className="flex-1"
            disabled={applied}
          >
            {applied ? '✓ Working on this' : 'Solve This Problem'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Discover() {
  const { toast } = useToast();
  const [tab, setTab] = useState<'industry' | 'community'>('industry');
  const [domain, setDomain] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Problem | null>(null);

  const filtered = MOCK_PROBLEMS.filter(p =>
    (domain === 'All' || p.domain === domain) &&
    (search === '' || p.title.toLowerCase().includes(search.toLowerCase()) || p.company.toLowerCase().includes(search.toLowerCase()))
  );

  const communityIdeas = [
    { id: 'c1', title: 'Open-source homework helper for Tier-3 cities', author: 'Community', tags: ['EdTech', 'Open Source'], domain: 'Education', applicants: 5, postedDays: 12, logo: '🌱', company: 'Community' },
    { id: 'c2', title: 'Accessibility audit tool for Indian govt websites', author: 'Community', tags: ['GovTech', 'A11y'], domain: 'Technology', applicants: 3, postedDays: 8, logo: '♿', company: 'Community' },
  ];

  const items = tab === 'industry' ? filtered : communityIdeas;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>Discover</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Browse real-world problems from industry or community-submitted ideas.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg mb-6 w-fit" style={{ background: 'var(--secondary)' }}>
        {(['industry', 'community'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
            style={{ background: tab === t ? 'var(--card)' : 'transparent', color: tab === t ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
            {t === 'industry' ? 'Industry Problems' : 'Community Ideas'}
          </button>
        ))}
      </div>

      {tab === 'industry' && (
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <input
            placeholder="Search problems or companies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border outline-none flex-1 min-w-48"
            style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          />
          <div className="flex gap-2 flex-wrap">
            {DOMAINS.map(d => (
              <button key={d} onClick={() => setDomain(d)}
                className="px-3 py-1.5 text-xs rounded-lg border font-medium transition-all"
                style={{
                  background: domain === d ? 'var(--primary)' : 'transparent',
                  borderColor: domain === d ? 'var(--primary)' : 'var(--border)',
                  color: domain === d ? 'white' : 'var(--muted-foreground)',
                }}>
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState icon="🔍" title="No problems found" body="Try adjusting your search or filters to discover more challenges." />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(items as any[]).map(p => (
            <Card key={p.id} className="p-5 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}
                >
                  {p.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-snug" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>{p.title}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.company}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {p.tags.map((t: string) => <Badge key={t}>{t}</Badge>)}
              </div>
              <div className="flex items-center justify-between mt-auto pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  {p.applicants} teams · {p.postedDays}d ago
                </span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelected(p as Problem)}>View</Button>
                  <Button size="sm" onClick={() => { setSelected(p as Problem); }}>Solve</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selected && <ProblemDetailModal problem={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
