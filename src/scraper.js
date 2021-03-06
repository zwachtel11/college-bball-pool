'use strict'
const request = require('request')
const HTTPS = require('https')
const HTTP = require('http')
const json2csv = require('json2csv')
const fs = require('fs')
const osmosis = require('osmosis')
let players = []
let teams = []
const names = [
            'Caspert',
            'Chirls	',
            'Rogers',
            'Steiger',
            'Slutsky',
            'Halpern',
            'Heiser',
            'Brodsky',
            'Saffrin',
            'Eiten',
            'Glick',
            'Green'
          ]
const playernames = [
                'Justin Jackson*',
                'Isaiah Hicks',
                'Kris Jenkins',
                'Rawle Alkins',
                'Marcus Marshall',
                'Aaron Holiday',
                'Luke Kennard',
                'Donovan Mitchell',
                'Naz Long',
                'Trevon Bluiett',
                'Steve Vasturia',
                'Edrice Adebayo',
                'Frank Mason III',
                'Jalen Brunson',
                'Jordan Matthews',
                'Isaiah Briscoe',
                'Deonte Burton',
                'Dusan Rastic',
                'Allonzo Trier',
                'T.J. Leaf',
                'VJ Beachem',
                'Derrick Walton Jr.',
                'Sindarius Thornwell',
                'Amile Jefferson',
                'Josh Hart',
                'Dillon Brooks',
                'Jonathan Motley',
                'Kelan Martin',
                'Devon Reed',
                'London Perrantes',
                'Jayson Tatum',
                'Lauri Markkanen',
                'Semi Ojeleye',
                'Isaac Hamilton',
                'Zach Collins',
                'Theo Pinson',
                'Josh Jackson',
                'De\'Aaron Fox',
                'Tyler Dorsey',
                'Dwyane Bacon',
                'Desi Rodriguez',
                'Kadeem Allen',
                'Nigel Williams-Goss',
                'Caleb Swanigan',
                'Bonzie Colson',
                'Monte Morris',
                'Marcus Foster',
                'Matt Farrell',
                'Lonzo Ball',
                'Bryce Alford',
                'Frank Johnson',
                'Jacorey Williams',
                'Jock Lindale',
                'Landen Lucas',
                'Joel Berry III',
                'Grayson Allen',
                'Jonathan Williams',
                'Mikal Bridges',
                'Ethan Happ',
                'Dylan Ennis',
                'Malik Monk',
                'Przemek Karnowski',
                'Svi Mykhailiuk',
                'Quentin Snider',
                'Donte DiVincenzo',
                'Tony Bradley',
                'Devonte\' Graham',
                'Kennedy Meeks',
                'Jevon Carter',
                'Bronson Koenig',
                'Jawun Evans',
                'Deng Adel'
]


const cleanPoints = (notSure) => {
  const notSures = notSure
  const td = Math.round(new Date().getTime() / 1000);
  teams.forEach((team) => {
    team.players.forEach((player) => {
      if (notSures.includes(player.name)){
        const stats = notSures.replace(/[^0-9]+/, '').replace('"]', '')

          if (stats.length > 34) {
            player.points.push(stats.slice(-2))
          }
          else {
            player.points.push(stats.slice(-1))
            player.name = player.name + "*"
          }
          player.date = td
      }
    })
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
      //sumUpPoints()
      exportCsv()
    })
    .error(console.log)
}

/**
const createTeams = (names) => {
  names.forEach((name) => {
      teams.push({name:name, players:[], sum:0})
  })
}
**/
const sumUpPoints = () => {
  teams.forEach((team) => {
    const sum = []
    team.players.forEach((player, i) => {
        if (i < 5) {
          sum.push(player.points.reduce((acc, val) => {
          return acc + val
          }))
        }
        player.total = player.points.reduce((acc, val) => {
          return acc + val
      })
    })
    team.sum = sum.reduce((acc, val) => {
      return acc + val
    })
  })
  teams.sort((a,b) => {
    if (a.sum < b.sum) return  -1;
    if (a.sum > b.sum) return - 1;
    return 0;
  })
}
/*
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
       count = 1;
       i++;
       teams[i].players.push({
        name: playername,
        date: ts - (24 * 3600),
        points: [0]
       })
     }
  })
}
*/



//console.log(teams)


fs.readFile('data.json', function (err, data) {
   if (err) {
       return console.error(err);
   }
   //console.log("Data: " + data.toString());
   teams = JSON.parse(data)
   //console.log(teams.toString())
   //getPoints()
   sumUpPoints()
   exportCsv()
})


//createTeams(names)
//addPlayers(playernames)
//console.log(teams[0].players)
