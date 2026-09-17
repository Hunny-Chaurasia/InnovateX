import { useState } from 'react';
import { Card, Badge, Button, Avatar } from '../../components/ui';
import { MOCK_ADMIN_USERS } from '../../data/mock';

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [users, setUsers] = useState(MOCK_ADMIN_USERS);

  const filtered = users.filter(u =>
    (roleFilter === 'All' || u.role === roleFilter) &&
    (search === '' || u.name.toLowerCase().includes(search.toLowerCase()) || u.institution.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleSuspend = (id: string) => {
    setUsers(us => us.map(u => u.id === id
      ? { ...u, status: u.status === 'Suspended' ? 'Active' : 'Suspended' }
      : u
    ));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
          User Management
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Search, filter, and manage all registered users.
        </p>
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <input
          placeholder="Search users, institutions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border outline-none flex-1 min-w-48"
          style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
        />
        <div className="flex gap-2">
          {['All', 'Student', 'Faculty', 'Industry'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className="px-3 py-1.5 text-xs rounded-lg border font-medium"
              style={{
                background: roleFilter === r ? 'var(--primary)' : 'transparent',
                borderColor: roleFilter === r ? 'var(--primary)' : 'var(--border)',
                color: roleFilter === r ? 'white' : 'var(--muted-foreground)',
              }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['User', 'Role', 'Institution', 'Status', 'Registered Via', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar initials={u.avatar} size="sm" />
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
                  <td className="px-4 py-3"><span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{u.joinDate}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">View</Button>
                      <Button
                        variant={u.status === 'Suspended' ? 'secondary' : 'danger'}
                        size="sm"
                        onClick={() => toggleSuspend(u.id)}
                      >
                        {u.status === 'Suspended' ? 'Restore' : 'Suspend'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
