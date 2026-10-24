import React from 'react';
import { 
  ImpostorDiagnostic, 
  DiagnosticClassification 
} from '../types/pipeline';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertOctagon, 
  Cpu, 
  TrendingUp, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface ImpostorClassifierProps {
  diagnostic: ImpostorDiagnostic;
  massDiscrepancyLpm: number;
  onSelectPreset: (presetId: 'normal' | 'micro_leak' | 'sensor_fault' | 'demand_surge') => void;
}

export const ImpostorClassifier: React.FC<ImpostorClassifierProps> = ({
  diagnostic,
  massDiscrepancyLpm,
  onSelectPreset,
}) => {
  const isRealLeak = diagnostic.classification === 'REAL_LEAK';
  const isSensorFault = diagnostic.classification === 'SENSOR_FAULT';
  const isDemandSurge = diagnostic.classification === 'DEMAND_SURGE';
  const isNormal = diagnostic.classification === 'NORMAL';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Title */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/40 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            Root Cause Diagnostic Engine
          </span>
          <h2 className="text-base font-bold text-white mt-0.5">
            Leak vs Sensor Fault vs Demand Change Classifier
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Differentiates true physical pipe breaches from misleading transducer noise and legitimate peak consumption spikes.
          </p>
        </div>

        {/* Current Live Classification Indicator */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Diagnosis</span>
            <span className={`text-sm font-bold font-mono ${
              isRealLeak ? 'text-rose-400' :
              isSensorFault ? 'text-amber-400' :
              isDemandSurge ? 'text-sky-400' : 'text-emerald-400'
            }`}>
              {diagnostic.classification} ({diagnostic.confidencePct}% Conf)
            </span>
          </div>
        </div>
      </div>

      {/* Everyday Analogy Strip */}
      <div className="px-6 py-2.5 bg-slate-950/80 border-b border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
        <span className="text-cyan-400 font-bold shrink-0">💡 Everyday Analogy:</span>
        <span>Think of Mass Balance like a checking account: Inflow is water deposited; building meters are water withdrawn. If water goes missing from the balance, it is a leak into the ground. If no water went missing, you know it is a broken gauge or legitimate heavy tap use!</span>
      </div>

      {/* Tripartite Comparison Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Scenario 1: Real Physical Leak */}
        <div className={`p-4 rounded-lg border transition-all ${
          isRealLeak 
            ? 'border-rose-500 bg-rose-950/20 shadow-md ring-1 ring-rose-500/50' 
            : 'border-slate-800 bg-slate-900/60 opacity-80 hover:opacity-100'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className={`w-4 h-4 ${isRealLeak ? 'text-rose-400' : 'text-slate-400'}`} />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                01. Physical Pipe Leak
              </h3>
            </div>
            {isRealLeak && (
              <span className="text-[10px] font-bold text-rose-300 bg-rose-900/60 px-2 py-0.5 rounded border border-rose-700">
                ACTIVE STATE
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mb-3">
            Actual breach causing mass fluid escaping into soil. Sustained imbalance across time.
          </p>

          <div className="space-y-2 text-xs border-t border-slate-800/80 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Mass Balance:</span>
              <span className="font-mono text-rose-400 font-medium">Deficit (Qin &gt; Qout)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Pressure Gradient:</span>
              <span className="text-slate-300">Downstream drop</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Sensor Coherence:</span>
              <span className="text-emerald-400">Hydraulically Coherent</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Water Loss Rate:</span>
              <span className="font-mono text-rose-400 font-bold">
                {isRealLeak ? `+${massDiscrepancyLpm} L/min` : 'Elevated'}
              </span>
            </div>
          </div>

          <button
            onClick={() => onSelectPreset('micro_leak')}
            className="w-full mt-4 py-1.5 px-3 text-xs font-semibold rounded border border-rose-700/60 text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Test Real Leak Scenario</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Scenario 2: Sensor Fault (The Impostor) */}
        <div className={`p-4 rounded-lg border transition-all ${
          isSensorFault 
            ? 'border-amber-500 bg-amber-950/20 shadow-md ring-1 ring-amber-500/50' 
            : 'border-slate-800 bg-slate-900/60 opacity-80 hover:opacity-100'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cpu className={`w-4 h-4 ${isSensorFault ? 'text-amber-400' : 'text-slate-400'}`} />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                02. Sensor Fault (The Impostor)
              </h3>
            </div>
            {isSensorFault && (
              <span className="text-[10px] font-bold text-amber-300 bg-amber-900/60 px-2 py-0.5 rounded border border-amber-700">
                ACTIVE STATE
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mb-3">
            Transducer calibration drift, electrical noise, or stuck reading. Resembles a leak to naive threshold algorithms!
          </p>

          <div className="space-y-2 text-xs border-t border-slate-800/80 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Mass Balance:</span>
              <span className="text-slate-300 font-medium">Physically Constant</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Pressure Gradient:</span>
              <span className="text-amber-400">Isolated to 1 transducer</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Sensor Coherence:</span>
              <span className="text-rose-400 font-bold">Incoherent (Violates laws)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Actual Water Loss:</span>
              <span className="font-mono text-emerald-400 font-medium">0.0 L/min (Zero)</span>
            </div>
          </div>

          <button
            onClick={() => onSelectPreset('sensor_fault')}
            className="w-full mt-4 py-1.5 px-3 text-xs font-semibold rounded border border-amber-700/60 text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Test Sensor Fault Scenario</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Scenario 3: Demand Change (Peak Usage) */}
        <div className={`p-4 rounded-lg border transition-all ${
          isDemandSurge 
            ? 'border-sky-500 bg-sky-950/20 shadow-md ring-1 ring-sky-500/50' 
            : 'border-slate-800 bg-slate-900/60 opacity-80 hover:opacity-100'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className={`w-4 h-4 ${isDemandSurge ? 'text-sky-400' : 'text-slate-400'}`} />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                03. Legitimate Demand Surge
              </h3>
            </div>
            {isDemandSurge && (
              <span className="text-[10px] font-bold text-sky-300 bg-sky-900/60 px-2 py-0.5 rounded border border-sky-700">
                ACTIVE STATE
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mb-3">
            Heavy user consumption (e.g. cooling towers flush, cafeteria peak). Flow spikes but all water is accounted for.
          </p>

          <div className="space-y-2 text-xs border-t border-slate-800/80 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Mass Balance:</span>
              <span className="text-emerald-400 font-medium">Preserved (Qin = Qout)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Pressure Gradient:</span>
              <span className="text-slate-300">Uniform Darcy friction drop</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Sensor Coherence:</span>
              <span className="text-emerald-400 font-medium">Hydraulically Coherent</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Actual Water Loss:</span>
              <span className="font-mono text-emerald-400 font-medium">0.0 L/min (Delivered)</span>
            </div>
          </div>

          <button
            onClick={() => onSelectPreset('demand_surge')}
            className="w-full mt-4 py-1.5 px-3 text-xs font-semibold rounded border border-sky-700/60 text-sky-300 bg-sky-950/40 hover:bg-sky-900/60 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Test Demand Surge Scenario</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Physics & AI Reasoning Output Box */}
      <div className="px-6 py-4 bg-slate-950/70 border-t border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            AquaTrace AI Diagnostic Justification
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Confidence: <strong className="text-white">{diagnostic.confidencePct}%</strong>
          </span>
        </div>

        <ul className="space-y-1.5">
          {diagnostic.reasoning.map((line, i) => (
            <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
              <span className="text-cyan-400 font-mono mt-0.5">·</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
