<template>
    <!-- Modal -->
    <div class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>

        <div class="relative z-10 w-full max-w-md p-6 bg-white shadow-2xl">
            <h2 class="mb-4 text-xl font-semibold text-gray-800 font-bayon">
                {{ updateData ? 'កែប្រែអ្នកផ្គត់ផ្គង់' : 'បង្កើតអ្នកផ្គត់ផ្គង់ថ្មី' }}
            </h2>

            <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
                <TextFieldInput v-model="name" label="ឈ្មោះ" placeholder="Enter supplier name" required />
                <TextFieldInput v-model="contact_person" label="ឈ្មោះសម្រាប់​ទំនាក់ទំនង" placeholder="Enter contact person"
                    required />
                <TextFieldInput v-model="phone" label="លេខទូរស័ព្ទ" placeholder="Enter phone" />
                <TextFieldInput v-model="email" label="អុីម៉ែល" placeholder="Enter email" />
                <TextAreaInput v-model="address" label="អាស័យដ្ឋាន" placeholder="Enter address" />

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
import { supplierStore } from '../../stores/supplier.store'
import Supplier from '../../types/supplier'
import Select from '../../components/ui/Select.vue'
import TextAreaInput from '../../components/ui/TextAreaInput.vue'

export default {
    components: { TextFieldInput, Button,Select,TextAreaInput},
    props: ['loadData', 'updateData'],
    setup(props, { emit }) {
        const supplier = supplierStore()

        const name = ref('')
        const contact_person = ref('')
        const phone = ref('')
        const email = ref('')
        const address = ref('')
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
                contact_person.value = props.updateData.contact_person
                phone.value = props.updateData.phone
                email.value = props.updateData.email
                address.value = props.updateData.address
                status.value = props.updateData.status
            }
        })

        const handleSubmit = async () => {
            isLoading.value = true
            try {
                const data: Supplier = {
                    _id: props.updateData?._id || '',
                    name: name.value,
                    contact_person: contact_person.value,
                    phone: phone.value,
                    email: email.value,
                    address: address.value,
                    status: status.value
                }

                if (props.updateData?._id) {
                    const res: any = await supplier.updateData(data)
                    await props.loadData()
                    notify({ message: res?.message || 'Supplier updated', type: 'success' })
                } else {
                    const res: any = await supplier.createData(data)
                    await props.loadData()
                    notify({ message: res?.message || 'Supplier created', type: 'success' })
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
            contact_person,
            phone,
            email,
            address,
            status,
            handleSubmit,
            handleClose,
            isLoading,
            statusOptions
        }
    }
}
</script>