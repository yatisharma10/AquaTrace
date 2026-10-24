import React, { useState, useEffect, useRef } from 'react';
import { 
  PipelineSection, 
  SensorNode, 
  SectionId, 
  TelemetryDataPoint, 
  SuggestedAction 
} from './types/pipeline';
import { 
  INITIAL_SIMULATION_STATE, 
  INITIAL_SECTIONS, 
  INITIAL_SENSOR_NODES, 
  SimulationState, 
  calculateHydraulics 
} from './utils/hydraulicEngine';
import { Header } from './components/Header';
import { WorkflowStepsBar } from './components/WorkflowStepsBar';
import { PipelineMap } from './components/PipelineMap';
import { InspectionTable } from './components/InspectionTable';
import { ImpostorClassifier } from './components/ImpostorClassifier';
import { WaterLossEstimator } from './components/WaterLossEstimator';
import { ScenarioControls } from './components/ScenarioControls';
import { TelemetryCharts } from './components/TelemetryCharts';
import { WorkOrderModal } from './components/WorkOrderModal';
import { ValidationBenchmarkModal } from './components/ValidationBenchmarkModal';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Wrench, 
  Sliders, 
  ShieldCheck, 
  Droplet,
  ExternalLink,
  Info
} from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'overview' | 'schematic' | 'priority' | 'classifier' | 'estimator' | 'benchmarks'>('overview');
  
  // Modals
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [isBenchmarkModalOpen, setIsBenchmarkModalOpen] = useState(false);
  const [inspectingSection, setInspectingSection] = useState<PipelineSection | null>(null);
  
  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Simulation State
  const [simState, setSimState] = useState<SimulationState>(INITIAL_SIMULATION_STATE);
  const [selectedSectionId, setSelectedSectionId] = useState<SectionId | null>('section-b');

  // Telemetry History for Charts
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryDataPoint[]>([]);

  // Calculate current physics
  const hydraulicResult = calculateHydraulics(simState);
  const { sections, sensors, diagnostic, waterStats, inflowTotalLpm, outflowTotalLpm, massDiscrepancyLpm } = hydraulicResult;

  // Active step in the 4-step workflow
  const activeStep: 1 | 2 | 3 | 4 = 
    diagnostic.classification === 'REAL_LEAK' ? 4 :
    diagnostic.classification === 'SENSOR_FAULT' ? 3 :
    diagnostic.classification === 'DEMAND_SURGE' ? 2 : 1;

  // Show temporary toast message
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Real-time Simulation Clock Loop
  useEffect(() => {
    if (!simState.isRunning) return;

    const interval = setInterval(() => {
      setSimState(prev => {
        const deltaSec = 1 * prev.speed;
        const newTime = prev.timeSec + deltaSec;

        // Add cumulative water loss if leak is active
        const activeLeak = prev.activeLeakSection ? prev.leakRateLpm : 0;
        const addedLiters = (activeLeak / 60) * deltaSec;

        return {
          ...prev,
          timeSec: newTime,
          cumulativeLossLiters: prev.cumulativeLossLiters + addedLiters,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [simState.isRunning, simState.speed]);

  // Log telemetry point every 1.5s
  useEffect(() => {
    const point: TelemetryDataPoint = {
      timestamp: new Date().toLocaleTimeString(),
      timeSec: simState.timeSec,
      inflowTotalLpm,
      outflowTotalLpm,
      leakRateTotalLpm: waterStats.instantaneousLossLpm,
      avgPressureBar: sensors[1]?.pressureBar ?? 3.9,
      cumulativeLossLiters: waterStats.cumulativeLossLiters,
    };

    setTelemetryHistory(prev => [...prev.slice(-40), point]);
  }, [simState.timeSec]);

  // Valve Toggle Handler
  const handleToggleValve = (sectionId: SectionId) => {
    setSimState(prev => {
      const current = prev.valves[sectionId];
      const updated = !current;
      triggerToast(`${sectionId.toUpperCase()} Isolation Valve ${updated ? 'OPENED - Flow restored' : 'CLOSED - Pipe isolated'}`);
      return {
        ...prev,
        valves: {
          ...prev.valves,
          [sectionId]: updated,
        },
      };
    });
  };

  // Preset Applicator
  const handleApplyPreset = (presetId: 'baseline' | 'micro_leak_b' | 'major_rupture_d' | 'sensor_fault_p3' | 'demand_surge' | 'low_sensor_sparse') => {
    if (presetId === 'baseline') {
      setSimState(prev => ({
        ...prev,
        activeLeakSection: null,
        leakRateLpm: 0,
        activeFaultSensorId: null,
        demandSurgeSection: null,
        demandSurgeLpm: 0,
        lowSensorMode: false,
      }));
      setSelectedSectionId('section-a');
      triggerToast('Applied Scenario: Baseline Nominal Flow');
    } else if (presetId === 'micro_leak_b') {
      setSimState(prev => ({
        ...prev,
        activeLeakSection: 'section-b',
        leakRateLpm: 24.5,
        activeFaultSensorId: null,
        demandSurgeSection: null,
        lowSensorMode: false,
      }));
      setSelectedSectionId('section-b');
      triggerToast('Applied Scenario: Micro-Leak in Section B (Baseline)');
    } else if (presetId === 'major_rupture_d') {
      setSimState(prev => ({
        ...prev,
        activeLeakSection: 'section-d',
        leakRateLpm: 75.0,
        activeFaultSensorId: null,
        demandSurgeSection: null,
        lowSensorMode: false,
      }));
      setSelectedSectionId('section-d');
      triggerToast('Applied Scenario: Emergency Main Rupture in Section D');
    } else if (presetId === 'sensor_fault_p3') {
      setSimState(prev => ({
        ...prev,
        activeLeakSection: null,
        leakRateLpm: 0,
        activeFaultSensorId: 'node-2',
        faultMagnitude: 1.4,
        demandSurgeSection: null,
        lowSensorMode: false,
      }));
      setSelectedSectionId('section-b');
      triggerToast('Applied Scenario: Transducer P-03 Voltage Drift (Impostor #1)');
    } else if (presetId === 'demand_surge') {
      setSimState(prev => ({
        ...prev,
        activeLeakSection: null,
        leakRateLpm: 0,
        activeFaultSensorId: null,
        demandSurgeSection: 'section-d',
        demandSurgeLpm: 45.0,
        lowSensorMode: false,
      }));
      setSelectedSectionId('section-d');
      triggerToast('Applied Scenario: Campus Demand Surge (Impostor #2)');
    } else if (presetId === 'low_sensor_sparse') {
      setSimState(prev => ({
        ...prev,
        lowSensorMode: !prev.lowSensorMode,
      }));
      triggerToast(`Low-Sensor Sparse Array Mode: ${!simState.lowSensorMode ? 'ACTIVATED (2/5 Sensors)' : 'DEACTIVATED (Full Array)'}`);
    }
  };

  // Repair Leak Handler
  const handleRepairLeak = (sectionId: SectionId) => {
    setSimState(prev => ({
      ...prev,
      activeLeakSection: null,
      leakRateLpm: 0,
      valves: {
        ...prev.valves,
        [sectionId]: true,
      },
    }));
    triggerToast(`Pipe Section ${sectionId.toUpperCase()} successfully repaired and pressure certified!`);
  };

  // Calibrate Sensor Handler
  const handleCalibrateSensor = (sensorId: string) => {
    setSimState(prev => ({
      ...prev,
      activeFaultSensorId: null,
      faultMagnitude: 0,
    }));
    triggerToast(`Sensor Transducer ${sensorId} zero-point recalibrated! Reading normalized.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/60 shadow-xl rounded-lg px-4 py-3 flex items-center gap-3 text-xs text-white animate-in slide-in-from-bottom-3 duration-200">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Contract (Wordmark - Navigation Links - Primary CTA) */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'benchmarks') {
            setIsBenchmarkModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenScenarioModal={() => setIsScenarioModalOpen(true)}
        hasActiveLeak={simState.activeLeakSection !== null}
      />

      {/* Slide 3 & 4: 4-Step Process Bar (Monitor, Detect, Investigate, Prioritize) */}
      <WorkflowStepsBar
        hasLeak={simState.activeLeakSection !== null}
        hasFault={simState.activeFaultSensorId !== null}
        hasDemandSurge={simState.demandSurgeSection !== null}
        activeStep={activeStep}
        onStepClick={(step) => {
          if (step === 1 || step === 2) setActiveTab('overview');
          if (step === 3) setActiveTab('classifier');
          if (step === 4) setActiveTab('priority');
        }}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Banner Quick Status & Slide 5 Feature 1 (Low-Sensor) Status */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">System State:</span>
              <span className={`font-mono font-bold ${
                diagnostic.classification === 'REAL_LEAK' ? 'text-rose-400' :
                diagnostic.classification === 'SENSOR_FAULT' ? 'text-amber-400' :
                diagnostic.classification === 'DEMAND_SURGE' ? 'text-sky-400' : 'text-emerald-400'
              }`}>
                {diagnostic.classification}
              </span>
            </div>
            <span className="text-slate-700">·</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Total Inflow:</span>
              <span className="font-mono font-bold text-slate-200 tabular-nums">{inflowTotalLpm} L/min</span>
            </div>
            <span className="text-slate-700">·</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Delivered Outflow:</span>
              <span className="font-mono font-bold text-slate-200 tabular-nums">{outflowTotalLpm} L/min</span>
            </div>
            {massDiscrepancyLpm > 0 && (
              <>
                <span className="text-slate-700">·</span>
                <div className="flex items-center gap-2">
                  <span className="text-rose-400 font-semibold">Loss Deficit:</span>
                  <span className="font-mono font-bold text-rose-300 tabular-nums">+{massDiscrepancyLpm} L/min</span>
                </div>
              </>
            )}
            <span className="text-slate-700">·</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Sensor Network:</span>
              <span className={`font-semibold ${simState.lowSensorMode ? 'text-amber-400' : 'text-cyan-400'}`}>
                {simState.lowSensorMode ? 'Sparse Array (2/5 Active)' : 'Full Density (5/5 Active)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsBenchmarkModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/50 rounded-lg border border-cyan-800 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Empirical Validation Report</span>
            </button>
          </div>
        </div>

        {/* View Routing */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Interactive Pipeline Schematic */}
            <PipelineMap
              sections={sections}
              sensors={sensors}
              selectedSectionId={selectedSectionId}
              onSelectSection={setSelectedSectionId}
              onToggleValve={handleToggleValve}
              lowSensorMode={simState.lowSensorMode}
              onToggleLowSensorMode={() => setSimState(prev => ({ ...prev, lowSensorMode: !prev.lowSensorMode }))}
              onInspectSection={setInspectingSection}
              activeLeakSection={simState.activeLeakSection}
              activeFaultSensorId={simState.activeFaultSensorId}
            />

            {/* Illustrative Dashboard Output (Slide 4 Table) */}
            <InspectionTable
              sections={sections}
              selectedSectionId={selectedSectionId}
              onSelectSection={setSelectedSectionId}
              onInspectSection={setInspectingSection}
              onToggleValve={handleToggleValve}
            />

            {/* Live Telemetry Curves */}
            <TelemetryCharts
              history={telemetryHistory}
              currentInflow={inflowTotalLpm}
              currentOutflow={outflowTotalLpm}
              massDiscrepancy={massDiscrepancyLpm}
              sections={sections}
              sensors={sensors}
            />

            {/* Impostor Classifier (Slide 5 Feature 2) */}
            <ImpostorClassifier
              diagnostic={diagnostic}
              massDiscrepancyLpm={massDiscrepancyLpm}
              onSelectPreset={(p) => {
                if (p === 'normal') handleApplyPreset('baseline');
                if (p === 'micro_leak') handleApplyPreset('micro_leak_b');
                if (p === 'sensor_fault') handleApplyPreset('sensor_fault_p3');
                if (p === 'demand_surge') handleApplyPreset('demand_surge');
              }}
            />

            {/* Water-Loss Estimator (Slide 5 Feature 4) */}
            <WaterLossEstimator
              stats={waterStats}
              inflowTotalLpm={inflowTotalLpm}
              outflowTotalLpm={outflowTotalLpm}
              onResetCumulative={() => setSimState(prev => ({ ...prev, cumulativeLossLiters: 0 }))}
            />

            {/* Scenario Simulator Controls (Slide 5 Feature 5) */}
            <ScenarioControls
              isRunning={simState.isRunning}
              onTogglePlay={() => setSimState(prev => ({ ...prev, isRunning: !prev.isRunning }))}
              speed={simState.speed}
              onChangeSpeed={(spd) => setSimState(prev => ({ ...prev, speed: spd }))}
              onReset={() => setSimState(INITIAL_SIMULATION_STATE)}
              lowSensorMode={simState.lowSensorMode}
              onToggleLowSensorMode={() => setSimState(prev => ({ ...prev, lowSensorMode: !prev.lowSensorMode }))}
              activeLeakSection={simState.activeLeakSection}
              leakRateLpm={simState.leakRateLpm}
              activeFaultSensorId={simState.activeFaultSensorId}
              demandSurgeSection={simState.demandSurgeSection}
              demandSurgeLpm={simState.demandSurgeLpm}
              onApplyPreset={handleApplyPreset}
              onSetLeak={(sec, rate) => setSimState(prev => ({ ...prev, activeLeakSection: sec, leakRateLpm: rate }))}
              onSetFault={(sId, mag) => setSimState(prev => ({ ...prev, activeFaultSensorId: sId, faultMagnitude: mag }))}
              onSetDemandSurge={(sec, surge) => setSimState(prev => ({ ...prev, demandSurgeSection: sec, demandSurgeLpm: surge }))}
            />
          </div>
        )}

        {activeTab === 'schematic' && (
          <div className="space-y-6">
            <PipelineMap
              sections={sections}
              sensors={sensors}
              selectedSectionId={selectedSectionId}
              onSelectSection={setSelectedSectionId}
              onToggleValve={handleToggleValve}
              lowSensorMode={simState.lowSensorMode}
              onToggleLowSensorMode={() => setSimState(prev => ({ ...prev, lowSensorMode: !prev.lowSensorMode }))}
              onInspectSection={setInspectingSection}
              activeLeakSection={simState.activeLeakSection}
              activeFaultSensorId={simState.activeFaultSensorId}
            />
            <TelemetryCharts
              history={telemetryHistory}
              currentInflow={inflowTotalLpm}
              currentOutflow={outflowTotalLpm}
              massDiscrepancy={massDiscrepancyLpm}
              sections={sections}
              sensors={sensors}
            />
          </div>
        )}

        {activeTab === 'priority' && (
          <div className="space-y-6">
            <InspectionTable
              sections={sections}
              selectedSectionId={selectedSectionId}
              onSelectSection={setSelectedSectionId}
              onInspectSection={setInspectingSection}
              onToggleValve={handleToggleValve}
            />
          </div>
        )}

        {activeTab === 'classifier' && (
          <div className="space-y-6">
            <ImpostorClassifier
              diagnostic={diagnostic}
              massDiscrepancyLpm={massDiscrepancyLpm}
              onSelectPreset={(p) => {
                if (p === 'normal') handleApplyPreset('baseline');
                if (p === 'micro_leak') handleApplyPreset('micro_leak_b');
                if (p === 'sensor_fault') handleApplyPreset('sensor_fault_p3');
                if (p === 'demand_surge') handleApplyPreset('demand_surge');
              }}
            />
          </div>
        )}

        {activeTab === 'estimator' && (
          <div className="space-y-6">
            <WaterLossEstimator
              stats={waterStats}
              inflowTotalLpm={inflowTotalLpm}
              outflowTotalLpm={outflowTotalLpm}
              onResetCumulative={() => setSimState(prev => ({ ...prev, cumulativeLossLiters: 0 }))}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 px-6 py-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-300">AquaTrace</span>
            <span className="text-slate-600">·</span>
            <span>Hackathon Track: Tech Innovation</span>
            <span className="text-slate-600">·</span>
            <span>Team PreciseX</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <span>Find the Leak. Save Every Drop.</span>
          </div>
        </div>
      </footer>

      {/* Scenario Simulator Modal */}
      {isScenarioModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Interactive Scenario Simulator & Controls</h3>
              </div>
              <button
                onClick={() => setIsScenarioModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-4 max-h-[80vh] overflow-y-auto">
              <ScenarioControls
                isRunning={simState.isRunning}
                onTogglePlay={() => setSimState(prev => ({ ...prev, isRunning: !prev.isRunning }))}
                speed={simState.speed}
                onChangeSpeed={(spd) => setSimState(prev => ({ ...prev, speed: spd }))}
                onReset={() => setSimState(INITIAL_SIMULATION_STATE)}
                lowSensorMode={simState.lowSensorMode}
                onToggleLowSensorMode={() => setSimState(prev => ({ ...prev, lowSensorMode: !prev.lowSensorMode }))}
                activeLeakSection={simState.activeLeakSection}
                leakRateLpm={simState.leakRateLpm}
                activeFaultSensorId={simState.activeFaultSensorId}
                demandSurgeSection={simState.demandSurgeSection}
                demandSurgeLpm={simState.demandSurgeLpm}
                onApplyPreset={(p) => {
                  handleApplyPreset(p);
                  setIsScenarioModalOpen(false);
                }}
                onSetLeak={(sec, rate) => setSimState(prev => ({ ...prev, activeLeakSection: sec, leakRateLpm: rate }))}
                onSetFault={(sId, mag) => setSimState(prev => ({ ...prev, activeFaultSensorId: sId, faultMagnitude: mag }))}
                onSetDemandSurge={(sec, surge) => setSimState(prev => ({ ...prev, demandSurgeSection: sec, demandSurgeLpm: surge }))}
              />
            </div>
          </div>
        </div>
      )}

      {/* Slide 7 Validation Benchmarks Modal */}
      {isBenchmarkModalOpen && (
        <ValidationBenchmarkModal
          onClose={() => setIsBenchmarkModalOpen(false)}
        />
      )}

      {/* Field Work Order Modal */}
      {inspectingSection && (
        <WorkOrderModal
          section={inspectingSection}
          onClose={() => setInspectingSection(null)}
          onRepairLeak={handleRepairLeak}
          onCalibrateSensor={handleCalibrateSensor}
          onToggleValve={handleToggleValve}
          isFaultySensorActive={simState.activeFaultSensorId !== null}
        />
      )}
    </div>
  );
}
