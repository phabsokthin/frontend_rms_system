<template>
    <!-- Modal -->
    <div class="fixed inset-0 z-50 flex items-center justify-center">

        <!-- Overlay -->
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>

        <!-- Modal Box -->

        <div
            class="relative z-10 w-[800px] max-h-[90vh] p-6 bg-white shadow-2xl overflow-y-auto border-r-4 border-r-green-600 border-t-4 border-t-green-600 border-r-6 ">

            <h2 class="mb-4 text-xl font-semibold text-gray-800 font-bayon">
                លម្អិតមុនទូទាត់
            </h2>

            <form @submit.prevent="handleSubmit">
                <!-- Table Selection as Buttons -->
                <div class="mb-4">
                    <label class="block mb-1 text-gray-700 font-bayon">លេខតុ <span class="text-red-500">*</span></label>
                    <div v-if="sellData?.table_id?.table_number" class="mb-2 underline">
                        <span class="font-bayon">លេខតុបច្ចុប្បន្ន:</span> {{ sellData?.table_id?.table_number }}
                    </div>
                    <div class="grid grid-cols-4 gap-2">
                        <button v-for="table in currentTableOpt" :key="table.value" type="button"
                            @click="tableName = table.value" :class="[
                                'w-full py-2 border',
                                tableName === table.value
                                    ? 'bg-green-50 text-green-700 border-green-500'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            ]">
                            <div class="flex flex-col items-center">
                                <img src="../../assets/restaurant-table-and-chairs-svgrepo-com (1).svg" alt=""
                                    class="w-10 mb-1" />
                                <span class="text-md font-bayon">{{ table.label }}</span>
                                <span class="mt-1 text-sm text-gray-500 font-bayon">{{ table.capicity }} (នាក់)</span>
                            </div>
                        </button>
                    </div>
                </div>



                <!-- Customer & Staff -->
                <div class="grid grid-cols-2 gap-4">
                    <Select v-model="customerName" :options="customerOpt" label="អតិថិជន" required
                        placeholder="ជ្រើសរើសអតិថិជន" />
                    <Select v-model="staffName" :options="currentStaffOpt" label="បុគ្គលិក​ (អ្នកដឹកជញ្ជូន)" required
                        placeholder="ជ្រើសរើសបុគ្គលិក" />
                </div>

                <!-- Payment Section -->
                <fieldset class="p-5 mt-4 border border-green-200 bg-green-50">
                    <legend class="px-3 text-lg text-green-700 font-bayon">
                        ទូទាត់
                    </legend>

                    <div class="grid grid-cols-2 gap-4 ">
                        <Select v-model="paymentTypeName" :options="paymentTypeOpt" label="វិធីសាស្រ្តទូទាត់" required
                            placeholder="ជ្រើសរើសវិធីសាស្រ្តទូទាត់" />
                        <TextFieldInput v-model="tax" label="ទូទាត់ពន្ធ" placeholder="Tax" type="number" :min="0" />
                        <TextFieldInput v-model="discount" label="បញ្ចុះតម្លៃ" placeholder="Discount" type="number"
                            :min="0" />
                        <TextFieldInput v-model="total_amount" label="សរុប" placeholder="Total" disabled
                            class="font-bold text-green-700 border-none" />
                    </div>
                    <div class="grid grid-cols-3 gap-4 mt-2">
                        <TextFieldInput v-model="payment" label="បង់ប្រាក់" placeholder="បង់ប្រាក់" type="number"
                            required :min="0" class="col-span-2 font-bold text-green-700 border-none" />

                        <Select v-model="currency" :options="currencyOpt" label="រូបិយប័ណ្ណ" required
                            placeholder="រូបិយប័ណ្ណ" />
                    </div>

                    <div class="mt-2">

                    </div>


                    <div class="grid grid-cols-3 gap-0 mt-4">
                        <TextAreaInput v-model="notes" label="កំណត់" placeholder="កំណត់" class="w-full col-span-2" />
                        <!-- បង្ហាញថ្លៃសល់ / ការបង់លើស -->
                        <div class="flex justify-end mt-2">
                            <div class="w-[200px] p-5 bg-gray-50 border">
                                <label class="block text-gray-500 font-bayon">ទូទាត់</label>
                                <div class="mt-1 text-xl text-center">{{ remainingAmountDisplay }}</div>
                            </div>
                        </div>
                    </div>
                </fieldset>

                <!-- Buttons -->
                <div class="flex justify-end gap-3 mt-4">
                    <Button @click="handleClose" type="button" variant="red" class="rounded-none font-bayon">
                        បិទ
                    </Button>
                    <Button :loading="isLoading" type="submit" variant="green"
                        class="gap-2 text-center rounded-none ">
                        <div class="flex gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-banknote-arrow-up-icon lucide-banknote-arrow-up">
                                <path d="M12 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
                                <path d="M18 12h.01" />
                                <path d="M19 22v-6" />
                                <path d="m22 19-3-3-3 3" />
                                <path d="M6 12h.01" />
                                <circle cx="12" cy="12" r="2" />
                            </svg>
                            <span>បញ្ចប់ការទូទាត់</span>
                        </div>
                    </Button>
                </div>
                <!-- <pre>{{ updateData.total_amount }}</pre> -->

            </form>
        </div>
    </div>
