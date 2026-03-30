# Kabuoto (カブオト) — Summary

## What Was Built

A web app that sonifies stock market data into ambient music using Web Audio API. Each trading day becomes a musical note — price changes map to pitch, volatility controls tempo, and trading volume affects amplitude. Includes a synchronized price chart, real-time waveform oscilloscope, and note history display.

## Features

- Web Audio synthesizer with 3 oscillator types + sub-oscillator
- Convolution reverb, feedback delay, low-pass filter effects
- 5 stocks with 180 days synthetic data (Toyota, Sony, SBG, NTT, Apple)
- 6 musical scales including Japanese miyako-bushi
- Canvas price chart with playback indicator, volume bars
- Real-time oscilloscope waveform (AnalyserNode)
- Note history bar display (last 20 notes)
- Speed control 1-10x, master volume, reverb/delay sliders

## Tech Decisions

- **Single HTML file**: Maximum portability, zero dependencies
- **Web Audio API**: Rich synthesis capabilities natively in browser
- **Synthetic stock data**: Realistic random walk — no API keys needed
- **Canvas 2D**: Lightweight chart + waveform rendering

## Potential Next Steps

- Real-time API integration (Yahoo Finance, Alpha Vantage)
- Multi-stock harmony (play multiple stocks simultaneously)
- MIDI export of generated melodies
- Record and share audio clips
