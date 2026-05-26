# Robin — Visual Direction & Guidelines

**Stage 2: Color, Typography, Imagery**  
**May 2026 | Companion to ROBIN_BRAND_STRATEGY.md**

---

## **Part 1: Color Palette**

### **Primary Colors**

**Trades Orange**
```
Hex:        #C8511B
RGB:        200, 81, 27
Usage:      Primary buttons, active states, achievement badges, CTAs
Feeling:    Warm, visible, practical (safety vests, workshop energy)
Notes:      Use in headings, badge backgrounds, hover states on buttons
```

**Warm Charcoal (Ink)**
```
Hex:        #2A1F1A
RGB:        42, 31, 26
Usage:      Body text, headings, primary UI elements
Feeling:    Solid, trustworthy, warm (aged leather, worn tools)
Notes:      All text should use this color, not pure black
```

**Warm Off-White (Background)**
```
Hex:        #FAF5F0
RGB:        250, 245, 240
Usage:      Main page backgrounds, card backgrounds, large content areas
Feeling:    Workshop walls, approachable, soft but clear
Notes:      Not sterile white — has slight warmth
```

---

### **Semantic Colors**

**Success / Positive Action**
```
Hex:        #2D6A4F
RGB:        45, 106, 79
Usage:      Completed tasks, verified credentials, checkmarks, success messages
Feeling:    Earned, grounded, warm green (not neon)
Example:    "Your profile is verified" ✓
```

**Error / Warning**
```
Hex:        #C1121F
RGB:        193, 18, 31
Usage:      Validation errors, cautions, removed content, alerts
Feeling:    Serious but not aggressive, clear danger signal
Example:    "This endorsement was flagged as inappropriate"
```

**Informational / Neutral**
```
Hex:        #6B5B4A
RGB:        107, 91, 74
Usage:      Neutral information, secondary actions, helper text
Feeling:    Warm brown-gray, supporting not dominant
Example:    Timestamps, secondary descriptions
```

---

### **Neutral Grays** (All with warm tone)

```
Gray-90 (Lightest):    #F5F0EB    Subtle borders, very light dividers
Gray-70:               #D9D0C7    Dividers, light backgrounds, disabled backgrounds
Gray-50:               #A99983    Secondary text, disabled states, muted icons
Gray-30:               #6B5B4A    Icon color, secondary UI, secondary text
Gray-10 (Darkest):     #2A1F1A    Same as Warm Charcoal — body text
```

---

### **Color Combinations: Real Examples**

**Primary Button (CTA)**
```
Background:  #C8511B (Trades Orange)
Text:        #FAF5F0 (Warm Off-White)
Border:      None
Hover:       Darken orange slightly (#A73F15)
Active:      Even darker (#8B341F)
Disabled:    #D9D0C7 gray background + #A99983 gray text
```

**Card with Success State**
```
Card background:    #FAF5F0 (Warm Off-White)
Card border:        #D9D0C7 (Light Gray)
Text:               #2A1F1A (Warm Charcoal)
Success badge:      #2D6A4F (Green) background + #FAF5F0 white text
```

**Profile Section**
```
Background:         #FAF5F0
Heading:            #2A1F1A (Warm Charcoal), bold
Body text:          #2A1F1A (Warm Charcoal), regular
Secondary info:     #6B5B4A (Dark Gray)
Accent line:        #C8511B (Trades Orange, 2px top border)
```

---

## **Part 2: Typography System**

### **Font Family: Inter**

**What it is:** Purpose-built screen font, open source, Google Fonts, no licensing cost

