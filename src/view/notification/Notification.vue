<template>
    <div class="min-h-screen px-4">
        <!-- Header -->
        <div class="mb-[15px] flex items-center justify-between">
            <h1 class="text-xl font-bayon">បញ្ជីជូនដំណឹង</h1>
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
            <div v-for="(order, index) in filteredData" :key="order._id || index" :class="[
                'flex flex-col justify-between p-4 transition bg-white border-l-4 shadow hover:shadow-md',
                order.status === 'pending'
                    ? 'border-yellow-500'
                    : order.status === 'processing'
                        ? 'border-orange-500'
                        : 'border-green-500'
            ]">
                <!-- Header -->
                <div class="flex items-center justify-between mb-3">
                    <div>
                        <h2 class="text-lg font-bold ">
                            តុ {{ order.table_id?.table_number }}
                        </h2>
                        <p class="text-xs text-gray-500">
                            {{ formatDateTime(order.order_time) }}
                        </p>
                    </div>

                    <!-- Status Badge -->
                    <span :class="[
                        'px-2 py-1 text-xs font-semibold capitalize rounded',
                        order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : order.status === 'processing'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-green-100 text-green-700'
                    ]">
                        {{ order.status }}
                    </span>
                </div>

                <!-- Customer & Staff -->
                <div class="mb-3 space-y-1 text-sm font-bayon">
                    <p>
                        👤 {{ order.customer_id?.first_name }} {{ order.customer_id?.last_name }}
                    </p>
                    <p class="text-gray-500">
                        👨‍🍳 {{ order.staff_id?.first_name }} {{ order.staff_id?.last_name }}
                    </p>
                </div>

                <!-- Items -->
                <div class="mb-3">
                    <p class="mb-1 text-sm font-semibold font-bayon">មុខម្ហូប</p>

                    <div class="space-y-2">
                        <div v-for="(item, i) in order.items" :key="i"
                            class="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                            <!-- Image -->
                            <img v-if="item.product_id?.image_url" :src="localServer + item.product_id.image_url"
                                class="object-cover w-12 h-12 border rounded" />

                            <img v-else src="https://bunchobagels.com/wp-content/uploads/2024/09/placeholder.jpg"
                                class="object-cover w-12 h-12 border rounded" />

                            <!-- Info -->
                            <div class="flex-1 text-sm">
                                <p class="font-medium">
                                    {{ item.product_id?.name }}
                                </p>
                                <p class="text-xs text-gray-500">
                                    x{{ item.qty }} • ${{ item.subtotal }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Payment -->
                <div class="pt-2 mt-2 text-sm border-t">
                    <div class="flex justify-between">
                        <span class="font-bayon">សរុប</span>
                        <span class="font-semibold">${{ order.payment }}</span>
                    </div>

                    <div class="flex justify-between text-gray-500">
                        <span>ទូទាត់តាម</span>
                        <span>{{ order.payment_type_id?.name }}</span>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-2 mt-4">
                    <!-- Show only if pending -->
                    <button v-if="order.status === 'pending'"
                        class="flex-1 py-2 text-sm font-semibold text-white transition bg-orange-500 hover:bg-orange-600"
                        @click="handleProcessing(order._id)">
                        Processing
                    </button>

                    <!-- Always show Done -->
                    <button v-else
                        class="flex-1 py-2 text-sm font-semibold text-white transition bg-green-500 hover:bg-green-600"
                        @click="handleToDone(order._id)">
                        Done
                    </button>
                </div>
            </div>


            <!-- No Data -->
            <div v-if="filteredData.length === 0" class="font-bold text-center text-gray-500 col-span-full font-bayon">
                មិនមានទិន្នន័យ
            </div>
        </div>


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
import Table from '../../types/table';
import { sellOrderStore } from '../../stores/sellOrder.store';
import SellOrder from '../../types/sellOrder';
import { formatDateTime } from '../../utils/formatDate';
import { localServer } from '../../../server/localServer';


export default {
    components: { Button, Loading, DeletePopup, TextFieldInput },
    setup() {
        const sellOrder = sellOrderStore();
        const currentData = ref<SellOrder[]>([]);
        const showDelete = ref(false);
        const isLoading = ref(false);
        const searchTerm = ref('');
        const showName = ref('');
        const setId = ref('');
        const { notify } = useNotification();
        const currentComponent = ref('');
        const updateData = ref('');

        onMounted(async () => {
            isLoading.value = true;
            try {
                await sellOrder.fetchDataByPending();
                currentData.value = sellOrder.getSellOrder;
            } catch (err) {
                console.log(err);
            } finally {
                isLoading.value = false;
            }
        });

        //filter data

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

        const handleCreatePopup = () => {
            currentComponent.value = 'TableForm';
            updateData.value = '';
        };

        const handleDeletePopup = (id: string, name: string) => {
            setId.value = id;
            showDelete.value = true;
            showName.value = name;
        };


        const handleUpdatePopup = (data: any) => {
            currentComponent.value = 'TableForm';
            updateData.value = data;
        };


        // handle processing
        const handleProcessing = (id: string) => {
            try {
                if (window.confirm("Are you sure update status to processing?")) {
                    const data = {
                        _id: id,
                    }
                    sellOrder.updateStatusProccessing(data as any)
                    loadData()
                    notify({
                        message: "Status updated processing",
                        type: "success",
                    })
                }
            }
            catch (err: any) {
                notify({
                    message: err?.message || "Error",
                    type: "error",
                });
            }

        };

        // handle done
        const handleToDone = async (id: string) => {
            try {
                if (window.confirm("Are you sure update status to done?")) {
                    const data = {
                        _id: id,
                    }
                    await sellOrder.updateStatusDone(data as any)
                    loadData()
                    notify({
                        message: "Status updated processing to done",
                        type: "success",
                    })
                }
            }
            catch (err: any) {
                notify({
                    message: err?.message || "Error",
                    type: "error",
                });
            }

        };


        async function loadData() {
            await sellOrder.fetchDataByPending();
            currentData.value = sellOrder.getSellOrder
        }


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
            handleUpdatePopup,
            filteredData,
            loadData,
            // handleUpdateStatusTrue,
            handleProcessing,
            formatDateTime,
            localServer,
            handleToDone
        };
    },
};
</script>