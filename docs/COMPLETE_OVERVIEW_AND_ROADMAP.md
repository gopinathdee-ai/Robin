# Complete Robin Platform — Testing, Branding & Marketing Roadmap

> **Comprehensive Overview Document**  
> **For:** Both co-founders (Gopinath + You)  
> **Date:** May 2026  
> **Status:** Ready for execution

---

## What You Now Have (6 Strategic Documents)

### **1. TESTING_STRATEGY.md** (8,000 words)
**Owner:** Gopinath  
**Timeline:** Weeks 1–4  

**Covers:**
- Unit tests (Vitest)
- Integration tests (Vitest + Prisma)
- E2E tests (Playwright)
- Test coverage targets (80%+)
- GitHub Actions CI/CD setup
- Security-critical test priorities (auth, validation, credentials)
- Updated PR checklist for development workflow

**Deliverable:** Testing framework integrated into development, every PR passes automated tests before merge.

---

### **2. BRANDING_STRATEGY.md** (7,500 words)
**Owner:** You  
**Timeline:** Week 1–2  

**Covers:**
- 8 name recommendations (RUNG, LEDGER, TICKET, etc.)
- Naming methodology and constraints
- Domain and trademark due diligence
- Brand positioning statement template
- Visual identity framework (colors, typography already defined in codebase)
- Brand messaging pillars
- 4-week branding tasks roadmap

**Deliverable:** Public brand name chosen, domain registered, brand guidelines drafted by Week 2.

**Recommendation:** RUNG (single syllable, trades-native, "climbing the rungs," clear domain availability).

---

### **3. MARKETING_STRATEGY.md** (12,000 words)
**Owner:** You  
**Timeline:** Months 1–15 (Phase 1 & 2)  

**Covers:**
- 3-phase go-to-market (Validate → Monetize → Scale)
- Week-by-week execution for Phase 1 (Months 1–4)
- Institutional outreach playbook (15 union stakeholders to identify)
- Pilot partnership agreements
- Discovery interview framework (20 interviews with tradespeople)
- Government grant strategy (Union Training & Innovation Program)
- Content calendar (LinkedIn, guest articles, podcasts, newsletters)
- Sales messaging and objection handling
- Risk mitigation strategies
- Year 1 marketing budget ($25K–$35K)
- KPIs and success metrics
- Phase 2 & 3 roadmap (Months 5–15, Year 2+)

**Deliverable:** Phase 1 complete with 1–2 paying pilot partners signed, user feedback informing product roadmap, government grant application submitted.

---

### **4. PRODUCTION_READINESS_AND_CHANGE_MANAGEMENT.md** (10,000 words)
**Owner:** Gopinath (with your oversight)  
**Timeline:** Weeks 1–4 setup, ongoing execution  

**Covers:**
- Credential integrity verification test (before every deployment)
- Audit trail integrity test (before every deployment)
- Data migration safety tests (before any schema change)
- Blue/green deployment validation
- Smoke tests (run immediately post-deployment)
- Regression tests (nightly)
- Production health monitoring and alerting
- Incident response procedures (what to do if credential corruption happens)
- Monthly integrity audits
- Change management workflow and documentation
- Pre-deployment and post-deployment checklists
- Release notes template

**Deliverable:** Safe deployment procedures, zero production incidents from data corruption, audit trail always intact.

---

### **5. ADVANCED_DEPLOYMENT_STRATEGIES.md** (9,000 words)
**Owner:** Gopinath (with your input on strategy decisions)  
**Timeline:** Weeks 3–6 setup, ongoing use  

**Covers:**
- **Canary deployments** (5% → 25% → 100% gradual rollout) — for credential changes
- **Feature flags** (deploy without releasing) — for major features
- **Shadow traffic** (test new logic alongside old) — for auth/verification logic
- **Ring deployments** (internal → pilot → early adopters → all) — for major features
- **Blue/green deployments** (instant switch, zero downtime) — for non-critical features
- Metrics-driven automatic rollback (if error rate spikes, revert automatically)
- AWS ELB infrastructure setup (Terraform code included)
- Decision tree for which strategy to use
- Monitoring dashboards per cohort
- Rollback procedures
- Integration with testing strategy

