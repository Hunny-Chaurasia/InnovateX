import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Badge, StageBadge, InstitutionBadge, Button, Avatar, ProjectJourneyStepper, LinkedInLink } from '../../components/ui';
import { useToast } from '../../components/Toast';
import { MOCK_PROJECTS, MOCK_MILESTONES } from '../../data/mock';
import { useWorkflow } from '../../store/workflow';

// Small inline link for a team member's portfolio, styled to match LinkedInLink.
// Renders nothing if the member has no portfolioUrl set.
function PortfolioLink({ url }: { url?: string }) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="text-xs font-medium"
      style={{ color: 'var(--accent)' }}
      onClick={e => e.stopPropagation()}
    >
      Portfolio ↗
    </a>
  );
}

export default function Views() {
  const { toast } = useToast();
  const { projectId } = useParams<{ projectId?: string }>();
  const { projects: created, proofs } = useWorkflow();
  const allProjects = [...MOCK_PROJECTS, ...(created as unknown as typeof MOCK_PROJECTS)];
  const [activeProject, setActiveProject] = useState(
    (projectId && allProjects.some(p => p.id === projectId)) ? projectId : allProjects[0]?.id
  );
  const [query, setQuery] = useState('');

  const project: any = allProjects.find(p => p.id === activeProject) || allProjects[0];
  const projectProofs = (proofs as any[]).filter(p => p.projectId === project.id);
  const openedFromUnknownId = Boolean(projectId) && !allProjects.some(p => p.id === projectId);

  const filteredProjects = allProjects.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleConnect = () => {
    toast(`Your interest was shared with the ${project.title} team.`, 'success');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
            Project Views
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            Browse student projects, progress, proof of work, and team details.
          </p>
        </div>
      </div>

      {openedFromUnknownId && (
        <div className="p-3 rounded-lg mb-4 text-xs" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', color: '#eab308' }}>
          Couldn't find a detailed profile for that project id yet — showing the full list instead.
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Project list */}
        <div className="flex flex-col gap-3">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search projects…"
            className="text-sm px-3 py-2 rounded-md outline-none mb-1"
            style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
          />
          {filteredProjects.map(p => (
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
                  <span className="text-xs font-mono" style={{ color: 'var(--accent)' }}>
                    {p.proofOfWork + (proofs as any[]).filter(x => x.projectId === p.id).length}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>PoW</span>
                </div>
              </div>
            </Card>
          ))}
          {filteredProjects.length === 0 && (
            <p className="text-xs px-1" style={{ color: 'var(--muted-foreground)' }}>No projects match your search.</p>
          )}
        </div>

        {/* Project detail — read only */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card className="p-5">
            <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
              <div>
                <h2 className="text-lg font-bold" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
                  {project.title}
                </h2>
                <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{project.description}</p>
                {/* category + institution — pulled from mock data, not shown before */}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {project.category && <Badge>{project.category}</Badge>}
                  {project.institution && (
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{project.institution}</span>
                  )}
                  {project.teamSize && (
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>· {project.teamSize} members</span>
                  )}
                </div>
              </div>
              <StageBadge stage={project.stage} />
            </div>
            <ProjectJourneyStepper currentStage={project.stage === 'Building' ? 'Build' : project.stage} />
            <div className="mt-4 flex justify-end">
              <Button onClick={handleConnect}>Connect with Team</Button>
            </div>
          </Card>

          {/* Mentor — pulled from mock data, not shown before */}
          <Card className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--muted-foreground)' }}>
              Mentor
            </p>
            {project.mentorName ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Avatar initials={project.mentorName.split(' ').map((w: string) => w[0]).join('').slice(0, 2)} />
                  <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{project.mentorName}</span>
                </div>
                <Badge>{project.mentorStatus === 'accepted' ? 'Accepted' : project.mentorStatus}</Badge>
              </div>
            ) : (
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                {project.mentorStatus === 'pending' ? 'Mentor request pending' : 'No mentor assigned yet.'}
              </p>
            )}
          </Card>

          {/* Proof of Work */}
          <Card className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--muted-foreground)' }}>
              Proof of Work
            </p>
            <div className="flex flex-col gap-2">
              {projectProofs.map((proof: any, i: number) => (
                <div key={proof.id ?? i} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--accent)' }} />
                  <div className="flex-1">
                    <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                      {proof.title ?? proof.description ?? 'Proof of work submitted'}
                    </span>
                    {proof.date && (
                      <span className="text-xs ml-2" style={{ color: 'var(--muted-foreground)' }}>{proof.date}</span>
                    )}
                    {proof.link && (
                      <a href={proof.link} target="_blank" rel="noreferrer" className="text-xs ml-2" style={{ color: 'var(--accent)' }}>
                        View ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
              {projectProofs.length === 0 && (
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>No proof of work submitted yet.</p>
              )}
            </div>
          </Card>

          {/* Milestones — read only snapshot */}
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
                  <span
                    className="text-sm flex-1"
                    style={{ color: m.done ? 'var(--muted-foreground)' : 'var(--foreground)', textDecoration: m.done ? 'line-through' : 'none' }}
                  >
                    {m.title}
                  </span>
                  <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{m.dueDate}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Activity Log — pulled from mock data, not shown before */}
          {Array.isArray(project.activityLog) && project.activityLog.length > 0 && (
            <Card className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--muted-foreground)' }}>
                Activity Log
              </p>
              <div className="flex flex-col gap-2.5">
                {project.activityLog.map((entry: { date: string; text: string }, i: number) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="text-xs font-mono flex-shrink-0" style={{ color: 'var(--muted-foreground)', minWidth: '3.5rem' }}>
                      {entry.date}
                    </span>
                    <span className="text-sm" style={{ color: 'var(--foreground)' }}>{entry.text}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Team details */}
          <Card className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--muted-foreground)' }}>
              Team
            </p>
            <div className="flex flex-col gap-3">
              {project.team.map((m: any) => (
                <div key={m.name} className="flex items-center gap-3">
                  <Avatar initials={m.avatar} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{m.name}</p>
                      {m.linkedin && <LinkedInLink url={m.linkedin} compact />}
                      <PortfolioLink url={m.portfolioUrl} />
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
        </div>
      </div>
    </div>
  );
}
