// import { parsePymk } from '@/scripts/parse'
const Nightmare = require('nightmare')
// const vo = require('vo')

function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

const nightmare = Nightmare({
  show: true,
  electronPath: require('electron-nightmare')
})

export const run = function*(creds) {
  console.log('HERE')
  console.log(nightmare)
  yield nightmare
    .goto('https://www.facebook.com/friends/requests/?fcref=jwl')
    .type('#email', creds.username)
    .type('#pass', creds.password)
    .click('#loginbutton')
    .wait(5000)
  var previousHeight = 0
  var currentHeight = 1
  while (previousHeight !== currentHeight) {
    previousHeight = currentHeight
    currentHeight = yield nightmare.evaluate(function () {
      var body = document.querySelector('body')
      return body.scrollHeight
    })
    if (currentHeight - previousHeight > 2) {
      yield nightmare.scrollTo(getRandomInt(previousHeight, currentHeight), 0)
        .wait(1000)
    } else {
      yield nightmare.scrollTo((previousHeight + 20), 0)
        .wait(1000)
    }
  }

  var html = yield nightmare.evaluate(function () {
    return document.getElementById('fbSearchResultsBox').innerHTML
  })
  yield nightmare.end()
  return html
}