**Deliverable:** Confidence that every production change is safe, measurable, and instantly reversible.

---

### **6. 30_DAY_KICKOFF.md** (4,000 words)
**Owner:** You  
**Timeline:** Week 1 execution plan  

**Covers:**
- Week 1–4 detailed action items (hour-by-hour)
- Weekly sync schedule with Gopinath
- Success metrics to track
- Decision points requiring co-founder alignment
- Stakeholder tracking template
- Tools needed (Notion, ConvertKit, LinkedIn, etc.)
- Role clarity between marketing and development

**Deliverable:** Clear day-1 action items, weekly momentum, decision log.

---

## The Complete Picture: How They Fit Together

```
┌─────────────────────────────────────────────────────────────┐
│                    BRAND IDENTITY (Week 1–2)               │
│                      BRANDING_STRATEGY.md                  │
│              Choose name, register domain, create brand     │
│              guidelines (logos, colors, positioning)        │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ↓
┌──────────────────────────────────────────────────────────────┐
│                  MARKETING EXECUTION (Month 1+)             │
│                   MARKETING_STRATEGY.md                     │
│        Launch content, identify 15 stakeholders,            │
│      conduct 20 discovery interviews, sign pilot partner    │
└──────────────┬──────────────────────────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────────────────────────┐
│               DEVELOPMENT WITH TESTING (Month 1+)           │
│                   TESTING_STRATEGY.md                       │
│      Unit tests, integration tests, E2E tests on every PR   │
│            GitHub Actions CI/CD gates on main               │
└──────────────┬──────────────────────────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────────────────────────┐
│                  PRODUCTION DEPLOYMENT (Month 5+)           │
│   PRODUCTION_READINESS.md + ADVANCED_DEPLOYMENT_STRATEGIES  │
│                                                              │
│  Pre-deploy:                                                │
│  ✓ Credential integrity test passes                        │
│  ✓ Audit trail integrity test passes                       │
│  ✓ Migration safety test (if schema change)                │
│                                                              │
│  Deploy:                                                    │
│  ✓ Canary rollout (5% → 25% → 100%)                       │
│  ✓ Metrics-driven rollback if error rate spikes           │
│                                                              │
│  Post-deploy:                                               │
│  ✓ Smoke tests run                                         │
│  ✓ Error monitoring active                                 │
│  ✓ Nightly regression tests catch issues                   │
│  ✓ Monthly integrity audits verify no degradation          │
└──────────────────────────────────────────────────────────────┘
```

---

## Document Purposes: What Each Is For

| **Document** | **Who Reads It** | **When** | **Purpose** |
|---|---|---|---|
| **TESTING_STRATEGY.md** | Gopinath + code reviewers | Before first feature | "How do we ensure code quality?" |
| **BRANDING_STRATEGY.md** | You + both founders | Week 1 | "What is our brand name and identity?" |
| **MARKETING_STRATEGY.md** | You (primary owner) | Week 1 ongoing | "How do we acquire customers and partners?" |
| **PRODUCTION_READINESS.md** | Gopinath + DevOps | Before production | "How do we deploy safely?" |
| **ADVANCED_DEPLOYMENT_STRATEGIES.md** | Gopinath + You | Weeks 3–6 setup, then ongoing | "How do we roll out changes with zero risk?" |
| **30_DAY_KICKOFF.md** | You + Gopinath | Week 1 | "What are my priorities this week?" |

---

## Implementation Timeline (6 Months)

### **Month 1: Foundation**

**Week 1–2:**
- ✅ Brand name decided (BRANDING_STRATEGY.md)
- ✅ Domain registered
- ✅ 15 union stakeholders identified (MARKETING_STRATEGY.md)
- ✅ Testing framework setup (TESTING_STRATEGY.md)
- ✅ GitHub Actions CI/CD configured

