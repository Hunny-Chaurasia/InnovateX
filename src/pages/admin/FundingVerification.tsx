import { useState } from 'react';
import { Card, Badge, Button, Avatar } from '../../components/ui';
import { useToast } from '../../components/Toast';

type FundingRecord = {
  id: string;
  projectTitle: string;
  team: string;
  institution: string;
  industry: string;
  amount: string;
  txnRef: string;
  submittedDate: string;
  status: 'pending_verification' | 'verified' | 'rejected';
};

const INITIAL_RECORDS: FundingRecord[] = [
  {
    id: 'fv1',
    projectTitle: 'MediAssist AI — Rural Diagnostics',
    team: 'Team Nova',
    institution: 'IIT Bombay',
    industry: 'Infosys',
    amount: '₹8L',
    txnRef: 'TXN-2024-INFOSYS-8821',
    submittedDate: 'Sep 14, 2024',
    status: 'pending_verification',
  },
  {
    id: 'fv2',
    projectTitle: 'GreenRoute — Carbon Navigator',
    team: 'Team Echo',
    institution: 'BITS Pilani',
    industry: 'Tata Motors',
    amount: '₹4L',
    txnRef: 'TXN-2024-TATA-1102',
    submittedDate: 'Sep 10, 2024',
    status: 'verified',
  },
  {
    id: 'fv3',
    projectTitle: 'SupplySync AI',
    team: 'Team Orbit',
    institution: 'BITS Pilani',
    industry: 'Mahindra',
    amount: '₹12L',
    txnRef: 'TXN-2024-MH-5534',
    submittedDate: 'Sep 12, 2024',
    status: 'pending_verification',
  },
];

const STATUS_LABEL: Record<FundingRecord['status'], { label: string; variant: 'pending' | 'success' | 'danger' }> = {
  pending_verification: { label: 'Pending Verification', variant: 'pending' },
  verified: { label: 'Verified', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'danger' },
};

export default function FundingVerification() {
  const { toast } = useToast();
  const [records, setRecords] = useState<FundingRecord[]>(INITIAL_RECORDS);

  const act = (id: string, action: 'verified' | 'rejected') => {
    setRecords(rs => rs.map(r => r.id === id ? { ...r, status: action } : r));
    const record = records.find(r => r.id === id);
    if (action === 'verified') {
      toast(`Funding for "${record?.projectTitle}" verified. Project status updated to Funded.`, 'success');
    } else {
      toast(`Funding proof for "${record?.projectTitle}" rejected. Industry partner notified.`, 'warning');
    }
  };

  const pending = records.filter(r => r.status === 'pending_verification');
  const resolved = records.filter(r => r.status !== 'pending_verification');

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
          Funding Verification
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Review and verify proof-of-funding submissions from industry partners. Projects remain "Funding Pending Confirmation" until verified here.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Pending Verification</p>
          <p className="text-3xl font-bold mt-1" style={{ fontFamily: 'DM Sans', color: '#fbbf24' }}>{pending.length}</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Verified This Month</p>
          <p className="text-3xl font-bold mt-1" style={{ fontFamily: 'DM Sans', color: '#34d399' }}>{resolved.filter(r => r.status === 'verified').length}</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Total Funding Verified</p>
          <p className="text-3xl font-bold mt-1" style={{ fontFamily: 'DM Sans', color: 'var(--accent)' }}>₹12L</p>
        </div>
      </div>

      {pending.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Awaiting Verification</p>
            <Badge variant="warning">{pending.length}</Badge>
          </div>
          <div className="flex flex-col gap-3">
            {pending.map(r => (
              <Card key={r.id} className="p-5">
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{r.projectTitle}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                      {r.team} · {r.institution} — funded by <strong style={{ color: 'var(--foreground)' }}>{r.industry}</strong>
                    </p>

                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="p-2.5 rounded-lg" style={{ background: 'var(--muted)' }}>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Amount</p>
                        <p className="text-base font-bold mt-0.5" style={{ color: 'var(--accent)' }}>{r.amount}</p>
                      </div>
                      <div className="p-2.5 rounded-lg" style={{ background: 'var(--muted)' }}>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Transaction Ref</p>
                        <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--foreground)' }}>{r.txnRef}</p>
                      </div>
                    </div>

                    <p className="text-xs mt-2" style={{ color: 'var(--muted-foreground)' }}>
                      Submitted: {r.submittedDate}
                    </p>

                    {/* Mock document */}
                    <button
                      className="mt-2 flex items-center gap-1.5 text-xs hover:underline"
                      style={{ color: 'var(--accent)' }}
                      onClick={() => toast('Opening transaction_receipt.pdf…', 'info')}
                    >
                      📎 View transaction_receipt.pdf
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button size="sm" variant="danger" onClick={() => act(r.id, 'rejected')}>
                      Reject
                    </Button>
                    <Button size="sm" onClick={() => act(r.id, 'verified')}>
                      ✓ Verify
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {resolved.length > 0 && (
        <div>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--muted-foreground)' }}>Resolved</p>
          <div className="flex flex-col gap-2">
            {resolved.map(r => {
              const s = STATUS_LABEL[r.status];
              return (
                <Card key={r.id} className="p-4 opacity-75">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{r.projectTitle}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        {r.team} · {r.amount} from {r.industry} · Ref: {r.txnRef}
                      </p>
                    </div>
                    <Badge variant={s.variant}>{s.label}</Badge>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
