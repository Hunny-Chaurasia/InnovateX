import { useState } from 'react';
import { Card, Badge, StageBadge, Button } from '../../components/ui';
import { MOCK_FACULTY_PROJECTS, MOCK_MILESTONES } from '../../data/mock';

export default function ReviewPanel() {
  const [selected, setSelected] = useState(MOCK_FACULTY_PROJECTS[0].id);
  const [feedback, setFeedback] = useState('');
  const project = MOCK_FACULTY_PROJECTS.find(p => p.id === selected) || MOCK_FACULTY_PROJECTS[0];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
          Review Panel
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Review proposals, approve milestones, and provide feedback.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Project list */}
        <div className="flex flex-col gap-2">
          {MOCK_FACULTY_PROJECTS.map(p => (
            <Card
              key={p.id}
              className="p-4 cursor-pointer"
              style={{ cursor: 'pointer', borderColor: selected === p.id ? 'var(--primary)' : 'var(--border)' }}
              onClick={() => setSelected(p.id)}
            >
              <div className="flex items-start justify-between mb-1">
                <p className="font-medium text-sm flex-1 mr-2" style={{ color: 'var(--foreground)' }}>{p.title}</p>
                <StageBadge stage={p.stage} />
              </div>
              <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>{p.team}</p>
              <div className="flex gap-0.5">
                {Array.from({ length: p.milestones }).map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-sm" style={{ background: i < p.completed ? 'var(--primary)' : 'var(--border)' }} />
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Review area */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>{project.title}</h2>
              <StageBadge stage={project.stage} />
            </div>

            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--muted-foreground)' }}>
              Milestones
            </p>
            <div className="flex flex-col gap-2 mb-4">
              {MOCK_MILESTONES.map(m => (
                <div key={m.id} className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: 'var(--muted)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded flex items-center justify-center text-xs flex-shrink-0"
                      style={{ background: m.done ? 'var(--primary)' : 'transparent', border: `1.5px solid ${m.done ? 'var(--primary)' : 'var(--border)'}`, color: 'white' }}>
                      {m.done ? '✓' : ''}
                    </div>
                    <span className="text-sm" style={{ color: m.done ? 'var(--muted-foreground)' : 'var(--foreground)', textDecoration: m.done ? 'line-through' : 'none' }}>
                      {m.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.dueDate}</span>
                    {!m.done && <Button size="sm" variant="secondary">Approve</Button>}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Feedback composer */}
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--muted-foreground)' }}>
              Leave Feedback
            </p>
            <textarea
              placeholder="Write your feedback for the team..."
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 text-sm rounded-lg border outline-none resize-none"
              style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
            <div className="flex justify-end mt-3">
              <Button disabled={!feedback}>Send Feedback</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
