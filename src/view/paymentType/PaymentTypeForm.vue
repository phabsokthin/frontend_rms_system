<template>
    <!-- Modal -->
    <div class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>

        <div class="relative z-10 w-full max-w-md p-6 bg-white shadow-2xl">
            <h2 class="mb-4 text-xl font-semibold text-gray-800 font-bayon">
                {{ updateData ? 'កែប្រែប្រភេទការទូទាត់' : 'បង្កើតប្រភេទការទូទាត់ថ្មី' }}
            </h2>

            <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
                <TextFieldInput v-model="name" label="ប្រភេទគណនី" placeholder="Payment Type Name" required />
                <TextFieldInput v-model="description" label="ពិព័រនា" placeholder="Description" />

                <div>
                    <Select v-model="status" required :options="statusOptions" label="ស្ថានភាព"
                        placeholder="ជ្រើសរើសស្ថានភាព" />
                </div>

                <div class="flex justify-end gap-3 mt-4">
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
import { ref, onMounted } from 'vue'
import TextFieldInput from '../../components/ui/TextFieldInput.vue'
import Button from '../../components/ui/Button.vue'
import { useNotification } from '../../composables/useNotification'
import { paymentTypeStore } from '../../stores/paymentType.store'
import PaymentType from '../../types/paymentType'
import Select from '../../components/ui/Select.vue'

export default {
    components: { TextFieldInput, Button,Select},
    props: ['loadData', 'updateData'],
    setup(props, { emit }) {
        const store = paymentTypeStore()

        const name = ref('')
        const description = ref('')
        const status = ref(true) // default active
        const isLoading = ref(false)
        const { notify } = useNotification()

        const statusOptions = [
            { label: 'សកម្ម', value: true },
            { label: 'អសកម្ម', value: false }
        ]


        // Populate fields if editing
        onMounted(() => {
            if (props.updateData) {
                name.value = props.updateData.name
                description.value = props.updateData.description
                status.value = props.updateData.status
            }
        })

        const handleSubmit = async () => {
            isLoading.value = true
            try {
                const data: PaymentType = {
                    _id: props.updateData?._id || '',
                    name: name.value,
                    description: description.value,
                    status: status.value
                }

                if (props.updateData?._id) {
                    const res: any = await store.updateData(data)
                    await props.loadData()
                    notify({ message: res?.message || 'PaymentType updated', type: 'success' })
                } else {
                    const res: any = await store.createData(data)
                    await props.loadData()
                    notify({ message: res?.message || 'PaymentType created', type: 'success' })
                }

                handleClose()
            } catch (err: any) {
                notify({ message: err.message || 'Operation failed', type: 'error' })
            } finally {
                isLoading.value = false
            }
        }

        const handleClose = () => emit('close')

        return {
            name,
            description,
            status,
            handleSubmit,
            handleClose,
            isLoading,
            statusOptions
        }
    }
}
</script>