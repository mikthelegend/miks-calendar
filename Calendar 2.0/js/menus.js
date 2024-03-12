const dayViewer = document.getElementById('dayViewer');
const classViewer = document.getElementById('classViewer');
const weekViewer = document.getElementById('weekViewer');
const settingsMenu = document.getElementById('settingsMenu');
const menuFrame = document.getElementById('menuFrame');
const menuContent = document.getElementById('menuContent');

// Opens the day viewer for the given day.
function openDayViewer(dayCode) {
    clickedDay = dayCode;

    // Change the header to the selected date string
    const dayHeader = document.getElementById('dayHeader');
    dayHeader.innerText = dayCode;

    // obtain and clear the list of events on this day
    const eventList = document.getElementById('eventList')
    eventList.innerHTML = '';

    // Find all the events on this day
    eventsForDay = findAll(events, e => e.date === dayCode)

    if (eventsForDay) {
        // Display all the events for this day on the event list.
        eventsForDay.sort((e1, e2) => (Number(e1.time) < Number(e2.time)) ? -1 : 1)
        for (let i = 0; i < eventsForDay.length; i++) {
            let e = eventsForDay[i];
            // Create the event element.
            const event = document.createElement('div');
            event.classList.add('event');
            event.style.backgroundColor = colours[e.colour];
    
            // Add the event's title.
            const eventTitle = document.createElement('h3');
            eventTitle.innerText = e.time ? e.title + " @ " + to12Time(e.time) : e.title;
            event.appendChild(eventTitle);

            // Cast the event object to a const so it can be the argument of anonymous functions.
            const eventObject = e;

            // Create an edit button
            const editButton = document.createElement('button')
            editButton.innerText = "Edit"
            editButton.addEventListener('click', () => {
                // Create a new event but substitute all the current events details in.
                createNewEvent(i)
                const newEvent = document.getElementById('newEvent');
                newEvent.children[0].value = eventObject.title;
                newEvent.children[1].value = eventObject.time ? eventObject.time : "";
                newEvent.children[2].value = eventObject.colour;
                newEvent.children[3].value = eventObject.description ? eventObject.description : "";
                // Remove this instance of the event
                deleteEvent(eventObject);
                event.remove();
            })
            event.appendChild(editButton);

            // Create a delete button
            const deleteButton = document.createElement('button')
            deleteButton.innerText = "Delete"
            deleteButton.addEventListener('click', () => {
                deleteEvent(eventObject);
                openDayViewer(clickedDay);
            })
            event.appendChild(deleteButton);

            // If the event has a description, add it.
            if (e.description) {
                const eventDescription = document.createElement('p');
                eventDescription.innerText = e.description;
                event.appendChild(eventDescription);
            }

            // Once everything is inside the event element, add the event to the list.
            eventList.appendChild(event);
        }
    } else {
        // If theres no events on a given day, display a message.
        const noEventMessage = document.createElement('h3');
        noEventMessage.innerText = "No events!";
        noEventMessage.style.textAlign = 'center';
        eventList.appendChild(noEventMessage);
    }

    dayViewer.style.display = 'block';
}

function closeDayViewer() {
    dayViewer.style.display = 'none';
}

function createNewEvent(index = null) {
    // If a new event is already in creation, return
    if (document.getElementById('newEvent')) return;

    const newEvent = document.createElement('div');
    newEvent.id = 'newEvent'
    
    // Give the newEvent inputs for all its components.
    const titleInput = document.createElement('input');
    titleInput.placeholder = "Event Title";
    newEvent.appendChild(titleInput);

    const timeInput = document.createElement('input');
    timeInput.placeholder = "Time (optional)";
    newEvent.appendChild(timeInput);

    const colourSelector = document.createElement('select');
    for (let colour in colours) {
        const option = document.createElement('option');
        option.value = colour;
        option.innerText = capitalise(colour);
        colourSelector.appendChild(option);
    }
    newEvent.appendChild(colourSelector);

    const descriptionInput = document.createElement('textarea');
    descriptionInput.placeholder = "Description (optional)"
    newEvent.appendChild(descriptionInput);

    // Add a save button that will turn this into an official event.
    const saveButton = document.createElement('button');
    saveButton.innerText = "Save"
    saveButton.addEventListener('click', () => {
        if (titleInput.value) {
            events.push({
                title: titleInput.value,
                description: descriptionInput.value,
                date: clickedDay,
                time: timeInput.value ? timeInput.value : null,
                colour: colourSelector.value,
            })
            localStorage.setItem('events', JSON.stringify(events));
            newEvent.remove();
            openDayViewer(clickedDay);
            loadCalendar();
            loadTimetable();
        }
    })
    newEvent.appendChild(saveButton);

    // Add a cancel button to stop editing
    const cancelButton = document.createElement('button');
    cancelButton.innerText = "Cancel"
    cancelButton.addEventListener('click', () => {
        newEvent.remove();
    })
    newEvent.appendChild(cancelButton);

    const eventList = document.getElementById('eventList')
    if (index == null) {
        eventList.appendChild(newEvent);
    } else {
        eventList.insertBefore(newEvent, eventList.children[index]);
    }
}

