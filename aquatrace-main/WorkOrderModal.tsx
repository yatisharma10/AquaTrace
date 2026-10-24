import React, { useState } from 'react';
import { PipelineSection } from '../types/pipeline';
import { 
  X, 
  Wrench, 
  CheckCircle2, 
  MapPin, 
  Layers, 
  ShieldAlert, 
  Sliders, 
  FileText,
  AlertCircle
} from 'lucide-react';

interface WorkOrderModalProps {
  section: PipelineSection;
  onClose: () => void;
  onRepairLeak: (sectionId: PipelineSection['id']) => void;
  onCalibrateSensor: (sensorId: string) => void;
  onToggleValve: (sectionId: PipelineSection['id']) => void;
  isFaultySensorActive: boolean;
}

export const WorkOrderModal: React.FC<WorkOrderModalProps> = ({
  section,
  onClose,
  onRepairLeak,
  onCalibrateSensor,
  onToggleValve,
  isFaultySensorActive,
}) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [technicianNotes, setTechnicianNotes] = useState(
    'Acoustic sounding confirms high-frequency vibration characteristic of pressurized pipe orifice discharge near Access Chamber #4.'
  );

  const toggleStep = (stepIdx: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepIdx) ? prev.filter(s => s !== stepIdx) : [...prev, stepIdx]
    );
  };

  const isLeak = section.status === 'possible_leak';
  const isSensorUncertain = section.status === 'sensor_uncertain' || isFaultySensorActive;

  const inspectionSteps = isLeak ? [
    'Deploy acoustic listening rod on Chamber #4 valve stem to verify acoustic frequency (2.4 - 3.8 kHz).',
    'Verify localized pressure drop with secondary calibrated test gauge at tap B-2.',
    'Isolate Valve V-02 to contain pressure drop and confirm upstream hydraulic recovery.',
    'Excavate test pit (depth 1.1m) and install mechanical stainless repair sleeve on breached segment.',
    'Conduct 15-minute hydrostatic test at 4.0 bar to certify seal integrity before backfilling.',
  ] : [
    'Inspect telemetry wiring harness and terminal blocks for moisture ingress or corrosion.',
    'Run digital multimeter loop test (4-20mA transducer circuit) against zero-pressure datum.',
    'Recalibrate transducer zero-point and span using portable pneumatic deadweight tester.',
    'Verify real-time telemetry coherence with upstream manifold hub node P-02.',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isLeak ? 'bg-rose-950/60 text-rose-400 border border-rose-800' : 'bg-cyan-950/60 text-cyan-400 border border-cyan-800'}`}>
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Dispatch Protocol WO-2026-OCT-8419
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-[11px] font-bold text-rose-400">PRIORITY RANK #{section.priorityScore > 70 ? '1' : '2'}</span>
              </div>
              <h2 className="text-base font-bold text-white">
                {isLeak ? 'Field Leak Inspection & Repair Order' : 'Sensor Calibration & Verification Order'}
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
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Target Infrastructure Summary */}
          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Target Pipe</span>
                <span className="font-bold text-white font-mono">{section.name}</span>
                <span className="text-[10px] text-slate-400 block">{section.label}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Material & Spec</span>
                <span className="font-semibold text-slate-200">{section.material}</span>
                <span className="text-[10px] text-slate-400 block font-mono">Ø{section.pipeDiameterMm}mm · {section.lengthMeters}m</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Physical Access Point</span>
                <span className="font-semibold text-slate-200 block truncate" title={section.accessLocation}>
                  {section.accessLocation}
                </span>
                <span className="text-[10px] text-slate-400 block">Depth: {section.depthMeters}m</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Isolation Valve</span>
                <span className="font-mono font-bold text-slate-200 block">{section.valveId}</span>
                <span className={`text-[10px] font-semibold ${section.isValveOpen ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {section.isValveOpen ? 'Currently OPEN' : 'Currently ISOLATED'}
                </span>
              </div>
            </div>
          </div>

          {/* Diagnostic Evidence & Hypothesis */}
          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
            <span className="font-bold text-slate-300 block mb-1">
              AquaTrace AI Automated Diagnostic Findings:
            </span>
            {isLeak ? (
              <p className="text-slate-400 leading-relaxed">
                Persistent mass balance deviation of <strong className="text-rose-400 font-mono">+{section.estimatedWaterLossLpm} L/min</strong> coupled with localized pressure depression to <strong className="text-slate-200 font-mono">{section.pressureBar} bar</strong>. Acoustic listening equipment recommended to pinpoint ground coordinates prior to excavation.
              </p>
            ) : (
              <p className="text-slate-400 leading-relaxed">
                Transducer voltage reading drifted outside expected hydraulic envelope without corresponding pressure depression at adjacent manifold hub P-02. Suspected zero-offset or ground fault.
              </p>
            )}
          </div>

          {/* Standard Operating Procedure (SOP) Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Field Execution Checklist ({completedSteps.length}/{inspectionSteps.length})
              </span>
              <span className="text-[11px] text-slate-400">
                Click steps to mark progress
              </span>
            </div>

            <div className="space-y-2">
              {inspectionSteps.map((step, idx) => {
                const isDone = completedSteps.includes(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`w-full text-left p-3 rounded-lg border text-xs flex items-start gap-3 transition-colors ${
                      isDone 
                        ? 'border-emerald-600/60 bg-emerald-950/20 text-emerald-200' 
                        : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${isDone ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span className={isDone ? 'line-through text-slate-400' : 'text-slate-300'}>
                      {step}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Technician Field Log */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Technician Field Log & Observations
            </label>
            <textarea
              value={technicianNotes}
              onChange={(e) => setTechnicianNotes(e.target.value)}
              rows={2}
              className="w-full text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleValve(section.id)}
              className={`px-3 py-2 text-xs font-semibold rounded border transition-colors ${
                section.isValveOpen 
                  ? 'border-rose-700 bg-rose-950/40 text-rose-300 hover:bg-rose-900/40' 
                  : 'border-emerald-700 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/40'
              }`}
            >
              {section.isValveOpen ? `Emergency Shut Valve ${section.valveId}` : `Reopen Valve ${section.valveId}`}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
            >
              Dismiss
            </button>

            {isLeak && (
              <button
                onClick={() => {
                  onRepairLeak(section.id);
                  onClose();
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Repaired & Restore Baseline</span>
              </button>
            )}

            {isSensorUncertain && (
              <button
                onClick={() => {
                  onCalibrateSensor('node-2');
                  onClose();
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors flex items-center gap-2"
              >
                <Sliders className="w-4 h-4" />
                <span>Recalibrate Sensor</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
