import React from 'react';
import { Eye, ShieldAlert, GitFork, ClipboardList } from 'lucide-react';
import { PipelineStatus } from '../types/pipeline';

interface WorkflowStepsBarProps {
  hasLeak: boolean;
  hasFault: boolean;
  hasDemandSurge: boolean;
  activeStep: 1 | 2 | 3 | 4;
  onStepClick?: (step: 1 | 2 | 3 | 4) => void;
}

export const WorkflowStepsBar: React.FC<WorkflowStepsBarProps> = ({
  hasLeak,
  hasFault,
  hasDemandSurge,
  activeStep,
  onStepClick,
}) => {
  const steps = [
    {
      num: '01',
      title: '1. Monitor Readings',
      desc: 'Sensors track water flow and pressure across all campus pipes in real-time.',
      icon: Eye,
      status: 'Active',
      highlightColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20',
    },
    {
      num: '02',
      title: '2. Detect Missing Water',
      desc: 'Compares water sent from the reservoir vs water received at buildings.',
      icon: ShieldAlert,
      status: (hasLeak || hasFault || hasDemandSurge) ? 'Discrepancy' : 'Equilibrium',
      highlightColor: hasLeak 
        ? 'border-rose-500/40 text-rose-400 bg-rose-950/20' 
        : hasFault 
          ? 'border-amber-500/40 text-amber-400 bg-amber-950/20' 
          : 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
    },
    {
      num: '03',
      title: '3. Filter Impostors',
      desc: 'Distinguishes a true physical leak from a broken sensor or peak demand spike.',
      icon: GitFork,
      status: (hasLeak || hasFault) ? 'Diagnosed' : 'Verified',
      highlightColor: 'border-sky-500/40 text-sky-400 bg-sky-950/20',
    },
    {
      num: '04',
      title: '4. Prioritize Inspection',
      desc: 'Tells repair crews which pipe to inspect first based on severity and ease of access.',
      icon: ClipboardList,
      status: hasLeak ? 'Action Needed' : 'Monitoring',
      highlightColor: hasLeak 
        ? 'border-cyan-400 text-cyan-300 bg-cyan-900/30' 
        : 'border-slate-700 text-slate-400 bg-slate-900/40',
    },
  ];

  return (
    <div className="bg-slate-900/80 border-b border-slate-800 px-6 py-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const stepNum = (idx + 1) as 1 | 2 | 3 | 4;
          const isSelected = activeStep === stepNum;
          return (
            <button
              key={step.num}
              onClick={() => onStepClick?.(stepNum)}
              className={`text-left p-2.5 rounded-lg border transition-all ${
                isSelected 
                  ? 'border-cyan-500 bg-slate-800/90 shadow-sm' 
                  : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono font-bold text-slate-400">
                  {step.num}
                </span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded border font-medium ${step.highlightColor}`}>
                  {step.status}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 mb-0.5">
                <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{step.title}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                {step.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
