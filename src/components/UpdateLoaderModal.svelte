<template>
    <div id="update-loader-modal" class="absolute top-0 left-0 w-screen h-screen flex justify-center items-center">
        <div id="content" class="relative w-[30rem] h-[12rem] bg-neutral-800 rounded-xl flex flex-col justify-around items-center">
            <h1>Weave is out-dated on your computer</h1>
<!--            <div id="keep-current-button" class="w-[12.5rem] h-7 bg-neutral-600 flex justify-center items-center rounded-lg cursor-pointer text-sm" on:click={}>-->
<!--                Keep current version of Weave-->
<!--            </div>-->
            <div id="update-loader-button" class="w-[20rem] h-10 bg-blue-900 flex justify-center items-center rounded-xl cursor-pointer" on:click={updateWeave} on:keydown={handleKeyDown}>
                {updateState} to version {weaveFetch.version}
            </div>
        </div>
    </div>
</template>

<script>
    export let weaveFetch
    let updateState = 'Update Weave'

    function updateWeave() {
        updateState = 'Updating Weave'
        window.api.send('toMain', ['update', weaveFetch])
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter' || event.keyCode === 13)
            updateWeave()
    }
</script>

<style>
    #update-loader-modal {
        background-color: rgba(0, 0, 0, 25%);
        backdrop-filter: blur(8px);
    }
    #content {
        box-shadow: 0 0 2rem black;
    }
</style>