# UI/UX Testing Report — Community Knowledge Tests
**Date:** 2026-05-25  
**Tester:** Lance Tofsrud  
**Environment:** Local (localhost:3000) | Microsoft Edge

---

## Test Scope
Testing the functionality of the Community Knowledge pages.

## Issues Found

### Issue #1: Community Responses are 'Untitled'
**Severity:** 🟡 Medium
**Location:** http://localhost:3000/community
**Description:** Users are able to post responses to existing community posts. I noticed that if you respond to one that was submitted as part of the onboarding process, it does not give it a title - but this is part of a larger hierarchical issue (see Issue #2).
**Steps to reproduce:** 
1) Go to the **Community** tab. 
2) Click on an existing community post that is title *My first contribution*. 
3) Respond to the question and then click on the **Post Answer** button.
**Expected behavior:** I would have expected that it would have the title as the question, but perhaps prefixed with an "A:" to indicate a response.
**Actual behavior:** Clicking on the **Post Answer** button and returning to the main **Community Knowledge** page shows as much of the body of the answer as possible, but the title is 'Untitled'. This is confusing as well since it is not associated in any way to the original question - see Issue #2.
**Affected devices/browsers:** Desktop Microsoft Edge
**Screenshot:** 
![[Pasted image 20260525195750.png]]

### Issue #2: Inconsistent Data Field Naming (Onboarding and Profile)
**Severity:** 🟠 High
**Location:** http://localhost:3000/community
**Description:** It's very difficult to determine which responses are associated to which questions.
**Steps to reproduce:** Respond to any question in the **Community Knowledge** portal. You will notice that your response is at the top of the list, but there is nothing to indicate what question you were attempting to answer.
**Expected behavior:** Similar to any forum post, it should show the original question on the main portal page with the most recently answered at the top so users know that it received a response. Additionally, if it could have a number pill that indicates how many responses it has received, that would be helpful to the user as well since it would help determine how much activity it has had.
**Actual behavior:** Right now, the most recent question or answer is at the top of the page (which is accurate for the default sort option) and there is no way to determine which answers belong to which question.
**Affected devices/browsers:** Desktop Microsoft Edge
**Screenshot:**
![[Pasted image 20260525200948.png]]

### Issue #3: New Questions and Posts Don't Refresh the Community Knowledge Page
**Severity:** 🟠 High  
**Location:** http://localhost:3000/community
**Description:** When you add a new question or post, it doesn't refresh the page so that you see that it was successfully saved.
**Steps to reproduce:** 
1) Go to the **Community** tab. 
2) Click on the **Ask Question** button. 
3) Complete the form and submit by clicking on the **Publish Post** button.
**Expected behavior:** The user should see their new post at, or near (if there are multiple users), the top of the page results. 
**Actual behavior:** You have to refresh the screen (i.e. press F5). That subsequently prevents the **Ask Question** button from working again. I had to press it several more times and eventually the **Create a Post** screen appeared without clicking on the button.
**Affected devices/browsers:** Desktop Microsoft Edge
**Screenshot:** N/A

### Issue #4: Awkward 'Create a Post' Title
**Severity:** 🟡 Medium
**Location:** http://localhost:3000/community
**Description:** Users can create a new 'question' or 'post' to which other members can respond.
**Steps to reproduce:** 
1) Go to the **Community** tab. 
2) Click on the **Ask Question** button. 
3) A new dialog box appears called *Create a Post*.
**Expected behavior:** I would expect that the naming conventions between the main button on the Community Knowledge page mirror the text on the *Create a Post* dialog. 

I see the current flow as confusing as the button label doesn't match the dialog title, and then you have to make a choice inside on top of that which leads to a poor mental model alignment.
**Recommended behavior:** 
I recommend showing two buttons in place of the current **Ask Question** one. They would be:
- Ask a Question (which would be used to ask about a problem or technique)
- Share Knowledge (share a tip/technique/insight)

I think that this makes it clear what the users intent is before clicking on a button. Each button then opens the appropriate form directly so it saves them from having to make a selection in the dialog.

**Affected devices/browsers:** Desktop Microsoft Edge
**Screenshot:** 
![[Pasted image 20260525211020.png]]


### Issue #5: Difficult to Distinguish Questions from Posts
**Severity:** 🟢 Low
**Location:** http://localhost:3000/community
**Description:** Users can create a new 'question' or 'post' to which other members can respond.
**Steps to reproduce:** 
1) Go to the **Community** tab. 
2) Click on the **Ask Question** button. 
3) A new dialog box appears called *Create a Post*.
**Expected behavior:** If I was wanting to help someone out, I'd be able to differentiate between questions and posts without having to filter the questions using the Type drop down list because I might want to jump into a post that is new and interesting as I scroll.
**Actual behavior:** Right now there the Community Knowledge page has other issues like responses not being associated with the original question or post which makes this even more difficult to sort through.
**Suggested behavior:** Use a small icon to differentiate the difference between questions and posts. That, plus fixing the association of responses to questions and posts should make this easier to go through once there are thousands of posts.
**Affected devices/browsers:** Desktop Microsoft Edge
**Screenshot:** N/A

### Issue #6: Search Results
**Severity:** 🟠 High  
**Location:** http://localhost:3000/community
**Description:** On the **Community Knowledge** page, you can search for specific posts or questions.
**Steps to reproduce:** 
1) Go to the **Community** tab. 
2) Enter search parameters into the *What do you want to know?* field at the top of the screen. Results will automatically begin to filter.
**Expected behavior:** Provided that the user has entered something remotely close to what they were looking for, it should list it in the search results.
**Actual behavior:** You get a wide variety of results that don't make sense without understanding more as to how the search works with Supabase. It doesn't seem to return results for things that are typed exactly in a post or question, yet symbols like dollar sign and asterix return results. In the example of a dollar sign, I have a price of $19.99 in the body of one post and it shows up in the search results if I enter a dollar sign in the prompt. But if I add a 1 right after the dollar sign, it shows that there are not posts yet.
**Affected devices/browsers:** Desktop Microsoft Edge
**Screenshot: **

![[Pasted image 20260525213442.png]]

![[Pasted image 20260525213520.png]]
![[Pasted image 20260525213619.png]]

![[Pasted image 20260525213638.png]]

### Issue #7: Zero Search Results Message
**Severity:** 🟢 Low
**Location:** http://localhost:3000/community
**Description:** Continuity issue with 'error' that is displayed when you get no results back from your search of posts/questions.
**Steps to reproduce:** 
1) Go to the **Community** tab. 
2) Enter search parameters into the *What do you want to know?* field at the top of the screen. Results will automatically begin to filter.
3) If there are no search results, you will get a message indicating that no content could be found.
**Expected behavior:** If no results are found, it should display a message indicating so.
**Actual behavior:** While it does show a message, the nomenclature is specific to questions only.
**Suggested behavior:** Make the messaging more generic and action-focused. Change it to:
*No results found.
Ask a question or share knowledge to get started!

**Affected devices/browsers:** Desktop Microsoft Edge
**Screenshot:** N/A
![[Pasted image 20260525214452.png]]


---

## Sign-Off
**Tester:** Lance Tofsrud
**Date completed:** 2026-05-25

