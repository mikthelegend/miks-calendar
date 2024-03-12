# Welcome to my calendar app!
This is a calendar/timetable app I developed for my own personal use, since I couldn't find an existing solution that was *just* right for me.

Many different apps had features that I loved, but we're lacking in some way, so I thought to combine the bits I love from each software I tried to create the ultimate personally tailored experience.

"How hard could building a whole calendar app actually be?" I figured. Answer: Pretty hard, but not impossible!

![Screenshot 2024-03-12 at 13-43-51 Calendar](https://github.com/mikthelegend/miks-calendar/assets/88571769/f794b519-c9b5-4edb-9717-0ee2fa154d74)

# Installation Guide
Simply download the folder! Inside is an 'index.html' file which, when opened, will start the app. You can either create a shortcut to this file for ease of access, or save it as a bookmark in your browser! 
This app was primarily tested on Firefox, but other browsers such as Chrome should also work.

> IMPORTANT NOTE: This app uses your browser's local storage to keep track of your data (such as events, classes, notes, etc...). This means if you clear your cache you will lose all that data, so be careful when cleaning up!

# Usage Guide
Here's a short guide on how to use the different features of my application.

## Setup
When you first open the app, you will be prompted to enter two things:
- The start and end dates for the calendar (entered in dd/mm format, the year is determined automatically)
- The start and end times for the timetable (entered as two 24hr integers separated by a '-', e.g: 8-20)

Once you save these settings, the calendar will open up!
## Layout
There are a few main sections of the application:
- The settings button (gear icon, top left corner)
- The calendar (left-hand side)
- The timetable (right-hand side)
- The notes/tasks section (below the timetable)
- The 'Up Next' tab (far right)

Below are some explanations of how to use each section.
## Settings
On the settings page you can see a few fields and buttons. At the top, there is a button to reset the week names to their default (Week 0, Week 1, etc...) and one to clear the week names to be blank.

There are also fields to modify the calendar period, and the timetable period. See the "Setup" chapter on formatting these fields.
## Calendar
To create an event in the calendar, simply click a day. This will open the event viewer, where you can add events using the 'new' button. 

Simply fill out the fields (time is a 24hr number with 0.5 intervals, e.g: 14.5 = 2:30pm) and press save to add your event.

Along the left side of the calendar is the week selector. Simply click on a week to select it, and click again to change its name/colour.

Events will show up on the calendar and the timetable if the correct week is selected.
## Timetable
To add a class (which is a weekly, duration-bound object) to the timetable, simply click on a time slot. This will open the class viewer, where you can add a class using the 'new' button.

Simply fill out the fields (duration is in hours, with 0.5 increments) and press save to add your class.

Classes will always appear on the timetable, regardless of the selected week.
## Notes/Tasks
Below each day of the week is a notes/tasks section. Here you can add small pieces of text which act as notes, tasks or reminders. 

When a day is in the past, all of its notes are shuffled up to the present day.

Notes are week dependant, meaning you can select a week in the future to set a note on a day beyond the current week.
## Up Next
On the far right is a tab labelend "Up Next". Clicking this will open a list of all upcoming events, ordered by date and time. 

This will help the user prioritise upcoming events and due dates.
