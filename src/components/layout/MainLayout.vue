<template>
    <div class="flex h-screen">
        <!-- Sidebar -->
        <div>
            <SideBar :is-open="isSidebarOpen" @toggle="toggleSidebar" />
        </div>

        <!-- Main content -->
        <div class="flex-1 flex flex-col min-w-[980px] h-full space-y-2 print:space-y-0 transition-all duration-300">
            <Header @toggle-sidebar="toggleSidebar" />
            <main class="flex-1 p-4 overflow-auto">
                <router-view />
            </main>
            <Footer />
        </div>
        <div class="fixed bottom-16 right-4">
            <button @click="handleLogout"
                class="px-4 py-2 font-bold text-white bg-red-500 rounded-full shadow-lg hover:bg-red-600 font-bayon">
                ចាកចេញ
            </button>
        </div>


    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SideBar from './SideBar.vue'
import Header from './Header.vue'
import Footer from './Footer.vue'
import { useNotification } from '../../composables/useNotification'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.store'
const { notify } = useNotification()
const isSidebarOpen = ref(true)
const auth = useAuthStore()
const router = useRouter()

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
}

const handleLogout = () => {
    try {
        if (window.confirm("Are you sure you want to logout?")) {
            auth.logout()
            router.push("/login")
        }
    }
    catch (error: any) {
        notify({
            message: error.message,
            type: "error",
        })
    }
}
</script>

<style scoped></style>