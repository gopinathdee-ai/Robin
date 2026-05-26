# BUSINESS_REQUIREMENTS.md

> **Living document.** Business requirements define what Robin is built to achieve and the constraints on how it achieves those goals. Update this whenever fundamental business strategy, success metrics, or scope decisions change.  
> Last updated: May 2026 | Maintained by: Co-founders

---

## **1. Product Vision & Core Principle**

**The tradesperson owns their record. No design decision, data model, or feature should transfer ownership of a user's credentials or learning history to an employer or organisation.**

Robin is a trades-specific credential and mentorship platform designed to solve the Canadian skilled trades workforce shortage by providing:

1. **Portable skills records** — Open Badge credentials owned by the individual, not the employer or union
2. **Earned mentorship** — Mentorship tier achieved through demonstrated expertise and peer credibility, not self-declared
3. **Quality-gated knowledge community** — AI-screened and peer-validated trades knowledge, free from the vanity and misinformation that plague LinkedIn and generic Q&A platforms
4. **Gamified accessibility** — Onboarding and progression language that mirrors trades hierarchy (apprentice → journeyperson → master), meeting users where their mental model already is

Robin explicitly rejects the LinkedIn model of self-promotion, vanity metrics, and unweighted endorsement spam. Instead, credibility is **earned, demonstrated, verified, and weighted**.

---

## **2. Market Context & Business Justification**

### **The Workforce Crisis**

- **700,000 skilled trades workers** projected to retire in Canada by 2028 (RBC / Randstad Canada)
- **1.4 million additional workers** needed by 2033 (Federal Economic Update, May 2026)
- **77% of Canadian businesses** unable to find skilled candidates (The Conversation, 2026)
- **31% decline** in youth ages 15–24 entering trades between 2016–2021 (Statistics Canada)

### **Government Funding Alignment**

The federal government is actively funding the infrastructure Robin provides:

- **$6 billion** Team Canada Strong Program (wage subsidies for apprentices, creating a funded pipeline of new users)
- **$331 million** over five years for apprenticeship modernization with explicit mandates for digital logbooks and a single national registered apprenticeship number
- **$5 million per project** Canadian Apprenticeship Strategy ITE stream (up to 36 months) for training equipment and digital infrastructure
- **$25 million** Union Training and Innovation Program expansion (eligible organisations include unions and training providers)

**Strategic implication:** Government RFPs and co-funding opportunities will emerge in 12–18 months. Robin positions to be the credible, purpose-built solution when those conversations begin.

### **Beachhead Market**

**Red Seal Electricians in Alberta — Phase 1 target.**

Rationale:
- Largest union locals in every major Canadian city
- High apprenticeship volumes (strong institutional buyer)
- Well-organized provincial board oversight (credentialing infrastructure exists)
- Rapid technological change creating genuine demand for knowledge sharing
- Strong culture of mentorship (trades hierarchy is culturally respected)

---

## **3. Business Goals & Success Metrics**

### **Phase 1: Validation (Months 1–4)**

| **Goal** | **Success Metric** | **Target** |
|---|---|---|
| Validate user engagement | Daily active users (trades knowledge community) | 500+ DAU by end of Phase 1 |
| Secure institutional partnership | Union or apprenticeship board letter of support | 1 signed partnership agreement |
| Validate onboarding UX | Completion rate (through first contribution) | 60%+ complete onboarding |
| Validate credibility model | Endorsements issued per active contributor | 3+ endorsements per 10 active users |
| Validate no major fraud patterns | False credentials flagged during audits | <1% of all credentials flagged |

### **Phase 2: Build & Monetize (Months 5–15)**

| **Goal** | **Success Metric** | **Target** |
|---|---|---|
| Achieve product-market fit | Monthly active users (trades-specific) | 5,000+ MAU |
| Establish institutional revenue | Paying institutional contracts | 2+ union locals OR 3+ contractors |
| Build mentorship pipeline | Active mentorships initiated | 50+ mentorships in various states |
| Generate credentials at scale | Credentials issued per month | 200+ credentials/month |
| Reach mentor tier threshold | Users eligible for mentorship tier | 20+ users at mentor tier |

### **Phase 3: Scale (Year 2+)**

| **Goal** | **Success Metric** | **Target** |
|---|---|---|
| Expand trade coverage | Additional Red Seal trades live | 3–4 trades (plumbers, HVAC, welders) |
| Scale institutional revenue | Paying institutional subscribers | 10+ unions OR 20+ contractors |
| Establish revenue pattern | Year 2 annual recurring revenue | $1.2M+ institutional subscriptions |
| Government integration | Federal RFP responses | 1+ successful government co-funding project |
| Build the ecosystem | Third-party integrations | Apprenticeship board LMS integrations, payroll system connectors |

---

## **4. Revenue Model & Financial Projections**

### **Model: Freemium Individual + Enterprise B2B SaaS**

Robin operates a hybrid revenue model:
- **Individual tier (primary user experience):** Free with optional $10/month premium
- **Union/Enterprise tier (secondary revenue):** Per-member subscription ($8–12/month, purchased by union in bulk)

Both tiers access the same global platform. Individual and union members see the same experience.

### **Revenue Streams**

| **Stream** | **Customer Segment** | **Pricing** | **Launch** | **Rationale** |
|---|---|---|---|---|
| **Individual Premium Tier** | Tradespeople (individuals) | $10/month | Phase 1+ | Advanced credential portfolio; mentor matching priority; Red Seal exam prep integration; optional, not required |
| **Union Subscriptions** | Union locals (primary enterprise customer) | $8–12 per member/month | Phase 2 | De-risks cold-start problem; provides early revenue while building individual adoption; bulk onboarding creates instant user base |
| **Employer/Contractor Subscriptions** | General contractors, electrical contractors | $75–150 per seat/year (min 25 seats) | Phase 2 | Workforce visibility; secondary sales channel; grows as individual adoption creates bottom-up demand |
| **Government Grant Funding** | Federal & provincial programs | Variable; co-applications with partners | Phase 1 onward | Union Training and Innovation Program, Canadian Apprenticeship Strategy, wage subsidy alignment; treated as upside, not core model |
| **Training Marketplace** | Technical colleges, online providers | Commission on course completions (10–15%) | Phase 2+ | Revenue from educational partner ecosystem; identifies and fills skills gaps |

### **How Individual + Union Revenue Interact**

**Scenario 1: Individual user (not in a union)**
- Free tier: Access Q&A community, reputation system, basic mentorship browsing
- Premium tier ($10/month): Advanced credential portfolio, mentor matching priority, Red Seal exam prep tools
- No union, no change to experience based on employment

**Scenario 2: Union member (covered by union subscription)**
- Free tier (paid by union): Full access to Q&A community, reputation system, mentorship matching
- Premium tier ($10/month additional): Optional; adds advanced features on top of union-provided access
- When member leaves union: Access continues until union subscription period ends; then reverts to free tier or individual premium

**Scenario 3: Contractor employee (employer has subscription)**
- Employer subscription covers: Full access to knowledge community, reputation system, mentorship
- Individual premium ($10/month): Optional; adds advanced features
- When employee leaves employer: Access reverts to free tier or individual premium based on purchase history

