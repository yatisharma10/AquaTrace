import React, { useState } from 'react';
import { 
  PipelineSection, 
  SensorNode, 
  SectionId, 
  SuggestedAction 
} from '../types/pipeline';
import { 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Radio, 
  Maximize2, 
  Info, 
  Wrench,
  ToggleLeft,
  ToggleRight,
  Droplet
} from 'lucide-react';

interface PipelineMapProps {
  sections: PipelineSection[];
  sensors: SensorNode[];
  selectedSectionId: SectionId | null;
  onSelectSection: (id: SectionId) => void;
  onToggleValve: (id: SectionId) => void;
  lowSensorMode: boolean;
  onToggleLowSensorMode: () => void;
  onInspectSection: (section: PipelineSection) => void;
  activeLeakSection: SectionId | null;
  activeFaultSensorId: string | null;
}

export const PipelineMap: React.FC<PipelineMapProps> = ({
  sections,
  sensors,
  selectedSectionId,
  onSelectSection,
  onToggleValve,
  lowSensorMode,
  onToggleLowSensorMode,
  onInspectSection,
  activeLeakSection,
  activeFaultSensorId,
}) => {
  const [showInspector, setShowInspector] = useState(true);

  const selectedSection = sections.find(s => s.id === selectedSectionId) || sections[1]; // default Section B

  // Helper for pipe color based on status
  const getPipeColor = (section: PipelineSection) => {
    if (!section.isValveOpen) return '#475569'; // slate-600
    switch (section.status) {
      case 'possible_leak':
        return '#f43f5e'; // rose-500
      case 'sensor_uncertain':
        return '#f59e0b'; // amber-500
      case 'demand_surge':
        return '#38bdf8'; // sky-400
      case 'isolated':
        return '#475569';
      default:
        return '#06b6d4'; // cyan-500
    }
  };

  const getPipeGlow = (section: PipelineSection) => {
    if (!section.isValveOpen) return 'none';
    if (section.status === 'possible_leak') return 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.7))';
    if (section.status === 'sensor_uncertain') return 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.6))';
    if (section.status === 'demand_surge') return 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.6))';
    return 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.4))';
  };

  const getStatusBadge = (status: PipelineSection['status']) => {
    switch (status) {
      case 'possible_leak':
        return <span className="text-rose-400 font-semibold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Possible Leak</span>;
      case 'sensor_uncertain':
        return <span className="text-amber-400 font-semibold flex items-center gap-1"><HelpCircle className="w-3 h-3" /> Sensor Reading Uncertain</span>;
      case 'demand_surge':
        return <span className="text-sky-400 font-semibold flex items-center gap-1"><Radio className="w-3 h-3" /> High Demand Surge</span>;
      case 'isolated':
        return <span className="text-slate-400 font-medium">Isolated</span>;
      default:
        return <span className="text-emerald-400 font-medium flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Normal</span>;
    }
  };

  const sensorNode0 = sensors.find(s => s.id === 'node-0');
  const sensorNode1 = sensors.find(s => s.id === 'node-1');
  const sensorNode2 = sensors.find(s => s.id === 'node-2');
  const sensorNode3 = sensors.find(s => s.id === 'node-3');
  const sensorNode4 = sensors.find(s => s.id === 'node-4');

  const secA = sections.find(s => s.id === 'section-a')!;
  const secB = sections.find(s => s.id === 'section-b')!;
  const secC = sections.find(s => s.id === 'section-c')!;
  const secD = sections.find(s => s.id === 'section-d')!;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
      {/* Schematic Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Interactive Hydraulic Topology
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Campus Grid Sector-7</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Slide 5 Feature 1: Low-Sensor Mode Toggle */}
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
            <button
              onClick={onToggleLowSensorMode}
              className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white"
              title="Test whether suspected leaks can still be ranked when only a limited number of sensors are available"
            >
              <span>Low-Sensor Mode:</span>
              {lowSensorMode ? (
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  Active (2/5 Sensors)
                </span>
              ) : (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  Full Array (5/5)
                </span>
              )}
              {lowSensorMode ? (
                <ToggleRight className="w-5 h-5 text-amber-400" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-slate-400" />
              )}
            </button>
          </div>

          <button
            onClick={() => setShowInspector(!showInspector)}
            className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded border border-slate-800 bg-slate-900"
          >
            {showInspector ? 'Hide Telemetry Panel' : 'Show Telemetry Panel'}
          </button>
        </div>
      </div>

      {/* Beginner-friendly reading guide bar */}
      <div className="px-5 py-2 bg-slate-950 border-b border-slate-800/80 text-[11px] text-slate-300 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-semibold">💧 How water flows:</span>
          <span>Reservoir (Left) ➔ Main Trunk (Section A) ➔ Central Hub ➔ 3 Campus Buildings (North, East, South).</span>
        </div>
        <span className="text-slate-500 hidden md:inline">Click any pipe or valve to test controls</span>
      </div>

      {/* Main Schematic Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 relative min-h-[440px]">
        {/* SVG Diagram Canvas */}
        <div className={`p-4 transition-all duration-200 ${showInspector ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col justify-center items-center overflow-x-auto`}>
          <div className="w-full max-w-[820px] aspect-[16/9] relative bg-slate-950/80 rounded-lg border border-slate-800/80 p-2 shadow-inner">
            <svg
              viewBox="0 0 900 520"
              className="w-full h-full select-none"
              style={{ overflow: 'visible' }}
            >
              <defs>
                {/* Glow Filters */}
                <filter id="glow-rose" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                {/* Animated dash pattern for water flow */}
                <pattern id="flow-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="5" cy="5" r="2" fill="#38bdf8" opacity="0.6" />
                </pattern>
              </defs>

              {/* Grid Background Lines */}
              <g stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" opacity="0.4">
                <line x1="0" y1="130" x2="900" y2="130" />
                <line x1="0" y1="260" x2="900" y2="260" />
                <line x1="0" y1="390" x2="900" y2="390" />
                <line x1="180" y1="0" x2="180" y2="520" />
                <line x1="450" y1="0" x2="450" y2="520" />
                <line x1="720" y1="0" x2="720" y2="520" />
              </g>

              {/* ================= PIPELINES (BACKGROUND TUBES) ================= */}
              {/* Outer structural casing */}
              <g stroke="#0f172a" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
                {/* Section A: Intake to Hub */}
                <line x1="100" y1="260" x2="420" y2="260" />
                {/* Section B: Hub to North */}
                <path d="M 420 260 L 520 260 L 520 120 L 780 120" fill="none" />
                {/* Section C: Hub to East */}
                <line x1="420" y1="260" x2="780" y2="260" />
                {/* Section D: Hub to South */}
                <path d="M 420 260 L 520 260 L 520 400 L 780 400" fill="none" />
              </g>

              {/* Active Fluid Conduits */}
              {/* SECTION A (Intake Trunk) */}
              <g 
                onClick={() => onSelectSection('section-a')} 
                className="cursor-pointer group"
              >
                <line 
                  x1="100" y1="260" x2="420" y2="260" 
                  stroke={getPipeColor(secA)} 
                  strokeWidth={selectedSectionId === 'section-a' ? 10 : 8} 
                  strokeLinecap="round"
                  style={{ filter: getPipeGlow(secA) }}
                  className="transition-all"
                />
                {secA.isValveOpen && (
                  <line 
                    x1="100" y1="260" x2="420" y2="260" 
                    stroke="#ffffff" 
                    strokeWidth="2.5" 
                    strokeDasharray="6 12"
                    strokeLinecap="round"
                    className="animate-[dash_1.5s_linear_infinite]"
                  />
                )}
                {/* Pipe Label */}
                <rect x="210" y="235" width="105" height="22" rx="4" fill="#0f172a" stroke={selectedSectionId === 'section-a' ? '#38bdf8' : '#334155'} strokeWidth="1" />
                <text x="262" y="250" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">
                  Section A (Main)
                </text>
              </g>

              {/* SECTION B (North Branch - Academic/Facility) */}
              <g 
                onClick={() => onSelectSection('section-b')} 
                className="cursor-pointer group"
              >
                <path 
                  d="M 420 260 L 520 260 L 520 120 L 780 120" 
                  fill="none" 
                  stroke={getPipeColor(secB)} 
                  strokeWidth={selectedSectionId === 'section-b' ? 10 : 8} 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: getPipeGlow(secB) }}
                  className="transition-all"
                />
                {secB.isValveOpen && (
                  <path 
                    d="M 420 260 L 520 260 L 520 120 L 780 120" 
                    fill="none" 
                    stroke="#ffffff" 
                    strokeWidth="2.5" 
                    strokeDasharray="6 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-[dash_2s_linear_infinite]"
                  />
                )}
                {/* Pipe Label */}
                <rect x="580" y="95" width="115" height="22" rx="4" fill="#0f172a" stroke={selectedSectionId === 'section-b' ? '#38bdf8' : '#334155'} strokeWidth="1" />
                <text x="637" y="110" textAnchor="middle" fill={secB.status === 'possible_leak' ? '#fb7185' : '#94a3b8'} fontSize="11" fontWeight="600">
                  Section B (North)
                </text>

                {/* Leak Indicator on Section B if active */}
                {secB.status === 'possible_leak' && secB.isValveOpen && (
                  <g transform="translate(635, 120)">
                    <circle r="16" fill="rgba(244, 63, 94, 0.2)" className="animate-ping" />
                    <circle r="9" fill="#f43f5e" />
                    <Droplet className="w-4 h-4 text-white" x="-8" y="-8" />
                    <rect x="-45" y="-36" width="90" height="20" rx="4" fill="#881337" stroke="#f43f5e" strokeWidth="1" />
                    <text x="0" y="-22" textAnchor="middle" fill="#ffe4e6" fontSize="10" fontWeight="bold">
                      LEAK {secB.estimatedWaterLossLpm} L/m
                    </text>
                  </g>
                )}
              </g>

              {/* SECTION C (East Branch - Admin) */}
              <g 
                onClick={() => onSelectSection('section-c')} 
                className="cursor-pointer group"
              >
                <line 
                  x1="420" y1="260" x2="780" y2="260" 
                  stroke={getPipeColor(secC)} 
                  strokeWidth={selectedSectionId === 'section-c' ? 10 : 8} 
                  strokeLinecap="round"
                  style={{ filter: getPipeGlow(secC) }}
                  className="transition-all"
                />
                {secC.isValveOpen && (
                  <line 
                    x1="420" y1="260" x2="780" y2="260" 
                    stroke="#ffffff" 
                    strokeWidth="2.5" 
                    strokeDasharray="6 12"
                    strokeLinecap="round"
                    className="animate-[dash_2.2s_linear_infinite]"
                  />
                )}
                {/* Pipe Label */}
                <rect x="580" y="235" width="110" height="22" rx="4" fill="#0f172a" stroke={selectedSectionId === 'section-c' ? '#38bdf8' : '#334155'} strokeWidth="1" />
                <text x="635" y="250" textAnchor="middle" fill={secC.status === 'possible_leak' ? '#fb7185' : '#94a3b8'} fontSize="11" fontWeight="600">
                  Section C (East)
                </text>

                {/* Leak Indicator on Section C if active */}
                {secC.status === 'possible_leak' && secC.isValveOpen && (
                  <g transform="translate(635, 260)">
                    <circle r="16" fill="rgba(244, 63, 94, 0.2)" className="animate-ping" />
                    <circle r="9" fill="#f43f5e" />
                    <Droplet className="w-4 h-4 text-white" x="-8" y="-8" />
                    <rect x="-45" y="-36" width="90" height="20" rx="4" fill="#881337" stroke="#f43f5e" strokeWidth="1" />
                    <text x="0" y="-22" textAnchor="middle" fill="#ffe4e6" fontSize="10" fontWeight="bold">
                      LEAK {secC.estimatedWaterLossLpm} L/m
                    </text>
                  </g>
                )}
              </g>

              {/* SECTION D (South Branch - Industrial / Towers) */}
              <g 
                onClick={() => onSelectSection('section-d')} 
                className="cursor-pointer group"
              >
                <path 
                  d="M 420 260 L 520 260 L 520 400 L 780 400" 
                  fill="none" 
                  stroke={getPipeColor(secD)} 
                  strokeWidth={selectedSectionId === 'section-d' ? 10 : 8} 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: getPipeGlow(secD) }}
                  className="transition-all"
                />
                {secD.isValveOpen && (
                  <path 
                    d="M 420 260 L 520 260 L 520 400 L 780 400" 
                    fill="none" 
                    stroke="#ffffff" 
                    strokeWidth="2.5" 
                    strokeDasharray="6 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-[dash_1.8s_linear_infinite]"
                  />
                )}
                {/* Pipe Label */}
                <rect x="580" y="375" width="115" height="22" rx="4" fill="#0f172a" stroke={selectedSectionId === 'section-d' ? '#38bdf8' : '#334155'} strokeWidth="1" />
                <text x="637" y="390" textAnchor="middle" fill={secD.status === 'possible_leak' ? '#fb7185' : '#94a3b8'} fontSize="11" fontWeight="600">
                  Section D (South)
                </text>

                {/* Leak Indicator on Section D if active */}
                {secD.status === 'possible_leak' && secD.isValveOpen && (
                  <g transform="translate(635, 400)">
                    <circle r="16" fill="rgba(244, 63, 94, 0.2)" className="animate-ping" />
                    <circle r="9" fill="#f43f5e" />
                    <Droplet className="w-4 h-4 text-white" x="-8" y="-8" />
                    <rect x="-45" y="-36" width="90" height="20" rx="4" fill="#881337" stroke="#f43f5e" strokeWidth="1" />
                    <text x="0" y="-22" textAnchor="middle" fill="#ffe4e6" fontSize="10" fontWeight="bold">
                      BURST {secD.estimatedWaterLossLpm} L/m
                    </text>
                  </g>
                )}
              </g>

              {/* ================= VALVES ================= */}
              {/* Valve V-01 (Section A) */}
              <g 
                onClick={(e) => { e.stopPropagation(); onToggleValve('section-a'); }} 
                className="cursor-pointer group"
                transform="translate(180, 260)"
              >
                <circle r="14" fill="#0f172a" stroke={secA.isValveOpen ? '#06b6d4' : '#ef4444'} strokeWidth="2" />
                <polygon 
                  points="-6,-7 6,-7 0,0 -6,7 6,7" 
                  fill={secA.isValveOpen ? '#06b6d4' : '#ef4444'} 
                />
                <text x="0" y="-18" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">V-01 {secA.isValveOpen ? 'OPEN' : 'SHUT'}</text>
              </g>

              {/* Valve V-02 (Section B) */}
              <g 
                onClick={(e) => { e.stopPropagation(); onToggleValve('section-b'); }} 
                className="cursor-pointer group"
                transform="translate(540, 120)"
              >
                <circle r="14" fill="#0f172a" stroke={secB.isValveOpen ? '#06b6d4' : '#ef4444'} strokeWidth="2" />
                <polygon 
                  points="-6,-7 6,-7 0,0 -6,7 6,7" 
                  fill={secB.isValveOpen ? '#06b6d4' : '#ef4444'} 
                />
                <text x="0" y="-18" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">V-02 {secB.isValveOpen ? 'OPEN' : 'SHUT'}</text>
              </g>

              {/* Valve V-03 (Section C) */}
              <g 
                onClick={(e) => { e.stopPropagation(); onToggleValve('section-c'); }} 
                className="cursor-pointer group"
                transform="translate(540, 260)"
              >
                <circle r="14" fill="#0f172a" stroke={secC.isValveOpen ? '#06b6d4' : '#ef4444'} strokeWidth="2" />
                <polygon 
                  points="-6,-7 6,-7 0,0 -6,7 6,7" 
                  fill={secC.isValveOpen ? '#06b6d4' : '#ef4444'} 
                />
                <text x="0" y="-18" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">V-03 {secC.isValveOpen ? 'OPEN' : 'SHUT'}</text>
              </g>

              {/* Valve V-04 (Section D) */}
              <g 
                onClick={(e) => { e.stopPropagation(); onToggleValve('section-d'); }} 
                className="cursor-pointer group"
                transform="translate(540, 400)"
              >
                <circle r="14" fill="#0f172a" stroke={secD.isValveOpen ? '#06b6d4' : '#ef4444'} strokeWidth="2" />
                <polygon 
                  points="-6,-7 6,-7 0,0 -6,7 6,7" 
                  fill={secD.isValveOpen ? '#06b6d4' : '#ef4444'} 
                />
                <text x="0" y="-18" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">V-04 {secD.isValveOpen ? 'OPEN' : 'SHUT'}</text>
              </g>

              {/* ================= SENSOR NODES & TELEMETRY BADGES ================= */}
              
              {/* NODE 0: Reservoir Intake */}
              <g transform="translate(90, 260)">
                <circle r="22" fill="#0f172a" stroke="#0284c7" strokeWidth="2.5" />
                <circle r="7" fill="#38bdf8" />
                <text x="-40" y="-34" textAnchor="start" fill="#e2e8f0" fontSize="11" fontWeight="bold">Reservoir Main N0</text>
                <rect x="-45" y="32" width="90" height="34" rx="4" fill="#0b1329" stroke="#1e293b" strokeWidth="1" />
                <text x="0" y="46" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  {sensorNode0?.flowRateLpm ?? 120} L/m
                </text>
                <text x="0" y="60" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                  {sensorNode0?.pressureBar ?? 4.2} bar
                </text>
              </g>

              {/* NODE 1: Central Manifold Hub */}
              <g transform="translate(420, 260)">
                <circle r="18" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
                <circle r="6" fill="#06b6d4" />
                <text x="0" y="-24" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">Hub N1</text>
                <rect x="-35" y="24" width="70" height="20" rx="3" fill="#0b1329" stroke="#1e293b" strokeWidth="1" />
                <text x="0" y="38" textAnchor="middle" fill="#06b6d4" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  {sensorNode1?.pressureBar ?? 3.9} bar
                </text>
              </g>

              {/* NODE 2: Section B Terminal (Facility) */}
              <g transform="translate(790, 120)">
                <circle 
                  r="20" 
                  fill="#0f172a" 
                  stroke={sensorNode2?.isFaulty ? '#f59e0b' : (!sensorNode2?.active ? '#475569' : '#0284c7')} 
                  strokeWidth="2" 
                />
                <circle r="6" fill={sensorNode2?.isFaulty ? '#f59e0b' : (!sensorNode2?.active ? '#64748b' : '#38bdf8')} />
                <text x="30" y="-6" textAnchor="start" fill="#e2e8f0" fontSize="11" fontWeight="bold">Terminal N2</text>
                <text x="30" y="8" textAnchor="start" fill="#64748b" fontSize="10">Facility Block</text>

                {/* Telemetry Tag */}
                <rect x="30" y="16" width="95" height="34" rx="4" fill="#0b1329" stroke="#1e293b" strokeWidth="1" />
                {sensorNode2?.active ? (
                  <>
                    <text x="77" y="30" textAnchor="middle" fill={sensorNode2?.isFaulty ? '#fbbf24' : '#38bdf8'} fontSize="10" fontFamily="monospace" fontWeight="bold">
                      {sensorNode2.flowRateLpm} L/m
                    </text>
                    <text x="77" y="44" textAnchor="middle" fill={sensorNode2?.isFaulty ? '#fbbf24' : '#94a3b8'} fontSize="10" fontFamily="monospace">
                      {sensorNode2.pressureBar} bar {sensorNode2?.isFaulty && '(DRIFT)'}
                    </text>
                  </>
                ) : (
                  <>
                    <text x="77" y="30" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">
                      SPARSE (OFFLINE)
                    </text>
                    <text x="77" y="44" textAnchor="middle" fill="#38bdf8" fontSize="9">
                      Inferred ~{secB.flowRateLpm} L/m
                    </text>
                  </>
                )}
              </g>

              {/* NODE 3: Section C Terminal (Admin) */}
              <g transform="translate(790, 260)">
                <circle 
                  r="20" 
                  fill="#0f172a" 
                  stroke={!sensorNode3?.active ? '#475569' : '#0284c7'} 
                  strokeWidth="2" 
                />
                <circle r="6" fill={!sensorNode3?.active ? '#64748b' : '#38bdf8'} />
                <text x="30" y="-6" textAnchor="start" fill="#e2e8f0" fontSize="11" fontWeight="bold">Terminal N3</text>
                <text x="30" y="8" textAnchor="start" fill="#64748b" fontSize="10">Admin / Datacenter</text>

                {/* Telemetry Tag */}
                <rect x="30" y="16" width="95" height="34" rx="4" fill="#0b1329" stroke="#1e293b" strokeWidth="1" />
                {sensorNode3?.active ? (
                  <>
                    <text x="77" y="30" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      {sensorNode3.flowRateLpm} L/m
                    </text>
                    <text x="77" y="44" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                      {sensorNode3.pressureBar} bar
                    </text>
                  </>
                ) : (
                  <>
                    <text x="77" y="30" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">
                      SPARSE (OFFLINE)
                    </text>
                    <text x="77" y="44" textAnchor="middle" fill="#38bdf8" fontSize="9">
                      Inferred ~{secC.flowRateLpm} L/m
                    </text>
                  </>
                )}
              </g>

              {/* NODE 4: Section D Terminal (Industrial) */}
              <g transform="translate(790, 400)">
                <circle 
                  r="20" 
                  fill="#0f172a" 
                  stroke="#0284c7" 
                  strokeWidth="2" 
                />
                <circle r="6" fill="#38bdf8" />
                <text x="30" y="-6" textAnchor="start" fill="#e2e8f0" fontSize="11" fontWeight="bold">Terminal N4</text>
                <text x="30" y="8" textAnchor="start" fill="#64748b" fontSize="10">Cooling Towers</text>

                {/* Telemetry Tag */}
                <rect x="30" y="16" width="95" height="34" rx="4" fill="#0b1329" stroke="#1e293b" strokeWidth="1" />
                <text x="77" y="30" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  {sensorNode4?.flowRateLpm ?? 45} L/m
                </text>
                <text x="77" y="44" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                  {sensorNode4?.pressureBar ?? 3.5} bar
                </text>
              </g>
            </svg>
          </div>

          {/* Quick Legend Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-cyan-400" />
              <span>Normal Conduit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span>Suspected Leak</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Sensor Fault / Uncertain</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-400" />
              <span>High Demand Surge</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-600" />
              <span>Isolated / Valve Closed</span>
            </div>
          </div>
        </div>

        {/* Selected Section Telemetry Inspector Panel */}
        {showInspector && (
          <div className="lg:col-span-4 p-5 bg-slate-950/90 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    Pipe Telemetry Inspector
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {selectedSection.name}: {selectedSection.label}
                  </h3>
                </div>
                <div className="text-right">
                  {getStatusBadge(selectedSection.status)}
                </div>
              </div>

              {/* Status & Priority Highlight */}
              <div className="mt-4 p-3 rounded-lg bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Inspection Priority:</span>
                  <span className="font-mono font-bold text-sm text-cyan-300">
                    Rank Score {selectedSection.priorityScore} / 100
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1.5">
                  <span className="text-slate-400">Suggested Action:</span>
                  <span className={`font-semibold ${
                    selectedSection.suggestedAction === 'Inspect first' 
                      ? 'text-rose-400' 
                      : selectedSection.suggestedAction === 'Verify sensor' 
                        ? 'text-amber-400' 
                        : 'text-slate-300'
                  }`}>
                    {selectedSection.suggestedAction}
                  </span>
                </div>
              </div>

              {/* Physical Specifications */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Material & Diameter:</span>
                  <span className="text-slate-200 font-medium">{selectedSection.material} · Ø{selectedSection.pipeDiameterMm}mm</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Segment Length & Depth:</span>
                  <span className="text-slate-200 font-mono">{selectedSection.lengthMeters}m · {selectedSection.depthMeters}m depth</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Physical Access Point:</span>
                  <span className="text-slate-300 text-right max-w-[200px] truncate" title={selectedSection.accessLocation}>
                    {selectedSection.accessLocation}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Inspection Effort Level:</span>
                  <span className="text-slate-200 font-medium">
                    {selectedSection.inspectionEffortScore === 1 ? 'Low (Accessible trench)' : selectedSection.inspectionEffortScore === 2 ? 'Moderate' : 'High (Excavation / Paved)'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Isolation Valve {selectedSection.valveId}:</span>
                  <button 
                    onClick={() => onToggleValve(selectedSection.id)}
                    className={`font-semibold underline ${selectedSection.isValveOpen ? 'text-emerald-400' : 'text-rose-400'}`}
                  >
                    {selectedSection.isValveOpen ? 'Open (Click to Isolate)' : 'Closed (Click to Open)'}
                  </button>
                </div>
              </div>

              {/* Live Real-time Readings */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Flow Rate</span>
                  <span className="text-sm font-mono font-bold text-white tabular-nums">
                    {selectedSection.flowRateLpm} <span className="text-slate-400 text-xs font-normal">L/min</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Baseline: {selectedSection.baselineFlowLpm} L/min
                  </span>
                </div>

                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Water Pressure</span>
                  <span className="text-sm font-mono font-bold text-white tabular-nums">
                    {selectedSection.pressureBar} <span className="text-slate-400 text-xs font-normal">bar</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Baseline: {selectedSection.baselinePressureBar} bar
                  </span>
                </div>
              </div>

              {selectedSection.estimatedWaterLossLpm > 0 && (
                <div className="mt-3 p-2.5 rounded bg-rose-950/40 border border-rose-800/60 text-xs">
                  <div className="flex items-center justify-between text-rose-300 font-semibold">
                    <span>Unaccounted Water Loss:</span>
                    <span className="font-mono text-sm">{selectedSection.estimatedWaterLossLpm} L/min</span>
                  </div>
                  <p className="text-[11px] text-rose-300/80 mt-1">
                    Equates to ~{((selectedSection.estimatedWaterLossLpm * 60) / 1000).toFixed(2)} m³/hr discharged into surrounding substrate.
                  </p>
                </div>
              )}

              {/* Plain English Assessment */}
              <div className="mt-3 p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <span className="font-bold text-cyan-400 block mb-0.5">What this means:</span>
                {selectedSection.status === 'possible_leak' && (
                  <p>⚠️ Water is leaking into the ground (~{selectedSection.estimatedWaterLossLpm} L/min). With {selectedSection.depthMeters}m depth in {selectedSection.accessLocation}, it is prioritized for immediate inspection.</p>
                )}
                {selectedSection.status === 'sensor_uncertain' && (
                  <p>⚡ Sensor reading drifted, but neighboring pipes are stable and no water is missing. It is a sensor calibration issue, not a pipe leak.</p>
                )}
                {selectedSection.status === 'demand_surge' && (
                  <p>🚰 Normal peak campus usage. All water is fully delivered to meters (Inflow = Outflow).</p>
                )}
                {selectedSection.status === 'normal' && (
                  <p>✅ Operating nominally. Water flow and pressure match normal expected patterns.</p>
                )}
                {selectedSection.status === 'isolated' && (
                  <p>🔒 Valve is closed. Water flow through this segment is stopped.</p>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-5 pt-3 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => onInspectSection(selectedSection)}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Field Work Order</span>
              </button>
              <button
                onClick={() => onToggleValve(selectedSection.id)}
                className={`py-2 px-3 text-xs font-medium rounded border transition-colors ${
                  selectedSection.isValveOpen 
                    ? 'border-rose-800/80 text-rose-300 hover:bg-rose-950/40' 
                    : 'border-emerald-800/80 text-emerald-300 hover:bg-emerald-950/40'
                }`}
              >
                {selectedSection.isValveOpen ? 'Shut Valve' : 'Open Valve'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
