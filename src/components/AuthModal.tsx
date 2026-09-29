import React, { useState } from 'react';
import { AppUser, ClassificationLevel } from '../types/dcs';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser;
  setCurrentUser: (user: AppUser) => void;
  users: AppUser[];
  onRegisterUser: (newUser: AppUser) => void;
  lang: 'EN' | 'AR';
  onShowToast: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  setCurrentUser,
  users,
  onRegisterUser,
  lang,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'demo'>('login');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDepartment, setRegDepartment] = useState('Finance & Payroll');
  const [regRole, setRegRole] = useState<AppUser['role']>('Contributor');
  const [regClearance, setRegClearance] = useState<ClassificationLevel>('Internal');
  const [regPassword, setRegPassword] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = users.find((u) => u.email.toLowerCase() === loginEmail.toLowerCase().trim());
    if (found) {
      setCurrentUser(found);
      onShowToast(
        lang === 'AR'
          ? `تم تسجيل الدخول بنجاح كـ ${found.name} (${found.role})`
          : `Signed in successfully as ${found.name} (${found.role})`
      );
      onClose();
    } else {
      // Demo fallback login or warning
      const customUser: AppUser = {
        id: `USR-${Math.floor(100 + Math.random() * 900)}`,
        name: loginEmail.split('@')[0] || 'Employee User',
        email: loginEmail,
        role: loginEmail.includes('admin') ? 'System Administrator' : loginEmail.includes('manager') ? 'Department Head' : 'Contributor',
        department: 'General Operations',
        clearanceLevel: 'Internal',
      };
      onRegisterUser(customUser);
      setCurrentUser(customUser);
      onShowToast(
        lang === 'AR'
          ? `مرحباً بك! تم إنشاء جلسة دخول لـ ${customUser.name}`
          : `Welcome! Logged in as ${customUser.name}`
      );
      onClose();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      onShowToast('Please fill in all required registration fields.');
      return;
    }

    const newUser: AppUser = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: regName.trim(),
      email: regEmail.trim(),
      department: regDepartment,
      role: regRole,
      clearanceLevel: regClearance,
    };

    onRegisterUser(newUser);
    setCurrentUser(newUser);
    onShowToast(
      lang === 'AR'
        ? `تم تسجيل الموظف ${newUser.name} بنجاح وتخصيصه لقسم ${newUser.department}`
        : `Employee ${newUser.name} registered and assigned to ${newUser.department}!`
    );
    onClose();
  };

  const popularDepartments = [
    'Finance & Payroll',
    'Legal & Contracts',
    'HR Policies & Staffing',
    'Operations & Supply Chain',
    'Cybersecurity & Infrastructure',
    'Auditing & Compliance',
    'Executive Secretariat',
    'Engineering & Capital Projects',
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#0b1c30]/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#cbd5e1]/50 max-w-xl w-full p-6 sm:p-8 space-y-6 my-8">
        {/* Header Title */}
        <div className="flex items-start justify-between border-b border-[#cbd5e1]/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#00685f] text-white flex items-center justify-center font-bold shadow-sm">
              <span className="material-symbols-outlined text-2xl">lock_person</span>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0b1c30]">
                {lang === 'AR' ? 'بوابة الدخول وتسجيل الموظفين' : 'Employee Access & Registration Portal'}
              </h2>
              <p className="text-xs text-[#64748b]">
                {lang === 'AR'
                  ? 'نظام ديوان للتحكم بالديوان مع إدارة الصلاحيات والأقسام (200 موظف / 40 قسم)'
                  : 'Dewan DCS Employee Login & Department Assignment (200 Users / 40 Depts)'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#64748b] hover:bg-[#eff4ff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Auth Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#eff4ff] border border-[#cbd5e1]/40 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 rounded-xl text-center transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-[#00685f] shadow-xs font-bold'
                : 'text-[#475569] hover:text-[#0b1c30]'
            }`}
          >
            {lang === 'AR' ? 'تسجيل الدخول' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 rounded-xl text-center transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white text-[#00685f] shadow-xs font-bold'
                : 'text-[#475569] hover:text-[#0b1c30]'
            }`}
          >
            {lang === 'AR' ? 'تسجيل موظف جديد' : 'Register New Employee'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('demo')}
            className={`flex-1 py-2 rounded-xl text-center transition-all cursor-pointer ${
              activeTab === 'demo'
                ? 'bg-white text-[#00685f] shadow-xs font-bold'
                : 'text-[#475569] hover:text-[#0b1c30]'
            }`}
          >
            {lang === 'AR' ? 'الحسابات الجاهزة' : 'Quick Demo Accounts'}
          </button>
        </div>

        {/* Tab 1: Login */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0b1c30] flex items-center justify-between">
                <span>{lang === 'AR' ? 'البريد الإلكتروني للموظف' : 'Employee Work Email'}</span>
                <span className="text-[0.65rem] text-[#64748b]">e.g. sarah.jenkins@dewan-dcs.com</span>
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="employee@dewan-dcs.com"
                className="w-full px-4 py-2.5 rounded-xl text-xs border border-[#cbd5e1] focus:ring-2 focus:ring-[#00685f] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0b1c30]">
                {lang === 'AR' ? 'كلمة المرور' : 'Password'}
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl text-xs border border-[#cbd5e1] focus:ring-2 focus:ring-[#00685f] focus:outline-none"
              />
            </div>

            <div className="p-3 bg-[#eff4ff] rounded-xl text-xs text-[#475569] flex items-start gap-2">
              <span className="material-symbols-outlined text-base text-[#00685f] shrink-0 mt-0.5">
                security
              </span>
              <span>
                {lang === 'AR'
                  ? 'بمجرد تسجيل الدخول، سيعرض النظام فقط الديوان المعينة لك أو التي قمت بإعدادها والموافقة عليها حمايةً للخصوصية.'
                  : 'Once signed in, Dewan DCS automatically filters documents so you only see records assigned to you or authored by your department.'}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#00685f] hover:bg-[#00524b] text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">login</span>
              <span>{lang === 'AR' ? 'الدخول للوحدة الخاصة بك' : 'Sign In to Dashboard'}</span>
            </button>
          </form>
        )}

        {/* Tab 2: Register New Employee */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0b1c30]">
                  {lang === 'AR' ? 'اسم الموظف الكامل' : 'Full Employee Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Tariq Al-Ghamdi"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-[#cbd5e1] focus:ring-2 focus:ring-[#00685f] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0b1c30]">
                  {lang === 'AR' ? 'البريد الإلكتروني' : 'Work Email'} *
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="tariq@dewan-dcs.com"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-[#cbd5e1] focus:ring-2 focus:ring-[#00685f] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0b1c30]">
                  {lang === 'AR' ? 'القسم / الإدارة (من 40 قسم)' : 'Department'} *
                </label>
                <select
                  value={regDepartment}
                  onChange={(e) => setRegDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-[#cbd5e1] focus:ring-2 focus:ring-[#00685f] focus:outline-none bg-white"
                >
                  {popularDepartments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0b1c30]">
                  {lang === 'AR' ? 'المسمى والدور الوظيفي' : 'Role & Level'} *
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as AppUser['role'])}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-[#cbd5e1] focus:ring-2 focus:ring-[#00685f] focus:outline-none bg-white"
                >
                  <option value="Contributor">Contributor / Employee (موظف)</option>
                  <option value="Department Head">Department Head / Manager (مدير قسم)</option>
                  <option value="Approver">Approver / Reviewer (مراجِع معتمد)</option>
                  <option value="Document Controller">Document Controller (مسؤول الديوان)</option>
                  <option value="System Administrator">System Administrator / Admin (مدير النظام)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0b1c30]">
                  {lang === 'AR' ? 'مستوى التصريح الأمني' : 'Clearance Level'} *
                </label>
                <select
                  value={regClearance}
                  onChange={(e) => setRegClearance(e.target.value as ClassificationLevel)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-[#cbd5e1] focus:ring-2 focus:ring-[#00685f] focus:outline-none bg-white"
                >
                  <option value="Public">Public (عام)</option>
                  <option value="Internal">Internal (داخلي)</option>
                  <option value="Confidential">Confidential (سري)</option>
                  <option value="Restricted">Restricted (سري للغاية - رواتب وعقود)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0b1c30]">
                  {lang === 'AR' ? 'كلمة المرور' : 'Password'} *
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-[#cbd5e1] focus:ring-2 focus:ring-[#00685f] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#00685f] hover:bg-[#00524b] text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <span className="material-symbols-outlined text-base">how_to_reg</span>
              <span>{lang === 'AR' ? 'تسجيل الموظف والدخول فوراً' : 'Register & Log In Employee'}</span>
            </button>
          </form>
        )}

        {/* Tab 3: Quick Demo Accounts */}
        {activeTab === 'demo' && (
          <div className="space-y-3">
            <p className="text-xs text-[#64748b]">
              {lang === 'AR'
                ? 'اختر أحداً من مستخدمي النظام المعرفين مسبقاً لاختبار لوحات التحكم ومستويات الصلاحية:'
                : 'Select a pre-configured user persona to test role-based views and document access filtering:'}
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {users.map((u) => {
                const isActive = u.id === currentUser.id;
                return (
                  <div
                    key={u.id}
                    onClick={() => {
                      setCurrentUser(u);
                      onShowToast(
                        lang === 'AR'
                          ? `تم التبديل إلى حساب ${u.name} (${u.role})`
                          : `Switched active account to ${u.name} (${u.role})`
                      );
                      onClose();
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-[#00685f]/10 border-[#00685f] ring-1 ring-[#00685f]'
                        : 'bg-[#eff4ff]/60 hover:bg-[#eff4ff] border-[#cbd5e1]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#00685f] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#0b1c30] flex items-center gap-2">
                          <span>{u.name}</span>
                          {u.role === 'System Administrator' || u.role === 'Document Controller' ? (
                            <span className="text-[0.6rem] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-semibold">
                              ADMIN
                            </span>
                          ) : u.role === 'Department Head' ? (
                            <span className="text-[0.6rem] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-semibold">
                              MANAGER
                            </span>
                          ) : (
                            <span className="text-[0.6rem] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-semibold">
                              EMPLOYEE
                            </span>
                          )}
                        </div>
                        <div className="text-[0.68rem] text-[#64748b]">
                          {u.role} • <span className="text-[#00685f] font-medium">{u.department}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[0.65rem] bg-[#e2e8f0] text-[#475569] px-2 py-0.5 rounded-full font-mono">
                        {u.clearanceLevel}
                      </span>
                      <span className="material-symbols-outlined text-sm text-[#00685f]">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
