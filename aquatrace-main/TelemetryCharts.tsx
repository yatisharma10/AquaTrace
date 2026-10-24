import React from 'react';
import { TelemetryDataPoint, PipelineSection, SensorNode } from '../types/pipeline';
import { Activity, Gauge, TrendingDown, Layers } from 'lucide-react';

interface TelemetryChartsProps {
  history: TelemetryDataPoint[];
  currentInflow: number;
  currentOutflow: number;
  massDiscrepancy: number;
  sections: PipelineSection[];
  sensors: SensorNode[];
}

export const TelemetryCharts: React.FC<TelemetryChartsProps> = ({
  history,
  currentInflow,
  currentOutflow,
  massDiscrepancy,
  sections,
  sensors,
}) => {
  // Use last 25 points for chart
  const points = history.slice(-25);

  // Flow chart calculations (SVG line)
  const maxFlow = Math.max(180, ...points.map(p => Math.max(p.inflowTotalLpm, p.outflowTotalLpm)));
  const minFlow = 0;
  const flowRange = maxFlow - minFlow || 1;

  const chartW = 460;
  const chartH = 120;

  const getFlowX = (idx: number) => {
    if (points.length <= 1) return 0;
    return (idx / (points.length - 1)) * chartW;
  };

  const getFlowY = (val: number) => {
    const norm = (val - minFlow) / flowRange;
    return chartH - norm * (chartH - 20) - 10;
  };

  const inflowPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getFlowX(i)} ${getFlowY(p.inflowTotalLpm)}`).join(' ');
  const outflowPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getFlowX(i)} ${getFlowY(p.outflowTotalLpm)}`).join(' ');
  const leakPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getFlowX(i)} ${getFlowY(p.leakRateTotalLpm)}`).join(' ');

  // Pressure bar gradient across nodes
  const nodePressures = [
    { label: 'N0 Intake', p: sensors.find(s => s.id === 'node-0')?.pressureBar ?? 4.2, baseline: 4.2 },
    { label: 'N1 Hub', p: sensors.find(s => s.id === 'node-1')?.pressureBar ?? 3.95, baseline: 3.95 },
    { label: 'N2 North', p: sensors.find(s => s.id === 'node-2')?.pressureBar ?? 3.8, baseline: 3.8 },
    { label: 'N3 East', p: sensors.find(s => s.id === 'node-3')?.pressureBar ?? 3.7, baseline: 3.7 },
    { label: 'N4 South', p: sensors.find(s => s.id === 'node-4')?.pressureBar ?? 3.5, baseline: 3.5 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Chart 1: Real-time Mass Balance Inflow vs Outflow */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Mass Balance: Inflow vs Outflow Telemetry
              </h3>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2 h-0.5 bg-cyan-400" /> Q_in: {currentInflow} L/m
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-0.5 bg-emerald-400" /> Q_out: {currentOutflow} L/m
              </span>
              {massDiscrepancy > 0 && (
                <span className="flex items-center gap-1 text-rose-400 font-bold">
                  <span className="w-2 h-0.5 bg-rose-400" /> ΔQ: +{massDiscrepancy} L/m
                </span>
              )}
            </div>
          </div>

          {/* SVG Line Graph */}
          <div className="w-full aspect-[4/1.2] bg-slate-950/70 rounded-lg p-2 border border-slate-800/80 relative">
            <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-full overflow-visible">
              {/* Horizontal Reference Lines */}
              <line x1="0" y1={getFlowY(120)} x2={chartW} y2={getFlowY(120)} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
              <text x="5" y={getFlowY(120) - 3} fill="#64748b" fontSize="9" fontFamily="monospace">Nominal 120 L/m</text>

              {/* Paths */}
              {points.length > 1 && (
                <>
                  <path d={inflowPath} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
                  <path d={outflowPath} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
                  {massDiscrepancy > 0 && (
                    <path d={leakPath} fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 2" />
                  )}
                </>
              )}
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
          <span>Continuous Mass Balance Sampling (1 Hz)</span>
          <span className="font-mono text-cyan-400">Status: {massDiscrepancy > 0 ? 'Deficit Discrepancy Active' : 'Equilibrium Conserved'}</span>
        </div>
      </div>

      {/* Chart 2: Pressure Head Gradient Profile Across Nodes */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Pressure Head Profile Across Topological Nodes
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">
              Expected vs Measured (bar)
            </span>
          </div>

          {/* Bar comparison for each node */}
          <div className="space-y-2.5 pt-1">
            {nodePressures.map((np, idx) => {
              const delta = np.p - np.baseline;
              const isDepressed = delta < -0.15;
              const pct = (np.p / 5.0) * 100;

              return (
                <div key={idx} className="text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-300 font-medium">{np.label}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className={`font-bold tabular-nums ${isDepressed ? 'text-rose-400' : 'text-cyan-300'}`}>
                        {np.p.toFixed(2)} bar
                      </span>
                      <span className="text-[10px] text-slate-500">
                        (base {np.baseline} bar)
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        isDepressed ? 'bg-rose-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, pct))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
          <span>Hydraulic Hydraulic Head Decay Curve</span>
          <span className="font-mono text-slate-300">Darcy Friction Tolerance: ±0.05 bar</span>
        </div>
      </div>
    </div>
  );
};
