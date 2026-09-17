import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, VirtualIdCard } from '../../components/ui';

export default function Login() {
  const navigate = useNavigate();
  const [virtualId, setVirtualId] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const DEMO_ROUTES: Record<string, string> = {
    'STU-2024-0042': '/student',
    'FAC-2024-0011': '/faculty',
    'IND-2024-0007': '/industry',
    'ADM-0001': '/admin',
  };

  const handleLogin = () => {
    if (!virtualId || !password) {
      setError('Please enter your Virtual ID and password.');
      return;
    }
    const route = DEMO_ROUTES[virtualId.toUpperCase()];
    if (route) {
      navigate(route);
    } else {
      setError('Virtual ID not found. Try: STU-2024-0042, FAC-2024-0011, IND-2024-0007, or ADM-0001');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg mb-4"
            style={{ background: 'var(--primary)', color: 'white', fontFamily: 'DM Sans' }}
          >
            IX
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
            Welcome back
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Sign in with your InnovateX Virtual ID
          </p>
        </div>

        <div
          className="p-6 rounded-2xl border flex flex-col gap-4"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <Input
            label="Virtual ID"
            placeholder="e.g. STU-2024-0042"
            value={virtualId}
            onChange={setVirtualId}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <Button onClick={handleLogin} size="lg" className="w-full">
            Sign In
          </Button>

          <div className="text-center">
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Demo IDs: STU-2024-0042 · FAC-2024-0011 · IND-2024-0007 · ADM-0001
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
              (any password works)
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-4 text-xs" style={{ color: 'var(--muted-foreground)' }}>
          <button onClick={() => navigate('/auth/register/faculty')} className="hover:underline">Faculty Registration</button>
          <span>·</span>
          <button onClick={() => navigate('/auth/register/student')} className="hover:underline">Student Access</button>
          <span>·</span>
          <button onClick={() => navigate('/auth/register/industry')} className="hover:underline">Industry Registration</button>
        </div>

        <button
          onClick={() => navigate('/')}
          className="block text-center mt-4 text-xs hover:underline w-full"
          style={{ color: 'var(--muted-foreground)' }}
        >
          ← Back to home
        </button>
      </div>
    </div>
  );
}
