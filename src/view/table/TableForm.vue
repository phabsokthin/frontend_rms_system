<template>
    <!-- Modal -->
    <div class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
        <div class="relative z-10 w-full max-w-md p-6 bg-white shadow-2xl ">
            <h2 class="mb-4 text-xl font-semibold text-gray-800 font-bayon">
                បង្កើតលេខតុថ្មី
            </h2>
            <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
                <TextFieldInput label="លេខតុ" ref="firstInput" v-model="table_number" placeholder="លេខតុ" required
                    type="text" />

                <TextFieldInput label="សមត្ថភាព" v-model="capacity" placeholder="Capacity" type="number" required />

                <TextAreaInput label="ទីតាំង" v-model="location" placeholder="Location" required />

                <div class="flex justify-end gap-3 mt-4">
                    <Button @click="handleClose" type="button" variant="red" class="rounded-none font-bayon">
                        បោះបង់
                    </Button>
                    <Button type="submit" :loading="isLoading" variant="green" class="rounded-none font-bayon">
                        បង្កើត
                    </Button>
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts">

import { onMounted, ref } from 'vue';
import TextFieldInput from '../../components/ui/TextFieldInput.vue'
import Button from '../../components/ui/Button.vue';
import { useNotification } from '../../composables/useNotification';
import TextAreaInput from '../../components/ui/TextAreaInput.vue';
import Table from '../../types/table';
import { tableStore } from '../../stores/table.store';


export default {

    components: { TextFieldInput, Button, TextAreaInput },
    props: ['loadData', 'updateData'],
    setup(props, { emit }) {

        const table_number = ref("")
        const capacity = ref("")
        const location = ref("")

        const table = tableStore()

        const { notify } = useNotification()
        const isLoading = ref(false)



        // display updateData
        onMounted(() => {
            if (props.updateData) {
                table_number.value = props.updateData.table_number
                capacity.value = props.updateData.capacity
                location.value = props.updateData.location
            }
        })

        //handle submit
        const handleSubmit = async () => {
            isLoading.value = true;

            try {
                const data: Table = {
                    _id: props.updateData?._id, // include _id for update
                    table_number: table_number.value,
                    capacity: parseInt(capacity.value) || 0,
                    location: location.value,
                    status: true

                };

                if (props.updateData?._id) {
                    const res: any = await table.updateData(data);
                    await props.loadData();
                    notify({
                        message: res?.message || "Table updated successfully",
                        type: "success",
                    });
                } else {
                    // CREATE
                    const res: any = await table.createData(data);
                    await props.loadData();

                    notify({
                        message: res?.message || "Table created successfully",
                        type: "success",
                    });
                }

                handleClose();

            } catch (err: any) {
                notify({
                    message: err.message || "Operation failed",
                    type: "error",
                });
            } finally {
                isLoading.value = false;
            }
        };

        // handle close
        const handleClose = () => {
            emit("close")
        }

        return {
            handleClose,
            table_number,
            capacity,
            location,

            handleSubmit,
            isLoading

        }
    }
}

</script>