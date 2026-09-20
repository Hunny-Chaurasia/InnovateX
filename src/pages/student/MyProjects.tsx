import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, StageBadge, InstitutionBadge, Button, Avatar, ProjectJourneyStepper, LinkedInLink } from '../../components/ui';
import { useToast } from '../../components/Toast';
import { MOCK_PROJECTS, MOCK_MENTORS, MOCK_MILESTONES } from '../../data/mock';
import ProofOfWork from '../../components/ProofOfWork';
import { useWorkflow } from '../../store/workflow';

function MentorModal({ project, onClose }: { project: typeof MOCK_PROJECTS[0]; onClose: () => void }) {
  const { toast } = useToast();
  const [selected, setSelected] = useState<string | null>(null);
  const isDifferentSchools = project.team.every(m => m.type === 'School');
  const required = isDifferentSchools;

  const handleSendRequest = () => {
    const mentor = MOCK_MENTORS.find(m => m.id === selected);
    if (mentor) {
      toast(`Mentor collaboration request sent to ${mentor.name}. Awaiting their response.`, 'success');
    } else {
      toast('Mentor collaboration request submitted.', 'info');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-md rounded-2xl border p-6" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
              Request Mentor Collaboration
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{project.title}</p>
          </div>
          <button onClick={onClose} style={{ color: 'var(--muted-foreground)' }}>✕</button>
        </div>

        {required && !selected && (
          <div className="p-3 rounded-lg mb-4 text-xs" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
            This team requires a mentor — please select one before requesting collaboration.
          </div>
        )}

        <div className="mb-1 flex items-center justify-between">
          <p className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
            AVAILABLE MENTORS
          </p>
          <Badge variant={required ? 'warning' : 'default'}>
            {required ? 'Required' : 'Optional'}
          </Badge>
        </div>

        <div className="flex flex-col gap-2 mb-4 max-h-56 overflow-y-auto">
          {MOCK_MENTORS.map(m => (
            <button
              key={m.id}
              onClick={() => setSelected(m.id === selected ? null : m.id)}
              className="flex items-center gap-3 p-3 rounded-lg border text-left"
              style={{
                background: selected === m.id ? 'rgba(124,58,237,0.1)' : 'var(--muted)',
                borderColor: selected === m.id ? 'var(--primary)' : 'transparent',
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

        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button
            onClick={handleSendRequest}
            className="flex-1"
            disabled={required && !selected}
          >
            Send Request
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function MyProjects() {
  const navigate = useNavigate();
  const { projects: created, proofs } = useWorkflow();
  // Projects you created (New Project) or joined sit next to your existing ones.
  const allProjects = [...MOCK_PROJECTS, ...(created as unknown as typeof MOCK_PROJECTS)];
  const [activeProject, setActiveProject] = useState(MOCK_PROJECTS[0].id);
  const [mentorModal, setMentorModal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'workspace' | 'team' | 'proof'>('workspace');
  const project = allProjects.find(p => p.id === activeProject) || allProjects[0];
  const mentorProject = allProjects.find(p => p.id === mentorModal);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
          My Projects
        </h1>
        <Button onClick={() => navigate('/student/new-project')}>+ New Project</Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Project list */}
        <div className="flex flex-col gap-3">
          {allProjects.map(p => (
            <Card
              key={p.id}
              className="p-4 cursor-pointer"
              style={{
                cursor: 'pointer',
                borderColor: activeProject === p.id ? 'var(--primary)' : 'var(--border)',
              }}
              onClick={() => setActiveProject(p.id)}
            >
              <p className="font-semibold text-sm mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
                {p.title}
              </p>
              <div className="flex items-center gap-2 mb-2">
                <StageBadge stage={p.stage} />
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.lastUpdated}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-1.5">
                  {p.team.slice(0, 3).map(m => <Avatar key={m.name} initials={m.avatar} size="sm" />)}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-mono" style={{ color: 'var(--accent)' }}>{p.proofOfWork + proofs.filter(x => x.projectId === p.id).length}</span>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>PoW</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Project detail */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card className="p-5">
            <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
              <div>
                <h2 className="text-lg font-bold" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
                  {project.title}
                </h2>
                <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{project.description}</p>
              </div>
              <StageBadge stage={project.stage} />
            </div>
            <ProjectJourneyStepper currentStage={project.stage === 'Building' ? 'Build' : project.stage} />
          </Card>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-lg w-fit" style={{ background: 'var(--secondary)' }}>
            {(['workspace', 'team', 'proof'] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className="px-3 py-1.5 rounded-md text-sm font-medium"
                style={{ background: activeTab === t ? 'var(--card)' : 'transparent', color: activeTab === t ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                {t === 'workspace' ? 'Workspace' : t === 'team' ? 'Team' : 'Proof of Work'}
              </button>
            ))}
          </div>

          {activeTab === 'workspace' && (
            <div className="flex flex-col gap-4">
              {/* Milestones */}
              <Card className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--muted-foreground)' }}>
                  Milestones
                </p>
                <div className="flex flex-col gap-2">
                  {MOCK_MILESTONES.map(m => (
                    <div key={m.id} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded flex items-center justify-center text-xs flex-shrink-0"
                        style={{
                          background: m.done ? 'var(--primary)' : 'transparent',
                          border: `1.5px solid ${m.done ? 'var(--primary)' : 'var(--border)'}`,
                          color: 'white',
                        }}
                      >
                        {m.done ? '✓' : ''}
                      </div>
                      <span className="text-sm flex-1" style={{ color: m.done ? 'var(--muted-foreground)' : 'var(--foreground)', textDecoration: m.done ? 'line-through' : 'none' }}>
                        {m.title}
                      </span>
                      <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{m.dueDate}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Activity log */}
              <Card className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--muted-foreground)' }}>
                  Activity Log
                </p>
                <div className="flex flex-col gap-2">
                  {project.activityLog.map((a, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--accent)' }} />
                      <div className="flex-1">
                        <span className="text-sm" style={{ color: 'var(--foreground)' }}>{a.text}</span>
                        <span className="text-xs ml-2" style={{ color: 'var(--muted-foreground)' }}>{a.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'proof' && <ProofOfWork projectId={project.id} />}

          {activeTab === 'team' && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
                  Team Members
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setMentorModal(project.id)}
                >
                  {project.mentorStatus === 'accepted' ? '✓ Mentor Attached' : 'Request Mentor'}
                </Button>
              </div>
              <div className="flex flex-col gap-3">
                {project.team.map(m => (
                  <div key={m.name} className="flex items-center gap-3">
                    <Avatar initials={m.avatar} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{m.name}</p>
                        {m.linkedin && <LinkedInLink url={m.linkedin} compact />}
                      </div>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.institution}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <InstitutionBadge type={m.type} />
                      <Badge>{m.role}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {mentorModal && mentorProject && (
        <MentorModal project={mentorProject} onClose={() => setMentorModal(null)} />
      )}
    </div>
  );
}
