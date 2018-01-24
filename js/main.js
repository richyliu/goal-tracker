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

for (let val of Object.values(habits)) {
    addHabit(val.name, val.history, val.start, history => {
        // add new history to firebase
    });
}



/**
 * Adds a habit onscreen with the corresponding event handlers for change
 * @param {String}   name     Name of the habit to track
 * @param {Number[]} history  If the tracked item has been completed
 * @param {Date}     start    When tracking started
 * @param {Function} onchange Called when history is change
 */
function addHabit(name, history, start, onchange) {
    $('#out').append(`
        <div class="habit-wrapper">
            <div class="habit-name">
                ${name}
            </div>
            <div class="history-bar">
                <div class="history-back"><i class="far fa-angle-left"></i></div>
                <div class="history-wrapper">
                    ${history.map(value => `<span class="history-block ${value ? 'green' : 'red'}"></span>`).join('')}
                </div>
                <div class="history-forward"><i class="far fa-angle-right"></i></div>
            </div>
        </div>
    `);
}