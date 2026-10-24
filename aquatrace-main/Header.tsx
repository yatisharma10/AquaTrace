import React from 'react';
import { 
  Droplets, 
  Activity, 
  Layers, 
  Gauge, 
  CheckCircle2, 
  SlidersHorizontal 
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'overview' | 'schematic' | 'priority' | 'classifier' | 'estimator' | 'benchmarks';
  setActiveTab: (tab: 'overview' | 'schematic' | 'priority' | 'classifier' | 'estimator' | 'benchmarks') => void;
  onOpenScenarioModal: () => void;
  hasActiveLeak: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenScenarioModal,
  hasActiveLeak,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
          <Droplets className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('overview'); }} className="text-lg font-bold tracking-tight text-white whitespace-nowrap hover:text-cyan-400 transition-colors">
            AquaTrace
          </a>
        </div>
      </div>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300">
        <button
          onClick={() => setActiveTab('overview')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeTab === 'overview' 
              ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400' 
              : 'hover:text-white'
          }`}
        >
          Mission Control
        </button>

        <button
          onClick={() => setActiveTab('schematic')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeTab === 'schematic' 
              ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400' 
              : 'hover:text-white'
          }`}
        >
          Network Schematic
        </button>

        <button
          onClick={() => setActiveTab('priority')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeTab === 'priority' 
              ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400' 
              : 'hover:text-white'
          }`}
        >
          Inspection Priority
        </button>

        <button
          onClick={() => setActiveTab('classifier')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeTab === 'classifier' 
              ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400' 
              : 'hover:text-white'
          }`}
        >
          Leak vs Impostor Engine
        </button>

        <button
          onClick={() => setActiveTab('estimator')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeTab === 'estimator' 
              ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400' 
              : 'hover:text-white'
          }`}
        >
          Water-Loss Estimator
        </button>

        <button
          onClick={() => setActiveTab('benchmarks')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeTab === 'benchmarks' 
              ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400' 
              : 'hover:text-white'
          }`}
        >
          Validation Suite
        </button>
      </nav>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setActiveTab('overview')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
        >
          <span>Quick Tour</span>
        </button>

        <button
          onClick={onOpenScenarioModal}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors shadow-sm whitespace-nowrap shrink-0"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Test Scenarios</span>
        </button>
      </div>
    </header>
  );
};