</template>

<script lang="ts">

import { ref, onMounted, watch, computed } from "vue"
import TextFieldInput from "../../components/ui/TextFieldInput.vue"
import Button from "../../components/ui/Button.vue"
import Select from "../../components/ui/Select.vue"
import TextAreaInput from "../../components/ui/TextAreaInput.vue"

import { tableStore } from "../../stores/table.store"
import { staffStore } from "../../stores/staff.store"
import { paymentTypeStore } from "../../stores/paymentType.store"
import { customerStore } from "../../stores/customer.store"

import { useNotification } from "../../composables/useNotification"
import { sellOrderStore } from "../../stores/sellOrder.store"
import SellOrder from "../../types/sellOrder"
import { useRoute, useRouter } from "vue-router"


export default {

    components: {
        TextFieldInput,
        Button,
        Select,
        TextAreaInput
    },

    props: ["updateData", "clearCart", "loadData", "sellData"],

    setup(props, { emit }) {

        const sellOrder = sellOrderStore()
        const table = tableStore()
        const staff = staffStore()
        const paymentType = paymentTypeStore()
        const customer = customerStore()

        const { notify } = useNotification()
        const router = useRouter()



        const isLoading = ref(false)

        const tableName = ref("")
        const staffName = ref("")
        const paymentTypeName = ref("")
        const customerName = ref("")

        const tax = ref(0)
        const discount = ref(0)
        const total_amount = ref(0)
        const payment = ref(0)
        const notes = ref("")
        const currency = ref("")

        const currentTableOpt = ref<{ label: string; value: string, capicity: number }[]>([])
        const currentStaffOpt = ref<{ label: string; value: string }[]>([])
        const paymentTypeOpt = ref<{ label: string; value: string }[]>([])
        const customerOpt = ref<{ label: string; value: string }[]>([])


        const route = useRoute();
        const id = ref<string | undefined>(route.params.id as string | undefined);




        const currencyOpt = ref([
            { label: "USD", value: "usd" },
            { label: "KHR", value: "khr" }
        ])



        //update sell order display

        onMounted(() => {
            if (props.sellData) {
                tableName.value = props.sellData.table_id?._id
                staffName.value = props.sellData.staff_id?._id
                paymentTypeName.value = props.sellData.payment_type_name
                customerName.value = props.sellData.customer_id?._id
                tax.value = props.sellData.tax
                discount.value = props.sellData.discount
                total_amount.value = props.sellData.total_amount
                payment.value = props.sellData.payment
                paymentTypeName.value = props.sellData.payment_type_id?._id
                notes.value = props.sellData.notes
                currency.value = props.sellData.currency

            }
        })

        // Fetch data
        onMounted(async () => {

            isLoading.value = true

            try {

                await customer.fetchDtaByStatus()
                customerOpt.value = customer.getCustomer.map((c) => ({
                    label: c.first_name + " " + c.last_name + (c.phone ? " - " + c.phone : ""),
                    value: c._id
                }))

                await table.fetchDataByActive()
                currentTableOpt.value = table.getTatble.map((t) => ({
                    label: t.table_number,
                    capicity: t.capacity,
                    value: t._id
                }))

                await staff.fetchDtaByStatus()
                currentStaffOpt.value = staff.getStaff.map((s) => ({
                    label: s.first_name + " " + s.last_name + (s.phone ? " - " + s.phone : ""),
                    value: s._id
                }))

                await paymentType.fetchDtaByStatus()
                paymentTypeOpt.value = paymentType.getPaymentType.map((p) => ({
                    label: p.name,
                    value: p._id
                }))

            } catch (err) {
                console.error(err)
            } finally {
                isLoading.value = false
            }




            total_amount.value = props.updateData.total_amount + tax.value - discount.value
            // console.log("id", id)



        })

        // Auto calculate total
        watch([tax, discount], () => {

            const subtotal = props.updateData.total_amount || 0

            total_amount.value =
                Number(subtotal) +
                Number(tax.value) -
                Number(discount.value)
        })



        // Clear data
        const handleClose = () => {
            emit("close")
        }


        // គណនាសល់ / បង់លើស
        const remainingAmount = computed(() => {
            return payment.value - total_amount.value;
        });

        // បង្ហាញជាទ្រង់ទ្រាយលេខ
        const remainingAmountDisplay = computed(() => {
            const value = remainingAmount.value;
            if (value > 0) return `បង់លើស: ${-value}`;
            if (value < 0) return `សល់: ${value}`;
            return 'ទូទាត់ពេញ';
        });


        const handleSubmit = async () => {
            isLoading.value = true
            try {


                // Check if table is selected
                if (!tableName.value) {
                    notify({
                        type: "error",
                        message: "សូមជ្រើសរើសលេខតុ! (Please select a table)"
                    })
                    return // stop submission
                }

                // Optional: check other required fields
                if (!customerName.value) {
                    notify({
                        type: "error",
                        message: "សូមជ្រើសរើសអតិថិជន! (Please select a customer)"
                    })
                    return
                }

                if (!staffName.value) {
                    notify({
                        type: "error",
                        message: "សូមជ្រើសរើសបុគ្គលិក! (Please select staff)"
                    })
                    return
                }

                if (!paymentTypeName.value) {
                    notify({
                        type: "error",
                        message: "សូមជ្រើសរើសវិធីសាស្រ្តទូទាត់! (Please select payment type)"
                    })
                    return
                }

                // All required selected, prepare payment data
                const data: any = {
                    _id: props.sellData?._id,
                    customer_id: customerName.value,
                    table_id: tableName.value,
                    staff_id: staffName.value,
                    payment_type_id: paymentTypeName.value,
                    tax: Number(tax.value),
                    discount: Number(discount.value),
                    payment: Number(payment.value),
                    total_amount: remainingAmount.value,
                    notes: notes.value,
                    items: props.updateData.items,
                    currency: currency.value
                }



                if (props.sellData?._id) {

                    const res: any = await sellOrder.updateData(data)
                    // await table.updateStatus(dataTable as any)
                    notify({ message: res?.message || 'PaymentType updated', type: 'success' })
                    router.push({ name: 'Sell' })
                }

                else {
                    const res: any = await sellOrder.createData(data)

                    //   await props.loadData()
                    notify({ message: res?.message || 'PaymentType created', type: 'success' })

                }
                props.clearCart()
                handleClose()


            } catch (err: any) {
                notify({ message: err.message || 'Operation failed', type: 'warning' })
            }
            finally {
                isLoading.value = false
            }
        }
        return {

            tableName,
            staffName,
            paymentTypeName,
            customerName,

            tax,
            discount,
            total_amount,
            notes,
            currency,

            currentTableOpt,
            currentStaffOpt,
            paymentTypeOpt,
            customerOpt,
            currencyOpt,

            handleClose,
            handleSubmit,

            isLoading,
            payment,
            remainingAmountDisplay


        }
    }
}

</script>