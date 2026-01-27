<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import { Button, Input } from '@/components/ui'
import { Lock, User } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const notification = useNotificationStore()

const username = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = '请输入用户名和密码'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const result = await authStore.login({
      username: username.value,
      password: password.value,
    })

    if (result.success) {
      notification.success('登录成功')
      router.push('/')
    } else {
      error.value = result.error || '登录失败'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '登录失败'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg mb-4">
          <span class="text-white text-3xl font-bold">云</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">客如云</h1>
        <p class="text-gray-500 mt-1">智慧餐饮管理系统</p>
      </div>

      <!-- Login form -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">登录</h2>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Username -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <div class="relative">
              <User class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                v-model="username"
                type="text"
                placeholder="请输入用户名"
                class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                v-model="password"
                type="password"
                placeholder="请输入密码"
                class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Error message -->
          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>

          <!-- Submit button -->
          <Button
            type="submit"
            variant="primary"
            size="lg"
            block
            :loading="isLoading"
          >
            登录
          </Button>
        </form>

        <!-- Demo hint -->
        <div class="mt-6 p-4 bg-emerald-50 rounded-lg">
          <p class="text-sm text-emerald-700">
            <strong>演示账号：</strong><br />
            用户名: admin<br />
            密码: admin123
          </p>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center text-sm text-gray-500 mt-6">
        &copy; 2024 SaaS POS System. All rights reserved.
      </p>
    </div>
  </div>
</template>
