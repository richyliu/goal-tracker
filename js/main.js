/* global $ firebase */

let habits = {
    'key1': {
        name: 'drink water',
        history: [1, 0, 1, 0, 0, 1, 1, 1]
    },
    'key2': {
        name: 'eat fruit',
        history: [1, 1, 0, 1, 1, 1, 1, 1]
    }
}

for (let val of Object.values(habits)) {
    $('#out').append(`
        <div class="habit-wrapper">
            <div class="habit-name">
                ${val.name}
            </div>
            <div class="history-wrapper">
                ${val.history.map(value => `
                    <span class="history-block ${value ? 'green' : 'red'}"></span>
                `).join('')}
            </div>
        </div>
    `);
}