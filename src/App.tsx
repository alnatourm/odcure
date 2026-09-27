import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DocumentsHub } from './components/DocumentsHub';
import { TasksApprovals } from './components/TasksApprovals';
import { WorkflowBuilder } from './components/WorkflowBuilder';
import { AuditComplianceLedger } from './components/AuditComplianceLedger';
import { ViewerOCRModal } from './components/ViewerOCRModal';
import { StorageSecurityAdmin } from './components/StorageSecurityAdmin';
import { UploadModal } from './components/UploadModal';
import { ReassignModal } from './components/ReassignModal';
import { QuickFindModal } from './components/QuickFindModal';
import { Footer } from './components/Footer';

import {
  INITIAL_DOCUMENTS,
  INITIAL_WORKFLOW_TEMPLATE,
  INITIAL_AUDIT_EVENTS,
  INITIAL_STORAGE_RULES,
  INITIAL_USERS,
} from './data/mockData';

import {
  DocumentItem,
  WorkflowTemplate,
  AuditEvent,
  StorageBackendRule,
  StorageModel,
  AppUser,
} from './types/dcs';

export default function App() {
  // Navigation & Locale State
  const [currentTab, setCurrentTab] = useState<string>('documents');
  const [lang, setLang] = useState<'EN' | 'AR'>('EN');

  // Application Data States
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [workflowTemplate, setWorkflowTemplate] = useState<WorkflowTemplate>(
    INITIAL_WORKFLOW_TEMPLATE
  );
  const [auditEvents, setAuditEventList] = useState<AuditEvent[]>(INITIAL_AUDIT_EVENTS);
  const [storageRules, setStorageRules] = useState<StorageBackendRule[]>(INITIAL_STORAGE_RULES);
  const [currentStorageModel, setCurrentStorageModel] = useState<StorageModel>('Hybrid');

  // User Personas
  const [users] = useState<AppUser[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<AppUser>(INITIAL_USERS[0]); // Sarah Jenkins

  // Modal States
  const [selectedDocForViewer, setSelectedDocForViewer] = useState<DocumentItem | null>(null);
  const [selectedDocForReassign, setSelectedDocForReassign] = useState<DocumentItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isQuickFindOpen, setIsQuickFindOpen] = useState(false);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Helper to record an immutable audit event automatically
  const logAuditEvent = (
    actionType: AuditEvent['actionType'],
    docRef: string,
    docTitle: string,
    details: string,
    rationale: string,
    category: AuditEvent['category']
  ) => {
    const randomHex = Math.random().toString(16).substring(2, 10);
    const newEvent: AuditEvent = {
      id: `EVT-${Math.floor(85000 + Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      ipAddress: '192.168.1.112',
      locationNode: 'Riyadh HQ Gateway',
      documentRef: docRef,
      documentTitle: docTitle,
      actorName: currentUser.name,
      actorRoleAndDept: `${currentUser.role} • ${currentUser.department}`,
      actionType,
      details,
      rationale,
      hashSeal: `${randomHex.substring(0, 4)}...${randomHex.substring(4, 8)}`,
      fullSha256: `${randomHex}${randomHex}${randomHex}${randomHex}${randomHex}${randomHex}${randomHex}${randomHex}`,
      merkleBlockNumber: 498212 + auditEvents.length,
      category,
    };

    setAuditEventList((prev) => [newEvent, ...prev]);
  };

  // Update HTML document direction when language toggles
  useEffect(() => {
    document.documentElement.setAttribute('dir', lang === 'AR' ? 'rtl' : 'ltr');
  }, [lang]);

  // Keyboard shortcut for Quick Find (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsQuickFindOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleOpenUpload = () => setIsUploadModalOpen(true);

  const handleDocumentCreated = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setIsUploadModalOpen(false);
    showToast(`Document ${newDoc.id} created and ingested into workflow.`);
    logAuditEvent(
      'UPLOADED',
      newDoc.id,
      newDoc.title,
      `New document created with classification ${newDoc.classification} and routed to ${newDoc.storageModel} storage.`,
      'Initial document submission and automated workflow start.',
      'DOC'
    );
  };

  const handleSelectDocument = (doc: DocumentItem) => {
    // Check clearance
    if (doc.classification === 'Restricted' && currentUser.clearanceLevel !== 'Restricted') {
      showToast(`ACCESS DENIED (FR-13): You do not have clearance for Restricted documents.`);
      logAuditEvent(
        'ACCESS_DENIED',
        doc.id,
        doc.title,
        `Denied view access to restricted document for user ${currentUser.name}.`,
        'Insufficient security clearance level (Policy FR-13).',
        'SECURITY'
      );
      return;
    }

    setSelectedDocForViewer(doc);
    logAuditEvent(
      'VIEW_DOWNLOAD',
      doc.id,
      doc.title,
      `Rendered vector browser preview with dynamic watermark.`,
      `User ${currentUser.name} opened document viewer.`,
      'DOC'
    );
  };

  const handleDownloadDocument = async (doc: DocumentItem) => {
    try {
      const res = await fetch(`/api/documents/${doc.id}/download-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          storageModel: doc.storageModel,
        }),
      });
      const data = await res.json();
      
      // Trigger actual browser download
      const downloadUrl = `${data.shortLivedUrl || `/api/documents/download?id=${doc.id}`}&id=${doc.id}&title=${encodeURIComponent(doc.title)}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${doc.id}_${doc.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(`Downloaded ${doc.id}! Saved to your computer's Downloads folder.`);
      logAuditEvent(
        'VIEW_DOWNLOAD',
        doc.id,
        doc.title,
        `Downloaded secure file package via short-lived token (${data.shortLivedUrl || 'AES-256'}).`,
        `Short-lived link created under FR-47 from ${doc.storageModel} storage backend. File saved to device.`,
        'STORAGE'
      );
    } catch (e) {
      // Fallback browser download
      const blob = new Blob([
        `SANAD (سند) CONTROLLED DOCUMENT RECORD\nReference ID: ${doc.id}\nTitle: ${doc.title}\nVersion: ${doc.version}\nClassification: ${doc.classification}\nDepartment: ${doc.department}\nStatus: ${doc.status}\nStorage: ${doc.storageModel}\nDownloaded By: ${currentUser.name}\nTimestamp: ${new Date().toISOString()}\n\nVerified under Sanad DCS Governance Policies FR-13 & FR-47.`
      ], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${doc.id}_${doc.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`;
      a.click();
      URL.revokeObjectURL(url);

      showToast(`Downloaded ${doc.id}! Saved to your Downloads folder.`);
    }
  };

  const handleApproveAndSign = (doc: DocumentItem) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, status: 'Approved' } : d))
    );
    showToast(`Document ${doc.id} approved & digitally signed!`);
    logAuditEvent(
      'APPROVED',
      doc.id,
      doc.title,
      `Stage approval authorization confirmed with eIDAS digital signature certification.`,
      `Approved by ${currentUser.name} (${currentUser.role}).`,
      'WORKFLOW'
    );
  };

  const handleReassignTask = (doc: DocumentItem) => {
    setSelectedDocForReassign(doc);
  };

  const handleConfirmReassign = (targetUserOrDept: string, reason: string) => {
    if (!selectedDocForReassign) return;

    setDocuments((prev) =>
      prev.map((d) =>
        d.id === selectedDocForReassign.id
          ? {
              ...d,
              currentAssigneeName: targetUserOrDept,
              currentAssigneeRoleAndDept: targetUserOrDept,
            }
          : d
      )
    );

    showToast(`Task ${selectedDocForReassign.id} re-assigned to ${targetUserOrDept}`);
    logAuditEvent(
      'RE_ASSIGNED',
      selectedDocForReassign.id,
      selectedDocForReassign.title,
      `Re-assigned task from ${selectedDocForReassign.currentAssigneeName} to ${targetUserOrDept}.`,
      `FR-15 Rationale: ${reason}`,
      'REASSIGN'
    );

    setSelectedDocForReassign(null);
  };

  const handleBulkApprove = (selectedIds: string[]) => {
    setDocuments((prev) =>
      prev.map((d) => (selectedIds.includes(d.id) ? { ...d, status: 'Approved' } : d))
    );
    showToast(`Bulk approved ${selectedIds.length} documents.`);
    selectedIds.forEach((id) => {
      logAuditEvent(
        'APPROVED',
        id,
        `Bulk Approval Task`,
        `Bulk stage authorization executed for ${id}.`,
        'Bulk sign-off action executed by Document Controller.',
        'WORKFLOW'
      );
    });
  };

  const handleGrantTemporaryAccess = (docId: string, grantedTo: string, hours: number) => {
    const expiresAt = new Date(Date.now() + hours * 3600 * 1000)
      .toISOString()
      .replace('T', ' ')
      .substring(0, 19) + ' UTC';

    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? {
              ...d,
              temporaryGrants: [
                ...(d.temporaryGrants || []),
                { grantedTo, expiresAt, grantedBy: currentUser.name },
              ],
            }
          : d
      )
    );

    showToast(`Granted temporary access for ${grantedTo} (${hours}h)`);
    logAuditEvent(
      'TEMP_GRANT_ACTIVE',
      docId,
      'Temporary Access Grant',
      `Issued time-bound read clearance to ${grantedTo} valid for ${hours} hours.`,
      `Granted by ${currentUser.name} under Policy FR-11.`,
      'SECURITY'
    );
  };

  const handleCheckInNewVersion = (docId: string, summary: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id !== docId) return d;
        const newMinor = d.minorVersion + 1;
        const newVersionStr = `v${d.majorVersion}.${newMinor}`;
        return {
          ...d,
          version: newVersionStr,
          minorVersion: newMinor,
          updatedDate: 'Just now',
          versionHistory: [
            {
              version: newVersionStr,
              major: d.majorVersion,
              minor: newMinor,
              uploadedBy: currentUser.name,
              uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
              changeSummary: summary,
              fileSize: d.fileSize,
              storageBackend: d.storageLocationDetails,
            },
            ...d.versionHistory,
          ],
        };
      })
    );

    showToast(`New version checked in for ${docId}`);
    logAuditEvent(
      'METADATA_EDITED',
      docId,
      'New Version Check-In',
      `Checked in new minor version with summary: ${summary}`,
      'Document version increment under FR-02.',
      'DOC'
    );
  };

  const handleSoftDelete = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    showToast(`Document ${docId} soft-deleted and moved to recovery vault (FR-05)`);
    logAuditEvent(
      'METADATA_EDITED',
      docId,
      'Soft Delete Action',
      `Soft-deleted document ${docId}. Retention recovery enabled.`,
      'Document removal requested by authorized controller (FR-05).',
      'DOC'
    );
  };

  const handleExportCsv = () => {
    showToast('CSV Audit Ledger exported successfully (FR-35)');
  };

  const handleExportPdf = () => {
    showToast('Formal PDF Compliance Report generated and downloaded (FR-35)');
  };

  const handleValidateChain = () => {
    showToast('Merkle Chain Validation Complete: 84,920 blocks verified with 0 anomalies.');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#00685f]/20 selection:text-[#00685f]">
      <div className="w-full flex-grow">
        {/* Header Component */}
        <Header
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          lang={lang}
          setLang={setLang}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          users={users}
          onOpenQuickFind={() => setIsQuickFindOpen(true)}
          pendingTasksCount={documents.filter((d) => d.status === 'Pending Approval').length}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
          {currentTab === 'documents' && (
            <DocumentsHub
              documents={documents}
              lang={lang}
              currentUser={currentUser}
              onOpenUpload={handleOpenUpload}
              onSelectDocument={handleSelectDocument}
              onReassignDocument={handleReassignTask}
              onDownloadDocument={handleDownloadDocument}
              onSoftDeleteDocument={handleSoftDelete}
              onExportSummary={() => showToast('Summary report exported as CSV')}
            />
          )}

          {currentTab === 'tasks' && (
            <TasksApprovals
              documents={documents}
              lang={lang}
              currentUser={currentUser}
              onApproveAndSign={handleApproveAndSign}
              onReviewDocument={handleSelectDocument}
              onRequestRevision={(doc) =>
                showToast(`Requested revision for ${doc.id}. Returned to author.`)
              }
              onReassignTask={handleReassignTask}
              onBulkApprove={handleBulkApprove}
              onBulkReassign={(selectedIds) => {
                if (selectedIds.length > 0) {
                  const targetDoc = documents.find((d) => selectedIds.includes(d.id));
                  if (targetDoc) setSelectedDocForReassign(targetDoc);
                }
              }}
            />
          )}

          {currentTab === 'workflow' && (
            <WorkflowBuilder
              template={workflowTemplate}
              lang={lang}
              onSaveTemplate={(updated) => {
                setWorkflowTemplate(updated);
                showToast('Workflow Template v2.4 saved successfully!');
              }}
              onCloneTemplate={() => showToast('Cloned workflow template as v2.5-draft')}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'viewer' && (
            <div className="bg-white rounded-3xl p-8 border border-[#cbd5e1]/30 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#cbd5e1]/20 pb-4">
                <h2 className="text-xl font-bold text-[#0b1c30]">
                  Document Viewer & OCR Inspector Demo
                </h2>
                <span className="text-xs text-[#64748b]">Select any document to launch viewer</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => handleSelectDocument(doc)}
                    className="p-4 rounded-2xl bg-[#eff4ff]/60 hover:bg-[#eff4ff] border border-[#cbd5e1]/30 cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div>
                      <h3 className="font-bold text-sm text-[#0b1c30]">{doc.title}</h3>
                      <p className="text-xs text-[#64748b]">
                        {doc.id} • Classification: {doc.classification}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-[#00685f]">
                      visibility
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentTab === 'storage' && (
            <StorageSecurityAdmin
              currentStorageModel={currentStorageModel}
              setCurrentStorageModel={setCurrentStorageModel}
              storageRules={storageRules}
              onUpdateRule={(id, updated) => {
                setStorageRules((prev) =>
                  prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
                );
                showToast('Storage abstraction rule updated successfully (FR-42)');
              }}
              users={users}
              lang={lang}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'audit' && (
            <AuditComplianceLedger
              events={auditEvents}
              lang={lang}
              onValidateChain={handleValidateChain}
              onExportCsv={handleExportCsv}
              onExportPdf={handleExportPdf}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {selectedDocForViewer && (
        <ViewerOCRModal
          document={selectedDocForViewer}
          currentUser={currentUser}
          lang={lang}
          onClose={() => setSelectedDocForViewer(null)}
          onDownloadToken={handleDownloadDocument}
          onGrantTemporaryAccess={handleGrantTemporaryAccess}
          onCheckInNewVersion={handleCheckInNewVersion}
          onShowToast={showToast}
        />
      )}

      {isUploadModalOpen && (
        <UploadModal
          currentUser={currentUser}
          lang={lang}
          onClose={() => setIsUploadModalOpen(false)}
          onDocumentCreated={handleDocumentCreated}
          onShowToast={showToast}
        />
      )}

      {selectedDocForReassign && (
        <ReassignModal
          document={selectedDocForReassign}
          users={users}
          onClose={() => setSelectedDocForReassign(null)}
          onConfirmReassign={handleConfirmReassign}
        />
      )}

      {isQuickFindOpen && (
        <QuickFindModal
          documents={documents}
          auditEvents={auditEvents}
          onClose={() => setIsQuickFindOpen(false)}
          onSelectDocument={handleSelectDocument}
        />
      )}

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0b1c30] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold animate-bounce border border-[#00685f]/50">
          <span className="material-symbols-outlined text-[#71f8e4] text-lg">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
