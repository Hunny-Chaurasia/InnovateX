import { useState } from 'react';
import { Card, StageBadge, Badge, Button } from '../../components/ui';
import { MOCK_INDUSTRY_PROJECTS } from '../../data/mock';

const allProjects = [
  ...MOCK_INDUSTRY_PROJECTS,
  { id: 'ip4', title: 'EduConnect Bridge', team: 'Team Sigma', institution: 'NIT Trichy', stage: 'Ideation', progress: 18, lastActivity: '1w ago', members: 4 },
  { id: 'ip5', title: 'WasteWise IoT', team: 'Team Vortex', institution: 'VIT Vellore', stage: 'Building', progress: 55, lastActivity: '2d ago', members: 5 },
];

export default function DiscoverProjects() {
  const [stageFilter, setStageFilter] = useState('All');

  const filtered = allProjects.filter(p => stageFilter === 'All' || p.stage === stageFilter);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
          Discover Student Projects
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Browse projects tackling your posted problems and the broader challenge space.
        </p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['All', 'Ideation', 'Building', 'Prototype'].map(s => (
          <button key={s} onClick={() => setStageFilter(s)}
            className="px-3 py-1.5 text-xs rounded-lg border font-medium"
            style={{
              background: stageFilter === s ? 'var(--primary)' : 'transparent',
              borderColor: stageFilter === s ? 'var(--primary)' : 'var(--border)',
              color: stageFilter === s ? 'white' : 'var(--muted-foreground)',
            }}>
            {s}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(p => (
          <Card key={p.id} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold mb-0.5" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>{p.title}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.team} · {p.institution}</p>
              </div>
              <StageBadge stage={p.stage} />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--secondary)' }}>
                <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: 'var(--primary)' }} />
              </div>
              <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{p.progress}%</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.members} members · {p.lastActivity}</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">Mentor</Button>
                <Button variant="secondary" size="sm">Fund</Button>
                <Button size="sm">View</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
