import { useState } from 'react';
import { Button } from '../../components/ui';
import { useToast } from '../../components/Toast';
import { PortfolioGrid, usePortfolioProjects } from '../../components/PortfolioGrid';
import {
  useWorkflow, ensureProfile, setProfileEnabled, regenerateSlug, publicProfileUrl, CURRENT_STUDENT,
} from '../../store/workflow';

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for non-HTTPS / older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  }
}

function ShareModal({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const { profiles } = useWorkflow();
  const profile = profiles[CURRENT_STUDENT.id];
  if (!profile) return null;
  const url = publicProfileUrl(profile.slug);

  const copy = async () => {
    toast((await copyText(url)) ? 'Portfolio link copied.' : 'Could not copy. Select the link and copy it manually.', 'info');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <div className="w-full max-w-md rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-start justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h3 className="font-bold" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>Share your portfolio</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              Anyone with this link can view your projects and proof of work.
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ color: 'var(--muted-foreground)' }}>✕</button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              readOnly
              value={url}
              onFocus={e => e.currentTarget.select()}
              className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border outline-none font-mono"
              style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)', opacity: profile.enabled ? 1 : 0.5 }}
            />
            <Button onClick={copy} disabled={!profile.enabled}>Copy</Button>
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer" onClick={() => setProfileEnabled(CURRENT_STUDENT.id, !profile.enabled)}>
            <div
              className="w-4 h-4 rounded flex items-center justify-center text-xs flex-shrink-0 mt-0.5"
              style={{ background: profile.enabled ? 'var(--primary)' : 'transparent', border: `1.5px solid ${profile.enabled ? 'var(--primary)' : 'var(--border)'}`, color: 'white' }}
            >
              {profile.enabled ? '✓' : ''}
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                {profile.enabled ? 'Public: anyone with the link can view' : 'Private: the link is switched off'}
              </p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Untick to hide your portfolio without deleting the link.</p>
            </div>
          </label>

          <div className="flex gap-2 justify-between flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { regenerateSlug(CURRENT_STUDENT); toast('New link created. The old link no longer works.', 'warning'); }}
            >
              Create new link
            </Button>
            <div className="flex gap-2">
              {profile.enabled && (
                <Button variant="secondary" size="sm" onClick={() => window.open(url, '_blank', 'noopener')}>
                  Open preview ↗
                </Button>
              )}
              <Button size="sm" onClick={onClose}>Done</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const projects = usePortfolioProjects();
  const { profiles } = useWorkflow();
  const [shareOpen, setShareOpen] = useState(false);
  const shared = profiles[CURRENT_STUDENT.id]?.enabled;

  const openShare = () => {
    ensureProfile(CURRENT_STUDENT); // generates the link the first time
    setShareOpen(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
            My Portfolio
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Your public showcase of work on InnovateX.
            {shared && ' Your portfolio is public.'}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={openShare}>
          🔗 {shared ? 'Manage public link' : 'Share Public Profile'}
        </Button>
      </div>

      <PortfolioGrid projects={projects} />

      {shareOpen && <ShareModal onClose={() => setShareOpen(false)} />}
    </div>
  );
}
