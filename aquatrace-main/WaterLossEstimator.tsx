import React, { useState } from 'react';
import { WaterLossStats } from '../types/pipeline';
import { 
  Droplet, 
  DollarSign, 
  Leaf, 
  Home, 
  Calculator, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface WaterLossEstimatorProps {
  stats: WaterLossStats;
  inflowTotalLpm: number;
  outflowTotalLpm: number;
  onResetCumulative: () => void;
}

export const WaterLossEstimator: React.FC<WaterLossEstimatorProps> = ({
  stats,
  inflowTotalLpm,
  outflowTotalLpm,
  onResetCumulative,
}) => {
  const [showFormula, setShowFormula] = useState(true);

  // Approximate hole orifice size using Torricelli: Q = Cd * A * sqrt(2 * P / rho)
  // Cd ~ 0.62, rho = 1000 kg/m3, P ~ 3.8 bar = 380,000 Pa
  // A = Q / (Cd * sqrt(2 * P / rho))
  // sqrt(2 * 380000 / 1000) = sqrt(760) ~= 27.57 m/s
  // Q in m3/s = (stats.instantaneousLossLpm / 60) / 1000
  const qM3s = stats.instantaneousLossLpm > 0 ? (stats.instantaneousLossLpm / 60000) : 0;
  const areaM2 = qM3s / (0.62 * 27.57);
  const estimatedHoleDiameterMm = stats.instantaneousLossLpm > 0 
    ? Number((Math.sqrt((4 * areaM2) / Math.PI) * 1000).toFixed(1)) 
    : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/40 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            Water-Loss & Impact Analysis
          </span>
          <h2 className="text-base font-bold text-white mt-0.5">
            Volumetric Loss, Economic Cost & Carbon Impact
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Quantifies continuous unmetered leakage into soil or underground structures with transparent mathematical derivation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onResetCumulative}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Cumulative</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Real-time Loss Rate */}
        <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-cyan-400" />
              Instantaneous Loss
            </span>
            <span className="text-[10px] font-mono text-cyan-400 font-semibold">Live Q_leak</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {stats.instantaneousLossLpm}
            </span>
            <span className="text-xs text-slate-400 ml-1.5">L/min</span>
          </div>
          <div className="mt-1 text-xs text-slate-400 font-mono">
            {stats.instantaneousLossM3h} m³/hr continuous
          </div>
        </div>

        {/* KPI 2: Cumulative Volume */}
        <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-rose-400" />
              Cumulative Escaped
            </span>
            <span className="text-[10px] font-mono text-rose-400 font-semibold">∫ Q dt</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono text-rose-300 tabular-nums">
              {stats.cumulativeLossLiters.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 ml-1.5">Liters</span>
          </div>
          <div className="mt-1 text-xs text-slate-400 font-mono">
            ~{stats.cumulativeLossGallons.toLocaleString()} US Gallons
          </div>
        </div>

        {/* KPI 3: Financial Tariff Loss */}
        <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              Economic Water Waste
            </span>
            <span className="text-[10px] font-mono text-amber-400 font-semibold">Tariff Tariff</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono text-amber-300 tabular-nums">
              ${stats.accumulatedCostUsd.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 ml-1.5">USD</span>
          </div>
          <div className="mt-1 text-xs text-slate-400 font-mono">
            At $3.50 / 1,000L municipal commercial rate
          </div>
        </div>

        {/* KPI 4: Carbon & Resource Waste */}
        <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              Pumping Carbon
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">CO₂e Footprint</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono text-emerald-300 tabular-nums">
              {stats.carbonPumpingKgCo2.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 ml-1.5">kg CO₂e</span>
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Equivalent to {stats.equivalentHomesDailyWater} homes' daily supply
          </div>
        </div>
      </div>

      {/* Slide 5 Explicit Requirement: "show the calculation transparently" */}
      <div className="px-6 pb-6">
        <div className="border border-slate-800 rounded-lg bg-slate-950/90 overflow-hidden">
          <button
            onClick={() => setShowFormula(!showFormula)}
            className="w-full px-5 py-3 flex items-center justify-between text-left hover:bg-slate-900/60 transition-colors"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Calculator className="w-4 h-4 text-cyan-400" />
              <span>Transparent Mathematical Calculation Model</span>
              <span className="text-slate-500 font-normal">· Hydraulic mass balance & orifice physics</span>
            </div>
            {showFormula ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showFormula && (
            <div className="p-5 border-t border-slate-800 space-y-4 text-xs font-mono">
              {/* Formula 1: Mass Balance Integral */}
              <div className="p-3.5 rounded bg-slate-900/80 border border-slate-800/80">
                <div className="text-[11px] text-cyan-300 font-sans font-bold mb-1">
                  1. Unaccounted Mass Conservation Integral
                </div>
                <div className="text-slate-300 font-mono text-xs overflow-x-auto py-1">
                  V_loss(t) = ∫ [ Q_intake(τ) - ∑ Q_metered(τ) ] dτ
                </div>
                <div className="mt-2 text-[11px] text-slate-400 font-sans flex flex-wrap gap-x-4 gap-y-1">
                  <span>Current Intake Q_in: <strong className="text-white font-mono">{inflowTotalLpm} L/min</strong></span>
                  <span>Delivered Q_out: <strong className="text-white font-mono">{outflowTotalLpm} L/min</strong></span>
                  <span>Instantaneous Discrepancy ΔQ: <strong className="text-rose-400 font-mono">+{stats.instantaneousLossLpm} L/min</strong></span>
                </div>
              </div>

              {/* Formula 2: Torricelli Orifice Flow Aperture Calculation */}
              <div className="p-3.5 rounded bg-slate-900/80 border border-slate-800/80">
                <div className="text-[11px] text-cyan-300 font-sans font-bold mb-1">
                  2. Hydraulic Orifice Discharge & Inferred Pipe Aperture
                </div>
                <div className="text-slate-300 font-mono text-xs overflow-x-auto py-1">
                  Q_leak = C_d · A_orifice · √( 2 · ΔP / ρ )
                </div>
                <div className="mt-2 text-[11px] text-slate-400 font-sans">
                  {stats.instantaneousLossLpm > 0 ? (
                    <div className="text-slate-300">
                      Using discharge coefficient <span className="font-mono text-cyan-300">C_d = 0.62</span> and pressure <span className="font-mono text-cyan-300">ΔP = 3.8 bar</span>, the inferred physical pipe fissure aperture is approximately <strong className="text-rose-400 font-mono">Ø {estimatedHoleDiameterMm} mm</strong>.
                    </div>
                  ) : (
                    <div className="text-slate-500">
                      Aperture calculation inactive: zero orifice discharge currently observed.
                    </div>
                  )}
                </div>
              </div>

              {/* Formula 3: Economic and Carbon conversions */}
              <div className="p-3.5 rounded bg-slate-900/80 border border-slate-800/80">
                <div className="text-[11px] text-cyan-300 font-sans font-bold mb-1">
                  3. Tariff & Ecological Weight Factors
                </div>
                <div className="text-[11px] text-slate-400 font-sans grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                  <div>· Cost = V_lost (L) × $0.00350 / L ($3.50/m³)</div>
                  <div>· Pumping Energy = V_lost (L) × 0.00085 kWh/L</div>
                  <div>· Embedded Carbon = 0.0004 kg CO₂e / Liter produced</div>
                  <div>· Benchmark Household Baseline: 1,100 Liters / Day</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
