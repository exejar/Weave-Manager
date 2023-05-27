<template>
    <div id="modlist-wrapper" class="relative w-full h-[23rem]">
        <div id="mod-folder-button" class="bg-blue-900 w-8 h-8 rounded-lg cursor-pointer mb-2">
            <div id="mod-icon" class="flex items-center justify-center w-full h-full" on:click={() => {window.api.send('toMain', ['openModFolder'])}}>
                <i class="fa-solid fa-folder"></i>
            </div>
            <span class="tooltiptext absolute w-28 rounded-lg text-center top-0 ml-10">Open Mods Folder</span>
        </div>

        <div id="modlist" class="w-full h-80 overflow-y-scroll rounded-xl">
            {#each files as file}
                <ModListEntry modFile="{file}"/>
            {/each}
        </div>


    </div>
</template>

<style>
    #modlist {
        box-shadow: inset 0 0 1rem rgb(0, 0, 0, 0.5);
        background: rgb(30, 30, 30, 255)
    }

    .tooltiptext {
        opacity: 0;
        pointer-events: none;
        background-color: rgba(0, 0, 0, 25%);
        transition: opacity 0.3s ease-in-out
    }
    #mod-folder-button:hover .tooltiptext {
        opacity: 1;
    }

    *::-webkit-scrollbar {
        background-color: transparent;
        width: 1.125rem;
    }
    *::-webkit-scrollbar-track {
        background-color: transparent;
    }

    *::-webkit-scrollbar-thumb {
        background-color: rgb(50, 45, 50);
        border-radius: 1.125rem;
        border: 0.4rem solid transparent;
        background-clip: padding-box;
    }
</style>

<script>
    import { onMount } from 'svelte'
    import ModListEntry from "./ModListEntry.svelte";
    let files = []

    const eventActions = {
        updatedModList: async () => {
            files = await window.api.invoke('toMain', ['getModList'])
        }
    }

    window.api.receive('fromMain', (data) => {
        const action = eventActions[data[0]]
        if (action)
            action(data.slice(1))
    })

    onMount(async () => {
        files = await window.api.invoke('toMain', ['getModList'])
    })
</script>