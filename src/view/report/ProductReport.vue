<template>
    <div class="min-h-screen">
        <div class="">
            <!-- Header -->
            <div class="mb-[15px] flex items-center justify-between">
                <h1 class="text-xl font-bayon">របាយការណ៍ផលិតផល ({{ paginatedData.length }})</h1>
                <div class="flex gap-2">

                    <!-- Category -->
                    <Select v-model="categoryName" :options="currentDataByOption" label="ប្រភេទ" required
                        placeholder="ជ្រើសរើសប្រភេទ" />
                    <TextFieldInput v-model="searchTerm" placeholder="ស្វែងរកផលិតផល" label="ស្វែងរក"
                        class="font-bayon" />

                </div>
            </div>

            <!-- Table -->

            <div class="overflow-x-auto bg-white border border-gray-200 ">
                <table class="min-w-[1300px] w-full border-collapse">

                    <!-- ================= HEADER ================= -->
                    <thead>
                        <tr class="text-white bg-green-700 text-md font-bayon">
                            <th class="px-6 py-3 border">ល.រ</th>
                            <th class="px-6 py-3 border">ឈ្មោះផលិតផល</th>
                            <th class="px-6 py-3 border">ប្រភេទ</th>
                            <th class="px-6 py-3 border">កូដ</th>
                            <th class="px-6 py-3 border">តម្លៃលក់</th>
                            <th class="px-6 py-3 border">តម្លៃដើម</th>
                            <th class="px-6 py-3 border">ប្រាក់ចំណេញ</th>
                            <th class="px-6 py-3 border">ចំនួន (ស្តុក)</th>
                            <th class="px-6 py-3 border">ប្រភេទស្តុក</th>
                            <th class="px-6 py-3 border">ស្ថានភាព</th>
                            <th class="px-6 py-3 border">រូបភាព</th>
                        </tr>
                    </thead>

                    <!-- ================= BODY ================= -->
                    <tbody class="bg-white border-b-color ">
                        <tr v-if="isLoading">
                            <td colspan="13" class="py-6 text-center">
                                <Loading />
                            </td>
                        </tr>


                        <tr v-else-if="paginatedData.length === 0">
                            <td colspan="13" class="px-6 py-6 text-center text-gray-500 font-bayon">
                                មិនមានទិន្នន័យ
                            </td>
                        </tr>


                        <tr v-else v-for="(data, index) in paginatedData" :key="data._id"
                            class="transition-colors duration-150 bg-red-100 hover:bg-red-200">
                            <td class="px-6 py-3 text-gray-900 border whitespace-nowrap">
                                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
                            </td>


                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.name }}
                            </td>


                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.category_id?.name }}
                            </td>


                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.code }}
                            </td>



                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.price }}
                            </td>


                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.cost }}
                            </td>


                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.profit }}
                            </td>


                            <td class="px-6 py-3 border whitespace-nowrap">

                                <div>
                                    <div v-if="data.is_manage_stock && data.qty === 0">
                                        <span
                                            class="p-1 text-sm text-red-500 bg-red-100 rounded-md font-bayon">អស់ស្តុក</span>
                                    </div>
                                    <span v-else>សល់ {{ data.qty }}</span>
                                </div>
                            </td>


                            <td class="px-6 py-3 text-sm border whitespace-nowrap font-bayon">
                                <span v-if="data.is_manage_stock === false"
                                    class="text-red-600">មិនគ្រប់គ្រងស្តុក</span>
                                <span v-else class="text-green-600">គ្រប់គ្រងស្តុក</span>


                            </td>



                            <td class="px-6 py-3 border whitespace-nowrap font-bayon">
                                <span :class="data.status
                                    ? 'text-green-600 font-semibold'
                                    : 'text-red-600 font-semibold'">
                                    {{ data.status ? 'សកម្ម' : 'អសកម្ម' }}
                                </span>
                            </td>


                            <td class="px-6 py-3 border whitespace-nowrap">
                                <img v-if="data.image_url" :src="localServer + data.image_url"
                                    class="object-cover w-16 h-16 border rounded" />

                                <span v-else class="text-sm text-gray-400">
                                    <img src="https://bunchobagels.com/wp-content/uploads/2024/09/placeholder.jpg"
                                        class="w-20" alt="">
                                </span>
                            </td>

                        </tr>

                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="flex items-center justify-between mt-3">


                <Pagination :current-page="currentPage" :total-pages="totalPages" :total-items="currentData.length"
                    :items-per-page="itemsPerPage" :on-page-change="handlePageChange" />
            </div>



        </div>

    </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import Button from '../../components/ui/Button.vue';
