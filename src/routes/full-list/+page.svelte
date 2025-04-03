<script lang="ts">
    import dayjs from 'dayjs';
    import relativeTime from 'dayjs/plugin/relativeTime';
    import GameTable from '$lib/gameTable.svelte';

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
        <h1 style="margin-bottom: 0.2rem">The Woke Ranking</h1>
        (according to the woke content detector steam group)<br><br>
        <footer>click <a href="/">here</a> to compare your steam games against this list<br>
        csv available <a data-sveltekit-reload href="/data.csv">here</a>, last updated {dayjs(data.lastUpdate).fromNow()}</footer>
    </center>
    <div>
        <GameTable games={data.games} let:all let:filtered>
            <h2>Game List ({all} total{#if all !== filtered}, {filtered} results{/if})</h2>
        </GameTable>
    </div>
</div>

<footer>
    list last updated on {dayjs(data.lastUpdate).toDate().toLocaleString()} ({dayjs(data.lastUpdate).fromNow()})<br>
    *this list was compiled from the woke content detector steam group. i am <span style="color: red; font-weight: bold">NOT</span> associated with it, nor do i endorse any of the comments it makes. 
    <span style="color: black; font-weight: bold">this website was made as a joke.</span>
</footer>

