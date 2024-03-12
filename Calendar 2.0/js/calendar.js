
// Loads the entire calendar
function loadCalendar() {
    
    // Get all the relevant elements.
    const calendar = document.getElementById('calendar')
    const months = document.getElementById('months')
    const weeks = document.getElementById('weeks')
    const days = document.getElementById('days')

    // Clear everything;
    months.innerHTML = '';
    weeks.innerHTML = '';
    days.innerHTML = '';

    // Obtain the current date
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();

    let startYear = year
    if (settings.startMonth-1 > month) startYear--
    const startDate = new Date(startYear, settings.startMonth-1, settings.startDate);
    let endYear = year;
    if (settings.endMonth < settings.startMonth) endYear++;
    const endDate = new Date(endYear, settings.endMonth-1, settings.endDate);

    // From settings, obtain the monday of the week containing the start date and likewise for the sunday containing the end date.
    const startMonday = new Date(year, settings.startMonth-1, startDate.getDate()-dayOfTheWeek(startDate));
    const endSunday = new Date(endYear, settings.endMonth-1, endDate.getDate()-dayOfTheWeek(endDate) + 6);

    // Iterate over the months and then days, creating elements for each, keeping track of the weeks as they pass.
    let weekCounter = 0;
    let weekColour;
    let yearShift = 0
    for (let m = startMonday.getMonth(); m-1 != endSunday.getMonth(); m = (m+1) % 12) {
        
        // Create a monthBox
        const monthBox = document.createElement('div');
        monthBox.classList.add('monthBox');
        let monthBoxHeight = -10;
        
        monthBox.innerText = new Date(year+yearShift, m, 1).toLocaleDateString('en-uk', {month: 'long'})

        // If the month is odd, change its colour
        if (m % 2) monthBox.classList.add("odd");

        // Determine the first and last days of the relevant month.
        let firstOfMonth = (m == startMonday.getMonth()) ? startMonday.getDate() : 1;
        let lastOfMonth = (m == endSunday.getMonth()) ? endSunday.getDate() : new Date(year, m+1, 0).getDate();
        for (let d = firstOfMonth; d <= lastOfMonth; d++) {
            if (m == 0 && d == 1) yearShift++
            // Determine the unique code for this day
            const dayCode = new Date(year+yearShift, m, d).toDateString();

            // Create a dayBox
            const dayBox = document.createElement('div');
            dayBox.classList.add('dayBox');
            
            dayBox.innerText = d;

            // When clicked, dayBoxes open the day viewer on their date.
            dayBox.addEventListener('click', () => openDayViewer(dayCode));

            // If the day is in an odd month, change its colour.
            if (m % 2) dayBox.classList.add("odd");
            // If day is in the past, strike through it.
            if (Date.parse(currentDate) > Date.parse(new Date(year+yearShift, m, d+1))) dayBox.style.textDecoration = "line-through black 3px"
            // If day is today, then give it the 'current' class.
            if (m == month && d == day) dayBox.classList.add("current");

            // Search for events on this day
            const eventsForDay = findAll(events, e => e.date === dayCode)
            if (eventsForDay) {
                if (eventsForDay.length < 4) { // If theres less than 4 events, show the events individually
                    eventsForDay.sort((e1, e2) => Number(e1.time) < Number(e2.time) ? -1 : 1)
                    for (let event of eventsForDay) {
                        const eventMarker = document.createElement('div');
                        if (eventsForDay.length == 1) eventMarker.style.height = "25px"
                        if (eventsForDay.length == 2) eventMarker.style.height = "12.5px"
                        eventMarker.classList.add("eventMarker");
                        eventMarker.style.backgroundColor = colours[event.colour];
                        dayBox.appendChild(eventMarker);
                    }
                } else { // If theres more than four just show a counter for how many there are.
                    const eventCounter = document.createElement('div');
                    eventCounter.classList.add("eventCounter");
                    eventCounter.innerText = eventsForDay.length;
                    dayBox.appendChild(eventCounter);
                }
            }


            // If this day is a monday...
            if (dayOfTheWeek(new Date(year+yearShift, m, d)) == 0) {

                // Create a weekBox
                const weekBox = document.createElement('div');
                weekBox.classList.add('weekBox');

                // If theres a weekObject at this index, add the name and colour to the weekBox
                const weekObject = weekObjects[weekCounter];
                if (weekObject) {
                    weekBox.innerText = weekObject.name;
                    weekColour = weekObject.colour
                    weekBox.style.backgroundColor = colours[weekColour];
                }

                // If the week falls in an odd month, change its colour;
                if (m % 2) weekBox.classList.add("odd");
                // If the this is the selected week, add the 'current' class.
                if (weekCounter == clickedWeek) weekBox.classList.add('current');

                // Make each week box selectable.
                const n = weekCounter;
                weekBox.addEventListener('click', () => selectWeek(n))

                // Add it to the "weeks" div
                weeks.appendChild(weekBox);
                weekCounter++;

                monthBoxHeight += 60;
            }

            // If the week has a specified colour, make the box that colour.
            dayBox.style.backgroundColor = colours[weekColour];

            // Add it to the "days" div
            days.appendChild(dayBox);

        }

        // Set the monthBox's height and add it to the "months" div
        monthBox.style.height = monthBoxHeight.toString() + "px";
        if (monthBoxHeight > 0) months.append(monthBox);
    }
}

function selectWeek(n) {
    if (clickedWeek == n) {
        openWeekViewer();
    } else {
        clickedWeek = n;
        loadCalendar();
        loadTimetable();
    }
}