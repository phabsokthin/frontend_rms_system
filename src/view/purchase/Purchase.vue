<template>
    <div class="min-h-screen">
        <div class="px-4">
            <!-- Header -->
            <div class="mb-[15px] flex items-center justify-between">
                <h1 class="text-xl font-bayon">បញ្ជីការទិញចូល</h1>
                <div class="flex gap-2">
                    <TextFieldInput v-model="searchTerm" placeholder="ស្វែងរកអ្នកផ្គត់ផ្គង​ / លេខទូរស័ព្ទ" class="w-[250px] font-bayon" />
                    <Button @click="handleCreatePopup" variant="green" class="rounded-none font-bayon">+
                        បង្កើតថ្មី</Button>
                </div>
            </div>

            <!-- Table -->

            <div class="overflow-x-auto bg-white border border-gray-200 ">
                <table class="min-w-[1800px] w-full border-collapse">

                    <!-- ================= HEADER ================= -->
                    <thead>
                        <tr class="text-white bg-green-700 text-md font-bayon">
                            <th class="px-6 py-3 border">ល.រ</th>
                            <th class="px-6 py-3 border">អ្នកផ្គត់ផ្គង់</th>
                            <th class="px-6 py-3 border">លេខទូរស័ព្ទ</th>
                            <th class="px-6 py-3 border">អុីម៉ែល</th>
                            <th class="px-6 py-3 border">កាលបរិច្ឆេតទិញចូល</th>
                            <th class="px-6 py-3 border">ចំនួន</th>
                            <th class="px-6 py-3 border">អាស័យដ្ឋាន</th>
                            <th class="px-6 py-3 border">ចំនួនសរុប</th>
                            <th class="px-6 py-3 border">កត់ចំណាំ</th>
                            <th class="px-6 py-3 border">ស្ថានភាព</th>
                            <th class="px-6 py-3 text-center border">សកម្មភាព</th>
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
                            class="transition-colors duration-150 hover:bg-gray-50">

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
                                {{ formatDate(data.purchase_date) }}
                            </td>

                            <!-- Email -->
                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.items.length }}
                            </td>

                            <!-- Position -->
                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.supplier_id?.address }}
                            </td>

                            <!-- Address -->
                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.total_amount }} 
                                <span v-if="data.currency === 'usd'">$</span>
                                 <span v-else>៛</span>
                            </td>

                            <!-- Start Time -->
                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.notes }}
                            </td>



                            <!-- Status -->
                            <td class="px-6 py-3 border whitespace-nowrap font-bayon">
                                <span v-if="data.status === 'pending'"
                                    class="p-1 text-xs text-orange-500 rounded-md bg-orange-50">កំពុងរង់ចាំ</span>
                            </td>

                            <!-- Actions -->
                            <td class="px-6 py-3 space-x-3 text-center border whitespace-nowrap">
                                <font-awesome-icon :icon="faEdit" @click="handleUpdatePopup(data)"
                                    class="text-xl text-blue-600 cursor-pointer hover:text-blue-700" />
                                <font-awesome-icon :icon="faTrash"
                                    @click="handleDeletePopup(data._id, data.supplier_id?.name)"
                                    class="text-xl text-red-600 cursor-pointer hover:text-red-700" />
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
            <component :is="currentComponent" @close="currentComponent = ''" :loadData="loadData"
                :updateData="updateData" />
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
import Purchase from '../../types/purchase';
import { purchaseStore } from '../../stores/purchase.store';
import { formatDate } from '../../utils/formatDate';
import PurchaseForm from './PurchaseForm.vue';




export default {
    components: { Button, Pagination, Loading, DeletePopup, TextFieldInput,PurchaseForm},
    setup() {
        const purchse = purchaseStore();
        const currentData = ref<Purchase[]>([]);
        const currentPage = ref(1);
        const itemsPerPage = ref(10);
        const showDelete = ref(false)
        const isLoading = ref(false)
        const searchTerm = ref("")
        const showName = ref("")
        const setId = ref("")

        const { notify } = useNotification()

        const currentComponent = ref("")
        const updateData = ref("")

        // Fetch data
        onMounted(async () => {
            isLoading.value = true
            try {
                await purchse.fetchDta();
                currentData.value = purchse.getPurchase;
            } catch (err) {
                console.log(err);
            }
            finally {
                isLoading.value = false
            }
        });

        // Filtered data based on searchTerm
        const filteredData = computed(() => {
            if (!searchTerm.value) return currentData.value; // <- problem if currentData.value is not an array
            const term = searchTerm.value.toLowerCase();
            return currentData.value.filter(
                (item) =>
                    item.supplier_id.name.toLowerCase().includes(term) ||
                    (item.supplier_id.phone && item.notes.toLowerCase().includes(term))
            );
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
            currentComponent.value = "PurchaseForm"
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

                const res = await purchse.deleteData(setId.value)
                //real-time 
                await purchse.fetchDta();
                currentData.value = purchse.getPurchase;
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
            currentComponent.value = "PurchaseForm"
            updateData.value = data
            console.log(updateData.value)
        }

        // loadData
        async function loadData() {
            await purchse.fetchDta();
            currentData.value = purchse.getPurchase;
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
            formatDate
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