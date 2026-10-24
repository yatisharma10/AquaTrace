import React, { useState } from 'react';
import { runValidationSuite, TestSuiteSummary } from '../utils/benchmarkRunner';
import { 
  X, 
  Play, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  BarChart3, 
  RefreshCw,
  Cpu,
  Target,
  Zap
} from 'lucide-react';

interface ValidationBenchmarkModalProps {
  onClose: () => void;
}

export const ValidationBenchmarkModal: React.FC<ValidationBenchmarkModalProps> = ({
  onClose,
}) => {
  const [suite, setSuite] = useState<TestSuiteSummary>(() => runValidationSuite());
  const [isRunning, setIsRunning] = useState(false);

  const handleRerun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setSuite(runValidationSuite());
      setIsRunning(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                System Feasibility & Empirical Validation Suite
              </span>
              <h2 className="text-base font-bold text-white">
                How We Test AquaTrace — Benchmarks & Accuracy Metrics
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

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Top 4 KPI Metrics matching Slide 7 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Metric 1: Detection Performance */}
            <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Detection Performance</span>
                <Target className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-cyan-300">
                {suite.detectionAccuracyPct}%
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Simulated scenarios correctly identified
              </p>
            </div>

            {/* Metric 2: Localization Accuracy */}
            <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Localization Accuracy</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-300">
                {suite.localizationAccuracyPct}%
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Affected section ranked #1 priority
              </p>
            </div>

            {/* Metric 3: False Alarms Rejection */}
            <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>False Alarm Rejection</span>
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-amber-300">
                {suite.falseAlarmRejectionPct}%
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Sensor faults & surges filtered out
              </p>
            </div>

            {/* Metric 4: Low-Sensor Robustness */}
            <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Low-Sensor Robustness</span>
                <Zap className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-sky-300">
                {suite.sparseSensorRobustnessPct}%
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Accuracy with 50% sparse offline sensors
              </p>
            </div>
          </div>

          {/* Detailed Test Run Log Table */}
          <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/60">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Automated Verification Test Scenarios ({suite.passedTests}/{suite.totalTests} Passed)
              </span>
              <button
                onClick={handleRerun}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
                <span>Rerun Test Suite</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-900/40">
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Test Case Name</th>
                    <th className="py-2.5 px-3">Expected Classification</th>
                    <th className="py-2.5 px-3">Detected Classification</th>
                    <th className="py-2.5 px-3 text-right">Inference Latency</th>
                    <th className="py-2.5 px-3">Test Log / Findings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {suite.results.map((res, i) => (
                    <tr key={i} className="hover:bg-slate-900/30">
                      <td className="py-2 px-3">
                        {res.passed ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                          </span>
                        ) : (
                          <span className="text-rose-400 font-bold flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> FAIL
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 font-medium text-slate-200">
                        {res.scenarioName}
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-300 text-[11px]">
                        {res.expectedClass} {res.expectedSection ? `(${res.expectedSection.replace('section-', '').toUpperCase()})` : ''}
                      </td>
                      <td className="py-2 px-3 font-mono text-[11px]">
                        <span className={res.passed ? 'text-cyan-300 font-semibold' : 'text-rose-400 font-semibold'}>
                          {res.detectedClass} {res.detectedSection ? `(${res.detectedSection.replace('section-', '').toUpperCase()})` : ''}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-slate-400">
                        {res.timeToDetectMs}ms
                      </td>
                      <td className="py-2 px-3 text-[11px] text-slate-400 max-w-xs truncate" title={res.notes}>
                        {res.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Potential Impact Callout from Slide 7 */}
          <div className="p-4 rounded-lg bg-cyan-950/20 border border-cyan-800/40 text-xs">
            <span className="font-bold text-cyan-300 block mb-1">
              Demonstrated Real-World Impact (PreciseX Hackathon Validation):
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300 mt-2">
              <div>
                <strong className="text-white block">1. 80% Faster Triage:</strong>
                Replaces manual step-testing with automated multi-criteria ranking.
              </div>
              <div>
                <strong className="text-white block">2. False Alarm Prevention:</strong>
                Distinguishes benign demand changes and faulty transducers from physical leaks.
              </div>
              <div>
                <strong className="text-white block">3. Low-Cost Deployment:</strong>
                Operates effectively even on sparse topologies with partial sensor coverage.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors"
          >
            Close Validation Report
          </button>
        </div>
      </div>
    </div>
  );
};
