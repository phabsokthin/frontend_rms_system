<template>
  <div class="min-h-screen">
    <div class="">
      <!-- Header -->
      <div class="mb-[15px] flex items-center justify-between">
        <h1 class="text-xl font-bayon">របាយការណ៍ចំណេញខាត</h1>
        <div class="flex items-center gap-3">

          <DateTime v-model="start_date" label="ចាប់ផ្តើម" type="date" />
          <DateTime v-model="end_date" label="បញ្ចប់" type="date" />
          <Button variant="green" class="mt-auto text-sm rounded-none font-bayon h-[45px]"
            @click="handleFilter">ច្រោះ</Button>
        </div>
      </div>

      <!-- Profit & Loss Summary Box -->
      <div class="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
        <div class="p-4 bg-green-100 border border-green-300 shadow">
          <h2 class="text-lg text-green-700 font-bayon">សរុបជាលុយ​ (USD)</h2>
          <p class="text-2xl font-bold text-green-800">
            {{ reportSummary?.byCurrency?.usd?.sales }} $
          </p>
        </div>

        <div class="p-4 bg-blue-100 border border-blue-300 shadow">
          <h2 class="text-lg text-blue-700 font-bayon">ខាតសរុប</h2>
          <p class="text-2xl font-bold text-blue-800">
  <span class="text-red-600">
              ({{ reportSummary?.byCurrency?.usd?.loss }} USD)
            </span>
            ||
            <span class="text-red-600">
              ({{ reportSummary?.byCurrency?.khr?.loss }} KHR)
            </span>
          </p>
        </div>
        <div class="p-4 bg-blue-100 border border-blue-300 shadow">
          <h2 class="text-lg text-blue-700 font-bayon">សរុបជាលុយ​ (KHR)</h2>
          <p class="text-2xl font-bold text-blue-800">
            {{ reportSummary?.byCurrency?.khr?.sales }} ៛
          </p>
        </div>
      </div>

      <!-- Currency Breakdown -->
      <div class="grid grid-cols-1 gap-6 mb-6 text-lg md:grid-cols-2">
        <div class="p-4 bg-white border shadow">
          <h3 class="text-gray-700 font-bayon">USD</h3>
          <p><span class="font-bayon">ចំណូល</span>: {{ reportSummary?.byCurrency?.usd?.sales }} $</p>
          <p><span class="font-bayon">ចំណាយ</span>: {{ reportSummary?.byCurrency?.usd?.expenses }} $</p>
          <p><span class="font-bayon">ចំណេញ</span>: {{ reportSummary?.byCurrency?.usd?.profit }} $</p>
          <p v-if="reportSummary?.byCurrency?.usd?.loss > 0" class="text-red-600">
            <span class="font-bayon">ខាត</span>: {{ reportSummary?.byCurrency?.usd?.loss }} $
          </p>
        </div>
        <div class="p-4 bg-white border shadow">
          <h3 class="text-gray-700 font-bayon">KHR</h3>
          <p><span class="font-bayon">ចំណូល</span>: {{ reportSummary?.byCurrency?.khr?.sales }} ៛</p>
          <p><span class="font-bayon">ចំណាយ</span>: {{ reportSummary?.byCurrency?.khr?.expenses }} ៛</p>
          <p><span class="font-bayon">ចំណេញ</span>: {{ reportSummary?.byCurrency?.khr?.profit }} ៛</p>
          <p v-if="reportSummary?.byCurrency?.khr?.loss > 0" class="text-red-600">
            <span class="font-bayon">ខាត</span>: {{ reportSummary?.byCurrency?.khr?.loss }} ៛
          </p>
        </div>
      </div>


      <!-- Recap Grid -->
      <div class="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
        <!-- Sell Orders Recap -->
        <div class="p-4 bg-white border shadow">
          <h2 class="mb-3 text-lg text-green-700 font-bayon">សង្ខេបការលក់</h2>
          <table class="w-full border-collapse text-md">
            <thead>
              <tr class="text-green-800 bg-green-100 font-bayon">
                <th class="px-3 py-2 border">លេខវិក័យប័ត្រ</th>
                <th class="px-3 py-2 border">អតិថិជន</th>
                <th class="px-3 py-2 border">ចំនួនទូទាត់</th>
                <th class="px-3 py-2 border">រូបបិយប័ណ្ណ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in paginatedOrders" :key="order._id" class="hover:bg-gray-50">
                <td class="px-3 py-2 border">#{{ order._id.slice(-6).toUpperCase() }}</td>
                <td class="px-3 py-2 border font-bayon">{{ order.customer_id?.first_name }} {{ order.customer_id?.last_name }}</td>
                <td class="px-3 py-2 border">{{ order.payment }}</td>
                <td class="px-3 py-2 uppercase border">{{ order.currency }}</td>
              </tr>
            </tbody>
          </table>
          <!-- Pagination for Sell Orders -->
          <div class="flex items-center justify-between mt-3">
            <Pagination :current-page="currentPageOrders" :total-pages="totalPagesOrders"
              :total-items="currentData.length" :items-per-page="itemsPerPageOrders"
              :on-page-change="handlePageChangeOrders" />
          </div>
        </div>

        <!-- Expenses Recap -->
        <div class="p-4 bg-white border shadow">
          <h2 class="mb-3 text-lg text-red-700 font-bayon">សង្ខេបចំណាយ</h2>
          <table class="w-full border-collapse text-md">
            <thead>
              <tr class="text-red-800 bg-red-100 font-bayon">
                <th class="px-3 py-2 border">ឈ្មោះចំណាយ</th>
                <th class="px-3 py-2 border">ចំនួន</th>
                <th class="px-3 py-2 border">រូបបិយប័ណ្ណ</th>
                <th class="px-3 py-2 border">កាលបរិច្ឆេទ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="expense in paginatedExpenses" :key="expense._id" class="hover:bg-gray-50">
                <td class="px-3 py-2 border font-bayon">{{ expense.name }}</td>
                <td class="px-3 py-2 border">{{ expense.amount }}</td>
                <td class="px-3 py-2 uppercase border">{{ expense.currency }}</td>
                <td class="px-3 py-2 border">{{ formatDate(expense.expense_date) }}</td>
              </tr>
            </tbody>
          </table>
          <!-- Pagination for Expenses -->
          <div class="flex items-center justify-between mt-3">
            <Pagination :current-page="currentPageExpenses" :total-pages="totalPagesExpenses"
              :total-items="expensesData.length" :items-per-page="itemsPerPageExpenses"
              :on-page-change="handlePageChangeExpenses" />
          </div>
        </div>
      </div>
    </div>
  </div>

