import React from 'react';
import { 
  X, 
  HelpCircle, 
  Droplets, 
  ShieldAlert, 
  Cpu, 
  TrendingUp, 
  Radio, 
  CheckCircle2, 
  Wrench,
  Sparkles
} from 'lucide-react';

interface PlainEnglishGuideModalProps {
  onClose: () => void;
}

export const PlainEnglishGuideModal: React.FC<PlainEnglishGuideModalProps> = ({
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-800">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Beginner-Friendly Architecture Guide
              </span>
              <h2 className="text-base font-bold text-white">
                How AquaTrace Works in Plain English
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs">
          {/* Card 1: The Problem */}
          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-rose-400">1.</span> Why is finding water leaks so difficult?
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Water pipes are buried underground under soil, roads, and concrete. When a pipe cracks, water seeps silently beneath the ground for weeks before anyone notices. Small leaks waste thousands of liters, inflate water bills, and weaken building foundations.
            </p>
          </div>

          {/* Card 2: The Impostor Problem */}
          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-amber-400">2.</span> The "Hidden Impostor" Problem (False Alarms)
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Old monitoring systems use naive rules: <em>"If water pressure drops, trigger an alarm!"</em> But pressure drops naturally when the campus cafeteria washes dishes, when cooling towers flush, or when an electrical sensor glitches. Chasing these false alarms wastes days of maintenance crew time.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="font-bold text-rose-400 block mb-1">A. Real Leak</span>
                <span className="text-slate-400">Water leaves the main pump but never reaches the taps. Water is missing.</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">B. Broken Sensor</span>
                <span className="text-slate-400">One gauge reads zero, but neighboring pipes are fine and no water is missing.</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="font-bold text-sky-400 block mb-1">C. High Demand</span>
                <span className="text-slate-400">Taps are wide open. Flow is high, but all water is accounted for at meters.</span>
              </div>
            </div>
          </div>

          {/* Card 3: How AquaTrace Solves It */}
          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400">3.</span> How AquaTrace Diagnoses the Truth
            </h3>
            <p className="text-slate-300 leading-relaxed">
              AquaTrace acts like an automated financial ledger for water (called <strong>Mass Balance Conservation</strong>):
            </p>
            <div className="p-3 rounded bg-slate-900 border border-cyan-900/40 text-cyan-200 font-mono text-center">
              Water Dispatched (Pump) - Water Received (Meters) = Water Lost into Soil
            </div>
            <p className="text-slate-400 leading-relaxed">
              If the difference is zero, AquaTrace knows there is no physical leak, instantly eliminating false alarms!
            </p>
          </div>

          {/* Card 4: Smart Inspection Priority */}
          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400">4.</span> Why Rank "Inspection Priority"?
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Even if a system knows there is a leak, a campus has miles of pipes. Where should the repair crew dig first?
              AquaTrace balances three practical factors:
            </p>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside pl-2">
              <li><strong>Likelihood:</strong> How strongly the physics points to that pipe.</li>
              <li><strong>Severity:</strong> How many liters are escaping per minute.</li>
              <li><strong>Inspection Effort:</strong> Is the pipe in an open lawn chamber (easy, 15 mins), or buried under concrete parking (hard, 4 hours)?</li>
            </ul>
            <p className="text-slate-400 pt-1">
              This ensures maintenance teams resolve the most critical, accessible problems first.
            </p>
          </div>

          {/* Card 5: Low-Sensor Mode */}
          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-sky-400">5.</span> What is "Low-Sensor Mode"?
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Many facilities cannot afford to install sensors every 50 meters. AquaTrace includes a topological inference algorithm that can locate leaks even when 50% of pipes have no direct sensors, using upstream and downstream boundary readings.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors"
          >
            Got it, take me to the dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
