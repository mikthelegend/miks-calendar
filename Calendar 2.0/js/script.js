let clickedDay = null;
let clickedTime = null;
let clickedWeek = null;
let selectedWeek = null;
let selectedObject = null;

// Global colour dictionary for special tones.
const colours = {"red": "#ff9191", "green": "#8dff85", "blue": "#99b1ff", "purple": "#cd8fff", "yellow": "#ffff7a"}
const globalAccent = "#ffd394";

// Main settings object containing all the user specific layout information.
let firstTimeLoading = false;
let settings = {};
if (localStorage.getItem('settings')) {
    settings = JSON.parse(localStorage.getItem('settings'))
} else {
    firstTimeLoading = true;
}

// Each of these objects contains a list of the relevant object type.

// Events are day specific objects with optional start times. Use case: Birthday, Work, Going Out, etc...
// They are displayed on the calendar, and also on the timetable whenever the relevant week is selected.
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

// Tasks are simple to do lists. Currently they are day of the week specific, meaning there are only 7 lists; one for each day of the week.
// They are displayed below the timetable in the planner, and tasks that are not completed in the specified day are moved to the following day automatically.
// Eventually these should also be week specific, so you can plan more than a week in advance with todo lists.
let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];

// Classes are weekly, day of the week specific objects which appear on every week at the same time. Obvious use case is uni/highschool classes.
// Eventually these should have the option to be fortnightly, but any further customisation should be done with events instead. 
let classes = localStorage.getItem('classes') ? JSON.parse(localStorage.getItem('classes')) : [];

// Weeks are objects containing info about each week. They aren't used for much, but their functionality includes colouring and renaming weeks.
let weekObjects;


// Set up all the appropriate elements and variables.
function initialise() {
    // buttons
    document.getElementById('newEventButton').addEventListener('click', createNewEvent)
    document.getElementById('closeDayViewerButton').addEventListener('click', closeDayViewer)

    document.getElementById('editClassButton').addEventListener('click', editClass)
    document.getElementById('closeClassButton').addEventListener('click', closeClassViewer)

    document.getElementById('settingsButton').addEventListener('click', openSettingsMenu)
    document.getElementById('saveSettingsButton').addEventListener('click', saveSettings)
    document.getElementById('closeSettingsButton').addEventListener('click', closeSettingsMenu)
    document.getElementById('clearWeeksButton').addEventListener('click', clearWeeks)
    document.getElementById('defaultWeeksButton').addEventListener('click', loadDefaultWeeks)

    document.getElementById('upNextTab').addEventListener('click', openUpNext)

    // settings
    document.getElementById('startDateInput').value = settings.startDate + "/" + settings.startMonth
    document.getElementById('endDateInput').value = settings.endDate + "/" + settings.endMonth
    document.getElementById('timeRangeInput').value = settings.startTime.toString() + "-" + settings.endTime;

    // other
    document.getElementById('calendar_weekdays').children[0].style.padding = "0px"; // Gear symbol padding


    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), settings.startMonth-1, settings.startDate);
    const startMonday = new Date(currentDate.getFullYear(), settings.startMonth-1, startDate.getDate()-dayOfTheWeek(startDate));
    currentWeek = (Date.parse(currentDate) - Date.parse(startMonday))/(1000 * 60 * 60 * 24 * 7)
    currentWeek = Math.floor(currentWeek)
    clickedWeek = currentWeek;

    weekObjects = localStorage.getItem('weeks') ? JSON.parse(localStorage.getItem('weeks')) : defaultWeekNames();

}

// This is the main run code.
if (!firstTimeLoading) {
    initialise()
    loadCalendar()
    loadTimetable()
} else {
    document.getElementById('saveSettingsButton').addEventListener('click', saveSettings)
    openSettingsMenu();
}