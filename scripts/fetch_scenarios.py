import os
import json
import random
import yfinance as yf
import pandas as pd
import numpy as np

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "src", "data")
os.makedirs(OUTPUT_DIR, exist_ok=True)
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "scenarios.json")

# Diverse universe: BIST, US Tech, Crypto, Commodities
TICKERS = [
    # BIST
    {"symbol": "THYAO.IS", "type": "BIST", "name": "Aviation Corp"},
    {"symbol": "ASELS.IS", "type": "BIST", "name": "Defense Tech"},
    {"symbol": "EREGL.IS", "type": "BIST", "name": "Steel Giant"},
    {"symbol": "TUPRS.IS", "type": "BIST", "name": "Refinery Co"},
    # US Tech
    {"symbol": "NVDA", "type": "US Tech", "name": "Semiconductor Co"},
    {"symbol": "TSLA", "type": "US Tech", "name": "EV Mobility"},
    {"symbol": "AAPL", "type": "US Tech", "name": "Consumer Tech"},
    {"symbol": "AMD", "type": "US Tech", "name": "Microchips"},
    {"symbol": "PLTR", "type": "US Tech", "name": "Data Analytics"},
    # Crypto
    {"symbol": "BTC-USD", "type": "Crypto", "name": "Crypto Asset A"},
    {"symbol": "ETH-USD", "type": "Crypto", "name": "Crypto Asset B"},
    {"symbol": "SOL-USD", "type": "Crypto", "name": "Crypto Asset C"},
    # Commodities
    {"symbol": "GC=F", "type": "Commodity", "name": "Gold Commodity"},
    {"symbol": "CL=F", "type": "Commodity", "name": "Crude Oil"}
]

HISTORY_LEN = 55  # visible candles for user intuition
FUTURE_LEN = 20   # revealed candles to evaluate user guess

scenarios = []

print(f"Fetching market data for {len(TICKERS)} instruments...")

for item in TICKERS:
    sym = item["symbol"]
    try:
        print(f"Downloading {sym}...")
        # Download 2 years of daily data
        ticker = yf.Ticker(sym)
        df = ticker.history(period="2y", interval="1d")
        
        if df.empty or len(df) < (HISTORY_LEN + FUTURE_LEN + 10):
            print(f"Not enough data for {sym}, skipping")
            continue
            
        # Clean columns
        df = df[['Open', 'High', 'Low', 'Close', 'Volume']].dropna()
        
        # Pick 3-5 interesting distinct slices across time
        total_len = len(df)
        available_indices = list(range(0, total_len - (HISTORY_LEN + FUTURE_LEN)))
        
        # Pick random slice points with at least 30 days gap
        random.seed(42 + hash(sym))
        slice_points = []
        for _ in range(15):
            idx = random.choice(available_indices)
            if all(abs(idx - sp) > 35 for sp in slice_points):
                slice_points.append(idx)
            if len(slice_points) >= 4:
                break
                
        for sp in slice_points:
            sub = df.iloc[sp : sp + HISTORY_LEN + FUTURE_LEN]
            
            history_df = sub.iloc[:HISTORY_LEN]
            future_df = sub.iloc[HISTORY_LEN:]
            
            last_close = float(history_df['Close'].iloc[-1])
            future_close = float(future_df['Close'].iloc[-1])
            future_max = float(future_df['High'].max())
            future_min = float(future_df['Low'].min())
            
            pct_change = round(((future_close - last_close) / last_close) * 100, 2)
            max_up_pct = round(((future_max - last_close) / last_close) * 100, 2)
            max_down_pct = round(((future_min - last_close) / last_close) * 100, 2)
            
            # Format candles (time as index 0, 1, 2... for clean anonymization)
            history_candles = []
            for i, (_, row) in enumerate(history_df.iterrows()):
                history_candles.append({
                    "time": i,
                    "open": round(float(row['Open']), 2),
                    "high": round(float(row['High']), 2),
                    "low": round(float(row['Low']), 2),
                    "close": round(float(row['Close']), 2),
                    "volume": int(row['Volume'])
                })
                
            future_candles = []
            for i, (_, row) in enumerate(future_df.iterrows()):
                future_candles.append({
                    "time": HISTORY_LEN + i,
                    "open": round(float(row['Open']), 2),
                    "high": round(float(row['High']), 2),
                    "low": round(float(row['Low']), 2),
                    "close": round(float(row['Close']), 2),
                    "volume": int(row['Volume'])
                })
                
            # Classify movement
            if pct_change >= 4.0:
                direction = "LONG"
                flavor = "Bullish Expansion"
            elif pct_change <= -4.0:
                direction = "SHORT"
                flavor = "Bearish Breakdown"
            elif max_up_pct > 6.0 and pct_change < 0:
                direction = "SHORT"
                flavor = "Bull Trap / Rejection"
            elif max_down_pct < -6.0 and pct_change > 0:
                direction = "LONG"
                flavor = "Liquidity Sweep & Reversal"
            else:
                direction = "LONG" if pct_change >= 0 else "SHORT"
                flavor = "Range / Consolidation"
                
            scenarios.append({
                "id": f"SCN-{len(scenarios)+1:03d}",
                "marketType": item["type"],
                "lastPrice": last_close,
                "history": history_candles,
                "future": future_candles,
                "outcome": {
                    "direction": direction,
                    "futureClose": future_close,
                    "pctChange": pct_change,
                    "maxUpPct": max_up_pct,
                    "maxDownPct": max_down_pct,
                    "flavor": flavor
                }
            })
            
    except Exception as e:
        print(f"Error fetching {sym}: {e}")

print(f"Total scenarios extracted: {len(scenarios)}")

# Shuffle scenarios for variety
random.shuffle(scenarios)

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(scenarios, f, indent=2)

print(f"Saved {len(scenarios)} scenarios to {OUTPUT_FILE}")
