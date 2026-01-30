<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Logo和标题 -->
      <div class="text-center mb-8">
        <div class="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Store class="w-9 h-9 text-white" />
        </div>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">
          SaaS POS 系统
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          请登录您的账户以继续
        </p>
      </div>

      <!-- 登录表单 -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- 错误提示 -->
          <div v-if="authStore.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ authStore.error }}
          </div>

          <!-- 用户名输入 -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
              用户名
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autocomplete="username"
                required
                v-model="username"
                :disabled="authStore.isLoading"
                class="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="请输入用户名"
              />
            </div>
          </div>

          <!-- 密码输入 -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              密码
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                v-model="password"
                :disabled="authStore.isLoading"
                class="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="请输入密码"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                tabindex="-1"
              >
                <EyeOff v-if="showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" />
                <Eye v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          </div>

          <!-- 记住我和忘记密码 -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                记住我
              </label>
            </div>
            <div class="text-sm">
              <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
                忘记密码?
              </a>
            </div>
          </div>

          <!-- 登录按钮 -->
          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Loader2 v-if="authStore.isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5" />
            {{ authStore.isLoading ? '登录中...' : '登录' }}
          </button>
        </form>

        <!-- 分隔线 -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">默认账户</span>
            </div>
          </div>
        </div>

        <!-- 默认账户提示 -->
        <div class="mt-4 p-4 bg-gray-50 rounded-lg">
          <p class="text-xs text-gray-500 text-center">
            用户名: <code class="bg-gray-200 px-1 rounded">admin</code>
            <br />
            密码: <code class="bg-gray-200 px-1 rounded">admin123</code>
          </p>
        </div>
      </div>

      <!-- 底部版权 -->
      <p class="mt-8 text-center text-xs text-gray-500">
        &copy; 2025 SaaS POS System. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Store, User, Lock, Eye, EyeOff, Loader2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.store'
import { useNotificationStore } from '@/stores/notification.store'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const username = ref('')
const password = ref('')
const showPassword = ref(false)

// 获取重定向路径
const redirectPath = route.query.redirect as string || '/'

// 如果已登录，重定向
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    router.replace(redirectPath)
  }
})

// 清除错误
onUnmounted(() => {
  authStore.clearError()
})

const handleSubmit = async () => {
  if (!username.value.trim() || !password.value.trim()) {
    notificationStore.error('错误', '请输入用户名和密码')
    return
  }

  try {
    await authStore.login({
      username: username.value.trim(),
      password: password.value
    })
    // 登录成功后会自动重定向
  } catch (err) {
    // 错误已在authStore中处理
  }
}
</script>