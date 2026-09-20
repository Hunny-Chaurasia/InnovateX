import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, VirtualIdCard } from '../../components/ui';

const GENERIC_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'protonmail.com'];

function validateCompanyEmail(email: string): string {
  if (!email) return 'Company email is required';
  if (!email.includes('@')) return 'Enter a valid email address';
  const domain = email.split('@')[1] || '';
  if (GENERIC_DOMAINS.some(d => domain === d)) {
    return 'Must be a company email (not Gmail, Yahoo, or other generic providers)';
  }
  return '';
}

export default function IndustryRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', company: '', designation: '', linkedin: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const generatedId = 'IND-2024-0018';

  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    const errs: Record<string, string> = {};
    const emailErr = validateCompanyEmail(form.email);
    if (emailErr) errs.email = emailErr;
    if (!form.company) errs.company = 'Company name is required';
    if (!form.designation) errs.designation = 'Designation is required';
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
            Application Submitted
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
            Your industry partner application is under review. Once approved, your Virtual ID and
            password setup link will be sent to <strong style={{ color: 'var(--foreground)' }}>{form.email}</strong>.
          </p>
          <div className="flex justify-center mb-6">
            <VirtualIdCard id={generatedId} label="Reserved Virtual ID" />
          </div>
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
          Industry Partner Registration
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
          Join InnovateX as an industry partner — post challenges, discover student talent, and fund real-world projects.
        </p>

        <div className="p-6 rounded-2xl border flex flex-col gap-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <Input
            label="Company Email"
            type="email"
            placeholder="you@yourcompany.com"
            value={form.email}
            onChange={set('email')}
            error={errors.email}
            required
          />
          <Input
            label="Company Name"
            placeholder="Infosys Limited"
            value={form.company}
            onChange={set('company')}
            error={errors.company}
            required
          />
          <Input
            label="Your Designation"
            placeholder="Director of Innovation"
            value={form.designation}
            onChange={set('designation')}
            error={errors.designation}
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
          <Button onClick={handleSubmit} size="lg" className="w-full">
            Submit Application
          </Button>
        </div>
      </div>
    </div>
  );
}
