import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import TradingChart from './components/TradingChart';
import ActionBar from './components/ActionBar';
import OutcomeModal from './components/OutcomeModal';
import HelpModal from './components/HelpModal';
import SessionSummaryModal from './components/SessionSummaryModal';
import rawScenarios from './data/scenarios.json';
import { evaluatePrediction, pickNextScenarioIndex } from './lib/scoring';

const MAX_TRIALS = 5;

export default function App() {
  const [selectedMarket, setSelectedMarket] = useState('ALL');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [gameState, setGameState] = useState('PREDICTING'); // 'PREDICTING' | 'REVEALING' | 'REVEALED'
  const [userPrediction, setUserPrediction] = useState(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [roundStartTime, setRoundStartTime] = useState(Date.now());
  const [reactionTime, setReactionTime] = useState(null);
  
  // Game & Streak Stats
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalTrials, setTotalTrials] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  
  // Modals & Modes
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isUnlimitedMode, setIsUnlimitedMode] = useState(false);

  // Filter scenarios by market type
  const availableScenarios = useMemo(() => {
    if (selectedMarket === 'ALL') return rawScenarios;
    return rawScenarios.filter(s => s.marketType?.toUpperCase() === selectedMarket.toUpperCase());
  }, [selectedMarket]);

  const currentScenario = availableScenarios[scenarioIndex % availableScenarios.length] || rawScenarios[0];

  // Reset timer on new chart
  useEffect(() => {
    setRoundStartTime(Date.now());
    setUserPrediction(null);
    setRevealedCount(0);
    setGameState('PREDICTING');
  }, [scenarioIndex, selectedMarket]);

  // Average instinct speed
  const avgSpeed = useMemo(() => {
    if (reactionTimes.length === 0) return 0;
    const sum = reactionTimes.reduce((a, b) => a + b, 0);
    return sum / reactionTimes.length;
  }, [reactionTimes]);

  // Handle Target Selection from Chart Click
  const handleTargetSelect = useCallback((pred) => {
    if (gameState !== 'PREDICTING') return;
    setUserPrediction(pred);
  }, [gameState]);

  // Execute and reveal prediction
  const lockInPrediction = useCallback((prediction) => {
    if (gameState !== 'PREDICTING') return;

    const timeSpent = (Date.now() - roundStartTime) / 1000;
    setReactionTime(timeSpent);
    setReactionTimes(prev => [...prev, timeSpent]);
    setUserPrediction(prediction);
    setGameState('REVEALING');

    // Future reveal animation (staggered candle painting)
    const totalFutureCandles = currentScenario.future.length;
    let count = 0;
    const interval = setInterval(() => {
      count += 2;
      if (count >= totalFutureCandles) {
        count = totalFutureCandles;
        clearInterval(interval);
        setRevealedCount(totalFutureCandles);
        setGameState('REVEALED');

        // Evaluate outcome
        const won = evaluatePrediction(currentScenario, prediction);

        setTotalTrials(prev => prev + 1);
        if (won) {
          setCorrectCount(prev => prev + 1);
          setStreak(prev => {
            const next = prev + 1;
            setMaxStreak(m => Math.max(m, next));
            return next;
          });
        } else {
          setStreak(0);
        }

        // Check if 5-trial run completed
        if (!isUnlimitedMode && currentTrialIndex + 1 >= MAX_TRIALS) {
          setTimeout(() => {
            setIsSummaryOpen(true);
          }, 1500);
        }

      } else {
        setRevealedCount(count);
      }
    }, 40);

  }, [gameState, roundStartTime, currentScenario, currentTrialIndex, isUnlimitedMode]);

  // Quick Direction Predict (Long / Short buttons)
  const handleQuickPredict = useCallback((direction) => {
    lockInPrediction({ direction });
  }, [lockInPrediction]);

  // Confirm Target Click
  const handleConfirmTarget = useCallback(() => {
    if (userPrediction) {
      lockInPrediction(userPrediction);
    }
  }, [userPrediction, lockInPrediction]);

  // Advance to Next Chart
  const handleNextChart = useCallback(() => {
    if (gameState !== 'REVEALED') return;

    if (!isUnlimitedMode && currentTrialIndex + 1 >= MAX_TRIALS) {
      setIsSummaryOpen(true);
      return;
    }

    setCurrentTrialIndex(prev => prev + 1);
    // Randomize next scenario to prevent sequential bias
    setScenarioIndex(prev => pickNextScenarioIndex(prev, availableScenarios.length));
  }, [gameState, isUnlimitedMode, currentTrialIndex, availableScenarios.length]);

  // Global Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is inside an input or modal is open
      if (isHelpOpen || isSummaryOpen) return;

      if (gameState === 'PREDICTING') {
        if (e.key === 'l' || e.key === 'L' || e.key === 'ArrowUp') {
          e.preventDefault();
          handleQuickPredict('LONG');
        } else if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
          e.preventDefault();
          handleQuickPredict('SHORT');
        } else if (e.key === 'Enter' && userPrediction?.targetPrice) {
          e.preventDefault();
          handleConfirmTarget();
        }
      } else if (gameState === 'REVEALED') {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleNextChart();
        }
      }

      if (e.key === 'r' || e.key === 'R') {
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, userPrediction, isHelpOpen, isSummaryOpen, handleQuickPredict, handleConfirmTarget, handleNextChart]);

  // Reset Session
  const handleReset = () => {
    setStreak(0);
    setCorrectCount(0);
    setTotalTrials(0);
    setCurrentTrialIndex(0);
    setReactionTimes([]);
    setIsSummaryOpen(false);
    setScenarioIndex(prev => pickNextScenarioIndex(prev, availableScenarios.length));
  };

  // Determine isCorrect for outcome banner
  const isCorrect = useMemo(() => {
    if (!userPrediction || gameState !== 'REVEALED') return false;
    return evaluatePrediction(currentScenario, userPrediction);
  }, [userPrediction, gameState, currentScenario]);

  return (
    <div className="min-h-screen bg-[#020617] text-[#f8fafc] flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Navbar 
        streak={streak}
        totalTrials={totalTrials}
        correctCount={correctCount}
        avgTime={avgSpeed}
        currentTrialIndex={currentTrialIndex}
        maxTrials={MAX_TRIALS}
        onReset={handleReset}
        onOpenHelp={() => setIsHelpOpen(true)}
        selectedMarket={selectedMarket}
        onSelectMarket={setSelectedMarket}
      />

      {/* Main Terminal Screen */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 py-3 sm:px-6 sm:py-3.5 flex flex-col gap-3">
        
        {/* Chart Container */}
        <TradingChart 
          scenario={currentScenario}
          gameState={gameState}
          userPrediction={userPrediction}
          onTargetSelect={handleTargetSelect}
          revealedCount={revealedCount}
        />

        {/* Action Dock / Control Area */}
        <ActionBar 
          gameState={gameState}
          userPrediction={userPrediction}
          onPredict={handleQuickPredict}
          onConfirmPrediction={handleConfirmTarget}
          onNextChart={handleNextChart}
          disabled={gameState === 'REVEALING'}
        />

        {/* Post-Reveal Outcome Details */}
        {gameState === 'REVEALED' && (
          <OutcomeModal 
            scenario={currentScenario}
            userPrediction={userPrediction}
            isCorrect={isCorrect}
            reactionTime={reactionTime}
            onNext={handleNextChart}
            streak={streak}
          />
        )}

      </main>

      {/* Modals */}
      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
      />

      <SessionSummaryModal 
        isOpen={isSummaryOpen}
        stats={{
          total: totalTrials,
          correct: correctCount,
          maxStreak,
          avgSpeed
        }}
        onRestart={handleReset}
        onContinueUnlimited={() => {
          setIsUnlimitedMode(true);
          setIsSummaryOpen(false);
          handleNextChart();
        }}
      />

    </div>
  );
}
