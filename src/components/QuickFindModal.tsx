import React, { useState } from 'react';
import { DocumentItem, AuditEvent } from '../types/dcs';

interface QuickFindModalProps {
  documents: DocumentItem[];
  auditEvents: AuditEvent[];
  onClose: () => void;
  onSelectDocument: (doc: DocumentItem) => void;
}

export const QuickFindModal: React.FC<QuickFindModalProps> = ({
  documents,
  auditEvents,
  onClose,
  onSelectDocument,
}) => {
  const [query, setQuery] = useState('');

  const filteredDocs = query
    ? documents.filter(
        (d) =>
          d.title.toLowerCase().includes(query.toLowerCase()) ||
          d.titleAr.includes(query) ||
          d.id.toLowerCase().includes(query.toLowerCase()) ||
          d.department.toLowerCase().includes(query.toLowerCase())
      )
    : documents.slice(0, 4);

  const filteredEvents = query
    ? auditEvents.filter(
        (e) =>
          e.documentRef.toLowerCase().includes(query.toLowerCase()) ||
          e.actorName.toLowerCase().includes(query.toLowerCase()) ||
          e.actionType.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-[#cbd5e1]/40">
        {/* Input */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-3 text-[#00685f]">
            search
          </span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to find documents, workflow tasks, or audit records... (Press ESC to exit)"
            className="w-full bg-[#eff4ff] pl-12 pr-10 py-3 rounded-2xl border border-[#cbd5e1]/40 text-sm font-medium text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#00685f]"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-3 text-[#64748b] hover:text-[#0b1c30]"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Results */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1 text-xs">
          <div>
            <span className="text-[0.68rem] uppercase font-bold text-[#64748b] tracking-wider block mb-2">
              Matching Documents & Records ({filteredDocs.length})
            </span>
            <div className="space-y-1.5">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    onSelectDocument(doc);
                    onClose();
                  }}
                  className="p-3 rounded-xl bg-[#eff4ff]/60 hover:bg-[#eff4ff] border border-[#cbd5e1]/20 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#00685f]">description</span>
                    <div className="flex flex-col">
                      <span className="font-bold text-[#0b1c30]">{doc.title}</span>
                      <span className="text-[0.65rem] text-[#64748b]">
                        {doc.id} • {doc.department} • Classification: {doc.classification}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-[#00685f] font-semibold text-[0.65rem]">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {filteredEvents.length > 0 && (
            <div className="pt-2 border-t border-[#cbd5e1]/20">
              <span className="text-[0.68rem] uppercase font-bold text-[#64748b] tracking-wider block mb-2">
                Matching Audit Ledger Events ({filteredEvents.length})
              </span>
              <div className="space-y-1.5">
                {filteredEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-2.5 rounded-xl bg-[#eff4ff]/60 border border-[#cbd5e1]/20 flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#0b1c30]">
                        {evt.actionType} - {evt.documentRef}
                      </span>
                      <span className="text-[0.65rem] text-[#64748b]">
                        {evt.actorName} ({evt.timestamp})
                      </span>
                    </div>
                    <span className="font-mono text-[0.65rem] text-[#00685f]">
                      {evt.hashSeal}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
