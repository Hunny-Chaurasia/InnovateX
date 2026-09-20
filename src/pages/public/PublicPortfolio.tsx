import { useParams } from 'react-router-dom';
import { PortfolioGrid, usePortfolioProjects } from '../../components/PortfolioGrid';
import { useWorkflow } from '../../store/workflow';

/**
 * Public, read-only portfolio at /u/:slug  (register this route OUTSIDE your logged-in layout).
 * The link is generated from Student > Portfolio > "Share Public Profile".
 */
export default function PublicPortfolio() {
  const { slug } = useParams<{ slug: string }>();
  const { profiles } = useWorkflow();
  const projects = usePortfolioProjects();
  const profile = Object.values(profiles).find(p => p.slug === slug);

  if (!profile || !profile.enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--background)' }}>
        <div className="text-center max-w-sm">
          <h1 className="text-xl font-bold mb-2" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
            This portfolio isn't available
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            The link may have been switched off or replaced. Ask the owner for a fresh link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
            style={{ background: 'var(--primary)', color: 'white' }}
          >
            {profile.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>{profile.name}</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{profile.institution} · Portfolio on InnovateX</p>
          </div>
        </div>
        <PortfolioGrid projects={projects} />
      </div>
    </div>
  );
}
