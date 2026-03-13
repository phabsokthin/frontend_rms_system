<template>
    <div class="min-h-screen">
        <div class="">

            <ul class="mb-5 bg-white border border-gray-200 divide-y divide-gray-200 shadow">
                <!-- USD -->
                <li class="p-4">
                    <div class="flex items-center justify-between">
                        <h2 class="text-sm text-gray-700 font-bayon">USD</h2>
                        <span class="text-2xl font-bold text-green-700">
                            {{ reportSummary?.byCurrency?.usd?.totalAmount }}
                            <span class="text-lg text-gray-700">$</span>
                        </span>
                    </div>
                    <p class="mt-1 text-gray-700 text-md">
                        ទិញចូល: {{ reportSummary?.byCurrency?.usd?.totalOrders }} |
                        បានទូទាត់: {{ reportSummary?.byCurrency?.usd?.totalPayment }} $ |
                        នៅសល់: {{ reportSummary?.byCurrency?.usd?.totalBalance }} $
                    </p>
                </li>

                <!-- KHR -->
                <li class="p-4">
                    <div class="flex items-center justify-between">
                        <h2 class="text-sm text-gray-500 font-bayon">KHR</h2>
                        <span class="text-2xl font-bold text-green-700">
                            {{ reportSummary?.byCurrency?.khr?.totalAmount }}
                            <span class="text-lg text-gray-700">៛</span>
                        </span>
                    </div>
                    <p class="mt-1 text-gray-700 text-md">
                        ទិញចូល: {{ reportSummary?.byCurrency?.khr?.totalOrders }} |
                        បានទូទាត់: {{ reportSummary?.byCurrency?.khr?.totalPayment }} ៛ |
                        នៅសល់: {{ reportSummary?.byCurrency?.khr?.totalBalance }} ៛
                    </p>
                </li>
            </ul>



            <!-- Header -->
            <div class="mb-[15px] flex items-center justify-between">
                <h1 class="text-xl font-bayon">របាយការណ៍ទិញចូល</h1>
                <div class="flex gap-2">
                    <div class="flex gap-2">
                        <DateTime v-model="start_date" label="ចាប់ផ្តើម" type="date" />
                        <DateTime v-model="end_date" label="បញ្ចប់" type="date" />

                    </div>

                    <!-- Category -->
                    <Select v-model="currency" :options="currentDataByOption" label="ប្រភេទ" required
                        placeholder="ជ្រើសរើសប្រភេទ" />
                    <TextFieldInput v-model="searchTerm" label="ស្វែងរក" placeholder="ឈ្មោះ / ស្ថានភាព"
                        class="font-bayon w-[300px]" />
                </div>
            </div>

            <!-- Table -->

            <div class="overflow-x-auto bg-white border border-gray-200 ">
                <table class="min-w-[2800px] w-full border-collapse">


                    <!-- ================= HEADER ================= -->
                    <thead>
                        <tr class="text-white bg-green-700 text-md font-bayon">
                            <th class="px-6 py-3 border">ល.រ</th>
                            <th class="px-6 py-3 border">អ្នកផ្គត់ផ្គង់</th>
                            <th class="px-6 py-3 border">លេខទូរស័ព្ទ</th>
                            <th class="px-6 py-3 border">អុីម៉ែល</th>
                            <th class="px-6 py-3 border">កាលបរិច្ឆេតទិញចូល</th>
                            <th class="px-6 py-3 border">ចំនួន</th>
                            <th class="px-6 py-3 border">ចំនួនសរុប</th>
                            <th class="px-6 py-3 border">ពន្ធ</th>
                            <th class="px-6 py-3 border">បញ្ចុះតម្លៃ</th>
                            <th class="px-6 py-3 border">បានទូទាត់</th>
                            <th class="px-6 py-3 border">អាស័យដ្ឋាន</th>
                            <th class="px-6 py-3 border">កត់ចំណាំ</th>
                            <th class="px-6 py-3 border">ស្ថានភាព</th>
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
                            class="transition-colors duration-150 cursor-pointer hover:bg-gray-50">

                            <!-- Index -->
                            <td class="px-6 py-3 text-gray-900 border whitespace-nowrap">
                                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
                            </td>

                            <!-- First Name -->
                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data?.supplier_id?.name }}
                            </td>

                            <!-- Last Name -->
                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.supplier_id?.phone }}
                            </td>

                            <!-- Phone -->
                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.supplier_id?.email }}
                            </td>

                            <!-- Gender -->
                            <td class="px-6 py-3 capitalize border whitespace-nowrap font-bayon">
                                <!-- {{ data.gender }} -->
                                {{ formatDate(data.purchase_date as any) }}
                            </td>

                            <!-- Email -->
                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.items.length }} items
                            </td>


                            <!-- Address -->
                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.total_amount }}
                                <span v-if="data.currency === 'usd'">$</span>
                                <span v-else>៛</span>
                            </td>

                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.tax }}
                                <span v-if="data.currency === 'usd'">$</span>
                                <span v-else>៛</span>
                            </td>

                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.discount }}
                                <span v-if="data.currency === 'usd'">$</span>
                                <span v-else>៛</span>
                            </td>

                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.payment }}
                                <span v-if="data.currency === 'usd'">$</span>
                                <span v-else>៛</span>
                            </td>
                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.supplier_id?.address }}
                            </td>

                            <!-- Start Time -->
                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.notes }}
                            </td>

                            <!-- Status -->
                            <td class="px-6 py-3 border whitespace-nowrap font-bayon">
                                <span v-if="data.status === 'pending'"
                                    class="p-1 text-xs text-orange-500 bg-orange-100 rounded-md">Pending</span>
                                <span v-if="data.status === 'received'"
                                    class="p-1 text-xs text-green-500 bg-green-100 rounded-md">Received</span>
                                <span v-if="data.status === 'cancelled'"
                                    class="p-1 text-xs text-yellow-500 bg-yellow-100 rounded-md">Cancelled</span>
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
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Loading from '../../components/ui/Loading.vue';
import TextFieldInput from '../../components/ui/TextFieldInput.vue';
import { localServer } from '../../../server/localServer';
import SellOrder from '../../types/sellOrder';
import { formatDateTime } from '../../utils/formatDate';
import SellOrderDetail from '../sellOrder/SellOrderDetail.vue';
import reportService from '../../services/reportService';
import Select from '../../components/ui/Select.vue';
import DateTime from '../../components/ui/DateTime.vue';
import Purchase from '../../types/purchase';

