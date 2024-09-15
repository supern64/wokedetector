import { parse } from "csv-parse/sync";

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    const lastUpdate = await (await fetch("/last_update.txt")).text();
    const games = parse(await (await fetch("/data.csv")).text(), {
        columns: true,
        skip_empty_lines: true
    });

    return {
        games,
        lastUpdate
    }

}