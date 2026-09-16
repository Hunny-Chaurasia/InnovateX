import { Card, StatCard } from '../../components/ui';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Apr', projects: 1 }, { month: 'May', projects: 2 }, { month: 'Jun', projects: 2 },
  { month: 'Jul', projects: 3 }, { month: 'Aug', projects: 3 }, { month: 'Sep', projects: 4 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="px-3 py-2 rounded-lg border text-xs" style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
        <p>{label}</p>
        <p style={{ color: 'var(--accent)' }}>{payload[0].value} projects</p>
      </div>
    );
  }
  return null;
};

export default function CSRImpact() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
          CSR Impact Dashboard
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Track your corporate social responsibility contributions through InnovateX.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Projects Funded" value={2} sub="₹12L total" />
        <StatCard label="Students Reached" value={47} sub="across 8 institutions" accent />
        <StatCard label="Patents Incubated" value={1} sub="in progress" />
        <StatCard label="Startups Spun Off" value={1} sub="from your problems" />
      </div>

      <Card className="p-5 mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--muted-foreground)' }}>
          CSR Projects Over Time
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} barSize={24}>
            <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,58,237,0.06)' }} />
            <Bar dataKey="projects" fill="#059669" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--muted-foreground)' }}>
          Funded Projects
        </p>
        <div className="flex flex-col gap-3">
          {[
            { title: 'MediAssist AI — Rural Diagnostics', team: 'Team Nova', amount: '₹8L', stage: 'Building', impact: 'Impacting 3 rural clinics in Maharashtra' },
            { title: 'GreenRoute — Carbon Navigator', team: 'Team Echo', amount: '₹4L', stage: 'Prototype', impact: 'Reducing fleet emissions by est. 22% in pilot' },
          ].map(p => (
            <div key={p.title} className="flex items-start gap-4 p-3 rounded-lg" style={{ background: 'var(--muted)' }}>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{p.title}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.team}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--accent)' }}>{p.impact}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold" style={{ color: '#34d399' }}>{p.amount}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.stage}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
