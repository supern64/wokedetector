<script>
    export let woke;
</script>
{#if woke == "-1"}
<span style="color: #ff0000">Woke</span>
{:else if woke == "0"}
<span style="color: #e0c600">Slightly Woke</span>
{:else}
<span style="color: #00ff00">Not Woke</span>
{/if}