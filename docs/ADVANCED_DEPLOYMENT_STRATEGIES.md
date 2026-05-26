# Advanced Deployment Strategies & Gradual Rollout

> **Supplement to:** PRODUCTION_READINESS_AND_CHANGE_MANAGEMENT.md  
> **Purpose:** Define how to safely roll out changes to production without risking all users at once  
> **Critical for:** Institutions (unions) that need predictable, low-risk deployments

---

## Executive Summary

There are multiple deployment strategies, and choosing the right one depends on **risk level** and **user impact**.

| **Strategy** | **Risk Level** | **Users Affected** | **When to Use** | **Rollback Speed** |
|---|---|---|---|---|
| **Blue/Green** | Medium | 100% at once | Non-critical features | Instant |
| **Canary** | Low | 5% → 25% → 100% | Critical features, credential changes | 30 seconds |
| **Feature Flag** | Very Low | Control per-user/region | Decouple deploy from release | Instant |
| **Shadow Traffic** | Very Low | Parallel testing only | New auth/credential logic | N/A (test only) |
| **Ring Deployment** | Low-Medium | Internal → Beta users → All | Large features needing validation | Varies |

**For Robin specifically:**

- **Credential changes** → Canary (5% → 25% → 100%) + metrics-driven rollback
- **Non-credential features** → Blue/Green or Feature Flag
- **Database migrations** → Blue/Green + pre-tested rollback
- **Auth changes** → Canary + shadow traffic (test new auth alongside old)

---

## Part 1: Canary Deployments (Gradual Rollout)

### **What is a Canary Deployment?**

A canary deployment rolls out a new version to **a small percentage of users first**, monitors for issues, then gradually shifts traffic to the new version.

```
Version A (current):  ████████████████████ 100%
                      ↓ Deploy new code
Version B (canary):   ██ 5%  (real users, real traffic)
                      ↓ Monitor for 30 minutes
Version B:            ███████ 25%  (more users)
                      ↓ Monitor for 30 minutes
Version B:            ████████████████████ 100%  (all users)
```

**Why canary for credentials:**

1. **Real production traffic tests the new credential logic** — not just synthetic tests
2. **Early error detection** — if credential issuance breaks, only 5% of users are affected
3. **Automatic rollback** — if error rate spikes, traffic instantly reverts to old version
4. **Zero downtime** — users don't notice anything, requests seamlessly shift

### **Canary Implementation: AWS Elastic Load Balancer (ELB) + Target Groups**

This is the production-grade approach:

```yaml
# Infrastructure-as-code (Terraform)
# apps/infrastructure/canary-deployment.tf

resource "aws_lb" "api" {
  name               = "trades-api-lb"
  load_balancer_type = "application"
  subnets            = var.subnets
}

# Current production version (Version A)
resource "aws_lb_target_group" "api_stable" {
  name        = "api-stable"
  port        = 4000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  
  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    path                = "/health"
    matcher             = "200"
  }
}

# New version (Canary Version B)
resource "aws_lb_target_group" "api_canary" {
  name        = "api-canary"
  port        = 4000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  
  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    path                = "/health"
    matcher             = "200"
  }
}

# Listener splits traffic between stable and canary
resource "aws_lb_listener" "api" {
  load_balancer_arn = aws_lb.api.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "forward"
    
    # Forward rule: 95% to stable, 5% to canary during rollout
    forward {
      target_group {
        arn    = aws_lb_target_group.api_stable.arn
        weight = 95
      }
      target_group {
        arn    = aws_lb_target_group.api_canary.arn
        weight = 5
      }
    }
  }
}

# CloudWatch alarms watch canary error rate
resource "aws_cloudwatch_metric_alarm" "canary_error_rate" {
  alarm_name          = "canary-error-rate-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "HTTPCode_Target_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = "60"
  statistic           = "Sum"
  threshold           = "10"  # More than 10 errors in 1 min = rollback
  alarm_actions       = [aws_sns_topic.deployments.arn]
  
  dimensions = {
    LoadBalancer = aws_lb.api.arn_suffix
    TargetGroup  = aws_lb_target_group.api_canary.arn_suffix
  }
}
```

