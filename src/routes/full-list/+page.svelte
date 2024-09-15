<script lang="ts">
    import he from 'he';
    import dayjs from 'dayjs';
    import relativeTime from 'dayjs/plugin/relativeTime';
    import { readable } from 'svelte/store';
    import { createTable, createRender, Subscribe, Render } from "svelte-headless-table";
    import { addTableFilter, addPagination, addColumnFilters } from "svelte-headless-table/plugins"
    import type { GameData } from '$lib';
    import Title from '$lib/title.svelte';
    import Woke from '$lib/woke.svelte';

    const {decode} = he;
    dayjs.extend(relativeTime);

    /** @type {import('./$types').PageData} */
	export let data;


    const dataStore = readable(data.games as GameData[]);
    const table = createTable(dataStore, {
        filter: addTableFilter(),
        colFilter: addColumnFilters(),
        paginate: addPagination({
            initialPageSize: 20
        })
    });

    const columns = table.createColumns([
        table.column({
            header: 'Name',
            accessor: (item) => { return {name: item.name, banner: item.banner} },
            cell: ({ value }) => {
                return createRender(Title, {
                    name: value.name,
                    banner: value.banner
                })
            }
        }),
        table.column({
            header: 'Wokeness',
            accessor: 'woke',
            plugins: {
                colFilter: {
                    fn: ({ filterValue, value }) => {
                        return filterValue == null || filterValue === value
                    }
                }
            },
            cell: ({ value }) => {
                return createRender(Woke, {
                    woke: value
                });
            }
        }),
        table.column({
            header: 'Description',
            accessor: 'description',
            cell: ({ value }) => decode(value)
        })
    ]);
    
    const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } = table.createViewModel(columns);
    const { filterValue } = pluginStates.filter;
    const { pageIndex, pageCount, hasNextPage, hasPreviousPage } = pluginStates.paginate;
    const { filterValues } = pluginStates.colFilter;
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
        <div style="margin-bottom: 1rem; display: flex; gap: 1rem;">
            <input type="text" class="textbox" id="search" placeholder="Search A Game" bind:value={$filterValue}>
            <select id="wokeness" class="textbox" bind:value={$filterValues.woke}>
                <option value={null}>None</option>
                <option value="1">Not Woke</option>
                <option value="0">Slightly Woke</option>
                <option value="-1">Woke</option>
              </select>
        </div>
        <div style="margin-bottom: 1rem; display: flex; gap: 1rem; justify-content: center; align-items: center;">
            <button class="btn" disabled={!$hasPreviousPage} on:click={() => {if ($hasPreviousPage) $pageIndex -= 1}}>Previous</button>
            <span>Page {$pageIndex + 1} of {$pageCount}</span>
            <button class="btn" disabled={!$hasNextPage} on:click={() => {if ($hasNextPage) $pageIndex += 1}}>Next</button>
        </div>
        <table {...$tableAttrs}>
            <thead>
                {#each $headerRows as headerRow (headerRow.id)}
                <Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
                    <tr {...rowAttrs}>
                    {#each headerRow.cells as cell (cell.id)}
                        <Subscribe attrs={cell.attrs()} let:attrs>
                        <th {...attrs}>
                            <Render of={cell.render()} />
                        </th>
                        </Subscribe>
                    {/each}
                    </tr>
                </Subscribe>
                {/each}
            </thead>
            <tbody {...$tableBodyAttrs}>
                {#each $pageRows as row (row.id)}
                <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
                    <tr {...rowAttrs}>
                    {#each row.cells as cell (cell.id)}
                        <Subscribe attrs={cell.attrs()} let:attrs>
                        <td {...attrs}>
                            <Render of={cell.render()} />
                        </td>
                        </Subscribe>
                    {/each}
                    </tr>
                </Subscribe>
                {/each}
            </tbody>
        </table>
        <!--
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
        -->
    </div>
</div>

<footer>
    list last updated on {dayjs(data.lastUpdate).toDate().toLocaleString()} ({dayjs(data.lastUpdate).fromNow()})<br>
    *i am not associated with the woke content detector steam group, nor do i endorse any of the comments in it. this website was made as a joke.
</footer>