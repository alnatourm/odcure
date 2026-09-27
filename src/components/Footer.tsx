import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#ffffff] border-t border-[#cbd5e1]/30 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[#475569]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#0b1c30]">
            Sanad DCS | نظام سند للتحكم بالمستندات
          </span>
          <span className="text-xs text-[#64748b]">• Enterprise Governance Edition v2.4</span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span>ISO 9001 / ISO 27001 Compliant</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00685f]"></span>
            <span className="text-[#0b1c30] font-medium">System Operational • النظام يعمل</span>
          </div>
        </div>

        <div className="text-xs text-center md:text-right text-[#64748b]">
          © 2026 Sanad Document Intelligence. Flexible Local / Cloud / Hybrid Storage Architecture.
        </div>
      </div>
    </footer>
  );
};