**Week 3–4:**
- ✅ Institutional pitch deck completed
- ✅ Demo video recorded
- ✅ 8–12 stakeholder meetings conducted
- ✅ 8–10 discovery interviews completed
- ✅ Product roadmap informed by user feedback

**Outcome:** 1–2 pilot partners committed, brand identity live.

---

### **Month 2–3: Pilot & Product**

**Weeks 5–8:**
- ✅ Pilot agreement signed with 1–2 partners
- ✅ MVP onboarding screens live
- ✅ Knowledge community feed live
- ✅ AI screening service processing content
- ✅ First 50–100 users on platform
- ✅ Content integrity tests in production (PRODUCTION_READINESS.md)

**Weeks 9–12:**
- ✅ First mentors earn status
- ✅ First credentials issued
- ✅ Pilot feedback collected and acted on
- ✅ Grant application research completed

**Outcome:** Working product with real users, institutional validation, government funding identified.

---

### **Month 4–5: Monetization & Growth**

**Weeks 13–16:**
- ✅ Institutional sales conversations with 2–3 additional unions
- ✅ Grant application submitted (Union Training & Innovation Program)
- ✅ Content calendar in full swing (LinkedIn, guest articles, podcasts)
- ✅ Canary deployment infrastructure setup (ADVANCED_DEPLOYMENT_STRATEGIES.md)

**Weeks 17–20:**
- ✅ First paying contracts signed (2 unions + 3 employers)
- ✅ Production monitoring + alerting live
- ✅ Nightly regression tests catching issues
- ✅ Feature flags + canary rollouts in use for new features

**Outcome:** Revenue flowing, multiple institutional customers, government grant (or reapplication plan).

---

### **Month 6+: Scale**

**Weeks 21+:**
- ✅ Second trade (plumbers) onboarding
- ✅ Multi-province expansion planning
- ✅ Government integration conversations
- ✅ Year 2 roadmap defined

**Outcome:** Repeatable model proven, path to $1M+ ARR clear.

---

## Critical Path Items (Do These First)

**Must complete before anything else:**

1. ✅ **Brand name decided** (BRANDING_STRATEGY.md) — Week 1
2. ✅ **Testing framework configured** (TESTING_STRATEGY.md) — Week 1
3. ✅ **Union stakeholders identified** (MARKETING_STRATEGY.md) — Week 1
4. ✅ **Credential integrity test implemented** (PRODUCTION_READINESS.md) — Week 2
5. ✅ **Institutional pitch deck** (MARKETING_STRATEGY.md) — Week 2

**These unlock everything else.**

---

## Success Criteria by Phase

### **Phase 1: Validation (Months 1–4)**

| **Metric** | **Target** | **Achieves** |
|---|---|---|
| Union stakeholders identified | 15 | Distribution channels exist |
| Discovery interviews | 20 | User feedback for product |
| Pilot partners signed | 1–2 | Institutional traction |
| Users on platform | 50–150 | Product-market fit signal |
| Letters of support received | 1+ | Government funding eligibility |
| Grant application submitted | 1 | External validation, funding |
| Content submissions | 50+/month | Community engagement |
| Credentials issued | 50+ | Real outcome measurement |

**Phase 1 succeeds when:** You have 1–2 paying pilots, 100+ users, proof of product-market fit, and grant application submitted.

---

### **Phase 2: Monetization (Months 5–15)**

| **Metric** | **Target** | **Achieves** |
|---|---|---|
| Paying contracts signed | 2 unions + 3 employers | Revenue proof |
| Monthly active users | 150–300 | Growth trajectory |
| Subscription revenue | $20K–$30K/month | Sustainable business |
| Government grant funded | $50K–$100K | Accelerator capital |
| Content submissions | 100+/month | Community maturity |
| Credentials issued | 500+ | Scaled outcomes |
| Zero production incidents (credential corruption) | 0 | Trust maintained |

