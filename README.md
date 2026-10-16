# Market Intuition & Pattern Recognition Web Tool

A web-based financial training and decision-support application built with React 19, Vite, and Lightweight Charts. Modeled after heuristic decision-making and pattern recognition principles (inspired by the classic tacit-knowledge heuristic concept), allowing users to train intuition on market candle formations without relying solely on explicit technical indicators.

---

## Overview

Traditional technical analysis often overwhelms traders with lagging indicators. This tool trains intuitive pattern recognition through rapid-fire market scenario trials. Users observe historical price action scenarios up to a specific inflection point, form an intuitive directional prediction, and instantly receive feedback on price continuation, reaction time, and decision streak performance.

---

## Features

- **Interactive Financial Charts:** Powered by TradingView's `@lightweight-charts` for smooth candlestick and price action rendering.
- **Scenario Progression Engine:** Step-through trials across various market environments with hidden outcome reveal stages.
- **Cognitive & Performance Metrics:** Tracks user accuracy, reaction time per decision, winning streaks, and max streak benchmarks.
- **Modern Responsive UI:** Built with React 19, Tailwind CSS v4, Lucide icons, and interactive modal dialogs.
- **Instant Visual Feedback:** Smooth transitions, confetti bursts on streaks, and comprehensive end-of-session performance summaries.

---

## Tech Stack

- **Framework:** React 19 (Hooks, Context, State Management)
- **Build Tool:** Vite 8
- **Charting:** Lightweight Charts 5
- **Styling:** Tailwind CSS v4
- **Icons & Animation:** Lucide React, Canvas Confetti
- **Linter:** Oxlint

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx             # Top bar with market filter & streak display
│   ├── TradingChart.jsx       # Lightweight Charts canvas wrapper
│   ├── ActionBar.jsx          # Prediction actions (Long / Short / Pass)
│   ├── OutcomeModal.jsx       # Post-prediction outcome feedback
│   ├── HelpModal.jsx          # Explanation of heuristic concept & rules
│   └── SessionSummaryModal.jsx# Session statistics and performance recap
│
├── data/
│   └── scenarios.json         # Historical price datasets & scenarios
│
├── App.jsx                    # Core game loop & trial state management
├── main.jsx                   # Application entry point
└── index.css                  # Tailwind styles
```

---

## Getting Started

### 1. Prerequisites

- Node.js 18+
- npm, pnpm, or yarn

### 2. Installation

Clone the repository and install dependencies:

```bash
npm install
```

### 3. Development Server

Start the local Vite development server:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 4. Build for Production

```bash
npm run build
```

---

## ⚖️ Legal & Educational Disclaimer

> [!IMPORTANT]
> **Academic & Cognitive Simulation Notice:**  
> This application is developed strictly for **academic, cognitive psychology, and educational pattern-recognition research**. It models human heuristic decision-making processes under uncertainty using historical financial charting data.
> 
> - **No Financial or Investment Advice:** This project does **not** offer, provide, or constitute financial, investment, legal, or tax advice. It does not generate or distribute trading signals or portfolio management recommendations.
> - **Zero Real Transactions:** There is no execution layer, brokerage API connection, digital wallet, or real-money transaction capability within this software.
> - All charting scenarios are historical snapshots utilized exclusively for offline pattern-matching exercises.

