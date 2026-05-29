# UI/UX Testing Report — User Profile Tests
**Date:** 2026-05-25  
**Tester:** Lance Tofsrud  
**Environment:** Local (localhost:3000) | Microsoft Edge

---

## Test Scope
Profile editing.

## Issues Found

### Issue #1: Profile Missing User Information Fields
**Severity:** 🟡 Medium
**Location:** http://localhost:3000/profile/edit
**Description:** When you are onboarded as a new user, you are prompted to enter your name, province/territory, and the number of years in the trade. These are mandatory fields. But there are two optional ones that are asked; *Employer or contractor name* and *Union local*. The optional fields are not available under **Edit Profile**.
**Steps to reproduce:** Complete the onboarding process and then click on the **Profile** tab at the top of the screen, followed by the **Edit Profile** button. When you go to the Profile screen, you don't see the optional fields so you can edit them or enter the information for the first time.
**Expected behavior:** All of the user information fields that are prompted in the onboarding process should be available for editing.
**Actual behavior:** You only get the Display Name, Years of Experience, Province and a Bio field (which is not available during onboarding).
**Affected devices/browsers:** Desktop Microsoft Edge
**Screenshot:** 
![[Pasted image 20260525130212.png]]

### Issue #2: Inconsistent Data Field Naming (Onboarding and Profile)
**Severity:** 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low  
**Location:** http://localhost:3000/profile/edit
**Description:** The names of the fields in the onboarding process is inconsistent with what they are in the **Edit Profile** screen.
**Steps to reproduce:** Complete the onboarding process and take note of the field names on Step 4. Once onboarded, click on the **Profile** tab at the top of the screen and then the **Edit Profile**  button. You will notice that there are differences which could be confusing to a user.
**Expected behavior:** Choose a naming convention. This is what I propose:
1) On the **Edit Profile** screen, change *Province* to match what is in the onboarding process; *Province / territory*.
2) Ensure that if you have corrected Issue #1 in this document, that the optional fields match the same as in Step 4 of the onboarding process.
**Actual behavior:** Fields should either match exactly, or have a level of inference that shouldn't confuse a user.
**Affected devices/browsers:** Desktop Microsoft Edge
**Screenshot:** N/A
### Issue #3: FetchData Error After Editing Profile
**Severity:** 🟠 High  
**Location:** http://localhost:3000/profile
**Description:** An error is presented in the **Profile** tab after making changes to your profile.
**Steps to reproduce:** Go to the **Profile** tab. Click on the **Edit Profile** button. Change one or more data fields and save the form. On returning to the main **Profile** tab, you will notice a Next.js error (see screenshot).
**Expected behavior:** Well, preferably have no exception thrown. 
**Actual behavior:** You get an Error: HTTP 500 error.
Error: HTTP 500
    at fetchData (webpack-internal:///(app-pages-browser)/./app/profile/page.tsx:34:28)
    at async Promise.all (index 2)
    at async load (webpack-internal:///(app-pages-browser)/./app/profile/page.tsx:62:93)
**Affected devices/browsers:** Desktop Microsoft Edge
**Screenshot:** 
![[Pasted image 20260525184247.png]]

---

## Sign-Off
**Tester:** Lance Tofsrud
**Date completed:** 2026-05-25