### **Canary Rollout Script**

Automate the traffic shift:

```bash
#!/bin/bash
# scripts/canary-rollout.sh
# Usage: ./canary-rollout.sh v0.2.0 api-canary

VERSION=$1
CANARY_TARGET_GROUP=$2
STABLE_TARGET_GROUP="api-stable"

echo "Starting canary rollout for version $VERSION"

# Stage 1: Route 5% to canary
echo "Stage 1: Routing 5% to canary..."
aws elbv2 modify-listener \
  --listener-arn $LISTENER_ARN \
  --default-actions file:///tmp/listener-5pct.json
sleep 30
# Monitor for errors during this period

# Check error metrics
ERROR_RATE=$(aws cloudwatch get-metric-statistics \
  --namespace AWS/ApplicationELB \
  --metric-name HTTPCode_Target_5XX_Count \
  --dimensions Name=TargetGroup,Value=$CANARY_TARGET_GROUP \
  --start-time $(date -u -d '5 minutes ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Sum | jq '.Datapoints[0].Sum')

if [ "$ERROR_RATE" -gt 10 ]; then
  echo "ERROR: Canary error rate ($ERROR_RATE) exceeded threshold. Rolling back."
  # Rollback to 100% stable
  aws elbv2 modify-listener \
    --listener-arn $LISTENER_ARN \
    --default-actions file:///tmp/listener-0pct.json
  exit 1
fi

echo "Stage 1 passed. Proceeding to 25%..."

# Stage 2: Route 25% to canary
echo "Stage 2: Routing 25% to canary..."
aws elbv2 modify-listener \
  --listener-arn $LISTENER_ARN \
  --default-actions file:///tmp/listener-25pct.json
sleep 60
# Monitor

ERROR_RATE=$(aws cloudwatch get-metric-statistics \
  --namespace AWS/ApplicationELB \
  --metric-name HTTPCode_Target_5XX_Count \
  --dimensions Name=TargetGroup,Value=$CANARY_TARGET_GROUP \
  --start-time $(date -u -d '5 minutes ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Sum | jq '.Datapoints[0].Sum')

if [ "$ERROR_RATE" -gt 20 ]; then
  echo "ERROR: Canary error rate exceeded. Rolling back."
  aws elbv2 modify-listener \
    --listener-arn $LISTENER_ARN \
    --default-actions file:///tmp/listener-0pct.json
  exit 1
fi

echo "Stage 2 passed. Proceeding to 100%..."

# Stage 3: Route 100% to canary
echo "Stage 3: Routing 100% to canary..."
aws elbv2 modify-listener \
  --listener-arn $LISTENER_ARN \
  --default-actions file:///tmp/listener-100pct.json

echo "Canary deployment complete. Version $VERSION is now live."
```

### **Metrics-Driven Automatic Rollback**

Set up automated rollback if error rate spikes:

