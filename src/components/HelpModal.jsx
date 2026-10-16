import React from 'react';
import { X, Brain, CheckCircle2, Zap, Eye, Compass, ShieldAlert } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b1120] border border-[#1e293b] rounded-2xl max-w-2xl w-full p-6 sm:p-8 font-mono relative text-[#f8fafc] shadow-2xl animate-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-[#94a3b8] hover:text-[#f8fafc] p-1.5 rounded-lg hover:bg-[#1e293b] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#22c55e]/15 border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e]">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">The "Chicken Sexing" Method</h2>
            <p className="text-xs text-[#94a3b8]">Perceptual Learning in Financial Markets</p>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-4 text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
          <div className="p-3.5 bg-[#020617] rounded-xl border border-[#1e293b]">
            <h4 className="font-bold text-[#f8fafc] flex items-center gap-2 mb-1.5">
              <Eye className="w-4 h-4 text-cyan-400" />
              What is Chicken Sexing?
            </h4>
            <p className="text-[#94a3b8] text-xs">
              In cognitive psychology, chick sexing is the classic example of <strong>tacit knowledge</strong>. Expert sorters can determine the sex of newborn chicks in under a second with 99% accuracy—yet they cannot explain the rules or words for how they do it. They learned through high-volume, rapid trial-and-error with immediate ground-truth feedback.
            </p>
          </div>

          <div className="p-3.5 bg-[#020617] rounded-xl border border-[#1e293b]">
            <h4 className="font-bold text-[#f8fafc] flex items-center gap-2 mb-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Why applies to Trading?
            </h4>
            <p className="text-[#94a3b8] text-xs">
              Instead of drawing 50 lagging trendlines and over-analyzing indicators, top traders read order flow and market structure subconsciously. By stripping ticker names and dates, this simulator trains your brain's visual cortex to recognize pure expansion, absorption, and reversal regimes reflexively.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-[#020617] rounded-lg border border-[#1e293b]">
              <span className="text-[#22c55e] font-bold block mb-1">Method 1: Click Chart</span>
              <p className="text-[11px] text-[#94a3b8]">
                Click anywhere on the price scale to project your price target. Hit confirm to test accuracy.
              </p>
            </div>
            <div className="p-3 bg-[#020617] rounded-lg border border-[#1e293b]">
              <span className="text-[#22c55e] font-bold block mb-1">Method 2: Rapid LONG / SHORT</span>
              <p className="text-[11px] text-[#94a3b8]">
                Use keyboard keys [L] and [S] to make sub-second instinct calls and train reflex speed.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#64748b] pt-2">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Educational simulation only. Not financial advice. Past price patterns do not guarantee future returns.</span>
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#22c55e] hover:bg-[#16a34a] text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            START TRAINING
          </button>
        </div>

      </div>
    </div>
  );
}
