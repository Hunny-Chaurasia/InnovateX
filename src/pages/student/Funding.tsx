import { useMemo, useState } from 'react';
import { Card, Badge, Button, Avatar } from '../../components/ui';
import { useToast } from '../../components/Toast';
import { MOCK_PROJECTS } from '../../data/mock';
import FundingApprovalCard from '../../components/FundingApprovalCard';
import { useWorkflow, isMemberOf, CURRENT_STUDENT } from '../../store/workflow';

const OPPORTUNITIES = [
  {
    id: 'o1', title: 'Startup India Seed Fund', type: 'Funding', org: 'Govt. of India',
    amount: '₹20L', deadline: 'Oct 15, 2024', tags: ['Open to all', 'Early Stage'],
    desc: 'Seed funding for early-stage startups solving real societal problems.',
    eligibility: 'Any student team with a registered project on InnovateX. Team must have at least one college/university student.',
    sponsor: 'Department for Promotion of Industry and Internal Trade (DPIIT)',
    details: 'The Startup India Seed Fund Scheme aims to provide financial assistance for proof of concept, prototype development, and market entry. Selected teams receive ₹20L in equity-free funding, along with access to Startup India network, incubators, and government mentorship programs.',
  },
  {
    id: 'o2', title: 'HDFC Innovation Fellowship', type: 'Mentorship', org: 'HDFC Bank',
    amount: '₹5L stipend', deadline: 'Oct 5, 2024', tags: ['FinTech', 'Social Impact'],
    desc: '6-month paid fellowship with access to banking infra and mentors.',
    eligibility: 'FinTech or social impact projects only. Team lead must be enrolled in a recognized university.',
    sponsor: 'HDFC Bank Foundation',
    details: 'A 6-month paid fellowship program where selected student teams work alongside HDFC Bank product teams. Fellows receive a ₹5L stipend, access to anonymized transaction datasets, sandbox APIs, and dedicated banking domain mentors. Two fellows per team may be selected.',
  },
  {
    id: 'o3', title: 'Infosys InnoTech Workshop', type: 'Workshop', org: 'Infosys',
    amount: 'Free', deadline: 'Oct 20, 2024', tags: ['AI/ML', 'Cloud', 'Live'],
    desc: '2-day intensive on AI/ML product building with Infosys engineers.',
    eligibility: 'Open to all InnovateX students. Priority given to projects in AI/ML or cloud domains.',
    sponsor: 'Infosys Foundation',
    details: 'A 2-day in-person workshop (Bengaluru HQ) covering AI/ML model deployment, cloud infra at scale, and product thinking. Includes direct Q&A with senior Infosys engineers, hands-on labs, and a demo day where teams present to Infosys leadership.',
  },
  {
    id: 'o4', title: 'Tata Social Enterprise Challenge', type: 'Funding', org: 'Tata Trusts',
    amount: '₹50L', deadline: 'Nov 1, 2024', tags: ['Social Enterprise', 'Scale'],
    desc: 'For ventures with proven impact model seeking scale-up funding.',
    eligibility: 'Projects must have a working prototype and demonstrated social impact. Teams in Prototype or Funded stage only.',
    sponsor: 'Tata Trusts',
    details: 'The Tata Social Enterprise Challenge is a flagship grant program for ventures addressing critical social challenges. ₹50L is awarded as equity-free grant plus 12 months of structured mentorship from Tata Group executives, legal support, and incubation at TSIE, Mumbai.',
  },
  {
    id: 'o5', title: 'NASSCOM 10,000 Startups', type: 'Mentorship', org: 'NASSCOM',
    amount: 'Equity-free', deadline: 'Open', tags: ['Technology', 'Mentorship'],
    desc: 'Access to investor network, co-working spaces, and NASSCOM ecosystem.',
    eligibility: 'Technology-focused projects. Minimum team size of 2. At least one member must be in college/university.',
    sponsor: 'NASSCOM Foundation',
    details: 'Joining NASSCOM 10,000 Startups gives teams access to 200+ investor connections, co-working spaces across 8 cities, legal and compliance support, cloud credits (AWS, Azure, GCP), and the NASSCOM mentor network of 500+ industry professionals.',
  },
];

