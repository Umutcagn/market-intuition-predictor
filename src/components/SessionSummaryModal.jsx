import React from 'react';
import { Award, RotateCcw, Play, CheckCircle2, TrendingUp, Zap, Sparkles } from 'lucide-react';

export default function SessionSummaryModal({ 
  isOpen, 
  stats, 
  onRestart, 
  onContinueUnlimited 
}) {
  if (!isOpen) return null;

  const { total, correct, maxStreak, avgSpeed } = stats;
  const winRate = total > 0 ? Math.round((correct / total) * 100) : 0;

  // Derive trader archetype based on stats
  let archetype = "Visual Apprentice";
  let description = "Keep training to sharpen your subconscious pattern recognition.";
  if (winRate >= 80) {
    archetype = "Master Pattern Instinct";
    description = "Exceptional subconscious calibration. You spot institutional order flow before it forms.";
  } else if (winRate >= 60) {
    archetype = "Momentum Scalper";
    description = "Strong directional bias. Your instincts are well above market coin-flip odds.";
  } else if (winRate >= 40) {
    archetype = "Discretionary Trader";
    description = "Decent sensitivity, but occasionally trapped by liquidity sweeps and fakeouts.";
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b1120] border border-[#1e293b] rounded-2xl max-w-lg w-full p-6 sm:p-8 font-mono text-[#f8fafc] shadow-2xl animate-in zoom-in-95 duration-150 relative">
        
        {/* Header Icon */}
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#22c55e]/15 border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e] mb-4 shadow-lg shadow-[#22c55e]/10">
          <Award className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold text-center tracking-tight">Session Complete</h2>
        <p className="text-xs text-[#94a3b8] text-center mt-1">5-Round Instinct Calibration Diagnostic</p>

        {/* Archetype Card */}
        <div className="my-6 p-4 rounded-xl bg-[#020617] border border-[#1e293b] text-center">
          <span className="text-[10px] text-[#22c55e] font-bold tracking-widest uppercase block mb-1">
            Trader Archetype
          </span>
          <h3 className="text-lg font-bold text-[#f8fafc]">{archetype}</h3>
          <p className="text-xs text-[#94a3b8] mt-1">{description}</p>
        </div>

        {/* Score Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6 text-center text-xs">
          <div className="p-3 bg-[#020617] border border-[#1e293b] rounded-lg">
            <span className="text-[10px] text-[#64748b] block">WIN RATE</span>
            <span className={`text-xl font-bold font-mono-num ${
              winRate >= 60 ? 'text-[#22c55e]' : winRate >= 40 ? 'text-amber-400' : 'text-[#ef4444]'
            }`}>
              {winRate}%
            </span>
            <span className="text-[10px] text-[#64748b]">({correct}/{total})</span>
          </div>

          <div className="p-3 bg-[#020617] border border-[#1e293b] rounded-lg">
            <span className="text-[10px] text-[#64748b] block">MAX STREAK</span>
            <span className="text-xl font-bold font-mono-num text-amber-400">
              {maxStreak}
            </span>
            <span className="text-[10px] text-[#64748b]">Consecutive</span>
          </div>

          <div className="p-3 bg-[#020617] border border-[#1e293b] rounded-lg">
            <span className="text-[10px] text-[#64748b] block">AVG SPEED</span>
            <span className="text-xl font-bold font-mono-num text-cyan-400">
              {avgSpeed > 0 ? `${avgSpeed.toFixed(1)}s` : '--'}
            </span>
            <span className="text-[10px] text-[#64748b]">Reaction</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRestart}
            className="flex-1 py-3 px-4 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-[#f8fafc] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESET 5-TRIAL RUN</span>
          </button>

          <button
            onClick={onContinueUnlimited}
            className="flex-1 py-3 px-4 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-[#22c55e]/20"
          >
            <Play className="w-4 h-4" />
            <span>UNLIMITED PRACTICE</span>
          </button>
        </div>

      </div>
    </div>
  );
}
