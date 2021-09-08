<script>
    import { time } from '../stores/stores';

    const dateFormatter = new Intl.DateTimeFormat('en', {
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
    })
</script>

 <h1>The time is {dateFormatter.format($time)}</h1>

<style>

h1 {
    font-size: 20px;
}

</style>