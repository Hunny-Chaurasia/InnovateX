import { useMemo, useState } from 'react';
import { Card, StatCard, Badge, Button, EmptyState } from '../../components/ui';
import { useToast } from '../../components/Toast';
import {
  useWorkflow, useAllProblems, markProblemSeen, toggleShortlist, CURRENT_FACULTY,
  type ProblemStatement,
} from '../../store/workflow';

type View = 'all' | 'new' | 'shortlisted' | 'csr';

/**
 * Faculty portal for incoming problem statements (PS).
 * Shows every problem industry partners post (plus the existing ones), so faculty can
 * spot what's new, shortlist the ones that fit their students, and read the full brief.
 */
export default function ProblemStatements() {
  const { toast } = useToast();
  const { seenProblems, shortlist } = useWorkflow();
  const problems = useAllProblems();

  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('All');
  const [view, setView] = useState<View>('all');
  const [selected, setSelected] = useState<ProblemStatement | null>(null);

  const isNew = (p: ProblemStatement) => p.postedDays <= 3 && !seenProblems.includes(p.id);
  const domains = useMemo(() => ['All', ...Array.from(new Set(problems.map(p => p.domain)))], [problems]);

  const counts = {
    all: problems.length,
    new: problems.filter(isNew).length,
    shortlisted: problems.filter(p => shortlist.includes(p.id)).length,
    csr: problems.filter(p => p.csr).length,
  };

  const filtered = problems.filter(p => {
    if (domain !== 'All' && p.domain !== domain) return false;
    if (view === 'new' && !isNew(p)) return false;
    if (view === 'shortlisted' && !shortlist.includes(p.id)) return false;
    if (view === 'csr' && !p.csr) return false;
    const q = search.trim().toLowerCase();
    return !q || p.title.toLowerCase().includes(q) || p.company.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q));
  });

  const open = (p: ProblemStatement) => { setSelected(p); markProblemSeen(p.id); };
  const shortlistToggle = (p: ProblemStatement) => {
    const was = shortlist.includes(p.id);
    toggleShortlist(p.id);
    toast(was ? `Removed "${p.title}" from your shortlist.` : `Shortlisted "${p.title}".`, was ? 'info' : 'success');
  };

  const views: { id: View; label: string; n: number }[] = [
    { id: 'all', label: 'All', n: counts.all },
    { id: 'new', label: 'New', n: counts.new },
    { id: 'shortlisted', label: 'Shortlisted', n: counts.shortlisted },
    { id: 'csr', label: 'CSR', n: counts.csr },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>Problem Statements</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Challenges posted by industry partners. {CURRENT_FACULTY.name} · {CURRENT_FACULTY.institution}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total" value={counts.all} sub="open problems" />
        <StatCard label="New" value={counts.new} sub="not yet opened" accent={counts.new > 0} />
        <StatCard label="Shortlisted" value={counts.shortlisted} sub="for your students" />
        <StatCard label="CSR" value={counts.csr} sub="tagged initiatives" />
      </div>

      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <input
          placeholder="Search by title, company or tag…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border outline-none flex-1 min-w-48"
          style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
        />
        <div className="flex gap-2 flex-wrap">
          {views.map(v => (
            <button key={v.id} onClick={() => setView(v.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border font-medium"
              style={{
                background: view === v.id ? 'var(--primary)' : 'transparent',
                borderColor: view === v.id ? 'var(--primary)' : 'var(--border)',
                color: view === v.id ? 'white' : 'var(--muted-foreground)',
              }}>
              {v.label} <span style={{ opacity: 0.7 }}>{v.n}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {domains.map(d => (
          <button key={d} onClick={() => setDomain(d)} className="px-3 py-1.5 text-xs rounded-lg border font-medium"
            style={{
              background: domain === d ? 'var(--secondary)' : 'transparent',
              borderColor: domain === d ? 'var(--foreground)' : 'var(--border)',
              color: domain === d ? 'var(--foreground)' : 'var(--muted-foreground)',
            }}>
            {d}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="📭" title="No problem statements here" body="Try another filter, or check back when industry partners post new challenges." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(p => {
            const starred = shortlist.includes(p.id);
            return (
              <Card key={p.id} className="p-5 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}>{p.logo}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm leading-snug" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>{p.title}</p>
                      {isNew(p) && <Badge variant="info">New</Badge>}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.company} · {p.domain}</p>
                  </div>
                </div>
                {p.description && (
                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>{p.description}</p>
                )}
                <div className="flex flex-wrap gap-1">
                  {p.csr && <Badge variant="success">CSR</Badge>}
                  {p.tags.map(t => <Badge key={t}>{t}</Badge>)}
                </div>
                <div className="flex items-center justify-between mt-auto pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    {p.applicants} teams · {p.postedDays === 0 ? 'today' : `${p.postedDays}d ago`}
                  </span>
                  <div className="flex gap-2">
                    <Button variant={starred ? 'secondary' : 'ghost'} size="sm" onClick={() => shortlistToggle(p)}>
                      {starred ? '★ Shortlisted' : '☆ Shortlist'}
                    </Button>
                    <Button size="sm" onClick={() => open(p)}>Read brief</Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div className="w-full max-w-lg rounded-2xl border flex flex-col max-h-[90vh]" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-start justify-between p-6 border-b gap-3" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}>{selected.logo}</div>
                <div className="min-w-0">
                  <h3 className="font-bold text-base leading-tight mb-0.5" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>{selected.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{selected.company}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} aria-label="Close" style={{ color: 'var(--muted-foreground)' }}>✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="info">{selected.domain}</Badge>
                {selected.csr && <Badge variant="success">CSR initiative</Badge>}
                {selected.tags.map(t => <Badge key={t}>{t}</Badge>)}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--muted-foreground)' }}>Problem statement</p>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--foreground)' }}>
                  {selected.description ??
                    `${selected.company} is looking for student teams to build a solution for "${selected.title}", with access to company mentors and the possibility of live deployment.`}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg" style={{ background: 'var(--muted)' }}>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Teams working on this</p>
                  <p className="text-xl font-bold mt-0.5" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>{selected.applicants}</p>
                </div>
                <div className="p-3 rounded-lg" style={{ background: 'var(--muted)' }}>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Posted</p>
                  <p className="text-xl font-bold mt-0.5" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
                    {selected.postedDays === 0 ? 'Today' : `${selected.postedDays}d ago`}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t" style={{ borderColor: 'var(--border)' }}>
              <Button variant="secondary" onClick={() => setSelected(null)} className="flex-1">Close</Button>
              <Button onClick={() => shortlistToggle(selected)} className="flex-1">
                {shortlist.includes(selected.id) ? '★ Shortlisted' : '☆ Shortlist for my students'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
