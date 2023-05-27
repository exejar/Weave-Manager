<template>
    <div id="modlist-entry" class="relative mod w-full h-16 flex items-center pl-5">
        {#if modFile.image !== null}
            <img class="h-12 w-12" src="{URL.createObjectURL(new Blob([modFile.image.buffer], { type: 'image/png' }))}" alt="Mod Image"/>
        {/if}

        {#if !modFile.about}
            <h1 class="ml-[3.75rem]">{modFile.fileName}</h1>
            <p class="ml-3 text-neutral-400">Empty About Section</p>
        {:else}
            <h1 class="ml-3">{modFile.about.name} v{modFile.about.version}</h1>
            <p class="ml-3 text-neutral-400">{modFile.about.description}</p>
        {/if}


        {#if modFile.enabled}
            <i class="absolute right-3 text-green-600 fa-solid fa-check"></i>
        {:else}
            <i class="absolute right-3 text-red-600 fa-solid fa-xmark"></i>
        {/if}


        <div class="absolute button-wrapper right-1">
            {#if modFile.enabled}
                <button id="disable-button" class="w-16 h-8 bg-red-900 rounded-lg" on:click={disableMod}>
                    Disable
                </button>
            {:else}
                <button id="enable-button" class="w-16 h-8 bg-green-600 rounded-lg" on:click={enableMod}>
                    Enable
                </button>
            {/if}
        </div>
    </div>
</template>

<style>
    .button-wrapper {
        opacity: 0;
        transition: opacity 0.1s ease-in-out
    }
    #modlist-entry:hover .button-wrapper {
        opacity: 1;
    }
</style>

<script>
    export let modFile

    function disableMod() {
        window.api.send('toMain', ['disableMod', modFile.fileName])
    }

    function enableMod() {
        window.api.send('toMain', ['enableMod', modFile.fileName])
    }
</script>