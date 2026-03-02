<template>
    <div class="flex items-center justify-between mt-3">
        <div></div>

        <div v-if="totalPages >= 1" class="flex gap-2">
            <!-- Previous -->
            <button @click="onPageChange(currentPage - 1)" :disabled="currentPage === 1 || isDisabled"
                class="px-3 py-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-bayon">
                ត្រលប់
            </button>

            <!-- Page numbers -->
            <template v-for="(page, index) in pageNumbers" :key="index">
                <span v-if="page === '...'" class="px-3 py-1 text-gray-500">...</span>

                <button v-else @click="onPageChange(page as number)" :disabled="isDisabled" :class="[
                    'px-3 py-1',
                    currentPage === page
                        ? 'bg-green-700 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                ]">
                    {{ typeof page === 'number' ? toKhmerNumber(page) : page }}
                </button>
            </template>

            <!-- Next -->
            <button @click="onPageChange(currentPage + 1)" :disabled="currentPage === totalPages || isDisabled"
                class="px-3 py-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-bayon">
                បន្ទាប់
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface PaginationProps {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    onPageChange: (page: number) => void
    isLoading?: boolean
}

const props = defineProps<PaginationProps>()

const isDisabled = computed(() => props.isLoading || props.totalItems === 0)

const pageNumbers = computed<(number | string)[]>(() => {
    const pages: (number | string)[] = []
    const visibleCount = 3

    if (props.totalPages <= visibleCount + 2) {
        for (let i = 1; i <= props.totalPages; i++) pages.push(i)
    } else {
        const startPage = Math.max(2, props.currentPage - 1)
        const endPage = Math.min(props.totalPages - 1, props.currentPage + 1)

        pages.push(1)
        if (startPage > 2) pages.push('...')
        for (let i = startPage; i <= endPage; i++) pages.push(i)
        if (endPage < props.totalPages - 1) pages.push('...')
        pages.push(props.totalPages)
    }

    return pages
})

function onPageChange(page: number) {
    if (page >= 1 && page <= props.totalPages) {
        props.onPageChange(page)
    }
}


function toKhmerNumber(value: number): string {
    const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩']
    return value
        .toString()
        .split('')
        .map(digit => khmerDigits[Number(digit)])
        .join('')
}
</script>