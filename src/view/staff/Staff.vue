<template>
    <div class="min-h-screen">
        <div class="px-4">
            <!-- Header -->
            <div class="mb-[15px] flex items-center justify-between">
                <h1 class="text-xl font-bayon">បញ្ជីបុគ្គលិក</h1>
                <div class="flex gap-2">
                    <TextFieldInput v-model="searchTerm" placeholder="ស្វែងរកបុគ្គលិក" class="font-bayon" />
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
                            <th class="px-6 py-3 border">ត្រកូល</th>
                            <th class="px-6 py-3 border">ឈ្មោះ</th>
                            <th class="px-6 py-3 border">លេខទូរស័ព្ទ</th>
                            <th class="px-6 py-3 border">ភេទ</th>
                            <th class="px-6 py-3 border">អុីម៉ែល</th>
                            <th class="px-6 py-3 border">តួនាទី</th>
                            <th class="px-6 py-3 border">អាស័យដ្ឋាន</th>
                            <th class="px-6 py-3 border">ម៉ោងចូល</th>
                            <th class="px-6 py-3 border">ម៉ោងចេញ</th>
                            <th class="px-6 py-3 border">ប្រាក់ខែ</th>
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
                                {{ data.first_name }}
                            </td>

                            <!-- Last Name -->
                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.last_name }}
                            </td>

                            <!-- Phone -->
                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.phone }}
                            </td>

                            <!-- Gender -->
                            <td class="px-6 py-3 capitalize border whitespace-nowrap font-bayon">
                                <!-- {{ data.gender }} -->

                                <span v-if="data.gender === 'male'">ប្រុស</span>
                                <span v-else-if="data.gender === 'female'">ស្រី</span>
                            </td>

                            <!-- Email -->
                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.email }}
                            </td>

                            <!-- Position -->
                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.position }}
                            </td>

                            <!-- Address -->
                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.address }}
                            </td>

                            <!-- Start Time -->
                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.start_time }}
                            </td>

                            <!-- End Time -->
                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.end_time }}
                            </td>

                            <!-- Salary -->
                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.salary }}
                            </td>

                            <!-- Status -->
                            <td class="px-6 py-3 border whitespace-nowrap font-bayon">
                                <span :class="data.status
                                    ? 'text-green-600 font-semibold'
                                    : 'text-red-600 font-semibold'">
                                    {{ data.status ? 'សកម្ម' : 'អសកម្ម' }}
                                </span>
                            </td>

                            <!-- Actions -->
                            <td class="px-6 py-3 space-x-3 text-center border whitespace-nowrap">
                                <font-awesome-icon :icon="faEdit" @click="handleUpdatePopup(data)"
                                    class="text-xl text-blue-600 cursor-pointer hover:text-blue-700" />
                                <font-awesome-icon :icon="faTrash" @click="handleDeletePopup(data._id, data.last_name)"
                                    class="text-xl text-red-600 cursor-pointer hover:text-red-700" />
                            </td>

                        </tr>

                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="flex items-center justify-between mt-3">
                <!-- Optional: CustomSelect for items per page -->
                <!-- <CustomSelect v-model="itemsPerPage" :options="selectLimit" label="បង្ហាញ" placeholder="Select one" /> -->

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
import { staffStore } from '../../stores/staff.store';
import Staff from '../../types/staff';
import StaffForms from './StaffForms.vue';




export default {
    components: { Button, Pagination, Loading, DeletePopup, TextFieldInput, StaffForms },
    setup() {
        const staff = staffStore();
        const currentData = ref<Staff[]>([]);
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
                await staff.fetchDta();
                currentData.value = staff.getStaff;
            } catch (err) {
                console.log(err);
            }
            finally {
                isLoading.value = false
            }
        });

        // Filtered data based on searchTerm
        const filteredData = computed(() => {
            if (!searchTerm.value) return currentData.value;

            const term = searchTerm.value.toLowerCase();
            return currentData.value.filter(
                (item) =>
                    item.first_name.toLowerCase().includes(term) ||
                    (item.last_name && item.position.toLowerCase().includes(term))
            );
        })
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
            currentComponent.value = "StaffForms"
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

                const res = await staff.deleteData(setId.value)
                //real-time 
                await staff.fetchDta();
                currentData.value = staff.getStaff;
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
            currentComponent.value = "StaffForms"
            updateData.value = data
            console.log(updateData.value)
        }

        // loadData
        async function loadData() {
            await staff.fetchDta();
            currentData.value = staff.getStaff;
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
            updateData
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