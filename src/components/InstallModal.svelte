<template>
    <div id="install-modal" class="absolute top-0 left-0 w-screen h-screen flex justify-center items-center">
        <div id="content" class="relative w-[30rem] h-[12rem] bg-neutral-800 rounded-xl flex flex-col justify-around items-center">
            <h1>Weave is not installed on your computer</h1>
            <div id="install-button" class="w-[15rem] h-10 bg-blue-900 flex justify-center items-center rounded-xl cursor-pointer" on:click={installWeave} on:keydown={handleKeyDown}>
                {installState} version {weaveFetch.version}
            </div>
        </div>
    </div>
</template>

<script>
    export let weaveFetch
    let installState = 'Install Weave'

    function installWeave() {
        installState = 'Installing Weave'
        window.api.send('toMain', ['install', weaveFetch])
    }
    function handleKeyDown(event) {
        if (event.key === 'Enter' || event.keyCode === 13)
            installWeave()
    }
</script>

<style>
    #install-modal {
        background-color: rgba(0, 0, 0, 25%);
        backdrop-filter: blur(8px);
    }
    #content {
        box-shadow: 0 0 2rem black;
    }
</style>