import React, { useState } from 'react';
import { AppUser } from '../types/dcs';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: 'EN' | 'AR';
  setLang: (lang: 'EN' | 'AR') => void;
  currentUser: AppUser;
  setCurrentUser: (user: AppUser) => void;
  users: AppUser[];
  onOpenQuickFind: () => void;
  onOpenAuthModal: () => void;
  pendingTasksCount: number;
  appNameEn: string;
  setAppNameEn: (name: string) => void;
  appNameAr: string;
  setAppNameAr: (name: string) => void;
  appTagline: string;
  setAppTagline: (tagline: string) => void;
  onShowToast: (msg: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  currentUser,
  setCurrentUser,
  users,
  onOpenQuickFind,
  onOpenAuthModal,
  pendingTasksCount,
  appNameEn,
  setAppNameEn,
  appNameAr,
  setAppNameAr,
  appTagline,
  setAppTagline,
  onShowToast,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);

  // Temporary edit states for modal
  const [tempEn, setTempEn] = useState(appNameEn);
  const [tempAr, setTempAr] = useState(appNameAr);
  const [tempTagline, setTempTagline] = useState(appTagline);

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    const newEn = tempEn.trim() || 'Dewan';
    const newAr = tempAr.trim() || 'ديوان';
    const newTag = tempTagline.trim() || 'Document Control • إدارة الديوان';

    setAppNameEn(newEn);
    setAppNameAr(newAr);
    setAppTagline(newTag);

    localStorage.setItem('dewan_app_name_en', newEn);
    localStorage.setItem('dewan_app_name_ar', newAr);
    localStorage.setItem('dewan_app_tagline', newTag);

    document.title = `${newEn} DCS | نظام ${newAr} للتحكم بالديوان`;
    setShowBrandModal(false);
    onShowToast(`System brand updated to "${newEn} | ${newAr}"!`);
  };

  const notifications = [
    {
      id: 1,
      title: 'Task Assigned: Q3 Executive Remuneration & Payroll',
      titleAr: 'مهمة جديدة: مسيرات الرواتب والمكافآت للربع الثالث',
      time: '10 min ago',
      type: 'urgent',
    },
    {
      id: 2,
      title: 'Workflow Step Approved by Mona Rahimi',
      titleAr: 'تمت الموافقة على خطوة سير العمل بواسطة مونا رحيمي',
      time: '2 hours ago',
      type: 'info',
    },
    {
      id: 3,
      title: 'Storage Routing Audit: Migrated to Local MinIO Tier-1',
      titleAr: 'تدقيق التخزين: تم النقل إلى MinIO المحلي المشفر',
      time: '5 hours ago',
      type: 'security',
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#ffffff]/90 backdrop-blur-md border-b border-[#cbd5e1]/40 shadow-xs">
      {/* Top Header Row */}
      <div className="border-b border-[#cbd5e1]/30 bg-[#ffffff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              onClick={() => setCurrentTab('documents')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#00685f] text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
                {appNameAr && appNameAr !== 'سند' ? appNameAr.charAt(0) : 'د'}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base sm:text-lg tracking-tight text-[#0b1c30] flex items-center gap-1.5">
                  {appNameEn} <span className="text-[#00685f] font-medium">| {appNameAr}</span>
                </span>
                <span className="text-[0.68rem] text-[#475569] font-medium tracking-wide">
                  {appTagline}
                </span>
              </div>
            </div>

          </div>

          {/* Quick Find Search Input */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <button
              onClick={onOpenQuickFind}
              className="w-full h-9 px-3.5 rounded-full bg-[#eff4ff] hover:bg-[#e5eeff] text-xs border border-[#cbd5e1]/40 text-[#0b1c30] flex items-center justify-between text-left transition-all"
            >
              <div className="flex items-center gap-2 text-[#64748b]">
                <span className="material-symbols-outlined text-base text-[#00685f]">search</span>
                <span>
                  {lang === 'AR'
                    ? 'بحث سريع في الديوان والمهام... ⌘K'
                    : 'Quick Find / بحث سريع...'}
                </span>
              </div>
              <kbd className="text-[0.65rem] font-mono text-[#64748b] bg-[#e2e8f0] px-1.5 py-0.5 rounded">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Header Right Tools: Language, Notifications, User Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Sign In / Register Modal Opener */}
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00685f] hover:bg-[#00524b] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">login</span>
              <span className="hidden sm:inline">
                {lang === 'AR' ? 'تسجيل الدخول / موظف جديد' : 'Sign In / Register'}
              </span>
            </button>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setLang(lang === 'EN' ? 'AR' : 'EN')}
              className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#eff4ff] hover:bg-[#e2e8f0] text-xs font-semibold border border-[#cbd5e1]/40 transition-colors shadow-xs"
              title="Toggle Language / تغيير اللغة"
            >
              <span className={lang === 'EN' ? 'text-[#00685f] font-bold' : 'text-[#475569]'}>
                EN
              </span>
              <span className="mx-1.5 text-[#cbd5e1]">|</span>
              <span className={lang === 'AR' ? 'text-[#00685f] font-bold' : 'text-[#475569]'}>
                العربية
              </span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-[#475569] hover:text-[#0b1c30] hover:bg-[#eff4ff] rounded-full transition-colors border border-[#cbd5e1]/40 shrink-0"
                aria-label="Notifications"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00685f] ring-2 ring-white animate-ping"></span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00685f]"></span>
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#cbd5e1]/40 z-50 p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#cbd5e1]/20">
                    <span className="text-xs font-bold text-[#0b1c30]">
                      {lang === 'AR' ? 'التنبيهات والإشعارات' : 'Notifications & Alerts'}
                    </span>
                    <span className="text-[0.68rem] bg-[#00685f]/10 text-[#00685f] px-2 py-0.5 rounded-full font-semibold">
                      3 {lang === 'AR' ? 'جديد' : 'New'}
                    </span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-2.5 rounded-xl bg-[#eff4ff]/60 hover:bg-[#eff4ff] transition-colors border border-[#cbd5e1]/20 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-semibold text-[#0b1c30]">
                          <span>{lang === 'AR' ? n.titleAr : n.title}</span>
                        </div>
                        <div className="text-[0.68rem] text-[#64748b] flex items-center justify-between">
                          <span>{n.time}</span>
                          <span className="text-[#00685f] font-medium">Dewan Governance</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="w-full text-center py-1.5 text-xs text-[#00685f] hover:underline font-medium"
                  >
                    {lang === 'AR' ? 'إغلاق' : 'Close Notifications'}
                  </button>
                </div>
              )}
            </div>

            {/* Current User & Role Switcher */}
            <div className="relative">
              <div
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2.5 pl-2 py-1 pr-3 rounded-full border border-[#cbd5e1]/40 hover:bg-[#eff4ff] transition-colors cursor-pointer shrink-0"
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-[#00685f]/20 shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#00685f] text-white flex items-center justify-center font-bold text-xs ring-2 ring-[#00685f]/20">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-[#0b1c30] leading-tight whitespace-nowrap">
                    {currentUser.name}
                  </span>
                  <span className="text-[0.65rem] text-[#475569] font-normal whitespace-nowrap">
                    {currentUser.role}
                  </span>
                </div>
                <span className="material-symbols-outlined text-xs text-[#64748b]">
                  expand_more
                </span>
              </div>

              {/* User Switcher Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#cbd5e1]/40 z-50 p-3 space-y-2">
                  <div className="px-2 py-1 border-b border-[#cbd5e1]/20">
                    <span className="text-[0.68rem] font-semibold uppercase text-[#64748b] tracking-wider">
                      {lang === 'AR'
                        ? 'تبديل مستخدم النظام (محاكاة الصلاحيات)'
                        : 'Switch Active Persona (Simulate Access)'}
                    </span>
                  </div>
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          setCurrentUser(u);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between text-xs transition-colors ${
                          u.id === currentUser.id
                            ? 'bg-[#00685f]/10 text-[#00685f] font-bold border border-[#00685f]/30'
                            : 'hover:bg-[#eff4ff] text-[#0b1c30]'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold">{u.name}</span>
                          <span className="text-[0.65rem] text-[#64748b]">
                            {u.role} • {u.department}
                          </span>
                        </div>
                        <span className="text-[0.65rem] bg-[#e2e8f0] text-[#475569] px-1.5 py-0.5 rounded">
                          {u.clearanceLevel}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navigation Bar (Tabs) */}
      <div className="w-full bg-[#ffffff]/80 backdrop-blur-md border-b border-[#cbd5e1]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-11 flex items-center justify-between">
          <nav className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            {/* Documents Hub */}
            <button
              type="button"
              onClick={() => setCurrentTab('documents')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                currentTab === 'documents'
                  ? 'bg-[#00685f] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#0b1c30] hover:bg-[#eff4ff]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">folder_open</span>
              <span>Documents</span>
              <span className="opacity-40">|</span>
              <span className="font-normal">الديوان</span>
            </button>

            {/* Tasks & Approvals */}
            <button
              type="button"
              onClick={() => setCurrentTab('tasks')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                currentTab === 'tasks'
                  ? 'bg-[#00685f] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#0b1c30] hover:bg-[#eff4ff]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">fact_check</span>
              <span>Tasks & Approvals</span>
              <span className="opacity-40">|</span>
              <span className="font-normal">المهام والموافقات</span>
              <span
                className={`inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[0.62rem] font-bold ${
                  currentTab === 'tasks'
                    ? 'bg-white text-[#00685f]'
                    : 'bg-[#00685f] text-white'
                }`}
              >
                {pendingTasksCount}
              </span>
            </button>

            {/* Workflow Builder (Admin) */}
            <button
              type="button"
              onClick={() => setCurrentTab('workflow')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                currentTab === 'workflow'
                  ? 'bg-[#00685f] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#0b1c30] hover:bg-[#eff4ff]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">account_tree</span>
              <span>Workflow Builder</span>
              <span className="opacity-40">|</span>
              <span className="font-normal">منشئ مسارات العمل</span>
              <span className="text-[0.6rem] bg-purple-100 text-purple-900 px-1.5 py-0.2 rounded font-bold ml-0.5">
                Admin
              </span>
            </button>

            {/* Viewer & Preview */}
            <button
              type="button"
              onClick={() => setCurrentTab('viewer')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                currentTab === 'viewer'
                  ? 'bg-[#00685f] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#0b1c30] hover:bg-[#eff4ff]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">preview</span>
              <span>Viewer & OCR</span>
              <span className="opacity-40">|</span>
              <span className="font-normal">استعراض المستند</span>
            </button>

            {/* Storage & Security Admin */}
            <button
              type="button"
              onClick={() => setCurrentTab('storage')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                currentTab === 'storage'
                  ? 'bg-[#00685f] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#0b1c30] hover:bg-[#eff4ff]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">dns</span>
              <span>Storage & Security</span>
              <span className="opacity-40">|</span>
              <span className="font-normal">إعدادات التخزين</span>
              <span className="text-[0.6rem] bg-purple-100 text-purple-900 px-1.5 py-0.2 rounded font-bold ml-0.5">
                Admin
              </span>
            </button>

            {/* Directory Matrix (Admin) */}
            <button
              type="button"
              onClick={() => setCurrentTab('directory')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                currentTab === 'directory'
                  ? 'bg-[#00685f] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#0b1c30] hover:bg-[#eff4ff]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">corporate_fare</span>
              <span>Depts & Employees</span>
              <span className="opacity-40">|</span>
              <span className="font-normal">الأقسام والموظفون</span>
              <span className="text-[0.6rem] bg-purple-100 text-purple-900 px-1.5 py-0.2 rounded font-bold ml-0.5">
                Admin
              </span>
            </button>

            {/* Audit & Compliance Ledger */}
            <button
              type="button"
              onClick={() => setCurrentTab('audit')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                currentTab === 'audit'
                  ? 'bg-[#00685f] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#0b1c30] hover:bg-[#eff4ff]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>Audit & Compliance</span>
              <span className="opacity-40">|</span>
              <span className="font-normal">سجل التدقيق</span>
            </button>
          </nav>
        </div>
      </div>
      {/* Rename System Branding Modal */}
      {showBrandModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1c30]/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#cbd5e1]/50 max-w-md w-full p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-[#cbd5e1]/30 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#00685f]/10 text-[#00685f] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-xl">edit_note</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#0b1c30]">
                    {lang === 'AR' ? 'تغيير اسم الموقع والنظام' : 'Change Web App Name'}
                  </h3>
                  <p className="text-xs text-[#64748b]">
                    {lang === 'AR'
                      ? 'تعديل الشعار والاسم الظاهر في شريط التنقل والتذييل'
                      : 'Customize platform name & header branding'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBrandModal(false)}
                className="p-1 rounded-full text-[#64748b] hover:bg-[#eff4ff] transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveBranding} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0b1c30]">
                  {lang === 'AR' ? 'اسم الموقع (بالإنجليزي)' : 'English Web App Name'}
                </label>
                <input
                  type="text"
                  required
                  value={tempEn}
                  onChange={(e) => setTempEn(e.target.value)}
                  placeholder="e.g. Dewan, Corporate Docs"
                  className="w-full px-3.5 py-2 rounded-xl text-xs border border-[#cbd5e1] focus:ring-2 focus:ring-[#00685f] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0b1c30]">
                  {lang === 'AR' ? 'اسم الموقع (بالعربي)' : 'Arabic Web App Name'}
                </label>
                <input
                  type="text"
                  required
                  value={tempAr}
                  onChange={(e) => setTempAr(e.target.value)}
                  placeholder="مثال: ديوان، نظام الديوان"
                  className="w-full px-3.5 py-2 rounded-xl text-xs border border-[#cbd5e1] focus:ring-2 focus:ring-[#00685f] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0b1c30]">
                  {lang === 'AR' ? 'الوصف الفرعي / الشعار' : 'Tagline / Sub-title'}
                </label>
                <input
                  type="text"
                  value={tempTagline}
                  onChange={(e) => setTempTagline(e.target.value)}
                  placeholder="Document Control • إدارة الديوان"
                  className="w-full px-3.5 py-2 rounded-xl text-xs border border-[#cbd5e1] focus:ring-2 focus:ring-[#00685f] focus:outline-none"
                />
              </div>

              <div className="p-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-[#00685f]">info</span>
                <span>
                  {lang === 'AR'
                    ? 'سيتغير اسم الموقع مباشرة في أعلى الصفحة وتذييل الموقع وتنبيهات النظام.'
                    : 'Changes take effect immediately across the app header, title bar, and footer.'}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#cbd5e1]/30">
                <button
                  type="button"
                  onClick={() => setShowBrandModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#cbd5e1] text-xs font-semibold text-[#475569] hover:bg-[#eff4ff]"
                >
                  {lang === 'AR' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00685f] hover:bg-[#00524b] text-white text-xs font-bold shadow-sm transition-all"
                >
                  {lang === 'AR' ? 'حفظ الاسم الجديد' : 'Save Name Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