```typescript
// apps/api/src/monitoring/canary-monitor.ts
import * as AWS from 'aws-sdk'

const cloudwatch = new AWS.CloudWatch()
const elb = new AWS.ELBv2()

export async function monitorCanaryHealth(
  canaryTargetGroup: string,
  rollbackThreshold: number = 10 // errors per minute
): Promise<void> {
  
  const errorMetrics = await cloudwatch.getMetricStatistics({
    Namespace: 'AWS/ApplicationELB',
    MetricName: 'HTTPCode_Target_5XX_Count',
    Dimensions: [
      { Name: 'TargetGroup', Value: canaryTargetGroup }
    ],
    StartTime: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
    EndTime: new Date(),
    Period: 60,
    Statistics: ['Sum']
  }).promise()

  const errorCount = errorMetrics.Datapoints?.[0]?.Sum || 0

  if (errorCount > rollbackThreshold) {
    console.error(`CANARY ALERT: Error rate ${errorCount} exceeds threshold ${rollbackThreshold}`)
    
    // Trigger automatic rollback
    await triggerCanaryRollback(canaryTargetGroup)
    
    // Alert team
    await sendSlackAlert({
      text: `🚨 CANARY ROLLBACK TRIGGERED\nError rate: ${errorCount}\nRolling back to previous version.`,
      channel: '#deployments'
    })
  }
}

async function triggerCanaryRollback(canaryTargetGroup: string): Promise<void> {
  // Set weight to 0% for canary, 100% for stable
  await elb.modifyListener({
    ListenerArn: process.env.LISTENER_ARN!,
    DefaultActions: [{
      Type: 'forward',
      ForwardConfig: {
        TargetGroups: [
          { TargetGroupArn: process.env.STABLE_TARGET_GROUP_ARN!, Weight: 100 },
          { TargetGroupArn: canaryTargetGroup, Weight: 0 }
        ]
      }
    }]
  }).promise()
}
```

---

## Part 2: Feature Flags (Decouple Deploy from Release)

### **What is a Feature Flag?**

A feature flag lets you **deploy code without releasing it to users** — you control which users see the new feature via configuration.

```
Developer commits credential v2 code
    ↓
Code gets deployed (flag OFF)
    ↓
Only you can see v2 (if flagged for your account)
    ↓
Testing confirms it works
    ↓
Toggle flag ON for 5% of users
    ↓
Monitor for issues
    ↓
Toggle flag ON for 25%, then 100%
```

### **Feature Flag Implementation: LaunchDarkly or Posthog**

For Robin, use **PostHog** (simpler, freemium) or **LaunchDarkly** (enterprise-grade).

```typescript
// apps/api/src/services/credentialService.ts
import { PostHog } from 'posthog-node'

const posthog = new PostHog(process.env.POSTHOG_API_KEY)

export async function issueCredential(
  userId: string,
  credentialType: string
): Promise<Credential> {
  
  // Check if user is in feature flag cohort
  const useNewCredentialV2 = await posthog.isFeatureEnabled(
    'credential-v2',
    userId
  )

  if (useNewCredentialV2) {
    // New code path (v2)
    return await issueCredentialV2(userId, credentialType)
  } else {
    // Current code path (v1)
    return await issueCredentialV1(userId, credentialType)
  }
}

async function issueCredentialV2(
  userId: string,
  credentialType: string
): Promise<Credential> {
  // New credential logic — tested, ready, but hidden behind flag
  const credential = await prisma.credential.create({
    data: {
      holderId: userId,
      type: credentialType,
      ob3Assertion: generateOpenBadgeV2(userId, credentialType),
      // v2-specific fields
      verificationHash: hashOpenBadgeV2(...),
      compressedMetadata: {...} // New field
    }
  })

  // Track in PostHog for analysis
  posthog.capture({
    distinctId: userId,
    event: 'credential_issued_v2',
    properties: { type: credentialType }
  })

  return credential
}

async function issueCredentialV1(
  userId: string,
  credentialType: string
): Promise<Credential> {
  // Current production logic
  return await prisma.credential.create({
    data: {
      holderId: userId,
      type: credentialType,
      ob3Assertion: generateOpenBadge(userId, credentialType),
      verificationHash: hashOpenBadge(...)
    }
  })
}
```

### **Gradual Rollout with Feature Flags**

Control rollout via PostHog dashboard:

```yaml
# PostHog Feature Flag Configuration (via dashboard)
Feature: credential-v2
Type: Release
Enabled: true

Rollout:
  Stage 1 (Day 1): 5% of users
  Stage 2 (Day 2): 25% of users
  Stage 3 (Day 3): 100% of users

Rollback: One-click toggle to disable flag

Targeting Rules:
  - Admins (all)
  - Pilot partners (all)
  - Regular users (rollout schedule above)
```