### **Financial Projections (Class 3 ±40%)**

All figures in CAD. Projections reflect the hybrid model where union subscriptions provide institutional revenue floor while individual premium grows gradually.

| **Metric** | **Year 1** | **Year 2** | **Year 3** |
|---|---|---|---|
| **Individual premium subscriptions** | $24,000 | $240,000 | $960,000 |
| **Union subscriptions** | $288,000 | $1,200,000 | $3,000,000 |
| **Employer subscriptions** | $80,000 | $320,000 | $800,000 |
| **Government grant funding** | $200,000 | $100,000 | $50,000 |
| **Training marketplace commissions** | $0 | $60,000 | $300,000 |
| **TOTAL REVENUE** | **$592,000** | **$1,920,000** | **$5,110,000** |
| **Operating costs** | $200,000 | $390,000 | $680,000 |
| **Operating margin** | **~66%** | **~80%** | **~87%** |

**Key assumptions:**

**Individual premium:**
- 2% conversion of free users to premium (Year 1: 1,200 paying users × $10/month × 12 = $144K; adjusted conservatively to $24K at early stage)
- Conversion increases to 4% by Year 2 (5,000 users; adjusted to $240K accounting for churn and lower early adoption)
- Growth accelerates Year 3 as network effects compound and premium features become more valuable

**Union subscriptions:**
- Year 1: 2 pilot unions (avg 1,000 members each) × $12/month = $288K recurring
- Year 2: 6 unions (avg 1,500 members) × $12/month = $1.08M (rounded to $1.2M with new signups)
- Year 3: 12 unions (avg 2,000 members) × $12/month = $2.88M (rounded to $3M with churn adjustment)

**Employer subscriptions:**
- Year 1: 5 contractors (avg 30 seats) × $100/seat = $75K (conservative)
- Year 2: 20 contractors × $100/seat × 35 seats average = $320K
- Year 3: 40 contractors × $100/seat × 40 seats average = $800K

**Government grants:**
- Year 1: One successful grant application to Union Training & Innovation Program = $200K
- Years 2–3: Declining as initial program winds down; new programs emerge

---

## **5. Target Customer Segments**

### **Primary: Individual Tradespeople (Freemium Model)**

**Problem solved:** Build professional credibility through demonstrated expertise; earn portable credentials; find or become mentors; access knowledge community.

**User acquisition:** Organic sign-up + word-of-mouth within union networks (after union customers activate members).

**Monetization:** Free tier (core access); premium tier $10/month (advanced credential portfolio, mentor matching priority, Red Seal exam prep).

**KPI:** Engagement (DAU, content contributions, endorsements received).

### **Secondary: Union Locals (Enterprise SaaS)**

**Problem solved:** Bulk onboarding of apprentices + journeypersons; structured mentorship program management; apprentice progress visibility; outcomes reporting for government.

**Purchasing decision:** Union apprenticeship coordinators and regional officers.

**Contract value:** Per-member subscription ($8–12/month). A 2,000-member local = $240,000/year.

**Strategic role:** De-risks cold-start problem (union activation = instant user base + content). Provides early revenue while building individual adoption.

**Critical constraint:** Unions are customers, NOT product directors. Individual experience remains global and consistent. See Section 6 "Enterprise Model Constraints" for details.

### **Secondary: Apprenticeship Boards & Training Institutions**

**Problem solved:** Digital logbook integration; Red Seal exam preparation tracking; graduate employment outcomes visibility.

**Purchasing decision:** Provincial apprenticeship board directors; college directors of trades programs.

**Contract value:** Per-institution license ($50,000–$150,000/year) plus API integration fees.

**Strategic value:** Government alignment; integration with official apprenticeship systems. Nice-to-have, not core to Phase 1.

### **Secondary: General & Electrical Contractors**

**Problem solved:** Workforce credential visibility (who is certified, who is ready for advancement); apprenticeship management; succession planning; recruiting tools.

**Purchasing decision:** HR managers, project managers, owners of mid-size firms (25+ employees).

**Contract value:** Per-seat annual license ($75–150/seat, minimum 25 seats). A 50-person firm = $3,750–$7,500/year.

**Distribution:** Secondary sales channel; grows as individual platform adoption increases demand from their workforce.

---

## **6. Enterprise Model Constraints (Non-Negotiable)**

The platform uses a **global, individual-first experience** with optional enterprise features for unions and contractors. This section defines the boundaries of enterprise customization.

### **6.1 Individual Credential Ownership is Permanent & Non-Negotiable**

**Principle:**
A tradesperson's credentials, reputation score, Q&A contributions, and mentorship history belong to the individual — not to their union, employer, or any organisation.

**Implication:**
- Union member leaves Local 1 and joins Local 2 → Their Robin profile moves with them; they retain all credentials and reputation
- Contractor employee becomes self-employed → Their credentials follow them
- A member's record is portable across provinces, employers, and unions for life

**In ToS:** "Your credentials, reputation score, and contribution history are owned by you and remain accessible to you regardless of employment status, union membership, or location changes. Organisations (unions, employers) cannot access, control, modify, or delete your personal record."

### **6.2 Global Platform Experience (No Fragmentation)**

**Principle:**
All users see the same core Robin platform, regardless of whether they're in a union, employer, or individual.

**What this means:**
- A union member and an individual both see the same Q&A feed (electricians everywhere, not just their local)
- Reputation scoring is the same algorithm for all users
- Mentorship matching is global (not restricted by union or location)
- Credential types are consistent across all customers

**What fragmentation looks like (forbidden):**
- "Our union members should only see Q&A from electricians in Alberta" ← NO
- "Our local gets a white-labeled version of Robin" ← NO
- "We want a custom credential type that only our union uses" ← NO
- "Our union wants member records hidden from other unions" ← NO

**Why:** Network effects require scale. Fragmenting the platform kills the core value (access to global trades knowledge and expertise).

### **6.3 Customization Allowed: Cosmetic Only**

**Enterprise customers (unions, employers) can customize:**

- **Report headers:** Add organisation logo to admin reports (cosmetic, no functional change)
- **Communication:** Union-specific announcements or welcome messages on union-managed accounts
- **Admin dashboard:** White-label the union coordinator dashboard (internal tool, not user-facing)
- **Bulk import templates:** Custom CSV format for your specific data structure

**Enterprise customers cannot customize:**
- Core product experience (no separate UI for union members)
- Reputation algorithm or scoring weights
- Credential types or definitions
- Visibility/privacy rules that fragment the experience
- Content moderation or approval workflows

**Why this boundary:** Customization should not create different products. It should make administration easier for the enterprise buyer.

### **6.4 Access Retention for Departing Members**

**Scenario:**
A member is in a union that subscribes to Robin ($10/member/month). The member leaves the union and is no longer covered by the subscription.

**Policy:**
"Members who leave an organisation with an active Robin subscription retain full access to Robin until the subscription period ends. After the subscription period ends, departing members revert to free tier access (or purchase premium individually if desired). No prorated refunds or credits are issued."