export default {
    components: { Button, Pagination, Loading, TextFieldInput, SellOrderDetail, Select, DateTime },
    setup() {
        const currentData = ref<Purchase[]>([]);
        const currentPage = ref(1);
        const itemsPerPage = ref(25);
        const showDelete = ref(false);
        const isLoading = ref(false);
        const searchTerm = ref('');
        const reportSummary = ref<any>(null);
        const currency = ref('');

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

        const currentDataByOption = ref([
            { label: 'USD', value: 'usd' },
            { label: 'KHR', value: 'khr' },
        ]);

        onMounted(async () => {
            isLoading.value = true;
            try {
                const response = await reportService.getPurchaseReport();
                currentData.value = response.data;      // purchases array
                reportSummary.value = response.report;  // totals object
            } catch (err) {
                console.log(err);
            } finally {
                isLoading.value = false;
            }
        });

        // Filtered data
        const filteredData = computed(() => {
            const data = Array.isArray(currentData.value) ? currentData.value : [];

            if (!searchTerm.value && !currency.value && !start_date.value && !end_date.value) {
                return data;
            }

            const term = searchTerm.value.toLowerCase();

            return data.filter(item => {
                const supplier = item.supplier_id?.name?.toLowerCase() || '';
                const payment = item.payment_type_id?.name?.toLowerCase() || '';
                const status = item.status?.toLowerCase() || '';
                const itemCurrency = item.currency?.toLowerCase() || '';
                const createdAt = new Date(item?.created_at as string);

                const matchesSearch =
                    !searchTerm.value ||
                    supplier.includes(term) ||
                    payment.includes(term) ||
                    status.includes(term);

                const matchesCurrency =
                    !currency.value || itemCurrency === currency.value.toLowerCase();

                const matchesDate =
                    (!start_date.value || createdAt >= new Date(start_date.value)) &&
                    (!end_date.value || createdAt <= new Date(end_date.value));

                return matchesSearch && matchesCurrency && matchesDate;
            });
        });

        // Pagination
        const paginatedData = computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage.value;
            const end = start + itemsPerPage.value;
            return filteredData.value.slice(start, end);
        });

        const totalPages = computed(() => {
            return Math.ceil(filteredData.value.length / itemsPerPage.value);
        });

        const handlePageChange = (page: number) => {
            currentPage.value = page;
        };

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
            showDelete,
            searchTerm,
            localServer,
            formatDateTime,
            reportSummary,
            currentDataByOption,
            currency,
            start_date,
            end_date,
            formatDate,
        };
    },
};
</script>


<style scoped></style>