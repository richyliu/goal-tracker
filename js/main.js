/* global $ firebase */


Date.prototype.addDays = function(days) {
    let d = new Date(this.valueOf());
    d.setDate(d.getDate() + days);
    return d;
};



let COLORS = {
    0: 'green',
    1: 'red',
    2: 'white',
    3: 'blue'
};



let habits = {
    'key1': {
        name: 'Drink water',
        history: [1, 0, 1, 0, 0, 1, 1, 1],
        start: new Date('1/18/2018')
    },
    'key2': {
        name: 'Eat fruit',
        history: [1, 1, 0, 1, 1, 0, 1, 1],
        start: new Date('1/18/2018')
    }
};



function refreshHabits() {
    $('#out').html('');
    
    for (let key of Object.keys(habits)) {
        let val = habits[key];
        $('#out').append(`
            <div class="habit-wrapper" data-key="${key}">
                <div class="habit-name">
                    ${val.name}
                </div>
                <div class="history-bar">
                    <div class="history-back"><i class="far fa-angle-left fa-2x"></i></div>
                    <div class="history-wrapper" id="${key}"></div>
                    <div class="history-forward"><i class="far fa-angle-right fa-2x"></i></div>
                </div>
                <div class="history-selector">
                    <div class="history-selector-arrow"><i class="fas fa-caret-up" data-fa-transform="grow-25"></i></div>
                    <div class="history-selector-option-wrapper">
                        <div class="history-selector-option" data-option="0">Yes</div>
                        <div class="history-selector-option" data-option="1">No</div>
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
    });
    
    // change item when user clicks on it
    $('.history-selector-option').unbind().click(e => {
        let habitWrapper = $(e.target).parents('.habit-wrapper');
        let key = habitWrapper.data('key');
        let marginLeft = habitWrapper.find('.history-selector-arrow').css('margin-left');
        let numBlock = (parseInt(marginLeft.slice(0,marginLeft.length-2)) - 34) / 34;
        let number = habitWrapper.find(`.history-wrapper .history-block`).eq(numBlock).data('index');
        
        // ensure in bounds
        if (number < habits[key].history.length) {
            habits[key].history[number] = 3;
            
            let historyWrapper = habitWrapper.find('.history-wrapper');
            updateDisplayWeek(historyWrapper.attr('id'), historyWrapper.data('number'));
        }
    });
}



/**
 * Update the displayed week for the given date and key
 * @param  {String} key        Key of the habit to be updated
 * @param  {Number} weekNumber What week to display (1 for most recent week)
 */
function updateDisplayWeek(key, weekNumber) {
    // ensure weekNumber is greater than 1
    weekNumber = weekNumber > 1 ? weekNumber : 1;
    let habit = habits[key];
    
    let his = habit.history;
    let end = habit.start.addDays(his.length - 1);
    let lastSunday = his.length - end.getDay() - 1;
    let displayWeek = [];
    
    let beginSlice = lastSunday - 7*(weekNumber-1);
    let endSlice = beginSlice + 7;
    
    if ((beginSlice < 0 && endSlice < 0) || (beginSlice > his.length-1 && endSlice > his.length-1)) {
        // weekNumber out of bounds, exiting function
        console.error(`Week number ${weekNumber} out of bounds for key ${key}`);
        return;
    }
    
    console.log(beginSlice, endSlice);
    if (beginSlice < 0) {
        displayWeek = his.slice(0, endSlice);
        // pad arrays with blanks
        displayWeek.unshift(...Array(8 + beginSlice).fill(2));
    } else if (endSlice > his.length-1) {
        displayWeek = his.slice(beginSlice);
        // pad arrays with blanks
        displayWeek.push(...Array(7 - his.length + lastSunday).fill(2));
    } else {
        displayWeek = his.slice(beginSlice, endSlice);
    }
    
    $(`#${key}`).data('number', weekNumber).html(
        displayWeek.map((value, index) => `<span class="history-block ${COLORS[value]}" data-index="${index+beginSlice}"></span>`).join('')
    );
    
    
    // rebind when display week is updated
    // move arrow when user clicks on a day
    $('.history-block').unbind().click(e => {
        let index = $(e.target).prevAll().length;
        
        $(e.target).parents('.habit-wrapper').find('.history-selector-arrow').css('margin-left', (34 + 34*index)+ 'px');
    });
}



// init Firebase
firebase.initializeApp({
    apiKey: "AIzaSyD16sxuBw-TuNRZaPbXzSH7-iA_hXWts-g",
    authDomain: "main-fe047.firebaseapp.com",
    databaseURL: "https://main-fe047.firebaseio.com",
    projectId: "main-fe047",
    storageBucket: "main-fe047.appspot.com",
    messagingSenderId: "900205917314"
});

let ref = firebase.database().ref('habits');


refreshHabits();


// bind refresh button
$('#refresh').click(() => {
    refreshHabits();
    // sync with firebase
    ref.set(JSON.stringify(habits));
});
// bind download button;
$('#download').click(() => {
    ref.once('value').then(snapshot => {
        habits = snapshot.val();
        refreshHabits(JSON.parse(habits));
    });
});