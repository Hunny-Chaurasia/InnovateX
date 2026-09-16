import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shell from './components/Shell';
import { MOCK_USERS } from './data/mock';

// Auth
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import FacultyRegister from './pages/auth/FacultyRegister';
import StudentRegister from './pages/auth/StudentRegister';
import IndustryRegister from './pages/auth/IndustryRegister';

// Student
import StudentDashboard from './pages/student/StudentDashboard';
import Discover from './pages/student/Discover';
import MyProjects from './pages/student/MyProjects';
import Portfolio from './pages/student/Portfolio';
import Funding from './pages/student/Funding';

// Faculty
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import Students from './pages/faculty/Students';
import ChangeRequests from './pages/faculty/ChangeRequests';
import ReviewPanel from './pages/faculty/ReviewPanel';

// Industry
import IndustryDashboard from './pages/industry/IndustryDashboard';
import PostProblem from './pages/industry/PostProblem';
import DiscoverProjects from './pages/industry/DiscoverProjects';
import CSRImpact from './pages/industry/CSRImpact';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';

// Shared
import Leaderboard from './pages/Leaderboard';

function StudentShell({ children }: { children: React.ReactNode }) {
  return <Shell role="student" user={MOCK_USERS.student}>{children}</Shell>;
}
function FacultyShell({ children }: { children: React.ReactNode }) {
  return <Shell role="faculty" user={MOCK_USERS.faculty}>{children}</Shell>;
}
function IndustryShell({ children }: { children: React.ReactNode }) {
  return <Shell role="industry" user={MOCK_USERS.industry}>{children}</Shell>;
}
function AdminShell({ children }: { children: React.ReactNode }) {
  return <Shell role="admin" user={MOCK_USERS.admin}>{children}</Shell>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register/faculty" element={<FacultyRegister />} />
        <Route path="/auth/register/student" element={<StudentRegister />} />
        <Route path="/auth/register/industry" element={<IndustryRegister />} />

        {/* Student */}
        <Route path="/student" element={<StudentShell><StudentDashboard /></StudentShell>} />
        <Route path="/student/discover" element={<StudentShell><Discover /></StudentShell>} />
        <Route path="/student/projects" element={<StudentShell><MyProjects /></StudentShell>} />
        <Route path="/student/portfolio" element={<StudentShell><Portfolio /></StudentShell>} />
        <Route path="/student/funding" element={<StudentShell><Funding /></StudentShell>} />

        {/* Faculty */}
        <Route path="/faculty" element={<FacultyShell><FacultyDashboard /></FacultyShell>} />
        <Route path="/faculty/students" element={<FacultyShell><Students /></FacultyShell>} />
        <Route path="/faculty/change-requests" element={<FacultyShell><ChangeRequests /></FacultyShell>} />
        <Route path="/faculty/review" element={<FacultyShell><ReviewPanel /></FacultyShell>} />
        <Route path="/faculty/teams" element={<FacultyShell><FacultyDashboard /></FacultyShell>} />

        {/* Industry */}
        <Route path="/industry" element={<IndustryShell><IndustryDashboard /></IndustryShell>} />
        <Route path="/industry/post" element={<IndustryShell><PostProblem /></IndustryShell>} />
        <Route path="/industry/discover" element={<IndustryShell><DiscoverProjects /></IndustryShell>} />
        <Route path="/industry/csr" element={<IndustryShell><CSRImpact /></IndustryShell>} />

        {/* Admin */}
        <Route path="/admin" element={<AdminShell><AdminDashboard /></AdminShell>} />
        <Route path="/admin/users" element={<AdminShell><UserManagement /></AdminShell>} />
        <Route path="/admin/moderation" element={<AdminShell><AdminDashboard /></AdminShell>} />
        <Route path="/admin/analytics" element={<AdminShell><AdminDashboard /></AdminShell>} />

        {/* Leaderboard — role-aware wrapper based on URL context, default to student */}
        <Route path="/leaderboard" element={<StudentShell><Leaderboard /></StudentShell>} />
      </Routes>
    </BrowserRouter>
  );
}
