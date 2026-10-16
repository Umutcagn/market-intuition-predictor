import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  createChart, 
  CandlestickSeries, 
  HistogramSeries, 
  LineStyle, 
  CrosshairMode, 
  ColorType 
} from 'lightweight-charts';
import { Target, ArrowUpRight, ArrowDownRight, Eye } from 'lucide-react';

export default function TradingChart({ 
  scenario, 
  gameState, // 'PREDICTING' | 'REVEALED'
  userPrediction, // { direction: 'LONG' | 'SHORT', targetPrice?: number }
  onTargetSelect,
  revealedCount // for step-by-step candle reveal animation
}) {
  const chartContainerRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const targetPriceLineRef = useRef(null);
  const lastPriceLineRef = useRef(null);
  
  const [hoveredPrice, setHoveredPrice] = useState(null);
  const [chartReady, setChartReady] = useState(false);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Reset container
    chartContainerRef.current.innerHTML = '';

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight || 520,
      layout: {
        background: { type: ColorType.Solid, color: '#020617' },
        textColor: '#94a3b8',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
      },
      grid: {
        vertLines: { color: '#0f172a' },
        horzLines: { color: '#0f172a' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: '#334155',
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: '#1e293b',
        },
        horzLine: {
          color: '#334155',
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: '#1e293b',
        },
      },
      rightPriceScale: {
        borderColor: '#1e293b',
        scaleMargins: {
          top: 0.1,
          bottom: 0.22, // leave room for volume
        },
      },
      timeScale: {
        borderColor: '#1e293b',
        visible: false, // hide time to eliminate date-bias
        barSpacing: 10,
        rightOffset: 25, // empty space on right for future projection!
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    });

    chart.priceScale('volume').applyOptions({
      scaleMargins: {
        top: 0.82,
        bottom: 0,
      },
    });

    chartInstanceRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };
    window.addEventListener('resize', handleResize);
    setChartReady(true);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Update scenario candles
  useEffect(() => {
    if (!chartReady || !scenario || !candleSeriesRef.current || !volumeSeriesRef.current) return;

    // Clear previous price lines
    if (targetPriceLineRef.current && candleSeriesRef.current) {
      candleSeriesRef.current.removePriceLine(targetPriceLineRef.current);
      targetPriceLineRef.current = null;
    }
    if (lastPriceLineRef.current && candleSeriesRef.current) {
      candleSeriesRef.current.removePriceLine(lastPriceLineRef.current);
      lastPriceLineRef.current = null;
    }

    // Historical candles
    const BASE_TIMESTAMP = 1700000000;
    const historyData = scenario.history.map((c, i) => ({
      time: BASE_TIMESTAMP + i * 86400,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    const volumeData = scenario.history.map((c, i) => ({
      time: BASE_TIMESTAMP + i * 86400,
      value: c.volume,
      color: c.close >= c.open ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)',
    }));

    // If in revealed mode, append future candles up to revealedCount
    if (gameState === 'REVEALED' && scenario.future) {
      const numToShow = revealedCount !== undefined ? revealedCount : scenario.future.length;
      const futurePortion = scenario.future.slice(0, numToShow);

      futurePortion.forEach((c, idx) => {
        const time = BASE_TIMESTAMP + (scenario.history.length + idx) * 86400;
        historyData.push({
          time,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        });
        volumeData.push({
          time,
          value: c.volume,
          color: c.close >= c.open ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)',
        });
      });
    }

    candleSeriesRef.current.setData(historyData);
    volumeSeriesRef.current.setData(volumeData);

    // Add entry line (last price before reveal)
    const lastPrice = scenario.lastPrice;
    lastPriceLineRef.current = candleSeriesRef.current.createPriceLine({
      price: lastPrice,
      color: '#64748b',
      lineWidth: 1,
      lineStyle: LineStyle.Dotted,
      axisLabelVisible: true,
      title: 'ENTRY REF',
    });

    // Auto-fit contents with appropriate right offset
    chartInstanceRef.current.timeScale().fitContent();

  }, [scenario, gameState, revealedCount, chartReady]);

  // Update target price line if user selected one
  useEffect(() => {
    if (!candleSeriesRef.current) return;

    if (userPrediction?.targetPrice) {
      if (targetPriceLineRef.current) {
        candleSeriesRef.current.removePriceLine(targetPriceLineRef.current);
      }

      const isLong = userPrediction.targetPrice >= scenario.lastPrice;
      targetPriceLineRef.current = candleSeriesRef.current.createPriceLine({
        price: userPrediction.targetPrice,
        color: isLong ? '#22c55e' : '#ef4444',
        lineWidth: 2,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: `TARGET: ${isLong ? '▲ LONG' : '▼ SHORT'}`,
      });
    }
  }, [userPrediction, scenario]);

  // Click on chart to set target price
  const handleChartClick = useCallback((e) => {
    if (gameState !== 'PREDICTING' || !candleSeriesRef.current || !chartContainerRef.current) return;

    const rect = chartContainerRef.current.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const price = candleSeriesRef.current.coordinateToPrice(mouseY);

    if (price && onTargetSelect) {
      const roundedPrice = Number(price.toFixed(2));
      const direction = roundedPrice >= scenario.lastPrice ? 'LONG' : 'SHORT';
      onTargetSelect({
        targetPrice: roundedPrice,
        direction,
        pctFromEntry: Number((((roundedPrice - scenario.lastPrice) / scenario.lastPrice) * 100).toFixed(2))
      });
    }
  }, [gameState, scenario, onTargetSelect]);

  // Mouse move to track live price under cursor
  const handleMouseMove = useCallback((e) => {
    if (gameState !== 'PREDICTING' || !candleSeriesRef.current || !chartContainerRef.current) {
      setHoveredPrice(null);
      return;
    }
    const rect = chartContainerRef.current.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const price = candleSeriesRef.current.coordinateToPrice(mouseY);
    if (price) {
      setHoveredPrice(Number(price.toFixed(2)));
    } else {
      setHoveredPrice(null);
    }
  }, [gameState]);

  return (
    <div className="relative w-full h-[calc(100vh-280px)] min-h-[360px] max-h-[560px] bg-[#020617] rounded-xl border border-[#1e293b] overflow-hidden flex flex-col shadow-2xl">
      
      {/* Top Chart Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e293b]/70 bg-[#0b1120]/60 text-xs font-mono select-none z-10">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[#94a3b8]">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-ping" />
            <span className="font-semibold text-[#f8fafc]">UNIDENTIFIED ASSET</span>
          </span>
          <span className="text-[#475569]">|</span>
          <span className="text-[#64748b]">ENTRY: <span className="text-[#f8fafc] font-bold font-mono-num">${scenario?.lastPrice.toFixed(2)}</span></span>
          <span className="px-2 py-0.5 rounded bg-[#1e293b]/70 text-[#94a3b8] text-[10px] hidden sm:inline">
            {scenario?.marketType}
          </span>
        </div>

        {/* Hover / Prediction HUD */}
        <div className="flex items-center gap-3">
          {hoveredPrice && gameState === 'PREDICTING' && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#94a3b8] bg-[#020617] px-2.5 py-0.5 rounded border border-[#334155]">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span>AIM:</span>
              <span className="font-mono-num font-bold text-[#f8fafc]">${hoveredPrice.toFixed(2)}</span>
              <span className={`font-mono-num font-semibold ${
                hoveredPrice >= scenario?.lastPrice ? 'text-[#22c55e]' : 'text-[#ef4444]'
              }`}>
                ({hoveredPrice >= scenario?.lastPrice ? '+' : ''}
                {(((hoveredPrice - scenario?.lastPrice) / scenario?.lastPrice) * 100).toFixed(2)}%)
              </span>
            </div>
          )}

          {gameState === 'PREDICTING' && (
            <span className="text-[11px] text-[#64748b] hidden md:inline flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-[#64748b]" />
              Click on chart to place target level
            </span>
          )}
        </div>
      </div>

      {/* Lightweight Charts Canvas Area */}
      <div 
        ref={chartContainerRef}
        onClick={handleChartClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredPrice(null)}
        className="w-full flex-1 relative cursor-crosshair"
      />

      {/* Prediction Indicator Overlay */}
      {userPrediction && gameState === 'PREDICTING' && (
        <div className="absolute top-12 left-4 z-20 bg-[#0b1120]/90 backdrop-blur-md border border-[#334155] rounded-lg p-2.5 shadow-xl flex items-center gap-3 font-mono text-xs animate-in fade-in">
          <div className={`p-1.5 rounded ${
            userPrediction.direction === 'LONG' ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#ef4444]/20 text-[#ef4444]'
          }`}>
            {userPrediction.direction === 'LONG' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#f8fafc]">TARGET SELECTED:</span>
              <span className={`font-bold ${
                userPrediction.direction === 'LONG' ? 'text-[#22c55e]' : 'text-[#ef4444]'
              }`}>
                {userPrediction.direction}
              </span>
            </div>
            {userPrediction.targetPrice && (
              <p className="text-[11px] text-[#94a3b8] font-mono-num">
                ${userPrediction.targetPrice} ({userPrediction.pctFromEntry >= 0 ? '+' : ''}{userPrediction.pctFromEntry}%)
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