**Why Inter:**
- Designed for readability at all sizes (Rasmus Andersson at Figma)
- Works equally well for 20-year-old apprentices and 55-year-old masters
- Modern but timeless (won't feel trendy in 2 years)
- Geometric and clear (like a workbench label — solid, no-nonsense)
- Loads fast (critical for job site connections)

**Download:** fonts.google.com — add to Next.js with one line of code

---

### **Type Hierarchy & Sizing**

All sizes are **base 16px** (1rem). Scale adjusts for mobile (375px width).

#### **Display (Hero Titles)**
```
Size:           32px / 2rem
Weight:         Bold (700)
Line Height:    1.2
Letter Spacing: -0.02em (tight, powerful)
Usage:          Page titles, main headlines
Example:        "Show What You Can Do"
Note:           On mobile: 24px (scales down proportionally)
```

#### **Heading (Section Titles)**
```
Size:           24px / 1.5rem
Weight:         Bold (700)
Line Height:    1.3
Letter Spacing: -0.01em
Usage:          Section headings, major content titles
Example:        "Your Reputation Score"
Note:           On mobile: 20px
```

#### **Subheading (Card & Component Titles)**
```
Size:           20px / 1.25rem
Weight:         Bold (700)
Line Height:    1.4
Letter Spacing: 0
Usage:          Card titles, achievement names, section subheadings
Example:        "First Contribution Badge"
Note:           On mobile: 18px
```

#### **Large Body (Primary Content)**
```
Size:           18px / 1.125rem
Weight:         Regular (400)
Line Height:    1.6
Letter Spacing: 0
Usage:          Introductions, primary descriptions, callouts
Example:        "Steven, you've been working toward this."
Note:           On mobile: 16px
```

#### **Body Text (Standard Content)**
```
Size:           16px / 1rem
Weight:         Regular (400)
Line Height:    1.6
Letter Spacing: 0
Usage:          Main content, paragraphs, form labels
Example:        All regular body copy on the platform
Note:           Standard base size — everything else scales from here
```

#### **Small Body (Secondary Info)**
```
Size:           14px / 0.875rem
Weight:         Regular (400)
Line Height:    1.5
Letter Spacing: 0
Usage:          Timestamps, metadata, secondary descriptions
Example:        "Verified on May 15, 2026"
Note:           On mobile: 13px (rarely smaller)
```

#### **Tiny (Captions & Disclaimers)**
```
Size:           12px / 0.75rem
Weight:         Regular (400)
Line Height:    1.5
Letter Spacing: 0
Usage:          Image captions, form helper text, small labels
Example:        "This endorsement requires rationale"
Note:           Never smaller than 12px — readability on job sites
```

---

### **Font Weights**

Only use these three weights. Simplicity helps.

```
Bold (700):        All headings, important labels, badges, strong emphasis
Regular (400):     All body text, buttons, standard content
Light (300):       Disabled states, secondary text, reduced emphasis
```

---

### **Line Height & Spacing** (Critical for readability)

Generous spacing makes text comfortable to read on a job site screen.

```
Display headings:    1.2   (tight, powerful)
Body text:           1.6   (generous, readable, comfortable)
Small text:          1.5   (slightly tighter, still readable)
```

**Paragraph margin:** 16px below each paragraph  
**Letter spacing:** Default (0) except Display headings which get slight tightening

---

### **Real World Examples**

**Heading + Body combo:**
```
Your Reputation Score              ← 20px Bold, #2A1F1A
[Subheading above]

You're at 420 points total.         ← 18px Regular, #2A1F1A
That puts you at Journeyperson      ← 16px Regular, #2A1F1A
level. You need 330 more points      ← 16px Regular, #2A1F1A
to reach Master eligibility.         ← 16px Regular, #2A1F1A

How it breaks down:                 ← 14px Regular, #6B5B4A (secondary)
Content quality: 210 points
Peer endorsements: 145 points
```

**Button + Supporting text:**
```
[Submit Your Work]                  ← 16px Bold, #FAF5F0 on #C8511B bg

Your contribution will be reviewed   ← 14px Regular, #6B5B4A
within 24 hours.                    ← 14px Regular, #6B5B4A
```

---

## **Part 3: Imagery & Photography Style Guide**

### **Hero Image System: Rotating Tradesperson Gallery**

**What it is:**
A rotating gallery of real tradespeople doing actual work. Every time someone lands on the homepage, they see a different photo. This is the *first* thing they see.

**Purpose:**
- Makes Steven feel "this was built for me" (he sees people his age doing real work)
- Shows diversity of experience (apprentices to masters)
- Communicates authenticity immediately (real work, not posed)
- Creates freshness (different image each visit)

**Technical:**
```
Landing page hero:    Full-width, 600px tall (desktop)
Photo rotation:       Random, changes on each page load
Mobile:               Full-width, 400px tall, 16:9 aspect ratio
Accessibility:       Each photo has alt text describing the work
```

---

### **Photography Guidelines: What Makes a "Robin Photo"**

#### **DO: Authenticity First**

✅ **Real hands doing real work**
- Hands installing wire, running conduit, adjusting breakers
- Hands replacing fixtures, testing connections
- Hands on tools, not posed with tools

✅ **Job site conditions (authentic)**
- Natural light from windows, doors, job site lights
- Realistic indoor/outdoor lighting
- Some dust, dirt, real conditions visible
- But: clear enough to see the work being done

✅ **Diversity of age and experience**
- Apprentices (18-25): learning, concentrated, engaged
- Journeypersons (30-45): experienced, teaching, confident
- Masters (50-65): demonstrating expertise, mentoring
- Wide range: 18-65 represented

✅ **Focused on the work, not the person**
- Close-ups of hands + tools + panel/conduit/fixture
- Face not always visible (but sometimes is, that's ok)
- The work is the star
- Person doing it is secondary

✅ **Clear technical quality**
- In-focus (the work is sharp)
- Well-exposed (can see details in light and shadow)
- Not blurry or dark (readable on a phone)
- Colors true (orange actually looks orange, not washed out)

#### **DON'T: Stock Photo Vibes**

❌ People smiling at camera in posed positions  
❌ Clean hands, studio lighting, professional headshots  
❌ Generic tools laid out for a photo  
❌ "Happy workers" — not authentic to real job sites  
❌ Same demographic repeated (all young, all old, all one gender)  
❌ Excessive branding or logos visible in photo  

---

### **Photo Collection Strategy**

**Acquisition:**
- Reach out to early user tradespeople: "Can we use a photo of you working on [project]?"
- Offer simple compensation ($50-100 per photo used)
- Get sign-off and rights agreement before using
- Start with electricians (your beachhead), expand as you grow

**Minimum set:**
- 20-30 rotating hero images to start (enough variety that people don't see repeats)
- Mix of: residential, commercial, new build, renovation, different trades over time

**Ongoing:**
- As users post projects to Robin, best photos become hero images
- User-generated content becomes your best marketing

**Budget alternative (if money is tight):**
- Partner with a photography student or freelancer
- Offer portfolio building + small payment ($500-1000 for 10-15 good hero photos)
- Get releases from friends/contacts who are tradespeople
- Start small, build over time

---

### **Profile Photo Guidelines**

When users upload their profile photo (Steven, the Mentor, etc.):

**Recommended:**
- Professional headshot (doesn't need to be expensive)
- Genuine expression (not overly posed)
- Clear face visible
- Work-appropriate but not stiff
- Good lighting (so they're not in shadow)
- Clean background (or job site background is ok)

**Display:**
- Circular crop (80px for list view, 200px for profile)
- Border: Subtle 2px border in #D9D0C7 (light gray)
- Placeholder if no photo: Generic icon in #C8511B (trades orange)

---

### **Achievement & Credential Graphics**

**Badge Style:**

When Steven earns his "First Contribution" badge:

```
Shape:          Circle (consistent, recognizable)
Background:     #C8511B (Trades Orange)
Icon:           Simple white icon (wrench, lightbulb, etc.)
Text:           Badge name in white, below circle
Border:         Optional subtle shadow for depth

Display sizes:
- Large (profile):    200px diameter
- Medium (card):      100px diameter
- Small (feed):       60px diameter
```

**Certificate / Credential Display:**

When a user downloads their Open Badge credential:

```
Background:     White or #FAF5F0 (warm off-white)
Header:         Robin logo + "Verified Credential"
Body:           Clear text stating what was earned and when
Footer:         QR code for verification + signature/hash
Border:         Optional 1px border in #D9D0C7
```

---

### **Illustration & Icon Style** (For the future)

If you eventually need custom illustrations (onboarding, empty states, etc.):

**Principles:**
- Line-based, not filled (less "clipart," more modern)
- Warm color palette (oranges, greens, warm neutrals)
- Realistic proportions (tools and hands look real, not cartoonish)
- Simple, recognizable (works at small sizes)

**Examples (not yet built, but style direction):**
- Electrical panel illustration (line drawing, realistic)
- Hands shaking or high-fiving (connection theme)
- Workshop interior (showing the space)
- Tools in use (not just floating)

---

## **Part 4: Component Style Principles**

These principles guide how individual UI components (buttons, cards, forms) embody the brand.

### **Buttons**

**Primary Button** (main CTAs like "Submit," "Continue," "Apply")
```
Background:     #C8511B (Trades Orange)
Text:           #FAF5F0 (Warm Off-White), bold
Padding:        12px 24px
Border radius:  4px (slight, not rounded)
Min height:     44px (thumb-friendly on mobile)
Hover:          Background darkens to #A73F15
Active:         Even darker #8B341F
Focus state:    2px outline in trades orange (accessibility)
Transition:     100ms background-color (smooth, not jarring)
```

**Secondary Button** (less important actions)
```
Background:     transparent
Text:           #C8511B (Trades Orange), bold
Border:         2px solid #C8511B
Padding:        10px 22px (2px less due to border)
Hover:          Background becomes #F5F0EB (light background)
Disabled:       Border #D9D0C7, text #A99983
```

**Tertiary / Text Button** (subtle actions)
```
Background:     transparent
Text:           #6B5B4A (Dark Gray)
Border:         None
Underline:      Optional on hover
Hover:          Text darkens, slight underline
```

---

### **Cards**

All cards follow the same structure for consistency:

```
Background:     #FAF5F0 (Warm Off-White)
Border:         1px solid #D9D0C7 (light gray)
Border radius:  8px (subtle roundness)
Padding:        20px
Shadow:         Minimal: 0 1px 3px rgba(0,0,0,0.1)
Title:          20px bold #2A1F1A
Subtitle:       14px regular #6B5B4A (optional)
Body:           16px regular #2A1F1A
Accent:         Optional left border 4px #C8511B
```

**Examples:**
- Achievement card: Shows badge + earned date + description
- Endorsement card: Shows who endorsed you + topic + rationale
- Project card: Shows title + image + completion date

---

### **Form Fields**

```
Background:     #FAF5F0 (Warm Off-White)
Border:         1px solid #D9D0C7 (light gray)
Border radius:  4px
Padding:        12px 16px
Font:           16px regular Inter
Focus state:    2px border #C8511B (orange), slight shadow
Error state:    2px border #C1121F (red)
Disabled:       Background #D9D0C7, text #A99983
```

---

### **Badges & Labels**

```
Small info badges (new, verified, master, etc.):
Background:     #C8511B (orange) or #2D6A4F (green)
Text:           #FAF5F0 (white)
Padding:        4px 12px
Border radius:  20px (fully rounded)
Font:           12px bold
```

---

## **Summary: How These Work Together**

When Steven lands on Robin:

1. **Hero image** rotates — real electricians doing real work (he sees himself)
2. **Orange accent** draws eye to "Get Started" button (warm, welcoming)
3. **Warm off-white background** feels like workshop walls (not sterile)
4. **Inter headings** are clear and solid (trustworthy)
5. **Generous spacing** makes everything readable (respectful of his time)
6. **All colors are warm** — nothing feels cold or corporate

By the time he scrolls down, he *feels* that this was built for tradespeople, by people who understand the work.

---

## **Implementation Checklist**

- [ ] Color palette added to design system / Tailwind config
- [ ] Google Fonts Inter loaded in Next.js
- [ ] Type scale documented in design system
- [ ] Component library (buttons, cards, forms) built to spec
- [ ] First 20-30 hero images sourced and licensed
- [ ] Photo rotation logic built into landing page
- [ ] Brand guidelines shared with dev team
- [ ] Figma/design file uses these colors and typography
- [ ] Accessibility review: contrast ratios tested at all sizes

---

**Next:** Component library build-out, messaging framework, and design system documentation.