import Pagination from '../../components/ui/Pagination.vue';
import type Category from '../../types/category';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import Loading from '../../components/ui/Loading.vue';
import DeletePopup from '../../components/ui/DeletePopup.vue';
import TextFieldInput from '../../components/ui/TextFieldInput.vue';
import { useNotification } from '../../composables/useNotification';

import Product from '../../types/product';
import { localServer } from '../../../server/localServer';
import { reportStore } from '../../stores/report.store';
import { categoryStore } from '../../stores/category.store';
import Select from '../../components/ui/Select.vue';





export default {
    components: { Button, Pagination, Loading, DeletePopup, TextFieldInput, Select },
    setup() {
        const productReport = reportStore();
        const category = categoryStore();
        const currentData = ref<Product[]>([]);
        const currentPage = ref(1);
        const itemsPerPage = ref(10);
        const isLoading = ref(false)
        const searchTerm = ref("")
        const categoryName = ref("")

        const currentDataByOption = ref<{ label: string; value: string }[]>([])

        // Fetch categories
        onMounted(async () => {
            isLoading.value = true
            try {
                await category.fetchCategories()
                currentDataByOption.value = category.getCategories.map(cat => ({
                    label: cat.name,
                    value: cat._id
                }))
            } catch (err) {
                console.error(err)
            } finally {
                isLoading.value = false
            }
        })



        // Fetch data report
        onMounted(async () => {
            isLoading.value = true
            try {
                await productReport.fetchProductReport();
                currentData.value = productReport.getReport;
            } catch (err) {
                console.log(err);
            }
            finally {
                isLoading.value = false
            }
        });

        // Filtered data based on searchTerm and categoryName
        const filteredData = computed(() => {
            let data = currentData.value;

            // Search filter
            if (searchTerm.value) {
                const term = searchTerm.value.toLowerCase();
                data = data.filter(
                    (item) =>
                        item.name.toLowerCase().includes(term) ||
                        (item.code && item.code.toLowerCase().includes(term)) ||
                        (item.category_id?.name &&
                            item.category_id.name.toLowerCase().includes(term))
                );
            }

            // Category filter
            if (categoryName.value) {
                data = data.filter(
                    (item) => item.category_id?._id === categoryName.value
                );
            }

            return data;
        });

        // Paginated data
        const paginatedData = computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage.value;
            const end = start + itemsPerPage.value;
            return filteredData.value.slice(start, end);
        });

        const totalPages = computed(() => {
            return Math.ceil(filteredData.value.length / itemsPerPage.value);
        });

        // handle page change
        const handlePageChange = (page: number) => {
            currentPage.value = page;
        };

        // Reset page if itemsPerPage changes
        watch(itemsPerPage, () => {
            currentPage.value = 1;
        });




        return {
            currentData,
            currentPage,
            itemsPerPage,
            paginatedData,
            totalPages,
            handlePageChange,
            faEdit,
            faTrash,
            isLoading,
            searchTerm,
            localServer,
            categoryName,
            currentDataByOption
        };
    },
};
</script>

<style scoped>
.arrow-active {
    position: relative;
}

.arrow-active::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 25px solid transparent;
    border-bottom: 25px solid transparent;
    border-left: 18px solid white;
    /* matches the header bg */
}
</style>