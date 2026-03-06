<template>
  <header class="flex items-center justify-between px-4 text-white bg-green-800 border-l border-green-600 shadow h-14">
    <!-- Left: Logo / Title -->
    <div class="flex items-center space-x-2">
      <DisplayURL />
    </div>


    <!-- Right: Profile section -->
    <div class="flex items-center space-x-3">
      <router-link to="/sell"
        class="flex items-center gap-2 p-1 border border-green-600 rounded-md cursor-pointer hover:bg-green-700">
        <div class="p-2 bg-green-600 rounded-full cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-store-icon lucide-store">
            <path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5" />
            <path
              d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244" />
            <path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05" />
          </svg>
        </div>
        <span class="font-bayon">ផ្ទាំងលក់</span>
      </router-link>
      <div class="flex items-center gap-2 p-1 border border-green-600 rounded-md cursor-pointer hover:bg-green-700">
        <div class="p-2 bg-green-600 rounded-full cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-scroll-text-icon lucide-scroll-text">
            <path d="M15 12h-5" />
            <path d="M15 8h-5" />
            <path d="M19 17V5a2 2 0 0 0-2-2H4" />
            <path
              d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" />
          </svg>
        </div>
        <span class="font-bayon">បញ្ជីលក់</span>
      </div>
      <div></div>
      <div class="flex items-center gap-2 ">
        <span class="hidden md:inline font-bayon">ប្រវត្តិរូប៖ {{ user?.username }}</span>

        <span class="p-2 text-green-500 bg-white rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-user-icon lucide-user">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </span>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { useAuthStore } from '../../stores/auth.store';
import DisplayURL from '../DisplayURL.vue';
export default {
  components: {
    DisplayURL
  },
  setup() {
    const auth = useAuthStore()
    const user = auth.getUser
    console.log(user)

    return { user }
  }
};


</script>