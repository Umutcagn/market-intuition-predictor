import React from 'react';
import { 
  Flame, 
  Target, 
  Clock, 
  RotateCcw, 
  HelpCircle, 
  Activity, 
  Zap, 
  Layers 
} from 'lucide-react';

export default function Navbar({ 
  streak, 
  totalTrials, 
  correctCount, 
  avgTime, 
  currentTrialIndex, 
  maxTrials, 
  onReset, 
  onOpenHelp,
  selectedMarket,
  onSelectMarket
}) {
  const accuracy = totalTrials > 0 ? Math.round((correctCount / totalTrials) * 100) : 0;

  return (
    <header className="border-b border-[#1e293b] bg-[#020617]/90 backdrop-blur-md sticky top-0 z-40 select-none">
      <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Concept Tag */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#22c55e]/20 to-[#10b981]/5 border border-[#22c55e]/40 flex items-center justify-center shadow-lg shadow-[#22c55e]/10">
            <Activity className="w-5 h-5 text-[#22c55e]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold tracking-wider text-[#f8fafc]">
                CHART<span className="text-[#22c55e]">SEXING</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono tracking-tight bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30 rounded">
                PRO-V1
              </span>
            </div>
            <p className="text-[11px] text-[#64748b] tracking-wide font-mono hidden sm:block">
              Perceptual Learning & Intuition Engine
            </p>
          </div>
        </div>

        {/* Market Filter Chips */}
        <div className="hidden md:flex items-center gap-1.5 bg-[#0b1120] border border-[#1e293b] p-1 rounded-lg text-xs font-mono">
          {['ALL', 'CRYPTO', 'BIST', 'US TECH', 'COMMODITY'].map((market) => (
            <button
              key={market}
              onClick={() => onSelectMarket(market)}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedMarket === market 
                  ? 'bg-[#1e293b] text-[#22c55e] font-semibold shadow-sm' 
                  : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b]/50'
              }`}
            >
              {market}
            </button>
          ))}
        </div>

        {/* Live Performance Matrix */}
        <div className="flex items-center gap-2 sm:gap-4 font-mono text-xs">
          
          {/* Win Streak */}
          <div className="flex items-center gap-1.5 bg-[#0b1120] border border-[#1e293b] px-3 py-1.5 rounded-lg">
            <Flame className={`w-4 h-4 ${streak > 0 ? 'text-amber-500 animate-pulse' : 'text-[#64748b]'}`} />
            <div>
              <span className="text-[10px] text-[#64748b] block leading-none">STREAK</span>
              <span className={`font-mono-num font-bold ${streak > 2 ? 'text-amber-400' : 'text-[#f8fafc]'}`}>
                {streak}
              </span>
            </div>
          </div>

          {/* Accuracy */}
          <div className="flex items-center gap-1.5 bg-[#0b1120] border border-[#1e293b] px-3 py-1.5 rounded-lg">
            <Target className="w-4 h-4 text-[#22c55e]" />
            <div>
              <span className="text-[10px] text-[#64748b] block leading-none">ACCURACY</span>
              <span className="font-mono-num font-bold text-[#f8fafc]">
                {accuracy}% <span className="text-[10px] text-[#64748b] font-normal">({correctCount}/{totalTrials})</span>
              </span>
            </div>
          </div>

          {/* Avg Instinct Speed */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#0b1120] border border-[#1e293b] px-3 py-1.5 rounded-lg">
            <Zap className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-[10px] text-[#64748b] block leading-none">SPEED</span>
              <span className="font-mono-num font-bold text-[#f8fafc]">
                {avgTime > 0 ? `${avgTime.toFixed(1)}s` : '--'}
              </span>
            </div>
          </div>

          {/* Round Counter */}
          <div className="flex items-center gap-1.5 bg-[#0b1120] border border-[#1e293b] px-3 py-1.5 rounded-lg">
            <Layers className="w-4 h-4 text-purple-400" />
            <div>
              <span className="text-[10px] text-[#64748b] block leading-none">TRIAL</span>
              <span className="font-mono-num font-bold text-[#f8fafc]">
                {currentTrialIndex + 1}<span className="text-[#64748b]">/{maxTrials}</span>
              </span>
            </div>
          </div>

          {/* Reset & Help */}
          <div className="flex items-center gap-1 border-l border-[#1e293b] pl-2 sm:pl-3">
            <button 
              onClick={onReset}
              title="Reset stats (R)"
              className="p-1.5 text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b] rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button 
              onClick={onOpenHelp}
              title="What is Chicken Sexing?"
              className="p-1.5 text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b] rounded-lg transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
