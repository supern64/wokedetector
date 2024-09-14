import SteamID from "steamid";
import * as Resolver from "steamid-resolver";
import { parse } from "csv-parse/sync";

const STEAM_API_URL = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=KEY&steamid=STEAMID"



enum WokeLevel {
    WOKE = "-1",
    SLIGHTLY_WOKE = "0",
    NOT_WOKE = "1"
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, fetch, platform }) {
    const GAMES = parse(await (await fetch("/data.csv")).text(), {
        columns: true,
        skip_empty_lines: true,
        objname: "appid"
    });

    // rejection
	if (!params.id) {
        return {found: false}
    }

    // find REAL steamid
    const url_match = params.id.match(/[0-9]{17}/)
    let sid;
    try {
        sid = new SteamID(url_match ? url_match[0] : params.id)
    } catch (e) {
        try {
            sid = new SteamID(await Resolver.customUrlToSteamID64(params.id))
        } catch (e) {
            return {found: false}
        }
    }
    
    // found id, time for basic player info (if the player even exists)
    const sid64 = sid.getSteamID64();
    let playerInfo;
    try {
        playerInfo = await Resolver.steamID64ToFullInfo(sid64);
    } catch (e) {
        return {found: false}
    }

    // and now, time for their games
    const url = STEAM_API_URL.replace("KEY", platform!.env.STEAM_API_KEY).replace("STEAMID", sid64);
    const res = await (await fetch(url)).json();
    
    if (!res.response.games) {
        return {
            found: true,
            info: {
                name: playerInfo.steamID[0],
                avatar: playerInfo.avatarFull[0]
            },
            games: null
        }
    }

    const gameList = [];
    let wokeCount = 0, slightlyWokeCount = 0, notWokeCount = 0, ignoredGames = 0;
    for (const game of res.response.games) {
        if (!GAMES[game.appid]) {
            ignoredGames += 1;
            continue;
        }
        const gameInfo = GAMES[game.appid]
        switch (gameInfo.woke) {
            case WokeLevel.WOKE:
                wokeCount += 1;
                break;
            case WokeLevel.SLIGHTLY_WOKE:
                slightlyWokeCount += 1;
                break;
            case WokeLevel.NOT_WOKE:
                notWokeCount += 1;
                break;
        }
        gameList.push(gameInfo)
    }
    return {
        found: true,
        info: {
            name: playerInfo.steamID[0],
            avatar: playerInfo.avatarFull[0]
        },
        games: {
            count: {
                all: res.response.games.length,
                counted: gameList.length,
                woke: wokeCount,
                slightly_woke: slightlyWokeCount,
                not_woke: notWokeCount
            },
            list: gameList
        }
    }
    

}