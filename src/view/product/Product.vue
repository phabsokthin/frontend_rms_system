<template>
    <div class="min-h-screen">
        <div class="px-4">
            <!-- Header -->
            <div class="mb-[15px] flex items-center justify-between">
                <h1 class="text-xl font-bayon">បញ្ជីផលិតផល</h1>
                <div class="flex gap-2">
                    <TextFieldInput v-model="searchTerm" placeholder="ស្វែងរកផលិតផល" class="font-bayon" />
                    <Button @click="handleCreatePopup" variant="green" class="rounded-none font-bayon">+
                        បង្កើតថ្មី</Button>
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
                            <th class="px-6 py-3 border">ចំនួន</th>
                            <th class="px-6 py-3 border">ប្រភេទស្តុក</th>
                            <th class="px-6 py-3 border">ស្ថានភាព</th>
                            <th class="px-6 py-3 border">រូបភាព</th>
                            <th class="px-3 py-3 text-center border">សកម្មភាព</th>
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
                                        <span class="p-1 text-sm text-red-500 bg-red-100 rounded-md font-bayon">អស់ស្តុក</span>
                                    </div>
                                    <span v-else>{{ data.qty }}</span>
                                </div>
                            </td>


                            <td class="px-6 py-3 text-sm border whitespace-nowrap font-bayon">
                                <span :class="data.is_manage_stock
                                    ? 'text-green-600 font-semibold'
                                    : 'text-red-600 font-semibold'">
                                    {{ data.status ? 'មិនគ្រប់គ្រងស្តុក' : 'គ្រប់គ្រងស្តុក' }}
                                </span>
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
                            <!-- Actions -->
                            <td class="py-3 text-center border whitespace-nowrap">
                                <font-awesome-icon :icon="faEdit" @click="handleUpdatePopup(data)"
                                    class="text-xl text-blue-600 cursor-pointer hover:text-blue-700" />
                                <font-awesome-icon :icon="faTrash" @click="handleDeletePopup(data._id, data.name)"
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

import Product from '../../types/product';
import { producStore } from '../../stores/product.store';
import { localServer } from '../../../server/localServer';
import ProductForm from './ProductForm.vue';




export default {
    components: { Button, Pagination, Loading, DeletePopup, TextFieldInput, ProductForm },
    setup() {
        const product = producStore();
        const currentData = ref<Product[]>([]);
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
                await product.fetchDta();
                currentData.value = product.getProduct;
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
                    (item.category_id?.name && item.code.toLowerCase().includes(term))
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

                const res = await product.deleteData(setId.value)
                //real-time 
                await product.fetchDta();
                currentData.value = product.getProduct;
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
            await product.fetchDta();
            currentData.value = product.getProduct;
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
            localServer
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