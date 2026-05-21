# Backyard Ultra Tracker Specification

Build a backyard ultra tracker web application for a single runner that consists of two pages: a display page and an admin page.

## Race logic

In a backyard ultra, beginning at the start time of the race, runners must run a pre-defined course loop starting on the hour, every hour. If a runner doesn't make it back in time to start the next loop, they are eliminated from the race. The last runner remaining is the winner. Each loop is 6.706 kilometers long, and commonly referred to as a 'yard'.

## Tech stack

- Framework: Next.js
- Deployment: Vercel
- Data storage: Vecel KV (or something else if there is a better fit)
- Agent Skills: next-best-practices

## Data model

- Race config: object of race title, location, start date, start time, summary
- Runner status: not started, in progress, or finished
- Loops: array of objects that contain a unique id, a loop count, a date, a time, a duration, a pace, and a cumulative kilometer count
- Video display mode: profile feed or URL list
- Videos: array of video URLs
- Loop distance: a constant
- Admin password: Vercel environment variable, `ADMIN_PASSWORD`

## Display page

- The display page will be located at https://backyard-ultra-tracker.bmcfads.dev
- At the top of the page will be the runner status, centered, used as a page title
- Below the page title will be a three column section
- The first column will contain a small heading `Loops Completed`, and underneath will be a large font number that ranges from 0-99
- The second column will contain a small heading `Total Distance`, and underneath will have be a large font number that ranges from 0.00 to 999.99, followed by a small `km`
- The third column will have a small heading `Next Loop Start`, and underneath will be a medium sized font timer of the format `00:00:00` that counts down, and underneath will be a small heading `Elapsed Time`, and underneath will be a medium sized font timer of the format `00:00:00` that counts up
- Below the three columns will be a full-width card that provide race information, including the race title as a small header, the start date, the start time, the location, and the summary
- Below the race information card will be centered `Loop Information` heading, and underneath will be a simple loop information table with headings of: #, Time Completed, Duration, Pace, Cumulative km
- Below the loop table will be a centered `Updates` heading followed by embedded TikTok videos that are either from a profile feed or stored video URLs
- Below that will be a footer section that contains the app name (as a small header), copyright information, and social links; refer to the footer at https://bmcfads.ca/about

### Logic

- Before the race start time the runner status is not started, after the race start time it is in progress, and when the race finished button is active the status is finished
- The loop count on the display page will show the total number of items in the loop array
- The total distance is equal to the number of items in the loop array multiplied by the loop distance
- Before the race start date and time, the next loop start countdown timer shows the time difference between now and the race start time
- After the race start date and time, the next loop start countdown timer shows the time difference between now and the start of the next hour
- Before the race start date and time, the elapsed time shows zeros
- After the race start date and time, the elapsed time shows the difference between the race start date and time and the current time, unless the admin finished button is activated
- The completed loops shown in the loop table are soreted by date and time

## Admin page

- The admin page will be located at https://backyard-ultra-tracker.bmcfads.dev/admin
- The admin page is password protected
- At the top of the page there is a field to enter the race title
- Below the race title field is a field to enter the race location
- Below the race location field are fields to select the race start date and time
- Below the race start date and time is a field to enter the race summary that appears on the display page race summary card and a button to save the info
- Below the race summary is a button to finish the race
- Below the finish button is a big `Loop Completed` button
- Below the loop completed button is a display of all the loops that have been added, with the ability to edit the loop count, date, and time, a way to delete the array item, an automatic refresh that recalculates the duration, pace, and cumulative kilometer count for the array item on save of a new loop, and reorders array items based on date and time
- Below the existing loop array items, there is a way to add a new loop manually
- Below the way to add a new loop is a dropdown to select between video modes of `Profile` or `URLs`
- Below the video mode dropdown is a field to enter a TikTok username
- Below the TikTok username field is a placeholder to add a video URL, with buttons to save the URL and add a new video URL item

### Logic

- Authentication is a simple password field with no user management, entering the correct password grants access for the session
- If the finished button is active, the timers on the display page stop and the next loop start time is set to zero; the elapsed time shows the last shown time when the finished button was activated
- The finished button can be deactivated
- The loop completed button adds a new item to the loop array, with its count incrementing +1 over the total number of array items, the current date and time stored, the duration calculated as the time between now and the most recent hour mark since race start, the pace being the duration in minutes divided by the loop distance (minutes per kilometer), and the cumulative kilometer count being the kilometer count of the last array item plus the loop distance
- If the video mode is selected as profile, the TikTok profile feed is shown on the display page
- If the video mode selected is URLs, the videos in the URL array are shown on the display page
- The completed loops shown on the admin page are sorted by date and time

## Styles

In general, follow the styling found at https://bmcfads.ca, including the same background colours, font colours, font styles, and font weights. 

- For the race info card specifically, look at the `fact-card` class items at https://bmcfads.ca/about
- The finish button is red if not active, gray if active

## Other

- Include an appropriate .gitignore file
