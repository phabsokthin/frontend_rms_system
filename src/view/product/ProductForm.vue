<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>

        <div class="relative z-10 w-full max-w-2xl p-6 bg-white shadow-2xl">
            <h2 class="mb-6 text-xl font-semibold text-gray-800 font-bayon">
                {{ updateData ? 'កែប្រែផលិតផល' : 'បង្កើតផលិតផលថ្មី' }}
            </h2>

            <form @submit.prevent="handleSubmit" class="grid grid-cols-2 gap-4">

                <!-- Name -->
                <TextFieldInput v-model="name" label="ឈ្មោះផលិតផល" required placeholder="Product Name" />

                <!-- Code -->
                <TextFieldInput v-model="code" label="លេខកូដ" required placeholder="Code" />

                <!-- Category -->
                <Select v-model="categoryName" :options="currentDataByOption" label="ប្រភេទ" required
                    placeholder="ជ្រើសរើសប្រភេទ" />

                                    <TextFieldInput v-model="unit" label="ឯកតា" required placeholder="Unit" type="text" />

                <!-- Quantity -->
                <TextFieldInput v-model.number="qty" type="number" label="ចំនួន" placeholder="Qty"
                    :disabled="!is_manage_stock" />

                <!-- Cost -->
                <TextFieldInput v-model.number="cost" type="number" label="ថ្លៃដើម" placeholder="Cost" :min="0" />

                <!-- Price -->
                <TextFieldInput v-model.number="price" type="number" label="តម្លៃលក់" placeholder="Price" :min="0" />

                <!-- Profit (Auto calculated) -->
                <TextFieldInput :model-value="profit" label="ចំណេញ" :disabled="true" placeholder="Profit" />

                <!-- Manage Stock -->
                <Select v-model="is_manage_stock" :options="manageStockOptions" label="គ្រប់គ្រងស្តុក" />

                <!-- Status -->
                <Select v-model="status" :options="statusOptions" label="ស្ថានភាព" />
                <div v-if="is_manage_stock">
                    <TextFieldInput v-model.number="alert_stock" type="number" label="ជូនដំណឹង" placeholder="Price"
                        :min="0" />
                </div>



                <!-- Description (Full Width) -->
                <div class="col-span-2">
                    <TextAreaInput v-model="description" label="ពិពណ៌នា" placeholder="Description" />
                </div>


                <!-- Image -->
                <div class="col-span-2 space-y-3">
                    <!-- File Input -->
                    <input type="file" accept="image/*" @change="handleImageUpload" />

                    <!-- New uploaded preview -->
                    <div v-if="imagePreview" class="mt-2">
                        <img :src="imagePreview" class="object-cover w-32 h-32 border rounded" />
                        <button type="button" @click="handleRemoveNewImage" class="mt-2 text-sm text-red-500">
                            លុបរូបភាព
                        </button>
                    </div>

                    <!-- Existing image if no new upload -->
                    <!-- <div v-else-if="image_url" class="mt-2">
                        <img :src="localServer + image_url" class="object-cover w-32 h-32 border rounded" />
                        <button type="button" @click="handleRemoveExistingImage" class="mt-2 text-sm text-red-500">
                            លុបរូបភាព
                        </button>
                    </div> -->
                </div>

                <!-- Buttons -->
                <div class="flex justify-end col-span-2 gap-3 mt-4">
                    <Button @click="handleClose" type="button" variant="red" class="rounded-none font-bayon">
                        បោះបង់
                    </Button>
                    <Button :loading="isLoading" type="submit" variant="green" class="rounded-none font-bayon">
                        {{ updateData ? 'រក្សាទុក' : 'បង្កើត' }}
                    </Button>
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import Product from '../../types/product'
import { producStore } from '../../stores/product.store'
import { useNotification } from '../../composables/useNotification'
import TextFieldInput from '../../components/ui/TextFieldInput.vue'
import Select from '../../components/ui/Select.vue'
import Button from '../../components/ui/Button.vue'
import TextAreaInput from '../../components/ui/TextAreaInput.vue'
import { categoryStore } from '../../stores/category.store'
import { localServer } from '../../../server/localServer'

