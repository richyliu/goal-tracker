/* global $ firebase */


// global variables
let COLORS;
let habits;
let ref;




/**
 * Adds or subtracts days from a Date
 * @param  {Number} days Number of days to add or subtract
 * @return {Date}      Resulting date
 */
Date.prototype.addDays = function(days) {
    let d = new Date(this.valueOf());
    d.setDate(d.getDate() + days);
    return d;
};


/**
 * Gets the difference between 2 date
 * @param  {Date} date Subtracted from original date
 * @return {Number}      Number of days in between, as an integer
 */
Date.prototype.subtract = function(date) {
    return Math.round(Math.abs((this.getTime() - date.getTime())/86400000));
};




/**
 * Refresh habits based on new habits in global array
 */
function refreshHabits() {
    $('#out').html('');
    
    for (let key of Object.keys(habits)) {
        let val = habits[key];
        $('#out').append(`
            <div class="habit-wrapper" data-key="${key}">
                <div class="habit-name">${val.name}</div>
                <div class="history-time"></div>
                <div class="history-bar">
                    <div class="history-back"><i class="far fa-angle-left fa-2x"></i></div>
                    <div class="history-wrapper" id="${key}"></div>
                    <div class="history-forward"><i class="far fa-angle-right fa-2x"></i></div>
                </div>
                <div class="history-selector">
                    <div class="history-selector-arrow"><i class="fas fa-caret-up" data-fa-transform="grow-25"></i></div>
                    <div class="history-selector-option-wrapper">
                        <div class="history-selector-option yes" data-option="0">
                            <i class="fas fa-check fa-2x"></i>
                        </div>
                        <div class="history-selector-option no" data-option="1">
                            <i class="fas fa-times fa-2x"></i>
                        </div>
                        <div class="history-selector-option delete" data-option="-1">
                            <i class="fas fa-caret-square-left fa-2x"></i>
                        </div>
                        <div class="history-selector-option skip" data-option="2">
                            <i class="fas fa-arrow-circle-right fa-2x"></i>
                        </div>
                    </div>
                </div>
            </div>
        `);
        
        updateDisplayWeek(key, 1);
    }


    // shift the history forward or backwards by one week
    $('.history-back,.history-forward').unbind().click(e => {
        let historyWrapper = $(e.currentTarget).siblings('.history-wrapper');
        let currentNumber = historyWrapper.data('number');
        
        if ($(e.currentTarget).hasClass('history-back'))
            updateDisplayWeek(historyWrapper.attr('id'), currentNumber + 1);
        else
            updateDisplayWeek(historyWrapper.attr('id'), currentNumber - 1);
        
        // close selector
        $(e.currentTarget).parents('.habit-wrapper').find('.history-selector').hide();
    });
    
    
    // change item when user clicks on option button
    $('.history-selector-option').unbind().click(e => {
        let target = $(e.currentTarget);
        let habitWrapper = target.parents('.habit-wrapper');
        let key = habitWrapper.data('key');
        let marginLeft = habitWrapper.find('.history-selector-arrow').css('margin-left');
        let numBlock = (parseInt(marginLeft.slice(0,marginLeft.length-2)) - 34) / 34;
        let number = habitWrapper.find(`.history-wrapper .history-block`).eq(numBlock).data('index');
        
        // ensure in bounds
        if (number >= 0 && number < habits[key].history.length) {
            habits[key].history[number] = target.data('option');
            
            let historyWrapper = habitWrapper.find('.history-wrapper');
            updateDisplayWeek(historyWrapper.attr('id'), historyWrapper.data('number'));
            // auto upload habits
            uploadHabits();
        }
    });
}



/**
 * Update the displayed week for the given date and key
 * @param  {String} key        Key of the habit to be updated
 * @param  {Number} weekNumber What week to display (1 for most recent week)
 */
