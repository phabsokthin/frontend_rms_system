<template>
    <div class="min-h-screen">
        <div>
            <!-- Header -->
            <div class="mb-[15px] flex items-center justify-between">
                <h1 class="text-xl font-bayon">បញ្ជីប្រភេទផលិតផល</h1>
                <div class="flex gap-2">
                    <TextFieldInput v-model="searchTerm" placeholder="ស្វែងរកប្រភេទផលិតផល" class="font-bayon" />
                    <Button @click="handleCreatePopup" variant="green" class="rounded-none font-bayon">+
                        បង្កើតថ្មី</Button>
                </div>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto bg-white border-gray-200">
                <table class="min-w-full border-gray-200">
                    <thead class="bg-gray-100">
                        <tr class="text-white bg-green-700 text-md font-bayon">
                            <th scope="col"
                                class="px-6 py-3 text-left uppercase w-[50px] arrow-active border border-t border-r border-b border-white border-l-0">
                                ល.រ
                            </th>
                            <th scope="col"
                                class="px-6 py-3 tracking-wider text-left uppercase border border-gray-200 w-[200px]">
                                ឈ្មោះ
                            </th>
                            <th scope="col" class="px-6 py-3 tracking-wider text-left uppercase border border-gray-200">
                                ពិពណ៌នា
                            </th>
                            <th scope="col"
                                class="px-6 py-3 tracking-wider text-center uppercase border border-gray-200 w-[100px]">
                                សកម្មភាព
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white">
                        <tr v-if="isLoading">
                            <Loading />
                        </tr>
                        <template v-else>
                            <!-- Loading state -->
                            <tr v-if="isLoading">
                                <td colspan="4" class="px-6 py-3 text-center text-gray-500">
                                    កំពុងផ្ទុកទិន្នន័យ...
                                </td>
                            </tr>

                            <!-- No data state -->
                            <tr v-else-if="paginatedData.length === 0">
                                <td colspan="4" class="px-6 py-3 text-center text-gray-500 border font-bayon">
                                    មិនមានទិន្នន័យ
                                </td>
                            </tr>

                            <!-- Data rows -->
                            <tr v-else v-for="(data, index) in paginatedData" :key="data._id"
                                class="transition-colors duration-150 hover:bg-gray-50">
                                <td class="px-6 py-3 text-gray-900 border border-gray-200 text-md whitespace-nowrap">
                                    {{ index + 1 + (currentPage - 1) * itemsPerPage }}
                                </td>
                                <td class="px-6 py-3 text-gray-900 border border-gray-200 text-md whitespace-nowrap">
                                    {{ data.name }}
                                </td>
                                <td class="px-6 py-3 text-gray-900 border border-gray-200 text-md whitespace-nowrap">
                                    {{ data.description }}
                                </td>
                                <td
                                    class="px-6 py-3 text-center text-gray-900 border border-gray-200 text-md whitespace-nowrap gap-x-2">
                                    <font-awesome-icon :icon="faEdit" @click="handleUpdatePopup(data)"
                                        class="text-xl text-blue-600 cursor-pointer hover:text-blue-700" />
                                    <font-awesome-icon :icon="faTrash" @click="handleDeletePopup(data._id, data.name)"
                                        class="text-xl text-red-600 cursor-pointer hover:text-red-700" />
                                </td>
                            </tr>
                        </template>
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
import { categoryStore } from '../../stores/category.store';
import type Category from '../../types/category';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import Loading from '../../components/ui/Loading.vue';
import DeletePopup from '../../components/ui/DeletePopup.vue';
import TextFieldInput from '../../components/ui/TextFieldInput.vue';
import { useNotification } from '../../composables/useNotification';
import CategoryForm from './CategoryForm.vue';



export default {
    components: { Button, Pagination, Loading, DeletePopup, TextFieldInput, CategoryForm },
    setup() {
        const category = categoryStore();
        const currentData = ref<Category[]>([]);
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

        onMounted(async () => {
            isLoading.value = true
            try {
                await category.fetchCategories();
                currentData.value = category.getCategories;
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
                    item.name.toLowerCase().includes(term) ||
                    (item.description && item.description.toLowerCase().includes(term))
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

        const handlePageChange = (page: number) => {
            currentPage.value = page;
        };

        // Reset page if itemsPerPage changes
        watch(itemsPerPage, () => {
            currentPage.value = 1;
        });

        // handle create popup
        const handleCreatePopup = () => {
            currentComponent.value = "CategoryForm"
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
                const res = await category.deleteCategory(setId.value)


                //real-time 

                await category.fetchCategories();
                currentData.value = category.getCategories;
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
            currentComponent.value = "CategoryForm"
            updateData.value = data
            console.log(updateData.value)
        }

        // loadData
        async function loadData() {
            await category.fetchCategories();
            currentData.value = category.getCategories;
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