function deleteEvent(eventObject) {
    events = events.filter(e => e !== eventObject);
    localStorage.setItem('events', JSON.stringify(events));
    loadCalendar();
    loadTimetable();
}

function openClassViewer(timeCode) {
    document.getElementById('editClassButton').style.display = "initial";
    document.getElementById('closeClassButton').style.display = "initial";

    clickedTime = timeCode;
    let t = timeCode.split('/')[0];
    let d = dayOfTheWeek_Name(timeCode.split('/')[1]);

    const classForSlot = classes.find(c => c.time === timeCode);

    const title = document.getElementById('classTitle');
    const description = document.getElementById('classDescription');
    const editClassButton = document.getElementById('editClassButton');
    if (classForSlot) {
        title.innerText = to12Time(t) + " " + d + " - " + classForSlot.title;
        description.innerText = classForSlot.description;
        editClassButton.innerText = "Edit"
    } else {
        title.innerText = to12Time(t) + " " + d + " - No Classes"
        description.innerText = "";
        editClassButton.innerText = "New"
    }

    classViewer.style.display = 'block';
}

function editClass() {
    // Clear all the details from the class viewer
    document.getElementById('editClassButton').style.display = "none";
    document.getElementById('closeClassButton').style.display = "none";
    document.getElementById('classDescription').innerText = "";

    // Remove the name of the class from the class title
    const classTitle = document.getElementById('classTitle');
    classTitle.innerText = classTitle.innerText.split(" - ")[0];

    // Create an 'edit screen' div to hold all the edit stuff.
    const editScreen = document.createElement('div');
    classViewer.appendChild(editScreen);

    // Title input
    const classTitleInput = document.createElement('input');
    classTitleInput.placeholder = "Class Title"
    editScreen.appendChild(classTitleInput)

    // Duration input
    const classDurationInput = document.createElement('input');
    classDurationInput.placeholder = "Class Duration"
    editScreen.appendChild(classDurationInput)

    // Colour selector
    const colourSelector = document.createElement('select');
    for (let colour in colours) {
        const option = document.createElement('option');
        option.value = colour;
        option.innerText = capitalise(colour);
        colourSelector.appendChild(option);
    }
    editScreen.appendChild(colourSelector);

    // Description text area
    const classDescriptionInput = document.createElement('textarea');
    classDescriptionInput.placeholder = "Description";
    editScreen.appendChild(classDescriptionInput);

    // If there was a class in this slot, fill in the relevant fields with the existing class details. Then delete that class from storage.
    const classForSlot = classes.find(c => c.time === clickedTime);
    if (classForSlot) {
        classTitleInput.value = classForSlot.title;
        classDurationInput.value = classForSlot.duration;
        classDescriptionInput.value = classForSlot.description ? classForSlot.description : "";
        colourSelector.value = classForSlot.colour;

        deleteClass(classForSlot);
    }

    // Add a save button.
    const saveClassButton = document.createElement('button');
    saveClassButton.innerText = "Save";
    saveClassButton.addEventListener('click', () => {
        if (classTitleInput.value) {
            classes.push({
                time: clickedTime,
                title: classTitleInput.value,
                duration: classDurationInput.value ? classDurationInput.value : 1,
                description: classDescriptionInput.value ? classDescriptionInput.value : "",
                colour: colourSelector.value
            })
            localStorage.setItem('classes', JSON.stringify(classes));
            loadTimetable();
            editScreen.remove();
            openClassViewer(clickedTime);
        }
    })
    editScreen.appendChild(saveClassButton);

    // Add a delete button.
    const deleteClassButton = document.createElement('button');
    deleteClassButton.innerText = "Delete";
    deleteClassButton.addEventListener('click', () => {
        editScreen.remove();
        closeClassViewer();
        loadTimetable();
    })
    editScreen.appendChild(deleteClassButton);
}

