export type SectionId = 'section-a' | 'section-b' | 'section-c' | 'section-d';

export type PipelineStatus = 
  | 'normal' 
  | 'possible_leak' 
  | 'sensor_uncertain' 
  | 'demand_surge' 
  | 'isolated';

export type SuggestedAction = 
  | 'Continue monitoring' 
  | 'Inspect first' 
  | 'Verify sensor' 
  | 'High demand - monitor' 
  | 'Isolate section';

export type DiagnosticClassification = 
  | 'NORMAL' 
  | 'REAL_LEAK' 
  | 'SENSOR_FAULT' 
  | 'DEMAND_SURGE';

export interface PipelineSection {
  id: SectionId;
  name: string; // e.g. "Section A"
  label: string; // e.g. "Main Intake Trunk"
  pipeDiameterMm: number; // e.g. 150
  lengthMeters: number; // e.g. 80
  material: string; // e.g. "Ductile Iron"
  depthMeters: number; // e.g. 1.5
  accessLocation: string; // e.g. "Main Utility Chamber #1"
  inspectionEffortScore: number; // 1 (easy) to 5 (difficult access)
  upstreamNodeId: string;
  downstreamNodeId: string;
  valveId: string;
  isValveOpen: boolean;
  hasDirectSensor: boolean;
  
  // Real-time telemetry
  flowRateLpm: number; // Liters per minute
  baselineFlowLpm: number;
  pressureBar: number;
  baselinePressureBar: number;
  
  // Detection metrics
  status: PipelineStatus;
  leakLikelihoodPct: number; // 0 - 100
  estimatedWaterLossLpm: number;
  priorityScore: number; // calculated multi-criteria rank
  suggestedAction: SuggestedAction;
}

export interface SensorNode {
  id: string;
  name: string;
  type: 'flow_pressure' | 'pressure_only' | 'flow_only';
  location: string;
  active: boolean; // can be toggled in low-sensor mode
  pressureBar: number;
  flowRateLpm?: number;
  isFaulty: boolean;
  faultType?: 'none' | 'drift' | 'freeze' | 'noise';
}

export interface ValveState {
  id: string;
  name: string;
  sectionId: SectionId;
  isOpen: boolean;
}

export interface ScenarioPreset {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  tag: 'Normal' | 'Leak' | 'Fault' | 'Demand' | 'Sparse';
  iconName: string;
  apply: () => void;
}

export interface TelemetryDataPoint {
  timestamp: string;
  timeSec: number;
  inflowTotalLpm: number;
  outflowTotalLpm: number;
  leakRateTotalLpm: number;
  avgPressureBar: number;
  cumulativeLossLiters: number;
}

export interface ImpostorDiagnostic {
  classification: DiagnosticClassification;
  confidencePct: number;
  primarySuspectSection?: SectionId;
  evidence: {
    massBalanceDiscrepancy: number; // L/min difference
    downstreamPressureDrop: number; // bar
    hydraulicNetworkCoherence: boolean; // whether neighboring sensors confirm
    flowDurationSustainedSec: number;
    sensorSignalJitter: number;
  };
  reasoning: string[];
}

export interface WaterLossStats {
  instantaneousLossLpm: number;
  instantaneousLossM3h: number;
  cumulativeLossLiters: number;
  cumulativeLossGallons: number;
  accumulatedCostUsd: number; // Based on $0.0035 per liter
  equivalentHomesDailyWater: number; // 1 home ~= 1100 Liters/day
  carbonPumpingKgCo2: number; // 0.0004 kg CO2 per liter pumped
}

export interface BenchmarkResult {
  scenarioName: string;
  expectedClass: DiagnosticClassification;
  detectedClass: DiagnosticClassification;
  expectedSection?: SectionId;
  detectedSection?: SectionId;
  passed: boolean;
  timeToDetectMs: number;
  notes: string;
}
