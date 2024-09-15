<script lang="ts">
    import he from 'he';
    import dayjs from 'dayjs';
    import relativeTime from 'dayjs/plugin/relativeTime';

    const {decode} = he;
    dayjs.extend(relativeTime);

    /** @type {import('./$types').PageData} */
	export let data;
</script>
<svelte:head>
    <title>The official WOKE games ranking</title>
    <meta name="title" content="The official WOKE games ranking" />
    <meta name="description" content="the ultimate list of WOKE games!!!" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://wokedetector.cirnoslab.me/full-list" />
    <meta property="og:title" content="The official WOKE games ranking" />
    <meta property="og:description" content="the ultimate list of WOKE games!!!" />
    <meta property="og:image" content="https://wokedetector.cirnoslab.me/favicon.png" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://wokedetector.cirnoslab.me/full-list" />
    <meta property="twitter:title" content="The official WOKE games ranking" />
    <meta property="twitter:description" content="the ultimate list of WOKE games!!!" />
    <meta property="twitter:image" content="https://wokedetector.cirnoslab.me/favicon.png" />
</svelte:head>
<div class="pad-l">
    <center>
        <h1>The Woke Ranking</h1>
        (according to the woke content detector steam group)
    </center>
    <div>
        <h2>Games List ({data.games.length} total)</h2>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Game</th>
                    <th scope="col">Wokeness</th>
                    <th scope="col">Description</th>
                </tr>
            </thead>
            {#each data.games as { name, banner, woke, description }}
            <tr>
                <th scope="row">
                    {decode(name)}
                    <div style="margin-top: 0.5rem;">
                        <img src={banner} class="banner" alt={"Banner for game " + name}>
                    </div>
                </th>
                <td>
                    {#if woke == "-1"}
                    <span style="color: #ff0000">Woke</span>
                    {:else if woke == "0"}
                    <span style="color: #e0c600">Slightly Woke</span>
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
</div>

<footer>
    list last updated on {dayjs(data.lastUpdate).toDate().toLocaleString()} ({dayjs(data.lastUpdate).fromNow()})<br>
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
    table {
        border: solid black 2px;
        border-collapse: collapse;
    }
    th, td {
        border: 1px solid black;
        padding: 0.5rem;
    }
    .banner {
        max-width: 200px;
    }
    @media only screen and (max-width: 768px) {
        .banner {
            max-width: 100px;
        }
        .pad-l {
            margin: 1rem;
        }
        th, td {
            padding: 0.2rem;
        }
    }
</style>