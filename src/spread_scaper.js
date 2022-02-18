const cheerio = require('cheerio');
const fs = require('fs');
const rp = require('request-promise');



function getDateURL(url) {

    let yourDate = new Date();

    const tzOffset = yourDate.getTimezoneOffset();
    yourDate = new Date(yourDate.getTime() - (tzOffset * 60 * 1000));

    year = yourDate.getFullYear();
    day = yourDate.getDate() < 10 ? "0" + yourDate.getDate() : yourDate.getDate();
    month = (yourDate.getMonth() + 1) < 10 ? "0" + (yourDate.getMonth() + 1) : yourDate.getMonth() + 1;

    return url + year + month + day;
}

function scrapeOdds() {
    const baseURL = 'https://classic.sportsbookreview.com/betting-odds/ncaa-basketball/?date=';

    URL = getDateURL(baseURL);

    const odds = [];
    const teams = [];

    rp(URL).then((HTML) => {
        let $ = cheerio.load(HTML);
        const odds_data = $('div[rel="43"] > div > b');
        const teams_data = $('.team-name > a');

        for (const odd of odds_data) {
            odds.push(($(odd).text()).trim().split(" ")[0].replace("½", ".5"));
        }
        for (const team of teams_data) {
            teams.push($(team).text().trim());
        }

        if (odds.length === teams.length) {
            let writeOutObj = {};
            for (let i = 0; i < odds.length; i++) {
                writeOutObj[teams[i]] = odds[i];
            }
            const objString = JSON.stringify(writeOutObj);
            fs.writeFileSync("../data/odds.json", objString);

        } else {
            console.error("?????")
        }
    })
        .catch((err) => {
            console.log(err);
        })


}

scrapeOdds();