function closeClassViewer() {
    classViewer.style.display = 'none';
}

function deleteClass(classObject) {
    classes = classes.filter(e => e !== classObject);
    localStorage.setItem('classes', JSON.stringify(classes));
}

function openSettingsMenu() {
    settingsMenu.style.display = 'block';
}

function closeSettingsMenu() {
    settingsMenu.style.display = 'none';
}

function saveSettings() {
    let startDate = document.getElementById('startDateInput').value.split('/');
    let endDate = document.getElementById('endDateInput').value.split('/');
    let timeRange = document.getElementById('timeRangeInput').value.split("-");

    settings.startDate = Number(startDate[0]);
    settings.startMonth = Number(startDate[1]);
    settings.endDate = Number(endDate[0]);
    settings.endMonth = Number(endDate[1]);
    settings.startTime = Number(timeRange[0]);
    settings.endTime = Number(timeRange[1]);

    localStorage.setItem('settings', JSON.stringify(settings));
    closeSettingsMenu();
    initialise();
    loadCalendar();
    loadTimetable();
}

function openUpNext() {
    if (document.getElementById('upNextContent')) {
        document.getElementById('upNextContent').remove();
        return
    }
    const upNextTab = document.getElementById('upNextTab');
    
    const upNextContent = document.createElement('div');
    upNextContent.id = "upNextContent"

    const title = document.createElement('h2');
    title.innerText = "Up Next:"
    upNextContent.appendChild(title);
    
    events.sort((e1, e2) => { // Sort the dates in time ascending order.
        const d1 = Date.parse(e1.date);
        const d2 = Date.parse(e2.date);
         if (d1 == d2) {
            return (Number(e1.time) < Number(e2.time)) ? -1 : 1;
         } else {
            return (d1 < d2) ? -1 : 1;
         }
    })

    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const date = currentDate.getDate()
    const hour = currentDate.getHours()

    for (let e of events) {
        // If the date is in the past, skip it.
        if (Date.parse(e.date) < Date.parse(new Date()) || e.date == new Date().toDateString() && e.time < hour) continue

        // Create the event element.
        const event = document.createElement('div');
        event.classList.add('event');
        event.style.backgroundColor = colours[e.colour];

        // Add the event's title.
        const eventTitle = document.createElement('h3');
        eventTitle.innerText = e.date + " - " + (e.time ? e.title + " @ " + to12Time(e.time) : e.title);
        eventTitle.style.width = "100%"
        event.appendChild(eventTitle);

        // If the event has a description, add it.
        if (e.description) {
            const eventDescription = document.createElement('p');
            eventDescription.innerText = e.description;
            event.appendChild(eventDescription);
        }

        // Add the event to the up next tab
        upNextContent.appendChild(event)
    }

    upNextTab.appendChild(upNextContent)
}

function openWeekViewer() {
    const week = weekObjects[clickedWeek];

    const colourSelector = document.createElement('select');
    if (!document.getElementById('weekColourSelector')) {
        colourSelector.id = "weekColourSelector";
        for (let colour in colours) {
            const option = document.createElement('option');
            option.value = colour;
            option.innerText = capitalise(colour);
            colourSelector.appendChild(option);
        }
        const option = document.createElement('option');
        option.value = "none";
        option.innerText = "None";
        colourSelector.appendChild(option);

        weekViewer.appendChild(colourSelector);
    } else {
        colourSelector.remove();
    }
    const nameInput = document.getElementById('weekNameInput');

    colourSelector.value = week.colour;
    nameInput.value = week.name;

    const saveButton = document.createElement('button');
    if (!document.getElementById('saveWeekButton')) {
        saveButton.id = 'saveWeekButton';
        saveButton.innerText = "Save"
        saveButton.addEventListener('click', () => {
            weekObjects[clickedWeek] = {
                name: nameInput.value,
                colour: colourSelector.value,
            }
            localStorage.setItem('weeks', JSON.stringify(weekObjects))
            closeWeekViewer();
            loadCalendar();
        })
        weekViewer.appendChild(saveButton);
    } else {
        saveButton.remove();
    }

    weekViewer.style.display = 'block';
}

function closeWeekViewer() {
    weekViewer.style.display = 'none';
}

function clearWeeks() {
    weeks = []
    for (let week in defaultWeekNames()) {
        weeks.push({"name": "", "colour": "none"})
    }
    localStorage.setItem('weeks', JSON.stringify(weeks))
}

function loadDefaultWeeks() {
    localStorage.setItem('weeks', JSON.stringify(defaultWeekNames()))
}