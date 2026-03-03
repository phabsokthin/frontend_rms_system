<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>

        <div class="relative z-10 w-full max-w-2xl p-6 bg-white shadow-2xl">
            <h2 class="mb-4 text-xl font-semibold text-gray-800 font-bayon">
                {{ updateData ? 'កែប្រែបុគ្គលិក' : 'បង្កើតបុគ្គលិកថ្មី' }} 
            </h2>

            <form @submit.prevent="handleSubmit" class="grid grid-cols-2 gap-4">

                <TextFieldInput label="ត្រកូល" v-model="first_name" required placeholder="First Name" />
                <TextFieldInput label="ឈ្មោះ" v-model="last_name" required placeholder="Last Name" />

                <TextFieldInput label="លេខទូរស័ព្ទ" v-model="phone" required placeholder="Phone" />
                <TextFieldInput label="អុីម៉ែល" v-model="email" required placeholder="Email" />

                <TextFieldInput label="តួនាទី" v-model="position" required placeholder="Position" />
                <TextFieldInput label="អាស័យដ្ឋាន" v-model="address" required placeholder="Address" />

                <TextFieldInput label="ម៉ោងចូល" v-model="start_time" required type="time" class="Start Time" />
                <TextFieldInput label="ម៉ោងចេញ" v-model="end_time" required type="time" placeholder="End Time" />
                <TextFieldInput label="ប្រាក់ខែ" v-model="salary" type="number" placeholder="Salary" :min="0" />

                <!-- Gender -->
                <div>
                    <Select v-model="gender" required :options="genderOption" label="ភេទ" placeholder="ជ្រើសរើសភេទ" />
                </div>

                <!-- Status -->
                <div>
                    <Select v-model="status" required :options="statusOptions" label="ស្ថានភាព"
                        placeholder="ជ្រើសរើសស្ថានភាព" />
                </div>

                <div class="flex justify-end col-span-2 gap-3 mt-4">
                    <Button @click="handleClose" type="button" variant="red" class="rounded-none font-bayon">
                        បោះបង់
                    </Button>

                    <Button type="submit" :loading="isLoading" variant="green" class="rounded-none font-bayon">
                        {{ updateData ? 'កែប្រែ' : 'បង្កើត' }}
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
import { staffStore } from '../../stores/staff.store'
import Staff from '../../types/staff'
import Select from '../../components/ui/Select.vue'

export default {
    components: { TextFieldInput, Button, Select },
    props: ['loadData', 'updateData'],

    setup(props, { emit }) {

        const statusOptions = [
            { label: 'សកម្ម', value: true },
            { label: 'មិនសកម្ម', value: false }
        ]
        const genderOption = [
            { label: 'ប្រុស', value: 'male' },
            { label: 'ស្រី', value: 'female' },
        ]


        const staff = staffStore()
        const { notify } = useNotification()
        const isLoading = ref(false)

        // Form fields
        const first_name = ref('')
        const last_name = ref('')
        const phone = ref('')
        const gender = ref<'male' | 'female'>('male')
        const email = ref('')
        const position = ref('')
        const address = ref('')
        const start_time = ref('')
        const end_time = ref('')
        const salary = ref(Number(0))
        const status = ref(true)

        // Load update data
        onMounted(() => {
            if (props.updateData) {
                const data = props.updateData
                first_name.value = data.first_name
                last_name.value = data.last_name
                phone.value = data.phone
                gender.value = data.gender
                email.value = data.email || ''
                position.value = data.position
                address.value = data.address
                start_time.value = data.start_time || ''
                end_time.value = data.end_time || ''
                salary.value = data.salary
                status.value = data.status
            }
        })

        const handleSubmit = async () => {
            isLoading.value = true

            try {
                const data: Staff = {
                    _id: props.updateData?._id || '',
                    first_name: first_name.value,
                    last_name: last_name.value,
                    phone: phone.value,
                    gender: gender.value,
                    email: email.value || undefined,
                    position: position.value,
                    address: address.value,
                    start_time: start_time.value || undefined,
                    end_time: end_time.value || undefined,
                    salary: salary.value,
                    status: status.value
                }

                if (props.updateData?._id) {
                    const res: any = await staff.updateData(data)
                    notify({
                        message: res?.message,
                        type: "success",
                    });
                } else {
                    const res: any = await staff.createData(data)
                    console.log(data)
                    notify({
                        message: res?.message,
                        type: "success",
                    });
                }

                await props.loadData()
                handleClose()

            } catch (err: any) {
                notify({ message: err.message || 'Operation failed', type: 'error' })
            } finally {
                isLoading.value = false
            }
        }

        const handleClose = () => {
            emit('close')
        }

        return {
            first_name,
            last_name,
            phone,
            gender,
            email,
            position,
            address,
            start_time,
            end_time,
            salary,
            status,
            handleSubmit,
            handleClose,
            isLoading,
            statusOptions,
            genderOption
        }
    }
}
</script>