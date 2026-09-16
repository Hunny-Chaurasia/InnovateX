import { useState } from 'react';
import { Card, Badge, Button, Avatar } from '../../components/ui';
import { MOCK_CHANGE_REQUESTS } from '../../data/mock';

export default function ChangeRequests() {
  const [requests, setRequests] = useState(MOCK_CHANGE_REQUESTS.map(r => ({ ...r, status: 'pending' as 'pending' | 'approved' | 'rejected' })));

  const act = (id: string, action: 'approved' | 'rejected') => {
    setRequests(r => r.map(req => req.id === id ? { ...req, status: action } : req));
  };

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

      {requests.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'var(--muted-foreground)' }}>
          No pending requests.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map(r => (
            <Card key={r.id} className="p-5">
              <div className="flex items-start gap-4 flex-wrap">
                <Avatar initials={r.avatar} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{r.studentName}</p>
                    <span className="text-xs font-mono" style={{ color: 'var(--accent)' }}>{r.virtualId}</span>
                  </div>
                  <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
                    Current institution: <strong style={{ color: 'var(--foreground)' }}>{r.currentInstitution}</strong>
                  </p>
                  <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
                    Requested on {r.requestDate}
                  </p>
                  <a href={`https://${r.linkedIn}`} target="_blank" rel="noreferrer"
                    className="text-xs hover:underline" style={{ color: 'var(--accent)' }}>
                    🔗 {r.linkedIn}
                  </a>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {r.status === 'pending' ? (
                    <>
                      <Button variant="danger" size="sm" onClick={() => act(r.id, 'rejected')}>Reject</Button>
                      <Button size="sm" onClick={() => act(r.id, 'approved')}>Approve</Button>
                    </>
                  ) : (
                    <Badge variant={r.status === 'approved' ? 'success' : 'danger'}>
                      {r.status === 'approved' ? '✓ Approved' : '✕ Rejected'}
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