function updateDisplayWeek(key, weekNumber) {
    let habit = habits[key];
    
    let his = habit.history;
    let end = habit.start.addDays(his.length - 1);
    let lastSunday = his.length - end.getDay() - 1;
    let displayWeek = [];
    
    let beginSlice = lastSunday - 7*(weekNumber-1);
    let endSlice = beginSlice + 7;
    
    if ((beginSlice < 0 && endSlice <= 0) || (beginSlice > his.length-1 && endSlice > his.length-1)) {
        // harmless warning; weekNumber out of bounds, exiting function
        console.warn(`Week number ${weekNumber} out of bounds for key ${key}`);
        return;
    }
    
    if (beginSlice < 0) {
        displayWeek = his.slice(0, endSlice);
        // pad arrays with blanks
        displayWeek.unshift(...Array(-beginSlice).fill(-1));
    } else if (endSlice > his.length-1) {
        displayWeek = his.slice(beginSlice);
        // pad arrays with blanks
        displayWeek.push(...Array(7 - his.length + lastSunday).fill(-1));
    } else {
        displayWeek = his.slice(beginSlice, endSlice);
    }
    
    
    // add history blocks
    $(`#${key}`).data('number', weekNumber).html(
        displayWeek.map((value, index) => `<span class="history-block ${COLORS[value]}" data-index="${index+beginSlice}"></span>`).join('')
    );
    
    // update date for the week
    $(`#${key}`).parents('.habit-wrapper').find('.history-time').html(`
        ${habit.start.addDays(beginSlice).toISOString().slice(0,10)} - ${habit.start.addDays(endSlice-1).toISOString().slice(0,10)}
    `);
    
    
    // rebind when display week is updated
    // move arrow when user clicks on a day
    $('.history-block').unbind().click(e => {
        let index = $(e.target).prevAll().length;
        let habitWrapper = $(e.target).parents('.habit-wrapper');
        let arrow = habitWrapper.find('.history-selector-arrow');
        let historySelector = habitWrapper.find('.history-selector');
        let newMargin = (34 + 34*index)+ 'px';
        
        if (arrow.css('margin-left') == newMargin) {
            // second click
            historySelector.toggle();
        } else {
            if (historySelector.css('display') == 'none') {
                // show if hidden;
                historySelector.show();
            }
            arrow.css('margin-left', newMargin);
        }
    });
}


/**
 * Download habits from firebase
 */
function downloadHabits() {
    ref.once('value').then(snapshot => {
        let newHabits = snapshot.val();
        console.log(newHabits);
        
        habits = $.extend(true, {}, newHabits);
        
        // serialize dates
        for (let key of Object.keys(habits)) {
            // create Date with correct timezone offset
            habits[key].start = new Date(newHabits[key].start);
            
            // number of days to add
            let numDays = new Date().subtract(habits[key].start) - habits[key].history.length;
            if (numDays > 0)
                habits[key].history.push(...Array(numDays).fill(-1));
        }
        console.log(habits);
        
        refreshHabits();
        
        // move selecting pointer to current day
        $('.history-selector-arrow').css('margin-left', (34 + 34*new Date().getDay())+ 'px');
    });
}



/**
 * Upload habits to firebase
 */
function uploadHabits() {
    console.log('upload');
    // serialize dates
    let newHabits = $.extend(true, {}, habits);
    for (let key of Object.keys(newHabits)) {
        newHabits[key].start = habits[key].start.getTime();
    }
    
    // sync with firebase
    ref.set(newHabits);
}



/**
 * Ran first
 */
function main() {
    COLORS = {
        '-1': 'white',
        0: 'green',
        1: 'red',
        2: 'gray',
        3: 'blue'
    };
    
    
    // init Firebase
    firebase.initializeApp({
        apiKey: "AIzaSyD16sxuBw-TuNRZaPbXzSH7-iA_hXWts-g",
        authDomain: "main-fe047.firebaseapp.com",
        databaseURL: "https://main-fe047.firebaseio.com",
        projectId: "main-fe047",
        storageBucket: "main-fe047.appspot.com",
        messagingSenderId: "900205917314"
    });
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            downloadHabits();
        } else {
            firebase.auth().signInWithEmailAndPassword('a@a.com', prompt('Password')).then(downloadHabits).catch(e => console.error(e));
        }
    });
    

    ref = firebase.database().ref('habits');


    // bind refresh button
    $('#refresh').click(uploadHabits);
    
    // bind download button;
    $('#download').click(downloadHabits);
    
    // bind add button
    $('#add').click(() => {
        let name = prompt('Name of habit to be tracked');
        
        if (name && name.length > 0) {
            ref.push({
                name: name,
                history: [-1],
                start: new Date().setHours(0,0,0,0) // discard time part
            });
            
            downloadHabits();
            refreshHabits();
        }
    });
    
    // bind sign out button;
    $('#signout').click(() => {
        firebase.auth().signOut();
        window.reload();
    });
}


main();