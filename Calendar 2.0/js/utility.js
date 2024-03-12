
// Takes a date object and returns the day of the week as a number from 0-6 where 0 represents monday and 6 respresents sunday.
function dayOfTheWeek(date) {
    return date.getDay() ? date.getDay() - 1 : 6;
}

// Takes the number representation of the day of the week and returns its name.
function dayOfTheWeek_Name(d) {
    let names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return names[d];
}

// Generates an array of week names of the form "Week n"
function defaultWeekNames() {
    
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

    const startMonday = new Date(year, settings.startMonth-1, startDate.getDate()-dayOfTheWeek(startDate));
    const endMonday = new Date(endYear, settings.endMonth-1, endDate.getDate()-dayOfTheWeek(endDate));

    weekCount = (Date.parse(endMonday) - Date.parse(startMonday))/(1000 * 60 * 60 * 24 * 7)
    weekCount = Math.floor(weekCount)
    let w = [];
    for (let i = 0; i < weekCount+1; i++) {
        w.push({
            name: "Week " + i,
            colour: "none",
        })
    }
    return w;
}

// Finds all elements of an array which meet a given condition, returning results in an array.
function findAll(arr, condition) {
    let results = [];
    for (let i = 0; i < arr.length; i++) {
        if (condition(arr[i])) results.push(arr[i]);
    }
    return results.length ? results : null;
}

// Returns the input string with the first character capitalised
function capitalise(str) {
    let firstLetter = str[0].toUpperCase()
    let rest = str.slice(1);
    return firstLetter + rest;
}

// Takes a number from 1-24 and returns the corresponding am/pm time (i.e: 14 becomes 2pm)
function to12Time(t) {
    const time = Number(t)
    if (!Number.isNaN(time)) {
        let suffix = "am";
        let hour = time - (time % 1)
        let minutes = Math.floor(60*(time % 1));
        if (hour >= 12) suffix = "pm";
        hour = hour > 12 ? hour-12 : hour;
        if (minutes) {
            return hour.toString() + ":" + minutes + suffix;
        } else {
            return hour.toString() + suffix;
        }
    }
}