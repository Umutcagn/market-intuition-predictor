import React from 'react';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  CheckCircle2, 
  Sparkles, 
  Keyboard, 
  CornerDownLeft 
} from 'lucide-react';

export default function ActionBar({ 
  gameState, 
  userPrediction, 
  onPredict, 
  onConfirmPrediction,
  onNextChart,
  disabled
}) {
  return (
    <div className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl p-4 sm:p-5 select-none shadow-xl">
      {gameState === 'PREDICTING' ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Instructions & Keyboard Shortcuts */}
          <div className="flex items-center gap-3 text-xs font-mono text-[#94a3b8] w-full sm:w-auto justify-center sm:justify-start">
            <Keyboard className="w-4 h-4 text-[#64748b] hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">Shortcuts:</span>
              <kbd className="px-2 py-1 bg-[#1e293b] border border-[#334155] rounded text-[11px] font-bold text-[#f8fafc]">L / ↑</kbd>
              <span>Long</span>
              <span className="text-[#475569]">•</span>
              <kbd className="px-2 py-1 bg-[#1e293b] border border-[#334155] rounded text-[11px] font-bold text-[#f8fafc]">S / ↓</kbd>
              <span>Short</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* If user clicked a target on chart, provide Confirm button */}
            {userPrediction?.targetPrice ? (
              <button
                onClick={onConfirmPrediction}
                disabled={disabled}
                className="w-full sm:w-auto flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-sm tracking-wider shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>CONFIRM TARGET (${userPrediction.targetPrice})</span>
                <kbd className="text-[10px] px-1.5 py-0.5 bg-black/20 rounded">↵ ENTER</kbd>
              </button>
            ) : null}

            {/* Direct LONG Button */}
            <button
              onClick={() => onPredict('LONG')}
              disabled={disabled}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg font-mono font-bold text-sm tracking-wider transition-all cursor-pointer shadow-lg active:scale-95 ${
                userPrediction?.direction === 'LONG'
                  ? 'bg-[#22c55e] text-slate-950 shadow-[#22c55e]/25 ring-2 ring-[#22c55e]'
                  : 'bg-[#22c55e]/15 hover:bg-[#22c55e]/25 text-[#22c55e] border border-[#22c55e]/40'
              }`}
            >
              <ArrowUpCircle className="w-5 h-5 text-current" />
              <span>LONG / BUY</span>
              <kbd className="text-[10px] px-1.5 py-0.5 bg-black/25 rounded font-mono hidden md:inline">L</kbd>
            </button>

            {/* Direct SHORT Button */}
            <button
              onClick={() => onPredict('SHORT')}
              disabled={disabled}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg font-mono font-bold text-sm tracking-wider transition-all cursor-pointer shadow-lg active:scale-95 ${
                userPrediction?.direction === 'SHORT'
                  ? 'bg-[#ef4444] text-white shadow-[#ef4444]/25 ring-2 ring-[#ef4444]'
                  : 'bg-[#ef4444]/15 hover:bg-[#ef4444]/25 text-[#ef4444] border border-[#ef4444]/40'
              }`}
            >
              <ArrowDownCircle className="w-5 h-5 text-current" />
              <span>SHORT / SELL</span>
              <kbd className="text-[10px] px-1.5 py-0.5 bg-black/25 rounded font-mono hidden md:inline">S</kbd>
            </button>
          </div>

        </div>
      ) : (
        /* REVEALED State - Quick Next Candle Button */
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#94a3b8]">
            <Sparkles className="w-4 h-4 text-[#22c55e]" />
            <span>Market simulation completed. Study the revealed candle behavior.</span>
          </div>

          <button
            onClick={onNextChart}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-lg bg-[#f8fafc] hover:bg-slate-200 text-slate-950 font-mono font-bold text-sm tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            <span>NEXT CHART</span>
            <CornerDownLeft className="w-4 h-4" />
            <kbd className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-white rounded font-mono">SPACE</kbd>
          </button>
        </div>
      )}
    </div>
  );
}
