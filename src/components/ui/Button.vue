<template>
  <button
    :class="[
      'px-4 py-2 rounded font-semibold text-white flex items-center justify-center gap-2 transition-colors duration-200',
      variantClasses,
      className
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <!-- Optional loading spinner -->
    <svg
      v-if="loading"
      class="w-5 h-5 text-white animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>

    <!-- Default slot text -->
    <span><slot /></span>
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'Button',
  props: {
    variant: {
      type: String,
      default: 'default', // default, blue, red, green, secondary
      validator: (value: string) =>
        ['default', 'blue', 'red', 'green', 'secondary'].includes(value)
    },
    className: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props) {
    const variantClasses = computed(() => {
      switch (props.variant) {
        case 'blue':
          return 'bg-blue-500 hover:bg-blue-600';
        case 'red':
          return 'bg-red-500 hover:bg-red-600';
        case 'green':
          return 'bg-green-600 hover:bg-green-500';
        case 'secondary':
          return 'bg-gray-500 hover:bg-gray-600';
        default:
          return 'bg-gray-700 hover:bg-gray-800'; // default
      }
    });

    return {
      variantClasses
    };
  }
});
</script>

<style scoped>
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>