<template>
    <div class="min-h-screen">
        <div class="">

            <div class="grid grid-cols-1 gap-4 mt-4 mb-4 md:grid-cols-2">
                <!-- USD Box -->
                <div class="p-6 transition bg-white border border-gray-200 shadow hover:shadow-md">
                    <h2 class="text-sm text-gray-500 font-bayon">USD</h2>
                    <p class="mt-2 text-2xl font-bold text-green-700">
                        {{ reportSummary?.byCurrency?.usd?.totalPayment }}
                        <span class="text-lg text-gray-500">$</span>
                    </p>
                    <p class="mt-1 text-sm text-gray-400">
                        Orders: {{ reportSummary?.byCurrency?.usd?.totalOrders }}
                        <span class="font-bayon">បានទូទាត់</span>: {{ reportSummary?.byCurrency?.usd?.totalPayment }}
                        <span class="font-bayon">នៅសល់</span>: {{ reportSummary?.byCurrency?.usd?.totalAmount }}
                    </p>
                </div>

                <!-- KHR Box -->
                <div class="p-6 transition bg-white border border-gray-200 shadow hover:shadow-md">
                    <h2 class="text-sm text-gray-500 font-bayon">KHR</h2>
                    <p class="mt-2 text-2xl font-bold text-green-700">
                        {{ reportSummary?.byCurrency?.khr?.totalPayment }}
                        <span class="text-lg text-gray-500">៛</span>
                    </p>
                    <p class="mt-1 text-sm text-gray-400">
                        Orders: {{ reportSummary?.byCurrency?.khr?.totalOrders }}
                        <span class="font-bayon">បានទូទាត់</span>: {{ reportSummary?.byCurrency?.khr?.totalPayment }}
                        <span class="font-bayon">នៅសល់</span>: {{ reportSummary?.byCurrency?.khr?.totalAmount }}
                    </p>
                </div>
            </div>



            <!-- Header -->
            <div class="mb-[15px] flex items-center justify-between">
                <h1 class="text-xl font-bayon">របាយការណ៍លក់</h1>
                <div class="flex gap-2">
                    <div class="flex gap-2">
                        <DateTime v-model="start_date" label="ចាប់ផ្តើម" type="date" />
                        <DateTime v-model="end_date" label="បញ្ចប់" type="date" />

                    </div>

                    <!-- Category -->
                    <Select v-model="currency" :options="currentDataByOption" label="ប្រភេទ" required
                        placeholder="ជ្រើសរើសប្រភេទ" />
                    <TextFieldInput v-model="searchTerm" label="ស្វែងរក"
                        placeholder="ស្វែងរក / លេខវិកយ្យប័ត្រ / លេខតុ​ / អតិថិជន" class="font-bayon w-[300px]" />
                </div>
            </div>

            <!-- Table -->

            <div class="overflow-x-auto bg-white border border-gray-200 ">
                <table class="min-w-[2800px] w-full border-collapse">

                    <!-- ================= HEADER ================= -->
                    <thead>
                        <tr class="text-white bg-green-700 text-md font-bayon">
                            <th class="px-6 py-3 border">ល.រ</th>
                            <th class="px-6 py-3 border">លេខវិកយ្យប័ត្រ</th>
                            <th class="px-6 py-3 border">អតិថិជន</th>
                            <th class="px-6 py-3 border">លេខទូរស័ព្ទ</th>
                            <th class="px-6 py-3 border">តុលេខ</th>
                            <th class="px-6 py-3 border">បុគ្គលិក</th>
                            <th class="px-6 py-3 border">ចំនួន</th>
                            <th class="px-6 py-3 border">បង់ពន្ធ</th>
                            <th class="px-6 py-3 border">បញ្ចុះតម្លៃ</th>
                            <th class="px-6 py-3 border">ចំនួនសរុប</th>
                            <!-- <th class="px-6 py-3 border">ចំនួន</th> -->
                            <th class="px-6 py-3 border">បានទូទាត់ចំនួន</th>
                            <th class="px-6 py-3 border">រូបបិយប័ណ្ណ</th>
                            <th class="px-6 py-3 border">វិធីសាស្រ្តទាត់</th>
                            <th class="px-6 py-3 border">កត់ចំណាំ</th>
                            <th class="px-6 py-3 border">ស្ថានភាព</th>
                            <th class="px-6 py-3 border">ម៉ោងកម្មង់</th>
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
                            class="transition-colors duration-150 cursor-pointer hover:bg-gray-100">
                            <td class="px-6 py-3 text-gray-900 border whitespace-nowrap">
                                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
                            </td>

                            <td class="px-6 py-3 font-bold border whitespace-nowrap">
                                #{{ data._id.slice(-6).toUpperCase() }}
                            </td>

                            <td class="px-6 py-3 border whitespace-nowrap font-bayon">
                                {{ data.customer_id?.first_name }} {{ data.customer_id?.last_name }}
                            </td>

                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.customer_id?.phone }}
                            </td>

                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.table_id?.table_number }}
                            </td>


                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.staff_id?.first_name }} {{ data.staff_id?.last_name }}
                            </td>


                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.items?.length }}
                            </td>



                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.tax }}
                                <span v-if="data.currency === 'usd'">$</span>
                                <span v-else>៛</span>
                            </td>


                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.discount }} ថេរ
                            </td>

                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.total_amount }}
                                <span v-if="data.currency === 'usd'">$</span>
                                <span v-else>៛</span>
                            </td>
                            <!-- <td class="px-6 py-3 border whitespace-nowrap">
                        
                            </td> -->

                            <td class="px-6 py-3 border whitespace-nowrap ">
                                <div class="flex flex-col">
                                    <div> <span class="font-bayon"></span> {{ data.payment }}
                                        <span v-if="data.currency === 'usd'">$</span>
                                        <span v-else>៛</span>
                                    </div>

                                    <!-- <span class="text-sm">លុយអាប់​ {{ data.payment - Number(data.total_amount) }}</span> -->
                                </div>
                            </td>


                            <td class="px-6 py-3 uppercase border whitespace-nowrap">
                                {{ data.currency }}
                            </td>


                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.payment_type_id?.name }}
                            </td>



                            <td class="px-6 py-3 border whitespace-nowrap font-bayon">
                                {{ data.notes }}
                            </td>
                            <td class="px-6 py-3 border whitespace-nowrap font-bayon">
                                <span v-if="data.status === 'pending'"
                                    class="p-1 text-xs text-orange-500 rounded-md bg-orange-50">កំពុងរង់ចាំ</span>
                            </td>

                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ formatDateTime(data.order_time) }}
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
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import Loading from '../../components/ui/Loading.vue';
import TextFieldInput from '../../components/ui/TextFieldInput.vue';



