<template>
    <!-- Modal -->
    <div class="fixed inset-0 z-50 flex items-center justify-center ">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>

        <div class="relative z-10 w-full max-w-3xl p-6 bg-white shadow-2xl max-h-[90vh] overflow-y-auto ">
            <h2 class="mb-4 text-xl font-semibold text-gray-800 font-bayon">
                បង្កើតការទិញចូល
            </h2>

            <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">

                <div class="grid grid-cols-2 gap-2">
                    <!-- Supplier -->
                    <Select v-model="supplierName" :options="currentDataByOption" label="អ្នកផ្គត់ផ្គង់" required
                        placeholder="ជ្រើសរើសអ្នកផ្គត់ផ្គង់" />

                    <DateTime label="កាលបរិច្ឆេត" v-model="purchaseDate" required placeholder="ជ្រើសរើសកាលបរិច្ឆេត"
                        type="datetime" />
                </div>

                <!-- Products -->
                <div class="flex flex-col gap-3">
                    <fieldset class="p-4 border border-r-4 border-gray-300 border-r-green-600">
                        <legend class="px-2 text-sm font-semibold text-gray-700 font-bayon">
                            ផលិតផល
                        </legend>

                        <div class="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-2 ">

                            <div v-for="(item, index) in items" :key="index" class="grid items-end grid-cols-12 gap-2">

                                <!-- Product -->
                                <div class="col-span-5">
                                    <Select v-model="item.product_id" :options="getProductOptions(index)" label="ផលិតផល"
                                        required placeholder="ជ្រើសរើសផលិតផល" />
                                </div>

                                <!-- Qty -->
                                <div class="col-span-2">
                                    <TextFieldInput v-model="item.qty" type="number" label="ចំនួន" :min="0" />
                                </div>

                                <!-- Price -->
                                <div class="col-span-2">
                                    <TextFieldInput v-model="item.price" type="number" label="តម្លៃ" />
                                </div>

                                <!-- Subtotal -->
                                <div class="col-span-2">
                                    <TextFieldInput :modelValue="item.subtotal" label="សរុប" disabled />
                                </div>

                                <!-- Remove -->
                                <div class="flex justify-center col-span-1">
                                    <Button variant="red" type="button" @click="removeRow(index)"
                                        class="h-[45px] text-sm text-red-500 rounded-none font-bayon">
                                        លុប
                                    </Button>
                                </div>

                            </div>

                        </div>
                    </fieldset>

                    <!-- Add row -->
                    <div class="flex justify-end">
                        <Button type="button" variant="green" class="text-sm rounded-none font-bayon" @click="addRow">
                            + បន្ថែម
                        </Button>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <!-- Total -->



                    <TextFieldInput v-model="tax" type="number" label="ពន្ធ" class="font-bold " :min="0" />
                    <TextFieldInput v-model="discount" type="number" label="បញ្ចុះតម្លៃ" class="font-bold " :min="0" />
                    <TextFieldInput :modelValue="totalAmount" label="សរុបចុងក្រោយ" disabled class="font-bold " />

                    <TextFieldInput v-model="payment" type="number" require label="ទូទាត់" class="font-bold "
                        :min="0" />

                    <!-- Optional: show remaining/overpayment -->
                    <TextFieldInput :modelValue="remainingAmount" label="សល់/បង់លើស" disabled
                        class="col-span-2 font-bold " />



                </div>
                <div class="grid grid-cols-2 gap-4">

                    <Select v-model="paymentTypeName" :options="paymentTypeOpt" label="វិធីសាស្រ្តទូទាត់" required
                        placeholder="វិធីសាស្រ្តទូទាត់" />
                    <Select v-model="currency" :options="currencyOpt" label="រូបបិយប័ណ្ណ" required
                        placeholder="ជ្រើសរើសរូបបិយប័ណ្ណ" />
                </div>
                <TextAreaInput v-model="notes" label="កត់ចំណាំ" placeholder="កត់ចំណាំ" class="font-bold " />

                <!-- Buttons -->
                <div class="flex justify-end gap-3 mt-4">
                    <Button @click="handleClose" type="button" variant="red" class="rounded-none font-bayon">
                        បោះបង់
                    </Button>

                    <Button :loading="isLoading" type="submit" variant="green" class="rounded-none font-bayon">
                        បង្កើត
                    </Button>
                </div>

            </form>
        </div>
    </div>
</template>

<script lang="ts">
import { onMounted, ref, watch, computed } from "vue"
import TextFieldInput from "../../components/ui/TextFieldInput.vue"
import Button from "../../components/ui/Button.vue"
import Select from "../../components/ui/Select.vue"
import { useNotification } from "../../composables/useNotification"
import { supplierStore } from "../../stores/supplier.store"
import { producStore } from "../../stores/product.store"
import DateTime from "../../components/ui/DateTime.vue"
import { paymentTypeStore } from "../../stores/paymentType.store"
import TextAreaInput from "../../components/ui/TextAreaInput.vue"
import { purchaseStore } from "../../stores/purchase.store"


