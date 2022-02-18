const gameData = require('./game_prediction_scraper')
const spreadScaper = require('./spread_scaper')

function makePicks() {
    gameData.generateGameData();
    spreadScaper.scrapeOdds();
}

makePicks();