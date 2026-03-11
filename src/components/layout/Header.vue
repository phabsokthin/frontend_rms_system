<template>
  <header class="flex items-center justify-between px-4 text-white bg-green-800 border-l border-green-600 shadow h-14">
    <!-- Left: Logo / Title -->
    <div class="flex items-center space-x-2">
      <DisplayURL />
    </div>


    <!-- Right: Profile section -->
    <div class="flex items-center space-x-3">
      <router-link to="/table"
        class="flex items-center gap-2 p-1 border border-green-600 rounded-md cursor-pointer hover:bg-green-700">
        <div class="p-2 bg-green-600 rounded-full cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-grid2x2-icon lucide-grid-2x2">
            <path d="M12 3v18" />
            <path d="M3 12h18" />
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
        </div>
        <span class="font-bayon">លេខតុ</span>
      </router-link>
      <router-link to="/sell" v-if="user.role !== 'kitchen'"
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
      <router-link to="/sellList" :class="[
        'flex items-center gap-1 p-1 border rounded-md cursor-pointer relative',
        $route.path === '/sellList'
          ? 'bg-green-700 text-white border-green-700'
          : 'border-green-600 hover:bg-green-700'
      ]">
        <div :class="[
          'p-2 rounded-full',
          $route.path === '/sellList' ? 'bg-white text-green-700' : 'bg-green-600'
        ]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 12h-5" />
            <path d="M15 8h-5" />
            <path d="M19 17V5a2 2 0 0 0-2-2H4" />
            <path
              d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" />
          </svg>
        </div>

        <span class="font-bayon">បញ្ជីលក់ </span>
        <span class="absolute p-1 text-xs font-bold text-white bg-orange-500 rounded-full shadow -right-1 -top-0.5">{{
          pendingCount }}</span>
      </router-link>
      <router-link to="/sell" 
        class="flex items-center gap-2 p-1 border border-green-600 rounded-md cursor-pointer hover:bg-green-700">
        <div class="p-2 bg-green-600 rounded-full cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-bell-ring-icon lucide-bell-ring">
            <path d="M10.268 21a2 2 0 0 0 3.464 0" />
            <path d="M22 8c0-2.3-.8-4.3-2-6" />
            <path
              d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
            <path d="M4 2C2.8 3.7 2 5.7 2 8" />
          </svg>
        </div>
        <span class="font-bayon">ជូនដំណឹង</span>
      </router-link>
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
import { computed, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import DisplayURL from '../DisplayURL.vue';
import { sellOrderStore } from '../../stores/sellOrder.store';
export default {
  components: {
    DisplayURL
  },
  setup() {

    const auth = useAuthStore()
    const user = auth.getUser
    const sellOrder = sellOrderStore()

    // Count only pending orders
    const pendingCount = computed(() => {
      return sellOrder.data.filter(order => order.status === "pending").length;
    });

    onMounted(async () => {
      await sellOrder.fetchDta(); // fetch all orders first
    });


    return { user, pendingCount }
  }
};


</script>