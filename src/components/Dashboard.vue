<template>
    <div class="p-4">
        <h1 class="mb-6 text-2xl font-bold font-bayon">ផ្ទាំងគ្រប់គ្រង</h1>

        <!-- 4-column grid -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <!-- Card 1: Sales -->
            <div class="p-4 text-white transition bg-blue-500 shadow hover:bg-blue-600">
                <h2 class="text-lg font-bayon">លក់</h2>
                <p class="mt-2 text-sm "><span class="font-bayon">លក់ថ្ងៃនេះ</span>: {{ totalUSD }} $ || {{ totalKHR }} ៛</p>
            </div>

            <!-- Card 2: Orders -->
            <div class="p-4 text-white transition bg-green-500 shadow hover:bg-green-600">
                <h2 class="text-lg font-bayon">បញ្ជាទិញ</h2>
                <p class="mt-2 text-sm"><span class="font-bayon">កាម្ម៉ងថ្ងៃនេះ</span>: {{ sellOrderData.length }} នាក់</p>
            </div>

            <!-- Card 3: Customers -->
            <div class="p-4 text-white transition bg-yellow-500 shadow hover:bg-yellow-600">
                <h2 class="text-lg font-bayon">អតិថិជន</h2>
                <p class="mt-2 text-sm "><span class="font-bayon">អតិថិជន​ថ្មី</span>: {{ currentData.length }} នាក់</p>
            </div>

            <!-- Card 4: Profit -->
            <div class="p-4 text-white transition bg-red-500 shadow hover:bg-red-600">
                <h2 class="text-lg font-bayon">អ្នកផ្គត់ផ្គង់</h2>
                <p class="mt-2 text-sm"><span class="font-bayon">អ្នកផ្គត់ផ្គង់ថ្មី</span>: {{ suplierData.length }}
                    នាក់
                </p>
            </div>
        </div>
    </div>
</template>



<script lang="ts">
import { onMounted, ref } from 'vue';
import { customerStore } from '../stores/customer.store';
import SellOrder, { Customer } from '../types/sellOrder';
import Supplier from '../types/supplier';
import { supplierStore } from '../stores/supplier.store';
import { sellOrderStore } from '../stores/sellOrder.store';

export default {
  setup() {
    const customer = customerStore();
    const supplier = supplierStore();
    const sellOrder = sellOrderStore();

    const currentData = ref<Customer[]>([]);
    const suplierData = ref<Supplier[]>([]);
    const sellOrderData = ref<SellOrder[]>([]);

    const totalUSD = ref(0);
    const totalKHR = ref(0);
    const totalOrdersToday = ref(0); // <-- count of today's sell orders

    const isLoading = ref(false);
    const USD_TO_KHR = 4100; // exchange rate

    const isToday = (dateString: string | Date) => {
      const today = new Date();
      const date = new Date(dateString);
      return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      );
    };

    onMounted(async () => {
      isLoading.value = true;
      try {
        // Customers today
        await customer.fetchDta();
        currentData.value = customer.getCustomer.filter(c =>
          isToday(c.created_at as string)
        );

        // Suppliers today
        await supplier.fetchDta();
        suplierData.value = supplier.getSupplier.filter(s =>
          isToday(s.created_at as string)
        );

        // Sell orders today AND pending
        await sellOrder.fetchDta();
        sellOrderData.value = sellOrder.getSellOrder.filter(
          order => isToday(order.created_at as string) && order.status === 'pending'
        );

      

        // Count Orders Today
        totalOrdersToday.value = sellOrderData.value.length;

        // Total USD (USD only)
        totalUSD.value = sellOrderData.value
          .filter(order => order.currency === 'usd')
          .reduce((total, order) => total + Number(order.payment), 0);

        // Total KHR (KHR only)
        totalKHR.value = sellOrderData.value
          .filter(order => order.currency === 'khr')
          .reduce((total, order) => total + Number(order.payment), 0);

      } catch (err) {
        console.error(err);
      } finally {
        isLoading.value = false;
      }
    });

    return {
      currentData,
      suplierData,
      sellOrderData,
      totalUSD,
      totalKHR,
      totalOrdersToday, // <-- return count
      isLoading
    };
  }
};
</script>

<style scoped></style>