**Phase 2 succeeds when:** You're at $25K–$30K ARR with 5+ paying customers, zero data integrity issues, and government backing.

---

## Roles & Responsibilities

### **Gopinath (Development Lead)**

**What you own:**
- Testing framework setup and maintenance (TESTING_STRATEGY.md)
- Feature development (onboarding, knowledge community, credentials)
- Production readiness (PRODUCTION_READINESS.md)
- Deployment strategy implementation (ADVANCED_DEPLOYMENT_STRATEGIES.md)
- Database migrations and schema management
- Infrastructure as code (AWS, Docker, GitHub Actions)

**Time commitment:** 100% (full-time development)

**Key deliverables:**
- MVP with testing framework (Month 1)
- Production-ready platform (Month 5)
- Safe deployment procedures (ongoing)
- Zero production incidents (ongoing)

---

### **You (Marketing & Partnerships Lead)**

**What you own:**
- Brand identity (BRANDING_STRATEGY.md)
- Institutional partnerships (MARKETING_STRATEGY.md)
- Content strategy and execution (LinkedIn, articles, podcasts)
- Government grant applications
- Customer discovery and feedback
- Institutional sales conversations
- User research and interviews

**Time commitment:** 30–40 hours/week for 4 months, then scale back as product momentum builds

**Key deliverables:**
- Brand identity live (Week 2)
- 1–2 paying pilots signed (Month 3–4)
- Government grant application submitted (Month 3)
- 100–150 active users (Month 4)
- First paying contracts (Month 5)

---

### **Both Co-Founders**

**Weekly sync (Friday, 30 min):**
- Progress on metrics
- Blockers and how to solve them
- Product roadmap updates
- Stakeholder feedback synthesis

**Monthly debrief (first Thursday, 1.5 hrs):**
- Phase progress assessment
- Financial/metrics review
- Strategic decisions needed
- Celebrate wins

---

## Key Decision Points (Schedule These)

**Week 1:**
- [ ] Brand name chosen (You + Gopinath, 1 hour)
- [ ] Testing framework agreed (You + Gopinath, 30 min)
- [ ] Pilot strategy aligned (You + Gopinath, 30 min)

**Week 3:**
- [ ] First institutional meeting scheduled with top 2 stakeholders

**Month 2:**
- [ ] Pilot partner selected and agreement signed
- [ ] Grant program identified (UTP, CAS-ITE)
- [ ] Product roadmap locked for Month 2–3

**Month 3:**
- [ ] Pricing for institutional subscription decided
- [ ] Grant application complete and ready to submit
- [ ] Sales playbook finalized

---

## Tools You'll Need

### **Development (Gopinath)**
- Vitest, Playwright, GitHub Actions (free/open-source)
- PostgreSQL, Redis, Docker (free/open-source)
- AWS account ($50–100/month for EC2, RDS, etc.)

### **Marketing (You)**
- LinkedIn (free)
- ConvertKit or Substack ($10–15/month for newsletter)
- Notion or Airtable (free tier sufficient)
- Figma ($10/month or free tier)
- Google Workspace ($6/user/month)

### **Shared**
- GitHub ($0 for private repo)
- PostHog ($20–200/month for feature flags, optional)
- Slack ($8/user/month for team communication)
- Calendly (free for scheduling)

**Total monthly cost: $200–$300** (AWS infrastructure is the main cost)

---

## How to Use These Documents

**Day 1 (Monday Morning):**
1. You read BRANDING_STRATEGY.md (2 hours)
2. You read MARKETING_STRATEGY.md (2 hours)
3. Share TESTING_STRATEGY.md and PRODUCTION_READINESS.md with Gopinath with note: "Let's align Wednesday on framework choices"

**Day 2–5 (Week 1):**
1. You execute Week 1 tasks from 30_DAY_KICKOFF.md
2. Gopinath reviews testing framework choices
3. Both of you have alignment call (Friday) on testing, branding, and pilot strategy

