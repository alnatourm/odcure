import React, { useState } from 'react';
import { AuditEvent, AuditCategory } from '../types/dcs';

interface AuditComplianceLedgerProps {
  events: AuditEvent[];
  lang: 'EN' | 'AR';
  onValidateChain: () => void;
  onExportCsv: () => void;
  onExportPdf: () => void;
  onShowToast: (msg: string) => void;
}

export const AuditComplianceLedger: React.FC<AuditComplianceLedgerProps> = ({
  events,
  lang,
  onValidateChain,
  onExportCsv,
  onExportPdf,
  onShowToast,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<AuditCategory>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [inspectedEvent, setInspectedEvent] = useState<AuditEvent | null>(null);

  const filteredEvents = events.filter((evt) => {
    const matchesFilter = selectedFilter === 'ALL' || evt.category === selectedFilter;
    const matchesQuery =
      evt.documentRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.documentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.actionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.hashSeal.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesQuery;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col max-w-4xl space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#e2e8f0] text-[#00685f] text-xs font-semibold">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>Immutable Ledger • سجل الامتثال المحمي</span>
            </span>
            <span className="text-xs text-[#475569] flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00685f] animate-pulse"></span>
              Sync Active (Block #498,211)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
            Audit Trail & Compliance Ledger
            <span className="block text-lg text-[#00685f] font-semibold mt-0.5">
              سجل التدقيق والامتثال الرقابي
            </span>
          </h1>
          <p className="text-sm text-[#475569] leading-relaxed max-w-3xl">
            Immutable, cryptographically verifiable ledger tracking every access attempt, workflow
            transition, storage operation, and permission change across on-premise and cloud nodes.
            <span className="block text-xs text-[#64748b] mt-0.5">
              سجل غير قابل للتعديل لتتبع عمليات الوصول، مسارات التخزين، انتقالات سير العمل، وتعديل
              صلاحيات الوصول الاستثنائية.
            </span>
          </p>
        </div>

        {/* Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onValidateChain}
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#0b1c30] hover:bg-[#eff4ff] border border-[#cbd5e1]/40 shadow-xs rounded-full transition-all text-xs font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#00685f] text-base">task_alt</span>
            <span>Validate Chain • فحص السلسلة</span>
          </button>
          <button
            type="button"
            onClick={() => onShowToast('Live cryptographic compliance stream initialized')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#00685f] text-white hover:bg-[#008378] shadow-sm rounded-full transition-all text-xs font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">security</span>
            <span>Live Compliance Stream • البث المباشر</span>
          </button>
        </div>
      </section>

      {/* 4 High-Contrast Executive Metrics Bento */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-[#cbd5e1]/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] text-[#475569] font-bold uppercase tracking-wider">
              Total Audited Events • إجمالي العمليات
            </span>
            <div className="p-2 rounded-full bg-[#eff4ff] text-[#00685f]">
              <span className="material-symbols-outlined text-lg">token</span>
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-[#0b1c30]">84,920</div>
            <div className="flex items-center gap-1 mt-1 text-[#00685f] text-xs font-semibold">
              <span className="material-symbols-outlined text-sm">lock</span>
              <span>100% SHA-256 Verified • سلسلة غير منقطعة</span>
            </div>
          </div>
          <div className="w-full bg-[#eff4ff] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#00685f] h-full rounded-full w-full"></div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-[#cbd5e1]/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] text-red-600 font-bold uppercase tracking-wider">
              Access Denied • محاولات محظورة
            </span>
            <div className="p-2 rounded-full bg-red-100 text-red-600">
              <span className="material-symbols-outlined text-lg">gpp_bad</span>
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-red-600">12</div>
            <div className="flex items-center gap-1 mt-1 text-red-600 text-xs font-semibold">
              <span className="material-symbols-outlined text-sm">shield</span>
              <span>Blocked by Policy FR-13 • معزولة تلقائياً</span>
            </div>
          </div>
          <div className="w-full bg-red-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-red-600 h-full rounded-full w-[15%]"></div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-[#cbd5e1]/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] text-[#475569] font-bold uppercase tracking-wider">
              Storage Route Events • مسارات التخزين
            </span>
            <div className="p-2 rounded-full bg-[#eff4ff] text-[#475569]">
              <span className="material-symbols-outlined text-lg">dns</span>
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-[#0b1c30]">1,428</div>
            <div className="flex items-center gap-1 mt-1 text-[#475569] text-xs font-semibold">
              <span className="material-symbols-outlined text-sm">swap_vert</span>
              <span>MinIO Local & AWS Cloud (FR-48)</span>
            </div>
          </div>
          <div className="w-full bg-[#eff4ff] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#475569] h-full rounded-full w-[82%]"></div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-[#cbd5e1]/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] text-[#475569] font-bold uppercase tracking-wider">
              Temporary Grants • تصاريح مؤقتة
            </span>
            <div className="p-2 rounded-full bg-[#dae2fd] text-[#131b2e]">
              <span className="material-symbols-outlined text-lg">timer</span>
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-[#0b1c30]">6</div>
            <div className="flex items-center gap-1 mt-1 text-[#131b2e] text-xs font-semibold">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span>Expiring within 72h (FR-11) • تنتهي قريباً</span>
            </div>
          </div>
          <div className="w-full bg-[#eff4ff] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#00685f] h-full rounded-full w-[38%]"></div>
          </div>
        </div>
      </section>

      {/* Merkle Root Proof & Sparkline Banner */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#eff4ff] p-5 rounded-2xl border border-[#cbd5e1]/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00685f] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">fingerprint</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#0b1c30]">
                Cryptographic Proof & Merkle Root Status
              </span>
              <span className="text-[0.68rem] font-mono text-[#475569] mt-0.5 break-all">
                Root Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
              </span>
              <p className="text-xs text-[#64748b] mt-1">
                Every micro-transaction is bundled into SHA-256 signed blocks every 120 seconds.
                Non-repudiation guaranteed by Sanad Governance Core (FR-33).
              </p>
            </div>
          </div>
          <div className="shrink-0 flex flex-col items-end">
            <span className="px-3 py-1 rounded-full bg-[#00685f]/10 text-[#00685f] font-bold text-xs">
              Integrity: 100.00%
            </span>
            <span className="text-[0.65rem] text-[#64748b] mt-1">Last Block Sealed: 42s ago</span>
          </div>
        </div>

        {/* Velocity Sparkline SVG */}
        <div className="bg-white p-5 rounded-2xl border border-[#cbd5e1]/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#0b1c30]">Activity Velocity • كثافة الأحداث</span>
            <span className="text-[#00685f] font-bold">+18.4% peak</span>
          </div>
          <div className="w-full h-12 my-2">
            <svg
              className="w-full h-full text-[#00685f]"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 240 60"
            >
              <path
                d="M0,45 C20,40 30,50 50,30 C70,10 80,42 100,35 C120,28 140,5 160,20 C180,35 190,15 210,18 C225,20 235,12 240,8"
                stroke="currentColor"
                strokeWidth="2.5"
              />
              <path
                d="M0,45 C20,40 30,50 50,30 C70,10 80,42 100,35 C120,28 140,5 160,20 C180,35 190,15 210,18 C225,20 235,12 240,8 L240,60 L0,60 Z"
                fill="currentColor"
                fillOpacity="0.1"
              />
            </svg>
          </div>
          <div className="flex items-center justify-between text-[0.65rem] text-[#64748b]">
            <span>00:00 UTC</span>
            <span>12:00 UTC</span>
            <span>Now (Realtime)</span>
          </div>
        </div>
      </section>

      {/* Action & Search Console */}
      <section className="bg-white p-4 rounded-2xl border border-[#cbd5e1]/30 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="w-full lg:max-w-md flex items-center bg-[#eff4ff] px-3.5 py-1.5 rounded-xl border border-[#cbd5e1]/30">
          <span className="material-symbols-outlined text-[#64748b] text-base mr-2">search</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-0 outline-none text-xs text-[#0b1c30] placeholder:text-[#64748b]"
            placeholder="Search by Document ID, Actor, IP or Hash... | بحث في السجل"
          />
        </div>

        {/* Export Buttons */}
        <div className="w-full lg:w-auto flex flex-wrap items-center justify-start lg:justify-end gap-2">
          <button
            type="button"
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#eff4ff] hover:bg-[#e2e8f0] rounded-full text-[#0b1c30] font-semibold text-xs border border-[#cbd5e1]/30 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#00685f] text-base">table_view</span>
            <span>Export Audit Log (CSV) | تصدير CSV</span>
          </button>

          <button
            type="button"
            onClick={onExportPdf}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#00685f] text-white hover:bg-[#008378] rounded-full font-semibold text-xs shadow-xs transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">picture_as_pdf</span>
            <span>Export Compliance Report (PDF) | تقرير الامتثال PDF</span>
          </button>
        </div>
      </section>

      {/* Category Filter Pills */}
      <section className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(
          [
            { id: 'ALL', label: 'All Events • الكل (84,920)' },
            { id: 'DOC', label: 'Document Access & Views • عرض المستندات' },
            { id: 'WORKFLOW', label: 'Approvals & Workflow • الموافقات وسير العمل' },
            { id: 'REASSIGN', label: 'Re-assignments (FR-15) • إعادة التعيين' },
            { id: 'STORAGE', label: 'Storage & Encryption (FR-48) • التخزين والتشفير' },
            { id: 'SECURITY', label: 'Security & Denials (FR-13) • محاولات محظورة' },
          ] as const
        ).map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setSelectedFilter(filter.id as AuditCategory)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === filter.id
                ? 'bg-[#00685f] text-white shadow-xs'
                : 'bg-white text-[#475569] hover:bg-[#eff4ff] border border-[#cbd5e1]/30'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </section>

      {/* Immutable Audit Table */}
      <section className="bg-white rounded-2xl border border-[#cbd5e1]/30 shadow-xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#eff4ff] text-[#475569] text-xs font-semibold">
                <th className="py-3 px-4 uppercase tracking-wider">Timestamp & IP • الوقت وعنوان IP</th>
                <th className="py-3 px-4 uppercase tracking-wider">Document Ref • المستند</th>
                <th className="py-3 px-4 uppercase tracking-wider">Actor / User • المنفذ</th>
                <th className="py-3 px-4 uppercase tracking-wider">Action Type • الإجراء</th>
                <th className="py-3 px-4 uppercase tracking-wider">Details & Rationale • التفاصيل والمبرر</th>
                <th className="py-3 px-4 text-right uppercase tracking-wider pr-6">
                  Hash Seal (SHA-256) • البصمة
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cbd5e1]/20 text-xs text-[#0b1c30]">
              {filteredEvents.map((evt) => (
                <tr
                  key={evt.id}
                  onClick={() => setInspectedEvent(evt)}
                  className={`hover:bg-[#eff4ff]/60 transition-colors cursor-pointer ${
                    evt.actionType === 'ACCESS_DENIED' ? 'bg-red-50/40' : ''
                  }`}
                >
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#0b1c30]">{evt.timestamp}</span>
                      <span className="text-[0.65rem] text-[#64748b]">
                        {evt.ipAddress} • {evt.locationNode}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span
                        className={`font-bold ${
                          evt.actionType === 'ACCESS_DENIED' ? 'text-red-600' : 'text-[#0b1c30]'
                        }`}
                      >
                        {evt.documentRef}
                      </span>
                      <span className="text-[0.68rem] text-[#475569]">{evt.documentTitle}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#e2e8f0] flex items-center justify-center font-bold text-[0.65rem] text-[#0b1c30]">
                        {evt.actorName.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#0b1c30]">{evt.actorName}</span>
                        <span className="text-[0.65rem] text-[#64748b]">{evt.actorRoleAndDept}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.68rem] font-bold ${
                        evt.actionType === 'ACCESS_DENIED'
                          ? 'bg-red-600 text-white'
                          : evt.actionType === 'STORAGE_MIGRATED'
                          ? 'bg-[#dae2fd] text-[#131b2e]'
                          : evt.actionType === 'APPROVED'
                          ? 'bg-[#71f8e4] text-[#00201c]'
                          : 'bg-[#e2e8f0] text-[#0b1c30]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xs">
                        {evt.actionType === 'ACCESS_DENIED'
                          ? 'block'
                          : evt.actionType === 'STORAGE_MIGRATED'
                          ? 'sync_alt'
                          : evt.actionType === 'APPROVED'
                          ? 'done_all'
                          : 'visibility'}
                      </span>
                      {evt.actionType}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <p
                      className={`font-medium ${
                        evt.actionType === 'ACCESS_DENIED' ? 'text-red-700' : 'text-[#0b1c30]'
                      }`}
                    >
                      {evt.details}
                    </p>
                    <span className="text-[0.65rem] text-[#64748b]">{evt.rationale}</span>
                  </td>

                  <td className="py-3 px-4 text-right pr-6 whitespace-nowrap">
                    <div
                      className="inline-flex items-center gap-1 font-mono text-[0.68rem] bg-[#eff4ff] px-2.5 py-1 rounded border border-[#cbd5e1]/30 text-[#64748b] hover:text-[#00685f]"
                      title="Click to inspect SHA-256 Merkle proof"
                    >
                      <span>{evt.hashSeal}</span>
                      <span className="material-symbols-outlined text-xs text-[#00685f]">
                        verified
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#eff4ff] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#475569]">
          <span>
            Showing <strong>1 - {filteredEvents.length}</strong> of <strong>84,920</strong> recorded
            events
          </span>
          <div className="flex items-center gap-1">
            <span className="text-xs text-[#00685f] font-semibold">Page 1 of 14,154</span>
          </div>
        </div>
      </section>

      {/* Cryptographic Proof Modal */}
      {inspectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-[#cbd5e1]/40">
            <div className="flex items-center justify-between border-b border-[#cbd5e1]/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00685f]">fingerprint</span>
                <h3 className="font-bold text-sm text-[#0b1c30]">
                  Cryptographic Seal & Merkle Proof Inspector
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectedEvent(null)}
                className="text-[#64748b] hover:text-[#0b1c30]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-[#eff4ff] p-3 rounded-xl space-y-1 font-mono">
                <span className="text-[0.65rem] text-[#64748b] font-sans font-bold uppercase block">
                  SHA-256 Full Digest
                </span>
                <p className="text-[#00685f] font-bold break-all text-[0.68rem]">
                  {inspectedEvent.fullSha256}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[0.68rem]">
                <div className="bg-[#eff4ff] p-2.5 rounded-xl">
                  <span className="text-[#64748b]">Merkle Block Number:</span>
                  <p className="font-bold text-[#0b1c30]">#{inspectedEvent.merkleBlockNumber}</p>
                </div>
                <div className="bg-[#eff4ff] p-2.5 rounded-xl">
                  <span className="text-[#64748b]">Action Type:</span>
                  <p className="font-bold text-[#0b1c30]">{inspectedEvent.actionType}</p>
                </div>
              </div>

              <div className="bg-[#eff4ff] p-3 rounded-xl space-y-1">
                <span className="text-[0.65rem] text-[#64748b] font-bold uppercase block">
                  Audit Entry Metadata
                </span>
                <p>
                  <strong>Document:</strong> {inspectedEvent.documentRef} -{' '}
                  {inspectedEvent.documentTitle}
                </p>
                <p>
                  <strong>Actor:</strong> {inspectedEvent.actorName} (
                  {inspectedEvent.actorRoleAndDept})
                </p>
                <p>
                  <strong>IP / Node:</strong> {inspectedEvent.ipAddress} (
                  {inspectedEvent.locationNode})
                </p>
                <p>
                  <strong>Rationale:</strong> {inspectedEvent.rationale}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setInspectedEvent(null)}
                className="px-5 py-2 rounded-full bg-[#00685f] text-white text-xs font-semibold"
              >
                Close Verification Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
