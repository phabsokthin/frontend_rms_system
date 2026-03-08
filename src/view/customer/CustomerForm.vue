<template>
    <!-- Modal -->
    <div class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
        <div class="relative z-10 w-full max-w-md p-6 bg-white shadow-2xl ">
            <h2 class="mb-4 text-xl font-semibold text-gray-800 font-bayon">
                {{ updateData ? 'កែប្រែអតិថិជន' : 'បង្កើតអតិថិជនថ្មី' }}
            </h2>

            <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
                <TextFieldInput label="ត្រកូល" v-model="first_name" placeholder="First Name" required />
                <TextFieldInput label="ឈ្មោះ" v-model="last_name" placeholder="Last Name" required />
                 <TextFieldInput label="លេខទូរស័ព្ទ" v-model="phone" placeholder="Enter Phone" required />
                <TextFieldInput label="អ៊ីម៉ែល" v-model="email" placeholder="Enter Email" />
               
                <TextFieldInput label="អាស័យដ្ឋាន" v-model="address" placeholder="Enter Address" />
                <TextAreaInput label="កំណត់ត្រា" v-model="notes" placeholder="Notes" />

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
import { onMounted, ref } from 'vue'
import TextFieldInput from '../../components/ui/TextFieldInput.vue'
import Button from '../../components/ui/Button.vue'
import { useNotification } from '../../composables/useNotification'
import { customerStore } from '../../stores/customer.store'
import Customer from '../../types/customer'
import Select from '../../components/ui/Select.vue'
import TextAreaInput from '../../components/ui/TextAreaInput.vue'

export default {
    components: { TextFieldInput, Button, Select,TextAreaInput },
    props: ['loadData', 'updateData'],
    setup(props, { emit }) {


        const customer = customerStore()
        const first_name = ref('')
        const last_name = ref('')
        const email = ref('')
        const phone = ref('')
        const address = ref('')
        const notes = ref('')
        const status = ref(true) // default active

        const statusOptions = [
            { label: 'សកម្ម', value: true },
            { label: 'អសកម្ម', value: false }
        ]

        const { notify } = useNotification()
        const isLoading = ref(false)

        // Display updateData if editing
        onMounted(() => {
            if (props.updateData) {
                first_name.value = props.updateData.first_name
                last_name.value = props.updateData.last_name
                email.value = props.updateData.email
                phone.value = props.updateData.phone
                address.value = props.updateData.address
                notes.value = props.updateData.notes
                status.value = props.updateData.status
            }
        })

        // Handle submit
        const handleSubmit = async () => {
            isLoading.value = true
            try {
                const data: Customer = {
                    _id: props.updateData?._id || '',
                    first_name: first_name.value,
                    last_name: last_name.value,
                    email: email.value,
                    phone: phone.value,
                    address: address.value,
                    notes: notes.value,
                    status: status.value
                }

                if (props.updateData?._id) {
                    const res: any = await customer.updateData(data)
                    await props.loadData()
                    notify({ message: res?.message || 'Customer updated', type: 'success' })
                } else {
                    const res: any = await customer.createData(data)
                    await props.loadData()
                    notify({ message: res?.message || 'Customer created', type: 'success' })
                }

                handleClose()
            } catch (err: any) {
                notify({ message: err.message || 'Operation failed', type: 'error' })
            } finally {
                isLoading.value = false
            }
        }

        // Handle close
        const handleClose = () => {
            emit('close')
        }

        return {
            first_name,
            last_name,
            email,
            phone,
            address,
            notes,
            status,
            handleSubmit,
            handleClose,
            isLoading,
            statusOptions
        }
    }
}
</script>