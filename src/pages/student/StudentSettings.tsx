import { useState } from 'react';
import { Card, Badge, Button, Input, VirtualIdCard } from '../../components/ui';
import { useToast } from '../../components/Toast';

const INSTITUTIONS = [
  'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kharagpur', 'IIT Roorkee',
  'BITS Pilani', 'NIT Trichy', 'NIT Surathkal', 'Delhi Technological University',
  'VIT Vellore', 'Manipal Institute of Technology', 'IIM Ahmedabad',
  'Delhi Public School, R.K. Puram', 'The Doon School', 'Kendriya Vidyalaya IIT Campus',
];

type ChangeStatus = 'idle' | 'pending' | 'approved' | 'rejected';

export default function StudentSettings() {
  const { toast } = useToast();
  const [showChangeInstitution, setShowChangeInstitution] = useState(false);
  const [institutionSearch, setInstitutionSearch] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [changeStatus, setChangeStatus] = useState<ChangeStatus>('idle');
  const [linkedIn, setLinkedIn] = useState('linkedin.com/in/arjun-mehta');
  const [editingLinkedIn, setEditingLinkedIn] = useState(false);
  const [linkedInDraft, setLinkedInDraft] = useState(linkedIn);

  const currentInstitution = 'IIT Bombay';

  const filtered = INSTITUTIONS.filter(
    i => i.toLowerCase().includes(institutionSearch.toLowerCase()) && i !== currentInstitution
  ).slice(0, 8);

  const handleSubmitChange = () => {
    if (!selectedInstitution) return;
    setChangeStatus('pending');
    setShowChangeInstitution(false);
    toast(`Institution change request sent to a faculty member at ${selectedInstitution}. You'll be notified of their decision.`, 'info');
  };

  const handleSaveLinkedIn = () => {
    setLinkedIn(linkedInDraft);
    setEditingLinkedIn(false);
    toast('LinkedIn profile updated.', 'success');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
          Settings & Profile
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Manage your account, institution, and profile information.
        </p>
      </div>

      {/* Identity card */}
      <Card className="p-5 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--muted-foreground)' }}>
          Identity
        </p>
        <div className="flex items-start gap-4 flex-wrap">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
            style={{ background: 'var(--primary)', color: 'white' }}
          >
            AM
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-lg" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>Arjun Mehta</p>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Student · IIT Bombay · College</p>
            <div className="mt-3">
              <VirtualIdCard id="STU-2024-0042" />
            </div>
          </div>
        </div>
      </Card>

      {/* LinkedIn */}
      <Card className="p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
            LinkedIn Profile
          </p>
          {!editingLinkedIn && (
            <Button variant="ghost" size="sm" onClick={() => { setLinkedInDraft(linkedIn); setEditingLinkedIn(true); }}>
              Edit
            </Button>
          )}
        </div>
        {editingLinkedIn ? (
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="linkedin.com/in/your-name"
                value={linkedInDraft}
                onChange={setLinkedInDraft}
                prefix={<span style={{ fontSize: 11, fontWeight: 700 }}>in</span>}
              />
            </div>
            <Button onClick={handleSaveLinkedIn}>Save</Button>
            <Button variant="ghost" onClick={() => setEditingLinkedIn(false)}>Cancel</Button>
          </div>
        ) : (
          <a
            href={`https://${linkedIn}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, border: '1px solid currentColor', borderRadius: 2, padding: '0 2px' }}>in</span>
            {linkedIn}
          </a>
        )}
      </Card>

      {/* Institution */}
      <Card className="p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
            Institution
          </p>
        </div>

        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{currentInstitution}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>College · Registered Aug 2024</p>

            {changeStatus === 'pending' && (
              <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg"
                style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.25)' }}>
                <span style={{ color: '#fb923c' }}>⏳</span>
                <span className="text-xs font-medium" style={{ color: '#fb923c' }}>
                  Institution Change Pending — awaiting approval from {selectedInstitution}
                </span>
              </div>
            )}
            {changeStatus === 'approved' && (
              <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg"
                style={{ background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.25)' }}>
                <span style={{ color: '#34d399' }}>✓</span>
                <span className="text-xs font-medium" style={{ color: '#34d399' }}>Institution change approved.</span>
              </div>
            )}
            {changeStatus === 'rejected' && (
              <div className="flex flex-col gap-2 mt-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                  <span style={{ color: '#f87171' }}>✕</span>
                  <span className="text-xs font-medium" style={{ color: '#f87171' }}>
                    Request declined by {selectedInstitution}. You may re-submit or choose a different institution.
                  </span>
                </div>
                <Button variant="secondary" size="sm" onClick={() => { setChangeStatus('idle'); setSelectedInstitution(''); }}>
                  Try Again
                </Button>
              </div>
            )}
          </div>

          {(changeStatus === 'idle' || changeStatus === 'rejected') && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowChangeInstitution(true)}
            >
              Change Institution
            </Button>
          )}
        </div>

        {/* Change Institution form */}
        {showChangeInstitution && (
          <div className="mt-5 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>Select new institution</p>
            <input
              placeholder="Search institution..."
              value={institutionSearch}
              onChange={e => setInstitutionSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border outline-none mb-2"
              style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto mb-4">
              {filtered.length === 0 ? (
                <p className="text-xs text-center py-3" style={{ color: 'var(--muted-foreground)' }}>No institutions match your search.</p>
              ) : (
                filtered.map(inst => (
                  <button
                    key={inst}
                    onClick={() => setSelectedInstitution(inst)}
                    className="text-left px-3 py-2 rounded-lg text-sm"
                    style={{
                      background: selectedInstitution === inst ? 'rgba(124,58,237,0.12)' : 'var(--muted)',
                      color: selectedInstitution === inst ? 'var(--accent)' : 'var(--foreground)',
                      border: `1px solid ${selectedInstitution === inst ? 'rgba(124,58,237,0.3)' : 'transparent'}`,
                    }}
                  >
                    {inst}
                  </button>
                ))
              )}
            </div>

            {selectedInstitution && (
              <div className="p-3 rounded-lg mb-4 text-xs" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24' }}>
                Submitting will send a request to a faculty member at <strong>{selectedInstitution}</strong>. Your current institution remains unchanged until they approve. Your Virtual ID will not change.
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => { setShowChangeInstitution(false); setInstitutionSearch(''); setSelectedInstitution(''); }}>
                Cancel
              </Button>
              <Button onClick={handleSubmitChange} disabled={!selectedInstitution}>
                Submit Change Request
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Account */}
      <Card className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--muted-foreground)' }}>Account</p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Password</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Last changed 30 days ago</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => toast('Password reset link sent to your registered email.', 'info')}>
              Change
            </Button>
          </div>
          <div className="border-t pt-3" style={{ borderColor: 'var(--border)' }}>
            <Button variant="danger" size="sm" onClick={() => toast('Account deletion requires admin approval. Request submitted.', 'warning')}>
              Request Account Deletion
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
