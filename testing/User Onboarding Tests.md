# UI/UX Testing Report — User Onboarding
**Date:** 2026-05-22
**Tester:** Lance Tofsrud
**Environment:** Local (localhost:3000) | Microsoft Edge

---
## Detailed Test Cases

### Test 1: Onboard a New User
**Scenario:** User is user, on desktop browser (Edge).
**Steps to reproduce:**
1. Navigate to the main application screen.
2. Click on **Get started free** button.
3. Click on **Create my account** button.
4. Step 1 of onboarding workflow: Click on *Apprentice* panel, then click on the **Continue** button.
5. Step 2 of onboarding workflow: Click on the *Electrician (Construction)* button and then the **Continue** button.
6. Step 3 of onboarding workflow: Remove the first sentence until we determine how we are going to handle logbooks in Robin. Remove "Think of this as your digital logbook — but better.". Click on the **Got it - keep going** button.
7. Step 4 of onboarding workflow: Click on the **Got it - keep going** button.
8. Step 5 of onboarding workflow: Verified that I couldn't click on the submit button without entering a minimum 20 character response. Click on the **Submit my answer** button.
9. On the Time to show what you know screen (First Post), click on the **Finish setup** button.
10. Enter your profile details under the *Last step - a few basics* section. Everything worked as expected. Click on the **Go to my record** button once mandatory fields are entered (name)/selected (province selection and years in the trade).
11. Complete the *Share your first contribution* form. Selected both the *Ask a question* and *Share knowledge* options. Click on the **Publish** button.
12. Registration is now complete. 

**Expected result:** A new user should be created in the database and selectable the next time you attempt to log into Robin.
**Actual result:** ❌ FAIL — See Issue 1, 2, and 3.
**Severity:** Critical
**Notes:** N/A
**Screenshot/Video:** 

![[Pasted image 20260522224332.png]]

---

### Test 2: [Onboard a New User]
**Scenario:** User is user, on desktop browser (Edge).
**Steps to reproduce:**
1. Navigate to the main application screen.
2. Click on **Get started free** button.
3. Click on **Create my account** button.
4. Step 1 of onboarding workflow: Click on *Apprentice* panel, then click on the **Continue** button.
5. Step 2 of onboarding workflow: Click on the *Electrician (Construction)* button and then the **Continue** button.
6. Step 3 of onboarding workflow: Remove the first sentence until we determine how we are going to handle logbooks in Robin. Remove "Think of this as your digital logbook — but better.". Click on the **Got it - keep going** button.
7. Step 4 of onboarding workflow: Click on the **Got it - keep going** button.
8. Step 5 of onboarding workflow: Verified that I couldn't click on the submit button without entering a minimum 20 character response. Click on the **Submit my answer** button.
9. On the Time to show what you know screen (First Post), click on the **Finish setup** button.
10. Enter your profile details under the *Last step - a few basics* section. Everything worked as expected. Click on the **Go to my record** button once mandatory fields are entered (name)/selected (province selection and years in the trade).
11. Complete the *Share your first contribution* form. Selected both the *Ask a question* and *Share knowledge* options. Click on the **Publish** button.
12. Registration i

**Expected result:** A new user should be created in the database and selectable the next time you attempt to log into Robin.
**Actual result:** ✅ PASS / ❌ FAIL — [What actually happened]  
**Severity:** Critical
**Notes:** [Additional context]  
**Screenshot/Video:** 

---

## Issues Found

### Issue #1: Onboarding Page Numbers
**Severity:** 🟢 Low  
**Location:** http://localhost:3000/onboarding/profile
**Description:** It shows Step 4 of 5 (goes backwards) in the top left and then *Profile* on the top right. It is the profile screen but the numbering no longer makes sense.
**Steps to reproduce:** Follow the steps under Onboard a New User
**Expected behavior:** Top left of the header navigation pane should previous page and the next page should be in the top right.
**Actual behavior:** I'm not sure how the pages should be viewed. If it is meant to be previous page and next page in the header navigation, then it is showing the current screen in the top right, not the next screen.
**Affected devices/browsers:** Desktop Edge
**Screenshot:** N/A

