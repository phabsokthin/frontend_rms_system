<template>
    <!-- Modal -->
    <div class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>

        <div class="relative z-10 w-full max-w-3xl p-6 bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 class="mb-4 text-xl font-semibold text-gray-800 font-bayon">
                {{ updateData ? "កែប្រែការចំណាយ" : "បង្កើតការចំណាយ" }}
            </h2>

            <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">

                <div class="grid grid-cols-2 gap-2">
                    <!-- Category -->
                    <Select v-model="categoryId" :options="categoryOptions" label="ប្រភេទ"
                        placeholder="ជ្រើសរើសប្រភេទ" />

                    <!-- Expense Date -->
                    <DateTime label="កាលបរិច្ឆេត" v-model="expenseDate" required placeholder="ជ្រើសរើសកាលបរិច្ឆេត"
                        type="datetime" />

                    <!-- Status (only when updating) -->

                    <Select v-model="status" :options="statusOpt" label="ស្ថានភាព" placeholder="ស្ថានភាព" required />

                </div>

                <div class="grid grid-cols-2 gap-4">
                    <!-- Name -->
                    <TextFieldInput v-model="name" type="text" label="ឈ្មោះ" required placeholder="Name" />

                    <TextFieldInput v-model="amount" type="number" label="ចំនួនទឹកប្រាក់" class="font-bold" :min="0"
                        required />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <!-- Amount -->


                    <!-- Payment Type -->
                    <Select v-model="paymentTypeId" :options="paymentTypeOpt" label="វិធីសាស្រ្តទូទាត់" required
                        placeholder="ជ្រើសរើសវិធីសាស្រ្តទូទាត់" />
                    <!-- Currency -->
                    <Select v-model="currency" :options="currencyOpt" label="រូបបិយប័ណ្ណ" required
                        placeholder="ជ្រើសរើសរូបបិយប័ណ្ណ" />
                </div>

                <!-- Notes -->
                <TextAreaInput v-model="description" label="កត់ចំណាំ" placeholder="កត់ចំណាំ" />

                <!-- Buttons -->
                <div class="flex justify-end gap-3 mt-4">
                    <Button @click="handleClose" type="button" variant="red" class="rounded-none font-bayon">
                        បោះបង់
                    </Button>
                    <Button :loading="isLoading" type="submit" variant="green" class="rounded-none font-bayon">
                        {{ updateData ? "កែប្រែ" : "បង្កើត" }}
                    </Button>
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
import { onMounted, ref } from "vue"
import TextFieldInput from "../../components/ui/TextFieldInput.vue"
import Button from "../../components/ui/Button.vue"
import Select from "../../components/ui/Select.vue"
import DateTime from "../../components/ui/DateTime.vue"
import TextAreaInput from "../../components/ui/TextAreaInput.vue"
import { useNotification } from "../../composables/useNotification"
import { categoryStore } from "../../stores/category.store"
import { paymentTypeStore } from "../../stores/paymentType.store"
import { expenseStore } from "../../stores/expense.store" // <-- new store for expenses

export default {
    components: { TextFieldInput, Button, Select, DateTime, TextAreaInput },
    props: ["loadData", "updateData"],

    setup(props, { emit }) {
        const category = categoryStore()
        const paymentType = paymentTypeStore()
        const expense = expenseStore()

        const categoryId = ref("")
        const name = ref("")
        const description = ref("")
        const amount = ref(0)
        const paymentTypeId = ref("")
        const expenseDate = ref(new Date().toISOString().slice(0, 16))
        const status = ref("paid")
        const currency = ref("")
        const isLoading = ref(false)

        const { notify } = useNotification()
        const categoryOptions = ref<{ label: string; value: string }[]>([])
        const paymentTypeOpt = ref<{ label: string; value: string }[]>([])

        const currencyOpt = ref([
            { label: "USD", value: "usd" },
            { label: "KHR", value: "khr" }
        ])

        const statusOpt = ref([
            { label: "បានទូទាត់", value: "paid" },
            { label: "កំពុងរង់ចាំ", value: "pending" },
            { label: "បោះបង់", value: "cancelled" }
        ])


        // update expense
        onMounted(() => {
            if (props.updateData) {
                categoryId.value = props.updateData.category_id?._id
                name.value = props.updateData.name
                description.value = props.updateData.description
                amount.value = props.updateData.amount
                paymentTypeId.value = props.updateData.payment_type_id?._id
                expenseDate.value = props.updateData.expense_date
                status.value = props.updateData.status
                currency.value = props.updateData.currency
            }
        })
        
        // Fetch categories
        onMounted(async () => {
            try {
                isLoading.value = true
                await category.fetchCategories()
                categoryOptions.value = category.getCategories.map(cat => ({
                    label: cat.name,
                    value: cat._id
                }))
            } catch (err) {
                console.error(err)
            } finally {
                isLoading.value = false
            }
        })

        // Fetch payment types
        onMounted(async () => {
            try {
                isLoading.value = true
                await paymentType.fetchDtaByStatus()
                paymentTypeOpt.value = paymentType.getPaymentType.map(pt => ({
                    label: pt.name,
                    value: pt._id
                }))
            } catch (err) {
                console.error(err)
            } finally {
                isLoading.value = false
            }
        })

        // Submit
        const handleSubmit = async () => {
            try {
                isLoading.value = true
                const data: any = {
                    _id: props.updateData?._id,
                    category_id: categoryId.value || undefined,
                    name: name.value,
                    description: description.value,
                    amount: amount.value,
                    payment_type_id: paymentTypeId.value,
                    expense_date: expenseDate.value,
                    status: status.value,
                    currency: currency.value,

                }

                let res: any;
                if (props.updateData) {
                    res = await expense.updateData(data)
                    notify({ message: res?.message || "Expense updated successfully", type: "success" })
                } else {
                    res = await expense.createData(data)
                    notify({ message: res?.message || "Expense created successfully", type: "success" })
                }

                await props.loadData()
                handleClose()
            } catch (err: any) {
                notify({ message: err.message || "Operation failed", type: "error" })
            } finally {
                isLoading.value = false
            }
        }

        // Close modal
        const handleClose = () => {
            emit("close")
        }

        return {
            categoryId,
            name,
            description,
            amount,
            paymentTypeId,
            expenseDate,
            status,
            currency,
            categoryOptions,
            paymentTypeOpt,
            currencyOpt,
            statusOpt,
            handleSubmit,
            handleClose,
            isLoading
        }
    }
}
</script>