**Why this approach:**
- Simplicity — no credit system to manage
- Fairness — the departing member paid for access through the union subscription period
- Sustainability — no weird edge cases (partial refunds, subscription disputes)
- Clarity — union contract specifies end date; access terminates when contract terminates

**In ToS:** "Your access to Robin continues for the duration of your organisation's subscription period, even if you leave the organisation. After the subscription period ends, your access level reverts to free tier unless you purchase premium individually."

### **6.5 Credential Wallet & Authenticity**

**Principle:**
Robin provides a unified digital credential wallet where tradespeople can upload, store, and share all their professional credentials — Red Seal, safety tickets, apprentice/journeyperson certificates, continuing education, equipment certifications, and any other professional documents. The wallet is complementary to (not competitive with) government credential systems.

**Credential Types in Scope:**

Robin accepts uploads for credentials including (but not limited to):
- **Government/Official:** Red Seal endorsement, apprentice/journeyperson certificates, trade-specific provincial certifications
- **Safety/Compliance:** WHMIS, First Aid/CPR, fall protection, confined space entry, arc flash awareness, scaffolding, forklift certification
- **Continuing Education:** Trade courses, equipment manufacturer certifications, union training, college/technical certificates
- **Employer/Industry:** Company-specific qualifications, equipment certifications, specialized technique certifications

**Credential Status Levels:**

All credentials in the wallet have a status indicator visible to employers and other viewers:

**Level 1: SELF_REPORTED (default)**
- User uploads credential document
- Robin does not verify
- Displayed with watermark: "Self-reported — not verified by Robin"
- Employer must verify through official sources before relying on it

**Level 2: VALIDATED_BY_[COMPANY/UNION] (employer/union flag)**
- During bulk import or manual upload, an employer or union can mark specific credentials as "validated by us"
- Example: HVAC company bulk-imports 50 employees' credentials and marks their safety certifications as "validated by Acme HVAC"
- Displayed with watermark: "Validated by [Company Name]"
- **Liability:** By marking a credential as validated, the employer/union accepts responsibility for its authenticity
- ToS language: "Organizations that mark credentials as validated warrant their authenticity and accept full liability if they are later found to be forged or inaccurate"

**Level 3: VERIFIED_BY_[OFFICIAL_SOURCE] (future, Phase 2+)**
- When government or official credential systems develop APIs, credentials verified against them are marked: "Verified by Red Seal Canada" or "Verified by [Apprenticeship Board]"
- Displayed with watermark: "Officially verified by [Source]"
- Robin assumes no liability; official source is authoritative

**Use Case: On-Site Credential Sharing**

A tradesperson or company can share credentials via QR code from their phone to show on a job site:

**For company-validated credentials:**
- Site manager scans QR code
- Sees credentials with "Validated by [Company]" watermark
- Can contact the company to confirm
- Greater confidence than self-reported, but still on company's reputation

**For self-reported credentials:**
- Site manager scans QR code
- Sees "Self-reported — not verified by Robin" watermark
- Should contact official verification channels before relying on it
- Clear warning that this is not proof-of-qualification

**Why This Works:**

- Companies that validate their employees' credentials stake their reputation on those credentials
- Robin is not claiming to verify anything; we're just displaying what the company/union/official source says
- Liability flows to the entity making the validation claim, not to Robin
- Individuals with self-reported credentials are transparent that they're not verified
- Government systems can be integrated later and marked as officially verified

**Current Verification Model (Phase 1–2):**

All imported credentials are flagged as either **"SELF_REPORTED"** (default) or **"VALIDATED_BY_[EMPLOYER/UNION]"** (if marked during bulk import).

- User uploads credential document (PDF, image, etc.)
- Document is stored encrypted in AWS ca-central-1
- Flagged with appropriate watermark
- User can share their credential wallet via QR code or shareable link
- Employers can view the wallet and see the watermark status
- Site managers can determine whether to accept the credential based on the validation status

**Future Verification Model (Phase 2+):**

As government and official credential systems develop APIs, Robin will integrate verification layers:

- **Red Seal Digital integration:** When the federal Red Seal Digital system is available, credentials are verified against the official government registry and marked "VERIFIED_BY_RED_SEAL_CANADA"
- **Provincial apprenticeship board integration:** When boards create APIs, we verify apprentice/journeyperson certificates and mark as "VERIFIED_BY_[PROVINCE]"
- **Safety training registries:** As safety certification bodies create digital registries, we integrate and mark as "VERIFIED_BY_[ISSUER]"
- **Selective integration:** We add verification layer by layer as official systems emerge; credentials without official verification remain self-reported or company-validated

**Credential Sharing & Mobile Use:**

- Users can generate a QR code linking to their credential wallet
- On-site display: A tradesperson can show the QR code on their phone to an employer/site manager
- Watermarks clearly indicate: "Self-reported," "Validated by [Company]," or "Officially verified by [Source]"
- **Important:** The site manager/employer must make their own decision about whether to accept the credential based on the watermark and verification source

**Liability & Legal Boundaries:**

Robin does not:
- Warrant the authenticity of any uploaded credential
- Verify credentials marked as self-reported (until official APIs are integrated)
- Accept liability for forged, expired, or inaccurate documents
- Promise that credentials are acceptable proof-of-qualification

**Organisations (companies, unions) that mark credentials as "validated":**
- Accept full responsibility for the accuracy and authenticity of those credentials
- Warrant that they have verified the documents before marking them as validated
- Accept liability if those credentials are later found to be forged or inaccurate

**In ToS:**

"Robin provides secure storage for your professional credentials. You are responsible for the accuracy and authenticity of all documents you upload. Robin does not verify credentials marked as SELF_REPORTED and does not warrant their accuracy or legal standing.

Organisations (companies, unions) that mark credentials as 'VALIDATED_BY_[ORGANISATION]' during bulk import warrant that they have verified those credentials and accept full liability for their authenticity.

Site managers, employers, and other parties viewing credentials should:
1. Check the watermark status (Self-reported, Validated by [Company], or Officially verified)
2. Verify credentials through official sources before making hiring or safety decisions
3. Contact the validating organisation if they have questions about a validated credential

If you discover a fraudulent credential on Robin, report it immediately. If a fraudulent credential is marked as 'VALIDATED_BY_[ORGANISATION],' that organisation's validation privileges may be revoked. Robin reserves the right to remove false credentials and suspend or remove accounts that submit fraudulent documents."

---

### **6.6 Content Liability & User-Generated Content Policy**

**Principle:**
Robin hosts user-generated content (Q&A, knowledge posts, answers, comments). Robin is not liable for the accuracy, safety, or legal standing of this content. Users are responsible for what they post. This follows the Reddit/Stack Overflow model: community-driven moderation, transparent disclaimers, and clear liability boundaries.

**What Robin Does NOT Do:**

- Pre-screen all content for technical accuracy before publishing
- Warrant the safety of instructions or advice posted by users
- Review content for legal compliance with electrical codes, safety regulations, or other standards
- Accept liability if someone follows advice and is injured, property is damaged, or laws are broken

**What Robin DOES Do:**