export default {
    components: { TextFieldInput, Button, Select, DateTime, TextAreaInput },
    props: ["loadData", "updateData"],

    setup(props, { emit }) {

        const supplier = supplierStore()
        const product = producStore()
        const paymentType = paymentTypeStore()
        const purchase = purchaseStore()
        const supplierName = ref("")

        const pad = (n: number) => n.toString().padStart(2, "0")
        const now = new Date()
        const purchaseDate = ref(
            `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(
                now.getHours()
            )}:${pad(now.getMinutes())}`
        )
        const currency = ref("")
        const paymentTypeName = ref("")
        const notes = ref("")
        const isLoading = ref(false)
        const tax = ref(0)
        const discount = ref(0)
        const payment = ref(0) // user input for payment


        const { notify } = useNotification()
        const currentDataByOption = ref<{ label: string; value: string }[]>([])
        const currentDataByProductOption = ref<{ label: string; value: string }[]>([])
        const paymentTypeOpt = ref<{ label: string; value: string }[]>([])
        let isShowingDuplicate = false


        const currencyOpt = ref([
            { label: "USD", value: "usd" },
            { label: "KHR", value: "khr" }
        ])


        const items = ref([
            {
                product_id: "",
                qty: 1,
                price: 0,
                subtotal: 0
            }
        ])

        // Fetch suppliers
        onMounted(async () => {
            try {
                isLoading.value = true

                await supplier.fetchDtaByStatus()

                currentDataByOption.value = supplier.getSupplier.map(cat => ({
                    label: cat.name,
                    value: cat._id
                }))

            } catch (err) {
                console.error(err)
            } finally {
                isLoading.value = false
            }
        })

        onMounted(async () => {
            try {
                isLoading.value = true

                await product.fetchManageStock()
                currentDataByProductOption.value = product.getProduct.map(cat => ({
                    label: cat.name,
                    value: cat._id
                }))

            } catch (err) {
                console.error(err)
            } finally {
                isLoading.value = false
            }
        })

        // Fetch products
        // onMounted(async () => {
        //     try {
        //         await product.fetchDtaByStatus()
        //         currentDataByProductOption.value = product.getProduct
        //             .filter(cat => cat.is_manage_stock !== false)
        //             .map(cat => ({
        //                 label: cat.name,
        //                 value: cat._id
        //             }))

        //     } catch (err) {
        //         console.error(err)
        //     }
        // })


        // Fetch paymen type
        onMounted(async () => {
            try {
                isLoading.value = true

                await paymentType.fetchDtaByStatus()

                paymentTypeOpt.value = paymentType.getPaymentType.map(cat => ({
                    label: cat.name,
                    value: cat._id
                }))

            } catch (err) {
                console.error(err)
            } finally {
                isLoading.value = false
            }
        })

        // Add row
        const addRow = () => {
            items.value.push({
                product_id: "",
                qty: 1,
                price: 0,
                subtotal: 0
            })
        }

        // Remove row
        const removeRow = (index: number) => {
            if (items.value.length > 1) {
                items.value.splice(index, 1)
            }
        }

        // Prevent duplicate products
        const isProductDisabled = (productId: string, currentIndex: number) => {
            return items.value.some((item, index) => {
                return index !== currentIndex && item.product_id === productId
            })
        }

        const getProductOptions = (index: number) => {
            return currentDataByProductOption.value.map(option => ({
                ...option,
                disabled: isProductDisabled(option.value, index)
            }))
        }

        // Auto subtotal
        watch(
            items,
            (newItems) => {
                newItems.forEach(item => {
                    item.subtotal = Number(item.qty) * Number(item.price)
                })
            },
            { deep: true }
        )


        watch(
            items,
            (newItems) => {

                const seen = new Set<string>()

                newItems.forEach((item) => {

                    if (!item.product_id) return

                    if (seen.has(item.product_id)) {

                        // reset duplicate
                        item.product_id = ""

                        // show message only once
                        if (!isShowingDuplicate) {
                            notify({
                                message: "Product already selected",
                                type: "error"
                            })

                            isShowingDuplicate = true

                            setTimeout(() => {
                                isShowingDuplicate = false
                            }, 500)
                        }

                    } else {
                        seen.add(item.product_id)
                    }

                })

            },
            { deep: true }
        )

        // Recalculate subtotal when qty or price changes
        watch(
            items,
            (newItems) => {
                newItems.forEach(item => {
                    item.subtotal = Number(item.qty) * Number(item.price)
                })
            },
            { deep: true }
        )

        // Total including tax and discount
        const totalAmount = computed(() => {
            const subtotal = items.value.reduce((sum, item) => sum + item.subtotal, 0)
            return subtotal + Number(tax.value) - Number(discount.value)
        })

        // Remaining or change
        const remainingAmount = computed(() => {
            return Number(payment.value) - totalAmount.value
        })

        // Submit
        const handleSubmit = async () => {

            try {

                isLoading.value = true

                const data: any = {
                    supplier_id: supplierName.value,
                    purchase_date: purchaseDate.value,
                    items: items.value,
                    currency: currency.value,
                    total_amount: totalAmount.value,
                    tax: tax.value,
                    discount: discount.value,
                    payment: payment.value,
                    payment_type_id: paymentTypeName.value,
                    notes: notes.value
                }

                console.log("Data is", data)
                const res: any = await purchase.createData(data)
                await props.loadData()

                notify({
                    message: res?.message || "Purchase created successfully",
                    type: "success"
                })

                handleClose()

            } catch (err: any) {

                notify({
                    message: err.message || "Operation failed",
                    type: "error"
                })

            } finally {
                isLoading.value = false
            }
        }

        // Close modal
        const handleClose = () => {
            emit("close")
        }




        return {
            supplierName,
            currentDataByOption,
            currentDataByProductOption,
            items,
            addRow,
            removeRow,
            totalAmount,
            handleSubmit,
            handleClose,
            isLoading,
            getProductOptions,
            purchaseDate,
            currencyOpt,
            currency,
            paymentTypeName,
            paymentTypeOpt,
            notes,
            tax,
            discount,
            payment,
            remainingAmount

        }
    }
}
</script>