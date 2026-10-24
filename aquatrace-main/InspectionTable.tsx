import React from 'react';
import { 
  PipelineSection, 
  SectionId, 
  SuggestedAction 
} from '../types/pipeline';
import { 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Radio, 
  ArrowRight, 
  Wrench, 
  Sliders, 
  ShieldCheck 
} from 'lucide-react';

interface InspectionTableProps {
  sections: PipelineSection[];
  selectedSectionId: SectionId | null;
  onSelectSection: (id: SectionId) => void;
  onInspectSection: (section: PipelineSection) => void;
  onToggleValve: (id: SectionId) => void;
}

export const InspectionTable: React.FC<InspectionTableProps> = ({
  sections,
  selectedSectionId,
  onSelectSection,
  onInspectSection,
  onToggleValve,
}) => {
  // Sort sections by calculated priority score descending
  const sortedSections = [...sections].sort((a, b) => b.priorityScore - a.priorityScore);

  const getStatusBadge = (status: PipelineSection['status']) => {
    switch (status) {
      case 'possible_leak':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Possible leak
          </span>
        );
      case 'sensor_uncertain':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Sensor reading uncertain
          </span>
        );
      case 'demand_surge':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            High demand surge
          </span>
        );
      case 'isolated':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-slate-600" />
            Isolated
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Normal
          </span>
        );
    }
  };

  const getSuggestedActionBadge = (action: SuggestedAction) => {
    switch (action) {
      case 'Inspect first':
        return (
          <span className="font-bold text-xs text-rose-400 underline decoration-rose-500/50 underline-offset-2">
            Inspect first
          </span>
        );
      case 'Verify sensor':
        return (
          <span className="font-semibold text-xs text-amber-400 underline decoration-amber-500/50 underline-offset-2">
            Verify sensor
          </span>
        );
      case 'High demand - monitor':
        return (
          <span className="text-xs text-sky-400">
            Continue monitoring (demand surge)
          </span>
        );
      default:
        return (
          <span className="text-xs text-slate-400">
            Continue monitoring
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Table Header / Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-slate-800 bg-slate-950/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Smart Inspection Priority Ranking
            </span>
          </div>
          <h2 className="text-base font-bold text-white mt-0.5">
            Inspection Prioritization & Pipeline Status
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Sections ranked by multi-criteria formula: Leak Likelihood (50%) + Loss Severity (30%) + Accessibility Factor (20%).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-mono text-slate-300">4 Monitored Sections</span>
          <span>·</span>
          <span className="font-mono text-cyan-300">Target Resolution: ~15 mins</span>
        </div>
      </div>

      {/* Friendly Guide */}
      <div className="px-6 py-2.5 bg-slate-950/80 border-b border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
        <span className="text-cyan-400 font-bold shrink-0">💡 Why rank pipes?</span>
        <span>Fixing an accessible pipe in a lawn chamber takes 15 minutes, whereas cutting concrete takes 4 hours. AquaTrace prioritizes pipes with high leak probability that can be resolved quickly.</span>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/60">
              <th className="py-3 px-4 w-12 text-center">Rank</th>
              <th className="py-3 px-4">Pipeline Section</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Flow Rate</th>
              <th className="py-3 px-4 text-right">Pressure</th>
              <th className="py-3 px-4 text-right">Likelihood</th>
              <th className="py-3 px-4">Inspection Effort</th>
              <th className="py-3 px-4">Suggested Action</th>
              <th className="py-3 px-4 text-right">Dispatch</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {sortedSections.map((sec, idx) => {
              const isSelected = selectedSectionId === sec.id;
              const isTopPriority = idx === 0 && sec.suggestedAction === 'Inspect first';

              return (
                <tr
                  key={sec.id}
                  onClick={() => onSelectSection(sec.id)}
                  className={`cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-slate-800/80' 
                      : 'hover:bg-slate-800/40 bg-slate-900/40'
                  } ${isTopPriority ? 'border-l-2 border-l-rose-500' : ''}`}
                >
                  {/* Rank */}
                  <td className="py-3.5 px-4 text-center">
                    <span className={`font-mono font-bold text-xs ${
                      isTopPriority 
                        ? 'text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-800' 
                        : 'text-slate-400'
                    }`}>
                      #{idx + 1}
                    </span>
                  </td>

                  {/* Section info */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                        {sec.name}
                        {sec.status === 'possible_leak' && (
                          <span className="text-[10px] text-rose-400 font-mono font-normal">
                            (Target)
                          </span>
                        )}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate max-w-[220px]" title={sec.label}>
                        {sec.label}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    {getStatusBadge(sec.status)}
                  </td>

                  {/* Flow Rate */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-200">
                    <span className={sec.flowRateLpm > sec.baselineFlowLpm + 10 ? 'text-amber-400 font-bold' : ''}>
                      {sec.flowRateLpm.toFixed(1)} L/m
                    </span>
                    <span className="block text-[10px] text-slate-500">
                      base: {sec.baselineFlowLpm} L/m
                    </span>
                  </td>

                  {/* Pressure */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-200">
                    <span className={sec.pressureBar < sec.baselinePressureBar - 0.25 ? 'text-rose-400 font-bold' : ''}>
                      {sec.pressureBar.toFixed(2)} bar
                    </span>
                    <span className="block text-[10px] text-slate-500">
                      base: {sec.baselinePressureBar} bar
                    </span>
                  </td>

                  {/* Likelihood */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                    <span className={`font-bold ${
                      sec.leakLikelihoodPct > 70 
                        ? 'text-rose-400' 
                        : sec.leakLikelihoodPct > 20 
                          ? 'text-amber-400' 
                          : 'text-slate-400'
                    }`}>
                      {sec.leakLikelihoodPct}%
                    </span>
                  </td>

                  {/* Effort */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="text-slate-300 font-medium">
                        {sec.inspectionEffortScore === 1 ? 'Score 1 (Low)' : sec.inspectionEffortScore === 2 ? 'Score 2 (Moderate)' : sec.inspectionEffortScore === 3 ? 'Score 3 (Deep shaft)' : 'Score 4 (Paved)'}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate max-w-[170px]" title={sec.accessLocation}>
                        {sec.accessLocation}
                      </span>
                    </div>
                  </td>

                  {/* Suggested Action */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      {getSuggestedActionBadge(sec.suggestedAction)}
                      <span className="text-[10px] text-slate-500 mt-0.5">
                        {sec.status === 'possible_leak' 
                          ? 'High leak odds + shallow access' 
                          : sec.status === 'sensor_uncertain' 
                            ? 'Sensor glitch; pipe intact' 
                            : sec.status === 'demand_surge' 
                              ? 'Expected campus usage' 
                              : 'Nominal water balance'}
                      </span>
                    </div>
                  </td>

                  {/* Dispatch action button */}
                  <td className="py-3.5 px-4 text-right">
                    {sec.suggestedAction === 'Inspect first' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onInspectSection(sec);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded transition-colors shadow-sm whitespace-nowrap"
                      >
                        <Wrench className="w-3 h-3" />
                        <span>Dispatch Crew</span>
                      </button>
                    ) : sec.suggestedAction === 'Verify sensor' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onInspectSection(sec);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded transition-colors shadow-sm whitespace-nowrap"
                      >
                        <Sliders className="w-3 h-3" />
                        <span>Calibrate</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSection(sec.id);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-400 hover:text-white text-xs rounded border border-slate-800 hover:border-slate-700 whitespace-nowrap"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer note */}
      <div className="px-6 py-2.5 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span>Tip: Click any row to focus the network schematic on that section or toggle its isolation valve.</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-500">Algorithm: Hydraulic Mass Discrepancy & Gradient Correlation</span>
        </div>
      </div>
    </div>
  );
};
