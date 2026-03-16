<template>
  <!-- Modal -->
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>

    <div class="relative z-10 w-full max-w-md p-6 bg-white shadow-2xl">
      <h2 class="mb-4 text-xl font-semibold text-gray-800 font-bayon">
        {{ updateData ? 'កែប្រែអ្នកប្រើប្រាស់' : 'បង្កើតអ្នកប្រើប្រាស់' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">

        <!-- Username -->
        <TextFieldInput
          label="ឈ្មោះអ្នកប្រើប្រាស់"
          v-model="username"
          placeholder="Enter Username"
          required
        />

        <!-- Email -->
        <TextFieldInput
          label="អ៊ីម៉ែល"
          type="email"
          v-model="email"
          placeholder="Enter Email"
          required
        />

        <!-- Password -->
        <TextFieldInput
          label="លេខសម្ងាត់"
          type="password"
          v-model="password"
          placeholder="Enter Password"
          :required="!updateData"
        />

        <!-- Confirm Password -->
        <TextFieldInput
          label="បញ្ជាក់លេខសម្ងាត់"
          type="password"
          v-model="confirmPassword"
          placeholder="Confirm Password"
          :required="!updateData"
        />

        <!-- Role -->
        <Select
          label="តួនាទី"
          v-model="role"
          :options="roleOptions"
          placeholder="ជ្រើសរើសតួនាទី"
          required
        />

        <!-- Status -->
        <Select
          label="ស្ថានភាព"
          v-model="status"
          :options="statusOptions"
          placeholder="ជ្រើសរើសស្ថានភាព"
          required
        />

        <!-- Actions -->
        <div class="flex justify-end gap-3 mt-4">
          <Button
            @click="handleClose"
            type="button"
            variant="red"
            class="rounded-none font-bayon"
          >
            បោះបង់
          </Button>

          <Button
            :loading="isLoading"
            type="submit"
            variant="green"
            class="rounded-none font-bayon"
          >
            {{ updateData ? 'រក្សាទុក' : 'បង្កើត' }}
          </Button>
        </div>

      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import TextFieldInput from '../../components/ui/TextFieldInput.vue'
import Select from '../../components/ui/Select.vue'
import Button from '../../components/ui/Button.vue'
import { useNotification } from '../../composables/useNotification'
import { useAuthStore } from '../../stores/auth.store'
import UserAuth from '../../types/auth'

export default {
  components: { TextFieldInput, Select, Button },
  props: ['loadData', 'updateData'],
  setup(props, { emit }) {
    const userAuth = useAuthStore()
    const { notify } = useNotification()
    const isLoading = ref(false)

    // Form fields
    const username = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const role = ref('normal') // default role
    const status = ref(true) // default active

    // Options
    const roleOptions = [
      { label: 'Normal', value: 'normal' },
      { label: 'Kitchen', value: 'kitchen' },
      { label: 'Admin', value: 'admin' }
    ]

    const statusOptions = [
      { label: 'សកម្ម', value: true },
      { label: 'អសកម្ម', value: false }
    ]

    // Fill form if updating
    onMounted(() => {
      if (props.updateData) {
        username.value = props.updateData.username
        email.value = props.updateData.email
        password.value = '' // blank for security
        confirmPassword.value = ''
        role.value = props.updateData.role || 'normal'
        status.value = props.updateData.status ?? true
      }
    })

    // Submit handler
    const handleSubmit = async () => {
      if (password.value !== confirmPassword.value) {
        notify({ message: 'Password and Confirm Password do not match', type: 'error' })
        return
      }

      isLoading.value = true
      try {
        const data: UserAuth = {
          _id: props.updateData?._id || '',
          username: username.value,
          email: email.value,
          password: password.value,
          role: role.value,
          status: status.value
        }

        if (props.updateData?._id) {
          // Update user
          await userAuth.updateData(data)
          await props.loadData()
          notify({ message: 'User updated successfully', type: 'success' })
        } else {
          // Create user
          await userAuth.createUser(data)
          await props.loadData()
          notify({ message: 'User created successfully', type: 'success' })
        }

        handleClose()
      } catch (err: any) {
        notify({ message: err.message || 'Operation failed', type: 'error' })
      } finally {
        isLoading.value = false
      }
    }

    const handleClose = () => emit('close')

    return {
      username, email, password, confirmPassword, role, status,
      roleOptions, statusOptions,
      handleSubmit, handleClose, isLoading
    }
  }
}
</script>