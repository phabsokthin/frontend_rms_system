<template>
    <!-- Modal -->
    <div class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
        <div class="relative z-10 w-full max-w-3xl p-6 bg-white border-t-2 shadow-2xl border-t-green-700">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-gray-800 font-bayon">
                    មើលលម្អិតការទិញ
                </h2>
                <button @click="handleClose"
                    class="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 font-bayon">
                    បិទ
                </button>
            </div>

            <div class="grid grid-cols-2 gap-2">
                <!-- Supplier Info -->
                <div class="p-4 mb-6 border bg-gray-50">
                    <h3 class="mb-3 text-lg font-semibold text-gray-700 font-bayon">ព័ត៌មានអ្នកផ្គត់ផ្គង់</h3>
                    <ul class="space-y-1 text-gray-600">
                        <li><span class="font-semibold font-bayon">ឈ្មោះ:</span> {{ purchaseDetails.supplier_id.name }}
                        </li>
                        <li><span class="font-semibold font-bayon">ទំនាក់ទំនង:</span> {{
                            purchaseDetails.supplier_id.contact_person }}
                        </li>
                        <li><span class="font-semibold font-bayon">ទូរស័ព្ទ:</span> {{ purchaseDetails.supplier_id.phone
                        }}</li>
                        <li><span class="font-semibold font-bayon">អ៊ីមែល:</span> {{ purchaseDetails.supplier_id.email
                        }}</li>
                        <li><span class="font-semibold font-bayon">អាសយដ្ឋាន:</span> {{
                            purchaseDetails.supplier_id.address }}</li>
                    </ul>
                </div>

                <!-- Purchase Info -->
                <div class="p-4 mb-6 border bg-gray-50">
                    <h3 class="mb-3 text-lg font-semibold text-gray-700 font-bayon">ព័ត៌មានការទិញ</h3>
                    <ul class="space-y-1 text-gray-600">
                        <li><span class="font-semibold font-bayon">កាលបរិច្ឆេទ:</span> {{ new
                            Date(purchaseDetails.purchase_date).toLocaleString() }}</li>
                        <li class="space-x-2"><span class="font-semibold font-bayon">ស្ថានភាព:</span>
                            <span
                                :class="purchaseDetails.status === 'pending' ? 'text-yellow-600 font-bold capitalize bg-yellow-100 p-1 rounded-md' : 'text-green-600 font-bold capitalize bg-green-100 p-1 rounded-md'">
                                {{ purchaseDetails.status }}
                            </span>
                        </li>
                        <li><span class="font-semibold font-bayon">ចំណាំ:</span> {{ purchaseDetails.notes }}</li>
                    </ul>
                </div>
            </div>

            <!-- Items Table -->
            <div class="p-4 mb-6 border bg-gray-50">
                <h3 class="mb-3 text-lg font-semibold text-gray-700 font-bayon">ទំនិញ</h3>
                <table class="w-full border border-collapse border-gray-300 text-md">
                    <thead class="text-gray-700 bg-gray-100 font-bayon">
                        <tr>
                            <th class="p-2 border">រូបភាព</th>

                            <th class="p-2 border">ប្រភេទ</th>
                            <th class="p-2 border">ចំនួន</th>
                            <th class="p-2 border">តម្លៃ</th>
                            <th class="p-2 border">សរុប</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in purchaseDetails.items" :key="item.product_id._id" class="hover:bg-gray-50">
                            <td class="p-2 text-center border">
                                <div class="flex items-center gap-2">
                                    <div>
                                        <img v-if="item.product_id?.image_url"
                                            :src="localServer + item.product_id?.image_url"
                                            class="object-cover border rounded w-14 h-14" />

                                        <span v-else class="text-sm text-gray-400">
                                            <img src="https://bunchobagels.com/wp-content/uploads/2024/09/placeholder.jpg"
                                                class="w-14" alt="">
                                        </span>
                                    </div>
                                    <span>{{ item.product_id?.name || 'N/A' }}</span>
                                </div>
                            </td>

                            <td class="p-2 border">{{ item.product_id.category_id.name }}</td>
                            <td class="p-2 text-center border">{{ item.qty }}</td>
                            <td class="p-2 text-right border">{{ item.price }} {{ purchaseDetails.currency === 'usd' ?
                                '$' : '៛' }}</td>
                            <td class="p-2 font-semibold text-right border">{{ item.subtotal }}

                                {{ purchaseDetails.currency === 'usd' ? '$' : '៛' }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Summary -->
            <div class="p-4 mb-6 border bg-gray-50">
                <h3 class="mb-3 text-lg font-semibold text-gray-700 font-bayon">សរុប</h3>
                <ul class="space-y-1 text-gray-600">
                    <li><span class="font-semibold font-bayon">ចំនួនសរុប:</span> {{ purchaseDetails.total_amount }} {{
                        purchaseDetails.currency === 'usd' ? '$' : '៛' }}</li>
                    <li><span class="font-semibold font-bayon">ពន្ធ:</span> {{ purchaseDetails.tax }} {{
                        purchaseDetails.currency
                            === 'usd' ? '$' : '៛' }}</li>
                    <li><span class="font-semibold font-bayon">បញ្ចុះតម្លៃ:</span> {{ purchaseDetails.discount }} {{
                        purchaseDetails.currency === 'usd' ? '$' : '៛' }}</li>
                    <li><span class="font-semibold font-bayon">ការទូទាត់:</span> {{ purchaseDetails.payment }} {{
                        purchaseDetails.currency === 'usd' ? '$' : '៛' }}</li>

                    <li><span class="font-semibold font-bayon">ទូទាត់តាម:</span> {{ purchaseDetails.payment_type_id?.name }} </li>
                </ul>
            </div>

            <!-- Payment Status -->
            <div class="mt-4">
                <span class="font-semibold font-bayon">ស្ថានភាពទូទាត់:</span>
                <span v-if="purchaseDetails.payment === purchaseDetails.total_amount" class="font-bold text-green-600">
                    បានទូទាត់
                </span>
                <span v-else-if="purchaseDetails.payment < purchaseDetails.total_amount" class="font-bold text-red-600">
                    ជំពាក់ ({{ purchaseDetails.total_amount - purchaseDetails.payment }}
                    {{ purchaseDetails.currency === 'usd' ? '$' : '៛' }})
                </span>
                <span v-else class="font-bold text-blue-600">
                    លុយអាប់ ({{ purchaseDetails.payment - purchaseDetails.total_amount }}
                    {{ purchaseDetails.currency === 'usd' ? '$' : '៛' }})
                </span>
            </div>
            <!-- <pre>{{ purchaseDetails }}</pre> -->
        </div>
    </div>
</template>

<script lang="ts">
import { localServer } from '../../../server/localServer';

export default {
    props: ['purchaseDetails'],
    setup(props, { emit }) {
        const handleClose = () => {
            emit("close");
        };
        return { handleClose, localServer };
    }
}
</script>
