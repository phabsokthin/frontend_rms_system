<template>
    <!-- Modal -->
    <div
        class="fixed inset-0 z-50 flex items-center justify-center print:flex-none print:items-start print:justify-start">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>

        <!-- Modal content -->
        <div
            class="relative z-10 w-[550px]  p-6 overflow-y-auto bg-white shadow-2xl print:shadow-none print:p-0 print:w-full">
            <div class="flex justify-end gap-3 print:hidden">
                <Button @click="handlePrint" type="button" variant="green" class="rounded-none font-bayon">
                    បោះពុម្ភ
                </Button>
                <Button @click="handleClose" type="button" variant="red" class="rounded-none font-bayon">
                    បិទ
                </Button>

            </div>
            <h2 class="mb-6 text-2xl font-semibold text-gray-800 font-bayon">
                វិកយ្យប័ត្រ
            </h2>

            <!-- Order Info -->
            <div class="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <h3 class="font-semibold text-gray-700 font-bayon">លេខវិកយ្យប័ត្រ</h3>
                    <p class="text-gray-900 underline">{{ showInvoice }}</p>
                </div>
                <div></div>
                <div>
                    <h3 class="font-semibold text-gray-700 font-bayon">លេខតុ</h3>
                    <p class="text-gray-900 underline">{{ showCurrentDetail.table_id?.table_number || 'N/A' }}</p>
                </div>
                <div class="text-right">
                    <h3 class="font-semibold text-gray-700 font-bayon">ពេលបញ្ជាទិញ</h3>
                    <p class="text-gray-900 underline">{{ formatDateTime(showCurrentDetail.order_time) }}</p>
                </div>
                <div>
                    <h3 class="font-semibold text-gray-700 font-bayon">អតិថិជន</h3>
                    <p class="text-gray-900 underline">
                        {{ showCurrentDetail.customer_id?.first_name }} {{ showCurrentDetail.customer_id?.last_name }}
                    </p>
                </div>
                <div class="text-right">
                    <h3 class="font-semibold text-gray-700 font-bayon">បុគ្គលិក</h3>
                    <p class="text-gray-900 underline">
                        {{ showCurrentDetail.staff_id?.first_name }} {{ showCurrentDetail.staff_id?.last_name }}
                    </p>
                </div>
            </div>

            <!-- Items Table -->
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse table-auto">
                    <thead>
                        <tr class="bg-gray-100 font-bayon">
                            <th class="px-4 py-2 border">ផលិតផល</th>
                            <th class="px-4 py-2 border">បរិមាណ</th>
                            <th class="px-4 py-2 border">តម្លៃ</th>
                            <th class="px-4 py-2 border">សរុប</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in showCurrentDetail.items || []" :key="index"
                            class="hover:bg-gray-50">
                            <td class="px-4 py-2 border">
                                <div class="flex items-center gap-2">
                                    <div>
                                        <img v-if="item.product_id?.image_url"
                                            :src="localServer + item.product_id?.image_url"
                                            class="object-cover border rounded w-14 h-14" />

                                        <span v-else class="text-sm text-gray-400">
                                            <img src="https://bunchobagels.com/wp-content/uploads/2024/09/placeholder.jpg"
                                                class="w-14" alt="">
                                        </span>
                                    </div>
                                    <span>{{ item.product_id?.name || 'N/A' }}</span>
                                </div>
                            </td>
                            <td class="px-4 py-2 border">{{ item.qty }}</td>
                            <td class="px-4 py-2 border">{{ item.price }} {{ currencySymbol }}</td>
                            <td class="px-4 py-2 border">{{ item.subtotal }} {{ currencySymbol }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Payment Info -->
            <div class="grid grid-cols-2 gap-4 mt-6 mb-4 font-medium text-gray-800 text-md">
                <div class="">
                    <p><span class="font-bayon">ពន្ធ</span>: ({{ showCurrentDetail.tax }} {{ currencySymbol }})</p>
                    <p><span class="font-bayon">បញ្ចុះតម្លៃ</span>: ({{ showCurrentDetail.discount }} {{ currencySymbol
                    }})</p>
                    <div v-if="showCurrentDetail.notes" class="mt-1">
                        <h3 class="font-semibold text-gray-700 font-bayon">កំណត់ចំណាំ:</h3>
                        <p class="text-gray-900">{{ showCurrentDetail.notes }}</p>
                    </div>
                </div>
                <div class="space-y-2 text-right">
                    <p class="text-red-500"><span class="font-bayon">សរុប</span>: <span
                            class="font-bold text-green-700">({{
                               total
                            }} {{ currencySymbol }})</span></p>
                    <p class="text-green-700"><span class="font-bayon">បានទូទាត់</span>: ({{ showCurrentDetail.payment
                    }} {{ currencySymbol }})</p>

                    <div class=""><span class="font-bayon">ទូទាត់តាម</span>: <span class="text-gray-600 underline">{{
                        showCurrentDetail.payment_type_id?.name || 'N/A' }}</span></div>
                </div>
            </div>


            <div class="flex justify-end text-center print:hidden">
                <div class="w-40 p-5 border bg-gray-50">
                    <!-- <p class="text-xl ">នៅសល់</p> -->
                    <div class="">
                      
                        <div v-if="Number(showCurrentDetail.total_amount) === 0">
                            <p class="text-green-700 font-bayon">បានទូទាត់</p>
                            <p> {{ currencySymbol }}({{ showCurrentDetail.payment }})</p>
                        </div>

                        
                        <div v-else-if="Number(showCurrentDetail.total_amount) < 0">
                            <p class="text-red-500 font-bayon">ជំពាក់</p>
                            {{ currencySymbol }}({{ Number(showCurrentDetail.total_amount) }})
                            
                        </div>
                        <div v-else>
                            <p class="text-yellow-600 font-bayon">បង់លើស</p>
                            {{ currencySymbol }}({{ Number(showCurrentDetail.total_amount) }})
                        </div>
                    </div>
                </div>
            </div>
            <!-- Notes -->

           <!-- <p>{{ total }}</p> -->
        </div>
    </div>
</template>

<script lang="ts">
import TextFieldInput from '../../components/ui/TextFieldInput.vue'
import Button from '../../components/ui/Button.vue'
import Select from '../../components/ui/Select.vue'
import TextAreaInput from '../../components/ui/TextAreaInput.vue'
import SellOrder from '../../types/sellOrder'
import { formatDateTime } from '../../utils/formatDate'
import { computed, ref, watchEffect } from 'vue'
import { localServer } from '../../../server/localServer'

export default {
    components: { TextFieldInput, Button, Select, TextAreaInput },
    props: {
        loadData: Object,
        showInvoice: String,
        showCurrentDetail: {
            type: Object as () => SellOrder,
            required: true
        }
    },
    setup(props, { emit }) {
        const handleClose = () => emit('close')
        const total = ref(0)
        
        // Optional: print function
        const handlePrint = () => {
            window.print()
        }

        // Computed for currency symbol
        const currencySymbol = computed(() => {
            const c = props.showCurrentDetail.currency?.toUpperCase()
            if (c === 'USD') return '$'
            if (c === 'KHR') return '៛'
            return c || ''
        })



        // watch total count in items
        watchEffect(() => {
            total.value = (props.showCurrentDetail.items || []).reduce(
                (acc, item) => acc + item.subtotal,
                0
            )
        })



        return {
            handleClose,
            handlePrint,
            formatDateTime,
            currencySymbol,
            localServer,
            total

        }
    }
}
</script>