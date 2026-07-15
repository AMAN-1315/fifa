# StadiumPulse — AI-Powered Smart Stadium & Tournament Operations Assistant
### FIFA World Cup 2026 Edition

StadiumPulse is a GenAI-enabled web application built for the **FIFA World Cup 2026**. It unifies stadium wayfinding, dynamic queue wait-time estimation, tournament transport schedules, accessibility routes, and multi-persona operational command systems into a single contextual intelligence dashboard.

---

## 🚀 Key Features & AI Core

### 1. Multi-Persona Architecture
The system supports three distinct operational roles, changing the UI layout, dashboards, and AI capabilities based on context:
*   🎟️ **Fan Experience**: Access turn-by-turn section wayfinding, live restroom and food court queue meters, transit schedules, and an interactive stadium map with step-free accessibility mode.
*   🦺 **Volunteer Portal**: Monitor zone bottlenecks, log incidents with one-tap triage severity, track checklists, and receive automated crowd-flow alerts.
*   📊 **Organizer Command Center**: Unified command screen containing a live heat-map, incident dispatcher list, volunteer coverage ratios, weather stats, and AI operations reports.

### 2. Context-Aware AI Branching Logic
The persistent ambient AI assistant (triggered via the floating orb) adapts its system prompts dynamically on:
1.  **User Role** (Fan, Volunteer, or Organizer).
2.  **Situation Severity** (Normal operations, Elevated alert, or Emergency override).
3.  **Language & Locale** (Supports English, Spanish, French, Portuguese, and Arabic with full RTL layouts).
4.  **Assigned Sector Location**.

---

## 🛠️ Stack & Setup

*   **Frontend**: React + Vite, CSS (design tokens & custom glassmorphic styling), HTML5.
*   **Routing & State**: React Router v6, custom lightweight Context API.
*   **AI Engine**: Anthropic Claude API (`claude-haiku-4-5`).

### Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

3. Open `.env.local` and add your Claude API Key:
   ```env
   VITE_CLAUDE_API_KEY=your_actual_anthropic_api_key
   ```
   *(Note: If no API key is specified, the application automatically triggers simulated local AI logic so judges can experience the full interactive workflow out-of-the-box).*

4. Run the local dev server:
   ```bash
   npm run dev
   ```

5. Open your browser at `http://localhost:5173`.