export default {
    components: { TextFieldInput, Select, Button, TextAreaInput },
    props: ['loadData', 'updateData'],
    setup(props, { emit }) {

        const product = producStore()
        const { notify } = useNotification()

        const name = ref('')
        const code = ref('')
        const description = ref('')
        const price = ref(0)
        const cost = ref(0)
        const qty = ref(0)
        const is_manage_stock = ref(true)
        const alert_stock = ref(0)
        const status = ref(true)
        const image_url = ref<string | null>(props.updateData?.image_url || null)
        const categoryName = ref('')
        const unit = ref('')

        const currentDataByOption = ref<{ label: string; value: string }[]>([])
        const category = categoryStore()

        const isLoading = ref(false)
        const profit = computed(() => price.value - cost.value)

        const imageFile = ref<File | null>(null)
        const imagePreview = ref<string | null>(null)
            

        const statusOptions = [
            { label: 'សកម្ម', value: true },
            { label: 'អសកម្ម', value: false }
        ]

        const manageStockOptions = [
            { label: 'គ្រប់គ្រង', value: true },
            { label: 'មិនគ្រប់គ្រង', value: false }
        ]

        // Fetch categories
        onMounted(async () => {
            isLoading.value = true
            try {
                await category.fetchCategories()
                currentDataByOption.value = category.getCategories.map(cat => ({
                    label: cat.name,
                    value: cat._id
                }))
            } catch (err) {
                console.error(err)
            } finally {
                isLoading.value = false
            }
        })

        // Populate updateData
        onMounted(() => {
            if (props.updateData) {
                const data: Product = props.updateData
                name.value = data.name
                code.value = data.code
                description.value = data.description
                price.value = data.price
                cost.value = data.cost
                qty.value = data.qty
                unit.value = data.unit
                is_manage_stock.value = data.is_manage_stock,
                    alert_stock.value = data.alert_stock
                status.value = data.status
                image_url.value = data.image_url || null
                categoryName.value = data.category_id?._id || ''
            }
        })

        watch(is_manage_stock, (val) => {
            if (val === false) {
                qty.value = 0
            }
        })


        const handleImageUpload = (event: Event) => {
            const input = event.target as HTMLInputElement
            const file = input.files?.[0]

            if (!file) return

            const MAX_SIZE = 2 * 1024 * 1024 // 2MB

            // Check file size
            if (file.size > MAX_SIZE) {
                notify({
                    message: "Image size must be less than 2MB",
                    type: "error",
                })
                // Reset input and clear preview/file
                input.value = ""
                imageFile.value = null
                imagePreview.value = null
                return
            }

            // Valid file: set new file and preview
            imageFile.value = file
            imagePreview.value = URL.createObjectURL(file)

            // Remove old image_url if a new file is selected
            image_url.value = null
        }
        const handleRemoveNewImage = () => {
            if (imagePreview.value?.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview.value)
            }
            imagePreview.value = null
            imageFile.value = null
        }

        const handleRemoveExistingImage = () => {
            image_url.value = null
        }

        const handleSubmit = async () => {
            isLoading.value = true
            try {
                const formData = new FormData()
                formData.append('_id', props.updateData?._id || '')
                formData.append('name', name.value)
                formData.append('code', code.value)
                formData.append('category_id', categoryName.value)
                formData.append('description', description.value)
                formData.append('price', price.value.toString())
                formData.append('cost', cost.value.toString())
                formData.append('profit', profit.value.toString())
                formData.append('qty', qty.value.toString())
                formData.append('alert_stock', alert_stock.value.toString())
                formData.append('unit', unit.value)
                formData.append('is_manage_stock', is_manage_stock.value ? 'true' : 'false')
                formData.append('status', status.value ? 'true' : 'false')

                // Image handling
                if (imageFile.value) {
                    formData.append('image', imageFile.value)
                } else {
                    formData.append('image_url', image_url.value || '') // send empty string if removed
                }

                if (props.updateData?._id) {
                    await product.updateData(formData as any)
                    notify({ message: 'Product updated successfully', type: 'success' })
                } else {
                    await product.createData(formData as any)
                    notify({ message: 'Product created successfully', type: 'success' })
                }

                await props.loadData()
                handleClose()
            } catch (err: any) {
                notify({ message: err.message || 'Operation failed', type: 'error' })
            } finally {
                isLoading.value = false
            }
        }

        const handleClose = () => emit('close')

        return {
            name, code, description, price, cost, qty, profit,
            is_manage_stock, status, statusOptions, manageStockOptions,
            isLoading, handleSubmit, handleClose,
            handleImageUpload, handleRemoveNewImage, handleRemoveExistingImage,
            categoryName, imageFile, imagePreview, image_url,
            currentDataByOption, localServer,
            alert_stock,
            unit
        }
    }
}
</script>