type Opportunity = typeof OPPORTUNITIES[0];

const TYPE_COLORS: Record<string, 'success' | 'info' | 'college'> = {
  Funding: 'success',
  Mentorship: 'info',
  Workshop: 'college',
};

function ApplyModal({ opportunity, onClose }: { opportunity: Opportunity; onClose: () => void }) {
  const { toast } = useToast();
  const [projectId, setProjectId] = useState('');
  const [pitch, setPitch] = useState('');
  const [requestedAmount, setRequestedAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!projectId || !pitch) return;
    setSubmitted(true);
    setTimeout(() => {
      toast(`Application submitted for "${opportunity.title}"! You'll hear back within 5–7 business days.`, 'success');
      onClose();
    }, 1200);
  };

  const selectedProject = MOCK_PROJECTS.find(p => p.id === projectId);

  if (submitted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
        <div className="w-full max-w-sm rounded-2xl border p-6 text-center" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl mx-auto mb-4"
            style={{ background: 'rgba(5,150,105,0.15)', border: '2px solid rgba(5,150,105,0.4)' }}>✓</div>
          <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
            Application Submitted!
          </h3>
          <p className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>
            {opportunity.title}
          </p>
          <div className="my-4 p-3 rounded-lg inline-flex items-center gap-2"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <span style={{ color: '#fbbf24' }}>⏳</span>
            <span className="text-sm font-medium" style={{ color: '#fbbf24' }}>Pending Review</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            You'll be notified of the outcome within 5–7 business days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <div className="w-full max-w-lg rounded-2xl border flex flex-col max-h-[90vh]" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-start justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h3 className="font-bold" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
              Apply — {opportunity.title}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{opportunity.org} · {opportunity.amount}</p>
          </div>
          <button onClick={onClose} style={{ color: 'var(--muted-foreground)' }}>✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {/* Project selection */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
              Select Project <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-col gap-2">
              {MOCK_PROJECTS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setProjectId(p.id)}
                  className="flex items-start gap-3 p-3 rounded-lg border text-left"
                  style={{
                    background: projectId === p.id ? 'rgba(124,58,237,0.1)' : 'var(--muted)',
                    borderColor: projectId === p.id ? 'var(--primary)' : 'transparent',
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{p.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                      {p.category} · {p.stage} · {p.teamSize} members
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Team members (auto-populated) */}
          {selectedProject && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Team Members (auto-populated)</label>
              <div className="p-3 rounded-lg flex flex-wrap gap-2" style={{ background: 'var(--muted)' }}>
                {selectedProject.team.map(m => (
                  <div key={m.name} className="flex items-center gap-1.5 px-2 py-1 rounded-full"
                    style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}>
                    <Avatar initials={m.avatar} size="sm" />
                    <span className="text-xs">{m.name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pitch */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
              Why does your project deserve this? <span className="text-red-400">*</span>
            </label>
            <textarea
              placeholder="Describe your project's impact, team's capability, and why this opportunity fits your roadmap..."
              value={pitch}
              onChange={e => setPitch(e.target.value)}
              rows={4}
              className="px-3 py-2 text-sm rounded-lg border outline-none resize-none"
              style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
          </div>

          {/* Requested amount (for funding only) */}
          {opportunity.type === 'Funding' && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                Amount Requested (up to {opportunity.amount})
              </label>
              <input
                placeholder={`Up to ${opportunity.amount}`}
                value={requestedAmount}
                onChange={e => setRequestedAmount(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg border outline-none"
                style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 p-5 border-t" style={{ borderColor: 'var(--border)' }}>
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
            disabled={!projectId || !pitch}
          >
            Submit Application
          </Button>
        </div>
      </div>
    </div>
  );
}

function OpportunityCard({ opp }: { opp: Opportunity }) {
  const [expanded, setExpanded] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  return (
    <>
      <Card className="p-5">
        {/* Always-visible summary row */}
        <div
          className="flex items-start gap-4 flex-wrap cursor-pointer"
          onClick={() => setExpanded(e => !e)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <p className="font-semibold" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>{opp.title}</p>
              <Badge variant={TYPE_COLORS[opp.type]}>{opp.type}</Badge>
            </div>
            <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>{opp.org}</p>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{opp.desc}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {opp.tags.map(t => <Badge key={t}>{t}</Badge>)}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xl font-bold mb-0.5" style={{ fontFamily: 'DM Sans', color: 'var(--accent)' }}>{opp.amount}</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              {opp.deadline === 'Open' ? 'Rolling' : `Due ${opp.deadline}`}
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--muted-foreground)' }}>
              {expanded ? '▲ less' : '▼ details'}
            </p>
          </div>
        </div>

        {/* Expanded detail */}
        {expanded && (
          <div className="mt-4 pt-4 border-t flex flex-col gap-4" style={{ borderColor: 'var(--border)' }}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>About</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>{opp.details}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Eligibility</p>
              <p className="text-sm" style={{ color: 'var(--foreground)' }}>{opp.eligibility}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg" style={{ background: 'var(--muted)' }}>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Sponsor</p>
                <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--foreground)' }}>{opp.sponsor}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'var(--muted)' }}>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Deadline</p>
                <p className="text-sm font-medium mt-0.5" style={{ color: opp.deadline === 'Open' ? '#34d399' : 'var(--foreground)' }}>
                  {opp.deadline === 'Open' ? 'Rolling (Apply anytime)' : opp.deadline}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setApplyOpen(true)} size="md">
                Apply Now →
              </Button>
            </div>
          </div>
        )}

        {/* Apply button even when collapsed */}
        {!expanded && (
          <div className="mt-3 pt-3 border-t flex justify-end" style={{ borderColor: 'var(--border)' }}>
            <Button size="sm" onClick={() => setApplyOpen(true)}>Apply Now</Button>
          </div>
        )}
      </Card>

      {applyOpen && <ApplyModal opportunity={opp} onClose={() => setApplyOpen(false)} />}
    </>
  );
}

/**
 * Funding that industry partners have sent to your teams.
 * The team leader must approve it before the project is marked Funded.
 */
function IncomingFunding() {
  const { fundings } = useWorkflow();
  const mine = useMemo(
    () => fundings.filter(f => f.leaderId === CURRENT_STUDENT.id || isMemberOf(f.teamName, CURRENT_STUDENT.id)),
    [fundings],
  );
  if (mine.length === 0) return null;
  const toApprove = mine.filter(f => f.status === 'awaiting_leader' && f.leaderId === CURRENT_STUDENT.id).length;

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-base font-semibold" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>Funding from industry partners</h2>
        {toApprove > 0 && <Badge variant="warning">{toApprove} needs your approval</Badge>}
      </div>
      <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
        A project is marked Funded only after its team leader confirms the money was received.
      </p>
      <div className="flex flex-col gap-3">
        {mine.map(f => <FundingApprovalCard key={f.id} record={f} />)}
      </div>
    </section>
  );
}

export default function Funding() {
  const [typeFilter, setTypeFilter] = useState('All');

  const filtered = OPPORTUNITIES.filter(o => typeFilter === 'All' || o.type === typeFilter);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
          Funding & Opportunities
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Click any card to expand full details, eligibility, and apply.
        </p>
      </div>

      <IncomingFunding />

      <div className="flex gap-2 mb-6">
        {['All', 'Funding', 'Mentorship', 'Workshop'].map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className="px-3 py-1.5 text-xs rounded-lg border font-medium transition-all"
            style={{
              background: typeFilter === t ? 'var(--primary)' : 'transparent',
              borderColor: typeFilter === t ? 'var(--primary)' : 'var(--border)',
              color: typeFilter === t ? 'white' : 'var(--muted-foreground)',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map(o => <OpportunityCard key={o.id} opp={o} />)}
      </div>
    </div>
  );
}
