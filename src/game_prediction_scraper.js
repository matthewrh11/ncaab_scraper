const fs = require('fs')
const rp = require('request-promise');
const csv = require('csv-parser')
const url = 'https://raw.githubusercontent.com/lbenz730/NCAA_Hoops/master/3.0_Files/Predictions/predictions.csv';

function getDateString() {
    let yourDate = new Date();

    const tzOffset = yourDate.getTimezoneOffset();
    yourDate = new Date(yourDate.getTime() - (tzOffset * 60 * 1000));

    return yourDate.toISOString().split('T')[0];
}

function generateGameData() {
    const results = []

    rp(url).then((csv) => {
        fs.writeFileSync("./data/scraped_data.csv", csv);
    })
        .catch((err) => {
            console.error(err);
        });

    fs.createReadStream('./data/scraped_data.csv')
        .pipe(csv())
        .on('data', (data) => {
            if (getDateString() === data.date && !results.find((result) => result.opponent === data.team)) {
                results.push(data)
            }
        })
        .on('end', () => {
            fs.writeFileSync("./data/game_data.json", JSON.stringify(results));
        });
};

module.exports = { generateGameData };