import React, { useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Zap, 
  Target, 
  ShieldAlert 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OutcomeModal({ 
  scenario, 
  userPrediction, 
  isCorrect, 
  reactionTime, 
  onNext,
  streak
}) {
  useEffect(() => {
    if (isCorrect) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#22c55e', '#10b981', '#34d399', '#38bdf8']
      });
    }
  }, [isCorrect]);

  const outcome = scenario.outcome;
  const isTargetMode = Boolean(userPrediction?.targetPrice);
  
  // Calculate price proximity if target was specified
  let proximityScore = null;
  if (isTargetMode && userPrediction.targetPrice) {
    const diff = Math.abs(userPrediction.targetPrice - outcome.futureClose);
    const range = Math.max(scenario.lastPrice * 0.1, 1);
    const proximity = Math.max(0, Math.min(100, Math.round((1 - (diff / range)) * 100)));
    proximityScore = proximity;
  }

  return (
    <div className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl p-5 md:p-6 font-mono select-none shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
      
      {/* Background Accent Glow */}
      <div className={`absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none ${
        isCorrect ? 'bg-[#22c55e]' : 'bg-[#ef4444]'
      }`} />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left: Verdict & Outcome Badge */}
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-lg ${
            isCorrect 
              ? 'bg-[#22c55e]/20 border-[#22c55e]/40 text-[#22c55e] shadow-[#22c55e]/10' 
              : 'bg-[#ef4444]/20 border-[#ef4444]/40 text-[#ef4444] shadow-[#ef4444]/10'
          }`}>
            {isCorrect ? <CheckCircle2 className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h3 className={`text-xl font-bold tracking-tight ${
                isCorrect ? 'text-[#22c55e]' : 'text-[#ef4444]'
              }`}>
                {isCorrect ? 'INTUITION VERIFIED' : 'STOPPED OUT / WRONG READ'}
              </h3>
              {streak > 1 && isCorrect && (
                <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded font-bold">
                  🔥 {streak} IN A ROW
                </span>
              )}
            </div>

            <p className="text-sm text-[#94a3b8] mt-1 flex items-center gap-2">
              <span>Market Pattern:</span>
              <span className="text-[#f8fafc] font-semibold bg-[#1e293b] px-2 py-0.5 rounded text-xs">
                {outcome.flavor}
              </span>
            </p>
          </div>
        </div>

        {/* Center: Realized Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto text-xs bg-[#020617]/70 border border-[#1e293b] p-3 rounded-lg">
          <div>
            <span className="text-[#64748b] block text-[10px]">ENTRY PRICE</span>
            <span className="font-mono-num font-bold text-[#f8fafc]">${scenario.lastPrice.toFixed(2)}</span>
          </div>

          <div>
            <span className="text-[#64748b] block text-[10px]">REVEALED CLOSE</span>
            <span className="font-mono-num font-bold text-[#f8fafc]">${outcome.futureClose.toFixed(2)}</span>
          </div>

          <div>
            <span className="text-[#64748b] block text-[10px]">REALIZED MOVE</span>
            <span className={`font-mono-num font-bold flex items-center gap-0.5 ${
              outcome.pctChange >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'
            }`}>
              {outcome.pctChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {outcome.pctChange >= 0 ? '+' : ''}{outcome.pctChange}%
            </span>
          </div>

          <div>
            <span className="text-[#64748b] block text-[10px]">INSTINCT SPEED</span>
            <span className="font-mono-num font-bold text-cyan-400 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {reactionTime ? `${reactionTime.toFixed(1)}s` : '--'}
            </span>
          </div>
        </div>

        {/* Right: Target Accuracy (if target mode) or Next CTA */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          {isTargetMode && (
            <div className="text-right hidden lg:block border-r border-[#1e293b] pr-4">
              <span className="text-[10px] text-[#64748b] block">TARGET PROXIMITY</span>
              <span className={`text-base font-bold font-mono-num ${
                proximityScore > 75 ? 'text-[#22c55e]' : proximityScore > 50 ? 'text-amber-400' : 'text-[#ef4444]'
              }`}>
                {proximityScore}% Match
              </span>
              <span className="text-[10px] text-[#94a3b8] block">
                Target: ${userPrediction.targetPrice} vs ${outcome.futureClose.toFixed(2)}
              </span>
            </div>
          )}

          <button
            onClick={onNext}
            className="w-full md:w-auto px-6 py-3 rounded-lg bg-[#f8fafc] hover:bg-slate-200 text-slate-950 font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            <span>NEXT TRIAL</span>
            <ArrowRight className="w-4 h-4" />
            <kbd className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-white rounded">SPACE</kbd>
          </button>
        </div>

      </div>

    </div>
  );
}
