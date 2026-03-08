<template>
  <div :class="['text-input', containerClass]">
    <label v-if="label" class="block mb-1 font-bayon">
      {{ label }}
      <span v-if="required" class="ml-1 text-red-500">*</span>
    </label>

    <input
      ref="inputRef"
      :type="inputType"
      :placeholder="placeholder"
      :value="formattedValue"
      :required="required"
      :min="min"
      :max="max"
      :maxlength="maxlength"
      :disabled="disabled"
      @input="updateValue"
      :step="type === 'number' ? 'any' : undefined"
      :class="[
        'w-full p-2 border-2 pl-3 border-green-500 focus:border-green-700 focus:outline-none transition-colors duration-200',
        disabled ? 'bg-gray-100 cursor-not-allowed opacity-70' : '',
        className
      ]"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, defineExpose, computed } from 'vue'

export default defineComponent({
  name: 'TextFieldInput',

  props: {
    modelValue: {
      type: [String, Number, Date] as unknown as () => string | number | Date,
      default: ''
    },
    label: String,
    placeholder: String,
    type: {
      type: String,
      default: 'text' // can also be 'datetime'
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
    disabled: {
      type: Boolean,
      default: false
    },
    min: {
      type: String,
      required: false
    },
    max: {
      type: String,
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

    // For datetime-local, we need to format Date to string: YYYY-MM-DDTHH:mm
    const formattedValue = computed(() => {
      if (props.type === 'datetime' && props.modelValue) {
        const date = new Date(props.modelValue)
        const pad = (n: number) => n.toString().padStart(2, '0')
        const y = date.getFullYear()
        const m = pad(date.getMonth() + 1)
        const d = pad(date.getDate())
        const h = pad(date.getHours())
        const min = pad(date.getMinutes())
        return `${y}-${m}-${d}T${h}:${min}`
      }
      return props.modelValue ?? ''
    })

    const inputType = computed(() => {
      return props.type === 'datetime' ? 'datetime-local' : props.type
    })

    const updateValue = (event: Event) => {
      const target = event.target as HTMLInputElement
      let value: string | number | Date = target.value

      if (props.type === 'number') {
        value = target.value === '' ? '' : parseFloat(target.value)
      } else if (props.type === 'datetime') {
        value = target.value === '' ? '' : new Date(target.value)
      }

      emit('update:modelValue', value)
    }

    return {
      inputRef,
      updateValue,
      formattedValue,
      inputType
    }
  }
})
</script>