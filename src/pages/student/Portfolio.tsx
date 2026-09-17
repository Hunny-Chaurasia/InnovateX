import { Card, Badge, StageBadge, Button, Avatar, EmptyState } from '../../components/ui';
import { MOCK_PROJECTS } from '../../data/mock';

export default function Portfolio() {
  const allProjects = [
    ...MOCK_PROJECTS,
    { id: 'proj3', title: 'EduBridge — Peer Learning Platform', stage: 'Deployed', lastUpdated: '3mo ago', proofOfWork: 14, mentorStatus: 'accepted', mentorName: 'Prof. Rahul Bose', teamSize: 3, category: 'EdTech', institution: 'IIT Bombay', description: 'Peer-to-peer learning app connecting students across institutions.', activityLog: [], team: [] },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
            My Portfolio
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Your public showcase of work on InnovateX.
          </p>
        </div>
        <Button variant="secondary" size="sm">🔗 Share Public Profile</Button>
      </div>

      {/* Stage filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['All', 'Ideation', 'Building', 'Funded', 'Deployed'].map(s => (
          <button key={s} className="px-3 py-1.5 text-xs rounded-lg border font-medium"
            style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
            {s}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allProjects.map(p => (
          <Card key={p.id} className="p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <p className="font-semibold text-sm flex-1 mr-2" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
                {p.title}
              </p>
              <StageBadge stage={p.stage} />
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              {p.description}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                <span className="font-mono" style={{ color: 'var(--accent)' }}>{p.proofOfWork}</span> proof-of-work
              </span>
              {p.teamSize > 0 && (
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>· {p.teamSize} members</span>
              )}
            </div>
            <div className="flex gap-2 mt-auto pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
              <Button variant="ghost" size="sm">View Details</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
