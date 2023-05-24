<template>
    <div id="header" class="relative text-xl w-full bg-neutral-900 h-10 flex items-center pl-3 gap-3">
        <div id="header-buttons" class="absolute right-0 h-10 flex justify-end gap-2 p-2">
            <button class="button hover:bg-neutral-600" on:click={() => window.api.send('toMain', ['minimizeWindow'])}>
                <i class="fa-solid fa-minus"></i>
            </button>
            <button class="button hover:bg-red-500 hover:bg-opacity-80" on:click={() => window.api.send('toMain', ['closeWindow'])}>
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        <img src="icon.png" class="w-7 h-7" alt="Weave Icon">
        <h1>Weave Manager</h1>
    </div>
</template>

<style>
    #header {
        z-index: 2;
        -webkit-app-region: drag;
    }

    .button {
        @apply h-7 aspect-square text-lg text-white transition-colors duration-300 rounded;
        -webkit-app-region: no-drag;
        text-shadow: -1px -1px 0 #00000030, 1px -1px 0 #00000030, -1px 1px 0 #00000030, 1px 1px 0 #00000030;
    }
</style>

<script>
</script>