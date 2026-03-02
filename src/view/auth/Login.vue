<template>
    <div>
        <div class="py-16 ">
            <form @submit.prevent="handleLogin" action=""
                class="flex max-w-sm mx-auto overflow-hidden bg-white shadow-lg lg:max-w-4xl">
                <div class="hidden bg-cover lg:block lg:w-1/2"
                    style="background-image:url('https://media.licdn.com/dms/image/v2/D4D12AQHLvThyTo0aMw/article-cover_image-shrink_720_1280/B4DZYO12JgH4AM-/0/1744005720365?e=2147483647&v=beta&t=JAzpZp0zlCMT5zqkZTtlCNWcABFFhcsLsN9rUDFkdAs')">
                </div>
                <div class="w-full p-8 lg:w-1/2">
                    <h2 class="text-2xl font-semibold text-center text-gray-700 font-bayon">ចូលប្រើប្រាស់</h2>
                    <p class="text-xl text-center text-gray-600 font-bayon">សូមស្វាគមន៍មកការប្រភព័ន្ធគ្រប់គ្រងភោនីដ្ឋាន
                    </p>

                    <div class="flex items-center justify-between mt-4">
                        <span class="w-1/5 border-b lg:w-1/4"></span>
                        <a href="#" class="text-xs text-center text-gray-500 uppercase">or login with email</a>
                        <span class="w-1/5 border-b lg:w-1/4"></span>
                    </div>
                    <div class="mt-4">
                        <TextFieldInput v-model="email" required label="អ៊ីម៉ែល" placeholder="Email" className="" />
                    </div>
                    <div class="mt-4">
                        <div class="mt-4">
                            <TextFieldInput required v-model="password" type="password" label="ពាក្យសម្ងាត់"
                                placeholder="Password" className="" />
                        </div>
                    </div>
                    <div class="mt-8">
                        <Button variant="green" @click="" class="w-full rounded-none font-bayon"
                            :loading="loading">ចូលប្រើប្រាស់</Button>

                    </div>
                    <div class="flex items-center justify-between mt-4">
                        <span class="w-1/5 border-b md:w-1/4"></span>
                        <a href="#" class="text-xs text-gray-500 uppercase">or sign up</a>
                        <span class="w-1/5 border-b md:w-1/4"></span>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>


<script lang="ts">
import TextFieldInput from '../../components/ui/TextFieldInput.vue';
import Button from '../../components/ui/Button.vue';
import UserAuth from '../../types/auth';
import { ref } from 'vue';
import { useNotification } from '../../composables/useNotification';
import { useAuthStore } from '../../stores/auth.store';
import { useRouter } from 'vue-router';

const { notify } = useNotification()
export default {
    components: {
        TextFieldInput,
        Button
    },

    setup() {

        const email = ref("")
        const password = ref("")
        const auth = useAuthStore()
        const loading = ref(false)
        const router = useRouter()

        const handleLogin = async () => {
            loading.value = true
            try {
                const data: UserAuth = {
                    email: email.value,
                    password: password.value,
                }

                const res = await auth.login(data)

                notify({
                    message: res.message,
                    type: "success",
                })

                router.push("/")

            } catch (error: any) {
                notify({
                    message: error.message,
                    type: "error",
                })
            }
            finally {
                loading.value = false
            }

        }

        return {
            email,
            password,
            handleLogin,
            loading

        };
    }
};
</script>