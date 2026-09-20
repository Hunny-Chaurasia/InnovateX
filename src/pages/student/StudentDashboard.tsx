import { useNavigate } from 'react-router-dom';
import { Card, StatCard, Badge, StageBadge, InstitutionBadge, VirtualIdCard, Button, Avatar } from '../../components/ui';
import { MOCK_PROJECTS, MOCK_PROBLEMS } from '../../data/mock';

export default function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Welcome */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
            Good morning, Arjun 👋
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            IIT Bombay · <InstitutionBadge type="College" />
          </p>
        </div>
        <VirtualIdCard id="STU-2024-0042" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Projects" value={2} sub="1 mentor attached" />
        <StatCard label="Teams Joined" value={2} sub="2 institutions" />
        <StatCard label="Proof of Work" value={9} sub="submissions total" accent />
        <StatCard label="Portfolio Views" value={47} sub="this month" />
      </div>

      {/* Active projects quick view */}
      <h2 className="text-base font-semibold mb-3" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
        Active Projects
      </h2>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {MOCK_PROJECTS.map(p => (
          <Card
            key={p.id}
            className="p-4 cursor-pointer"
            style={{ cursor: 'pointer' }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm mb-1 truncate" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
                  {p.title}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <StageBadge stage={p.stage} />
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Updated {p.lastUpdated}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <span className="text-xs font-mono" style={{ color: 'var(--accent)' }}>{p.proofOfWork}</span>
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>PoW</span>
              </div>
            </div>
            {p.activityLog[0] && (
              <p className="text-xs px-2 py-1.5 rounded" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                ↑ {p.activityLog[0].text}
              </p>
            )}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex -space-x-2">
                {p.team.slice(0, 3).map(m => (
                  <Avatar key={m.name} initials={m.avatar} size="sm" />
                ))}
              </div>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.teamSize} members</span>
              {p.mentorStatus === 'accepted' && (
                <Badge variant="success">Mentor: {p.mentorName?.split(' ')[1]}</Badge>
              )}
              {p.mentorStatus === 'pending' && (
                <Badge variant="pending">Mentor Pending</Badge>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Recommended problems */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
          Recommended Problems
        </h2>
        <Button onClick={() => navigate('/student/discover')} variant="ghost" size="sm">
          View all →
        </Button>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        {MOCK_PROBLEMS.slice(0, 3).map(p => (
          <Card key={p.id} className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}
              >
                {p.logo}
              </div>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.company}</span>
            </div>
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>{p.title}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {p.tags.map(t => <Badge key={t}>{t}</Badge>)}
            </div>
            <Button variant="secondary" size="sm" className="w-full">Solve This</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
