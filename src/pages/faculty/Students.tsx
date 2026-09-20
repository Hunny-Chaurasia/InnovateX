import { useState } from 'react';
import { Card, Badge, Button, Avatar, Input, VirtualIdCard, LinkedInLink } from '../../components/ui';
import { useToast } from '../../components/Toast';
import { MOCK_STUDENTS_FACULTY } from '../../data/mock';
import { generateVirtualId } from '../../utils/virtualId';
import { useWorkflow, registerStudent, CURRENT_FACULTY } from '../../store/workflow';

function RegisterModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const { students } = useWorkflow();
  // Role-based Virtual ID (STU-…). Generated once when the modal opens, unique across everyone registered so far.
  const [newId] = useState(() =>
    generateVirtualId('student', [...MOCK_STUDENTS_FACULTY.map(s => s.virtualId), ...students.map(s => s.virtualId)]),
  );

  const handleRegister = () => {
    if (!name.trim() || !email.trim()) return;
    registerStudent({
      id: `reg-${newId}`,
      name: name.trim(),
      email: email.trim(),
      avatar: name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      virtualId: newId,
      linkedin: '',
      status: 'Pending', // becomes Active once the student sets their password
      projects: 0,
      joinDate: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      institution: CURRENT_FACULTY.institution,
      type: CURRENT_FACULTY.institutionType,
    });
    setDone(true);
  };

  if (done) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
        <div className="w-full max-w-sm rounded-2xl border p-6 text-center" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg mx-auto mb-3"
            style={{ background: 'rgba(5,150,105,0.15)', border: '2px solid rgba(5,150,105,0.4)' }}>✓</div>
          <h3 className="font-semibold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>Student Registered</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
            Setup link sent to <strong style={{ color: 'var(--foreground)' }}>{email}</strong>
          </p>
          <div className="flex justify-center mb-4">
            <VirtualIdCard id={newId} label="Generated Virtual ID" />
          </div>
          <Button onClick={onClose} className="w-full">Done</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-sm rounded-2xl border p-6" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>Register Student</h3>
          <button onClick={onClose} style={{ color: 'var(--muted-foreground)' }}>✕</button>
        </div>
        <div className="flex flex-col gap-3 mb-4">
          <Input label="Student Full Name" placeholder="Rahul Gupta" value={name} onChange={setName} required />
          <Input label="Student Email" type="email" placeholder="rahul@college.edu" value={email} onChange={setEmail} required />
          <div className="p-3 rounded-lg text-xs" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
            A Virtual ID will be auto-generated and a password setup link sent to the student's email.
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleRegister} className="flex-1" disabled={!name || !email}>
            Register & Send Invite
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Students() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const { students: registered } = useWorkflow();
  const allStudents = [...MOCK_STUDENTS_FACULTY, ...registered];

  const filtered = allStudents.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.virtualId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
            My Institution's Students
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Students registered under Delhi Technological University
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>+ Register Student</Button>
      </div>

      <div className="mb-4">
        <input
          placeholder="Search by name or Virtual ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border outline-none w-full max-w-sm"
          style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
        />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['Student', 'Virtual ID', 'LinkedIn', 'Status', 'Projects', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} className="border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar initials={s.avatar} size="sm" />
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{s.name}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono" style={{ color: 'var(--accent)' }}>{s.virtualId}</span>
                  </td>
                  <td className="px-4 py-3">
                    {s.linkedin ? <LinkedInLink url={s.linkedin} compact /> : <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={s.status === 'Active' ? 'success' : 'pending'}>{s.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm" style={{ color: 'var(--foreground)' }}>{s.projects}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.joinDate}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" onClick={() => toast(`Viewing profile for ${s.name}`, 'info')}>View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && <RegisterModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