- Remove obviously dangerous content if flagged by users
- Suspend or remove accounts posting repeated fraudulent or harmful content
- Respond to reports of content that violates ToS (harassment, spam, discrimination)
- Display a ToS disclaimer on the content submission form
- Use AI screening to flag suspicious content and peer endorsement system to identify high-quality contributors

**Content Moderation Model:**

**Green Zone (General Knowledge):**
- "What's the difference between 14 AWG and 12 AWG wire?"
- "Tips for reading electrical blueprints"
- "How do you avoid burnout in a trades career?"
- **Action:** Post freely, AI screens for basic quality and domain relevance

**Yellow Zone (Safety-Adjacent):**
- "How do I install a 200A panel?" (correct procedures important)
- "Troubleshooting a circuit that keeps tripping"
- "Best practices for working in hot conditions"
- **Action:** AI screening flags for quality. Peer review and upvote system filters expertise. Users decide whether to trust the answer based on upvotes and the author's reputation.

**Red Zone (Obviously Dangerous):**
- "Here's how to bypass your circuit breaker to save money"
- "Use this shortcut to disable safety interlocks"
- "Ignore lockout/tagout if you're in a hurry"
- **Action:** Removed by moderation if flagged. Account flagged for repeated violations.

**Why This Model Works:**

- Robin doesn't have expertise in every trade, every jurisdiction, every code variation. Pre-screening everything is impossible.
- Peer expertise + reputation system is more reliable than single-point-of-failure moderation
- Community self-policing (downvotes, flags, peer endorsements) is more transparent than hidden moderation
- Reddit handles millions of posts with this model; so can Robin

**Liability Disclaimer (In ToS & Content Submission Form):**

"Robin hosts user-generated content including questions, answers, and knowledge posts. Robin does NOT warrant the accuracy, safety, or legality of this content.

**By viewing or following any advice or instructions on Robin, you acknowledge:**

1. Content is posted by community members, not experts employed by Robin
2. Robin does not verify the technical accuracy or safety of any content
3. Different jurisdictions have different codes and regulations; content may not apply to your location
4. You are responsible for verifying advice through official sources (your local authority having jurisdiction, your employer, a licensed professional) before implementing it
5. If you are injured, property is damaged, or code violations occur because you followed advice from Robin, Robin is not liable
6. You should always consult a licensed professional for safety-critical decisions

**Reporting Dangerous Content:**

If you see content that you believe is dangerous or violates these guidelines, report it immediately using the flag/report button. Reported content is reviewed by moderators. Flagged content is not automatically removed — it is reviewed in context and reported content that is genuinely dangerous will be removed."

**Appeal Process:**

Users whose content is removed can appeal to Robin moderators with evidence that the content is not dangerous or violates the policy. Appeals are reviewed within 7 days.

**Account Suspension Policy:**

Repeated violations (5+ dangerous or false posts reported and confirmed) result in:
- First offense: 30-day suspension, required review of ToS
- Second offense: 90-day suspension
- Third offense: Account removal

**Why Robin Isn't Liable:**

This model is legally sound because:

1. **Section 230 Protections (US)** / **Equivalent in Canada:** Robin is a platform host, not a publisher. We're not liable for user-generated content as long as we remove it when notified of violations.

2. **Clear Disclaimers:** Users explicitly acknowledge they're reading community advice, not professional guidance.

3. **No Expertise Claims:** Robin doesn't claim to verify technical accuracy or safety. The reputation system is transparent about this.

4. **Responsive Moderation:** We remove dangerous content when flagged, showing good faith effort.

5. **Community Controls:** Users can downvote bad advice, which de-ranks it.

**What Liability REMAINS:**

- If Robin knowingly hosts illegal content and doesn't remove it, we could be liable
- If Robin misrepresents content as "verified" or "safe" when it's not, we could be liable
- If Robin fails to remove content after being notified it's dangerous, we could be liable

**Mitigation:**
- Always display watermarks on credentials (self-reported vs. verified)
- Never claim content is "safe" or "verified" unless we've actually verified it
- Respond promptly to reports of dangerous content
- Keep audit logs of content removal decisions

**In ToS:**

"Robin is a community platform. You are responsible for all content you post. Robin does not verify the accuracy, safety, or legality of user-generated content and is not liable for injuries, property damage, code violations, or other harms that result from following advice posted on Robin.

If you see dangerous content, report it. If reported content is confirmed to violate these guidelines, it will be removed. Robin reserves the right to suspend or remove accounts that repeatedly post dangerous, false, or harmful content.

Always consult official sources and licensed professionals before making safety-critical decisions."

---

## **7. Scope: Vertical, Trades-Specific Implementation**

### **Decision: Why Not Horizontal?**

Robin is explicitly designed as a **vertical implementation** focused on Canada's skilled trades workforce, not a horizontal "expertise network across all industries."

**Rationale:**

1. **Market clarity** — Trades is a $6B government-mandated initiative with clear institutional buyers (unions, apprenticeship boards). Trying to serve engineering, nursing, finance, and agriculture simultaneously dilutes product focus and extends time-to-market.

2. **Language & UX** — Trades have their own hierarchy (apprentice → journeyperson → master), certifications (Red Seal), and institutional structures (union locals, apprenticeship boards). Generic expertise credentialing doesn't speak this language. Robin's gamified onboarding explicitly mirrors trades progression.

3. **Institutional distribution** — Unions are established sales channels with procurement processes and grant co-application eligibility. A generic platform has no such advantage.

4. **Regulatory tailoring** — Credential requirements, verification standards, and audit procedures differ between professions. Being specific allows compliance depth; being generic forces lowest-common-denominator design.

5. **Defensibility** — A trades-focused competitor must build credibility with unions and apprenticeship boards (18–24 months). A generic competitor starts with architectural flexibility but no market traction.

**Future optionality:** If Robin achieves strong PMF and revenue in trades (Phase 3, Year 2+), the architecture can support expansion to adjacent professions (nursing, engineering technicians, skilled manufacturing). This decision does not preclude future growth—it prioritises the high-confidence, well-funded beachhead first.

---

## **8. Core Functional Requirements**

### **Phase 1: Knowledge Community & Onboarding (MVP)**

**Scope:** Gamified onboarding (Zones 1), SME knowledge community (Zone 2), reputation foundation (Zone 3, basic).

**Core Challenge:** Beyond signing up, what brings a tradesperson back to Robin daily, especially in Phase 1 when mentorship isn't available yet?

#### **8.0 Daily Engagement Loops for Phase 1**

Phase 1 success depends on **four reinforcing engagement loops** that operate simultaneously. Each loop is designed to create repeated daily usage:

**Loop 1: Contribution & Validation**
- User answers a question about panel installation
- Answer is published (passes AI screening or gets peer endorsement)
- Answer receives 3+ upvotes within 24 hours
- User gets notification: "Your answer on [topic] got 3 upvotes!"
- User's reputation increases (visibly, in dashboard)
- User returns next day to answer more questions
- **Stickiness:** Every contribution creates immediate feedback (upvotes) + reputation gain

