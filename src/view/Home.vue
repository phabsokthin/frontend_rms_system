<template>
    <div>


        <p class="text-xl font-bold font-bayon">សូមស្វាគមន៍មកការប្រភព័ន្ធគ្រប់គ្រងភោនីដ្ឋាន {{ user?.role}}</p>

    </div>
</template>

<script lang="ts">
import { useAuthStore } from '../stores/auth.store';

export default {
    setup() {
        const auth = useAuthStore()
        const user = auth.getUser

        return { user }
    }
}

</script>