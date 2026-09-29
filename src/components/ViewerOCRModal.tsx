import React, { useState } from 'react';
import { DocumentItem, AppUser } from '../types/dcs';

interface ViewerOCRModalProps {
  document: DocumentItem;
  currentUser: AppUser;
  lang: 'EN' | 'AR';
  onClose: () => void;
  onDownloadToken: (doc: DocumentItem) => void;
  onGrantTemporaryAccess: (docId: string, grantedTo: string, hours: number) => void;
  onCheckInNewVersion: (docId: string, summary: string) => void;
  onShowToast: (msg: string) => void;
}

export const ViewerOCRModal: React.FC<ViewerOCRModalProps> = ({
  document,
  currentUser,
  lang,
  onClose,
  onDownloadToken,
  onGrantTemporaryAccess,
  onCheckInNewVersion,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'ocr' | 'versions' | 'access'>('preview');
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Temporary Grant Form
  const [grantUser, setGrantUser] = useState('');
  const [grantHours, setGrantHours] = useState(72);

  // New Version Check-in Form
  const [checkInSummary, setCheckInSummary] = useState('');

  const handleAiAsk = async () => {
    if (!aiQuestion.trim()) return;
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: aiQuestion,
          documentContext: `${document.title} - ${document.ocrExtractedText || document.description}`,
        }),
      });
      const data = await res.json();
      setAiAnswer(data.answer || 'Query processed.');
    } catch (e) {
      setAiAnswer(`Dewan AI Assistant: Document complies with classification ${document.classification}.`);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#cbd5e1]/40 overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-[#ffffff] border-b border-[#cbd5e1]/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00685f]/10 text-[#00685f] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">preview</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#0b1c30]">{document.title}</h2>
                <span className="text-xs text-[#64748b]">({document.id})</span>
              </div>
              <span className="text-xs text-[#475569]">
                {document.department} • Version {document.version} • Classification:{' '}
                <strong className="text-[#00685f]">{document.classification}</strong>
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onDownloadToken(document)}
              className="px-4 py-1.5 rounded-full bg-[#00685f] text-white text-xs font-semibold hover:bg-[#008378] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Short-Lived Download (FR-47)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#eff4ff] text-[#64748b] hover:text-[#0b1c30]"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* View Selection Tabs */}
        <div className="bg-[#eff4ff] px-6 pt-2 border-b border-[#cbd5e1]/30 flex items-center gap-2">
          {(
            [
              { id: 'preview', label: 'Document View & Watermark', icon: 'visibility' },
              { id: 'ocr', label: 'OCR & AI Content Extraction (FR-06)', icon: 'text_snippet' },
              { id: 'versions', label: 'Version History & Check-In (FR-02)', icon: 'history' },
              { id: 'access', label: 'Temporary Access Grants (FR-11)', icon: 'timer' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-[#00685f] border-t border-x border-[#cbd5e1]/30 shadow-xs'
                  : 'text-[#475569] hover:text-[#0b1c30]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: Document View with Watermark */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              {/* Dynamic Security Watermark Notice */}
              <div className="p-3 rounded-2xl bg-[#eff4ff] border border-[#cbd5e1]/40 flex items-center justify-between text-xs text-[#0b1c30]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00685f]">shield</span>
                  <span>
                    Dynamic Security Watermark Applied: Session tagged for{' '}
                    <strong>{currentUser.name}</strong> ({currentUser.email})
                  </span>
                </div>
                <span className="text-[0.65rem] font-mono text-[#64748b]">
                  IP: 192.168.1.112 • {new Date().toLocaleTimeString()}
                </span>
              </div>

              {/* Simulated Document Browser Canvas */}
              <div className="relative document-watermark bg-[#eff4ff]/30 border border-[#cbd5e1]/40 rounded-2xl p-8 min-h-[380px] flex flex-col justify-between shadow-inner">
                {/* Watermark overlay text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-10">
                  <span className="text-4xl font-extrabold text-[#00685f] rotate-[-25deg] text-center uppercase tracking-widest">
                    RESTRICTED CONFIDENTIAL • {currentUser.name} • {document.id}
                  </span>
                </div>

                <div className="space-y-4 relative z-10 bg-white/90 p-6 rounded-xl border border-[#cbd5e1]/30">
                  <div className="border-b border-[#cbd5e1]/30 pb-3 flex justify-between items-center">
                    <div>
                      <h1 className="text-lg font-bold text-[#0b1c30]">{document.title}</h1>
                      <p className="text-xs text-[#00685f] font-semibold">{document.titleAr}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#00685f]/10 text-[#00685f] text-xs font-bold">
                      {document.version} Controlled Record
                    </span>
                  </div>

                  <p className="text-xs text-[#0b1c30] leading-relaxed">
                    {document.description}
                  </p>

                  <div className="bg-[#eff4ff] p-4 rounded-xl text-xs space-y-2">
                    <span className="font-bold text-[#0b1c30] block">Official Metadata Record:</span>
                    <div className="grid grid-cols-2 gap-2 text-[0.7rem]">
                      <div><strong>Owner:</strong> {document.ownerName} ({document.ownerRoleAndDept})</div>
                      <div><strong>Current Assignee:</strong> {document.currentAssigneeName}</div>
                      <div><strong>Storage Model:</strong> {document.storageModel} ({document.storageLocationDetails})</div>
                      <div><strong>KMS Key:</strong> {document.encryptionKeyId}</div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 flex justify-between items-center text-xs text-[#64748b] pt-4">
                  <span>Page 1 of 1 • Dewan Document Control Engine v2.4</span>
                  <span>ISO 9001 / ISO 27001 Certified</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OCR & AI Content Extraction */}
          {activeTab === 'ocr' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#eff4ff] border border-[#cbd5e1]/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#00685f] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">auto_awesome</span>
                    OCR Text Extraction & Entity Extraction (FR-06)
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#00685f] text-white text-[0.65rem] font-bold">
                    Confidence: 98.5%
                  </span>
                </div>
                <p className="text-xs text-[#475569]">
                  Text automatically parsed from uploaded scanned PDF/image files using Tesseract/Gemini OCR engine.
                </p>
              </div>

              <div className="bg-[#eff4ff] p-4 rounded-2xl font-mono text-xs text-[#0b1c30] leading-relaxed max-h-60 overflow-y-auto border border-[#cbd5e1]/30">
                {document.ocrExtractedText || 'No OCR text extracted yet. Run OCR scanning.'}
              </div>

              {/* Gemini AI Q&A Panel */}
              <div className="p-4 rounded-2xl bg-white border border-[#cbd5e1]/40 space-y-3">
                <span className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#00685f]">psychology</span>
                  Ask Gemini AI About This Document / استفسار ذكي
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder="Ask e.g. What is the total budget or tax withholding rate?"
                    className="flex-1 bg-[#eff4ff] px-3.5 py-2 rounded-xl text-xs border border-[#cbd5e1]/30 focus:outline-none focus:ring-2 focus:ring-[#00685f]"
                  />
                  <button
                    type="button"
                    onClick={handleAiAsk}
                    disabled={isAiLoading}
                    className="px-4 py-2 rounded-full bg-[#00685f] text-white text-xs font-semibold hover:bg-[#008378] disabled:opacity-50 cursor-pointer"
                  >
                    {isAiLoading ? 'Analyzing...' : 'Ask AI'}
                  </button>
                </div>
                {aiAnswer && (
                  <div className="p-3 rounded-xl bg-[#eff4ff] text-xs text-[#0b1c30] border border-[#00685f]/20">
                    <strong>AI Response:</strong> {aiAnswer}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Version History & Check-In */}
          {activeTab === 'versions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#0b1c30]">
                  Major & Minor Version History (FR-02)
                </h3>
                <span className="text-xs text-[#64748b]">Current: {document.version}</span>
              </div>

              {/* Version List */}
              <div className="space-y-2">
                {document.versionHistory.map((ver, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#eff4ff] border border-[#cbd5e1]/30 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-full bg-[#00685f] text-white font-bold text-xs">
                        {ver.version}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#0b1c30]">{ver.changeSummary}</span>
                        <span className="text-[0.65rem] text-[#64748b]">
                          Uploaded by {ver.uploadedBy} on {ver.uploadedAt} • {ver.fileSize}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onShowToast(`Restored version ${ver.version}`)}
                      className="px-3 py-1 rounded-full bg-white text-[#00685f] border border-[#00685f]/30 hover:bg-[#00685f] hover:text-white transition-colors cursor-pointer text-xs"
                    >
                      Compare / Restore
                    </button>
                  </div>
                ))}
              </div>

              {/* Check-In New Version Form */}
              <div className="p-4 rounded-2xl bg-white border border-[#cbd5e1]/40 space-y-3 mt-4">
                <span className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#00685f]">upload_file</span>
                  Check-In New Minor/Major Version
                </span>
                <input
                  type="text"
                  value={checkInSummary}
                  onChange={(e) => setCheckInSummary(e.target.value)}
                  placeholder="Describe version changes (e.g. Updated Zakat formula or Appendix B)..."
                  className="w-full bg-[#eff4ff] px-3.5 py-2 rounded-xl text-xs border border-[#cbd5e1]/30 focus:outline-none focus:ring-2 focus:ring-[#00685f]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (checkInSummary) {
                      onCheckInNewVersion(document.id, checkInSummary);
                      setCheckInSummary('');
                    }
                  }}
                  className="px-4 py-2 rounded-full bg-[#00685f] text-white text-xs font-semibold hover:bg-[#008378] cursor-pointer"
                >
                  Upload & Check-In New Version
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Temporary Access Grants */}
          {activeTab === 'access' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#eff4ff] border border-[#cbd5e1]/40 space-y-1">
                <span className="text-xs font-bold text-[#00685f] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">timer</span>
                  Issue Temporary Access Grant with Expiry (FR-11)
                </span>
                <p className="text-xs text-[#475569]">
                  Grant temporary read-only access to external auditors or cross-department staff for a specified number of hours.
                </p>
              </div>

              {/* Form */}
              <div className="p-4 rounded-2xl bg-white border border-[#cbd5e1]/40 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#0b1c30] block mb-1">
                      Grantee Name / External Email
                    </label>
                    <input
                      type="text"
                      value={grantUser}
                      onChange={(e) => setGrantUser(e.target.value)}
                      placeholder="e.g. PwC External Auditor 03"
                      className="w-full bg-[#eff4ff] px-3.5 py-2 rounded-xl text-xs border border-[#cbd5e1]/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#0b1c30] block mb-1">
                      Access Duration (Hours)
                    </label>
                    <input
                      type="number"
                      value={grantHours}
                      onChange={(e) => setGrantHours(Number(e.target.value))}
                      className="w-full bg-[#eff4ff] px-3.5 py-2 rounded-xl text-xs border border-[#cbd5e1]/30 focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (grantUser) {
                      onGrantTemporaryAccess(document.id, grantUser, grantHours);
                      setGrantUser('');
                    }
                  }}
                  className="px-4 py-2 rounded-full bg-[#00685f] text-white text-xs font-semibold hover:bg-[#008378] cursor-pointer"
                >
                  Issue Temporary Grant
                </button>
              </div>

              {/* Existing Grants List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#0b1c30]">Active Grants:</span>
                {document.temporaryGrants && document.temporaryGrants.length > 0 ? (
                  document.temporaryGrants.map((g, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#eff4ff] border border-[#cbd5e1]/30 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-[#0b1c30]">{g.grantedTo}</span>
                        <span className="text-[0.65rem] text-[#64748b] block">
                          Granted by {g.grantedBy} • Expires at {g.expiresAt}
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#dae2fd] text-[#131b2e] font-bold text-[0.65rem]">
                        ACTIVE
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#64748b]">No active temporary access grants.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
