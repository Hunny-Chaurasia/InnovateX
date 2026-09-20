import { useState } from 'react';
import { Card, Badge, Button, Avatar } from '../../components/ui';
import { useToast } from '../../components/Toast';
import { MOCK_CHANGE_REQUESTS } from '../../data/mock';

export default function ChangeRequests() {
  const { toast } = useToast();
  const [requests, setRequests] = useState(
    MOCK_CHANGE_REQUESTS.map(r => ({ ...r, status: 'pending' as 'pending' | 'approved' | 'rejected' }))
  );

  const act = (id: string, action: 'approved' | 'rejected') => {
    setRequests(r => r.map(req => req.id === id ? { ...req, status: action } : req));
    const req = requests.find(r => r.id === id);
    if (action === 'approved') {
      toast(`${req?.studentName}'s institution change has been approved. They've been notified.`, 'success');
    } else {
      toast(`${req?.studentName}'s request has been declined.`, 'warning');
    }
  };

  const pending = requests.filter(r => r.status === 'pending');
  const resolved = requests.filter(r => r.status !== 'pending');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
          Institution Change Requests
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Students requesting to join Delhi Technological University.
        </p>
      </div>

      {pending.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Pending Review</p>
            <Badge variant="warning">{pending.length}</Badge>
          </div>
          <div className="flex flex-col gap-3">
            {pending.map(r => (
              <Card key={r.id} className="p-5">
                <div className="flex items-start gap-4 flex-wrap">
                  <Avatar initials={r.avatar} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{r.studentName}</p>
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(124,58,237,0.1)', color: 'var(--accent)' }}>
                        {r.virtualId}
                      </span>
                    </div>
                    <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
                      Transferring from <strong style={{ color: 'var(--foreground)' }}>{r.currentInstitution}</strong>
                    </p>
                    <p className="text-xs mb-1.5" style={{ color: 'var(--muted-foreground)' }}>
                      Requested on {r.requestDate}
                    </p>
                    <a
                      href={`https://${r.linkedIn}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs hover:underline"
                      style={{ color: 'var(--accent)' }}
                    >
                      <span style={{ fontSize: 11, fontWeight: 700, border: '1px solid currentColor', borderRadius: 2, padding: '0 2px' }}>in</span>
                      {r.linkedIn}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="danger" size="sm" onClick={() => act(r.id, 'rejected')}>Reject</Button>
                    <Button size="sm" onClick={() => act(r.id, 'approved')}>Approve</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {pending.length === 0 && resolved.length === 0 && (
        <div className="text-center py-16" style={{ color: 'var(--muted-foreground)' }}>
          No pending institution change requests.
        </div>
      )}

      {resolved.length > 0 && (
        <div>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--muted-foreground)' }}>Resolved</p>
          <div className="flex flex-col gap-2">
            {resolved.map(r => (
              <Card key={r.id} className="p-4 opacity-70">
                <div className="flex items-center gap-3">
                  <Avatar initials={r.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{r.studentName}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>From {r.currentInstitution}</p>
                  </div>
                  <Badge variant={r.status === 'approved' ? 'success' : 'danger'}>
                    {r.status === 'approved' ? '✓ Approved' : '✕ Rejected'}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
