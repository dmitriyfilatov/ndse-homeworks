#! /usr/bin/env node
const readline = require('readline')
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const argv = yargs(hideBin(process.argv))
    .usage('Usage: number [options]')
    .example('number -m (--max) 10', 'Set max number')
    .command('add', 'Show future ISO date')
    .alias('-m', '--max').describe('m', 'Max number')
    .help('h')
    .alias('h', 'help')
    .argv

const max = parseInt(argv.max, 10) ? argv.max : 100
const randNumber = Math.floor(Math.random() * (max + 1))

let count = 0

question()

function question() {
    const msg = !count ? `Загадано число от 0 до ${max}. Попробуйте угадать: ` : 'Повторите попытку: '
    rl.question(msg, (answer) => {
        const answerNumber = parseInt(answer, 10)
        count++
        if (typeof answerNumber === 'NaN') {
            console.log('попробуйте загадать число!')
            question()
        } else if (answerNumber < randNumber) {
            console.log('больше!')
            question()
        } else if (answerNumber > randNumber) {
            console.log('меньше!')
            question()
        } else {
            console.log(`Отгадано число: ${randNumber}`)
            rl.close()
        }

    })
}

