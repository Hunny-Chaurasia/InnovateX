import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'student',
      label: 'Student',
      icon: '🎓',
      desc: 'Build projects, form teams, find mentors, and connect with industry.',
      color: '#7c3aed',
      path: '/student',
    },
    {
      id: 'faculty',
      label: 'Faculty Mentor',
      icon: '🧑‍🏫',
      desc: 'Mentor student teams, review proposals, and track project progress.',
      color: '#0ea5e9',
      path: '/faculty',
    },
    {
      id: 'industry',
      label: 'Industry Partner',
      icon: '🏢',
      desc: 'Post real-world problems, fund projects, and discover innovation talent.',
      color: '#059669',
      path: '/industry',
    },
    {
      id: 'admin',
      label: 'Platform Admin',
      icon: '⚙️',
      desc: 'Manage users, moderate content, and view platform analytics.',
      color: '#f97316',
      path: '/admin',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'var(--background)' }}>
      {/* Hero */}
      <div className="text-center mb-12 max-w-xl">
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl font-bold text-xl mb-6"
          style={{ background: 'var(--primary)', color: 'white', fontFamily: 'DM Sans' }}
        >
          IX
        </div>
        <h1
          className="text-5xl font-bold mb-4"
          style={{ fontFamily: 'DM Sans', color: 'var(--foreground)', lineHeight: 1.1 }}
        >
          Innovate<span style={{ color: 'var(--accent)' }}>X</span>
        </h1>
        <p className="text-lg" style={{ color: 'var(--muted-foreground)' }}>
          Where students build real projects, form cross-institution teams,
          get mentored, and connect with industry.
        </p>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mb-10">
        {roles.map((r) => (
          <button
            key={r.id}
            onClick={() => navigate(r.path)}
            className="text-left p-5 rounded-xl border transition-all"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = r.color;
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
              (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${r.color}20`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLElement).style.transform = 'none';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{r.icon}</span>
              <span className="font-semibold text-base" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
                {r.label}
              </span>
            </div>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{r.desc}</p>
            <div
              className="mt-3 text-xs font-medium"
              style={{ color: r.color }}
            >
              Enter as {r.label} →
            </div>
          </button>
        ))}
      </div>

      {/* Auth links */}
      <div className="flex items-center gap-6 text-sm" style={{ color: 'var(--muted-foreground)' }}>
        <button onClick={() => navigate('/auth/login')} className="hover:underline" style={{ color: 'var(--accent)' }}>
          Sign in
        </button>
        <span>·</span>
        <button onClick={() => navigate('/auth/register/faculty')} className="hover:underline">
          Register as Faculty
        </button>
        <span>·</span>
        <button onClick={() => navigate('/auth/register/industry')} className="hover:underline">
          Register as Industry
        </button>
      </div>
    </div>
  );
}