**Week 2+:**
1. You follow MARKETING_STRATEGY.md Phase 1 execution
2. Gopinath implements TESTING_STRATEGY.md and begins development
3. Weekly syncs keep you aligned

---

## Red Flags (If These Happen, Regroup)

⚠️ **No union stakeholders respond to outreach** → Diversify (reach apprenticeship boards, technical colleges)  
⚠️ **Testing framework slows development below 10 features/week** → Adjust test coverage targets downward  
⚠️ **First pilot partner says "no"** → That's data. Iterate pitch based on their feedback.  
⚠️ **Product gets 500+ users but no paying pilots** → Pivot to lower institutional commitment (try employers instead)  
⚠️ **Canary rollout catches credential corruption in production** → You caught it! That's the system working. Fix, retest, redeploy.

---

## Success Looks Like

**Month 1:** 
- ✅ Brand is live, domain owned
- ✅ 15 stakeholders identified, 8+ meetings conducted
- ✅ Testing framework integrated, every PR passes tests
- ✅ Clear product roadmap from user discovery

**Month 4:**
- ✅ 1–2 pilot partners actively using platform
- ✅ 100–150 real users creating content
- ✅ Grant application submitted to government
- ✅ First credentials issued and working
- ✅ Zero production data integrity issues

**Month 12:**
- ✅ 2+ paying union contracts
- ✅ 3+ employer contracts
- ✅ $25K–$30K monthly recurring revenue
- ✅ Government grant awarded (or reapplication planned)
- ✅ Platform is the trust standard for apprenticeship credentials
- ✅ Planning expansion to second trade

---

## Document Interdependencies

```
BRANDING_STRATEGY.md
    ↓ (name decision feeds into)
    ├→ MARKETING_STRATEGY.md (messaging, positioning)
    └→ 30_DAY_KICKOFF.md (brand launch timing)

TESTING_STRATEGY.md
    ↓ (test gates inform)
    └→ PRODUCTION_READINESS.md (pre-deployment checks)
        ↓ (deployment strategy)
        └→ ADVANCED_DEPLOYMENT_STRATEGIES.md (canary, feature flags)

MARKETING_STRATEGY.md
    ↓ (user feedback informs)
    └→ Product roadmap (feature prioritization)
        ↓ (new features need tests)
        └→ TESTING_STRATEGY.md (more test cases)

All documents feed into:
    └→ 30_DAY_KICKOFF.md (weekly execution)
        ↓
        → Weekly sync between co-founders
        → Monthly metrics review
        → Quarterly strategy reassessment
```

---

## Starting This Week

### **Monday**

1. **You:** Read BRANDING_STRATEGY.md (2 hrs)
2. **You:** Read MARKETING_STRATEGY.md (2 hrs)
3. **You:** Share TESTING_STRATEGY.md with Gopinath + request 30 min Wednesday to align

### **Tuesday–Thursday**

1. **You:** Test 3 top brand names with 5 tradespeople each (5 hrs)
2. **You:** Identify 15 union stakeholders in Alberta (2 hrs)
3. **You:** Draft institutional pitch deck (3 hrs)

### **Friday**

1. **Both:** 30-min sync — decide on brand name, testing framework, pilot approach
2. **You:** Report Week 1 metrics to Gopinath

---

## The Bigger Picture

You're not just building a product. You're building:

1. **A brand** that trades workers recognize and trust (BRANDING_STRATEGY.md)
2. **A market** by proving government funding exists (MARKETING_STRATEGY.md)
3. **A standard** for safe, trustworthy credential systems (TESTING_STRATEGY.md + PRODUCTION_READINESS.md)
4. **A defensible moat** through union relationships and government integration (MARKETING_STRATEGY.md)

**Everything in these documents serves that larger purpose.**

The testing, the brand, the marketing — they're all part of proving that Robin is the platform Canada's trades workers and institutions can trust with their records.

---

**You're ready. Start Monday. Report progress Friday. Let's build this.**
