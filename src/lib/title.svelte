<script>
    import he from 'he';
    const { decode } = he;
    export let name, banner, woke;
</script>

<div style="font-weight: bold; text-align: center">
    {decode(name)}
    <div style="margin-top: 0.5rem;">
        <img src={banner} class="banner" alt={"Banner for game " + name}>
    </div>
    {#if woke == "-1"}
    <span style="color: #ff0000">Woke</span>
    {:else if woke == "0"}
    <span style="color: #e0c600">Slightly Woke</span>
    {:else}
    <span style="color: #00ff00">Not Woke</span>
    {/if}
</div>
