import { Card, StatCard, StageBadge, Badge, Button, Avatar } from '../../components/ui';
import { MOCK_FACULTY_CHARTS, MOCK_FACULTY_PROJECTS } from '../../data/mock';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="px-3 py-2 rounded-lg border text-xs" style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
        <p>{label || payload[0].name}</p>
        <p style={{ color: 'var(--accent)' }}>{payload[0].value} projects</p>
      </div>
    );
  }
  return null;
};

export default function FacultyDashboard() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
          Faculty Dashboard
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Dr. Priya Sharma · Delhi Technological University
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Projects Mentored" value={11} sub="all time" />
        <StatCard label="Active" value={7} sub="in progress" accent />
        <StatCard label="Completed" value={4} sub="this year" />
        <StatCard label="Students Guided" value={34} sub="across teams" />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="p-5 md:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--muted-foreground)' }}>
            Projects Mentored Over Time
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={MOCK_FACULTY_CHARTS.projectsOverTime} barSize={16}>
              <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,58,237,0.06)' }} />
              <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--muted-foreground)' }}>
            Projects by Stage
          </p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={MOCK_FACULTY_CHARTS.projectsByStage} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {MOCK_FACULTY_CHARTS.projectsByStage.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1.5 mt-2">
            {MOCK_FACULTY_CHARTS.projectsByStage.map(s => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span style={{ color: 'var(--muted-foreground)' }}>{s.name}</span>
                </div>
                <span style={{ color: 'var(--foreground)' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>My Teams</h2>
        <Button variant="secondary" size="sm">+ Form Team</Button>
      </div>
      <div className="flex flex-col gap-2">
        {MOCK_FACULTY_PROJECTS.map(p => (
          <Card key={p.id} className="p-4 flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{p.title}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.team}</p>
            </div>
            <StageBadge stage={p.stage} />
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5">
                {Array.from({ length: p.milestones }).map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-sm"
                    style={{ background: i < p.completed ? 'var(--primary)' : 'var(--border)' }} />
                ))}
              </div>
              <span className="text-xs ml-1" style={{ color: 'var(--muted-foreground)' }}>{p.completed}/{p.milestones}</span>
            </div>
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.lastActivity}</span>
            <Button variant="ghost" size="sm">Review →</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
