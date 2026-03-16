<template>
    <div>
        <div class="text-lg font-bayon">
            {{ pageTitle }}
        </div>
    </div>
</template>

<script lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

export default {
    setup() {
        const route = useRoute();

        const titles: Record<string, string> = {
            "/": "ទំព័រដើម",
            "/category": "ប្រភេទគ្រឿងទេស​",
            "/table": "បញ្ជីលេខតុ",
            "/staff": "បញ្ជីបុគ្គលិក",
            "/paymentType": "វិធីសាស្រ្តទូទាត់",
            "/customer": "បញ្ជីអតិថិជន",
            "/supplier": "បញ្ជីអ្នកផ្គត់ផ្គង់",
            "/product": "បញ្ជីផលិតផល",
            "/sell": "ផ្ទាំងលក់",
            "/purchase": "បញ្ជីទិញផលិតផលចូល",
            "/expense": "ការចំណាយ",
             "/user": "អ្នកប្រើប្រាស់",
            "/report": "របាយការណ៍",
        };

        const pageTitle = computed(() => titles[route.path] || "");
        return { pageTitle };
    },
};
</script>