import { localServer } from '../../../server/localServer';
import SellOrder from '../../types/sellOrder';
import { formatDateTime } from '../../utils/formatDate';
// import ProductForm from './ProductForm.vue';
import SellOrderDetail from '../sellOrder/SellOrderDetail.vue';
import { reportStore } from '../../stores/report.store';
import SellOrderReport from '../../types/sellReport';
import reportService from '../../services/reportService';
import Select from '../../components/ui/Select.vue';
import DateTime from '../../components/ui/DateTime.vue';

export default {
    components: { Button, Pagination, Loading, TextFieldInput, SellOrderDetail, Select, DateTime },
    setup() {
        const sellReport = reportStore();
        const currentData = ref<SellOrderReport[]>([]);
        const currentPage = ref(1);
        const itemsPerPage = ref(25);
        const showDelete = ref(false)
        const isLoading = ref(false)
        const searchTerm = ref("")
        const showName = ref("")
        const report = ref<SellOrderReport | null>(null)

        // Helper to format date as YYYY-MM-DD
        function formatDate(date: Date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        }

        // First day of current month
        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1);

        // Last day of current month
        const lastDayOfMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 0);

        const start_date = ref(formatDate(firstDayOfMonth));
        const end_date = ref(formatDate(lastDayOfMonth));



        const currentComponent = ref("")
        const updateData = ref("")

        const showCurrentDetail = ref<SellOrder | null>(null)
        const showInvoice = ref("")
        const reportSummary = ref<any>(null);

        const currency = ref('');
        const currentDataByOption = ref([
            { label: 'USD', value: 'usd' },
            { label: 'KHR', value: 'khr' }
        ])




        onMounted(async () => {
            isLoading.value = true;
            try {
                const response = await reportService.getSellOrderReport();
                // response contains { message, data, report }
                currentData.value = response.data;      // orders array
                reportSummary.value = response.report;  // totals object
                console.log(currentData.value);
                console.log(reportSummary.value);
            } catch (err) {
                console.log(err);
            } finally {
                isLoading.value = false;
            }
        });



        function invoiceNumber(id: string) {
            if (!id) return "";
            return id.slice(-6).toUpperCase(); // last 6 chars of _id
        }

        const filteredData = computed(() => {
            const data = Array.isArray(currentData.value) ? currentData.value : [];

            if (!searchTerm.value && !currency.value && !start_date.value && !end_date.value) {
                return data;
            }

            const term = searchTerm.value.toLowerCase();

            return data.filter(item => {
                const firstName = item.customer_id?.first_name?.toLowerCase() || '';
                const lastName = item.customer_id?.last_name?.toLowerCase() || '';
                const tableNumber = item.table_id?.table_number?.toLowerCase() || '';
                const invoice = invoiceNumber(item._id).toLowerCase();
                const itemCurrency = item.currency?.toLowerCase() || '';
                const createdAt = new Date(item?.created_at as string);

                // Search filter
                const matchesSearch =
                    !searchTerm.value ||
                    firstName.includes(term) ||
                    lastName.includes(term) ||
                    tableNumber.includes(term) ||
                    invoice.includes(term);

                // Currency filter
                const matchesCurrency =
                    !currency.value || itemCurrency === currency.value.toLowerCase();

                // Date filter
                const matchesDate =
                    (!start_date.value || createdAt >= new Date(start_date.value)) &&
                    (!end_date.value || createdAt <= new Date(end_date.value));

                return matchesSearch && matchesCurrency && matchesDate;
            });
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


        const handleViewSaleOrderDetail = (data: SellOrder, invoice: string) => {
            currentComponent.value = "SellOrderDetail"
            showCurrentDetail.value = data
            showInvoice.value = invoice

        }

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
            showName,
            showDelete,

            searchTerm,

            currentComponent,

            updateData,
            localServer,
            formatDateTime,
            handleViewSaleOrderDetail,
            showCurrentDetail,
            showInvoice,
            report,
            reportSummary,
            currentDataByOption,
            currency,
            start_date,
            end_date
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