<template>
    <div class="grid min-h-screen grid-cols-12 gap-6 px-4">

        <!-- LEFT SIDE -->
        <div class="col-span-8">

            <!-- Header -->
            <div class="mb-[15px] flex items-center justify-between">
                <h1 class="text-xl font-bayon">ផ្ទាំងលក់</h1>

                <div class="flex gap-2">
                    <TextFieldInput v-model="searchTerm" placeholder="ស្វែងរកផលិតផល" class="font-bayon" />

                    <Button @click="handleCreatePopup" variant="green" class="rounded-none font-bayon">
                        + បង្កើតថ្មី
                    </Button>
                </div>
            </div>

            <div class="flex gap-2 mb-3 overflow-x-auto">

                <button @click="selectedCategory = null" :class="[
                    'px-3 py-1 border font-bayon whitespace-nowrap',
                    !selectedCategory ? 'bg-green-500 text-white' : 'bg-white'
                ]">
                    ទាំងអស់
                </button>

                <button v-for="cat in categories" :key="cat._id" @click="selectedCategory = cat._id" :class="[
                    'px-3 py-1 border font-bayon whitespace-nowrap',
                    selectedCategory === cat._id
                        ? 'bg-green-500 text-white'
                        : 'bg-white'
                ]">
                    {{ cat.name }}
                </button>

            </div>
            <div v-if="isLoading">
                <Loading />
            </div>

            <!-- Not Found -->
            <div v-else-if="paginatedData.length === 0"
                class="flex items-center justify-center text-lg text-gray-400 h-60 font-bayon">
                មិនមានទិន្នន័យ
            </div>

            <!-- Product Grid -->
            <div v-else class="grid grid-cols-3 gap-3 overflow-y-auto lg:grid-cols-4">
                <div v-for="item in paginatedData" :key="item._id" @click="addToCart(item)"
                    class="p-2 bg-white border cursor-pointer hover:shadow-md hover:border-green-500">
                    <div class="flex justify-center">
                        <div v-if="item.image_url">
                            <img :src="localServer + item.image_url" class="object-cover rounded h-28" />
                        </div>
                        <div v-else>
                            <img src="https://order.eatify.io/assets/img/eatify/default-menu-image-placeholder.png"
                                class="object-cover rounded h-28">
                        </div>
                    </div>

                    <h3 class="mt-2 text-xl font-bayon">
                        {{ item.name }}
                    </h3>

                    <p class="text-sm text-gray-500 gray-500 font-bayon">
                        {{ item.category_id?.name }}
                    </p>

                    <div class="flex justify-between mt-1 font-bayon">
                        <span class="font-bold text-green-600">
                            ${{ item.price }}
                        </span>

                        <div class="text-xs text-gray-400">
                            <span v-if="item.is_manage_stock === false" class="text-green-600">មិនគ្រប់គ្រងស្តុក</span>
                            <span v-else> {{ item.qty }} ស្តុក</span>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Pagination -->
            <div class="flex items-center justify-between mt-3">
                <Pagination :current-page="currentPage" :total-pages="totalPages" :total-items="currentData.length"
                    :items-per-page="itemsPerPage" :on-page-change="handlePageChange" />

            </div>

        </div>

        <!-- RIGHT SIDE (CART) -->
        <div class="flex flex-col col-span-4 p-4 bg-white border h-[600px] overflow-y-auto ">
            <h2 class="mb-3 text-lg font-bayon">
                បញ្ជីការទិញ
            </h2>

            <!-- Cart List -->
            <div class="flex-1 overflow-y-auto">


                <div v-if="cart.length === 0" class="flex flex-col items-center justify-center py-10 text-gray-400">
                    <img src="https://orders.redrockcanyongrill.com/assets/img/redrock/default-menu-image-placeholder.png"
                        alt="Not found" class="object-contain w-48 mb-3" />
                    <p class="text-lg font-bayon">មិនមានទំនិញ</p>
                </div>

                <div v-else>

                    <div v-for="item in cart" :key="item._id" class="flex items-center justify-between py-2">
                        <div class="flex items-start gap-3">
                            <img :src="localServer + item.image_url" class="object-cover p-2 border h-28 w-28" />
                            <!-- Name and Price -->
                            <div class="flex flex-col justify-between gap-2">
                                <div>
                                    <p class="text-lg font-bayon">{{ item.name }}</p>
                                    <p class="text-sm text-gray-400">
                                        ${{ item.price }} each
                                    </p>
                                </div>

                                <div class="flex items-center">
                                    <!-- Decrease Button -->
                                    <Button variant="gray"
                                        class="w-6 h-8 bg-orange-500 rounded-none font-bayon hover:bg-orange-400 "
                                        @click="decreaseQty(item._id)">
                                        -
                                    </Button>

                                    <!-- Quantity Display -->
                                    <span
                                        class="flex items-center justify-center w-8 h-8 border border-r-0 border-l-0font-bayon bg-gray-50">
                                        {{ item.qty }}
                                    </span>

                                    <!-- Increase Button -->
                                    <Button variant="green"
                                        class="w-8 h-8 text-white rounded-none font-bayon hover:bg-green-500"
                                        @click="increaseQty(item._id)">
                                        +
                                    </Button>


                                </div>
                            </div>
                        </div>

                        <!-- Remove Item -->
                        <Button variant="red" @click="removeFromCart(item._id)"
                            class="flex items-center justify-center w-8 h-8 rounded-none font-bayon hover:bg-red-600">
                            <font-awesome-icon :icon="faTimes" class="text-sm text-white cursor-pointer" />

                        </Button>
                    </div>
                </div>



            </div>

            <!-- Total -->
            <div class="pt-3 mt-3 border-t">

                <div class="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${{ totalPrice }}</span>
                </div>

                <Button @click="handlePayment" class="flex w-full mt-3 rounded-none font-bayon" variant="green">
                    <div class="flex gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-wallet-icon lucide-wallet">
                            <path
                                d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                            <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
                        </svg> <span>ទូទាត់</span>
                    </div>
                </Button>

            </div>

        </div>

        <!-- Dynamic Component -->
        <div>
            <component :is="currentComponent" @close="currentComponent = ''" :loadData="loadData"
                :updateData="updateData" />
        </div>

    </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import Button from "../../components/ui/Button.vue";
