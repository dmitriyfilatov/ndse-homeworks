#! /usr/bin/env node
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const http = require('http')
const querystring = require('querystring')
const { EventEmitter } = require('events')
const source = new EventEmitter()
const config = require('./config')
const argv = yargs(hideBin(process.argv))
    .usage('Usage: weather [options]')
    .example('weather -c (--city) Moscow', 'Show city weather forecast')
    .example('weather -c (--city) "New York"', 'Show city weather forecast')
    .alias('c', 'city').describe('c', 'City')
    .help('h')
    .alias('h', 'help')
    .argv

const params = { access_key: config.weatherstackApiKey(), query: argv.city }
const apiUrl = 'http://api.weatherstack.com/current?'

source.on('message', message => {
    console.log(message)
    process.exit(-1)
})

if (!argv.city) {
    showHelp()
} else {
    showCurrentWeather(apiUrl + querystring.stringify(params))
}

function showCurrentWeather(url) {
    http.get(url, (res) => {
        const statusCode = res.statusCode
        if (statusCode !== 200) {
            console.error(`Status Code: ${statusCode}`)
            return
        }
        res.setEncoding('utf8')
        let rawData = ''
        res.on('data', (chunk) => rawData += chunk)
        res.on('end', () => {
            let d = JSON.parse(rawData)
            let msg =
                `${d.location.name}/${d.location.country} ` +
                `[${d.current.temperature}℃ ${d.current.weather_descriptions[0]}]`
            source.emit('message', msg)
        })
    }).on('error', (e) => {
        source.emit('message', `Got error: ${e.message}`)
    })
}

function showHelp() {
    const msg = "You did't use [options] \r\nTry weather --help for information"
    source.emit('message', msg)
}