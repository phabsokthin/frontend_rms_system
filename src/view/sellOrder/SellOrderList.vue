<template>
    <div class="min-h-screen">
        <div class="px-4">
            <!-- Header -->
            <div class="mb-[15px] flex items-center justify-between">
                <h1 class="text-xl font-bayon">បញ្ជីការលក់</h1>
                <div class="flex gap-2">
                    <TextFieldInput v-model="searchTerm" placeholder="ស្វែងរក / លេខវិកយ្យប័ត្រ / លេខតុ​ / អតិថិជន"
                        class="font-bayon w-[400px]" />
                    <!-- <Button @click="handleCreatePopup" variant="green" class="rounded-none font-bayon">+
                        បង្កើតថ្មី</Button> -->
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
                            <th class="px-3 py-3 text-center border w-[100px]">សកម្មភាព</th>
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
                            class="transition-colors duration-150 cursor-pointer hover:bg-gray-100"
                            @click="handleViewSaleOrderDetail(data, data._id.slice(-6).toUpperCase())">
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
                            <td class="px-6 py-3 text-center border whitespace-nowrap font-bayon">
                                <span v-if="data.status === 'pending'"
                                    class="p-1 text-xs text-yellow-500 bg-orange-100 rounded-md">កំពុងរង់ចាំ</span>
                                 <span v-if="data.status === 'processing'"
                                    class="p-1 text-xs text-orange-500 bg-orange-100 rounded-md">កំពុងដំណើរការ</span>
                                   <span v-if="data.status === 'done'"
                                    class="p-1 text-xs text-green-500 bg-green-100 rounded-md">រួចរាល់</span>
                                     <span v-if="data.status === 'paid'"
                                    class="p-1 text-xs text-blue-500 bg-blue-100 rounded-md">បានទូទាត់</span>
                            </td>

                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ formatDateTime(data.order_time) }}
                            </td>

                            <!-- Actions -->
                            <td class="py-3 text-center border whitespace-nowrap">
                                <div class="flex items-center justify-between gap-2 p-2">
                                    <Button variant="green" @click="(e: MouseEvent) => {
                                        e.stopPropagation();
                                        handleViewSaleOrderDetail(data, data._id.slice(-6).toUpperCase());
                                    }" class="text-xs rounded-none font-bayon">
                                        មើល
                                    </Button>
                                    <router-link v-if="showRole?.role !== 'kitchen'"
                                        :to="{ name: 'Sell', params: { id: data._id } }" class="text-xs">
                                        <Button variant="blue"
                                            class="text-xs bg-blue-600 rounded-none font-bayon hover:bg-blue-500">
                                            កែប្រែ
                                        </Button>
                                    </router-link>

                                    <Button v-if="showRole?.role !== 'kitchen'" variant="red" @click="(e: MouseEvent) => {
                                        e.stopPropagation();
                                        handleDeletePopup(data._id, `${data.customer_id?.first_name} ${data.customer_id?.last_name}`);
                                    }"
                                        class="text-xs text-red-600 rounded-none cursor-pointer font-bayon hover:text-white">
                                        លុប
                                    </Button>
                                </div>
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

            <DeletePopup v-model="showDelete" :name="showName" @confirm="handleDelete" />
        </div>


        <div>
            <component :is="currentComponent" @close="currentComponent = ''" :showInvoice="showInvoice"
                :loadData="loadData" :showCurrentDetail="showCurrentDetail" />
        </div>

        <!-- <pre>{{ showRole }}</pre> -->

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


import { localServer } from '../../../server/localServer';
import { sellOrderStore } from '../../stores/sellOrder.store';
import SellOrder from '../../types/sellOrder';
import { formatDateTime } from '../../utils/formatDate';
// import ProductForm from './ProductForm.vue';
import SellOrderDetail from './SellOrderDetail.vue';

export default {
    components: { Button, Pagination, Loading, DeletePopup, TextFieldInput, SellOrderDetail },
    setup() {
        const sellOrder = sellOrderStore();
        const currentData = ref<SellOrder[]>([]);
        const currentPage = ref(1);
        const itemsPerPage = ref(25);
        const showDelete = ref(false)
        const isLoading = ref(false)
        const searchTerm = ref("")
        const showName = ref("")
        const setId = ref("")

        const { notify } = useNotification()

        const currentComponent = ref("")
        const updateData = ref("")

        const showCurrentDetail = ref<SellOrder | null>(null)
        const showInvoice = ref("")


        const showRole = ref<any>(null);

        onMounted(() => {
            const user = localStorage.getItem("user");
            showRole.value = user ? JSON.parse(user) : null;
        });

        // Fetch data
        onMounted(async () => {

            isLoading.value = true
            try {
                await sellOrder.fetchDta();
                currentData.value = sellOrder.getSellOrder;
            } catch (err) {
                console.log(err);
            }
            finally {
                isLoading.value = false
            }
        });

        onMounted(() => {

        })


        function invoiceNumber(id: string) {
            if (!id) return "";
            return id.slice(-6).toUpperCase(); // last 6 chars of _id
        }

        const filteredData = computed(() => {
            // Ensure currentData.value is an array
            const data = Array.isArray(currentData.value) ? currentData.value : [];

            if (!searchTerm.value) return data;

            const term = searchTerm.value.toLowerCase();

            return data.filter(item => {
                const firstName = item.customer_id?.first_name?.toLowerCase() || '';
                const lastName = item.customer_id?.last_name?.toLowerCase() || '';
                const tableNumber = item.table_id?.table_number?.toLowerCase() || '';
                const invoice = invoiceNumber(item._id).toLowerCase();

                // Check if search term matches customer, table, or invoice
                return (
                    firstName.includes(term) ||
                    lastName.includes(term) ||
                    tableNumber.includes(term) ||
                    invoice.includes(term)
                );
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


        // handle create popup
        const handleCreatePopup = () => {
            currentComponent.value = "ProductForm"
            updateData.value = ""
        }

        // delete poup 
        const handleDeletePopup = (id: string, name: string) => {
            setId.value = id
            showDelete.value = true
            showName.value = name
        }

        const handleDelete = async () => {
            try {

                const res = await sellOrder.deleteData(setId.value)
                //real-time 
                await sellOrder.fetchDta();
                currentData.value = sellOrder.getSellOrder;
                notify({
                    message: res.message,
                    type: "success",
                })
            } catch (error: any) {

                const message =
                    error?.response?.data?.message || error.message
                notify({
                    message,
                    type: "error",
                })
            }
        }

        const handleUpdatePopup = (data: any) => {
            currentComponent.value = "ProductForm"
            updateData.value = data
            console.log(updateData.value)
        }

        // loadData
        async function loadData() {
            await sellOrder.fetchDta();
            currentData.value = sellOrder.getSellOrder;
        }

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
            handleDelete,
            searchTerm,
            handleDeletePopup,
            currentComponent,
            handleCreatePopup,
            loadData,
            handleUpdatePopup,
            updateData,
            localServer,
            formatDateTime,
            handleViewSaleOrderDetail,
            showCurrentDetail,
            showInvoice,
            showRole
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