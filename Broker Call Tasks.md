# Project Tasks: Broker Call Accuracy Tracker

---

## Phase 1: Planning & Setup
- [ ] Define feature scope and MVP (manual broker calls, scoring, display)
- [ ] Set up GitHub repo and project board
- [ ] Choose tech stack (React + Express/PostgreSQL recommended)
- [ ] Identify and test free stock price APIs (e.g., Yahoo Finance)

---

## Phase 2: Backend Development
### 2.1 Data Models & API
- [ ] Design schema: Brokers, Calls, Users
- [ ] Implement broker call submission endpoint (manual input)
- [ ] Create API for fetching calls, brokers, users
- [ ] Create scheduled job to fetch daily price data
- [ ] Implement price storage (optional cache)

### 2.2 Scoring Engine
- [ ] Implement scoring logic:
  - +1 → Target hit before stop-loss or expiry
  - 0 → Neither target nor stop-loss hit (expired or still active)
  - –1 → Stop-loss hit before target
- [ ] Create service to evaluate active calls daily and update scores
- [ ] Store outcome (Hit Target, Hit SL, Expired), score, and time to outcome

---

## Phase 3: Frontend Development
- [ ] Build dashboard: broker rankings, call status, filters
- [ ] Build broker profile pages with call breakdowns
- [ ] Implement call submission form (admin only initially)
- [ ] Add charts for price movements over time (Chart.js or D3)

---

## Phase 4: Admin & Moderation Tools
- [ ] Admin login system (basic auth or Firebase)
- [ ] Dashboard to review/edit/approve calls
- [ ] Ability to manually trigger price/score updates

---

## Phase 5: Testing & QA
- [ ] Unit tests for scoring logic (based on +1/0/–1 model)
- [ ] Integration tests for API endpoints
- [ ] Manual testing of call lifecycle (submission → scoring)
- [ ] Validate price data accuracy and reliability

---

## Phase 6: Deployment
- [ ] Deploy backend API (Render/Heroku)
- [ ] Deploy frontend (Netlify/Vercel)
- [ ] Set up cron jobs for daily price updates
- [ ] Create simple uptime monitoring (e.g., UptimeRobot)

---

## Phase 7: Feedback & Iteration
- [ ] Collect early user feedback
- [ ] Add support for community-sourced calls
- [ ] Consider social features (upvote, comments)
- [ ] Begin planning for V2 (automated call ingestion, multi-target support, alerts)

---
