<template>
    <div class="pl-1 mt-[9px] banner-container">
        <h1 class="banner-text">
            សូមស្វាគមន៍មកការប្រភព័ន្ធគ្រប់គ្រងភោជនីដ្ឋាន
        </h1>
    </div>
    <div class="">
        <Dashboard />
        <SellOrderList />
    </div>
</template>

<script lang="ts">
import Dashboard from '../components/Dashboard.vue';
import SellOrderList from './sellOrder/SellOrderList.vue';

export default {
    components: { Dashboard, SellOrderList },
    setup() {
    }
};
</script>

<style scoped>
.banner-container {
    display: inline-block;
    /* shrink to text width */
    position: relative;
}

/* Main banner */
.banner-text {
    background-color: #15803d;
    /* dark green */
    color: white;
    font-size: 18px;
    font-weight: bold;
    padding: 10px 40px;
    /* space for arrows */
    font-family: 'Bayon', sans-serif;
    position: relative;
    display: inline-block;
}

/* Left arrow */
.banner-text::before {
    content: '';
    position: absolute;
    left: 5%;
    top: 50%;
    transform: translate(-100%, -50%);
    /* move left outside */
    width: 0;
    height: 0;
    border-top: 29px solid transparent;
    border-bottom: 29px solid transparent;
    border-left: 25px solid white;
    /* matches banner bg */
}

/* Right arrow */
.banner-text::after {
    content: '';
    position: absolute;
    right: 5%;
    top: 50%;
    transform: translate(100%, -50%);
    /* move right outside */
    width: 0;
    height: 0;
    border-top: 29px solid transparent;
    border-bottom: 29px solid transparent;
    border-right: 25px solid white;
    /* matches banner bg */
}
</style>