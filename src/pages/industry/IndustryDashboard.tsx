import { Card, StatCard, StageBadge, Badge, Button, Avatar } from '../../components/ui';
import { MOCK_INDUSTRY_PROJECTS } from '../../data/mock';

export default function IndustryDashboard() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
          Industry Dashboard
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Rohan Kapoor · Infosys · Director of Innovation
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Problems Posted" value={3} sub="2 active" />
        <StatCard label="Teams Working" value={14} sub="on your problems" accent />
        <StatCard label="Projects Funded" value={2} sub="₹12L disbursed" />
        <StatCard label="Students Reached" value={47} />
      </div>

      {/* Active projects */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
          Student Projects on Your Problems
        </h2>
        <Button variant="secondary" size="sm">View all</Button>
      </div>
      <div className="flex flex-col gap-3 mb-8">
        {MOCK_INDUSTRY_PROJECTS.map(p => (
          <Card key={p.id} className="p-4 flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{p.title}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.team} · {p.institution}</p>
            </div>
            <StageBadge stage={p.stage} />
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--secondary)' }}>
                <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: 'var(--primary)' }} />
              </div>
              <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{p.progress}%</span>
            </div>
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.members} members</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm">Mentor</Button>
              <Button variant="secondary" size="sm">Fund</Button>
              <Button size="sm">View →</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
