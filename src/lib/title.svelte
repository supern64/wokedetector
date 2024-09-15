<script>
    import he from 'he';
    const { decode } = he;
    export let name, banner;
</script>

<div style="font-weight: bold; text-align: center">
    {decode(name)}
    <div style="margin-top: 0.5rem;">
        <img src={banner} class="banner" alt={"Banner for game " + name}>
    </div>
</div>
