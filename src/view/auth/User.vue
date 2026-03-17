<template>
    <div class="min-h-screen">
        <div class="px-4">
            <!-- Header -->
            <div class="mb-[15px] flex items-center justify-between">
                <h1 class="text-xl font-bayon">បញ្ជីអ្នកប្រើប្រាស់</h1>
                <div class="flex gap-2">
                    <TextFieldInput v-model="searchTerm" placeholder="ស្វែងរកបុគ្គលិក" class="font-bayon" />
                    <Button @click="handleCreatePopup" variant="green" class="rounded-none font-bayon">+
                        បង្កើតថ្មី</Button>
                </div>
            </div>

            <!-- Table -->

            <div class="overflow-x-auto bg-white border border-gray-200 ">
                <table class="min-w-[1100px] w-full border-collapse">

                    <!-- ================= HEADER ================= -->
                    <thead>
                        <tr class="text-white bg-green-700 text-md font-bayon">
                            <th class="px-6 py-3 border">ល.រ</th>
                            <th class="px-6 py-3 border">ឈ្មោះ</th>
                            <th class="px-6 py-3 border">អុីម៉ែល</th>
                            <th class="px-6 py-3 border">តួនាទី</th>
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
                                {{ data.username }}
                            </td>

                            <!-- Email -->
                            <td class="px-6 py-3 border whitespace-nowrap">
                                {{ data.email }}
                            </td>

                            <!-- Status -->
                            <td class="px-6 py-3 border whitespace-nowrap font-bayon">
                                <span>{{ data.role }}</span>
                            </td>



                            <!-- Status -->
                            <td class="px-6 py-3 border whitespace-nowrap font-bayon">
                                <span :class="data.status
                                    ? 'text-green-600 font-semibold'
                                    : 'text-red-600 font-semibold'">
                                    {{ data.status ? 'សកម្ម' : 'អសកម្ម' }}
                                </span>
                            </td>

                            <td class="px-6 py-3 space-x-3 text-center border whitespace-nowrap">
                                <!-- Edit button -->
                                <font-awesome-icon :icon="faEdit"
                                    @click="data._id !== getUserLocalObj.id ? handleUpdatePopup(data) : null" :class="[
                                        'text-xl cursor-pointer hover:text-blue-700',
                                        data._id === getUserLocalObj.id ? 'text-gray-400 cursor-not-allowed hover:text-gray-400' : 'text-blue-600'
                                    ]" />

                                <!-- Delete button -->
                                <font-awesome-icon :icon="faTrash"
                                    @click="data._id !== getUserLocalObj.id ? handleDeletePopup(data._id, data.username as string) : null"
                                    :class="[
                                        'text-xl cursor-pointer hover:text-red-700',
                                        data._id === getUserLocalObj.id ? 'text-gray-400 cursor-not-allowed hover:text-gray-400' : 'text-red-600'
                                    ]" />
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
        <!-- <pre>{{ paginatedData }}</pre> -->

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
import UserAuth from '../../types/auth';
import { useAuthStore } from '../../stores/auth.store';
import UserForm from './UserForm.vue';




export default {
    components: { Button, Pagination, Loading, DeletePopup, TextFieldInput, UserForm },
    setup() {
        const userAuth = useAuthStore()
        const currentData = ref<UserAuth[]>([]);
        const currentPage = ref(1);
        const itemsPerPage = ref(10);
        const showDelete = ref(false)
        const isLoading = ref(false)
        const searchTerm = ref("")
        const showName = ref("")
        const setId = ref("")
        const getUser = ref<UserAuth | null>(null);
        const { notify } = useNotification()
        const currentComponent = ref("")
        const updateData = ref("")
        const getUserLocal = localStorage.getItem("user")
        const getUserLocalObj = ref(JSON.parse(getUserLocal as any) || null)

        // // Fetch data
        // onMounted(async () => {
        //     isLoading.value = true
        //     try {
        //         await userAuth.fetchAllUser();
        //         currentData.value = userAuth.getAllUser;


        //         // console.log("userData", currentData.value)
        //     } catch (err) {
        //         console.log(err);
        //     }
        //     finally {
        //         isLoading.value = false
        //     }
        // });

        onMounted(async () => {
            isLoading.value = true
            try {
                await userAuth.fetchAllUser();

                // filter out admin
                currentData.value = userAuth.getAllUser.filter(
                    (user: any) => user.role !== "admin"
                );

            } catch (err) {
                console.log(err);
            } finally {
                isLoading.value = false
            }
        });


        const filteredData = computed(() => {

            const data = Array.isArray(currentData.value)
                ? currentData.value
                : []

            if (!searchTerm.value) {
                return data
            }

            const term = searchTerm.value.toLowerCase()

            return data.filter((item: any) =>
                item.username?.toLowerCase().includes(term) ||
                item.email?.toLowerCase().includes(term) ||
                item.role?.toLowerCase().includes(term)
            )
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
            currentComponent.value = "UserForm"
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

                const res = await userAuth.deleteData(setId.value)
                //real-time 
                await userAuth.fetchAllUser();
                currentData.value = userAuth.getAllUser;
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
            currentComponent.value = "UserForm"
            updateData.value = data
            console.log(updateData.value)
        }

        // loadData
        async function loadData() {
            await userAuth.fetchAllUser();
            currentData.value = userAuth.getAllUser;
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

            getUserLocal,
            getUserLocalObj
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