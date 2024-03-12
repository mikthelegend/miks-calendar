// Loads the entire timetable
function loadTimetable() {
    // Get all the relevant elements
    const timetableDays = document.getElementById('timetable_days');
    const planner = document.getElementById('planner');

    // Make the current day of the week 'current'
    const weekDays = document.getElementById('timetable_weekdays')
    for (let div of weekDays.children) div.style.background = null;
    if (currentWeek == clickedWeek) {
        weekDays.children[dayOfTheWeek(new Date())].classList.add('current')
    } else {
        weekDays.children[dayOfTheWeek(new Date())].classList.remove('current');
    }

    // Clear the timetable and planner if they exist.
    timetableDays.innerHTML = "";
    planner.innerHTML = "";

    // Determine what time range to be used (always includes timed events. If no timed events, use default settings)
    let startTime = settings.startTime;
    let endTime = settings.endTime;
    
    
    let eventsForWeek = [];
    for (let i = 0; i < 7; i++) {
        //Identify the date for this day column.
        const currentDate = new Date();
        const date = currentDate.getDate() - dayOfTheWeek(currentDate) + i;
        const dateInQuestion = new Date(currentDate.getFullYear(), currentDate.getMonth(), date + 7*(clickedWeek-currentWeek));

        eventsForWeek[i] = findAll(events, e => e.date == dateInQuestion.toDateString());
        if (eventsForWeek[i]) {
            const timedEvents = eventsForWeek[i].filter(e => e.time)
            for (let e of timedEvents) {
                if (e.time < startTime) startTime = Number(e.time);
                if (e.time > endTime) endTime = Number(e.time);
            }
        }
    }

    // Calculate time slot height
    const timeSlotHeight = 650/(endTime - startTime + 1)/2

    // Iterate over the days of the week and the times in each day
    for (let i = 0; i < 7; i++) {
        // Create a column to hold the time slot elements.
        const dayColumn = document.createElement('div');
        dayColumn.classList.add('dayColumn');
        timetableDays.appendChild(dayColumn);

        //Identify the date for this day column.
        const currentDate = new Date();
        const date = currentDate.getDate() - dayOfTheWeek(currentDate) + i;
        const dateInQuestion = new Date(currentDate.getFullYear(), currentDate.getMonth(), date + 7*(clickedWeek-currentWeek));

        // Search for any events which falls on this day.
        const eventsForDay = eventsForWeek[i]
        if (eventsForDay) {
            eventsForDay.sort((e1, e2) => (Number(e1.time) < Number(e2.time)) ? -1 : 1);
            if (eventsForDay.length == 1) { // if theres just one, give the weekday a background colour
                const e = eventsForDay[0];
                weekDays.children[i].style.background = colours[e.colour];
            } else {
                let coloursForDay = []; // otherwise, give the weekday a number of colours.
                for (let e of eventsForDay) {
                    coloursForDay.push(colours[e.colour]);
                }
                let gradient = "linear-gradient(to right"
                for (let j = 0; j < coloursForDay.length; j++) {
                    gradient += ", " + coloursForDay[j] + " " + ((j)*100/coloursForDay.length) + "%";
                    gradient += ", " + coloursForDay[j] + " " + ((j+1)*100/coloursForDay.length) + "%";
                }
                gradient += ")"
                weekDays.children[i].style.background = gradient;

            }
        }

        let classDurationCounter = 0;
        let classColour;
        let zIndex = 100;

        // At half hour intervals, create time slots. Index on the hour.
        for (let t = startTime; t < endTime + 1; t += 0.5) {
            // The timecode is a unique identifier for the given time on the given day of the week.
            const timeCode = t.toString() + "/" + i;

            const timeSlot = document.createElement('div');
            timeSlot.classList.add('timeSlot');
            timeSlot.style.zIndex = zIndex;
            zIndex--;

            // If its the current timeslot, add the current class.
            if (currentDate.toDateString() == dateInQuestion.toDateString() && currentDate.getHours() + 0.5 * Math.floor(currentDate.getMinutes()/30) == t) timeSlot.classList.add('current');

            // Small aesthetic change for the first timeslot in each column.
            if (t == startTime) timeSlot.style.border = 'none';

            if (t % 1 == 0) timeSlot.innerText = (t-1) % 12 + 1;

            timeSlot.style.height = timeSlotHeight.toString() + "px";
            timeSlot.style.fontSize = (timeSlotHeight - 5).toString() + "px";

            timeSlot.addEventListener('click', () => openClassViewer(timeCode))

            // Search for a class starting at this time on this day of the week.
            const classForSlot = classes.find(c => c.time === timeCode)
            if (classForSlot) { // This code runs on the first timeslot that the class covers
                timeSlot.innerText += " " + classForSlot.title;
                classDurationCounter = classForSlot.duration;
                classColour = classForSlot.colour;
            }
            if (classDurationCounter) { // This code runs on every timeslot that the class covers.
                timeSlot.style.backgroundColor = colours[classColour]
                classDurationCounter -= 0.5;
            }

            // Search for an event which falls on this particular timeslot.
            const eventForTime = eventsForDay ? eventsForDay.find(e => e.time == t) : null;
            if (eventForTime) {
                timeSlot.style.borderTop = "5px solid " + eventForTime.colour;
                if (timeSlot.innerText.length <= 2) {
                    timeSlot.innerText += " " + eventForTime.title;
                }
            }

            dayColumn.appendChild(timeSlot);
        }

        shuffleTasks();

        // Create a planner slot below the day column
        const plannerSlot = document.createElement('div');
        plannerSlot.classList.add('plannerSlot');
        if (dayOfTheWeek(new Date()) == i && currentWeek == clickedWeek) {
            plannerSlot.classList.add('current')
        } else {
            plannerSlot.classList.remove('current');
        }

        // Cast the day index to a const for passing in anonnymous functions
        const dayString = dateInQuestion.toDateString();

        // Add a new item button
        const newItemButton = document.createElement('button');
        newItemButton.classList.add('plannerButton');
        newItemButton.innerText = "New";
        newItemButton.addEventListener('click', () => createPlannerItem(plannerSlot, dayString));
        plannerSlot.appendChild(newItemButton);

        // Add a delete item button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('plannerButton');
        deleteButton.innerText = "Delete";
        deleteButton.addEventListener('click', () => removePlannerItem(plannerSlot, dayString));
        plannerSlot.appendChild(deleteButton);

        // Add all the tasks that already exist for this day
        const tasksForDay = findAll(tasks, t => t.date == dateInQuestion.toDateString());

        if (tasksForDay) {
            for (let t of tasksForDay) {
                createPlannerItem(plannerSlot, dayString);
                plannerSlot.lastChild.value = t.task;
            }
        }

        planner.appendChild(plannerSlot);
    }
}

