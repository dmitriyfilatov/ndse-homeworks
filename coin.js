#! /usr/bin/env node
const term = require('terminal-kit')
const t = term.terminal
const { EventEmitter } = require('events')
const source = new EventEmitter()

const path = require('path')
const filename = 'stat.json'
const file = path.join(__dirname, filename)
const fs = require('fs')

const items = [
    'Obverse 🦅',
    'Reverse 🥇',
    'I want to see statistics 📊',
    'Forget all tries 🗑️',
    'Stop wasting your life 🤪'
]

const sides = ['Obverse 🦅', 'Reverse 🥇']
const guess = { 'no': 0, 'yes': 1 }

t.clear()
t.cyan('🎊 Try to guess the side of the coin 🎊\n')
source.on('message', response => {
    let side = (Math.random() >= 0.5) * 1
    const item = response.selectedIndex
    if ([0, 1].includes(item)) {
        if (side != item) {
            writeStat(guess.no)
            t.clear().eraseLineAfter.red(`You did't guessed the side: ${sides[side]}\n`)

        } else {
            writeStat(guess.yes)
            t.clear().eraseLineAfter.green(`You guessed the side: ${sides[side]}\n`)
        }
        selectSide()
    }

    if (item === 2) {
        fs.readFile(filename, "utf8",
            function (error, data) {
                if(data) {
                    let s = JSON.parse(data)
                    t.clear().eraseLineAfter
                        .white(`------------------------\n`)
                        .blue( `Tries count ✨: ${s.tries}\n`)
                        .green(`Guessed     ⭐: ${s.tries - (s.tries - s.guess)}\n`)
                        .red(  `Not guessed 🔥: ${s.tries - s.guess}\n`)
                        .white(`Luck        🍀: ${(s.guess / (s.tries / 100)).toFixed(2)}%\n`)
                        .white(`------------------------\n`)
                    selectSide()
                } else {
                    t.clear().eraseLineAfter.cyan(`You don't have statistics yet ⛔\n`)
                    selectSide()
                }
            })
    }

    if (item === 3) {
        t.singleColumnMenu(['NOOOOOOOOO 🙅‍', 'YEEEES 👌'], function (error, response) {
            let erase = response.selectedIndex
            if (erase) {
                fs.unlink(file, () => {})
                t.clear().eraseLineAfter.cyan(`Your statistics was erased 🗑️\n`)
            } else {
                t.clear().cyan('🎊 Try to guess the side of the coin 🎊\n')
            }
            selectSide()
        })
    }

    if (item === 4) {
        t.clear()
        t('\n').eraseLineAfter.green("Bye 👋\n")
        process.exit()
    }
})

selectSide()
function selectSide() {
    t.singleColumnMenu(items, function (error, response) {
        source.emit('message', response)
    })
}

function writeStat(result) {
    fs.readFile(file, 'utf8',
        function (error, data) {
            if(!data) {
                fs.writeFile(file, JSON.stringify({ 'tries': 1, 'guess': result }), () => {})
            } else {
                let stat = JSON.parse(data)
                stat.tries++
                stat.guess += result
                fs.writeFile(file, JSON.stringify(stat), () => {})
            }
        })
}