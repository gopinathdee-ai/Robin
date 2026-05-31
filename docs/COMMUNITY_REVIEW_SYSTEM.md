# Community Review System

## Overview

The Robin Community platform uses **AI-powered content verification** to ensure high-quality discussions and expert knowledge sharing. When community members post questions, provide answers, or share knowledge, our system automatically evaluates the content using **Claude Haiku** (an advanced AI model by Anthropic) to determine whether it meets quality standards.

---

## The AI Model

We use **Claude Haiku**, a fast and efficient AI model optimized for content moderation and evaluation tasks. This model:

- Evaluates content quality and relevance to the trades
- Provides consistent, unbiased assessment
- Responds quickly (within seconds)
- Understands technical trades knowledge and safety standards
- Is designed specifically for specialized domains like skilled trades

**Why Claude Haiku?** It's cost-effective, fast, and provides reliable evaluations without requiring human review for most content.

---

## How It Works

### 1. Content Submission

When a community member posts a **question**, **answer**, or **post**, the system immediately:

1. Saves the content in draft status (`pending_review`)
2. Sends it to Claude Haiku for AI evaluation (happens instantly in the background)
3. Claude evaluates two dimensions:
   - **Quality Score** — Is the content well-written, clear, and detailed?
   - **Domain Score** — Is it relevant to skilled trades and technically sound?

### 2. What Gets Evaluated

**Questions & Posts:**
- Title + Body text
- Context about the specific trade (e.g., Electrician, HVAC, Plumbing)
- Clarity and technical accuracy

**Answers:**
- Body text
- Relevance to the parent question
- Technical correctness
- Trade context (inherited from the parent question)

### 3. Scoring System

Claude evaluates content on a **0.0 to 1.0 scale**:

| Score Range | Meaning |
|-------------|---------|
| 0.0 - 0.34  | Low quality / off-topic |
| 0.35 - 0.49 | Acceptable but basic |
| 0.50 - 0.64 | Good quality |
| 0.65 - 1.0  | High quality / expert-level |

**Both quality and domain scores must pass thresholds for auto-publication.**

---

## Decision Logic

After Claude evaluates the content, the system makes an automatic decision:

### ✅ AUTO-PUBLISHED (Visible Immediately)
**Criteria:**
- Quality Score ≥ **0.35** AND
- Domain Score ≥ **0.40** AND
- No safety concerns detected

**What happens:**
- Post appears in the community feed immediately
- Community members can see it, upvote, and respond
- No human review needed
- Labeled with `✓ Published`

### 🚩 FLAGGED FOR REVIEW (Hidden)
**Criteria:**
- Quality Score < 0.35 OR
- Domain Score < 0.40 OR
- Safety concerns detected

**What happens:**
- Post is hidden from the community feed
- Marked as `Flagged for review`
- Queued for human moderator review
- Moderator can approve or reject
- Community members don't see it yet

### ⏳ REVIEW IN PROGRESS (Temporary)
**Criteria:**
- Still being evaluated by AI

**What happens:**
- Shows `Review in progress` status
- Content is hidden temporarily
- Should complete within seconds
- Will become either Published or Flagged

---

## Quality Badges

Published content displays a visual quality indicator to help community members quickly assess reliability:

### ✨ High Quality Badge
- **Appears when:** Quality Score ≥ 0.65
- **Meaning:** Expert-level response with thorough, well-explained information
- **Visual:** Sparkle icon (✨) + "High Quality" label

### ✨ Good Quality Badge
- **Appears when:** Quality Score 0.50 - 0.64
- **Meaning:** Solid, reliable response with good information
- **Visual:** Sparkle icon (✨) + "Good Quality" label

### No Badge
- **Appears when:** Quality Score 0.35 - 0.49
- **Meaning:** Content is acceptable but may lack detail or clarity
- **Visual:** No badge displayed

---

## Example Workflows

