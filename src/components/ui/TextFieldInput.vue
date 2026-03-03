<template>
  <div :class="['text-input', containerClass]">
    <label v-if="label" class="block mb-1 font-bayon">
      {{ label }}
      <span v-if="required" class="ml-1 text-red-500">*</span>
    </label>

    <input
      ref="inputRef"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :required="required"
      :min="min"
      :max="max"
      :maxlength="maxlength"
      @input="updateValue"
      :class="[
        'w-full p-2 border-2 pl-3 border-green-500 focus:border-green-700 focus:outline-none transition-colors duration-200',
        className
      ]"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, defineExpose } from 'vue'

export default defineComponent({
  name: 'TextFieldInput',

  props: {
    modelValue: {
      type: [String, Number] as unknown as () => string | number,
      default: ''
    },
    label: String,
    placeholder: String,
    type: {
      type: String,
      default: 'text'
    },
    className: {
      type: String,
      default: ''
    },
    containerClass: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number,
      required: false
    },
    max: {
      type: Number,
      required: false
    },
    maxlength: {
      type: Number,
      required: false
    }
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const inputRef = ref<HTMLInputElement | null>(null)

    defineExpose({
      focus: () => inputRef.value?.focus()
    })

    const updateValue = (event: Event) => {
      const target = event.target as HTMLInputElement
      let value: string | number = target.value

      // Convert number type properly
      if (props.type === 'number') {
        value = target.value === '' ? '' : Number(target.value)
      }

      emit('update:modelValue', value)
    }

    return {
      inputRef,
      updateValue
    }
  }
})
</script>