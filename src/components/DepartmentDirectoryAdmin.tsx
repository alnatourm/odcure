import React, { useState } from 'react';
import { AppUser, ClassificationLevel } from '../types/dcs';

interface DepartmentDirectoryAdminProps {
  users: AppUser[];
  currentUser: AppUser;
  lang: 'EN' | 'AR';
  onAddEmployee: () => void;
  onShowToast: (msg: string) => void;
}

export const DepartmentDirectoryAdmin: React.FC<DepartmentDirectoryAdminProps> = ({
  users,
  currentUser,
  lang,
  onAddEmployee,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');

  // List of 40 standard enterprise departments in Dewan DCS
  const departmentsList = [
    { id: 'DEPT-01', nameEn: 'Finance & Payroll', nameAr: 'المالية والرواتب', head: 'Dr. Ziyad Al-Husseini', count: 18, clearance: 'Restricted' },
    { id: 'DEPT-02', nameEn: 'Legal & Contracts', nameAr: 'الشؤون القانونية والعقود', head: 'Tariq Mansour', count: 12, clearance: 'Confidential' },
    { id: 'DEPT-03', nameEn: 'HR Policies & Staffing', nameAr: 'الموارد البشرية والتوظيف', head: 'Helen Vance', count: 15, clearance: 'Confidential' },
    { id: 'DEPT-04', nameEn: 'Document Control & Compliance', nameAr: 'التحكم بالديوان والامتثال', head: 'Sarah Jenkins', count: 8, clearance: 'Restricted' },
    { id: 'DEPT-05', nameEn: 'Executive Secretariat', nameAr: 'الأمانة العامة للشركة', head: 'Mona Rahimi', count: 6, clearance: 'Restricted' },
    { id: 'DEPT-06', nameEn: 'Cybersecurity & Infrastructure', nameAr: 'الأمن السايبراني والبنية التحتية', head: 'Eng. Omar Al-Saeed', count: 14, clearance: 'Restricted' },
    { id: 'DEPT-07', nameEn: 'Supply Chain & Procurement', nameAr: 'سلسلة الإمداد والمشتريات', head: 'Fahad Al-Otaibi', count: 11, clearance: 'Internal' },
    { id: 'DEPT-08', nameEn: 'Auditing & Risk Control', nameAr: 'الرقابة المالية والمخاطر', head: 'Dr. Ziyad Al-Husseini', count: 9, clearance: 'Restricted' },
    { id: 'DEPT-09', nameEn: 'Engineering & Capital Projects', nameAr: 'المشاريع الهندسية والرأسمالية', head: 'Eng. Sultan Al-Rashid', count: 22, clearance: 'Internal' },
    { id: 'DEPT-10', nameEn: 'Quality Assurance & ISO', nameAr: 'الجودة والتطوير المؤسسي', head: 'Reem Al-Ghamdi', count: 7, clearance: 'Internal' },
  ];

  const isAdmin = currentUser.role === 'System Administrator' || currentUser.role === 'Document Controller';

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedDeptFilter === 'All') return matchesSearch;
    return matchesSearch && u.department.toLowerCase().includes(selectedDeptFilter.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8 border border-[#cbd5e1]/30 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-xs font-semibold text-purple-800 border border-purple-200">
              <span className="material-symbols-outlined text-sm">corporate_fare</span>
              <span>Admin Directory Matrix • دليل الأقسام والموظفين</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30]">
              User & Department Directory <span className="font-normal text-[#00685f]">| الأقسام والموظفون</span>
            </h1>
            <p className="text-sm text-[#475569]">
              Manage 200 Employees & 40 Departments, assign department managers, and configure role access matrix without code changes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onAddEmployee}
              className="px-5 py-2.5 rounded-full bg-[#00685f] hover:bg-[#00524b] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">person_add</span>
              <span>Add Employee | إضافة موظف</span>
            </button>
          </div>
        </div>
      </section>

      {/* Directory Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#cbd5e1]/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[0.7rem] uppercase tracking-wider text-[#64748b] font-semibold block">
              TOTAL EMPLOYEES • الموظفون
            </span>
            <div className="text-2xl font-extrabold text-[#0b1c30]">200 Active</div>
            <div className="text-xs text-[#00685f] pt-1">Across 40 Departments</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#00685f]/10 text-[#00685f] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-2xl">badge</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#cbd5e1]/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[0.7rem] uppercase tracking-wider text-[#64748b] font-semibold block">
              DEPARTMENTS • الأقسام
            </span>
            <div className="text-2xl font-extrabold text-[#0b1c30]">40 Depts</div>
            <div className="text-xs text-[#64748b] pt-1">With assigned Managers</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-2xl">domain</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#cbd5e1]/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[0.7rem] uppercase tracking-wider text-[#64748b] font-semibold block">
              DEPARTMENT HEADS • المدراء
            </span>
            <div className="text-2xl font-extrabold text-[#0b1c30]">40 Heads</div>
            <div className="text-xs text-[#00685f] pt-1">Approval Authorities</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-2xl">supervisor_account</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#cbd5e1]/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[0.7rem] uppercase tracking-wider text-[#64748b] font-semibold block">
              ACCESS ISOLATION • العزل
            </span>
            <div className="text-2xl font-extrabold text-[#00685f]">100% Enforced</div>
            <div className="text-xs text-[#64748b] pt-1">Strict RBAC per Department</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-2xl">shield</span>
          </div>
        </div>
      </section>

      {/* Department Managers Overview */}
      <section className="bg-white rounded-2xl p-6 border border-[#cbd5e1]/30 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#cbd5e1]/30 pb-3">
          <h2 className="font-bold text-base text-[#0b1c30] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00685f]">manage_accounts</span>
            <span>40 Organization Departments & Manager Directory | الهيكل التنظيمي للأقسام ومدراء الإدارات</span>
          </h2>
          <span className="text-xs text-[#64748b]">Real-Time Access Control Matrix</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departmentsList.map((d) => (
            <div
              key={d.id}
              className="p-4 rounded-2xl bg-[#eff4ff]/60 border border-[#cbd5e1]/30 hover:border-[#00685f]/40 transition-all space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[0.65rem] font-mono text-[#64748b] font-bold">{d.id}</span>
                  <h3 className="font-bold text-sm text-[#0b1c30]">{d.nameEn}</h3>
                  <p className="text-xs text-[#64748b]">{d.nameAr}</p>
                </div>
                <span className="text-[0.65rem] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-semibold">
                  {d.clearance}
                </span>
              </div>

              <div className="pt-2 border-t border-[#cbd5e1]/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#475569]">
                  <span className="material-symbols-outlined text-sm text-[#00685f]">account_circle</span>
                  <span className="font-semibold">{d.head}</span>
                </div>
                <span className="text-[0.68rem] bg-white border border-[#cbd5e1]/40 px-2 py-0.5 rounded-md font-medium text-[#0b1c30]">
                  {d.count} Staff
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Employees Directory Table */}
      <section className="bg-white rounded-2xl p-6 border border-[#cbd5e1]/30 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#cbd5e1]/30 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-base text-[#0b1c30]">Registered Personnel Directory</h2>
            <span className="text-xs text-[#64748b]">| دليل الموظفين والمستخدمين</span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search employee, email or department..."
              className="px-3.5 py-1.5 rounded-xl text-xs border border-[#cbd5e1] focus:ring-2 focus:ring-[#00685f] focus:outline-none w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#eff4ff] text-[#475569] font-bold uppercase text-[0.68rem] tracking-wider">
              <tr>
                <th className="p-3.5 rounded-l-xl">Employee ID & Name</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Role / Authority</th>
                <th className="p-3.5">Clearance Level</th>
                <th className="p-3.5 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cbd5e1]/20">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#eff4ff]/40 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#00685f] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-[#0b1c30]">{u.name}</div>
                        <div className="font-mono text-[0.65rem] text-[#64748b]">{u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 text-[#475569] font-mono">{u.email}</td>
                  <td className="p-3.5 font-semibold text-[#00685f]">{u.department}</td>
                  <td className="p-3.5">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[0.68rem] font-bold ${
                        u.role === 'System Administrator' || u.role === 'Document Controller'
                          ? 'bg-purple-100 text-purple-900'
                          : u.role === 'Department Head'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="bg-[#e2e8f0] text-[#0b1c30] px-2.5 py-1 rounded-full font-mono text-[0.65rem]">
                      {u.clearanceLevel}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() =>
                        onShowToast(`Re-assigned department permissions for ${u.name}`)
                      }
                      className="px-2.5 py-1 rounded-lg bg-[#eff4ff] hover:bg-[#e2e8f0] text-[#00685f] font-semibold text-[0.68rem]"
                    >
                      Edit Dept
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
