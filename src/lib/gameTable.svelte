<script lang="ts">
    import he from 'he';
    import Fuse from 'fuse.js';
    import { writable } from 'svelte/store';
    import { createTable, createRender, Subscribe, Render } from "svelte-headless-table";
    import { addPagination, addColumnFilters } from "svelte-headless-table/plugins"
    import type { GameData } from '$lib';
    import Title from '$lib/title.svelte';
    import Woke from '$lib/woke.svelte';
    import Description from './description.svelte';

    export let games: GameData[];
    export let paginate = true;

    $: filterValue = "";
    const fuse = new Fuse(games, {
        keys: ["name"],
        threshold: 0.35,
        minMatchCharLength: 1
    });
    const {decode} = he;
    const dataStore = writable(games as GameData[]);

    $: $dataStore = filterValue.length != 0 ? fuse.search(filterValue).map((i) => i.item) : games;
    
    const table = createTable(dataStore, {
        colFilter: addColumnFilters(),
        paginate: addPagination({ initialPageSize: paginate ? 20 : games.length })
    });

    const columns = table.createColumns([
        table.column({
            header: 'Game',
            id: 'woke', // required for filter to work
            accessor: (item) => { return {name: item.name, banner: item.banner, woke: item.woke} },
            plugins: {
                colFilter: {
                    fn: ({ filterValue, value }) => {
                        return filterValue == null || filterValue === value.woke
                    }
                }
            },
            cell: ({ value }) => {
                return createRender(Title, value)
            }
        }),
        table.column({
            header: 'Description',
            accessor: (item) => { return {description: item.description, reviewLink: item.review_link} },
            cell: ({ value }) => {
                return createRender(Description, value);
            }
        })
    ]);
    
    const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } = table.createViewModel(columns);
    const { pageIndex, pageCount, hasNextPage, hasPreviousPage } = pluginStates.paginate;
    const { filterValues } = pluginStates.colFilter;
</script>

<div style="margin-bottom: 1rem; display: flex; gap: 1rem; flex-direction: row;">
    <input type="text" class="textbox" style="flex: 1" id="search" placeholder="Search A Game" bind:value={filterValue}>
    <select id="wokeness" class="textbox" bind:value={$filterValues.woke}>
        <option value={null}>None</option>
        <option value="1">Not Woke</option>
        <option value="0">Slightly Woke</option>
        <option value="-1">Woke</option>
      </select>
</div>
{#if paginate}
<div style="margin-bottom: 1rem; display: flex; gap: 1rem; justify-content: center; align-items: center;">
    <button class="btn" disabled={!$hasPreviousPage} on:click={() => {if ($hasPreviousPage) $pageIndex -= 1}}>Previous</button>
    <span>Page {$pageIndex + 1} of {$pageCount}</span>
    <button class="btn" disabled={!$hasNextPage} on:click={() => {if ($hasNextPage) $pageIndex += 1}}>Next</button>
</div>
{/if}
<table {...$tableAttrs}>
    <colgroup>
        <col style="width: 20%">
    </colgroup>
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
{#if paginate}
<div style="margin-top: 1rem; display: flex; gap: 1rem; justify-content: center; align-items: center;">
    <button class="btn" disabled={!$hasPreviousPage} on:click={() => {if ($hasPreviousPage) $pageIndex -= 1}}>Previous</button>
    <span>Page {$pageIndex + 1} of {$pageCount}</span>
    <button class="btn" disabled={!$hasNextPage} on:click={() => {if ($hasNextPage) $pageIndex += 1; window.scrollTo(0, 0)}}>Next</button>
</div>
{/if}
<style>
    @media only screen and (max-width: 768px) {
        .textbox {
            padding: 0.2rem;
            font-size: 1rem;
        }
    }
</style>