**Loop 2: Ranking & Recognition**
- User answers 10 good questions over 2 weeks
- User's profile now shows: "Ranked #18 in panel installation expertise"
- User sees they're close to #10 (the threshold for "Expert" badge on their profile)
- User is motivated to answer 5 more good questions to break into top 10
- When they reach top 10, their profile changes to show "Expert in panel installation"
- **Stickiness:** Gamified ranking creates aspirational goals and social proof

**Loop 3: Learning & Problem-Solving**
- User searches for "troubleshooting commercial circuits" (they're stuck on a job)
- Finds 3 relevant Q&A threads from other electricians
- Reads the solutions and learns something new
- Saves the thread to their bookmarks (offline accessible)
- Returns to apply the knowledge, comes back to confirm it worked or ask follow-up
- **Stickiness:** Robin solves immediate, practical problems → user becomes dependent

**Loop 4: Peer Recognition & Status**
- A respected journeyperson (verified, high reputation) endorses the user for "panel installation"
- User gets notification with the endorsement
- Endorsement is visible on user's profile and reputation dashboard
- User feels validated (social recognition from a real peer in their field)
- User is motivated to earn more endorsements by contributing more
- **Stickiness:** Peer recognition from qualified professionals is motivating

**Why All Four Loops Matter:**

- **Loop 1** ensures immediate feedback (without it, contributions feel hollow)
- **Loop 2** creates long-term goals (aspirational, not transactional)
- **Loop 3** provides tangible utility (solves real job-site problems)
- **Loop 4** creates social motivation (recognition from respected peers, not strangers)

A user might enter through Loop 3 (searching for help), stay for Loop 1 (they try answering and get upvotes), and return because of Loops 2 and 4 (ranking and recognition).

**Implementation Requirements for Phase 1:**

- Real-time upvote notifications (so Loop 1 feedback is immediate)
- Public ranking/leaderboard by topic (supports Loop 2)
- Robust search + bookmarking (supports Loop 3)
- Visible peer endorsements on profiles (supports Loop 4)
- Mobile-optimized notifications (so users see engagement when off-site)

**Engagement Success Metrics for Phase 1:**

| **Loop** | **Phase 1 Target** |
|---|---|
| Loop 1 (Contribution feedback) | 70%+ of answers receive at least 1 upvote within 7 days |
| Loop 2 (Ranking/Recognition) | 50+ users visible on leaderboards (top 20 per major topic) |
| Loop 3 (Learning) | 40% of DAU use search or save content to bookmarks |
| Loop 4 (Peer Recognition) | 3+ endorsements per 10 active users; endorsers are verified experts |

**Return Rate Metrics:**

- Day 2 return: 45%+ of onboarded users
- Day 7 return: 30%+ of onboarded users
- Day 30 return: 20%+ of onboarded users (the core engaged users)

---

#### **8.1 Onboarding & Identity**

- [ ] Role selection (apprentice, journeyperson, master, employer)
- [ ] Trade & specialisation picker (Red Seal trades seeded)
- [ ] Gamified three-step tutorial with trades hierarchy language
- [ ] Profile setup (name, years experience, employer, province, union local)
- [ ] Optional credential import (Red Seal ticket, safety tickets)
- [ ] First contribution as onboarding action (user answers a question or posts)
- [ ] First credential issued immediately upon completion

**Success metric:** 60%+ completion through first contribution.

#### **8.2 Knowledge Community (Q&A-First)**

- [ ] Content feed (chronological + algorithmic, filtered by trade/topic)
- [ ] Ask a question (trade category, specialisation tag, body, optional media)
- [ ] Answer a question (rich text, photos, step-by-step formatting, safety flags)
- [ ] Post knowledge (shorter form; techniques, job site insights, lessons learned)
- [ ] Upvote / downvote on all content
- [ ] Content detail view (full thread with answers and peer endorsements)
- [ ] Topic / tag browse
- [ ] Full-text search (Algolia-powered)
- [ ] Saved content / bookmarks (personal, offline accessible)

**AI screening:** All submissions queued for async AI quality screening before publication (not blocking). Status shown to user (pending review / published / flagged).

**Quality threshold:** Only publish content with `aiQualityScore ≥ 0.35` OR after peer endorsement from verified master/journeyperson.

**Success metric:** 200+ published posts per week by end of Phase 1.

#### **8.3 Reputation Foundation**

- [ ] Personal reputation dashboard (score breakdown, progress toward next tier, transparent thresholds)
- [ ] Reputation events logged immutably (content upvotes, answers accepted, credentials issued)
- [ ] Basic peer endorsement (verified users in same trade can endorse expertise in specific topics)
- [ ] Endorsement rationale required (no empty endorsements; min 80 chars)
- [ ] Transparent mentor eligibility threshold (currently 750 points; fully visible)

**Success metric:** 3+ endorsements per 10 active users; <1% fraudulent credentials flagged in audit.

---

### **Phase 2: Mentorship & Institutional Features**

**Scope:** Earned mentor tier (Zone 3), mentorship matching (Zone 3), credential issuance (Zone 3), basic institutional admin (Zone 5).

- [ ] Mentor tier unlocked at 750 points
- [ ] Browse available mentors (filtered by trade, specialisation, location, availability)
- [ ] Request mentorship (structured form with goals and time commitment)
- [ ] Accept / decline mentorship requests (mentor only)
- [ ] Active mentorship dashboard (both parties)
- [ ] Mentorship milestones & progress tracking
- [ ] Post-completion mentorship reviews (rated, visible on profile)
- [ ] Open Badge credential issuance (cryptographically signed, verifiable externally)
- [ ] Credential wallet (exportable as PDF, Open Badge JSON, QR code)
- [ ] Union coordinator dashboard (member directory, mentorship program management)
- [ ] Employer dashboard (workforce credential visibility, skills gap analysis)

**Success metric:** 50+ active mentorships; 10+ users reaching mentor tier.

---

### **Phase 3: Scale & Ecosystem**

**Scope:** Training marketplace (Zone 4), expanded institutional admin (Zone 5), multi-trade expansion, government integration.

- [ ] Training marketplace (course discovery, provider integration, credential import)
- [ ] Advanced institutional admin (job posting, advanced analytics, bulk operations)
- [ ] Additional trades live (plumbers, HVAC, welders)
- [ ] Government digital logbook integration
- [ ] Payroll / HR system connectors
- [ ] Advanced reporting for institutional partners

---

## **9. Non-Functional Requirements**

### **Performance**

| **Metric** | **Target** | **Notes** |
|---|---|---|
| **Page load (first paint)** | <2s at 3G speeds | Job site access; mid-range Android phones |
| **API response time (p95)** | <500ms | Q&A feed, content posting |
| **Search latency (p95)** | <300ms | Powered by Algolia |
| **Uptime SLA** | 99.5% | Production only; maintenance windows allowed with notice |
| **Concurrent users (Phase 1 launch)** | 1,000 simultaneous | Scale to 10,000 by Year 2 |

### **Accessibility & Mobile**

| **Requirement** | **Rationale** |
|---|---|
| **Progressive Web App (PWA)** | Offline capability; app-like experience; no app store friction |
| **Mobile-first design** | Tradespeople access on job sites; dirty hands; older Android devices |
| **Minimum 44px tap targets** | Accessibility on site; gloves and dirty hands |
| **WCAG 2.1 AA compliance** | Legal; institutional buyers require it |
| **Language: Plain trades English** | Avoid jargon; accessible to non-university-educated workers |
| **Test on mid-range Android** | Real user base (Samsung A-series, not flagship) |

### **Security & Compliance**

| **Requirement** | **Standard / Law** | **Implementation** |
|---|---|---|
| **PII data residency** | PIPEDA (Canada) | AWS ca-central-1 only; never us-east-1 |
| **Credential tamper-resistance** | Open Badges 3.0 spec | Ed25519 cryptographic signing; externally verifiable |
| **Credential revocation** | Open Badges 3.0 spec | Revocation endpoints; reason tracked; audit trail |
| **Authentication** | Industry standard | Auth0 (never custom auth on credentialing platform) |
| **Rate limiting** | API security | 200 req/15min global; 10 req/min on content submission |
| **Input validation** | OWASP Top 10 | Zod validation at all API boundaries; no SQLi, XSS, CSRF risk |
| **Audit logging** | Fraud prevention | All credential issuance, endorsement, and score changes logged |
| **Code review** | Credential security | All auth, credential issuance, and migration code requires human review before merge (no exceptions) |

### **Data & Scalability**

| **Requirement** | **Target** | **Timeline** |
|---|---|---|
| **Data volume (Year 1 end)** | 10,000 users; 50,000 content items; 30,000 endorsements | Manageable with PostgreSQL + indexes |
| **Data volume (Year 3 end)** | 250,000 users; 5M content items; 2M endorsements | Requires read replicas; possible Redis caching layer |
| **Backup & recovery** | Daily incremental; weekly full | AWS RDS automated backups |
| **Change data capture** | Reputation score materialization | PostgreSQL triggers + async worker job |

---

## **10. Strategic Scope Decisions**

### **10.1 Q&A-First Approach (Confirmed)**

**Decision:** The platform launches with Q&A as the primary activity that drives reputation, not general credentialing or mentorship.

**Rationale:**
- Tradespeople have immediate, practical problems they need solved (code questions, tool diagnostics, safety issues)
- Content creation is the activity that builds credibility in trades — you can't claim expertise without demonstrating it
- Q&A is familiar from Stack Overflow and Reddit — lower onboarding friction
- Q&A generates the data that the reputation system runs on

**Implication:** The knowledge community (Zone 2) is Phase 1 MVP. Mentorship (Zone 3) follows in Phase 2, after reputation signals have data to work with.

---

### **10.2 Anti-Gaming Framework (Recommended)**

**Problem:** LinkedIn's endorsement system is broken because:
- Endorsements from anyone count equally (bot farms = verified professionals)
- No cost to false claims (zero consequence for fraud)
- Friend groups endorse each other in rings with no detection
- Vanity metrics (follower counts) drive growth over credibility

Robin must prevent these patterns. The following framework is recommended:

#### **Core Principle: Credibility-Weighted Endorsements**

All credibility signals (endorsements, upvotes, content quality scores) are weighted by the **issuer's own verified tier**.

#### **Implementation: 9-Part Anti-Gaming Architecture**

**1. Verification Tiers (Primary Gate)**

```
VERIFIED MASTER endorsement           → 3.0x weight
VERIFIED JOURNEYPERSON endorsement   → 1.5x weight
VERIFIED APPRENTICE endorsement      → 0.5x weight
UNVERIFIED USER endorsement          → 0.1x weight
NEW ACCOUNT (<30 days)               → 0.05x weight
```

**Verified** requires: Red Seal ticket, employer work history verification, or apprenticeship board confirmation. Not automatic.

**Effect:** Bot farm endorsements contribute 5 points total; a verified master endorsement contributes 3 points. Self-promotion rings are immediately defanged.

---

**2. Cross-Network Weighting (Prevent Friend Rings)**

Endorsements from the same immediate network carry lower weight than external endorsements:

```
Same employer, endorsing same person        → 0.8x
Same union local, endorsing same person    → 0.8x
Same geographic region (<50km)             → 1.0x
Different province                         → 1.2x
Different trade (verified in both)         → 1.3x
```

**Effect:** A journeyperson in your union local *can* endorse you (legitimate peer recognition). But if 20 people from your local endorse you for 10 different topics in one week, the system discounts the pattern.

---

**3. Contribution Gate (Can't Endorse Without Proof)**

Users cannot issue peer endorsements until they meet a baseline:

```
Minimum 20 published contributions (posts, answers, questions)
Minimum 60 days active on platform
Minimum 50 reputation points earned through own contributions
```

**Effect:** Brand-new accounts cannot flood someone with endorsements. You have to demonstrate your own credibility first.

---

**4. Temporal Decay (Rapid-Fire Endorsements Are Suspect)**

Multiple endorsements from the same user carry diminishing returns:

```
1st endorsement from this person (within 30 days)    → 1.0x weight
2nd endorsement (within 30 days)                     → 0.7x weight
3rd endorsement (within 30 days)                     → 0.4x weight
4th+ endorsements (within 30 days)                   → 0.1x weight (flagged for audit)
```

**Effect:** Real expertise recognition happens over time. Rapid-fire endorsements from one person look like gaming and get weighted accordingly.

---

**5. Topic Specificity (Prevents Broad Faking)**

You cannot build broad "electrician expertise." You build credibility in narrow topics:

```
Panel installation & wiring                 (52 points)
Troubleshooting residential circuits        (34 points)
Commercial conduit & cable sizing           (18 points)
Generator backup systems                    (5 points)
```

Each topic has its own threshold for mentor eligibility. You cannot fake expertise broadly.

---

**6. Reciprocal Detection (Gaming Is Visible)**

If two users endorse each other for the same topic, both endorsements are downweighted:

```
User A endorses User B for "panel installation"      → 1.0x weight initially
User B endorses User A for "panel installation"      → 1.0x weight initially

System detects reciprocal pair                       → both become 0.5x weight
```

This is mathematically simple and impossible to hide. Catches friend-group endorsement swaps immediately.

---

**7. Revocation & Credibility Penalty (Cost to Fraud)**

Unlike LinkedIn, false endorsements have consequences:

- Flagged endorsement is revoked after audit
- Endorser's credibility score drops by 10 points
- Multiple revocations → escalating penalties and eventual suspension from endorsing
- Revoked endorsements visible in audit log (transparent)

**Effect:** There's now an actual cost to gaming. If you endorse your friend fraudulently and get caught, it hurts your reputation. This changes behaviour.

---

**8. Mentor Tier as Fraud Firewall (Explicit Finish Line)**

The mentor eligibility threshold (750 points) is the finish line for reputation gaming:

- Requires sustained contribution over months (not weeks)
- Requires credible endorsements from verified peers (not bots)
- Requires peer diversity (can't all be from one local)
- Requires demonstrated mentorship outcomes (if you reach mentor tier, you actually have to mentor)

If someone tries to fake their way to mentor tier, the audit process will catch them. Cost of being caught is high — you lose mentor status, credentials get flagged, and your account gets downgraded.

---

**9. Transparent Audit Trail (No Hidden Gaming)**

Every endorsement, credential, and score change is timestamped and visible:

```json
{
  "endorsementId": "uuid",
  "endorser": "Sarah K.",
  "endorserTier": "journeyperson",
  "endorserVerified": true,
  "recipient": "Mike T.",
  "topic": "panel-installation-wiring",
  "weight": 1.2,
  "rationale": "Sarah has consistently demonstrated...",
  "issuedAt": "2026-05-01T14:22:00Z",
  "auditedAt": null,
  "status": "ACCEPTED"
}
```

Platform admins can see patterns (users A, B, C endorsing each other from same IP) and investigate.

---

#### **How This Prevents LinkedIn-Style Gaming**

| **LinkedIn Failure** | **Robin Solution** |
|---|---|
| Endorsements equally weighted | Weighted by endorser's verified tier (bot farms = 0.1x) |
| Self-declared expertise unaudited | Must demonstrate through sustained contributions |
| No revocation mechanism | Endorsements can be revoked; endorser reputation suffers |
| Friend-group gaming undetected | Reciprocal detection flags paired endorsements; cross-network weighting discounts in-group bias |
| No cost to being wrong | Fraudulent endorsement = 10-point reputation penalty + audit visibility |
| Vanity metrics drive growth | Reputation metrics are narrow and defensible |
| Algorithm amplifies engagement | Algorithm amplifies credibility, not engagement |

---

#### **Implementation Complexity & Timeline**

This framework requires:

| **Component** | **Effort** | **Timeline** | **Notes** |
|---|---|---|---|
| Verification tier logic | Low | Phase 1 | Simplest part; just stored flags in user table |
| Weight calculations | Medium | Phase 1 | Requires database schema for tracking endorsement weights and temporal decay |
| Reciprocal detection | Medium | Phase 1 | Algorithmic; runs at endorsement creation time |
| Audit queue & tooling | Medium | Phase 2 | Platform admin interface; batch processing of flagged endorsements |
| Revocation pipeline | Low | Phase 2 | Mark endorsements as revoked; decrement endorser reputation; re-calculate recipient scores |

**Recommendation:** Implement tiers 1–6 in Phase 1. Implement tiers 7–9 in Phase 2 when audit processes are being built.

---

#### **Institutional Bulk Verification (Designed, Gated, Deferred Implementation)**

**Problem:** Early users face friction (0.05x weight until verified, months to mentor tier). Enterprise deployment requires bulk onboarding — a union with 2,000 members cannot manually verify each one.

**Solution:** Bulk verification import with mandatory audit gate.

**Architecture:**

1. **Union/Partner Upload Interface**
   - Upload CSV/spreadsheet with format: `[email, displayName, role (apprentice/journeyperson/master), tradeCode, redSealNumber (optional)]`
   - File is validated for format and duplicate emails
   - Records queued for audit review (status = `PENDING_VERIFICATION`)

2. **Audit Gate (Mandatory)**
   - Platform admin reviews batch before any credibility is granted
   - Admin can approve full batch, reject batch, or selectively approve/reject rows
   - Rejection includes reason (emailed back to uploader)
   - Approved users get status = `VERIFIED_[ROLE]` instantly

3. **Credibility Assignment (Post-Approval)**
   - Approved users instantly become `VERIFIED_JOURNEYPERSON` (1.5x endorsement weight) or `VERIFIED_MASTER` (3.0x weight)
   - Their first 20 contributions carry no temporal decay (special flag)
   - They do NOT bypass contribution gate for issuing endorsements — still need 20 contributions + 60 days OR special exception granted by admin

4. **Abuse Prevention**
   - Spot-check audits: every 10th batch is manually verified against source (union records, apprenticeship board database)
   - Rejection rate tracked by institution — high rejection rates flag potential bad-faith uploads
   - Platform reserves right to revoke verified status if fraud is discovered post-upload
   - Union coordinator who uploads false verifications faces account restrictions

**Feature Flag:** This feature is disabled by default in Phase 1. Enabled for specific institutions in Phase 2+ on a case-by-case basis.

**Implementation Timeline:** Design in Phase 1 (schema + API). Implement in Phase 2 when first enterprise customer requests it (estimated 2–3 sprints).

**Why Design Now?** 
- Schema changes required (add `verificationBatchId`, `verifiedBy`, `verificationAuditedAt` fields to users table)
- API design required (POST /api/admin/verification-batches, PATCH /api/admin/verification-batches/:id)
- Avoids expensive rearchitecting when a union says "we have 5,000 members ready to go"
- Keeps Phase 1 tight (feature flag off) while unblocking enterprise scaling in Phase 2

**Trade-off:** You're dependent on partners uploading correct data. Spot-check auditing catches most fraud. If a union deliberately uploads false records to inflate their member count, that's a contract violation — enforceable through partnership agreement.

---

## **11. Constraints & Assumptions**

### **Hard Constraints (Non-Negotiable)**

| **Constraint** | **Reason** |
|---|---|
| Open Badges 3.0 (IMS Global standard) | Portability is the core value. Proprietary formats have zero portability value. |
| Individual credential ownership | Credentials move with the person across employers, unions, provinces. Never tenant-scoped. |
| Canadian data residency (ca-central-1 only) | PIPEDA compliance; no exceptions. |
| Never custom authentication | Credentialing platforms must use industry-standard auth (Auth0). Never build custom. |
| Transparent reputation mechanics | Thresholds, scoring weights, and audit criteria are visible to users. Hidden systems erode trust. |
| All credential-issuing code requires human review | AI-generated code in auth, credential issuance, and migrations must be reviewed by a human before merge. |

### **Key Assumptions**

| **Assumption** | **Risk If Wrong** | **Mitigation** |
|---|---|---|
| Union locals will view platform as valuable | Low (government mandate aligns incentives) | Phase 1 validation with 1–2 union pilots |
| Tradespeople will engage on knowledge questions | Medium (may prefer informal knowledge sharing) | Phase 1 UX testing with 15–20 target users |
| Gamified onboarding will resonate with 45–65 age demographic | High (core assumption; highest UX risk) | Prototype and test before building production |
| Mentor tier will be aspirational at 750 points | Medium (threshold may be too high or low) | Adjust based on Phase 1 contributor velocity |
| Cross-network endorsement bias will prevent gaming | Medium (may create false negatives) | Audit sampling and adjustment based on Phase 1 data |

---

## **12. Out of Scope (Explicit Deferral)**

The following are explicitly *not* being built in Phase 1. Document them here to prevent scope creep during development.

| **Feature / Capability** | **Phase** | **Reason for Deferral** |
|---|---|---|
| **Institutional bulk verification upload** | Phase 2 (designed, feature-flagged off in Phase 1) | Designed now (schema + API); feature flag disabled in Phase 1. Implement when first union requests bulk onboarding. Prevents expensive rearchitecting in Phase 2+. See Section 10.2 for architectural design. |
| **Employer job posting integration** | Phase 2 | Valuable but secondary; defer until institutional admin is stable. |
| **Advanced institutional analytics** | Phase 2 | Requires stable user base to provide meaningful data. |
| **Training marketplace** | Phase 2 | Requires partner integrations; Phase 1 is about establishing core platform credibility. |
| **Red Seal exam prep tools** | Phase 2+ | Valuable but specific; build after core platform is proven. |
| **Geographic matching** | Phase 2 | Mentorship matching works without location bias in Phase 1. Add later if demand exists. |
| **Multi-language support** | Phase 3 | Start with English; expand if government integration requires it. |
| **Mobile app (native iOS/Android)** | Phase 2+ | PWA is sufficient for Phase 1. Native app if user testing indicates necessity. |
| **Advanced AI features (chatbots, tutoring)** | Phase 3+ | AI screening is the only AI feature in Phase 1. Resist scope creep. |
| **Super Admin panel for platform configuration** | Phase 2 | Operationally unnecessary until institutional customer base exists. |
| **Bulk user imports & SSO integration** | Phase 2 | After core onboarding flow is stable; Phase 2 when institutional buyers arrive. |

---

## **13. Success Criteria & Phase Gate Reviews**

### **Phase 1 → Phase 2 Gate (End of Month 4)**

Before proceeding to Phase 2, the following must be true:

- [ ] 500+ daily active users in knowledge community
- [ ] 60%+ onboarding completion (through first contribution)
- [ ] <1% fraudulent credentials in audit sample
- [ ] 1 signed institutional partnership (union or apprenticeship board)
- [ ] No major UX friction discovered in usability testing with 15+ target users
- [ ] Reputation scoring algorithm is stable (score recalculation does not cause major shifts >20%)
- [ ] AI screening has tuned thresholds (false positive + false negative rate <5% combined)

**If not met:** Extend Phase 1 or pivot feature priorities.

### **Phase 2 → Phase 3 Gate (End of Month 15)**

Before proceeding to Phase 3, the following must be true:

- [ ] 5,000+ monthly active users
- [ ] 2+ paying institutional contracts signed and active
- [ ] 50+ mentorship relationships initiated
- [ ] 20+ users reaching mentor tier with no fraud incidents
- [ ] Institutional partner feedback is positive (NPS >40)
- [ ] Technical infrastructure is stable at 10x current load (tested)

**If not met:** Extend Phase 2 until PMF is clearer.

---

## **14. Key Dependencies & Risks**

### **External Dependencies**

| **Dependency** | **Impact** | **Mitigation** |
|---|---|---|
| **Auth0 availability** | Blocks authentication; platform offline if Auth0 down | Fallback to session token refresh; test failover |
| **Anthropic API (Claude) availability** | Blocks content screening; queue builds | Implement circuit breaker; batch processing reduces dependency |
| **Algolia search availability** | Impacts discoverability; search offline | Local fallback to PostgreSQL full-text search |
| **AWS ca-central-1 availability** | Blocks entire platform | No workaround; use AWS managed backups; multi-AZ PostgreSQL |

### **Internal Risks**

| **Risk** | **Severity** | **Mitigation** |
|---|---|---|
| **Credential system has flaw allowing forgery** | CRITICAL | Human review of all credential-issuing code; external security audit before Phase 2 launch |
| **Anti-gaming system creates false positives** | HIGH | Phase 1 audit sampling; adjust weights based on data; transparent appeals process for users |
| **Union partnership does not materialise** | HIGH | Diversify: talk to apprenticeship boards + contractors simultaneously; institutional value exists across segments |
| **Gamified UX rejected by older demographic** | HIGH | Prototype and test before building production; measure completion rate in early Phase 1 |
| **AI screening inaccuracy at domain level** | MEDIUM | Combine AI screening with peer credentialing; never rely on AI alone for quality gates |
| **Mentorship tier is too easy or too hard to reach** | MEDIUM | Adjust threshold during Phase 1 based on contributor velocity; survey mentor-eligible users on barrier to mentorship |

---

## **16. Technical Implications for Related Documentation**

The institutional bulk verification architecture requires design work in two related documents. These should be updated during the co-founder alignment call:

### **DATABASE_SCHEMA.md Updates Required**

**New tables:**
- `verificationBatches` — Bulk upload metadata (id, organisationId, uploadedBy, status, uploadedAt, auditedAt, auditedBy)
- `verificationBatchRows` — Individual rows from upload (id, batchId, email, displayName, role, tradeCode, redSealNumber, status, notes)

**User table additions:**
- `verificationBatchId` — Foreign key to verificationBatches (nullable; tracks which bulk upload verified this user)
- `verifiedBy` — User ID of admin who approved verification (nullable; tracks manual verification too)
- `verificationAuditedAt` — Timestamp of audit approval
- `verificationSource` — Enum: `MANUAL | BULK_UPLOAD | SELF_DECLARED` (tracks how verification happened)

**Design notes in schema:**
- Spot-check audit sampling rules (e.g., 10% of all uploads, every upload >500 rows, any upload with >5% rejection rate)
- Revocation rules for verified status (can an admin unverify a user? under what conditions? what happens to their endorsements?)

### **API_ENDPOINTS.md Updates Required**

**New admin endpoints:**
- `POST /api/admin/verification-batches` — Upload CSV file (binary upload, parse, validate format, queue for review)
- `GET /api/admin/verification-batches` — List pending, approved, and rejected batches with pagination
- `GET /api/admin/verification-batches/:id` — Detail view of a batch with all rows, rejection reasons, audit history
- `PATCH /api/admin/verification-batches/:id` — Approve/reject batch or individual rows (admin only, requires reason for rejections)
- `GET /api/admin/verification-batches/:id/audit-queue` — Sorted list of batches pending audit (for platform admin dashboard)

**Validation rules in documentation:**
- CSV format specification (required columns, optional columns, max file size, max rows per batch)
- Email uniqueness rules (can't upload same email twice in same batch; can't upload email that already exists in system)
- Role validation (only `APPRENTICE`, `JOURNEYPERSON`, `MASTER` allowed)
- Red Seal number format validation (if provided)

**Response formats in documentation:**
- Success response shows batch ID and expected timeline for audit ("your batch will be reviewed within 2 business days")
- Error response shows validation errors per row (CSV upload failed: row 42 has invalid role "Engineer", row 67 email duplicates existing user)
- Audit approval response shows which users are now verified and their new credibility weights

---

## **17. Document Maintenance**

This is a living document. Update it whenever:

- A fundamental business goal changes
- Success metrics are updated based on Phase results
- A strategic scope decision is made or reversed
- New risks are identified
- Out-of-scope items are moved to in-scope

**Ownership:** Co-founders jointly. Changes require discussion documented in GitHub issues or alignment calls.

**Related Documents:**
- `/docs/DATABASE_SCHEMA.md` — Data model
- `/docs/API_ENDPOINTS.md` — API surface
- `/docs/SYSTEM_PROMPT.md` — Code conventions
- `/docs/technical_alignment.docx` — Architecture decisions

---

*Robin — Trades Credential & Mentorship Platform | Business Requirements Specification | May 2026 | Confidential*
