import { useState } from 'react';
import { usePage } from '@inertiajs/react';

import AppLayout from '@/components/attendance/AppLayout';
import type { Role } from '@/types/attendance';

import AdminDashboard from './admin/AdminDashboard';
import AdminUsers from './admin/AdminUsers';
import AddUserForm from './admin/AddUserForm';
import AdminDepartments from './admin/AdminDepartments';
import AddDepartmentForm from './admin/AddDepartmentForm';
import AdminCalendar from './admin/AdminCalendar';
import AdminReports from './admin/AdminReports';
import AdminClassSchedules from './admin/AdminClassSchedules';

import SecretaryDashboard from './secretary/SecretaryDashboard';
import AttendanceChecker from './secretary/AttendanceChecker';
import TallyReport from './secretary/TallyReport';

import FacultyDashboard from './faculty/FacultyDashboard';
import FacultyHistory from './faculty/FacultyHistory';
import FacultyProfile from './faculty/FacultyProfile';
import FacultyClassSchedule from './faculty/FacultyClassSchedule';

export default function AttendanceIndex() {
    const { auth } = usePage().props as any;
    const user = auth.user;

    const [page, setPage] = useState('dashboard');

    const role: Role =
        user.role_id === 1
            ? 'admin'
            : user.role_id === 2
              ? 'secretary'
              : 'faculty';

    const renderScreen = () => {
        if (role === 'admin') {
            if (page === 'dashboard') return <AdminDashboard />;
            if (page === 'users') return <AdminUsers onNavigate={setPage} />;
            if (page === 'add-faculty')
                return (
                    <AddUserForm
                        type="faculty"
                        onBack={() => setPage('users')}
                    />
                );
            if (page === 'add-secretary')
                return (
                    <AddUserForm
                        type="secretary"
                        onBack={() => setPage('users')}
                    />
                );
            if (page === 'departments')
                return (
                    <AdminDepartments
                        onAddDepartment={() => setPage('add-department')}
                    />
                );
            if (page === 'add-department')
                return (
                    <AddDepartmentForm onBack={() => setPage('departments')} />
                );
            if (page === 'calendar') return <AdminCalendar />;
            if (page === 'reports') return <AdminReports />;
            if (page === 'schedules') return <AdminClassSchedules />;
        }

        if (role === 'secretary') {
            if (page === 'dashboard') return <SecretaryDashboard />;
            if (page === 'attendance') return <AttendanceChecker />;
            if (page === 'tally') return <TallyReport />;
        }

        if (role === 'faculty') {
            if (page === 'dashboard') return <FacultyDashboard />;
            if (page === 'history') return <FacultyHistory />;
            if (page === 'profile') return <FacultyProfile />;
            if (page === 'my-schedule') return <FacultyClassSchedule />;
        }

        return null;
    };

    return (
        <AppLayout
            role={role}
            userName={user.name}
            page={page}
            onNavigate={setPage}
        >
            {renderScreen()}
        </AppLayout>
    );
}
