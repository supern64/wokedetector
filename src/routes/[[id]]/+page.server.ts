import SteamID from "steamid";
import * as Resolver from "steamid-resolver";
import { parse } from "csv-parse/sync";
import { STEAM_API_KEY } from "$env/static/private";
import type { GameData } from "$lib";

const STEAM_API_URL = "http://api.steampowered.com/"

enum WokeLevel {
    WOKE = "-1",
    SLIGHTLY_WOKE = "0",
    NOT_WOKE = "1"
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, fetch }) {
    const lastUpdate = await (await fetch("/last_update.txt")).text();

    // rejection
	if (!params.id) {
        return {found: false, error: false, lastUpdate}
    }

    // find REAL steamid
    const id_match = params.id.match(/[0-9]{17}/) // any string of 17 numbers (in /profile/ urls and by themselves)
    const vanity_url_match = params.id.match(/steamcommunity.com\/id\/([0-z]+)\/?/) // from vanity urls

    let sid;
    try {
        // Steam64 ID from URL / Other types of SteamID
        sid = new SteamID(id_match ? id_match[0] : params.id)
    } catch (e) { 
        let attemptUser: string;
        if (vanity_url_match) { // "steamcommunity.com/id/SuperN64"
            attemptUser = vanity_url_match[1]
        } else { // "SuperN64"
            attemptUser = params.id
        }
        const url = (STEAM_API_URL + "ISteamUser/ResolveVanityURL/v1/?vanityurl=USER&key=KEY")
            .replace("USER", attemptUser)
            .replace("KEY", STEAM_API_KEY)
        

        const apiVanityResponse = await fetch(url);
        if (apiVanityResponse.ok) { // god i love ratelimits
            const json = await apiVanityResponse.json();
            if (json.response.success != 1) return {found: false, error: false, lastUpdate}
            sid = new SteamID(json.response.steamid) // guaranteed valid id
        } else {
            try {
                sid = new SteamID(await Resolver.customUrlToSteamID64(attemptUser))
            } catch (e: any) {
                if (e[0] === "The specified profile could not be found.") return {found: false, error: false, lastUpdate}
                return {found: false, error: true, lastUpdate}
            }
        }
        
         
    }
    
    // found id, time for basic player info (if the player even exists)
    const sid64 = sid.getSteamID64();
    const playerInfoURL = (STEAM_API_URL + "ISteamUser/GetPlayerSummaries/v2/?key=KEY&steamids=STEAMID")
        .replace("KEY", STEAM_API_KEY)
        .replace("STEAMID", sid64)
    const playerInfos = await (await fetch(playerInfoURL)).json();

    if (playerInfos.response.players.length === 0) return {found: false, lastUpdate} // player not found :(
    const playerInfo = playerInfos.response.players[0]

    // and now, time for their games
    const gameListURL = (STEAM_API_URL + "IPlayerService/GetOwnedGames/v1/?key=KEY&steamid=STEAMID")
        .replace("KEY", STEAM_API_KEY)
        .replace("STEAMID", sid64);
    const res = await (await fetch(gameListURL)).json();
    
    if (!res.response.games) {
        return {
            found: true,
            error: false,
            info: {
                name: playerInfo.personaname,
                avatar: playerInfo.avatar
            },
            games: null,
            lastUpdate
        }
    }

    const GAMES = parse(await (await fetch("/data.csv")).text(), {
        columns: true,
        skip_empty_lines: true,
        objname: "appid"
    }) as {[key: string]: GameData};

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
        error: false,
        info: {
            name: playerInfo.personaname,
            avatar: playerInfo.avatar
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
        },
        lastUpdate
    }
    

}