### **Advantages of Feature Flags for Robin**

| **Scenario** | **Blue/Green** | **Feature Flag** |
|---|---|---|
| Testing credential v2 with real data | ❌ Affects all users | ✅ Only flagged users |
| Rolling back broken credential logic | ⏱️ Takes 30s (redeploy) | ✅ Instant (toggle flag) |
| A/B testing two credential formats | ❌ Can't do this | ✅ Split traffic per user |
| Pilot partner testing first | ❌ Affects all | ✅ Flag just for them |
| Instant kill switch if issue detected | ❌ Need to redeploy | ✅ One-click disable |

---

## Part 3: Shadow Traffic (Test New Logic Safely)

### **What is Shadow Traffic?**

Route a percentage of incoming requests to both the **old code path** and **new code path** simultaneously, but **only return the old code path's response to the user**. Use the new code path's result for testing.

```
User makes request
    ↓
Request flows to both v1 and v2 code paths
    ↓
v1 processes and returns response (user sees this)
    ↓
v2 processes in parallel but we ignore result
    ↓
Compare v1 vs v2 results in logs/monitoring
    ↓
If v2 matches v1, we know it's safe to deploy
```

**Critical for:** Auth changes, credential verification logic, reputation calculation changes.

```typescript
// apps/api/src/middleware/shadowTraffic.ts
import { Request, Response, NextFunction } from 'express'

export function shadowTrafficMiddleware(req: Request, res: Response, next: NextFunction) {
  
  // Check if we're running shadow traffic tests
  const runShadow = process.env.SHADOW_TRAFFIC_ENABLED === 'true'
  
  if (runShadow && req.path === '/api/credentials/verify') {
    
    // Capture original response
    const originalJson = res.json.bind(res)
    
    res.json = function(data) {
      // This runs the original code path (v1)
      const originalResponse = data
      
      // Also run the new code path (v2) for comparison
      runNewCredentialVerificationLogic(req.body)
        .then(newResponse => {
          // Compare results
          const match = JSON.stringify(originalResponse) === 
                       JSON.stringify(newResponse)
          
          // Log for analysis
          console.log({
            timestamp: new Date(),
            endpoint: req.path,
            v1Result: originalResponse,
            v2Result: newResponse,
            match: match,
            userId: req.user?.id
          })
          
          // Send to analytics
          if (!match) {
            console.warn('SHADOW TRAFFIC MISMATCH DETECTED', {
              userId: req.user?.id,
              v1: originalResponse,
              v2: newResponse
            })
          }
        })
        .catch(err => {
          console.error('Shadow traffic error:', err)
          // Don't fail the request if shadow traffic has an error
        })
      
      // Return original response to user
      return originalJson(originalResponse)
    }
  }
  
  next()
}

async function runNewCredentialVerificationLogic(
  credentialId: string
): Promise<any> {
  // Run v2 verification logic
  // This is the new algorithm, new signature checking, etc.
  return await verifyCredentialV2(credentialId)
}
```

---

## Part 4: Ring Deployments (For Major Features)

### **What is a Ring Deployment?**

Rings are concentric circles of users. Roll out to:

1. **Ring 0** — Internal team (you and Gopinath)
2. **Ring 1** — Pilot partners (the union)
3. **Ring 2** — Early adopters (beta users who opt-in)
4. **Ring 3** — Everyone else

```
Ring 0: Internal     ◯◯◯
Ring 1: Pilot        ◯◯◯◯◯
Ring 2: Early adopters ◯◯◯◯◯◯◯
Ring 3: General users ◯◯◯◯◯◯◯◯◯◯◯
```

**When to use:** New mentorship features, dashboard redesigns, major credential format changes.

