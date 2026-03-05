<template>
  <div :class="wrapperClass">
    <label
      v-if="label"
      :class="['block mb-1 text-gray-700 text-md font-bayon', labelClass]"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative inline-block" style="min-width: 14rem;">
      <select
        :value="modelValue"
        @change="handleChange"
        :required="required"
        :class="[
          'block w-full px-4 py-2.5 pr-10 text-sm text-gray-700 bg-white border-2 border-green-500 shadow-sm appearance-none focus:outline-none focus:ring-0 focus:ring-green-500 focus:border-green-500',
          selectClass || customClass
        ]"
      >
        <option disabled value="">{{ placeholder }}</option>

        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>

      </select>

      <!-- Arrow Icon -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: { default: '' },
  options: { type: Array, required: true },
  placeholder: { type: String, default: 'Select an option' },
  label: { type: String, default: '' },
  customClass: { type: String, default: '' },
  selectClass: { type: String, default: '' },
  labelClass: { type: String, default: '' },
  required: { type: Boolean, default: false },
  wrapperClass: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

function handleChange(event) {
  const value = event.target.value

  const selectedOption = props.options.find(
    (opt) => String(opt.value) === value
  )

  emit('update:modelValue', selectedOption ? selectedOption.value : value)
}
</script>