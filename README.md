# 🌸 Bloom — Real-Time Period & Couple Cycle Tracker

**Bloom** is a modern, real-time menstrual and cycle tracking application built for your girlfriend with a femtech aesthetic, dynamic cycle predictions, physical/emotional symptom tracking, and an **interactive Partner Mode** so you can stay in sync and know how to care for her each day.

---

## ✨ Features

- 🌸 **Circular Cycle Wheel**: Dynamic SVG phase wheel showing current cycle day, countdown to next period, pregnancy probability, and phase transitions.
- 🩸 **Daily Symptom & Flow Logging**:
  - Period flow intensity (Spotting, Light, Medium, Heavy)
  - Cramps / body pain intensity scale (0 to 5)
  - Mood check-ins (Happy, Calm, Sensitive, Tired, Moody, Energetic, etc.)
  - Body symptoms (Bloating, Headache, Tender Breasts, Cravings, Backache, Acne, etc.)
  - Water hydration tracker 💧 & Contraception/vitamin reminder 💊
  - Personal private thoughts & notes
- 📅 **Interactive Calendar & 6-Month Forecast**:
  - Color-coded period days, ovulation peaks, and fertile windows.
  - Quick tap on any day to backfill or view past logs.
  - Future 6-month prediction breakdown.
- 💡 **Hormonal Phase Masterclass**:
  - Deep-dive into Menstrual, Follicular, Ovulatory, and Luteal phases.
  - Cycle syncing nutrition & optimal exercise guides.
- 💌 **Real-Time Partner Mode ("Together Mode")**:
  - **Live Sync**: Whenever she logs her cramps, mood, or period, your view updates in real time via WebSockets.
  - **Actionable Care Protocol**: Daily tips on what to do for her based on her exact hormonal phase and logged symptoms (e.g. heating pad, hot tea, chocolate, emotional patience).
  - **Instant Love Pings**: Tap to send real-time comfort (🤗 Big Hug, 🔥 Heating Pad, ☕️ Hot Tea, 🍫 Dark Chocolate, 💐 Flowers, or custom love notes) that pop up on her screen with confetti and sound!
- 🌙 **Night Bloom Theme**: Cozy dark mode for bedtime logging.
- 📱 **Mobile & Tablet Friendly**: Open on phone browsers over local Wi-Fi.

---

## 🚀 Quick Start

### 1. Start the App
From the project folder:

```bash
cd /Users/tomin/.gemini/antigravity/scratch/bloom-period-tracker
npm start
```
*(Or for hot-reloading dev mode: `npm run dev`)*

### 2. Open in Browser
- **On your Mac / Laptop**: [http://localhost:3001](http://localhost:3001)
- **On your Girlfriend's Phone (Same Wi-Fi)**: Look at the terminal output when the server starts for your local network address (e.g., `http://192.168.1.XX:3001`).

### 3. Running Automated Tests
```bash
npm test
```