```typescript
// apps/api/src/middleware/ringDeployment.ts
import { Request, Response, NextFunction } from 'express'
import { prisma } from '@db/client'

export async function ringDeploymentMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?.id
  const feature = 'new_mentorship_dashboard'
  
  const userRing = await determineUserRing(userId, feature)
  
  // Attach ring to request context
  req.ring = userRing
  
  // Route to appropriate code path
  if (feature === 'new_mentorship_dashboard') {
    if (userRing <= 2) {
      // Ring 0, 1, 2 — show new dashboard
      res.locals.dashboardVersion = 'v2'
    } else {
      // Ring 3 — show old dashboard
      res.locals.dashboardVersion = 'v1'
    }
  }
  
  next()
}

async function determineUserRing(
  userId: string,
  feature: string
): Promise<number> {
  
  // Ring 0 — Internal team
  if (process.env.INTERNAL_USER_IDS?.split(',').includes(userId)) {
    return 0
  }
  
  // Ring 1 — Pilot partners
  const pilotPartner = await prisma.user.findUnique({
    where: { id: userId },
    select: { unionLocalId: true }
  })
  
  if (pilotPartner?.unionLocalId === process.env.PILOT_PARTNER_ID) {
    return 1
  }
  
  // Ring 2 — Early adopters (explicit opt-in)
  const isEarlyAdopter = await prisma.featureOptIn.findUnique({
    where: { userId_feature: { userId, feature } }
  })
  
  if (isEarlyAdopter) {
    return 2
  }
  
  // Ring 3 — General users
  return 3
}
```

---

## Part 5: Choosing Your Deployment Strategy

### **Decision Tree**

```
Change Type?
│
├─ Credential issuance logic (HIGH RISK)
│  └─ Use: Canary (5% → 25% → 100%) + metrics-driven rollback
│
├─ Auth flow change (HIGH RISK)
│  └─ Use: Shadow traffic + Feature flag + Canary
│
├─ Database schema (HIGH RISK)
│  └─ Use: Blue/Green + pre-tested migration + rollback script
│
├─ New SME feature (MEDIUM RISK)
│  └─ Use: Feature flag + Ring deployment (team → pilot → all)
│
├─ Bug fix (LOW RISK)
│  └─ Use: Blue/Green
│
└─ UI/styling change (VERY LOW RISK)
   └─ Use: Blue/Green (or direct deploy if confident)
```

### **For Robin Specifically: Deployment Playbook**

| **Change** | **Strategy** | **Rollout Timeline** | **Approval Required** |
|---|---|---|---|
| Credential v2 algorithm | Canary + shadow traffic | 5% → 25% → 100% (1 hour) | Co-founder |
| New mentor tier logic | Feature flag + ring | Ring 0 → 1 → 2 → 3 (3 days) | Co-founder |
| New SME community feature | Feature flag | 5% → 25% → 100% (1 day) | One founder |
| Bug fix | Blue/green | Immediate | One founder |
| Database migration | Blue/green | Scheduled maintenance window | Both founders |
| UI improvements | Blue/green | Immediate | One founder |
| Security patch | Canary (if auth-related) | 5% → 100% (30 min) | Both founders |

---

## Part 6: Integration with Testing Strategy

All deployment strategies should have **test gates**:

```
Code change submitted
    ↓
Unit + integration + E2E tests pass (TESTING_STRATEGY.md)
    ↓
Credential integrity test passes (PRODUCTION_READINESS.md)
    ↓
Audit trail integrity test passes (PRODUCTION_READINESS.md)
    ↓
Migration safety test (if schema change) (PRODUCTION_READINESS.md)
    ↓
Code review + co-founder approval
    ↓
Deployment strategy selected (this document)
    ↓
Deploy with chosen strategy (canary, feature flag, blue/green)
    ↓
Smoke tests + monitoring (PRODUCTION_READINESS.md)
    ↓
Gradual rollout + metrics monitoring
    ↓
Feature fully released or rolled back based on metrics
```

---

## Part 7: Monitoring During Gradual Rollouts

### **Key Metrics to Watch**

During canary or feature flag rollout, monitor these per ring/cohort:

