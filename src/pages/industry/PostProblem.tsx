import { useState } from 'react';
import { Card, Button, Input, Badge } from '../../components/ui';

const DOMAINS = ['Technology', 'Healthcare', 'Education', 'Environment', 'Finance', 'Agriculture', 'Logistics'];

export default function PostProblem() {
  const [form, setForm] = useState({ title: '', description: '', domain: '', csr: false });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const set = (k: string) => (v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags(t => [...t, tagInput]);
      setTagInput('');
    }
  };

  if (submitted) {
    return (
      <div className="p-6 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-64 gap-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
          style={{ background: 'rgba(5,150,105,0.15)', border: '2px solid rgba(5,150,105,0.4)' }}>✓</div>
        <h2 className="text-xl font-bold" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>Problem Posted!</h2>
        <p className="text-sm text-center" style={{ color: 'var(--muted-foreground)' }}>
          Your problem is now live and students can discover and apply to solve it.
        </p>
        <Button onClick={() => setSubmitted(false)}>Post Another</Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>Post a Problem</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Define a real-world challenge for students to solve.
        </p>
      </div>

      <Card className="p-6 flex flex-col gap-4">
        <Input label="Problem Title" placeholder="AI-powered solution for..." value={form.title} onChange={set('title')} required />

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            placeholder="Describe the problem in detail — context, constraints, expected outcome..."
            value={form.description}
            onChange={e => set('description')(e.target.value)}
            rows={5}
            className="px-3 py-2 text-sm rounded-lg border outline-none resize-none"
            style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Domain</label>
          <div className="flex flex-wrap gap-2">
            {DOMAINS.map(d => (
              <button
                key={d}
                onClick={() => set('domain')(d)}
                className="px-3 py-1.5 text-xs rounded-lg border font-medium"
                style={{
                  background: form.domain === d ? 'var(--primary)' : 'transparent',
                  borderColor: form.domain === d ? 'var(--primary)' : 'var(--border)',
                  color: form.domain === d ? 'white' : 'var(--muted-foreground)',
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Tags</label>
          <div className="flex gap-2">
            <input
              placeholder="Add a tag..."
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTag()}
              className="flex-1 px-3 py-2 text-sm rounded-lg border outline-none"
              style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
            <Button variant="secondary" onClick={addTag} size="sm">Add</Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {tags.map(t => (
                <button key={t} onClick={() => setTags(ts => ts.filter(x => x !== t))}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                  style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}>
                  {t} ✕
                </button>
              ))}
            </div>
          )}
        </div>

        <div
          className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer"
          style={{ borderColor: form.csr ? 'var(--primary)' : 'var(--border)', background: form.csr ? 'rgba(124,58,237,0.06)' : 'transparent' }}
          onClick={() => set('csr')(!form.csr)}
        >
          <div className="w-4 h-4 rounded flex items-center justify-center text-xs flex-shrink-0"
            style={{ background: form.csr ? 'var(--primary)' : 'transparent', border: `1.5px solid ${form.csr ? 'var(--primary)' : 'var(--border)'}`, color: 'white' }}>
            {form.csr ? '✓' : ''}
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Tag as CSR Initiative</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Mark this problem as part of your Corporate Social Responsibility program
            </p>
          </div>
        </div>

        <Button
          onClick={() => form.title && form.description && setSubmitted(true)}
          size="lg"
          className="w-full"
          disabled={!form.title || !form.description}
        >
          Publish Problem
        </Button>
      </Card>
    </div>
  );
}