</template>


<script lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import Button from '../../components/ui/Button.vue';
import Pagination from '../../components/ui/Pagination.vue';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Loading from '../../components/ui/Loading.vue';
import TextFieldInput from '../../components/ui/TextFieldInput.vue';
import SellOrderDetail from '../sellOrder/SellOrderDetail.vue';
import reportService from '../../services/reportService';
import Select from '../../components/ui/Select.vue';
import DateTime from '../../components/ui/DateTime.vue';
import { formatDate } from '../../utils/formatDate';

export default {
  components: { Button, Pagination, Loading, TextFieldInput, SellOrderDetail, Select, DateTime },
  setup() {
    const currentData = ref<any[]>([]); // sellOrders list
    const expensesData = ref<any[]>([]); // expenses list
    const reportSummary = ref<any | null>(null); // profit & loss summary

    // Pagination for Sell Orders
    const currentPageOrders = ref(1);
    const itemsPerPageOrders = ref(25);

    // Pagination for Expenses
    const currentPageExpenses = ref(1);
    const itemsPerPageExpenses = ref(25);

    const isLoading = ref(false);


    // Helper to format date as YYYY-MM-DD
    function formatDate(date: Date | string) {
      const d = typeof date === "string" ? new Date(date) : date;
      if (isNaN(d.getTime())) return ""; // invalid date guard

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }



    // Default to first and last day of current month
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    const lastDayOfMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 0);

    const start_date = ref(formatDate(firstDayOfMonth));
    const end_date = ref(formatDate(lastDayOfMonth));



    const fetchProfitAndLose = async () => {
      try {
        const response: any = await reportService.getProfitAndLoseReport(start_date.value, end_date.value);
        const { report, sellOrders, expenses } = response.data;

        reportSummary.value = report;
        currentData.value = sellOrders;
        expensesData.value = expenses;
      } catch (err) {
        console.error(err);
      } finally {
        isLoading.value = false;
      }
    }

    onMounted(async () => {
      isLoading.value = true;
      await fetchProfitAndLose();
    });

    // Paginated Sell Orders
    const paginatedOrders = computed(() => {
      const start = (currentPageOrders.value - 1) * itemsPerPageOrders.value;
      const end = start + itemsPerPageOrders.value;
      return currentData.value.slice(start, end);
    });
    const totalPagesOrders = computed(() => {
      return Math.ceil(currentData.value.length / itemsPerPageOrders.value);
    });
    const handlePageChangeOrders = (page: number) => {
      currentPageOrders.value = page;
    };
    watch(itemsPerPageOrders, () => {
      currentPageOrders.value = 1;
    });

    // Paginated Expenses
    const paginatedExpenses = computed(() => {
      const start = (currentPageExpenses.value - 1) * itemsPerPageExpenses.value;
      const end = start + itemsPerPageExpenses.value;
      return expensesData.value.slice(start, end);
    });
    const totalPagesExpenses = computed(() => {
      return Math.ceil(expensesData.value.length / itemsPerPageExpenses.value);
    });
    const handlePageChangeExpenses = (page: number) => {
      currentPageExpenses.value = page;
    };
    watch(itemsPerPageExpenses, () => {
      currentPageExpenses.value = 1;
    });

    const handleFilter = async () => {
      await fetchProfitAndLose();
    }

    return {
      currentData,
      expensesData,
      reportSummary,
      // Orders pagination
      currentPageOrders,
      itemsPerPageOrders,
      paginatedOrders,
      totalPagesOrders,
      handlePageChangeOrders,
      // Expenses pagination
      currentPageExpenses,
      itemsPerPageExpenses,
      paginatedExpenses,
      totalPagesExpenses,
      handlePageChangeExpenses,
      faEdit,
      faTrash,
      isLoading,
      start_date,
      end_date,
      formatDate,
      handleFilter
    };
  }
};
</script>

<style scoped></style>