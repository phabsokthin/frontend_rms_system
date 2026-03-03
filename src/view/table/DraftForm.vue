<template>
    <!-- Modal -->
    <div class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
        <div class="relative z-10 w-full max-w-md p-6 bg-white shadow-2xl ">
            <h2 class="mb-4 text-xl font-semibold text-gray-800 font-bayon">
                កំណត់កាកក់មុន
            </h2>
            <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">

                <TextAreaInput label="កត់ចំណាំ" v-model="draft" placeholder="Tag a note" required />

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
import { tableStore } from '../../stores/table.store';


export default {

    components: { TextFieldInput, Button, TextAreaInput },
    props: ['loadData', 'updateData'],
    setup(props, { emit }) {

        const draft = ref("")
        const table = tableStore()
        const { notify } = useNotification()
        const isLoading = ref(false)

        //handle submit
        const handleSubmit = async () => {
            isLoading.value = true;

            try {
                const data: any = {
                    _id: props.updateData?._id, // include _id for update
                    draft: draft.value,
                    status: false
                };

                if (props.updateData?._id) {
                    const res: any = await table.updateData(data);
                    await props.loadData();
                    notify({
                        message: res?.message || "Table updated draft successfully",
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
            draft,
            handleSubmit,
            isLoading

        }
    }
}

</script>