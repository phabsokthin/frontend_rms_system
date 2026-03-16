<template>
    <div class="min-h-screen p-4">

        <!-- Header + Filters -->
        <div class="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
            <h1 class="text-2xl font-bayon">របាយការណ៍ផលិតផលលក់ដាច់បំផុត</h1>

            <div class="flex flex-wrap items-center gap-3">
                <DateTime v-model="start_date" label="ចាប់ផ្តើម" type="date" />
                <DateTime v-model="end_date" label="បញ្ចប់" type="date" />

                <Select v-model="categoryName" :options="currentDataByOption" label="ប្រភេទ"
                    placeholder="ជ្រើសរើសប្រភេទ" />

                <TextFieldInput v-model="searchTerm" placeholder="ស្វែងរកផលិតផល" label="ស្វែងរក" class="font-bayon" />
            </div>
        </div>

        <!-- Cards -->
        <div v-if="isLoading" class="flex justify-center py-10">
            <Loading />
        </div>

        <div v-else-if="paginatedData.length === 0" class="py-10 text-center text-gray-500 font-bayon">
            មិនមានទិន្នន័យ
        </div>

        <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div v-for="(data, index) in paginatedData" :key="data.product_id"
                class="overflow-hidden transition-shadow duration-300 bg-white border hover:shadow-md">
                <!-- Product Image -->
                <img v-if="data.image" :src="localServer + data.image" alt="product image"
                    class="object-contain w-full h-48" />
                <img v-else src="https://bunchobagels.com/wp-content/uploads/2024/09/placeholder.jpg" alt="placeholder"
                    class="object-cover w-full h-48" />

                <!-- Card Content -->
                <div class="p-4">
                    <h2 class="mb-1 text-lg font-semibold font-bayon">{{ data.name }}</h2>
                    <p class="mb-1 text-gray-500"><strong>ប្រភេទ:</strong> {{ data.category.name }}</p>
                    <p class="mb-1 text-gray-500"><strong>តម្លៃលក់:</strong> ${{ data.price }}</p>
                    <p class="mb-1 text-gray-500"><strong>ចំនួនលក់:</strong> {{ data.totalSold }} {{ data.unit }}</p>
                    <p class="text-sm text-gray-400"><strong>ចុងក្រោយលក់:</strong> {{ formatDate(data.created_at) }}</p>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div class="flex justify-center mt-6">
            <Pagination :current-page="currentPage" :total-pages="totalPages" :total-items="filteredData.length"
                :items-per-page="itemsPerPage" :on-page-change="handlePageChange" />
        </div>
    </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import Pagination from '../../components/ui/Pagination.vue';
import Loading from '../../components/ui/Loading.vue';
import TextFieldInput from '../../components/ui/TextFieldInput.vue';
import Select from '../../components/ui/Select.vue';
import DateTime from '../../components/ui/DateTime.vue';
import { localServer } from '../../../server/localServer';

import { TopSellingProduct } from '../../types/topSellingProduct';
import { categoryStore } from '../../stores/category.store';
import reportService from '../../services/reportService';

export default {
    components: { Pagination, Loading, TextFieldInput, Select, DateTime },
    setup() {
        const category = categoryStore();
        const currentData = ref<TopSellingProduct[]>([]);
        const currentPage = ref(1);
        const itemsPerPage = ref(10);
        const isLoading = ref(false);
        const searchTerm = ref("");
        const categoryName = ref("");


        // Helper to format date as YYYY-MM-DD
        function formatDate(date: Date | string) {
            const d = typeof date === "string" ? new Date(date) : date;
            if (isNaN(d.getTime())) return ""; // invalid date guard

            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        }



        // Default to first and last day of current month
        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1);
        const lastDayOfMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 0);

        const start_date = ref(formatDate(firstDayOfMonth));
        const end_date = ref(formatDate(lastDayOfMonth));



        const currentDataByOption = ref<{ label: string; value: string }[]>([]);

        // Fetch categories
        onMounted(async () => {
            isLoading.value = true;
            try {
                await category.fetchCategories();
                currentDataByOption.value = category.getCategories.map(cat => ({
                    label: cat.name,
                    value: cat._id
                }));
            } catch (err) {
                console.error(err);
            } finally {
                isLoading.value = false;
            }
        });

        // Fetch top-selling products
        const fetchProducts = async () => {
            isLoading.value = true;
            try {
                const response = await reportService.getTopSellingProducts();
                currentData.value = response;
            } catch (err) {
                console.log(err);
            } finally {
                isLoading.value = false;
            }
        };

        onMounted(fetchProducts);

        // Filtered data based on search, category, date
        const filteredData = computed(() => {
            return currentData.value.filter(item => {
                const matchesSearch = searchTerm.value
                    ? item.name.toLowerCase().includes(searchTerm.value.toLowerCase())
                    : true;

                const matchesCategory = categoryName.value
                    ? item.category.id === categoryName.value
                    : true;

                const matchesStartDate = start_date.value
                    ? new Date(item.created_at) >= new Date(start_date.value)
                    : true;

                const matchesEndDate = end_date.value
                    ? new Date(item.created_at) <= new Date(end_date.value)
                    : true;

                return matchesSearch && matchesCategory && matchesStartDate && matchesEndDate;
            });
        });

        // Paginated data
        const paginatedData = computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage.value;
            const end = start + itemsPerPage.value;
            return filteredData.value.slice(start, end);
        });

        const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value));

        const handlePageChange = (page: number) => {
            currentPage.value = page;
        };

        watch(itemsPerPage, () => (currentPage.value = 1));


        return {
            currentData,
            paginatedData,
            filteredData,
            currentPage,
            itemsPerPage,
            totalPages,
            handlePageChange,
            isLoading,
            searchTerm,
            categoryName,
            currentDataByOption,
            localServer,
            start_date,
            end_date,
            formatDate
        };
    }
};
</script>

<style scoped>
/* Optional: card hover effect */
</style>