### Issue #2: First Post Page Number
**Severity:** 🟢 Low  
**Location:** http://localhost:3000/onboarding/first-contribution
**Description:** I think that after the user has entered their details (Step 5), we have to handle the question that is asked and the first contribution differently for what is visible in the header. It's confusing because now I don't know what page I am on, and what the previous pages were. 
**Steps to reproduce:** Follow the steps under Onboard a New User
**Expected behavior:** Top left of the header navigation pane should previous page and the next page should be in the top right.
**Actual behavior:** I'm not sure how the pages should be viewed. If it is meant to be previous page and next page in the header navigation, then it is showing the current screen in the top right, not the next screen.
**Affected devices/browsers:** Desktop Edge
**Screenshot:** [If applicable]

![[Pasted image 20260522223947.png]]
### Issue #3: Character Limit Not Imposed on Details Field
**Severity:** 🟢 Low  
**Location:** http://localhost:3000/onboarding/first-contribution
**Description:** User only needs to be able to enter 1 character in the *Details* field.
**Steps to reproduce:** Enter a single character in the *Details* field and you will notice that the **Publish** button becomes available.
**Expected behavior:** It should require the user to enter at least 100 character as we are expecting a complete sentence or more.
**Actual behavior:** User can bypass the screen by entering a single character in the Details field.
**Affected devices/browsers:** Desktop Edge
**Screenshot:** 
![[Pasted image 20260522224742.png]]

### Issue #4: Dashboard Formatting - Readability
**Severity:** 🟢 Low  
**Location:** http://localhost:3000/dashboard
**Description:** The *This Month* section is difficult to read
**Steps to reproduce:** Go to the Dashboard screen and look at the panel below the welcome message and in the middle.
**Expected behavior:** As a user who is unfamiliar the dashboard, they would not able to determine what the metrics being tracked are for *This Month* (which are Posts, Answers, Questions, Endorsed).
**Actual behavior:** It is not readable. You can't tell what the headings are for each metric.
**Affected devices/browsers:** Desktop Edge
**Screenshot:** 
![[Pasted image 20260522234535.png]]

### Issue #5: Dashboard Formatting - Missing Stats?
**Severity:** 🟢 Low  
**Location:** http://localhost:3000/dashboard
**Description:** I noticed that the Reputation Points, Credential issued, and Mentor Tier stats are not visible on the dashboard.
**Steps to reproduce:** Go to the Dashboard screen. I don't see them anywhere.
**Expected behavior:** These values should be on the dashboard.
**Actual behavior:** They are just missing from the dashboard. It might be a good opportunity to reformat the entire thing for readability.
**Affected devices/browsers:** Desktop Edge
**Screenshot:** N/A

### Issue #6: Welcome Back - Existing User Profiles
**Severity:** 🟡 Medium
**Location:** http://localhost:3000/auth/sign-in
**Description:** There are three profiles at the *Welcome Back* screen; Morgan Master, Jordan Journeyperson and Alex Apprentice that are marked as 'Active'.
**Steps to reproduce:** Attempt to sign in with one of the profiles detailed in the Description of this test.
**Expected behavior:** On clicking on any of the existing users, you should be able to sign in with their profile.
**Actual behavior:** You get an "Unable to load profile" error. It returns a null value like the test data is missing. Recreate the mock profile data for the three individuals outlined in the Description field for ease of UI/UX testing since we drop the database frequently.
**Affected devices/browsers:** Desktop Edge
**Screenshot:** 
![[Pasted image 20260523140357.png]]



---

## Sign-Off
**Tester:** Lance Tofsrud
**Date completed:** 2026-05-23
