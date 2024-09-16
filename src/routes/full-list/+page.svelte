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
        <h1>The Woke Ranking</h1>
        (according to the woke content detector steam group)<br>
        <footer>csv available <a data-sveltekit-reload href="/data.csv">here</a>, last updated {dayjs(data.lastUpdate).fromNow()}</footer>
    </center>
    <div>
        <h2>Games List ({data.games.length} total)</h2>
        <GameTable games={data.games} />
    </div>
</div>

<footer>
    list last updated on {dayjs(data.lastUpdate).toDate().toLocaleString()} ({dayjs(data.lastUpdate).fromNow()})<br>
    *i am not associated with the woke content detector steam group, nor do i endorse any of the comments in it. this website was made as a joke.
</footer>

