# Page One - Starting Pitch #3 (05/03/2021)

**Type of Meeting:** Starting Pitch Session

**Date:** May 03, 2021 @ 5:00PM

**Location:** Conducted virtually over Zoom and Miro boards, Google SLides

## Attendance

**Present**

- Brandon Wang
- Victoria Edeeva
- Elias Fang
- Geewhan Kim
- James Nguyen
- Kyle Hu
- Charles Ting
- Alvin Mac
- Julia Xu

**Absent**

# Agenda

**Systems Diagram - UX Flowchart, System Architecture**
- Decided to do System Architecture first before UX so we have a clear picture of how all the parts are working together.
- System architecture we decided to organize each part as a file (.html, .js) to show how each part will interact.
- Decided to use Firebase as a database system for javascript to avoid having to delve into php and SQL.
- Decided to have signin.html and login.html be the same file, to minimize the amount of files we use and eliminate file complexity.
- Decided css does not need to be included as it is a style guideline not an actual interactive element. 
- Created a UX Flow Chart based on the following reference: https://www.visual-paradigm.com/tutorials/flowchart-tutorial/

**Design Choices and ADR**
- Saved for discussion later today, ran out of time.

**Revisiting the Wireframes**
- Calendar
    - Should the calendar have To-Dos and Events? Or just events?
        - Booked for future review, as this pertains to how we assign tags / templates.
- Tags / Templates
    - Major decision: Whether to assign tags to text or the note itself
    - Problem: If we want to create an event, do we need to create an entire empty note just for the event?
    - Problem: If we want to incorporate all the todos into a single page, would we need to be able to tag the text object as a checkbox? Similar to the above problem.
    - Potential Solution: Allow assignment of tags such as event / todo to individual text objects in the note.
        - Problem: Implementation, we do not know how to and do not know how difficult this will be.
    - Potential Solution: Create notes, events, and todos as separate templates / tags and group each one in the main page separately.
        - Problem: Flexibility and free-form limitation, how will we be able to add regular notes and text to "todo" objects and won't be able to add regular note and text to "event" templates.
    - Spent too much time deliberating, booked for future review after implementation difficulty has been researched.


**Closing Notes**
- Decided to present our pitch the usual time on Thursday (subject to revision if necessary)

**Meeting End: 6:30 pm**

# For Next Time
- Implementation Research to decide which direction to go for the events / todo decision.
- ADR (later today)
