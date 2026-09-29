import React, { useState } from 'react';
import { DocumentItem, AppUser } from '../types/dcs';

interface DocumentsHubProps {
  documents: DocumentItem[];
  lang: 'EN' | 'AR';
  currentUser: AppUser;
  onOpenUpload: () => void;
  onSelectDocument: (doc: DocumentItem) => void;
  onReassignDocument: (doc: DocumentItem) => void;
  onDownloadDocument: (doc: DocumentItem) => void;
  onSoftDeleteDocument: (docId: string) => void;
  onExportSummary: () => void;
}

export const DocumentsHub: React.FC<DocumentsHubProps> = ({
  documents,
  lang,
  currentUser,
  onOpenUpload,
  onSelectDocument,
  onReassignDocument,
  onDownloadDocument,
  onSoftDeleteDocument,
  onExportSummary,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [adminViewAll, setAdminViewAll] = useState(false);

  const categories = [
    { id: 'All', en: 'All', ar: 'الكل' },
    { id: 'Finance', en: 'Finance & Payroll', ar: 'المالية والرواتب' },
    { id: 'Legal', en: 'Legal & Contracts', ar: 'العقود القانونية' },
    { id: 'HR', en: 'HR Policies', ar: 'الموارد البشرية' },
    { id: 'Operations', en: 'Operations', ar: 'العمليات' },
  ];

  const isAdmin = currentUser.role === 'System Administrator' || currentUser.role === 'Document Controller';
  const isManager = currentUser.role === 'Department Head';

  // Strict RBAC Filtering: Employees/Managers only see assigned or authored documents!
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.titleAr.includes(searchTerm) ||
      doc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCategory !== 'All' && !doc.department.toLowerCase().includes(selectedCategory.toLowerCase())) {
      return false;
    }

    // Admin view toggle option
    if (isAdmin && adminViewAll) {
      return true;
    }

    // Role & Identity Assignment check
    const isOwner = doc.ownerName === currentUser.name || (doc.ownerRoleAndDept && doc.ownerRoleAndDept.includes(currentUser.name));
    const isAssignee = doc.currentAssigneeName === currentUser.name || (doc.currentAssigneeRoleAndDept && doc.currentAssigneeRoleAndDept.includes(currentUser.name));
    const isContributor =
      doc.versionHistory?.some((v) => v.uploadedBy === currentUser.name) ||
      doc.workflowChain?.some((w) => w.assignedUser === currentUser.name || w.approverName === currentUser.name);
    const hasGrant = doc.temporaryGrants?.some((tg) =>
      tg.grantedTo.toLowerCase().includes(currentUser.name.toLowerCase()) ||
      tg.grantedTo.toLowerCase().includes(currentUser.email.toLowerCase())
    );

    if (isOwner || isAssignee || isContributor || hasGrant) {
      return true;
    }

    // Managers see documents in their department
    if (isManager && (doc.department.toLowerCase().includes(currentUser.department.toLowerCase()) || doc.assignedDepartment.toLowerCase().includes(currentUser.department.toLowerCase()))) {
      return true;
    }

    // Non-assigned document is hidden from employee!
    return false;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8 lg:p-10 border border-[#cbd5e1]/30 shadow-xs">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#00685f]/5 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#dae2fd]/40 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eff4ff] text-xs font-semibold text-[#475569]">
              <span className="w-2 h-2 rounded-full bg-[#00685f] animate-pulse"></span>
              <span>Central Registry • السجل المركزي</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0b1c30] tracking-tight">
              Documents Hub <span className="font-normal text-[#00685f]">| مركز الديوان</span>
            </h1>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              Organize, access, and verify company records with ease • تنظيم والوصول وتدقيق ديوان
              المؤسسة بكل سلاسة وموثوقية
            </p>
          </div>

          {/* Hero Action Buttons */}
          <div className="flex items-center flex-wrap gap-3 shrink-0">
            <button
              type="button"
              onClick={onExportSummary}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#eff4ff] hover:bg-[#e2e8f0] border border-[#cbd5e1]/40 text-[#0b1c30] font-semibold text-sm transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg text-[#00685f]">download</span>
              <span>Export Summary | تصدير ملخص</span>
            </button>
            <button
              type="button"
              onClick={onOpenUpload}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#00685f] hover:bg-[#008378] text-white font-semibold text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span>Upload New Document | رفع مستند جديد</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4 Symmetric Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Stat 1: Total Docs */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#cbd5e1]/30 shadow-xs flex items-start justify-between hover:border-[#00685f]/40 transition-colors">
          <div className="space-y-1.5">
            <span className="text-[0.7rem] uppercase tracking-wider text-[#475569] font-semibold block">
              TOTAL DOCUMENTS • إجمالي الديوان
            </span>
            <div className="text-3xl font-extrabold text-[#0b1c30]">1,428</div>
            <div className="flex items-center gap-1.5 text-xs text-[#00685f] font-medium pt-1">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+4.2% this month • هذا الشهر</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#00685f]/10 flex items-center justify-center text-[#00685f] shrink-0">
            <span className="material-symbols-outlined text-2xl">description</span>
          </div>
        </div>

        {/* Stat 2: In Review */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#cbd5e1]/30 shadow-xs flex items-start justify-between hover:border-[#00685f]/40 transition-colors">
          <div className="space-y-1.5">
            <span className="text-[0.7rem] uppercase tracking-wider text-[#475569] font-semibold block">
              IN REVIEW • قيد المراجعة
            </span>
            <div className="text-3xl font-extrabold text-[#0b1c30]">19</div>
            <div className="flex items-center gap-1.5 text-xs text-[#475569] font-medium pt-1">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span>Avg. 2.4 days cycle • متوسط الاعتماد</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#dae2fd] flex items-center justify-center text-[#131b2e] shrink-0">
            <span className="material-symbols-outlined text-2xl">pending_actions</span>
          </div>
        </div>

        {/* Stat 3: Approved */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#cbd5e1]/30 shadow-xs flex items-start justify-between hover:border-[#00685f]/40 transition-colors">
          <div className="space-y-1.5">
            <span className="text-[0.7rem] uppercase tracking-wider text-[#475569] font-semibold block">
              APPROVED • معتمد وسارٍ
            </span>
            <div className="text-3xl font-extrabold text-[#00685f]">1,385</div>
            <div className="flex items-center gap-1.5 text-xs text-[#00685f] font-medium pt-1">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>97% Compliance rate • نسبة الامتثال</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#71f8e4]/30 flex items-center justify-center text-[#00685d] shrink-0">
            <span className="material-symbols-outlined text-2xl">check_circle</span>
          </div>
        </div>

        {/* Stat 4: Restricted */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#cbd5e1]/30 shadow-xs flex items-start justify-between hover:border-[#00685f]/40 transition-colors">
          <div className="space-y-1.5">
            <span className="text-[0.7rem] uppercase tracking-wider text-[#475569] font-semibold block">
              RESTRICTED & PAYROLL • ديوان سرية
            </span>
            <div className="text-3xl font-extrabold text-[#0b1c30]">24</div>
            <div className="flex items-center gap-1.5 text-xs text-[#475569] font-medium pt-1">
              <span className="material-symbols-outlined text-sm">lock</span>
              <span>Tier-1 Encrypted • تشفير مشدد</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#e2e8f0] flex items-center justify-center text-[#64748b] shrink-0">
            <span className="material-symbols-outlined text-2xl">shield_person</span>
          </div>
        </div>
      </section>

      {/* Smart Filter & Search Bar Area */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 border border-[#cbd5e1]/30 shadow-xs space-y-4">
        {/* Centered full-width search input */}
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute inset-y-0 left-4 flex items-center text-[#64748b] pointer-events-none text-xl">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-[#eff4ff]/70 border border-[#cbd5e1]/40 text-[#0b1c30] placeholder:text-[#64748b] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00685f]/30 focus:border-[#00685f] transition-all"
            placeholder={
              lang === 'AR'
                ? 'ابحث بالعنوان أو الرقم أو الكلمات الدلالية (مثل مسيرات الرواتب)...'
                : 'Search by title, number, or keywords (e.g. Q3 Salaries) • ابحث بالعنوان أو الرقم أو الكلمات الدلالية...'
            }
          />
        </div>

        {/* Filter Pills & Sort bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#00685f] text-white shadow-xs'
                    : 'bg-[#eff4ff] text-[#475569] hover:bg-[#e2e8f0] hover:text-[#0b1c30] border border-[#cbd5e1]/30'
                }`}
              >
                {cat.en} | {cat.ar}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#475569] shrink-0 self-end sm:self-center">
            <span className="material-symbols-outlined text-base">tune</span>
            <span>Sorted by: Recently Updated • الأحدث تحديثاً</span>
          </div>
        </div>
      </section>

      {/* RBAC Access Isolation Banner */}
      <div className="bg-[#eff4ff] border border-[#00685f]/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#00685f]/10 text-[#00685f] flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-xl">shield_person</span>
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-[#0b1c30]">
                {lang === 'AR' ? 'عزل ديوان الموظفين (نظام الحوكمة النشط)' : 'Employee Document Access Isolation Enforced'}
              </span>
              <span className="text-[0.65rem] bg-[#00685f] text-white px-2 py-0.5 rounded-full font-semibold">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-[#475569]">
              {lang === 'AR'
                ? `تعرض هذه القائمة فقط الديوان المخصصة للموظف (${currentUser.name}) أو التي عمل عليها بنفسه في قسم ${currentUser.department}. لا يمكن استعراض الديوان غير المخصصة لك.`
                : `Showing ${filteredDocs.length} document(s) assigned to or created by ${currentUser.name} (${currentUser.department}). Non-assigned company documents are hidden.`}
            </p>
          </div>
        </div>

        {/* Admin Toggle to View Full Repository */}
        {isAdmin && (
          <button
            type="button"
            onClick={() => setAdminViewAll(!adminViewAll)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 cursor-pointer flex items-center gap-1.5 ${
              adminViewAll
                ? 'bg-purple-700 text-white border-purple-800 shadow-xs'
                : 'bg-white text-purple-800 border-purple-300 hover:bg-purple-50'
            }`}
          >
            <span className="material-symbols-outlined text-base">admin_panel_settings</span>
            <span>
              {adminViewAll
                ? lang === 'AR' ? 'الرجوع لنطاق الموظف' : 'Exit Admin View (My Docs)'
                : lang === 'AR' ? 'عرض كافة ديوان الشركة (صلاحية المدير)' : 'Admin View All Company Docs'}
            </span>
          </button>
        )}
      </div>

      {/* Document Cards / Active Repository Catalog */}
      <section className="bg-white rounded-2xl p-5 sm:p-7 lg:p-8 border border-[#cbd5e1]/30 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-[#cbd5e1]/30 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-lg text-[#0b1c30]">
              {isAdmin && adminViewAll ? 'All Company Repository (Admin Mode)' : 'My Assigned & Authored Documents'}
            </h2>
            <span className="text-xs text-[#64748b] font-normal">
              | {isAdmin && adminViewAll ? 'المستودع الكامل للمؤسسة' : 'الديوان المخصصة لي'}
            </span>
          </div>
          <span className="text-xs text-[#475569]">
            Showing {filteredDocs.length} of {documents.length} documents
          </span>
        </div>

        {/* Cards List */}
        <div className="space-y-3.5">
          {filteredDocs.map((doc) => {
            // Role clearance check simulation for Restricted docs
            const isRestrictedBlocked =
              doc.classification === 'Restricted' &&
              currentUser.clearanceLevel !== 'Restricted';

            return (
              <div
                key={doc.id}
                className="group p-5 rounded-2xl bg-[#eff4ff]/40 hover:bg-[#eff4ff] border border-[#cbd5e1]/20 hover:border-[#cbd5e1]/60 transition-all duration-200 flex flex-col xl:flex-row xl:items-center justify-between gap-5"
              >
                {/* Left Document Title & Metadata */}
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-[#00685f]/10 text-[#00685f] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">
                      {doc.fileFormat === 'xlsx'
                        ? 'table_chart'
                        : doc.fileFormat === 'pdf'
                        ? 'description'
                        : 'assignment'}
                    </span>
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        onClick={() => !isRestrictedBlocked && onSelectDocument(doc)}
                        className={`text-base font-semibold text-[#0b1c30] group-hover:text-[#00685f] transition-colors cursor-pointer ${
                          isRestrictedBlocked ? 'line-through opacity-60' : ''
                        }`}
                      >
                        {doc.title}
                      </h3>
                      <span className="text-xs text-[#475569] font-normal">| {doc.titleAr}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#475569] font-normal">
                      <span className="font-mono text-[#64748b] font-medium">{doc.id}</span>
                      <span className="w-1 h-1 rounded-full bg-[#cbd5e1]"></span>
                      <span>{doc.version}</span>
                      <span className="w-1 h-1 rounded-full bg-[#cbd5e1]"></span>
                      <span>{doc.department} | {doc.departmentAr}</span>
                      <span className="w-1 h-1 rounded-full bg-[#cbd5e1]"></span>
                      <span className="text-[#64748b]">{doc.updatedDate}</span>
                      <span className="w-1 h-1 rounded-full bg-[#cbd5e1]"></span>
                      <span className="text-[0.68rem] bg-[#e2e8f0] px-1.5 py-0.5 rounded text-[#475569]">
                        {doc.storageModel} ({doc.storageLocationDetails.split(' ')[0]})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Badges & Actions */}
                <div className="flex flex-wrap items-center justify-between xl:justify-end gap-3 shrink-0 pt-2 xl:pt-0 border-t xl:border-t-0 border-[#cbd5e1]/30">
                  {/* Classification & Status Badges */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        doc.classification === 'Restricted'
                          ? 'bg-[#e2e8f0] text-[#0b1c30]'
                          : doc.classification === 'Confidential'
                          ? 'bg-[#dae2fd] text-[#131b2e]'
                          : 'bg-[#eff4ff] text-[#475569]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xs">
                        {doc.classification === 'Restricted'
                          ? 'lock'
                          : doc.classification === 'Confidential'
                          ? 'shield'
                          : 'public'}
                      </span>
                      <span>
                        {doc.classification === 'Restricted'
                          ? 'Restricted • سري للغاية'
                          : doc.classification === 'Confidential'
                          ? 'Confidential • سري'
                          : doc.classification === 'Internal'
                          ? 'Internal • داخلي'
                          : 'Public • عام'}
                      </span>
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        doc.status === 'Approved'
                          ? 'bg-[#71f8e4]/30 text-[#00685d]'
                          : doc.status === 'Pending Approval'
                          ? 'bg-[#00685f]/15 text-[#00685f]'
                          : 'bg-[#e2e8f0] text-[#0b1c30]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xs">
                        {doc.status === 'Approved'
                          ? 'check'
                          : doc.status === 'Pending Approval'
                          ? 'hourglass_empty'
                          : 'sync'}
                      </span>
                      <span>
                        {doc.status === 'Approved'
                          ? 'Approved • معتمد'
                          : doc.status === 'Pending Approval'
                          ? 'Pending Approval • قيد الاعتماد'
                          : 'In Review • قيد التدقيق'}
                      </span>
                    </span>
                  </div>

                  {/* Actions */}
                  {isRestrictedBlocked ? (
                    <span className="text-xs text-red-600 font-semibold px-3 py-1 rounded-full bg-red-50 border border-red-200 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">lock_person</span>
                      Access Restricted (FR-10)
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectDocument(doc)}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#eff4ff] border border-[#cbd5e1]/40 text-[#0b1c30] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        <span>View | استعراض</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDownloadDocument(doc)}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#eff4ff] border border-[#cbd5e1]/40 text-[#0b1c30] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">download</span>
                        <span>Download | تحميل</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onReassignDocument(doc)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#eff4ff] hover:bg-[#e2e8f0] text-[#00685f] text-xs font-semibold transition-colors cursor-pointer"
                        title="Re-assign Document"
                      >
                        <span className="material-symbols-outlined text-sm">swap_horiz</span>
                        <span>Re-assign</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Footer */}
        <div className="pt-4 border-t border-[#cbd5e1]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-[#475569]">
            Showing 1-{filteredDocs.length} of 1,428 • عرض 1-{filteredDocs.length} من 1,428 مستند
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#eff4ff] text-[#475569] opacity-40 cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-base">chevron_left</span>
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#00685f] text-white text-xs font-bold"
            >
              1
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#eff4ff] text-[#475569] hover:bg-[#e2e8f0] text-xs font-medium transition-colors"
            >
              2
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#eff4ff] text-[#475569] hover:bg-[#e2e8f0] text-xs font-medium transition-colors"
            >
              3
            </button>
            <span className="px-1 text-[#64748b] text-xs font-medium">...</span>
            <button
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#eff4ff] text-[#475569] hover:bg-[#e2e8f0] text-xs font-medium transition-colors"
            >
              286
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#eff4ff] text-[#475569] hover:bg-[#e2e8f0] transition-colors"
            >
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
