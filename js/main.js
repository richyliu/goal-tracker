/* global $ firebase */

let habits = {
    'key1': {
        name: 'Drink water',
        history: [1, 0, 1, 0, 0, 1, 1, 1],
        start: new Date('1/13/2018')
    },
    'key2': {
        name: 'Eat fruit',
        history: [1, 1, 0, 1, 1, 1, 1, 1],
        start: new Date('1/13/2018')
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
                <div class="history-wrapper" id="${key}" data-number="1"></div>
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
    
    if ($(e.currentTarget).hasClass('history-back')) {
        updateDisplayWeek(historyWrapper.attr('id'), currentNumber + 1);
    } else {
        updateDisplayWeek(historyWrapper.attr('id'), currentNumber - 1);
    }
    
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
    let end = habit.start.addDays(habit.history.length - 1);
    
    if (weekNumber > 1) {
        
    } else {
        let displayedWeek = habit.slice()
    }
    
    
    
    $(`#${key}`).data('number', weekNumber).html(
        displayWeek(start, history, 1).map(value => `<span class="history-block ${value ? 'green' : 'red'}"></span>`).join('')
    );
}



Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}
