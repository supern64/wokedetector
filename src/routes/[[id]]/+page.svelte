<script lang="ts">
    import he from 'he';
    import dayjs from 'dayjs';
    import relativeTime from 'dayjs/plugin/relativeTime';

    dayjs.extend(relativeTime);
    const { decode } = he;
    /** @type {import('./$types').PageData} */
	export let data;
    import { page } from "$app/stores";
    import GameTable from '$lib/gameTable.svelte';
    import Layout from '../+layout.svelte';
    let steamid = $page.params.id ? $page.params.id : ""

    $: games = data.games;
    let wokePercentage = 0, slightlyWokePercentage = 0;
    $: if (games) {
        // parse info
        wokePercentage = games.count.woke/games.count.counted*100;
        slightlyWokePercentage = games.count.slightly_woke/games.count.counted*100;
    }

    /** @type {HTMLAnchorElement} */
    let button: HTMLAnchorElement;
</script>
<svelte:head>
    {#if data.found && games}
    <!-- Primary Meta Tags -->
    <title>how WOKE are {data.info.name}'s games???</title>
    <meta name="title" content="how WOKE are {data.info.name}'s games???" />
    <meta name="description" content="find out how woke {data.info.name}'s steam library is today!!" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://wokedetector.cirnoslab.me/{steamid}" />
    <meta property="og:title" content="how WOKE are {data.info.name}'s games???" />
    <meta property="og:description" content="find out how woke {data.info.name}'s steam library is today!!" />
    <meta property="og:image" content="{data.info.avatar}" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://wokedetector.cirnoslab.me/{steamid}" />
    <meta property="twitter:title" content="how WOKE are {data.info.name}'s games???" />
    <meta property="twitter:description" content="find out how woke {data.info.name}'s steam library is today!!" />
    <meta property="twitter:image" content="{data.info.avatar}" />
    {:else}
    <title>how WOKE are your games???</title>
    <meta name="title" content="how WOKE are your games???" />
    <meta name="description" content="find out how woke your steam library is today with this simple tool!!" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://wokedetector.cirnoslab.me" />
    <meta property="og:title" content="how WOKE are your games???" />
    <meta property="og:description" content="find out how woke your steam library is today with this simple tool!!" />
    <meta property="og:image" content="https://wokedetector.cirnoslab.me/favicon.png" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://wokedetector.cirnoslab.me" />
    <meta property="twitter:title" content="how WOKE are your games???" />
    <meta property="twitter:description" content="find out how woke your steam library is today with this simple tool!!" />
    <meta property="twitter:image" content="https://wokedetector.cirnoslab.me/favicon.png" />
    {/if}
</svelte:head>
<div class="pad-l">
    <center>
        <h1>how WOKE are your games???</h1>
        find out today with our special WOKE DETECTOR!!!
        <div class="center-box">
            <form>
                <label for="steamid">enter ur steamid/profile url here:</label>
                <input type="text" class="textbox" id="steamid" bind:value={steamid} on:keypress={(k) => k.key === "Enter" && button.click()}>
                <a href={"/" + encodeURIComponent(steamid)} bind:this={button} id="reveal" class="btn">REVEAL</a>
            </form>
            (if you're not sure check <a href="https://steamdb.info/calculator/" target="_blank">SteamDB</a> and get the "SteamID" from there)
        </div>
        
        <div>
            {#if $page.params.id}
                {#if data.found && data.info}
                    <div>
                        <img src={data.info.avatar} alt={data.info.name + "'s Steam Avatar"} class="avatar">
                        <span style="font-weight: bold; font-size: 1.7rem; margin-left: 0.5rem; vertical-align: middle;">{decode(data.info.name)}'s Profile</span>
                    </div>
                    {#if games}
                        {#if games.count.counted > 0}
                            <h2>Result: 
                                {#if wokePercentage > 65 || wokePercentage + slightlyWokePercentage > 75}
                                    <span style="color: #ff0000">WOKE!!!!!</span>
                                {:else if wokePercentage > 40 || wokePercentage + slightlyWokePercentage > 50}
                                    <span style="color: #e0c600">SLIGHTLY WOKE...</span>
                                {:else}
                                    <span style="color: #00ff00">NOT WOKE!!</span>
                                {/if}<br>
                            </h2>
                            <div class="bar">
                                <div class="woke tooltip" class:left-edge={wokePercentage > 0} style:width="{wokePercentage}%">
                                    <div class="target">Woke: {wokePercentage.toFixed(2)}%</div>
                                </div>
                                <div class="slightly tooltip" class:left-edge={wokePercentage === 0} class:right-edge={wokePercentage + slightlyWokePercentage >= 100} style:width="{slightlyWokePercentage}%">
                                    <div class="target">Slightly: {slightlyWokePercentage.toFixed(2)}%</div>
                                </div>
                                <div class="notwoke tooltip right-edge" class:left-edge={wokePercentage + slightlyWokePercentage === 0} style:width="{100 - (wokePercentage + slightlyWokePercentage)}%">
                                    <div class="target">Not Woke: {(100 - (wokePercentage + slightlyWokePercentage)).toFixed(2)}%</div>
                                </div>
                            </div>
                        <footer>(tap/hover to view percentage)</footer>
                        {:else}
                            we detected games in your library, but none of them could be counted.
                        {/if}
                    {:else}
                        sorry, we couldn't obtain this player's games. try checking privacy settings.<br>(games have to be set to public for this to work)
                    {/if}
                {:else}
                    {#if data.error}
                        vanity lookup failed. try using the Steam64 ID directly.
                    {:else}
                        player not found! check ur SteamIDs
                    {/if}
                {/if}
            {/if}
        </div>
    </center>
    {#if games}
    <div>
        <h2>Games List</h2>
        <footer style="margin-bottom: 0.5rem;">(counted {games.count.counted}/{games.count.all} games or {(games.count.counted/games.count.all*100).toFixed(2)}%)</footer>
        <GameTable paginate={false} games={games.list} />
    </div>
    {/if}
</div>

<footer>
    list last updated on {dayjs(data.lastUpdate).toDate().toLocaleString()} ({dayjs(data.lastUpdate).fromNow()}), you can view the full list <a href="/full-list">here</a><br>
    *this list was compiled from the woke content detector steam group. i am <span style="color: red; font-weight: bold">NOT</span> associated with it, nor do i endorse any of the comments it makes. 
    <span style="color: black; font-weight: bold">this website was made as a joke.</span>
</footer>