import { useState } from 'react';
import { Card, Badge, Button, EmptyState } from '../../components/ui';
import { MOCK_PROBLEMS } from '../../data/mock';

const DOMAINS = ['All', 'Technology', 'Healthcare', 'Environment', 'Education', 'Finance'];

export default function Discover() {
  const [tab, setTab] = useState<'industry' | 'community'>('industry');
  const [domain, setDomain] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = MOCK_PROBLEMS.filter(p =>
    (domain === 'All' || p.domain === domain) &&
    (search === '' || p.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
          Discover
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Browse real-world problems from industry or community-submitted ideas.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg mb-6 w-fit" style={{ background: 'var(--secondary)' }}>
        {(['industry', 'community'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
            style={{
              background: tab === t ? 'var(--card)' : 'transparent',
              color: tab === t ? 'var(--foreground)' : 'var(--muted-foreground)',
            }}
          >
            {t === 'industry' ? 'Industry Problems' : 'Community Ideas'}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <input
          placeholder="Search problems..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border outline-none flex-1 min-w-48"
          style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
        />
        <div className="flex gap-2 flex-wrap">
          {DOMAINS.map(d => (
            <button
              key={d}
              onClick={() => setDomain(d)}
              className="px-3 py-1.5 text-xs rounded-lg border font-medium"
              style={{
                background: domain === d ? 'var(--primary)' : 'transparent',
                borderColor: domain === d ? 'var(--primary)' : 'var(--border)',
                color: domain === d ? 'white' : 'var(--muted-foreground)',
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No problems found"
          body="Try adjusting your search or filters to discover more challenges."
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <Card key={p.id} className="p-5 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}
                >
                  {p.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-snug" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
                    {p.title}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.company}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {p.tags.map(t => <Badge key={t}>{t}</Badge>)}
              </div>
              <div className="flex items-center justify-between mt-auto pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  {p.applicants} teams working · {p.postedDays}d ago
                </span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">View</Button>
                  <Button size="sm">Solve</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
