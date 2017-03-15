const request = require('request')
const HTTPS = require('https')
const HTTP = require('http')
const json2csv = require('json2csv')
const fs = require('fs')
const osmosis = require('osmosis')
let players = []
let teams = [{name:'Team Wachtel',
              players:[
                      {
                      name: 'Malik Monk',
                      date: (24 * 3600),
                      points: [0,12,45]
                      },
                      {
                      name: 'Malik Monk1',
                      date: (24 * 3600),
                      points: [0,12,45]
                      },
                      {
                      name: 'Malik Monk1',
                      date: (24 * 3600),
                      points: [0,12,45]
                      }
                    ],
              sum:0}]
const names = [
                'team0',
                'team1',
                'team2',
                'team3',
                'team4',
                'team5',
                'team6'
]
const playernames = [
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1',
                'player1'
]


const cleanPoints = (notSure) => {
  const notSures = notSure
  const td = Math.round(new Date().getTime() / 1000);

  players.forEach((player) => {
    if (notSures.includes(player.name)){
      const stats = notSures.replace(/[^0-9]+/, '').replace('"]', '')
      if ( player.date < (td - (24 * 3600)) ) {
        if (stats.length > 36) {
          player.points.push(stats.slice(-2))
        }
        else {
          player.points.push(stats.slice(-1))
        }
      player.date = td
    }
  }
  })
  return
  }

const exportCsv = () => {
  const fields = ['name', 'players']
  const csv = json2csv({ data: teams, fields: fields, unwindPath: 'name' })
  fs.writeFile('file.csv', csv, function(err) {
    if (err) throw err
    console.log('file saved')
  })
  fs.writeFile('data.json', JSON.stringify(teams), function(err) {
    if (err) throw err
    console.log('json saved')
  })
}


const getPoints = () => {
  osmosis
    .get('http://www.sports-reference.com/cbb/boxscores/')
    .find('//table[@class="teams"]')
    .find('//td[@class="right gamelink"]')
    .follow('@href')
    .find('//tbody')
    .find('//tr')
    .then((pts) => {
       cleanPoints(JSON.stringify(pts.text().split('\n')))
    })
    .done(() => {
      console.log(players)
      exportCsv()
    })
    .error(console.log)

    return players
}


const createTeams = (names) => {
  names.forEach((name) => {
      teams.push({name:name, players:[], sum:0})
  })
}

const sumUpPoints = () => {
  teams.forEach((team) => {
    const sum = []
    team.players.forEach((player) => {
        sum.push(player.points.reduce((acc, val) => {
        return acc + val
      }))
    })
    team.sum = sum.reduce((acc, val) => {
      return acc + val
    })
  })
}

const addPlayers = (playernames) => {
  count = 0;
  i = 0;
  playernames.forEach((playername) => {
     if (count < 6) {
       teams[i].players.push({
        name: playername,
        date: ts - (24 * 3600),
        points: [0]
       })
       count++
     }
     else {
       count = 0;
       i++;
     }
  })
}
const ts = Math.round(new Date().getTime() / 1000);

sumUpPoints()
console.log(teams)

/*
fs.readFile('data.json', function (err, data) {
   if (err) {
       return console.error(err);
   }
   console.log("Data: " + data.toString());
//   teams = data
   console.log(teams.toString())
})
*/

//createTeams(names)
//addPlayers(playernames)
//console.log(teams[0].players)
//exportCsv()
//getPoints()
