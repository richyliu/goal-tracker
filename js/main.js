/* global $ firebase */


Date.prototype.addDays = function(days) {
    let d = new Date(this.valueOf());
    d.setDate(d.getDate() + days);
    return d;
};



let COLORS = {
    0: 'green',
    1: 'red',
    2: 'white'
};



let habits = {
    'key1': {
        name: 'Drink water',
        history: [1, 0, 1, 0, 0, 1, 1, 1],
        start: new Date('1/18/2018')
    },
    'key2': {
        name: 'Eat fruit',
        history: [1, 1, 0, 1, 1, 1, 1, 1],
        start: new Date('1/18/2018')
    }
};

for (let key of Object.keys(habits)) {
    let val = habits[key];
    $('#out').append(`
        <div class="habit-wrapper">
            <div class="habit-name">
                ${val.name}
            </div>
            <div class="history-bar">
                <div class="history-back"><i class="far fa-angle-left"></i></div>
                <div class="history-wrapper" id="${key}"></div>
                <div class="history-forward"><i class="far fa-angle-right"></i></div>
            </div>
        </div>
    `);
    
    updateDisplayWeek(key, 1);
}



// shift the history forward or backwards by one week
$('.history-back,.history-forward').click(e => {
    let historyWrapper = $(e.currentTarget).siblings('.history-wrapper');
    let currentNumber = historyWrapper.data('number');
    
    if ($(e.currentTarget).hasClass('history-back'))
        updateDisplayWeek(historyWrapper.attr('id'), currentNumber + 1);
    else
        updateDisplayWeek(historyWrapper.attr('id'), currentNumber - 1);
});


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
        displayWeek.map(value => `<span class="history-block ${COLORS[value]}"></span>`).join('')
    );
}
