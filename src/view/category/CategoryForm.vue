<template>
    <!-- Modal -->
    <div class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
        <div class="relative z-10 w-full max-w-md p-6 bg-white shadow-2xl ">
            <h2 class="mb-4 text-xl font-semibold text-gray-800 font-bayon">
                បង្កើតប្រភេទថ្មី 
            </h2>
            <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
                <TextFieldInput label="ឈ្មោះ" ref="firstInput" v-model="names" placeholder="Cateogry Name" class=""
                    required />
                <TextFieldInput label="ពិព៍រនា" v-model="description" placeholder="Description" class="" />

                <div class="flex justify-end gap-3 mt-4">
                    <Button @click="handleClose" type="button" variant="red"
                        class="rounded-none font-bayon">បោះបង់</Button>
                    <Button @click="handleSubmit" :loading="isLoading" type="submit" variant="green"
                        class="rounded-none font-bayon">បង្កើត</Button>
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts">

import { onMounted, ref } from 'vue';
import TextFieldInput from '../../components/ui/TextFieldInput.vue'
import Button from '../../components/ui/Button.vue';
import { categoryStore } from '../../stores/category.store';
import Category from '../../types/category';
import { useNotification } from '../../composables/useNotification';


export default {

    components: { TextFieldInput, Button },
    props: ['loadData', 'updateData'],
    setup(props, { emit }) {

        const category = categoryStore()
        const names = ref("")
        const description = ref("")
        const { notify } = useNotification()
        const isLoading = ref(false)


        // display updateData
        onMounted(() => {
            if (props.updateData) {
                names.value = props.updateData.name
                description.value = props.updateData.description
            }
        })

        //handle submit
        const handleSubmit = async () => {
            isLoading.value = true;

            try {
                const data: Category = {
                    _id: props.updateData?._id || "", // include _id for update
                    name: names.value,
                    description: description.value,
                };

                if (props.updateData?._id) {
                    const res: any = await category.updateCategory(data);
                    await props.loadData();
                    notify({
                        message: res?.message || "Category updated successfully",
                        type: "success",
                    });
                } else {
                    // CREATE
                    const res: any = await category.createCategory(data);
                    await props.loadData();

                    notify({
                        message: res?.message || "Category created successfully",
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
            names,
            description,
            handleSubmit,
            isLoading

        }
    }
}

</script>