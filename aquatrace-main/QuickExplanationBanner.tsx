import React, { useState } from 'react';
import { 
  Droplet, 
  Cpu, 
  TrendingUp, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DiagnosticClassification, SectionId } from '../types/pipeline';

interface QuickExplanationBannerProps {
  classification: DiagnosticClassification;
  activeLeakSection: SectionId | null;
  activeFaultSensorId: string | null;
  demandSurgeSection: SectionId | null;
  onApplyPreset: (presetId: 'baseline' | 'micro_leak_b' | 'sensor_fault_p3' | 'demand_surge') => void;
  onOpenGuideModal: () => void;
}

export const QuickExplanationBanner: React.FC<QuickExplanationBannerProps> = ({
  classification,
  activeLeakSection,
  activeFaultSensorId,
  demandSurgeSection,
  onApplyPreset,
  onOpenGuideModal,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Plain-English live state explanation
  const getLiveExplanation = () => {
    switch (classification) {
      case 'REAL_LEAK':
        return {
          badge: '⚠️ REAL LEAK DETECTED',
          badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
          headline: `Water is escaping underground in ${activeLeakSection?.replace('section-', 'Section ').toUpperCase() || 'the network'}!`,
          explanation: 'More water is leaving the reservoir than reaching the building meters. The pressure has dropped, confirming a physical pipe breach. The priority list below tells technicians which exact hatch to open first.',
          actionHint: 'Look at the diagram below: the red glowing pipe is leaking. Click "Dispatch Crew" in the table to view the repair checklist.',
        };
      case 'SENSOR_FAULT':
        return {
          badge: '⚡ FALSE ALARM FILTERED (BROKEN SENSOR)',
          badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
          headline: 'A pressure sensor is glitching, but the pipe is NOT leaking.',
          explanation: 'Sensor P-03 dropped suddenly, but all adjacent pipes show normal pressure and zero water is missing. Traditional systems would send an emergency crew to dig; AquaTrace recognizes it is just an electrical glitch.',
          actionHint: 'Click "Calibrate" in the table below to reset the sensor and clear the warning.',
        };
      case 'DEMAND_SURGE':
        return {
          badge: '🚰 NORMAL HIGH WATER USE (NO LEAK)',
          badgeColor: 'bg-sky-950 text-sky-300 border-sky-800',
          headline: 'Water usage spiked, but all water is fully accounted for.',
          explanation: 'The cooling towers or cafeteria just opened their valves (+45 L/min). Water in equals water out, so no water is being wasted into the soil. AquaTrace knows not to sound an alarm.',
          actionHint: 'Status remains "Continue Monitoring" because this is normal campus operations.',
        };
      default:
        return {
          badge: '✅ ALL SYSTEMS NOMINAL',
          badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
          headline: 'All pipelines are operating in perfect hydraulic balance.',
          explanation: '120 L/min enters from the reservoir, and exactly 120 L/min reaches the facilities (35 L/m North + 40 L/m East + 45 L/m South). No pressure drops, no water loss.',
          actionHint: 'Click any scenario button below to see how AquaTrace detects problems and prevents false alarms.',
        };
    }
  };

  const current = getLiveExplanation();

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-xl p-4 md:p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">
            💡
          </div>
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Quick Interactive Tour & Live Explanation
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Understand how AquaTrace works in 30 seconds
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGuideModal}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/40 rounded border border-cyan-800/60 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Plain English Guide</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-white rounded"
            title={isExpanded ? 'Collapse guide' : 'Expand guide'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="pt-3 space-y-4">
          {/* Quick Scenario Selector Buttons */}
          <div>
            <span className="text-[11px] text-slate-400 font-medium block mb-2">
              Step 1: Pick a scenario to test what happens:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => onApplyPreset('micro_leak_b')}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-semibold transition-all ${
                  classification === 'REAL_LEAK'
                    ? 'border-rose-500 bg-rose-950/60 text-white shadow-sm ring-1 ring-rose-500/50'
                    : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Droplet className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>1. Real Pipe Leak</span>
              </button>

              <button
                onClick={() => onApplyPreset('sensor_fault_p3')}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-semibold transition-all ${
                  classification === 'SENSOR_FAULT'
                    ? 'border-amber-500 bg-amber-950/60 text-white shadow-sm ring-1 ring-amber-500/50'
                    : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>2. Broken Sensor</span>
              </button>

              <button
                onClick={() => onApplyPreset('demand_surge')}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-semibold transition-all ${
                  classification === 'DEMAND_SURGE'
                    ? 'border-sky-500 bg-sky-950/60 text-white shadow-sm ring-1 ring-sky-500/50'
                    : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>3. High Water Use</span>
              </button>

              <button
                onClick={() => onApplyPreset('baseline')}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-semibold transition-all ${
                  classification === 'NORMAL'
                    ? 'border-emerald-500 bg-emerald-950/60 text-white shadow-sm ring-1 ring-emerald-500/50'
                    : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>4. All Normal</span>
              </button>
            </div>
          </div>

          {/* Live Plain-English Explanation Box */}
          <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${current.badgeColor}`}>
                  {current.badge}
                </span>
                <span className="text-xs font-bold text-slate-200">
                  {current.headline}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {current.explanation}
              </p>
              <p className="text-[11px] text-cyan-300/90 font-medium">
                {current.actionHint}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