### Scenario 1: Detailed, Expert Answer
**Submitted by:** Master Electrician  
**Content:** Comprehensive answer about circuit breaker sizing with code references  
**Quality Score:** 0.78 | **Domain Score:** 0.92

**Result:** ✅ **Published immediately** with ✨ **High Quality** badge visible

**Community sees:** Professional, trusted response with visual quality indicator

---

### Scenario 2: Brief, Basic Question
**Submitted by:** Apprentice  
**Content:** "How do I wire a switch?" (minimal detail)  
**Quality Score:** 0.32 | **Domain Score:** 0.60

**Result:** 🚩 **Flagged for review** (quality too low)

**What happens:** Hidden until moderator approves or rejects it

**Note:** If moderator approves it anyway, it becomes published (moderators can override AI decisions)

---

### Scenario 3: Off-Topic Post
**Submitted by:** Community member  
**Content:** Product advertisement with no trades relevance  
**Quality Score:** 0.45 | **Domain Score:** 0.15

**Result:** 🚩 **Flagged for review** (domain score too low)

**What happens:** Hidden; moderator will likely reject it

---

## Key Principles

### 🎯 Automatic First
- Most content is automatically published without human delay
- Only questionable content waits for human review
- Keeps the community active and responsive

### 🤖 AI + Human Backup
- AI makes the initial call, but humans have final say
- Moderators can override AI decisions if needed
- System learns from moderator corrections

### 🛡️ Community Trust
- Quality badges help readers identify reliable responses
- Transparent scoring system (not a black box)
- Consistent, unbiased evaluation

### ⚡ Fast Feedback
- Evaluation happens within seconds of submission
- Authors know status immediately
- No mysterious delays or unclear reasons

---

## What Counts as Good Content?

Claude looks for:

✅ **Quality Indicators**
- Clear, well-written explanations
- Relevant details and examples
- Proper terminology and accuracy
- Logical structure and flow
- Adequate length (not too brief)

✅ **Domain Relevance**
- Directly addresses the skilled trade
- Demonstrates technical knowledge
- Safety-conscious (follows codes/standards)
- Practical, actionable information

❌ **Red Flags**
- Vague, unclear language
- Off-topic or irrelevant
- Factually incorrect information
- Safety violations
- Spam or promotional content

---

## Moderation Queue

Content flagged by AI goes to a **Human Review Queue** where moderators:

1. **Read** the flagged content
2. **Decide** whether to approve (publish) or reject
3. **Provide feedback** to the author (optional)
4. **Note patterns** to help improve the AI system

This ensures no good content is permanently hidden just because it didn't hit the AI thresholds.

---

## Future Improvements

We're continuously improving the review system:

- **Retry mechanism** — If the AI model is temporarily unavailable, stuck content will be re-evaluated periodically
- **Category-specific scoring** — Different trades may have different quality standards
- **User feedback** — Community votes help us understand what's actually useful
- **Model updates** — As Claude improves, so does our review accuracy

---

## FAQ

**Q: Why was my post flagged?**  
A: It either scored below our quality threshold, wasn't relevant enough to the specific trade, or had potential safety concerns. Check the guidelines above to improve future posts.

**Q: Can I appeal a flagged post?**  
A: Yes, contact a moderator. They can review and override the AI decision if warranted.

**Q: How long does review take?**  
A: Auto-published content appears instantly (seconds). Flagged content waits for human moderator review (typically hours to 1 day depending on queue).

**Q: Who decides the thresholds?**  
A: The Robin team sets thresholds based on community standards and expert input. These may adjust over time as we refine the system.

**Q: Is my data used to train Claude?**  
A: No. We use Claude as a service; your community content is not used to train or improve the underlying model.

**Q: What if the AI gets it wrong?**  
A: Moderators review flagged content and can override AI decisions. We also learn from these cases to improve the system.

---

## Contact & Support

Have questions about the review system? Reach out to the community moderators or the Robin support team.
