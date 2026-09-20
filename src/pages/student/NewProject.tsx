import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, Button, Avatar, Input, InstitutionBadge, LinkedInLink } from '../../components/ui';
import { useToast } from '../../components/Toast';
import { MOCK_MENTORS } from '../../data/mock';
import {
  CONTACTS, CURRENT_STUDENT, createProject, addRequests, teamFormationRule,
  type Person,
} from '../../store/workflow';

/**
 * New Project wizard
 *   1. Project     - what are you building
 *   2. Team        - pick people from your contact list + "reason to join" pitch
 *   3. Mentor      - find a mentor (required if every member is a school student)
 *   4. Send        - review + send collaboration requests
 *
 * Team rule: students always form their own teams (colleges, universities, cross-institution).
 * A team made only of students from the SAME school is formed by that school's faculty instead.
 */

const CATEGORIES = ['EdTech', 'HealthTech', 'GreenTech', 'FinTech', 'AgriTech', 'Other'];
const STEPS = ['Project', 'Team', 'Mentor', 'Send'];
type Mentor = typeof MOCK_MENTORS[0];
type ContactFilter = 'All' | 'My institution' | 'Other institutions' | 'Schools';

export default function NewProject() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [invitedIds, setInvitedIds] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const [mentorId, setMentorId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ContactFilter>('All');
  const [sent, setSent] = useState<{ projectTitle: string; people: string[]; mentor?: string } | null>(null);

  const me = CURRENT_STUDENT;
  const invitees = CONTACTS.filter(c => invitedIds.includes(c.id));
  const members: Person[] = [me, ...invitees];
  const rule = teamFormationRule(members);
  const blockedByRule = rule.formedBy === 'faculty'; // same-school team: faculty forms it
  const mentorRequired = members.every(m => m.type === 'School');
  const mentor: Mentor | undefined = MOCK_MENTORS.find(m => m.id === mentorId);

  const contacts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CONTACTS.filter(c => c.id !== me.id).filter(c => {
      if (q && !c.name.toLowerCase().includes(q) && !c.institution.toLowerCase().includes(q)) return false;
      if (filter === 'My institution') return c.institution === me.institution;
      if (filter === 'Other institutions') return c.institution !== me.institution;
      if (filter === 'Schools') return c.type === 'School';
      return true;
    });
  }, [search, filter, me.id, me.institution]);

  const canNext =
    step === 0 ? title.trim().length >= 3 && description.trim().length >= 10
    : step === 1 ? invitees.length >= 1 && reason.trim().length >= 10 && !blockedByRule
    : step === 2 ? !mentorRequired || !!mentor
    : true;

  const toggleInvite = (id: string) => setInvitedIds(ids => (ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]));

  const send = () => {
    const projectId = createProject({
      title: title.trim(), description: description.trim(), category,
      stage: 'Ideation', lastUpdated: 'Just now', proofOfWork: 0,
      mentorStatus: mentor ? 'pending' : 'none', teamSize: members.length, institution: me.institution,
      activityLog: [{ text: 'Project created. Collaboration requests sent.', date: 'Just now' }],
      team: members.map(m => ({
        id: m.id, name: m.name, avatar: m.avatar, institution: m.institution, type: m.type,
        role: m.id === me.id ? 'Team Lead' : 'Invited', linkedin: m.linkedin,
      })),
      leaderId: me.id, formedBy: 'student',
    });

    addRequests([
      ...invitees.map(c => ({
        kind: 'member' as const, direction: 'outgoing' as const, projectId, projectTitle: title.trim(),
        projectDescription: description.trim(), from: me, to: c, reason: reason.trim(),
      })),
      ...(mentor
        ? [{
            kind: 'mentor' as const, direction: 'outgoing' as const, projectId, projectTitle: title.trim(),
            projectDescription: description.trim(), from: me,
            to: { id: mentor.id, name: mentor.name, avatar: mentor.avatar, institution: mentor.institution },
            reason: reason.trim(),
          }]
        : []),
    ]);

    setSent({ projectTitle: title.trim(), people: invitees.map(i => i.name), mentor: mentor?.name });
    toast('Collaboration requests sent. You are the team leader.', 'success');
  };

  const reset = () => {
    setStep(0); setTitle(''); setDescription(''); setCategory('Other');
    setInvitedIds([]); setReason(''); setMentorId(null); setSearch(''); setFilter('All'); setSent(null);
  };

  const fieldStyle = { background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' };

  /* ───────── Success ───────── */
  if (sent) {
    return (
      <div className="p-6 max-w-2xl mx-auto flex flex-col items-center gap-4 text-center">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
          style={{ background: 'rgba(5,150,105,0.15)', border: '2px solid rgba(5,150,105,0.4)' }}>✓</div>
        <h2 className="text-xl font-bold" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>Requests sent</h2>
        <p className="text-sm max-w-md" style={{ color: 'var(--muted-foreground)' }}>
          "{sent.projectTitle}" is created and you're the team leader. We invited {sent.people.join(', ')}
          {sent.mentor ? ` and asked ${sent.mentor} to mentor` : ''}. You'll be notified when they respond.
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={reset}>Start another</Button>
          <Button onClick={() => navigate('/student/actions')}>Track requests</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>New Project</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Describe your idea, invite teammates, and ask a mentor to join.
        </p>
      </div>

      {/* Stepper */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {STEPS.map((s, i) => (
          <button
            key={s}
            onClick={() => i < step && setStep(i)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg border font-medium"
            style={{
              background: step === i ? 'var(--primary)' : 'transparent',
              borderColor: step === i ? 'var(--primary)' : 'var(--border)',
              color: step === i ? 'white' : i < step ? 'var(--foreground)' : 'var(--muted-foreground)',
              cursor: i < step ? 'pointer' : 'default',
            }}
          >
            <span>{i < step ? '✓' : i + 1}</span> {s}
          </button>
        ))}
      </div>

      <Card className="p-6 flex flex-col gap-4">
        {/* Step 1 */}
        {step === 0 && (
          <>
            <Input label="Project title" placeholder="e.g. AgriSense: soil health alerts" value={title} onChange={setTitle} required />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                What are you building? <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="The problem, who it helps, and how you plan to solve it…"
                className="px-3 py-2 text-sm rounded-lg border outline-none resize-none"
                style={fieldStyle}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setCategory(c)} className="px-3 py-1.5 text-xs rounded-lg border font-medium"
                    style={{
                      background: category === c ? 'var(--primary)' : 'transparent',
                      borderColor: category === c ? 'var(--primary)' : 'var(--border)',
                      color: category === c ? 'white' : 'var(--muted-foreground)',
                    }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Step 2 */}
        {step === 1 && (
          <>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>Contact list</p>
              <Badge>{invitees.length} invited</Badge>
            </div>

            <div className="flex gap-2 flex-wrap">
              <input
                placeholder="Search by name or institution…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 min-w-48 px-3 py-2 text-sm rounded-lg border outline-none"
                style={fieldStyle}
              />
              {(['All', 'My institution', 'Other institutions', 'Schools'] as ContactFilter[]).map(f => (
                <button key={f} onClick={() => setFilter(f)} className="px-3 py-1.5 text-xs rounded-lg border font-medium"
                  style={{
                    background: filter === f ? 'var(--primary)' : 'transparent',
                    borderColor: filter === f ? 'var(--primary)' : 'var(--border)',
                    color: filter === f ? 'white' : 'var(--muted-foreground)',
                  }}>
                  {f}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
              {contacts.length === 0 && (
                <p className="text-xs text-center py-4" style={{ color: 'var(--muted-foreground)' }}>No contacts match your search.</p>
              )}
              {contacts.map(c => {
                const on = invitedIds.includes(c.id);
                return (
                  <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg border"
                    style={{ background: on ? 'rgba(124,58,237,0.1)' : 'var(--muted)', borderColor: on ? 'var(--primary)' : 'transparent' }}>
                    <Avatar initials={c.avatar} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{c.name}</p>
                        {c.linkedin && <LinkedInLink url={c.linkedin} compact />}
                      </div>
                      <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{c.institution}</p>
                    </div>
                    <InstitutionBadge type={c.type} />
                    <Button variant={on ? 'secondary' : 'ghost'} size="sm" onClick={() => toggleInvite(c.id)}>
                      {on ? '✓ Invited' : 'Invite'}
                    </Button>
                  </div>
                );
              })}
            </div>

            {blockedByRule ? (
              <div className="p-3 rounded-lg text-xs" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                {rule.note} Ask your faculty to form this team, or invite someone from another institution to form a cross-institution team yourself.
              </div>
            ) : invitees.length > 0 ? (
              <div className="p-3 rounded-lg text-xs" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>{rule.note}</div>
            ) : null}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                Reason to join <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Tell them why they should join: what you're solving, what you need from them, and what they'll gain."
                className="px-3 py-2 text-sm rounded-lg border outline-none resize-none"
                style={fieldStyle}
              />
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>This message goes to everyone you invite (and your mentor).</p>
            </div>
          </>
        )}

        {/* Step 3 */}
        {step === 2 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>Find a mentor</p>
              <Badge variant={mentorRequired ? 'warning' : 'default'}>{mentorRequired ? 'Required' : 'Optional'}</Badge>
            </div>
            {mentorRequired && !mentor && (
              <div className="p-3 rounded-lg text-xs" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                A team made only of school students needs a mentor. Pick one to continue.
              </div>
            )}
            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
              {MOCK_MENTORS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMentorId(m.id === mentorId ? null : m.id)}
                  className="flex items-center gap-3 p-3 rounded-lg border text-left"
                  style={{
                    background: mentorId === m.id ? 'rgba(124,58,237,0.1)' : 'var(--muted)',
                    borderColor: mentorId === m.id ? 'var(--primary)' : 'transparent',
                  }}
                >
                  <Avatar initials={m.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{m.name}</p>
                      <LinkedInLink url={m.linkedin} compact />
                    </div>
                    <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{m.domain} · {m.institution}</p>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.projects} projects</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 4 */}
        {step === 3 && (
          <>
            <p className="text-sm font-semibold" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>Review and send</p>
            <div className="p-4 rounded-lg flex flex-col gap-2" style={{ background: 'var(--muted)' }}>
              <p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{title}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{category} · {me.institution}</p>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{description}</p>
            </div>
            <div>
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>TEAM</p>
              <div className="flex flex-col gap-2">
                {members.map(m => (
                  <div key={m.id} className="flex items-center gap-3">
                    <Avatar initials={m.avatar} size="sm" />
                    <span className="text-sm flex-1" style={{ color: 'var(--foreground)' }}>{m.name}</span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.institution}</span>
                    <Badge variant={m.id === me.id ? 'success' : 'pending'}>{m.id === me.id ? 'Team leader' : 'Invite pending'}</Badge>
                  </div>
                ))}
                {mentor && (
                  <div className="flex items-center gap-3">
                    <Avatar initials={mentor.avatar} size="sm" />
                    <span className="text-sm flex-1" style={{ color: 'var(--foreground)' }}>{mentor.name}</span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{mentor.institution}</span>
                    <Badge variant="pending">Mentor request</Badge>
                  </div>
                )}
              </div>
            </div>
            <div className="p-3 rounded-lg text-xs" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
              <strong style={{ color: 'var(--foreground)' }}>Reason to join:</strong> {reason}
            </div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{rule.note} As team leader, you approve any funding the team receives.</p>
          </>
        )}

        <div className="flex gap-2 justify-between pt-2">
          <Button variant="secondary" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>← Back</Button>
          {step < 3 ? (
            <Button onClick={() => canNext && setStep(s => s + 1)} disabled={!canNext}>Continue →</Button>
          ) : (
            <Button onClick={send}>Send collaboration requests</Button>
          )}
        </div>
      </Card>
    </div>
  );
}
