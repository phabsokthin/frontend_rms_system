<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-start justify-center pt-24">
    <!-- Overlay -->
    <div
      class="absolute inset-0 bg-black bg-opacity-50"
      @click="close"
    ></div>

    <!-- Modal -->
    <div
      class="relative z-10 w-full max-w-md p-6 bg-white border-t-4 border-green-600 shadow-2xl "
    >
      <!-- Title -->
      <h2 class="mb-4 text-xl text-gray-800 font-bayon">
        បញ្ជាក់ការលុប
      </h2>

      <!-- Message -->
      <p class="mb-6 text-gray-600 font-bayon">
        <template v-if="name">
          តើអ្នកចង់លុប
          <span class="font-semibold text-red-600">
            [ {{ name }} ]
          </span>
          មែនទេ?
        </template>

        <template v-else>
          តើអ្នកចង់លុបធាតុនេះមែនទេ?
        </template>
      </p>

      <!-- Buttons -->
      <div class="flex justify-end gap-3">
        <button
          @click="close"
          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 font-bayon"
        >
          បោះបង់
        </button>

        <button
          @click="confirmDelete"
          class="px-4 py-2 text-white bg-red-600 hover:bg-red-700 font-bayon"
        >
          លុប
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  name?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}>()

function close() {
  emit('update:modelValue', false)
}

function confirmDelete() {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>