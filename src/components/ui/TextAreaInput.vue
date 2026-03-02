<template>
  <div :class="['text-input', containerClass]">
    <label v-if="label" class="block mb-1 font-bayon">
      {{ label }} <span v-if="required" class="ml-0 text-red-500">*</span>
    </label>
    <textarea
      ref="inputRef"
      :type="type"
      :placeholder="placeholder"
      :value="inputValue"
      :required="required"
      @input="updateValue"
      :class="[
        'w-full p-2 border-2 pl-3 border-green-500 focus:border-green-700 focus:outline-none transition-colors duration-200 cursor-pointer',
        className
      ]"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, defineExpose } from 'vue'

export default defineComponent({
  name: 'TextAreaInput',
  props: {
    modelValue: { type: String, default: '' },
    label: String,
    placeholder: String,
    type: { type: String, default: 'text' },
    className: { type: String, default: '' },
    containerClass: { type: String, default: '' },
    required: { type: Boolean, default: false }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const inputRef = ref<HTMLInputElement | null>(null)

    // Expose focus method to parent
    defineExpose({
      focus: () => inputRef.value?.focus()
    })

    const inputValue = computed({
      get: () => props.modelValue,
      set: (val: string) => emit('update:modelValue', val)
    })

    const updateValue = (event: Event) => {
      const target = event.target as HTMLInputElement
      inputValue.value = target.value
    }

    return {
      inputRef,
      inputValue,
      updateValue
    }
  }
})
</script>