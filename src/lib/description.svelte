<script>
    export let description, reviewLink
</script>
{@html description.replace("full review", `<a href="${reviewLink}">full review</a>`)}
{#if reviewLink !== "undefined"}<br>
<footer>See full discussion <a href={reviewLink}>here</a></footer>
{/if}