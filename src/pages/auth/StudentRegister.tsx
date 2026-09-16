import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, VirtualIdCard } from '../../components/ui';

const VALID_VIRTUAL_IDS = ['FAC-INVITE-001', 'FAC-INVITE-002', 'FAC-INVITE-003'];

export default function StudentRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ institution: '', virtualId: '', linkedin: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const generatedStudentId = 'STU-2024-0099';

  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    const errs: Record<string, string> = {};
    if (!form.institution) errs.institution = 'Institution name is required';
    if (!form.virtualId) errs.virtualId = 'Faculty-issued Virtual ID is required';
    else if (!VALID_VIRTUAL_IDS.includes(form.virtualId) && form.virtualId !== 'FAC-INVITE-001') {
      errs.virtualId = 'Invalid Virtual ID. Please verify with your faculty. (Demo: FAC-INVITE-001)';
    }
    if (!form.linkedin) errs.linkedin = 'LinkedIn profile URL is required';
    else if (!form.linkedin.includes('linkedin.com')) errs.linkedin = 'Enter a valid LinkedIn URL';
    setErrors(errs);
    if (Object.keys(errs).length === 0) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--background)' }}>
        <div className="w-full max-w-sm text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"
            style={{ background: 'rgba(5,150,105,0.15)', border: '2px solid rgba(5,150,105,0.4)' }}>
            ✓
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
            Account Created!
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
            A password setup link has been sent to the email your faculty registered for you.
            Your InnovateX Virtual ID is:
          </p>
          <div className="flex justify-center mb-6">
            <VirtualIdCard id={generatedStudentId} label="Your Student Virtual ID" />
          </div>
          <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
            Keep this ID safe — you'll use it every time you sign in.
          </p>
          <Button onClick={() => navigate('/auth/login')} size="lg" className="w-full">
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-md">
        <button onClick={() => navigate('/')} className="flex items-center gap-1 text-xs mb-6"
          style={{ color: 'var(--muted-foreground)' }}>
          ← Back
        </button>
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--foreground)' }}>
          Student Access
        </h1>
        <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>
          Students are provisioned by their faculty. You'll need a faculty-issued Virtual ID to register.
        </p>
        <div className="p-3 rounded-lg text-xs mb-4" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24' }}>
          Don't have a Virtual ID? Contact your faculty mentor to have your account created.
        </div>

        <div className="p-6 rounded-2xl border flex flex-col gap-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <Input
            label="Institution Name"
            placeholder="IIT Bombay"
            value={form.institution}
            onChange={set('institution')}
            error={errors.institution}
            required
          />
          <Input
            label="Virtual ID (issued by your faculty)"
            placeholder="FAC-INVITE-001"
            value={form.virtualId}
            onChange={set('virtualId')}
            error={errors.virtualId}
            required
          />
          <Input
            label="LinkedIn Profile URL"
            placeholder="https://linkedin.com/in/your-name"
            value={form.linkedin}
            onChange={set('linkedin')}
            error={errors.linkedin}
            required
            prefix={<span style={{ fontSize: 13 }}>in</span>}
          />

          <div className="p-3 rounded-lg text-xs" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
            A password setup link will be sent to the email your faculty registered. Your <strong style={{ color: 'var(--foreground)' }}>Student Virtual ID</strong> will be generated automatically.
          </div>

          <Button onClick={handleSubmit} size="lg" className="w-full">
            Create Student Account
          </Button>
        </div>
      </div>
    </div>
  );
}
