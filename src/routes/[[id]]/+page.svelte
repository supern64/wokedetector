<script lang="ts">
    import he from 'he';
    const { decode } = he;
    /** @type {import('./$types').PageData} */
	export let data;
    import { page } from "$app/stores";
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
    <title>how WOKE are {data.info.name} games???</title>
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
                <h2>Result: 
                    {#if wokePercentage > 70 || wokePercentage + slightlyWokePercentage > 80}
                    <span style="color: #ff0000">WOKE!!!!!</span>
                    {:else if wokePercentage + slightlyWokePercentage > 50}
                    <span style="color: #e5cf00">SLIGHTLY WOKE...</span>
                    {:else}
                    <span style="color: #00ff00">NOT WOKE!!</span>
                    {/if}
                    ({wokePercentage.toFixed(2)}% woke + {slightlyWokePercentage.toFixed(2)}% slightly woke)
                </h2>
                {:else}
                sorry, we couldn't obtain this player's games. try checking privacy settings.
                {/if}
                    
                {:else}
                    player not found! check ur SteamIDs
                {/if}
            {/if}
        </div>
    </center>
    {#if games}
    <div>
        <h2>Games List</h2>
        counted {games.count.counted} out of {games.count.all} games ({(games.count.counted/games.count.all*100).toFixed(2)}%)
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Banner</th>
                    <th scope="col">Wokeness</th>
                    <th scope="col">Description</th>
                </tr>
            </thead>
            {#each games.list as { name, banner, woke, description }}
            <tr>
                <th scope="row">{decode(name)}</th>
                <td><img src={banner} class="banner" alt={"Banner for game " + name}></td>
                <td>
                    {#if woke == "-1"}
                    <span style="color: #ff0000">Woke</span>
                    {:else if woke == "0"}
                    <span style="color: #e5cf00">Slightly Woke</span>
                    {:else}
                    <span style="color: #00ff00">Not Woke</span>
                    {/if}
                </td>
                <td>
                    {decode(description)}
                </td>
            </tr>
            {/each}
        </table>
    </div>
    {/if}
</div>

<footer>
    *i am not associated with the woke content detector steam group, nor do i endorse any of the comments in it. this website was made as a joke.
</footer>

<style>
    footer {
        font-style: italic;
        color: gray;
    }
    .pad-l {
        margin: 2rem;
    }
    .center-box {
        border: solid black 2px;
        padding: 1rem;
        margin: 1rem;
        border-radius: 5px;
        width: fit-content;
    }
    .textbox {
        padding: 0.3rem;
        border: solid black 1px;
        border-radius: 5px;
        font-size: 1.2rem;
    }
    .btn {
        text-decoration: none;
        border: none;
        background-color: rgb(78, 115, 182);
        color: white;
        padding: 0.5rem;
        font-size: 1.2rem;
        border-radius: 5px;
    }
    .btn:hover {
        background-color: rgb(65, 92, 143);
    }
    .avatar {
        width: 2rem;
        border: solid gray 1px;
        vertical-align: middle;
    }
    table {
        border: solid black 2px;
        border-collapse: collapse;
    }
    th, td {
        border: 1px solid black;
        padding: 0.5rem;
    }
    @media only screen and (max-width: 768px) {
        .banner {
            max-width: 100px;
        }
        table {
            width: 80vw;
        }
        .pad-l {
            margin: 1rem;
        }
        .btn {
            display: inline-block;
            margin-top: 1rem;
            margin-bottom: 1rem;
        }
    }
</style>