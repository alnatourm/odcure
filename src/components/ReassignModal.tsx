import React, { useState } from 'react';
import { DocumentItem, AppUser } from '../types/dcs';

interface ReassignModalProps {
  document: DocumentItem | null;
  users: AppUser[];
  onClose: () => void;
  onConfirmReassign: (targetUserOrDept: string, reason: string) => void;
}

export const ReassignModal: React.FC<ReassignModalProps> = ({
  document,
  users,
  onClose,
  onConfirmReassign,
}) => {
  const [targetDepartment, setDepartment] = useState('Finance');
  const [targetUser, setTargetUser] = useState('Dr. Ziyad Al-Husseini');
  const [reason, setReason] = useState('Transferred for executive budget clearance (FR-15 protocol).');

  if (!document) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onConfirmReassign(`${targetUser} (${targetDepartment})`, reason);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-[#cbd5e1]/40">
        <div className="flex items-center justify-between border-b border-[#cbd5e1]/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00685f]">swap_horiz</span>
            <h3 className="font-bold text-base text-[#0b1c30]">
              Re-assign Document / Task (FR-15)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#64748b] hover:text-[#0b1c30]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-3 rounded-xl bg-[#eff4ff] text-xs text-[#0b1c30] space-y-1 border border-[#cbd5e1]/30">
          <span className="font-bold block">Document Reference:</span>
          <p>{document.id} - {document.title}</p>
          <span className="text-[0.65rem] text-[#64748b] block">
            Current Assignee: {document.currentAssigneeName} ({document.assignedDepartment})
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-[#0b1c30] block mb-1">
              Target Department / القسم المستهدف
            </label>
            <select
              value={targetDepartment}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-[#eff4ff] px-3.5 py-2 rounded-xl border border-[#cbd5e1]/30 font-medium text-[#0b1c30] outline-none"
            >
              <option value="Finance">Finance & Payroll (المالية والرواتب)</option>
              <option value="Legal">Legal & Contracts (الشؤون القانونية)</option>
              <option value="HR">HR Policies (الموارد البشرية)</option>
              <option value="Auditing">Internal Audit (الرقابة المالية)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-[#0b1c30] block mb-1">
              Assign to Specific User / الموظف المستهدف
            </label>
            <select
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
              className="w-full bg-[#eff4ff] px-3.5 py-2 rounded-xl border border-[#cbd5e1]/30 font-medium text-[#0b1c30] outline-none"
            >
              {users.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name} ({u.role} - {u.department})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-[#0b1c30] block mb-1">
              Mandatory Rationale & Reason for Re-assignment (FR-15 Audit Rule)
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide clear business rationale for this re-assignment..."
              className="w-full bg-[#eff4ff] p-3 rounded-xl border border-[#cbd5e1]/30 text-xs text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#00685f]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-[#e2e8f0] text-[#0b1c30] font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#00685f] text-white font-bold hover:bg-[#008378] shadow-xs cursor-pointer"
            >
              Confirm Re-assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
