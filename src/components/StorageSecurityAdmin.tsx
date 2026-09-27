import React, { useState } from 'react';
import { StorageModel, StorageBackendRule, AppUser, ClassificationLevel } from '../types/dcs';

interface StorageSecurityAdminProps {
  currentStorageModel: StorageModel;
  setCurrentStorageModel: (model: StorageModel) => void;
  storageRules: StorageBackendRule[];
  onUpdateRule: (id: string, updated: Partial<StorageBackendRule>) => void;
  users: AppUser[];
  lang: 'EN' | 'AR';
  onShowToast: (msg: string) => void;
}

export const StorageSecurityAdmin: React.FC<StorageSecurityAdminProps> = ({
  currentStorageModel,
  setCurrentStorageModel,
  storageRules,
  onUpdateRule,
  users,
  lang,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'abstraction' | 'rbac' | 'impersonate'>('abstraction');
  const [impersonatedUserId, setImpersonatedUserId] = useState<string>('');

  // RBAC Matrix state simulation
  const [rbacMatrix, setRbacMatrix] = useState<Record<string, Record<ClassificationLevel, boolean>>>({
    'Document Controller': { Public: true, Internal: true, Confidential: true, Restricted: true },
    'Department Head': { Public: true, Internal: true, Confidential: true, Restricted: false },
    'Approver': { Public: true, Internal: true, Confidential: true, Restricted: false },
    'Contributor': { Public: true, Internal: true, Confidential: false, Restricted: false },
    'Viewer': { Public: true, Internal: true, Confidential: false, Restricted: false },
    'Restricted Viewer': { Public: false, Internal: false, Confidential: false, Restricted: true },
  });

  const handleToggleRbac = (role: string, level: ClassificationLevel) => {
    setRbacMatrix((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [level]: !prev[role][level],
      },
    }));
    onShowToast(`Updated RBAC permission for ${role} on ${level} classification`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1 max-w-3xl">
          <div className="flex items-center gap-2 text-[#00685f] text-xs font-semibold uppercase tracking-wider">
            <span className="material-symbols-outlined text-base">dns</span>
            <span>Storage Abstraction Layer • طبقة تجريد التخزين (FR-41 ~ FR-49)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
            Storage & Security Administration{' '}
            <span className="text-[#00685f] font-normal">| إعدادات التخزين والأمان</span>
          </h1>
          <p className="text-sm text-[#475569]">
            Configure Local, Cloud, or Hybrid storage models, KMS key management, and department access control matrix without code changes.
          </p>
        </div>

        {/* Global Active Model Selector */}
        <div className="bg-white p-3 rounded-2xl border border-[#cbd5e1]/40 shadow-xs flex items-center gap-3">
          <span className="text-xs font-bold text-[#0b1c30] whitespace-nowrap">
            Active Storage Model:
          </span>
          <div className="flex items-center gap-1 bg-[#eff4ff] p-1 rounded-full border border-[#cbd5e1]/30">
            {(['Local', 'Cloud', 'Hybrid'] as const).map((model) => (
              <button
                key={model}
                type="button"
                onClick={() => {
                  setCurrentStorageModel(model);
                  onShowToast(`Active Storage Model updated to ${model} (FR-42)`);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  currentStorageModel === model
                    ? 'bg-[#00685f] text-white shadow-xs'
                    : 'text-[#475569] hover:text-[#0b1c30]'
                }`}
              >
                {model}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#cbd5e1]/30 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('abstraction')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'abstraction'
              ? 'bg-white text-[#00685f] border-t border-x border-[#cbd5e1]/30 shadow-xs'
              : 'text-[#475569] hover:text-[#0b1c30]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">cloud_sync</span>
          <span>Storage Abstraction Rules (FR-43)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rbac')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'rbac'
              ? 'bg-white text-[#00685f] border-t border-x border-[#cbd5e1]/30 shadow-xs'
              : 'text-[#475569] hover:text-[#0b1c30]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
          <span>RBAC & Classification Matrix (FR-08)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('impersonate')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'impersonate'
              ? 'bg-white text-[#00685f] border-t border-x border-[#cbd5e1]/30 shadow-xs'
              : 'text-[#475569] hover:text-[#0b1c30]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">switch_account</span>
          <span>Admin Impersonation Tool (FR-40)</span>
        </button>
      </div>

      {/* TAB 1: Storage Abstraction Rules */}
      {activeTab === 'abstraction' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#eff4ff] border border-[#cbd5e1]/40 flex items-center justify-between text-xs text-[#0b1c30]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00685f]">verified</span>
              <span>
                <strong>Storage Abstraction Principle (FR-49):</strong> Business logic, permissions, and approval workflows remain 100% independent of physical file locations.
              </span>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#00685f]/10 text-[#00685f] font-bold">
              AES-256 / TLS 1.3 Active
            </span>
          </div>

          {/* Rules Table */}
          <div className="bg-white rounded-2xl border border-[#cbd5e1]/30 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#eff4ff] text-[#475569] font-semibold">
                  <th className="py-3 px-4">Classification / Type</th>
                  <th className="py-3 px-4">Mapped Storage Model</th>
                  <th className="py-3 px-4">Backend Destination</th>
                  <th className="py-3 px-4">Encryption & Key Standard</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#cbd5e1]/20">
                {storageRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-[#eff4ff]/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#0b1c30]">
                      {rule.classificationOrType}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={rule.targetModel}
                        onChange={(e) =>
                          onUpdateRule(rule.id, {
                            targetModel: e.target.value as StorageModel,
                          })
                        }
                        className="bg-[#eff4ff] px-2.5 py-1 rounded-lg text-xs font-semibold text-[#00685f] border border-[#cbd5e1]/30 outline-none"
                      >
                        <option value="Local">Local (On-Premise)</option>
                        <option value="Cloud">Cloud (Enterprise S3)</option>
                        <option value="Hybrid">Hybrid (Dual Vault)</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-[#475569]">{rule.backendName}</td>
                    <td className="py-3 px-4 font-mono text-[0.68rem] text-[#00685f]">
                      {rule.encryptionStandard} {rule.isCustomerManagedKey ? '(KMS-Managed)' : ''}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => onShowToast(`Rule updated for ${rule.classificationOrType}`)}
                        className="px-3 py-1 rounded-full bg-[#eff4ff] text-[#00685f] hover:bg-[#00685f] hover:text-white font-semibold transition-colors cursor-pointer"
                      >
                        Save Policy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: RBAC & Classification Matrix */}
      {activeTab === 'rbac' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#eff4ff] border border-[#cbd5e1]/40 text-xs text-[#0b1c30]">
            <span className="font-bold block mb-1">
              Role + Department + Classification Enforcement (FR-08 ~ FR-10)
            </span>
            <span>
              Restricted documents (such as executive salary data) are automatically shielded from un-cleared roles regardless of department membership.
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-[#cbd5e1]/30 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#eff4ff] text-[#475569] font-semibold">
                  <th className="py-3 px-4">User Role</th>
                  {(['Public', 'Internal', 'Confidential', 'Restricted'] as ClassificationLevel[]).map(
                    (level) => (
                      <th key={level} className="py-3 px-4 text-center">
                        {level} Access
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#cbd5e1]/20">
                {Object.entries(rbacMatrix).map(([role, levels]) => (
                  <tr key={role} className="hover:bg-[#eff4ff]/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#0b1c30]">{role}</td>
                    {(['Public', 'Internal', 'Confidential', 'Restricted'] as ClassificationLevel[]).map(
                      (level) => (
                        <td key={level} className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={levels[level]}
                            onChange={() => handleToggleRbac(role, level)}
                            className="w-4 h-4 accent-[#00685f] cursor-pointer"
                          />
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Admin Impersonation Tool */}
      {activeTab === 'impersonate' && (
        <div className="space-y-4 max-w-2xl">
          <div className="p-4 rounded-2xl bg-[#eff4ff] border border-[#cbd5e1]/40 space-y-2 text-xs">
            <span className="font-bold text-[#00685f] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">switch_account</span>
              Support Impersonation Tool with Mandatory Audit Logging (FR-40)
            </span>
            <p className="text-[#475569]">
              Allows System Administrators to temporarily view the system as another user for troubleshooting. Every impersonation session writes an immutable event to the audit ledger.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#cbd5e1]/30 shadow-xs space-y-4 text-xs">
            <div>
              <label className="font-bold text-[#0b1c30] block mb-1">
                Select User Persona to Impersonate:
              </label>
              <select
                value={impersonatedUserId}
                onChange={(e) => setImpersonatedUserId(e.target.value)}
                className="w-full bg-[#eff4ff] px-3.5 py-2 rounded-xl border border-[#cbd5e1]/30 text-xs text-[#0b1c30] outline-none"
              >
                <option value="">Select User Persona...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role} - {u.department})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              disabled={!impersonatedUserId}
              onClick={() => {
                const target = users.find((u) => u.id === impersonatedUserId);
                if (target) {
                  onShowToast(`Impersonating ${target.name} (${target.role}). Audit event EVT-AUDIT-IMP logged.`);
                }
              }}
              className="px-6 py-2.5 rounded-full bg-[#00685f] text-white font-semibold disabled:opacity-50 transition-all cursor-pointer"
            >
              Start Audited Impersonation Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
