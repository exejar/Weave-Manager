<template>
    <div id="check-update" class="relative h-12 w-60 text-center">
        <div id="check-update-button" class="h-10 w-60 bg-blue-900 flex justify-center items-center rounded-xl cursor-pointer" on:click={checkForUpdate}>
            Check for Updates
        </div>
        <p class="text-sm mt-2 text-red-500">{slowDown}</p>
    </div>
</template>

<script>
    let slowDown = ''
    let lastUpdate = 0
    function checkForUpdate() {
        const now = Date.now()

        if (now - lastUpdate < 10 * 1000) {
            const timer = (10 - (now - lastUpdate) / 1000).toFixed(1)
            slowDown = `Slow down! Wait ${timer}s`
            return
        }

        window.api.send('toMain', ['checkUpdates'])
        slowDown = ''
        lastUpdate = now
    }
</script>