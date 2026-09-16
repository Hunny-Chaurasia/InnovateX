import { Card, StatCard, Badge, Button } from '../../components/ui';
import { ADMIN_ANALYTICS, MOCK_ADMIN_USERS } from '../../data/mock';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="px-3 py-2 rounded-lg border text-xs" style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
        <p>{label}</p>
        <p style={{ color: 'var(--accent)' }}>{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
          Platform Overview
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          InnovateX admin — real-time platform health and analytics.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Users" value={ADMIN_ANALYTICS.activeUsers.toLocaleString()} sub="+127 this week" accent />
        <StatCard label="Cross-Institution Teams" value={`${ADMIN_ANALYTICS.crossInstitutionPct}%`} sub="of all teams" />
        <StatCard label="Funding Disbursed" value={ADMIN_ANALYTICS.fundingDisbursed} sub="platform-wide" />
        <StatCard label="Total Projects" value={280} sub="since launch" />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="p-5 md:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--muted-foreground)' }}>User Growth</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={ADMIN_ANALYTICS.growth}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="users" stroke="#7c3aed" strokeWidth={2} fill="url(#userGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--muted-foreground)' }}>Projects by Stage</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ADMIN_ANALYTICS.projectsByStage} layout="vertical" barSize={12}>
              <XAxis type="number" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="stage" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,58,237,0.06)' }} />
              <Bar dataKey="count" fill="#7c3aed" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent users */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>Recent Users</h2>
        <Button variant="ghost" size="sm" onClick={() => window.location.href = '/admin/users'}>View all →</Button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['Name', 'Role', 'Institution', 'Status', 'Registered Via'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_ADMIN_USERS.slice(0, 4).map(u => (
                <tr key={u.id} className="border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                        style={{ background: 'var(--primary)', color: 'white' }}>{u.avatar}</div>
                      <span className="text-sm" style={{ color: 'var(--foreground)' }}>{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge>{u.role}</Badge></td>
                  <td className="px-4 py-3"><span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{u.institution}</span></td>
                  <td className="px-4 py-3">
                    <Badge variant={u.status === 'Active' ? 'success' : u.status === 'Invited' ? 'pending' : 'danger'}>
                      {u.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3"><span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{u.registeredVia}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