import Pagination from "../../components/ui/Pagination.vue";
import DeletePopup from "../../components/ui/DeletePopup.vue";
import TextFieldInput from "../../components/ui/TextFieldInput.vue";
import Loading from "../../components/ui/Loading.vue";

import { producStore } from "../../stores/product.store";
import { useNotification } from "../../composables/useNotification";

import type Product from "../../types/product";
import { localServer } from "../../../server/localServer";
import { faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";



export default {
    components: {
        Button,
        Pagination,
        Loading,
        DeletePopup,
        TextFieldInput,
    },

    setup() {
        const product = producStore();

        const currentData = ref<Product[]>([]);
        const currentPage = ref(1);
        const itemsPerPage = ref(12);

        const searchTerm = ref("");

        const currentComponent = ref("");
        const updateData = ref("");

        const { notify } = useNotification();

        const cart = ref<any[]>([]);

        const isLoading = ref(false);
        const selectedCategory = ref<string | null>(null)


        onMounted(async () => {
            isLoading.value = true;

            try {
                await product.fetchDtaByStatus();
                currentData.value = product.getProduct;
            } catch (err) {
                console.log(err);
            } finally {
                isLoading.value = false;
            }
        });

        const filteredData = computed(() => {
            let data = currentData.value

            // filter by search term
            if (searchTerm.value) {
                const term = searchTerm.value.toLowerCase()

                data = data.filter(item => {
                    const nameMatch = item.name?.toLowerCase().includes(term)
                    const codeMatch = item.code?.toLowerCase().includes(term)
                    return nameMatch || codeMatch
                })
            }

            // Optional: filter by category
            if (selectedCategory.value) {
                data = data.filter(item => item.category_id?._id === selectedCategory.value)
            }

            return data
        })
        const paginatedData = computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage.value;
            const end = start + itemsPerPage.value;
            return filteredData.value.slice(start, end);
        });

        const totalPages = computed(() => {
            return Math.ceil(filteredData.value.length / itemsPerPage.value);
        });

        const handlePageChange = (page: number) => {
            currentPage.value = page;
        };

        watch(itemsPerPage, () => {
            currentPage.value = 1;
        });

        const handleCreatePopup = () => {
            currentComponent.value = "CategoryForm";
            updateData.value = "";
        };

        const addToCart = (product: Product) => {
            const exist = cart.value.find((p) => p._id === product._id);

            if (exist) {
                exist.qty += 1;
            } else {
                cart.value.push({
                    ...product,
                    qty: 1,
                });
            }
        };

        const totalPrice = computed(() => {
            return cart.value.reduce((total, item) => {
                return total + item.price * item.qty;
            }, 0);
        });

        async function loadData() {
            await product.fetchDta();
            currentData.value = product.getProduct;
        }


        //filter by category

        const categories = computed(() => {
            const map = new Map()

            currentData.value.forEach((p) => {
                if (p.category_id) {
                    map.set(p.category_id._id, p.category_id)
                }
            })

            return Array.from(map.values())
        })

        // Remove a single item by _id
        const removeFromCart = (id: string) => {
            cart.value = cart.value.filter(item => item._id !== id)
        }

        // Clear entire cart
        const clearCart = () => {
            cart.value = []
        }


        const increaseQty = (id: string) => {
            const product = cart.value.find(item => item._id === id)
            if (product) {
                product.qty += 1
            }
        }

        const decreaseQty = (id: string) => {
            const product = cart.value.find(item => item._id === id)
            if (product && product.qty > 1) {
                product.qty -= 1
            } else if (product && product.qty === 1) {
                // Optional: remove item if qty goes to 0
                removeFromCart(id)
            }
        }
        const handlePayment = () => {
            if (cart.value.length === 0) {
                 notify({
                    message: "រទះរបស់អ្នកគឺទទេរ។ សូមជ្រើសរើសផលិត",
                    type: "warning",
                })
                return
            }

            // Build the payment payload
            const paymentPayload = {
                items: cart.value.map(item => ({
                    product_id: item._id,
                    qty: item.qty,
                    price: item.price,
                    subtotal: item.qty * item.price
                })),
                total: cart.value.reduce((sum, item) => sum + item.qty * item.price, 0)
            }

            console.log("Payment Payload:", paymentPayload)

            // Here you can send it to API
            // Example: 
            // api.post('/payment', paymentPayload)
            //    .then(() => {
            //       alert("Payment successful")
            //       cart.value = [] // clear cart
            //    })
            //    .catch(err => console.error(err))
        }

        return {
            currentData,
            currentPage,
            itemsPerPage,
            paginatedData,
            totalPages,
            handlePageChange,
            searchTerm,
            currentComponent,
            handleCreatePopup,
            loadData,
            updateData,
            cart,
            addToCart,
            totalPrice,
            localServer,
            isLoading,
            categories,
            selectedCategory,
            faTrash,
            removeFromCart,
            increaseQty,
            decreaseQty,
            faTimes,
            handlePayment
        };
    },
};
</script>

<style scoped>
.arrow-active {
    position: relative;
}

.arrow-active::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    border-top: 25px solid transparent;
    border-bottom: 25px solid transparent;
    border-left: 18px solid white;
}
</style>