<template>
  <aside
    :class="[
      'flex flex-col h-screen text-white bg-green-800 shadow-lg transition-all duration-300',
      isOpen ? 'w-72' : 'w-16'
    ]"
  >
    <!-- Logo / Hamburger -->
    <div class="flex items-center justify-between h-16 gap-2 px-4 border-b border-green-700">
      <button @click="$emit('toggle')">
        <font-awesome-icon
          :icon="isOpen ? ['fas', 'bars'] : ['fas', 'times']"
          class="text-2xl"
        />
      </button>
      <span v-if="isOpen" class="pr-0 text-xl font-bayon">
        ប្រព័ន្ធគ្រប់គ្រងភោជនីដ្ឋាន
      </span>
    </div>

    <nav class="flex-1 py-6">
      <ul class="space-y-3">
        <li v-for="item in menuItems" :key="item.name" class="relative">
          <router-link
            :to="{ name: item.name }"
            class="relative flex items-center px-4 py-2 transition-all duration-300 font-bayon group"
            :class="[
              isActive(item.name) ? 'bg-green-600 text-white' : 'text-white hover:bg-green-700',
              showArrow(item.name) ? 'arrow-active' : ''
            ]"
          >
            <font-awesome-icon
              :icon="item.icon"
              :class="isOpen ? 'mr-2 text-lg' : 'mx-auto text-lg'"
            />
            <span v-if="isOpen">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import {
  faHome,
  faChartPie,
  faTable,
  faUsers,
  faBank,
  faUsersBetweenLines,
  faShop,
  faShoppingBag,
  faFileInvoiceDollar,
  faNewspaper,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons/faHandHoldingDollar';
import { faBoxArchive } from '@fortawesome/free-solid-svg-icons/faBoxArchive';
import { useAuthStore } from '../../stores/auth.store';

const props = defineProps<{ isOpen: boolean }>();
const route = useRoute();
const auth = useAuthStore();
const user = auth.getUser;

// All menu items
const allMenuItems = [
  { name: 'Home', label: 'ទំព័រដើម', icon: faHome },
  { name: 'Category', label: 'ប្រភេទ', icon: faChartPie },
  { name: 'Table', label: 'បញ្ជីលេខតុ', icon: faTable },
  { name: 'Staff', label: 'បុគ្គលិក', icon: faUsers },
  { name: 'Customer', label: 'អតិថិជន', icon: faUsersBetweenLines },
  { name: 'Supplier', label: 'អ្នកផ្គត់ផ្គង់', icon: faHandHoldingDollar },
  { name: 'PaymentType', label: 'វិធីសាស្រ្តទូទាត់', icon: faBank },
  { name: 'Product', label: 'ផលិតផល', icon: faBoxArchive },
  { name: 'Sell', label: 'បញ្ជីផ្ទាំងលក់', icon: faShop },
  { name: 'Purchase', label: 'ទិញផលិតផលចូល', icon: faShoppingBag },
  { name: 'Expense', label: 'ការចំណាយ', icon: faFileInvoiceDollar },
  { name: 'User', label: 'អ្នកប្រើប្រាស់', icon: faUser },
  { name: 'Report', label: 'របាយការណ៍', icon: faNewspaper }
];

// Filter menu items based on role
const menuItems =
  user?.role === 'kitchen'
    ? allMenuItems.filter(item => item.name === 'Home')
    : allMenuItems;

// Function to check active route
const isActive = (name: string) => route.name === name;

// Show arrow only for Home page if active
const showArrow = (name: string) => name === 'Home' && route.name === 'Home';
</script>

<style scoped>
/* Arrow effect for Home page */
.arrow-active::after {
  content: '';
  position: absolute;
  right: -16px;
  top: 0;
  width: 0;
  height: 100%;
  border-top: 24px solid transparent;
  border-bottom: 24px solid transparent;
  border-left: 16px solid #22c55e; /* matches bg-green-600 */
}
</style>