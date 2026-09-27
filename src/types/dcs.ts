/**
 * Sanad Document Control System (DCS) - TypeScript Types
 * Compliant with BRD Version 1.1
 */

export type ClassificationLevel = 'Public' | 'Internal' | 'Confidential' | 'Restricted';

export type DocumentStatus = 'Draft' | 'In Review' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Returned';

export type StorageModel = 'Local' | 'Cloud' | 'Hybrid';

export interface WorkflowStageExecution {
  stageNumber: number;
  stageName: string;
  stageNameAr: string;
  assignedRole: string;
  assignedUser?: string;
  status: 'Completed' | 'Current' | 'Upcoming' | 'Skipped';
  approverName?: string;
  actionTaken?: 'Approved' | 'Rejected' | 'Requested Changes' | 'Re-assigned';
  completedTimestamp?: string;
  comment?: string;
  slaHours?: number;
  dueCountdownText?: string;
}

export interface DocumentVersion {
  version: string;
  major: number;
  minor: number;
  uploadedBy: string;
  uploadedAt: string;
  changeSummary: string;
  fileSize: string;
  storageBackend: string;
  fileUrl?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  version: string;
  majorVersion: number;
  minorVersion: number;
  department: string;
  departmentAr: string;
  documentType: string;
  classification: ClassificationLevel;
  status: DocumentStatus;
  storageModel: StorageModel;
  storageLocationDetails: string;
  encryptionKeyId: string;
  fileSize: string;
  fileFormat: 'pdf' | 'xlsx' | 'docx' | 'png';
  ownerName: string;
  ownerRoleAndDept: string;
  currentAssigneeName: string;
  currentAssigneeRoleAndDept: string;
  assignedDepartment: string;
  createdDate: string;
  updatedDate: string;
  dueDate?: string;
  isUrgent?: boolean;
  urgentTimerText?: string;
  ocrExtractedText?: string;
  metadataFields: Record<string, string>;
  workflowId?: string;
  currentWorkflowStageIndex: number;
  workflowChain: WorkflowStageExecution[];
  versionHistory: DocumentVersion[];
  downloadRestrictions?: {
    preventDownload?: boolean;
    preventPrint?: boolean;
    watermarkText?: string;
  };
  temporaryGrants?: {
    grantedTo: string;
    expiresAt: string;
    grantedBy: string;
  }[];
}

export interface WorkflowNodeConfig {
  id: string;
  stageNumber: number;
  stageType: 'TRIGGER' | 'SERIAL' | 'PARALLEL' | 'CONDITIONAL' | 'TERMINAL';
  name: string;
  nameAr: string;
  subtitle: string;
  subtitleAr: string;
  assignedRole: string;
  slaHours: number;
  reminderHours: number;
  allowDelegation: boolean;
  allowedActions: ('Approve' | 'Reject' | 'Request Changes' | 'Re-assign')[];
  escalationTarget: string;
  conditionalExpression?: string;
  entryStatus: string;
  passStatus: string;
  rejectStatus: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  nameAr: string;
  version: string;
  targetScope: string;
  topology: string;
  maxSlaHours: number;
  isAuditEnforced: boolean;
  nodes: WorkflowNodeConfig[];
}

export type AuditCategory = 'ALL' | 'DOC' | 'WORKFLOW' | 'REASSIGN' | 'STORAGE' | 'SECURITY';

export interface AuditEvent {
  id: string;
  timestamp: string;
  ipAddress: string;
  locationNode: string;
  documentRef: string;
  documentTitle: string;
  actorName: string;
  actorRoleAndDept: string;
  actionType: 'ACCESS_DENIED' | 'STORAGE_MIGRATED' | 'RE_ASSIGNED' | 'APPROVED' | 'VIEW_DOWNLOAD' | 'TEMP_GRANT_ACTIVE' | 'METADATA_EDITED' | 'UPLOADED';
  details: string;
  rationale: string;
  hashSeal: string;
  fullSha256: string;
  merkleBlockNumber: number;
  category: AuditCategory;
}

export interface StorageBackendRule {
  id: string;
  classificationOrType: string;
  targetModel: StorageModel;
  backendName: string;
  encryptionStandard: string;
  isCustomerManagedKey: boolean;
  notes: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'System Administrator' | 'Document Controller' | 'Department Head' | 'Approver' | 'Contributor' | 'Viewer' | 'Restricted Viewer';
  department: string;
  clearanceLevel: ClassificationLevel;
  avatarUrl?: string;
}
