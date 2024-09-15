const cheerio = require('cheerio');
const fs = require('fs');

const mainUrl = "https://store.steampowered.com/curator/44927664/ajaxgetfilteredrecommendations?query";

const mapping = {
    "color_not_recommended": -1,
    "color_informational": 0,
    "color_recommended": 1
};

// Discover size
fetch(mainUrl + "&count=1")
    .then(response => response.json())
    .then(data => {
        const size = data.total_count;

        console.log(`Downloading list of ${size} games`);

        // Download the full list of games
        return fetch(mainUrl + `&count=${size}`);
    })
    .then(response => response.json())
    .then(data => {
        if (data.success !== 1) {
            console.error("Failed to download list of games, exiting...");
            process.exit(1);
        }

        console.log("Parsing data for games");

        const $ = cheerio.load(data.results_html);
        const games = [];

        $('.recommendation').each((i, rec) => {
            const id = $(rec).find('a').attr('data-ds-appid');
            const name = $(rec).find('a img').attr('alt').replace(/"/g, '""');
            const banner = $(rec).find('a img').attr('src');
            const woke = mapping[$(rec).find('span').attr('class')];
            const description = $(rec).find('.recommendation_desc').text().trim().replace(/"/g, '""');

            games.push(`${id},"${name}","${banner}",${woke},"${description}"`);
        });

        // Write to CSV file
        fs.writeFileSync("static/data.csv", "appid,name,banner,woke,description\n" + games.join('\n'), 'utf-8');
        fs.writeFileSync("static/last_update.txt", (new Date()).toISOString(), 'utf-8');
        console.log("Done");
    })
    .catch(error => {
        console.error("An error occurred:", error);
    });