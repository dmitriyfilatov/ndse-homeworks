#! /usr/bin/env node
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const { EventEmitter } = require('events')
const source = new EventEmitter()

const argv = yargs(hideBin(process.argv))
    .usage('Usage: date <command> [options]')
    .command('current', 'Show current date')
    .example('date current', 'Show current date')
    .example('date current -y (--year)', 'Show current year')
    .command('add', 'Show future ISO date')
    .example('date add -y (--year) 5', 'Show date in five years')
    .example('date add -y 5 -m 10 -d 15', 'Show date after five years 10 month and 15 days')
    .command('sub', 'Show past ISO date')
    .alias('y', 'year').describe('y', 'Year')
    .alias('m', 'month').describe('y', 'Month')
    .alias('d', 'date').describe('y', 'Date')
    .help('h')
    .alias('h', 'help')
    .argv

const command = argv._[0]
const year = argv.year
const month = argv.month
const date = argv.date

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

source.on('message', message => {
    console.log(message)
})

if (!['current', 'add', 'sub'].includes(command)) {
    showHelp()
}

switch (command) {
    case 'add': showFutureDate(year, month, date); break
    case 'sub': showPastDate(year, month, date); break
    case 'current': showCurrentDate(year, month, date); break
    default: showHelp()
}

function showCurrentDate(year, month, date) {
    const currentDate = new Date()

    if (!year && !month && !date) source.emit('message', currentDate.toISOString())
    if (year) source.emit('message', `${currentDate.getFullYear()} year`)
    if (month) source.emit('message', monthNames[currentDate.getMonth()])
    if (date) source.emit('message', currentDate.getDate().toString())

}

function showPastDate(year, month, date) {
    const d = new Date()

    const subYear = d.getFullYear() - parseDateOption(year)
    const subMonth = d.getMonth() - parseDateOption(month)
    const subDate = d.getDate() - parseDateOption(date)

    source.emit('message', makeDisplacedDate(subYear, subMonth, subDate, d))
}

function showFutureDate() {
    const d = new Date()

    const addYear = d.getFullYear() + parseDateOption(year)
    const addMonth = d.getMonth() + parseDateOption(month)
    const addDate = d.getDate() + parseDateOption(date)

    source.emit('message', makeDisplacedDate(addYear, addMonth, addDate, d))
}

function makeDisplacedDate(year, month, date, d) {
    return new Date(year, month, date, d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()).toISOString()
}

function parseDateOption(option) {
    return option === parseInt(option, 10) ? option : 0
}

function showHelp() {
    const msg = `You did't use <command>

Try date --help for information
    `
    source.emit('message', msg)
    process.exit(-1)
}