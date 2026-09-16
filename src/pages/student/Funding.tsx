import { Card, Badge, Button } from '../../components/ui';

const OPPORTUNITIES = [
  { id: 'o1', title: 'Startup India Seed Fund', type: 'Funding', org: 'Govt. of India', amount: '₹20L', deadline: 'Oct 15, 2024', tags: ['Open to all', 'Early Stage'], desc: 'Seed funding for early-stage startups solving real societal problems.' },
  { id: 'o2', title: 'HDFC Innovation Fellowship', type: 'Mentorship', org: 'HDFC Bank', amount: '₹5L stipend', deadline: 'Oct 5, 2024', tags: ['FinTech', 'Social Impact'], desc: '6-month paid fellowship with access to banking infra and mentors.' },
  { id: 'o3', title: 'Infosys InnoTech Workshop', type: 'Workshop', org: 'Infosys', amount: 'Free', deadline: 'Oct 20, 2024', tags: ['AI/ML', 'Cloud', 'Live'], desc: '2-day intensive on AI/ML product building with Infosys engineers.' },
  { id: 'o4', title: 'Tata Social Enterprise Challenge', type: 'Funding', org: 'Tata Trusts', amount: '₹50L', deadline: 'Nov 1, 2024', tags: ['Social Enterprise', 'Scale'], desc: 'For ventures with proven impact model seeking scale-up funding.' },
  { id: 'o5', title: 'NASSCOM 10,000 Startups', type: 'Mentorship', org: 'NASSCOM', amount: 'Equity-free', deadline: 'Open', tags: ['Technology', 'Mentorship'], desc: 'Access to investor network, co-working spaces, and NASSCOM ecosystem.' },
];

const TYPE_COLORS: Record<string, string> = {
  Funding: 'success',
  Mentorship: 'info',
  Workshop: 'college',
};

export default function Funding() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
          Funding & Opportunities
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Open grants, workshops, and mentorship slots to apply for.
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {['All', 'Funding', 'Mentorship', 'Workshop'].map(t => (
          <button key={t} className="px-3 py-1.5 text-xs rounded-lg border font-medium"
            style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {OPPORTUNITIES.map(o => (
          <Card key={o.id} className="p-5">
            <div className="flex items-start gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="font-semibold" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>{o.title}</p>
                  <Badge variant={TYPE_COLORS[o.type] as any}>{o.type}</Badge>
                </div>
                <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>{o.org}</p>
                <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>{o.desc}</p>
                <div className="flex flex-wrap gap-1">
                  {o.tags.map(t => <Badge key={t}>{t}</Badge>)}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--accent)' }}>{o.amount}</p>
                <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>Deadline: {o.deadline}</p>
                <Button size="sm">Apply Now</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
