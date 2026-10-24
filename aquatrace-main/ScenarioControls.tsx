import React from 'react';
import { SectionId } from '../types/pipeline';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  TrendingUp, 
  Radio, 
  Droplet,
  Sliders
} from 'lucide-react';

interface ScenarioControlsProps {
  isRunning: boolean;
  onTogglePlay: () => void;
  speed: number;
  onChangeSpeed: (spd: number) => void;
  onReset: () => void;
  lowSensorMode: boolean;
  onToggleLowSensorMode: () => void;
  
  // Active settings
  activeLeakSection: SectionId | null;
  leakRateLpm: number;
  activeFaultSensorId: string | null;
  demandSurgeSection: SectionId | null;
  demandSurgeLpm: number;
  
  // Setters
  onApplyPreset: (presetId: 'baseline' | 'micro_leak_b' | 'major_rupture_d' | 'sensor_fault_p3' | 'demand_surge' | 'low_sensor_sparse') => void;
  onSetLeak: (section: SectionId | null, rateLpm: number) => void;
  onSetFault: (sensorId: string | null, magnitude: number) => void;
  onSetDemandSurge: (section: SectionId | null, surgeLpm: number) => void;
}

export const ScenarioControls: React.FC<ScenarioControlsProps> = ({
  isRunning,
  onTogglePlay,
  speed,
  onChangeSpeed,
  onReset,
  lowSensorMode,
  onToggleLowSensorMode,
  activeLeakSection,
  leakRateLpm,
  activeFaultSensorId,
  demandSurgeSection,
  demandSurgeLpm,
  onApplyPreset,
  onSetLeak,
  onSetFault,
  onSetDemandSurge,
}) => {
  const presets = [
    {
      id: 'baseline' as const,
      title: 'Baseline Normal',
      subtitle: 'Nominal Operations',
      desc: 'All sections operating at balanced flow and pressure without leaks.',
      icon: CheckCircle2,
      accent: 'border-emerald-500/50 hover:bg-emerald-950/20 text-emerald-400',
    },
    {
      id: 'micro_leak_b' as const,
      title: 'Micro-Leak (Section B)',
      subtitle: 'Localized Pipe Breach',
      desc: 'Subtle 24.5 L/min pipe fissure in North Branch. Ranked Inspect First.',
      icon: Droplet,
      accent: 'border-rose-500/50 hover:bg-rose-950/20 text-rose-400',
    },
    {
      id: 'major_rupture_d' as const,
      title: 'Major Rupture (Section D)',
      subtitle: 'Emergency Burst',
      desc: '75 L/min catastrophic line breach with massive pressure drop.',
      icon: AlertTriangle,
      accent: 'border-rose-600/70 hover:bg-rose-950/30 text-rose-500',
    },
    {
      id: 'sensor_fault_p3' as const,
      title: 'Sensor P-03 Voltage Drift',
      subtitle: 'Transducer Failure',
      desc: 'Transducer error causes false drop without hydraulic neighbor drop.',
      icon: Cpu,
      accent: 'border-amber-500/50 hover:bg-amber-950/20 text-amber-400',
    },
    {
      id: 'demand_surge' as const,
      title: 'Peak Demand Surge',
      subtitle: 'High Consumption Spike',
      desc: 'Cooling towers flush: mass balance conserved, no true water loss.',
      icon: TrendingUp,
      accent: 'border-sky-500/50 hover:bg-sky-950/20 text-sky-400',
    },
    {
      id: 'low_sensor_sparse' as const,
      title: 'Low-Sensor Sparse Array',
      subtitle: 'Sparse Telemetry Mode',
      desc: '50% of sensors deactivated. Evaluates topological leak ranking.',
      icon: Radio,
      accent: 'border-cyan-500/50 hover:bg-cyan-950/20 text-cyan-400',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Title & Simulation Clock Bar */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/40 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            Interactive Leak Simulator
          </span>
          <h2 className="text-base font-bold text-white mt-0.5">
            Scenario Presets & Physical Incident Injector
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Trigger simulated leaks, transducer failures, and consumption surges to watch the pipeline map, alerts, and rankings update.
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <button
            onClick={onTogglePlay}
            className={`p-1.5 rounded ${isRunning ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'} hover:opacity-80 transition-opacity`}
            title={isRunning ? 'Pause simulation' : 'Run simulation'}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onChangeSpeed(speed === 1 ? 2 : speed === 2 ? 5 : 1)}
            className="flex items-center gap-1 px-2 py-1 text-xs font-mono text-slate-300 hover:text-white bg-slate-900 rounded border border-slate-800"
            title="Change simulation clock speed"
          >
            <FastForward className="w-3.5 h-3.5 text-cyan-400" />
            <span>{speed}x</span>
          </button>

          <button
            onClick={onReset}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 rounded border border-slate-800"
            title="Reset simulation to initial baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preset Cards Grid */}
      <div className="p-6">
        <span className="text-xs font-semibold text-slate-300 block mb-3 uppercase tracking-wider">
          One-Click Test Scenarios
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {presets.map(p => {
            const Icon = p.icon;
            const isCurrent = 
              (p.id === 'baseline' && !activeLeakSection && !activeFaultSensorId && !demandSurgeSection && !lowSensorMode) ||
              (p.id === 'micro_leak_b' && activeLeakSection === 'section-b' && leakRateLpm < 40 && !activeFaultSensorId) ||
              (p.id === 'major_rupture_d' && activeLeakSection === 'section-d' && leakRateLpm > 50) ||
              (p.id === 'sensor_fault_p3' && activeFaultSensorId !== null) ||
              (p.id === 'demand_surge' && demandSurgeSection !== null && !activeLeakSection) ||
              (p.id === 'low_sensor_sparse' && lowSensorMode);

            return (
              <button
                key={p.id}
                onClick={() => onApplyPreset(p.id)}
                className={`text-left p-3.5 rounded-lg border transition-all ${
                  isCurrent 
                    ? 'border-cyan-400 bg-slate-800/90 shadow-md ring-1 ring-cyan-400/40' 
                    : `border-slate-800 bg-slate-950/60 ${p.accent}`
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-bold text-white">{p.title}</span>
                  </div>
                  {isCurrent && (
                    <span className="text-[9px] font-mono font-bold text-cyan-300 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-700">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 font-medium mb-1">
                  {p.subtitle}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {p.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Custom Parametric Adjustments */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Manual Parameter Tuning
            </span>
            <span className="text-xs text-slate-400">
              Live Interactive Hydraulic Sliders
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-950/60 p-4 rounded-lg border border-slate-800">
            {/* Leak Rate Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Physical Leak Injection:</span>
                <span className="font-mono text-rose-400 font-bold">
                  {activeLeakSection ? `${activeLeakSection.toUpperCase()} @ ${leakRateLpm} L/min` : 'None (0 L/min)'}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                {(['section-a', 'section-b', 'section-c', 'section-d'] as SectionId[]).map(sId => (
                  <button
                    key={sId}
                    onClick={() => onSetLeak(sId, leakRateLpm > 0 ? leakRateLpm : 25)}
                    className={`flex-1 py-1 text-[11px] font-mono rounded border transition-colors ${
                      activeLeakSection === sId 
                        ? 'border-rose-500 bg-rose-950/60 text-white font-bold' 
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {sId.replace('section-', '').toUpperCase()}
                  </button>
                ))}
                <button
                  onClick={() => onSetLeak(null, 0)}
                  className={`px-2 py-1 text-[11px] font-mono rounded border transition-colors ${
                    activeLeakSection === null 
                      ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300 font-bold' 
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  OFF
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={activeLeakSection ? leakRateLpm : 0}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val === 0) {
                    onSetLeak(null, 0);
                  } else {
                    onSetLeak(activeLeakSection || 'section-b', val);
                  }
                }}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            {/* Demand Spike Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Legitimate Demand Surge:</span>
                <span className="font-mono text-sky-400 font-bold">
                  {demandSurgeSection ? `+${demandSurgeLpm} L/min` : 'Baseline'}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                {(['section-b', 'section-c', 'section-d'] as SectionId[]).map(sId => (
                  <button
                    key={sId}
                    onClick={() => onSetDemandSurge(sId, demandSurgeLpm > 0 ? demandSurgeLpm : 35)}
                    className={`flex-1 py-1 text-[11px] font-mono rounded border transition-colors ${
                      demandSurgeSection === sId 
                        ? 'border-sky-500 bg-sky-950/60 text-white font-bold' 
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {sId.replace('section-', '').toUpperCase()}
                  </button>
                ))}
                <button
                  onClick={() => onSetDemandSurge(null, 0)}
                  className={`px-2 py-1 text-[11px] font-mono rounded border transition-colors ${
                    demandSurgeSection === null 
                      ? 'border-slate-700 bg-slate-800 text-slate-300 font-bold' 
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  OFF
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={demandSurgeSection ? demandSurgeLpm : 0}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val === 0) {
                    onSetDemandSurge(null, 0);
                  } else {
                    onSetDemandSurge(demandSurgeSection || 'section-d', val);
                  }
                }}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>

            {/* Sensor Fault Injection */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Sensor Fault Artifact:</span>
                <span className="font-mono text-amber-400 font-bold">
                  {activeFaultSensorId ? `${activeFaultSensorId} Faulty` : 'Healthy (All)'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => onSetFault(activeFaultSensorId ? null : 'node-2', 1.4)}
                  className={`py-2 text-xs font-semibold rounded border transition-colors ${
                    activeFaultSensorId === 'node-2' 
                      ? 'border-amber-500 bg-amber-950/60 text-amber-300' 
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
                  }`}
                >
                  {activeFaultSensorId === 'node-2' ? 'Clear P-03 Fault' : 'Drift Node-2 (P-03)'}
                </button>

                <button
                  onClick={onToggleLowSensorMode}
                  className={`py-2 text-xs font-semibold rounded border transition-colors ${
                    lowSensorMode 
                      ? 'border-cyan-500 bg-cyan-950/60 text-cyan-300' 
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
                  }`}
                >
                  {lowSensorMode ? 'Restore 5 Sensors' : 'Cut to 2 Sensors'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