function createPlannerItem(parent, day) {
    const plannerItem = document.createElement('input'); // Create and classify a html input
    plannerItem.classList.add('plannerItem');

    plannerItem.addEventListener('focusin', () => {      // If you select the input, remove its contents from the tasks array.
        tasks = tasks.filter(t => !(t.date == day && t.task == plannerItem.value))
        console.log("deleted!")
    })

    plannerItem.addEventListener('focusout', () => {     // If you deselect the input, save its contents to the tasks array, and update local storage.
        if (plannerItem.value.length) {
            tasks.push({
                task: plannerItem.value,
                date: day
            })
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    })

    parent.appendChild(plannerItem);
}

function removePlannerItem(parent, day) {
    const targetItem = parent.children[2];                                    // Identify the html input to be removed
    tasks = tasks.filter(t => !(t.date == day && t.task == targetItem.value)) // Remove the appropriate object from the tasks array
    localStorage.setItem('tasks', JSON.stringify(tasks))                      // Update local storage to match the tasks array
    if (parent.children.length > 2) targetItem.remove();                      // Remove the html input.
}

function shuffleTasks() {
    const currentDate = new Date().toDateString();
    for (let t of tasks) {
        if (Date.parse(t.date) < Date.parse(currentDate)) { // Set the date of any task in the past to the current date.
            t.date = currentDate;
        }
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

