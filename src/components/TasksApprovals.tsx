import React, { useState } from 'react';
import { DocumentItem, AppUser } from '../types/dcs';

interface TasksApprovalsProps {
  documents: DocumentItem[];
  lang: 'EN' | 'AR';
  currentUser: AppUser;
  onApproveAndSign: (doc: DocumentItem) => void;
  onReviewDocument: (doc: DocumentItem) => void;
  onRequestRevision: (doc: DocumentItem) => void;
  onReassignTask: (doc: DocumentItem) => void;
  onBulkApprove: (selectedIds: string[]) => void;
  onBulkReassign: (selectedIds: string[]) => void;
}

export const TasksApprovals: React.FC<TasksApprovalsProps> = ({
  documents,
  lang,
  currentUser,
  onApproveAndSign,
  onReviewDocument,
  onRequestRevision,
  onReassignTask,
  onBulkApprove,
  onBulkReassign,
}) => {
  const pendingDocs = documents.filter((d) => d.status === 'Pending Approval' || d.status === 'In Review');
  const [selectedIds, setSelectedIds] = useState<string[]>(['DOC-2026-089', 'DOC-2026-112']);
  const [activeTab, setActiveTab] = useState<'pending' | 'delegated' | 'history'>('pending');

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === pendingDocs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingDocs.map((d) => d.id));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Header Bar */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2 text-[#00685f] text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#00685f] animate-pulse"></span>
              <span>Governance Ledger • سجل الحوكمة الرقابي</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
              Tasks & Approvals <span className="text-[#00685f] font-normal">| المهام والموافقات</span>
            </h1>
            <p className="text-sm text-[#475569]">
              Review pending documents requiring your sign-off • مراجعة الديوان المعلقة التي
              تتطلب اعتمادك وتوقيعك
            </p>
          </div>

          {/* Dual HSM Sync Badge */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#eff4ff] text-[#475569] shadow-xs border border-[#cbd5e1]/40 self-start lg:self-auto text-xs font-medium">
            <span className="material-symbols-outlined text-[#00685f] text-base">verified_user</span>
            <span>Dual HSM Keys Synced • المفاتيح الرقمية نشطة</span>
          </div>
        </div>

        {/* 3 Summary Metrics Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Needs Action */}
          <div className="relative overflow-hidden rounded-2xl bg-white p-5 border border-[#cbd5e1]/30 shadow-xs hover:shadow-md transition-all group">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="w-12 h-12 rounded-full bg-[#00685f]/15 flex items-center justify-center text-[#00685f]">
                <span className="material-symbols-outlined text-2xl">assignment_late</span>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#00685f] text-white text-xs font-semibold shadow-xs">
                Action Required • مطلوب إجراؤك
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#0b1c30]">03</span>
              <span className="text-sm font-medium text-[#00685f]">Pending • معلقة</span>
            </div>
            <div className="mt-1 text-xs text-[#475569]">
              Needs My Action | مهام بانتظار إجرائي
            </div>
          </div>

          {/* Card 2: Urgent (<24h) */}
          <div className="relative overflow-hidden rounded-2xl bg-white p-5 border border-[#cbd5e1]/30 shadow-xs hover:shadow-md transition-all group">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <span className="material-symbols-outlined text-2xl">alarm</span>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                &lt; 24h Left • أقل من يوم
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-red-600">01</span>
              <span className="text-sm font-medium text-red-600">Critical Due • استحقاق عاجل</span>
            </div>
            <div className="mt-1 text-xs text-[#475569]">
              Urgent SLA Window | عاجلة ومحددة بوقت
            </div>
          </div>

          {/* Card 3: Cleared This Month */}
          <div className="relative overflow-hidden rounded-2xl bg-white p-5 border border-[#cbd5e1]/30 shadow-xs hover:shadow-md transition-all group">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="w-12 h-12 rounded-full bg-[#71f8e4]/20 flex items-center justify-center text-[#00685d]">
                <span className="material-symbols-outlined text-2xl">task_alt</span>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#e2e8f0] text-[#475569] text-xs font-medium">
                Month of May • مايو الجاري
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#0b1c30]">28</span>
              <span className="text-sm font-medium text-[#00685d]">Cleared • مستكملة</span>
            </div>
            <div className="mt-1 text-xs text-[#475569]">
              Approved This Month | تم اعتمادها هذا الشهر
            </div>
          </div>
        </div>
      </section>

      {/* Tabs & Bulk Action Toolbar */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#eff4ff] max-w-full overflow-x-auto border border-[#cbd5e1]/30">
            <button
              type="button"
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-[#00685f] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#0b1c30]'
              }`}
            >
              My Pending Tasks ({pendingDocs.length}) | مهامي المعلقة
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('delegated')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'delegated'
                  ? 'bg-[#00685f] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#0b1c30]'
              }`}
            >
              Delegated & Out for Review (4) | مهام مفوضة
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-[#00685f] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#0b1c30]'
              }`}
            >
              History & Archive | السجل والأرشيف
            </button>
          </div>

          {/* Sort & Sync Utilities */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#475569] shadow-xs text-xs border border-[#cbd5e1]/30">
              <span className="material-symbols-outlined text-base text-[#00685f]">swap_vert</span>
              <span>Sort: SLA First • الأولوية للمستعجل</span>
            </div>
          </div>
        </div>

        {/* Master Select Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 px-4 rounded-xl bg-[#eff4ff] border border-[#cbd5e1]/30 shadow-xs">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#0b1c30]">
              <input
                type="checkbox"
                checked={selectedIds.length === pendingDocs.length && pendingDocs.length > 0}
                onChange={selectAll}
                className="w-4 h-4 rounded text-[#00685f] accent-[#00685f] cursor-pointer"
              />
              <span>
                Select All ({selectedIds.length} of {pendingDocs.length} Selected) | تحديد الكل
              </span>
            </label>
            <span className="text-[#cbd5e1]">•</span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00685f]/10 text-[#00685f] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#00685f]"></span>
              <span>{selectedIds.length} items selected • عنصران محددان</span>
            </div>
          </div>

          {/* Bulk Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              disabled={selectedIds.length === 0}
              onClick={() => onBulkApprove(selectedIds)}
              className="px-4 py-1.5 rounded-full bg-[#00685f] text-white text-xs font-semibold hover:bg-[#008378] disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">done_all</span>
              <span>Bulk Approve & Sign ({selectedIds.length}) | اعتماد جماعي وتوقيع</span>
            </button>
            <button
              type="button"
              disabled={selectedIds.length === 0}
              onClick={() => onBulkReassign(selectedIds)}
              className="px-4 py-1.5 rounded-full bg-[#e2e8f0] text-[#0b1c30] text-xs font-semibold hover:bg-[#cbd5e1] disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-[#00685f]">
                swap_horiz
              </span>
              <span>Bulk Re-assign | إعادة توجيه جماعية</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-full text-[#475569] hover:text-[#0b1c30] text-xs transition-colors cursor-pointer"
            >
              Clear | إلغاء التحديد
            </button>
          </div>
        </div>
      </section>

      {/* Task Stack Cards */}
      <section className="space-y-6">
        {pendingDocs.map((doc) => {
          const isSelected = selectedIds.includes(doc.id);

          return (
            <article
              key={doc.id}
              className={`relative rounded-2xl bg-white p-6 shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col gap-4 border ${
                doc.isUrgent
                  ? 'ring-2 ring-red-500/30 border-red-200'
                  : 'border-[#cbd5e1]/40'
              }`}
            >
              {/* Top Urgent Priority Gradient Edge */}
              {doc.isUrgent && (
                <div className="absolute top-0 inset-x-8 h-1 rounded-b-full bg-gradient-to-r from-red-600 via-red-500 to-[#00685f]"></div>
              )}

              {/* Header: Checkbox, Classification, Doc Ref, Due Countdown */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(doc.id)}
                    className="w-4 h-4 rounded text-[#00685f] accent-[#00685f] cursor-pointer mr-1"
                  />
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
                      doc.classification === 'Restricted'
                        ? 'bg-red-100 text-red-700'
                        : doc.classification === 'Confidential'
                        ? 'bg-[#dae2fd] text-[#131b2e]'
                        : 'bg-[#eff4ff] text-[#475569]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {doc.classification === 'Restricted' ? 'lock' : 'shield'}
                    </span>
                    <span>
                      {doc.classification === 'Restricted'
                        ? 'Restricted | سري للغاية'
                        : doc.classification === 'Confidential'
                        ? 'Confidential | سري'
                        : 'Internal | داخلي'}
                    </span>
                  </span>

                  <span className="px-3 py-0.5 rounded-full bg-[#eff4ff] text-[#0b1c30] text-xs font-mono font-medium">
                    {doc.id}
                  </span>
                </div>

                {/* Due Timer Badge */}
                {doc.urgentTimerText ? (
                  <div className="px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 font-semibold text-xs flex items-center gap-1.5 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                    <span className="material-symbols-outlined text-base animate-pulse">
                      hourglass_top
                    </span>
                    <span>{doc.urgentTimerText}</span>
                  </div>
                ) : (
                  <div className="px-3 py-1 rounded-full bg-[#eff4ff] text-[#475569] text-xs flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#00685f]">
                      schedule
                    </span>
                    <span>{doc.dueDate ? 'Due Soon' : 'Standard SLA'}</span>
                  </div>
                )}
              </div>

              {/* Owner vs Currently Assigned To Distinction Badge Row */}
              <div className="flex flex-wrap items-center gap-4 py-1.5 px-4 rounded-xl bg-[#eff4ff]/70 border border-[#cbd5e1]/20 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#64748b] uppercase font-medium">Owner / المنشئ:</span>
                  <span className="font-semibold text-[#0b1c30] flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-[#00685f]">
                      person_pin
                    </span>
                    {doc.ownerRoleAndDept}
                  </span>
                </div>
                <span className="text-[#cbd5e1]">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#00685f] uppercase font-semibold">
                    Currently Assigned To / المسند إليه حالياً:
                  </span>
                  <span className="font-semibold text-[#0b1c30] flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#00685f]/10">
                    <span className="material-symbols-outlined text-sm text-[#00685f]">
                      assignment_ind
                    </span>
                    {doc.currentAssigneeRoleAndDept}
                  </span>
                </div>
              </div>

              {/* Main Title & Description + 3-Stage Timeline */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex flex-col gap-2 max-w-2xl">
                  <h2 className="text-xl font-bold text-[#0b1c30] tracking-tight">
                    {doc.title} <span className="text-[#00685f] font-normal">| {doc.titleAr}</span>
                  </h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {doc.description}
                    <span className="block text-xs text-[#64748b] font-normal mt-1">
                      {doc.descriptionAr}
                    </span>
                  </p>
                </div>

                {/* Workflow Sign-off Chain Timeline (3 Stages) */}
                {doc.workflowChain && doc.workflowChain.length > 0 && (
                  <div className="shrink-0 flex flex-col p-4 rounded-xl bg-[#eff4ff] border border-[#cbd5e1]/30 min-w-[340px] max-w-md w-full lg:w-auto shadow-xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#cbd5e1]/20">
                      <div className="flex items-center gap-1.5 text-xs text-[#00685f] font-semibold">
                        <span className="material-symbols-outlined text-base">account_tree</span>
                        <span>Sign-off Chain • مسار الاعتماد</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#00685f]/15 text-[#00685f] text-[0.62rem] font-bold">
                        In Progress
                      </span>
                    </div>

                    <div className="flex flex-col gap-3">
                      {doc.workflowChain.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs">
                          <div className="flex flex-col items-center">
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[0.65rem] shadow-xs ${
                                step.status === 'Completed'
                                  ? 'bg-[#00685d] text-white'
                                  : step.status === 'Current'
                                  ? 'bg-[#00685f] text-white ring-2 ring-[#00685f]/30'
                                  : 'bg-[#cbd5e1] text-[#475569]'
                              }`}
                            >
                              <span className="material-symbols-outlined text-xs">
                                {step.status === 'Completed'
                                  ? 'check'
                                  : step.status === 'Current'
                                  ? 'edit'
                                  : 'pending'}
                              </span>
                            </span>
                            {idx < doc.workflowChain.length - 1 && (
                              <span
                                className={`w-0.5 h-6 ${
                                  step.status === 'Completed'
                                    ? 'bg-[#00685d]/40'
                                    : 'bg-[#cbd5e1]/50'
                                }`}
                              ></span>
                            )}
                          </div>
                          <div className="flex flex-col leading-tight">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`font-semibold text-xs ${
                                  step.status === 'Current' ? 'text-[#00685f]' : 'text-[#0b1c30]'
                                }`}
                              >
                                {step.stageName}
                              </span>
                              <span
                                className={`text-[0.62rem] px-1.5 py-0.2 rounded font-bold ${
                                  step.status === 'Completed'
                                    ? 'bg-[#00685d]/10 text-[#00685d]'
                                    : step.status === 'Current'
                                    ? 'bg-red-100 text-red-700 animate-pulse'
                                    : 'bg-[#cbd5e1]/40 text-[#475569]'
                                }`}
                              >
                                {step.status === 'Completed'
                                  ? 'Done • تم'
                                  : step.status === 'Current'
                                  ? 'Current • نشط'
                                  : 'Upcoming • التالي'}
                              </span>
                            </div>
                            <span className="text-[0.65rem] text-[#64748b]">
                              {step.approverName || step.assignedRole}
                              {step.completedTimestamp && ` • Approved ${step.completedTimestamp}`}
                              {step.dueCountdownText && (
                                <span className="text-red-600 font-semibold ml-1">
                                  ({step.dueCountdownText})
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Document Attachments & Audit Trace snippet */}
              <div className="flex flex-wrap items-center justify-between gap-3 py-2 px-4 rounded-xl bg-[#eff4ff]/60 text-[#475569] text-xs border border-[#cbd5e1]/20">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5 font-medium text-[#0b1c30]">
                    <span className="material-symbols-outlined text-base text-[#00685f]">
                      description
                    </span>
                    <span>
                      {doc.id}_{doc.version}.{doc.fileFormat} ({doc.fileSize})
                    </span>
                  </div>
                  <span className="text-[#cbd5e1]">•</span>
                  <div className="flex items-center gap-1.5 text-xs text-[#00685d]">
                    <span className="material-symbols-outlined text-base">verified</span>
                    <span>Pre-checked: Internal Audit Unit • مدقق داخلياً</span>
                  </div>
                </div>
                <span className="text-[0.65rem] text-[#64748b] font-mono">
                  Digital Signature Token: eIDAS Qualified AES-256 ({doc.encryptionKeyId})
                </span>
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#cbd5e1]/20">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onApproveAndSign(doc)}
                    className="px-5 py-2 rounded-full bg-[#00685f] text-white text-xs font-semibold hover:bg-[#008378] shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">draw</span>
                    <span>Approve & Sign | اعتماد وتوقيع</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onReviewDocument(doc)}
                    className="px-4 py-2 rounded-full bg-[#e2e8f0] text-[#0b1c30] text-xs font-semibold hover:bg-[#cbd5e1] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">visibility</span>
                    <span>Review Document | استعراض المستند</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onRequestRevision(doc)}
                    className="px-4 py-2 rounded-full bg-[#eff4ff] text-[#475569] text-xs font-medium hover:bg-[#e2e8f0] hover:text-[#0b1c30] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">edit_note</span>
                    <span>Request Revision | طلب تعديل</span>
                  </button>
                </div>

                {/* Re-assign Button */}
                <button
                  type="button"
                  onClick={() => onReassignTask(doc)}
                  className="px-4 py-2 rounded-full bg-[#e2e8f0] hover:bg-[#cbd5e1] text-[#0b1c30] border border-[#cbd5e1]/40 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base text-[#00685f]">
                    swap_horiz
                  </span>
                  <span>Re-assign | إعادة توجيه</span>
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {/* Governance Status Footer Card */}
      <section className="rounded-2xl bg-[#eff4ff] p-5 flex flex-col md:flex-row items-center justify-between gap-4 border border-[#cbd5e1]/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#00685f]/10 flex items-center justify-center text-[#00685f] shrink-0">
            <span className="material-symbols-outlined text-xl">encrypted</span>
          </div>
          <div className="flex flex-col text-xs">
            <span className="font-semibold text-[#0b1c30]">
              Automated Audit Logging Active • التوثيق الرقابي التلقائي مفعل
            </span>
            <span className="text-[#64748b]">
              Every signature transaction writes an immutable hash to the National Trust anchor
              ledger.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
