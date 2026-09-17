import { useState } from 'react';
import { Card, StatCard, StageBadge, Badge, Button, Avatar } from '../../components/ui';
import { useToast } from '../../components/Toast';
import { MOCK_INDUSTRY_PROJECTS } from '../../data/mock';

type Project = typeof MOCK_INDUSTRY_PROJECTS[0] & { fundingStatus?: string; fundingAmount?: string };

function FundModal({ project, onClose, onFunded }: { project: Project; onClose: () => void; onFunded: (id: string, amount: string) => void }) {
  const { toast } = useToast();
  const [step, setStep] = useState<'amount' | 'proof'>('amount');
  const [amount, setAmount] = useState('');
  const [ref, setRef] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleProofSubmit = () => {
    if (!ref || !confirmed) return;
    onFunded(project.id, amount);
    toast(`Funding of ₹${amount}L confirmed for "${project.title}". Status updated to Funded.`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <div className="w-full max-w-md rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h3 className="font-bold" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
              {step === 'amount' ? 'Fund This Project' : 'Proof of Funding'}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{project.title}</p>
          </div>
          <button onClick={onClose} style={{ color: 'var(--muted-foreground)' }}>✕</button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {step === 'amount' ? (
            <>
              <div className="p-3 rounded-lg" style={{ background: 'var(--muted)' }}>
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{project.title}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{project.team} · {project.institution}</p>
                  </div>
                  <StageBadge stage={project.stage} />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  Funding Amount (₹ Lakhs) <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>₹</span>
                  <input
                    type="number"
                    placeholder="e.g. 5"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm rounded-lg border outline-none"
                    style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  />
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>L</span>
                </div>
              </div>
              <div className="p-3 rounded-lg text-xs" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24' }}>
                After confirming the amount, you'll be asked to provide a transaction reference. The project will show as <strong>"Funding Pending Confirmation"</strong> until proof is uploaded.
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
                <Button onClick={() => amount && setStep('proof')} disabled={!amount} className="flex-1">
                  Continue →
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 rounded-lg text-sm" style={{ background: 'rgba(124,58,237,0.08)', borderColor: 'rgba(124,58,237,0.2)', border: '1px solid' }}>
                Funding amount: <strong style={{ color: 'var(--accent)' }}>₹{amount}L</strong> for {project.title}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  Transaction Reference Number <span className="text-red-400">*</span>
                </label>
                <input
                  placeholder="e.g. TXN-2024-INFOSYS-8821"
                  value={ref}
                  onChange={e => setRef(e.target.value)}
                  className="px-3 py-2 text-sm rounded-lg border outline-none"
                  style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  Upload Transaction Document (mock)
                </label>
                <div
                  className="flex items-center gap-2 px-3 py-3 rounded-lg border border-dashed cursor-pointer"
                  style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                  onClick={() => setFileName('transaction_receipt.pdf')}
                >
                  <span className="text-base">📎</span>
                  <span className="text-sm">{fileName || 'Click to attach document'}</span>
                  {fileName && <span className="ml-auto text-xs" style={{ color: 'var(--accent)' }}>✓</span>}
                </div>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer" onClick={() => setConfirmed(c => !c)}>
                <div
                  className="w-4 h-4 rounded flex items-center justify-center text-xs flex-shrink-0 mt-0.5"
                  style={{ background: confirmed ? 'var(--primary)' : 'transparent', border: `1.5px solid ${confirmed ? 'var(--primary)' : 'var(--border)'}`, color: 'white' }}
                >
                  {confirmed ? '✓' : ''}
                </div>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  I confirm that the above transaction details are accurate and the funds have been disbursed to the team.
                </p>
              </label>

              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setStep('amount')} className="flex-1">← Back</Button>
                <Button
                  onClick={handleProofSubmit}
                  disabled={!ref || !confirmed}
                  className="flex-1"
                >
                  Confirm Funding
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function IndustryDashboard() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>(MOCK_INDUSTRY_PROJECTS);
  const [fundModal, setFundModal] = useState<string | null>(null);

  const handleMentor = (id: string, title: string) => {
    toast(`Mentorship request sent for "${title}"`, 'success');
  };

  const handleInvite = (id: string, title: string) => {
    toast(`Workshop invitation sent to team working on "${title}"`, 'info');
  };

  const handleFunded = (id: string, amount: string) => {
    setProjects(ps => ps.map(p =>
      p.id === id ? { ...p, stage: 'Funded', progress: 100, fundingStatus: 'Funded', fundingAmount: `₹${amount}L` } : p
    ));
  };

  const activeProject = fundModal ? projects.find(p => p.id === fundModal) : null;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
          Industry Dashboard
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Rohan Kapoor · Infosys · Director of Innovation
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Problems Posted" value={3} sub="2 active" />
        <StatCard label="Teams Working" value={14} sub="on your problems" accent />
        <StatCard label="Projects Funded" value={projects.filter(p => p.stage === 'Funded').length} sub={`₹${projects.filter(p => p.fundingAmount).reduce((a, p) => a + parseFloat((p.fundingAmount || '0').replace(/[₹L]/g, '') || '0'), 0)}L disbursed`} />
        <StatCard label="Students Reached" value={47} />
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
          Student Projects on Your Problems
        </h2>
        <Button variant="secondary" size="sm" onClick={() => toast('Navigating to full project discovery', 'info')}>
          View all
        </Button>
      </div>

      <div className="flex flex-col gap-3 mb-8">
        {projects.map(p => (
          <Card key={p.id} className="p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{p.title}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                  {p.team} · {p.institution} · {p.members} members
                </p>
              </div>
              <StageBadge stage={p.stage} />
              {p.fundingAmount && (
                <Badge variant="success">{p.fundingAmount} funded</Badge>
              )}
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--secondary)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${p.progress}%`, background: 'var(--primary)' }} />
                </div>
                <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{p.progress}%</span>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMentor(p.id, p.title)}
                >
                  Mentor
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleInvite(p.id, p.title)}
                >
                  Workshop
                </Button>
                <Button
                  variant={p.stage === 'Funded' ? 'secondary' : 'secondary'}
                  size="sm"
                  disabled={p.stage === 'Funded'}
                  onClick={() => setFundModal(p.id)}
                >
                  {p.stage === 'Funded' ? '✓ Funded' : 'Fund'}
                </Button>
                <Button size="sm" onClick={() => toast(`Viewing project details for "${p.title}"`, 'info')}>
                  View →
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {fundModal && activeProject && (
        <FundModal
          project={activeProject}
          onClose={() => setFundModal(null)}
          onFunded={handleFunded}
        />
      )}
    </div>
  );
}
