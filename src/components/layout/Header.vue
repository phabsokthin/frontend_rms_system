<template>
  <header class="flex items-center justify-between px-4 text-white bg-green-800 border-l border-green-600 shadow h-14">
    <!-- Left: Logo / Title -->
    <div class="flex items-center space-x-2">
      <DisplayURL />
    </div>

    <!-- Right: Profile section -->
    <div class="flex items-center space-x-3">
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