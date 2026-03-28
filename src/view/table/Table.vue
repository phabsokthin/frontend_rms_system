<template>
    <div class="min-h-screen px-4">
        <!-- Header -->
        <div class="mb-[15px] flex items-center justify-between">
            <h1 class="text-xl font-bayon">បញ្ជីលេខតុ</h1>
            <div class="flex gap-2">
                <TextFieldInput v-model="searchTerm" placeholder="ស្វែងរកលេខតុ" class="font-bayon" />
                <Button @click="handleCreatePopup" variant="green" class="rounded-none font-bayon">
                    + បង្កើតថ្មី
                </Button>
            </div>
        </div>

        <!-- Cards Grid -->
        <div v-if="isLoading" class="flex justify-center py-10">
            <Loading />
        </div>

        <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div v-for="(table, index) in filteredData" :key="table._id || index" :class="[
                'flex flex-col justify-between p-4 border-t-2 shadow',
                table.status
                    ? 'bg-white border-green-500'
                    : 'bg-red-50 border-red-500'
            ]">
                <div>
                    <div class="flex justify-center">
                        <div class="p-4 mb-3 border rounded-md bg-gray-50">
                            <img src="../../assets/restaurant-table-and-chairs-svgrepo-com (1).svg" alt=""
                                class="w-10 mb-1" />
                        </div>
                    </div>
                    <h2 class="mb-2 text-xl font-semibold underline"><span class="font-bayon">លេខ</span>{{
                        table.table_number }}</h2>
                    <p class="font-bayon">សមត្ថភាព: {{ table.capacity }}</p>
                    <p class="font-bayon">
                        ស្ថានភាព:
                        <span :class="table.status ? 'text-green-600' : 'text-red-600'">
                            {{ table.status ? 'Available' : 'Occupied' }}
                        </span>
                    </p>
                    <p class="font-bayon">ទីតាំង: {{ table.location }}</p>
                    <p v-if="table.draft" class="font-bayon">ចំណាំ: <span class="text-red-500">{{ table.draft }}</span>
                    </p>
                </div>
               <div v-if="showRole?.role !=='kitchen'">
                 <div v-if="!table.status === false" class="flex mt-4">
                    <Button @click="handleDraft(table)" variant="blue"
                        class="text-sm bg-orange-500 rounded-none hover:bg-orange-600 font-bayon">
                        បម្រុង
                    </Button>
                    <Button @click="handleUpdatePopup(table)" variant="blue" class="text-sm rounded-none font-bayon">
                        កែប្រែ
                    </Button>
                    <Button @click="handleDeletePopup(table._id, table.table_number)" variant="red"
                        class="text-sm rounded-none font-bayon">
                        លុប
                    </Button>
                </div>
                <div v-else-if="table.status === false" class="flex justify-between mt-4">
                    <Button @click="handleUpdateStatusTrue(table._id)"
                        class="text-sm bg-yellow-500 rounded-none font-bayon hover:bg-yellow-600">
                        កំណត់ឡើងវិញ
                    </Button>
                </div>
               </div>
            </div>

            <!-- No Data -->
            <div v-if="filteredData.length === 0" class="font-bold text-center text-gray-500 col-span-full font-bayon">
                មិនមានទិន្នន័យ
            </div>
        </div>

        <!-- Delete Popup -->
        <DeletePopup v-model="showDelete" :name="showName" @confirm="handleDelete" />

        <component :is="currentComponent" @close="currentComponent = ''" :loadData="loadData"
            :updateData="updateData" />
    </div>

   
</template>

<script lang="ts">
import { ref, computed, onMounted } from 'vue';
import Button from '../../components/ui/Button.vue';
import Loading from '../../components/ui/Loading.vue';
import DeletePopup from '../../components/ui/DeletePopup.vue';
import TextFieldInput from '../../components/ui/TextFieldInput.vue';
import { useNotification } from '../../composables/useNotification';
import { tableStore } from '../../stores/table.store';
import Table from '../../types/table';
import TableForm from './TableForm.vue';
import DraftForm from './DraftForm.vue';



export default {
    components: { Button, Loading, DeletePopup, TextFieldInput, TableForm, DraftForm },
    setup() {
        const tables = tableStore();
        const currentData = ref<Table[]>([]);
        const showDelete = ref(false);
        const isLoading = ref(false);
        const searchTerm = ref('');
        const showName = ref('');
        const setId = ref('');
        const { notify } = useNotification();
        const currentComponent = ref('');
        const updateData = ref('');

            const showRole = ref<any>(null);
        

        onMounted(async () => {
            isLoading.value = true;
            try {
                await tables.fetchDta();
                currentData.value = tables.getTatble;
            } catch (err) {
                console.log(err);
            } finally {
                isLoading.value = false;
            }
        });

        onMounted(async () => {
               const userLocal = localStorage.getItem("user");
      showRole.value = userLocal ? JSON.parse(userLocal) : null;

        })

        //filter data
        const filteredData = computed(() =>
            currentData.value.filter((table) =>
                table.table_number.toLowerCase().includes(searchTerm.value.toLowerCase())
            )
        );

        const handleCreatePopup = () => {
            currentComponent.value = 'TableForm';
            updateData.value = '';
        };

        const handleDeletePopup = (id: string, name: string) => {
            setId.value = id;
            showDelete.value = true;
            showName.value = name;
        };

        const handleDelete = async () => {
            try {
                const res = await tables.deleteData(setId.value);
                await tables.fetchDta();
                currentData.value = tables.getTatble;
                notify({ message: res.message, type: 'success' });
            } catch (error: any) {
                const message = error?.response?.data?.message || error.message;
                notify({ message, type: 'error' });
            }
        };

        const handleUpdatePopup = (data: any) => {
            currentComponent.value = 'TableForm';
            updateData.value = data;
        };

        async function loadData() {
            await tables.fetchDta();
            currentData.value = tables.getTatble
        }


        // update status
        const handleUpdateStatusTrue = async (id: string) => {
            try {
                const data: any = {
                    _id: id, // include _id for update
                    status: true,
                    draft: ''
                };
                const res: any = await tables.updateData(data);
                notify({
                    message: res?.message || "Table created successfully",
                    type: "success",
                });
                await tables.fetchDta();
                currentData.value = tables.getTatble
            }
            catch (err: any) {
                notify({
                    message: err?.message || "Error",
                    type: "error",
                });
            }
        }

        //draft first
        const handleDraft = (data: any) => {
            currentComponent.value = 'DraftForm';
            updateData.value = data;

        };

        return {
            currentData,
            showDelete,
            showName,
            isLoading,
            searchTerm,
            currentComponent,
            updateData,
            handleCreatePopup,
            handleDeletePopup,
            handleDelete,
            handleUpdatePopup,
            filteredData,
            loadData,
            handleUpdateStatusTrue,
            handleDraft,
            showRole
        };
    },
};
</script>