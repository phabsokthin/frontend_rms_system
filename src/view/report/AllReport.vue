<template>
    <div class="min-h-screen">
      <div class="px-4">
          <!-- Header -->
        <div class="mb-[15px] flex items-center justify-between">
            <h1 class="text-xl font-bayon">បញ្ជីរបាយការណ៍</h1>
        </div>

        <!-- Tabs -->
        <div class="border-b border-gray-200">
            <nav class="flex space-x-4" aria-label="Tabs">
                <button v-for="tab in tabs" :key="tab.name" @click="activeTab = tab.name" :class="[
                    activeTab === tab.name
                        ? 'border-b-2 border-green-500 text-green-600'
                        : 'text-gray-500 hover:text-gray-700',
                    'flex items-center gap-2 px-3 py-2 text-md font-medium focus:outline-none border font-bayon'
                ]">
                    <!-- Icon -->
                    <span v-html="tab.icon"></span>
                    {{ tab.label }}
                </button>
            </nav>
        </div>

        <!-- Tab Content -->
        <div class="mt-4">
            <div v-if="activeTab === 'product'">
                <ProductReport/>
            </div>
            <div v-else-if="activeTab === 'sales'">
                <SellReport/>
            </div>
            <div v-else-if="activeTab === 'purchase'">
                <p>🛒 របាយការណ៍ទិញចូល</p>
            </div>
            <div v-else-if="activeTab === 'profit'">
                <p>📊 របាយការណ៍ចំណេញខាត</p>
            </div>
            <div v-else-if="activeTab === 'bestseller'">
                <p>⭐ របាយការណ៍ផលិតលក់ដាច់</p>
            </div>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import ProductReport from './ProductReport.vue';
import SellReport from './SellReport.vue';

export default {
    components: { ProductReport,SellReport },
    setup() {
        
        const tabs = [
            {
                name: 'product',
                label: 'របាយការណ៍ផលិតផល',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-box-icon lucide-box"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`
            },
            {
                name: 'sales',
                label: 'របាយការណ៍លក់',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-basket-icon lucide-shopping-basket"><path d="m15 11-1 9"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="M4.5 15.5h15"/><path d="m5 11 4-7"/><path d="m9 11 1 9"/></svg>`
            },
            {
                name: 'purchase',
                label: 'របាយការណ៍ទិញចូល',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart-icon lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`
            },
            {
                name: 'profit',
                label: 'របាយការណ៍ចំណេញខាត',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-banknote-icon lucide-banknote"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>`
            },
            {
                name: 'bestseller',
                label: 'របាយការណ៍ផលិតលក់ដាច់',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>`
            }
        ]

        const activeTab = ref('product')

        return { tabs, activeTab }
    }
}
</script>
