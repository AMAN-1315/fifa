# StadiumPulse — AI-Powered Smart Stadium & Tournament Operations Assistant

StadiumPulse is a React + Vite web app built for **Challenge 4: Smart Stadiums & Tournament Operations**. It simulates a FIFA World Cup 2026 operations layer for fans, volunteers, and organizers with role-aware UI, a contextual assistant, live mock stadium data, multilingual support, and an accessible dark-first interface.

## Chosen Vertical

**Smart Stadiums & Tournament Operations**

This vertical fits the app’s core strength: contextual decision-making. The same codebase adapts to three personas and changes the UI, language, and assistant behavior based on role, situation, and location.

## Approach and Logic

The app uses a lightweight state model in `src/store/appReducer.js` and a shared context provider to drive:

- role switching between Fan, Volunteer, and Organizer experiences
- accessibility mode and reduced-motion preferences
- stadium situation state: normal, elevated, or emergency
- selected zone and route context for wayfinding

The AI layer is intentionally conservative for the hackathon setting. By default, it uses a local demo fallback so the app works without secrets or backend infrastructure. When a Google Gemini API key is present, the assistant calls Gemini directly from the browser for live responses.

Mock live data is generated locally in `src/mock/generator.js`, which simulates occupancy, queue waits, shuttle timing, and incidents so the interface feels dynamic without needing IoT feeds or external services.

## How the Solution Works

### Fan flow

- select fan mode from the landing page
- view a bento-style dashboard with live map, queue times, transit, and exit planning
- tap the stadium map to get route guidance
- open the ambient AI orb for contextual help

### Volunteer flow

- switch into volunteer mode
- review zone density, incident status, and action prompts
- report incidents and track operational priorities
- use the same assistant, but with concise operational language

### Organizer flow

- switch into organizer mode
- monitor occupancy, incidents, volunteer coverage, and situation state
- drill into zones for a command-center style overview
- use the AI brief for a quick operational summary

## UI and Accessibility

The interface is designed to avoid the common “single centered card” problem. The shell and screen wrappers are full-width, so the content fills the viewport instead of leaving a large dead area on the right.

Accessibility work includes:

- keyboard-navigable interactive controls
- semantic regions and labels on dashboard sections
- high-contrast status colors paired with text/icons
- reduced-motion support
- RTL support for Arabic

## Testing

The repo now includes Vitest coverage for the core non-UI logic:

- stadium occupancy thresholds and formatting helpers
- reducer behavior for role switching and reset flows

Run tests with:

```bash
npm test
```

## Local Development

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Lint the codebase:

```bash
npm run lint
```

## Assumptions

- No real stadium sensors or transit APIs are available, so all live data is simulated locally.
- The app is evaluated as a public GitHub repository, not as a production deployment.
- A single branch is kept for submission hygiene.
- The project should stay lightweight and below the repo size limit, so the implementation uses CSS, SVG, and mock generators instead of large binary assets.
- The demo should work without an AI API key, but a Google Gemini key enables live AI responses.

## Tech Stack

- React
- Vite
- React Router
- CSS modules/files with shared design tokens
- Vitest for unit testing

## Repository Notes

- The app is intentionally built as a small, single-branch hackathon project.
- The main behavioral logic lives in `src/store/appReducer.js`, `src/lib/stadiumMetrics.js`, and `src/mock/generator.js`.
- The visual shell is handled by `src/components/layout/AppShell.jsx` and the feature screen CSS files.
