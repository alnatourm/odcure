import React, { useState } from 'react';
import { WorkflowTemplate, WorkflowNodeConfig } from '../types/dcs';

interface WorkflowBuilderProps {
  template: WorkflowTemplate;
  lang: 'EN' | 'AR';
  onSaveTemplate: (updated: WorkflowTemplate) => void;
  onCloneTemplate: () => void;
  onShowToast: (msg: string) => void;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  template,
  lang,
  onSaveTemplate,
  onCloneTemplate,
  onShowToast,
}) => {
  const [activeViewMode, setActiveViewMode] = useState<'canvas' | 'directory'>('directory');
  
  // List of Created Enterprise Workflow Templates
  const [templateList, setTemplateList] = useState<WorkflowTemplate[]>([
    template,
    {
      id: 'WF-TMPL-02',
      name: 'Procurement & Supply Chain Vendor Onboarding',
      nameAr: 'سلسلة الإمداد والمشتريات واعتماد الموردين',
      version: 'v1.8',
      targetScope: 'Supply Chain, Vendor Contracts & Invoices',
      topology: '4-Stage Sequential Route',
      maxSlaHours: 72,
      isAuditEnforced: true,
      nodes: [
        {
          id: 'NODE-P1',
          stageNumber: 1,
          stageType: 'SERIAL',
          name: 'Procurement Specialist Initial Audit',
          nameAr: 'تدقيق أخصائي المشتريات المبدئي',
          subtitle: 'Serial Route (SLA: 24 Hours)',
          subtitleAr: 'التحقق من كراسة الشروط والعروض',
          assignedRole: 'Procurement Officer',
          slaHours: 24,
          reminderHours: 12,
          allowDelegation: true,
          allowedActions: ['Approve', 'Reject', 'Request Changes'],
          escalationTarget: 'Procurement Manager',
          entryStatus: 'Vendor File Uploaded',
          passStatus: 'Procurement Cleared',
          rejectStatus: 'Vendor Rejected',
        },
        {
          id: 'NODE-P2',
          stageNumber: 2,
          stageType: 'PARALLEL',
          name: 'Legal & Risk Assessment',
          nameAr: 'الفرع القانوني وتقييم مخاطر العقود',
          subtitle: 'Parallel Route (SLA: 24 Hours)',
          subtitleAr: 'مراجعة بنود التعاقد والضمانات',
          assignedRole: 'Legal Counsel',
          slaHours: 24,
          reminderHours: 12,
          allowDelegation: true,
          allowedActions: ['Approve', 'Reject', 'Request Changes'],
          escalationTarget: 'General Counsel',
          entryStatus: 'Under Legal Review',
          passStatus: 'Legal Approved',
          rejectStatus: 'Legal Objection',
        },
        {
          id: 'NODE-P3',
          stageNumber: 3,
          stageType: 'SERIAL',
          name: 'CFO Budget & Payment Authorization',
          nameAr: 'اعتماد الموازنة والدفع من المدير المالي',
          subtitle: 'Serial Route (SLA: 24 Hours)',
          subtitleAr: 'الموافقة على الصرف والارتباط المالي',
          assignedRole: 'Chief Financial Officer',
          slaHours: 24,
          reminderHours: 12,
          allowDelegation: false,
          allowedActions: ['Approve', 'Reject', 'Re-assign'],
          escalationTarget: 'Finance Controller',
          entryStatus: 'Pending CFO Approval',
          passStatus: 'Payment Authorized',
          rejectStatus: 'Budget Rejected',
        },
      ],
    },
    {
      id: 'WF-TMPL-03',
      name: 'HR Policies & Staffing Clearance Fast-Track',
      nameAr: 'الموارد البشرية وسياسات التوظيف السريع',
      version: 'v3.1',
      targetScope: 'HR Policies, Payroll Adjustments & Staffing',
      topology: '3-Stage Fast-Track',
      maxSlaHours: 48,
      isAuditEnforced: true,
      nodes: [
        {
          id: 'NODE-H1',
          stageNumber: 1,
          stageType: 'SERIAL',
          name: 'HR Operations Verification',
          nameAr: 'التحقق من عمليات الموارد البشرية',
          subtitle: 'SLA: 12 Hours',
          subtitleAr: 'مراجعة بيانات الموظف والدرجة الوظيفية',
          assignedRole: 'HR Operations Officer',
          slaHours: 12,
          reminderHours: 6,
          allowDelegation: true,
          allowedActions: ['Approve', 'Reject'],
          escalationTarget: 'HR Director',
          entryStatus: 'HR File Created',
          passStatus: 'HR Verified',
          rejectStatus: 'HR Rejected',
        },
        {
          id: 'NODE-H2',
          stageNumber: 2,
          stageType: 'SERIAL',
          name: 'Department Manager Authorization',
          nameAr: 'اعتماد مدير القسم المعني',
          subtitle: 'SLA: 24 Hours',
          subtitleAr: 'موافقة رئيس القسم المباشر',
          assignedRole: 'Department Head',
          slaHours: 24,
          reminderHours: 12,
          allowDelegation: true,
          allowedActions: ['Approve', 'Reject', 'Request Changes'],
          escalationTarget: 'VP Operations',
          entryStatus: 'Pending Manager Sign-off',
          passStatus: 'Manager Signed',
          rejectStatus: 'Declined by Dept Head',
        },
      ],
    },
    {
      id: 'WF-TMPL-04',
      name: 'IT Infrastructure & Cybersecurity Clearance',
      nameAr: 'الأمن السايبراني والبنية التحتية والوصول للمشاريع',
      version: 'v2.0',
      targetScope: 'IT Logs, KMS Key Requests & Infrastructure',
      topology: '4-Stage SecOps Gate',
      maxSlaHours: 24,
      isAuditEnforced: true,
      nodes: [
        {
          id: 'NODE-S1',
          stageNumber: 1,
          stageType: 'CONDITIONAL',
          name: 'Automated SecOps Risk Scanning',
          nameAr: 'الفحص السايبراني الآلي وتقييم المخاطر',
          subtitle: 'Conditional Rule Gate',
          subtitleAr: 'التحقق من تشفير البيانات والصلاحيات',
          assignedRole: 'Automated SecOps Engine',
          slaHours: 1,
          reminderHours: 0,
          allowDelegation: false,
          allowedActions: ['Approve'],
          escalationTarget: 'CISO',
          entryStatus: 'Scanning Code/Doc',
          passStatus: 'SecOps Clean',
          rejectStatus: 'Security Threat Blocked',
        },
      ],
    },
    {
      id: 'WF-TMPL-05',
      name: 'High-Value CAPEX Capital Project Matrix (> $100K)',
      nameAr: 'المشاريع الهندسية والرأسمالية الكبرى (أكثر من 100 ألف دولار)',
      version: 'v1.0 (Draft)',
      targetScope: 'CAPEX Investments, Engineering & Capital Projects',
      topology: '6-Stage Board Governance',
      maxSlaHours: 120,
      isAuditEnforced: true,
      nodes: [
        {
          id: 'NODE-C1',
          stageNumber: 1,
          stageType: 'SERIAL',
          name: 'Engineering Director Feasibility Approval',
          nameAr: 'موافقة مدير الهندسة والجدوى الاقتصادية',
          subtitle: 'SLA: 48 Hours',
          subtitleAr: 'دراسة الجدوى والتصاميم الهندسية',
          assignedRole: 'Engineering Director',
          slaHours: 48,
          reminderHours: 24,
          allowDelegation: false,
          allowedActions: ['Approve', 'Reject', 'Request Changes'],
          escalationTarget: 'CEO',
          entryStatus: 'CAPEX Proposal Lodged',
          passStatus: 'Engineering Endorsed',
          rejectStatus: 'CAPEX Rejected',
        },
      ],
    },
  ]);

  const [activeTemplateId, setActiveTemplateId] = useState<string>(template.id);
  const currentActiveTemplate = templateList.find((t) => t.id === activeTemplateId) || template;

  const [selectedNodeId, setSelectedNodeId] = useState<string>('NODE-03');
  const [nodes, setNodes] = useState<WorkflowNodeConfig[]>(currentActiveTemplate.nodes);

  // Sync nodes when active template changes
  const handleSelectTemplate = (t: WorkflowTemplate, openCanvas: boolean = false) => {
    setActiveTemplateId(t.id);
    setNodes(t.nodes || []);
    if (t.nodes && t.nodes.length > 0) {
      setSelectedNodeId(t.nodes[0].id);
    }
    if (openCanvas) {
      setActiveViewMode('canvas');
    }
    onSaveTemplate(t);
    onShowToast(
      lang === 'AR'
        ? openCanvas
          ? `تم فتح المخطط التفاعلي للقالب: ${t.nameAr}`
          : `تم اختيار وعرض تفاصيل القالب: ${t.nameAr}`
        : openCanvas
          ? `Opened Interactive Canvas for: ${t.name}`
          : `Selected Template: ${t.name}`
    );
  };

  const handleCreateNewTemplate = () => {
    const newId = `WF-TMPL-0${templateList.length + 1}`;
    const newTmpl: WorkflowTemplate = {
      id: newId,
      name: `Custom Enterprise Workflow ${newId}`,
      nameAr: `مسار عمل خاص جديد ${newId}`,
      version: 'v1.0',
      targetScope: 'General Department Operations',
      topology: '3-Stage Serial Mesh',
      maxSlaHours: 48,
      isAuditEnforced: true,
      nodes: template.nodes,
    };
    setTemplateList((prev) => [newTmpl, ...prev]);
    handleSelectTemplate(newTmpl, false);
    onShowToast(
      lang === 'AR'
        ? `تم إنشاء قالب مسار عمل جديد (${newId})`
        : `New workflow template created (${newId})!`
    );
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const updateSelectedNode = (field: keyof WorkflowNodeConfig, value: any) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === selectedNodeId ? { ...node, [field]: value } : node))
    );
  };

  const handleApplyStage = () => {
    const updated = { ...currentActiveTemplate, nodes };
    onSaveTemplate(updated);
    setTemplateList((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
    onShowToast(`Configuration updated for ${selectedNode.name}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header & Action Bar */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col max-w-3xl space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#e2e8f0] text-[#00685f] font-semibold text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00685f] animate-pulse"></span>
              Enterprise Governance • الحوكمة المؤسسية
            </span>
            <span className="text-[#64748b] text-xs">•</span>
            <span className="text-[#475569] text-xs font-medium">FR-14 ~ FR-25 Compliant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
            Workflow Template Builder{' '}
            <span className="font-normal text-[#475569]">| منشئ قوالب مسارات العمل</span>
          </h1>
          <p className="text-sm text-[#475569] leading-relaxed">
            Design, configure, and version multi-stage serial, parallel, and conditional approval
            paths with automated status escalations and SLA timers. تصميم وضبط مسارات الموافقة
            المتسلسلة والمتوازية والشرطية.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center gap-2 bg-[#eff4ff] px-3 py-1.5 rounded-full border border-[#cbd5e1]/40 text-xs">
            <span className="material-symbols-outlined text-[#00685f] text-base">verified</span>
            <span className="font-semibold text-[#0b1c30]">
              Active Template: {currentActiveTemplate.id} ({currentActiveTemplate.version})
            </span>
          </div>

          <button
            type="button"
            onClick={onCloneTemplate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#0b1c30] hover:bg-[#eff4ff] border border-[#cbd5e1]/40 shadow-xs transition-all text-xs font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">content_copy</span>
            <span>Clone | نسخ</span>
          </button>

          <button
            type="button"
            onClick={handleApplyStage}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#0b1c30] hover:bg-[#eff4ff] border border-[#cbd5e1]/40 shadow-xs transition-all text-xs font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">save</span>
            <span>Save Changes | حفظ التغييرات</span>
          </button>

          <button
            type="button"
            onClick={handleCreateNewTemplate}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#00685f] text-white hover:bg-[#008378] shadow-sm transition-all text-xs font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>+ New Template | قالب جديد</span>
          </button>
        </div>
      </section>

      {/* View Switcher Bar */}
      <section className="bg-white rounded-2xl p-2.5 border border-[#cbd5e1]/30 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveViewMode('directory')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeViewMode === 'directory'
                ? 'bg-[#00685f] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#475569] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-base">format_list_bulleted</span>
            <span>Created Workflow Templates ({templateList.length}) | قائمة القوالب المعتمدة</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewMode('canvas')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeViewMode === 'canvas'
                ? 'bg-[#00685f] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#475569] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-base">account_tree</span>
            <span>Visual Graph Canvas Builder | منشئ المسار التفاعلي</span>
          </button>
        </div>

        <div className="text-xs text-[#64748b] font-medium hidden md:block">
          Editing: <span className="font-bold text-[#00685f]">{currentActiveTemplate.name}</span>
        </div>
      </section>

      {/* Created Workflow Templates Directory Table */}
      {activeViewMode === 'directory' && (
        <section className="bg-white rounded-2xl p-6 border border-[#cbd5e1]/30 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#cbd5e1]/30 pb-4">
            <div>
              <h2 className="font-extrabold text-base text-[#0b1c30] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00685f]">folder_managed</span>
                <span>Active Created Enterprise Workflow Templates</span>
              </h2>
              <p className="text-xs text-[#64748b]">
                قائمة قوالب مسارات العمل المعتمدة ومسارات الاعتماد التلقائية للأقسام
              </p>
            </div>

            <button
              type="button"
              onClick={handleCreateNewTemplate}
              className="px-4 py-2 rounded-xl bg-[#00685f] hover:bg-[#00524b] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Create Workflow Template</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templateList.map((t) => {
              const isSelected = t.id === activeTemplateId;
              return (
                <div
                  key={t.id}
                  onClick={() => handleSelectTemplate(t, false)}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 cursor-pointer hover:shadow-md ${
                    isSelected
                      ? 'bg-[#00685f]/5 border-[#00685f] ring-2 ring-[#00685f]'
                      : 'bg-white hover:bg-[#eff4ff]/60 border-[#cbd5e1]/40'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.65rem] font-mono font-bold bg-[#eff4ff] text-[#00685f] px-2 py-0.5 rounded-md border border-[#cbd5e1]/30">
                        {t.id} • {t.version}
                      </span>
                      {isSelected ? (
                        <span className="text-[0.65rem] bg-[#00685f] text-white px-2 py-0.5 rounded-full font-bold">
                          SELECTED
                        </span>
                      ) : (
                        <span className="text-[0.65rem] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-[#0b1c30] leading-snug">{t.name}</h3>
                      <p className="text-xs text-[#64748b] pt-0.5">{t.nameAr}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#eff4ff]/60 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[#475569]">
                        <span>Scope:</span>
                        <span className="font-semibold text-[#0b1c30] truncate max-w-[180px]">
                          {t.targetScope}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[#475569]">
                        <span>Topology & Stages:</span>
                        <span className="font-semibold text-[#00685f]">
                          {t.nodes.length} Stages • {t.topology}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[#475569]">
                        <span>Max SLA Deadline:</span>
                        <span className="font-semibold text-[#0b1c30]">{t.maxSlaHours} Hours</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#cbd5e1]/30 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTemplate(t, true);
                      }}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#00685f] text-white shadow-xs'
                          : 'bg-[#00685f]/10 hover:bg-[#00685f] hover:text-white text-[#00685f]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">account_tree</span>
                      <span>
                        {isSelected
                          ? lang === 'AR'
                            ? 'فتح المخطط والتعديل'
                            : 'Open Canvas to Edit'
                          : lang === 'AR'
                          ? 'عرض البيانات وفتح المخطط'
                          : 'Select & Open Canvas'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Template Stage Overview Panel */}
          <div className="mt-6 p-5 rounded-2xl bg-[#eff4ff]/50 border border-[#cbd5e1]/50 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#cbd5e1]/30 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00685f] text-white flex items-center justify-center font-bold shadow-xs">
                  <span className="material-symbols-outlined text-xl">folder_special</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#00685f] bg-white px-2 py-0.5 rounded border border-[#cbd5e1]/30">
                      {currentActiveTemplate.id}
                    </span>
                    <span className="text-xs font-bold text-[#475569]">
                      {currentActiveTemplate.version}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-[#0b1c30]">
                    {currentActiveTemplate.name}
                  </h3>
                  <p className="text-xs text-[#64748b]">{currentActiveTemplate.nameAr}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectTemplate(currentActiveTemplate, true)}
                className="px-5 py-2.5 rounded-xl bg-[#00685f] hover:bg-[#00524b] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-base">account_tree</span>
                <span>
                  {lang === 'AR'
                    ? 'فتح المخطط التفاعلي للقالب المختار'
                    : 'Open Canvas for Selected Template'}
                </span>
              </button>
            </div>

            {/* Stages Sequence Cards Preview */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#0b1c30] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#00685f]">conversion_path</span>
                <span>Pipeline Stage Overview ({currentActiveTemplate.nodes.length} Stages)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
                {currentActiveTemplate.nodes.map((node, idx) => (
                  <div
                    key={node.id}
                    className="p-3 rounded-xl bg-white border border-[#cbd5e1]/40 shadow-2xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[0.65rem] font-mono font-bold text-[#00685f] bg-[#eff4ff] px-1.5 py-0.5 rounded">
                        Stage {idx + 1}
                      </span>
                      <span className="text-[0.65rem] font-bold text-[#475569]">{node.slaHours}h SLA</span>
                    </div>
                    <div className="font-bold text-xs text-[#0b1c30] line-clamp-1">{node.name}</div>
                    <div className="text-[0.65rem] text-[#64748b] line-clamp-1">{node.assignedRole || node.subtitle}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Template Meta Card & Quick Stats Bar */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#cbd5e1]/30 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[0.7rem] uppercase text-[#64748b] font-medium">
              Target Document Scope
            </span>
            <span className="text-base font-bold text-[#0b1c30]">{currentActiveTemplate.targetScope}</span>
            <span className="text-[0.65rem] text-[#64748b]">عقود واتفاقيات المجموعة</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#00685f]">
            <span className="material-symbols-outlined">description</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#cbd5e1]/30 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[0.7rem] uppercase text-[#64748b] font-medium">
              Workflow Topology
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-base font-bold text-[#0b1c30]">{currentActiveTemplate.topology}</span>
              <span className="text-[0.65rem] bg-[#71f8e4] text-[#00201c] px-2 py-0.5 rounded-full font-bold">
                {currentActiveTemplate.nodes.length} Stages
              </span>
            </div>
            <span className="text-[0.65rem] text-[#64748b]">متوازي + تسلسلي مشروط</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#00685f]">
            <span className="material-symbols-outlined">account_tree</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#cbd5e1]/30 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[0.7rem] uppercase text-[#64748b] font-medium">
              Max Cumulative SLA
            </span>
            <span className="text-base font-bold text-[#0b1c30]">{currentActiveTemplate.maxSlaHours} Hours</span>
            <span className="text-[0.65rem] text-[#64748b]">
              الحد الأقصى للإنجاز: {Math.round(currentActiveTemplate.maxSlaHours / 24)} أيام عمل
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#00685f]">
            <span className="material-symbols-outlined">timer</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#cbd5e1]/30 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[0.7rem] uppercase text-[#64748b] font-medium">
              Audit Enforced (FR-15)
            </span>
            <div className="flex items-center gap-1.5 text-[#00685f]">
              <span className="material-symbols-outlined text-base">encrypted</span>
              <span className="text-base font-bold text-[#0b1c30]">Immutable</span>
            </div>
            <span className="text-[0.65rem] text-[#64748b]">تسجيل رقمي وتفويض مؤمّن</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#00685f]">
            <span className="material-symbols-outlined">gavel</span>
          </div>
        </div>
      </section>

      {/* Main Workspace: Interactive Canvas & Stage Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left / Center 8 Cols: Interactive Graph Canvas */}
        <div className="xl:col-span-8 flex flex-col gap-4">
          {/* Canvas Toolbar */}
          <div className="bg-white rounded-2xl p-3 px-5 shadow-xs border border-[#cbd5e1]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0b1c30]">Interactive Graph Canvas</span>
              <span className="text-[#cbd5e1]">•</span>
              <span className="text-xs text-[#64748b]">مخطط المسار التفاعلي</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-1 rounded hover:bg-[#eff4ff] text-[#475569]"
                title="Zoom In"
              >
                <span className="material-symbols-outlined text-base">zoom_in</span>
              </button>
              <button
                type="button"
                className="p-1 rounded hover:bg-[#eff4ff] text-[#475569]"
                title="Zoom Out"
              >
                <span className="material-symbols-outlined text-base">zoom_out</span>
              </button>
              <button
                type="button"
                className="p-1 rounded hover:bg-[#eff4ff] text-[#475569]"
                title="Fit to Screen"
              >
                <span className="material-symbols-outlined text-base">fit_screen</span>
              </button>
              <span className="w-px h-4 bg-[#cbd5e1] mx-1"></span>
              <span className="text-xs text-[#64748b]">Scale: 100%</span>
            </div>
          </div>

          {/* Blueprint Flow Canvas */}
          <div className="relative blueprint-dots bg-[#eff4ff]/60 rounded-3xl p-6 md:p-8 flex flex-col items-center shadow-xs border border-[#cbd5e1]/30">
            {/* STAGE 0: TRIGGER */}
            <div
              onClick={() => setSelectedNodeId('NODE-00')}
              className={`relative z-10 w-full max-w-lg bg-white rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer ${
                selectedNodeId === 'NODE-00' ? 'ring-2 ring-[#00685f]' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00685f]/10 text-[#00685f] flex items-center justify-center">
                    <span className="material-symbols-outlined">upload_file</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-bold text-[#00685f]">
                        Stage 00 • مرحلة البداية
                      </span>
                      <span className="text-[0.65rem] bg-[#e2e8f0] px-2 py-0.5 rounded-full text-[#475569]">
                        Auto-Trigger
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#0b1c30]">
                      Document Ingestion & Classification
                    </h3>
                    <p className="text-[0.68rem] text-[#64748b]">
                      رفع المستند والتعرف التلقائي على التصنيف والقسم
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#64748b]">tune</span>
              </div>
              <div className="mt-2 pt-2 bg-[#eff4ff]/50 rounded-xl p-2 flex flex-wrap items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-[#00685f] font-medium">
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  AI Classification Engine (FR-25)
                </span>
                <div className="flex items-center gap-1">
                  <span className="bg-white px-2 py-0.5 rounded text-[0.65rem] font-medium text-[#0b1c30] border border-[#cbd5e1]/30">
                    Restricted
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded text-[0.65rem] font-medium text-[#0b1c30] border border-[#cbd5e1]/30">
                    Confidential
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded text-[0.65rem] font-medium text-[#0b1c30] border border-[#cbd5e1]/30">
                    Internal
                  </span>
                </div>
              </div>
            </div>

            {/* CONNECTOR */}
            <div className="relative z-10 flex flex-col items-center my-2 text-[#00685f]">
              <div className="w-0.5 h-6 bg-[#00685f]/40"></div>
              <span className="material-symbols-outlined text-base -my-1.5">arrow_drop_down</span>
            </div>

            {/* STAGE 1: SERIAL */}
            <div
              onClick={() => setSelectedNodeId('NODE-01')}
              className={`relative z-10 w-full max-w-lg bg-white rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer ${
                selectedNodeId === 'NODE-01' ? 'ring-2 ring-[#00685f]' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00685f]/10 text-[#00685f] flex items-center justify-center">
                    <span className="material-symbols-outlined">fact_check</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-bold text-[#00685f]">
                        Stage 01 • Serial Route
                      </span>
                      <span className="text-[0.65rem] bg-[#dae2fd] text-[#131b2e] px-2 py-0.5 rounded-full font-semibold">
                        SLA: 24 Hours
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#0b1c30]">
                      Secretary Initial Review & Metadata Check
                    </h3>
                    <p className="text-[0.68rem] text-[#64748b]">
                      مراجعة سكرتارية القسم والتحقق من البيانات الوصفية
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#64748b]">more_vert</span>
              </div>
            </div>

            {/* PARALLEL SPLIT CONNECTOR */}
            <div className="relative z-10 flex flex-col items-center my-2 text-[#00685f] w-full max-w-2xl">
              <div className="w-0.5 h-4 bg-[#00685f]/40"></div>
              <div className="w-3/4 h-0.5 bg-[#00685f]/40 relative">
                <div className="absolute -top-1.5 left-0 w-3 h-3 rounded-full bg-[#00685f]"></div>
                <div className="absolute -top-1.5 right-0 w-3 h-3 rounded-full bg-[#00685f]"></div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#00685f] text-white text-[0.65rem] font-bold shadow-xs">
                  Parallel Split (FR-19) • مسار متوازي
                </div>
              </div>
              <div className="flex justify-between w-3/4">
                <div className="w-0.5 h-6 bg-[#00685f]/40"></div>
                <div className="w-0.5 h-6 bg-[#00685f]/40"></div>
              </div>
            </div>

            {/* STAGE 2: PARALLEL BRANCHES */}
            <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Branch A */}
              <div
                onClick={() => setSelectedNodeId('NODE-02A')}
                className={`bg-white rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer ${
                  selectedNodeId === 'NODE-02A' ? 'ring-2 ring-[#00685f]' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00685f]/10 text-[#00685f] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.65rem] uppercase font-bold text-[#00685f]">
                        Branch A • فرع أ
                      </span>
                      <span className="text-[0.65rem] bg-[#dae2fd] text-[#131b2e] px-2 py-0.5 rounded-full font-semibold">
                        SLA: 36h
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-[#0b1c30] mt-0.5">
                      Financial Verification
                    </h4>
                    <p className="text-[0.65rem] text-[#64748b]">
                      رئيس الحسابات / التحقق المالي
                    </p>
                  </div>
                </div>
              </div>

              {/* Branch B */}
              <div
                onClick={() => setSelectedNodeId('NODE-02B')}
                className={`bg-white rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer ${
                  selectedNodeId === 'NODE-02B' ? 'ring-2 ring-[#00685f]' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00685f]/10 text-[#00685f] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">policy</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.65rem] uppercase font-bold text-[#00685f]">
                        Branch B • فرع ب
                      </span>
                      <span className="text-[0.65rem] bg-[#dae2fd] text-[#131b2e] px-2 py-0.5 rounded-full font-semibold">
                        SLA: 48h
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-[#0b1c30] mt-0.5">
                      Legal Counsel Review
                    </h4>
                    <p className="text-[0.65rem] text-[#64748b]">
                      المستشار القانوني / مراجعة الشروط
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* JOIN & CONDITIONAL GATEWAY CONNECTOR */}
            <div className="relative z-10 flex flex-col items-center my-2 text-[#00685f] w-full max-w-2xl">
              <div className="flex justify-between w-3/4">
                <div className="w-0.5 h-6 bg-[#00685f]/40"></div>
                <div className="w-0.5 h-6 bg-[#00685f]/40"></div>
              </div>
              <div className="w-3/4 h-0.5 bg-[#00685f]/40 relative">
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#00685f]"></div>
              </div>
              <div className="w-0.5 h-6 bg-[#00685f]/40"></div>
              <span className="material-symbols-outlined text-base -my-1.5">arrow_drop_down</span>
            </div>

            {/* CONDITIONAL GATEWAY */}
            <div
              onClick={() => setSelectedNodeId('NODE-COND')}
              className={`relative z-10 w-full max-w-md bg-white rounded-2xl p-4 shadow-xs cursor-pointer ${
                selectedNodeId === 'NODE-COND' ? 'ring-2 ring-[#00685f]' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#71f8e4] text-[#00201c] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined">call_split</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.65rem] uppercase font-bold text-[#00685d]">
                      Conditional Rule • بوابة شرطية
                    </span>
                    <span className="text-[0.65rem] bg-[#eff4ff] px-2 py-0.5 rounded-full text-[#475569]">
                      FR-19
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#0b1c30]">
                    Classification & Threshold Gate
                  </h4>
                </div>
              </div>
              <div className="mt-2 bg-[#eff4ff] p-2 rounded-xl text-xs space-y-1 font-mono">
                <div className="text-[#0b1c30]">
                  <span className="text-[#00685f] font-bold">IF</span> Doc.Classification ==
                  'Restricted'
                </div>
                <div className="text-[#0b1c30]">
                  <span className="text-[#00685f] font-bold">OR</span> Contract.Value &gt; $50,000
                  USD
                </div>
              </div>
            </div>

            {/* CONNECTOR */}
            <div className="relative z-10 flex flex-col items-center my-2 text-[#00685f]">
              <div className="w-0.5 h-6 bg-[#00685f]/40"></div>
              <span className="material-symbols-outlined text-base -my-1.5">arrow_drop_down</span>
            </div>

            {/* STAGE 3: EXECUTIVE SPONSOR (SELECTED NODE) */}
            <div
              onClick={() => setSelectedNodeId('NODE-03')}
              className={`relative z-10 w-full max-w-lg bg-white rounded-2xl p-5 shadow-md ring-2 ring-[#00685f] cursor-pointer transform scale-[1.02] transition-all`}
            >
              <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-[#00685f] text-white text-[0.65rem] font-bold tracking-wide flex items-center gap-1 shadow-xs">
                <span className="material-symbols-outlined text-xs">edit</span>
                Active Inspection Node • قيد الفحص
              </div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#00685f] text-white flex items-center justify-center font-bold shadow-xs">
                    <span className="material-symbols-outlined text-2xl">military_tech</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-bold text-[#00685f]">
                        Stage 03 • Escalation Ready
                      </span>
                      <span className="text-[0.65rem] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                        SLA: 48 Hours
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#0b1c30] leading-tight">
                      Executive Sponsor / CFO Approval
                    </h3>
                    <p className="text-[0.68rem] text-[#64748b]">
                      مراجعة واعتماد الراعي التنفيذي والمدير المالي
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-[#eff4ff] p-2 rounded-xl flex flex-col">
                  <span className="text-[0.65rem] text-[#64748b]">Assignee Role</span>
                  <span className="font-semibold text-[#0b1c30]">CFO / Sponsor</span>
                </div>
                <div className="bg-[#eff4ff] p-2 rounded-xl flex flex-col">
                  <span className="text-[0.65rem] text-[#64748b]">Escalation Timer</span>
                  <span className="font-semibold text-[#0b1c30]">24h Ping / 48h Breached</span>
                </div>
                <div className="bg-[#eff4ff] p-2 rounded-xl flex flex-col">
                  <span className="text-[0.65rem] text-[#64748b]">Fallback Target</span>
                  <span className="font-semibold text-[#00685f]">Deputy Controller</span>
                </div>
              </div>
            </div>

            {/* CONNECTOR */}
            <div className="relative z-10 flex flex-col items-center my-2 text-[#00685f]">
              <div className="w-0.5 h-6 bg-[#00685f]/40"></div>
              <span className="material-symbols-outlined text-base -my-1.5">arrow_drop_down</span>
            </div>

            {/* STAGE 4: TERMINAL NODE */}
            <div
              onClick={() => setSelectedNodeId('NODE-04')}
              className={`relative z-10 w-full max-w-lg bg-white rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer ${
                selectedNodeId === 'NODE-04' ? 'ring-2 ring-[#00685f]' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00685f]/10 text-[#00685f] flex items-center justify-center">
                    <span className="material-symbols-outlined">workspace_premium</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-bold text-[#00685f]">
                        Final Stage • الختم والأرشفة
                      </span>
                      <span className="text-[0.65rem] bg-[#71f8e4] text-[#00201c] px-2 py-0.5 rounded-full font-bold">
                        Terminal Node
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#0b1c30]">
                      Document Controller Seal & Hybrid Archive
                    </h3>
                    <p className="text-[0.68rem] text-[#64748b]">
                      ختم مسؤول الديوان الرسمي والأرشفة السحابية المشفرة (FR-43)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Node Configuration & Inspector Panel */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#cbd5e1]/30 flex flex-col space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#cbd5e1]/20">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00685f] animate-pulse"></span>
                  <span className="text-xs uppercase font-bold text-[#00685f]">
                    Stage Inspector • محددات المرحلة
                  </span>
                </div>
                <h2 className="text-lg font-bold text-[#0b1c30] mt-1">
                  Stage {selectedNode.stageNumber} Configuration
                </h2>
                <p className="text-xs text-[#64748b]">تخصيص قواعد وتفويضات المرحلة التنفيذية</p>
              </div>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-[#eff4ff] text-[#475569]"
                title="Stage Settings"
              >
                <span className="material-symbols-outlined text-lg">settings</span>
              </button>
            </div>

            {/* Step Name Inputs */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0b1c30] flex items-center justify-between">
                <span>Step Name (EN / AR)</span>
                <span className="text-[0.68rem] text-[#64748b]">اسم الخطوة</span>
              </label>
              <input
                type="text"
                value={selectedNode.name}
                onChange={(e) => updateSelectedNode('name', e.target.value)}
                className="w-full bg-[#eff4ff] px-3.5 py-2 rounded-xl text-xs text-[#0b1c30] focus:bg-white focus:ring-2 focus:ring-[#00685f] outline-none"
              />
              <input
                type="text"
                dir="rtl"
                value={selectedNode.nameAr}
                onChange={(e) => updateSelectedNode('nameAr', e.target.value)}
                className="w-full bg-[#eff4ff] px-3.5 py-2 rounded-xl text-xs text-[#0b1c30] focus:bg-white focus:ring-2 focus:ring-[#00685f] outline-none mt-1"
              />
            </div>

            {/* Assigned Approver Role */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0b1c30] flex items-center justify-between">
                <span>Assigned Approver Role (FR-20)</span>
                <span className="text-[0.68rem] text-[#64748b]">الدور المعتمد</span>
              </label>
              <select
                value={selectedNode.assignedRole}
                onChange={(e) => updateSelectedNode('assignedRole', e.target.value)}
                className="w-full bg-[#eff4ff] px-3.5 py-2 rounded-xl text-xs text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#00685f]"
              >
                <option value="Executive Sponsor / CFO">
                  Executive Sponsor / CFO (المسؤول التنفيذي / المدير المالي)
                </option>
                <option value="Department Secretary">
                  Department Secretary (سكرتير القسم)
                </option>
                <option value="Accounting Lead / Finance Manager">
                  Accounting Lead / Finance Manager (رئيس الحسابات)
                </option>
                <option value="General Counsel / Legal Lead">
                  General Counsel / Legal Lead (المستشار القانوني)
                </option>
                <option value="Document Controller">
                  Document Controller (مسؤول التحكم بالديوان)
                </option>
              </select>

              {/* Delegation Checkbox */}
              <div className="mt-2 bg-[#eff4ff]/60 rounded-xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00685f] text-lg">
                    history_edu
                  </span>
                  <div className="flex flex-col text-xs">
                    <span className="font-semibold text-[#0b1c30]">
                      Allow Authorized Delegation (FR-15)
                    </span>
                    <span className="text-[0.65rem] text-[#64748b]">
                      تمكين التفويض مع تسجيل التاريخ
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedNode.allowDelegation}
                  onChange={(e) => updateSelectedNode('allowDelegation', e.target.checked)}
                  className="w-4 h-4 accent-[#00685f] cursor-pointer"
                />
              </div>
            </div>

            {/* SLA Target & Timers */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0b1c30] flex items-center justify-between">
                <span>SLA Target & Timers (FR-23)</span>
                <span className="text-[0.68rem] text-[#64748b]">اتفاقية مستوى الخدمة</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#eff4ff] rounded-xl p-2.5 flex flex-col">
                  <span className="text-[0.65rem] text-[#64748b]">Completion Deadline</span>
                  <div className="flex items-center gap-1 mt-1">
                    <input
                      type="number"
                      value={selectedNode.slaHours}
                      onChange={(e) => updateSelectedNode('slaHours', Number(e.target.value))}
                      className="w-12 bg-transparent text-base font-bold text-[#0b1c30] outline-none"
                    />
                    <span className="text-xs text-[#64748b]">Hours / ساعة</span>
                  </div>
                </div>
                <div className="bg-[#eff4ff] rounded-xl p-2.5 flex flex-col">
                  <span className="text-[0.65rem] text-[#64748b]">Automated Reminder</span>
                  <div className="flex items-center gap-1 mt-1">
                    <input
                      type="number"
                      value={selectedNode.reminderHours}
                      onChange={(e) => updateSelectedNode('reminderHours', Number(e.target.value))}
                      className="w-12 bg-transparent text-base font-bold text-[#0b1c30] outline-none"
                    />
                    <span className="text-xs text-[#64748b]">Hours / ساعة</span>
                  </div>
                </div>
              </div>

              {/* Breach Escalation Warning */}
              <div className="mt-2 bg-red-50 rounded-xl p-2.5 flex items-start gap-2 border border-red-200">
                <span className="material-symbols-outlined text-red-600 text-base shrink-0 mt-0.5">
                  warning
                </span>
                <div className="flex flex-col text-xs text-red-900">
                  <span className="font-bold text-red-700">Breach Escalation Target:</span>
                  <span className="text-[0.68rem]">
                    Auto-reassign to <strong>{selectedNode.escalationTarget}</strong> upon SLA
                    expiration with high-priority alert.
                  </span>
                </div>
              </div>
            </div>

            {/* Allowed Actions */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0b1c30]">
                Allowed Actions (FR-21)
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {(['Approve', 'Reject', 'Request Changes', 'Re-assign'] as const).map((act) => (
                  <label
                    key={act}
                    className="flex items-center gap-2 p-2 rounded-xl bg-[#eff4ff] text-xs font-medium text-[#0b1c30] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedNode.allowedActions.includes(act)}
                      onChange={(e) => {
                        const current = selectedNode.allowedActions;
                        const updated = e.target.checked
                          ? [...current, act]
                          : current.filter((a) => a !== act);
                        updateSelectedNode('allowedActions', updated);
                      }}
                      className="w-4 h-4 accent-[#00685f]"
                    />
                    <span>{act}</span>
                  </label>
                ))}
              </div>
              <p className="text-[0.65rem] text-[#64748b] mt-1">
                * Rejection requires mandatory structured justification in accordance with FR-21 audit standards.
              </p>
            </div>

            {/* Tamper-Proof Audit Trail Badge */}
            <div className="p-3 rounded-2xl bg-[#eff4ff] flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#00685f]/10 flex items-center justify-center text-[#00685f] shrink-0">
                <span className="material-symbols-outlined">security</span>
              </div>
              <div className="flex flex-col text-xs">
                <span className="font-bold text-[#0b1c30]">Tamper-Proof Audit Trail</span>
                <span className="text-[0.65rem] text-[#64748b]">
                  All updates write directly to the Dewan cryptographic audit ledger.
                </span>
              </div>
            </div>

            {/* Apply Action */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleApplyStage}
                className="flex-1 py-2.5 rounded-full bg-[#00685f] text-white hover:bg-[#008378] text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                Apply to Stage {selectedNode.stageNumber} • تطبيق
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