```typescript
// apps/api/src/monitoring/rollout-metrics.ts
interface RolloutMetrics {
  // Error tracking
  errorRate: number // % of requests that errored
  p95Latency: number // 95th percentile response time
  p99Latency: number // 99th percentile response time
  
  // Credential-specific
  credentialIssuanceSuccessRate: number
  credentialVerificationFailureRate: number
  
  // User behavior
  userRetention: number // % of users who returned after change
  featureAdoptionRate: number // % of users using new feature
  
  // Business metrics
  mentorshipRequestRate: number // Should be stable
  contentSubmissionRate: number // Should be stable
  
  // System health
  databaseConnectionCount: number
  cacheHitRate: number
}

// Alert thresholds during rollout
const ROLLOUT_ALERT_THRESHOLDS = {
  errorRate: 2, // % — above 2%, alert
  p95Latency: 1000, // ms
  credentialFailureRate: 0.5, // %
  databaseConnections: 18 // out of 20 max
}
```

### **Rollout Dashboard (Grafana/DataDog)**

Track metrics per cohort:

```
Dashboard: Credential V2 Canary Rollout

[ Stable (v1) ]           [ Canary (v2) ]
Error Rate: 0.2%          Error Rate: 0.3%
P95 Latency: 150ms        P95 Latency: 155ms
Credentials/min: 42       Credentials/min: 38
Verified: 99.8%           Verified: 99.9%

Traffic Split: ████░ (80% stable, 20% canary)

🟢 All metrics green → Proceed to next stage
```

---

## Part 8: Rollback Procedures

### **If Issues Detected During Rollout**

**Immediate actions (< 1 minute):**

```bash
# Canary rollout: Instant revert traffic
aws elbv2 modify-listener --listener-arn ... --default-actions file:///tmp/listener-0pct.json

# Feature flag: Toggle off
posthog.setFeatureFlag('credential-v2', false)

# Ring deployment: Disable ring
await disableRing('Ring 2')
```

**Post-incident (after rollback succeeds):**

```
1. Alert team via Slack/PagerDuty
2. Halt rollout (lock version to previous)
3. Investigate root cause
4. Review logs from canary cohort
5. Fix issue in development
6. Re-run full test suite + integrity tests
7. Schedule retry (same strategy or different)
8. Document postmortem
```

---

## Summary Table: Strategy Comparison

| **Aspect** | **Blue/Green** | **Canary** | **Feature Flag** | **Shadow Traffic** |
|---|---|---|---|---|
| **Time to deploy** | 30 seconds | 2–3 hours (gradual) | Instant | Instant |
| **Rollback speed** | 30 seconds | 30 seconds | Instant | N/A |
| **Risk to all users** | High (100% immediate) | Low (5% first) | None (new code hidden) | None (test only) |
| **Best for** | Non-critical features | Credential/auth changes | Major features | Comparing logic |
| **Setup complexity** | Medium | High (needs LB config) | Low (SDK-based) | Medium |
| **Cost** | Low | Low | $20–200/month | None |
| **Team overhead** | Low | Medium (monitor rollout) | Low | Medium |

---

## Your Next Steps

1. **Discuss with Gopinath:** Which strategies will you use for which types of changes?
2. **Implement canary infrastructure:** AWS ELB target groups + health checks
3. **Set up feature flags:** PostHog or LaunchDarkly account
4. **Create runbooks:** Step-by-step guides for each strategy
5. **Add to CI/CD:** Automate canary rollout approval/rejection based on metrics

**For Year 1 (MVP phase):**
- Blue/green deployments for most features
- Canary for any credential-related changes
- Feature flags for major UI/mentorship features

**For Year 2+ (scale phase):**
- Canary as default for all production deployments
- Shadow traffic for new authentication schemes
- Ring deployments for features affecting pilot partners
- Automated rollback based on error rate monitoring

---

**Every deployment is a moment to prove the platform is trustworthy. Deploy carefully.**
