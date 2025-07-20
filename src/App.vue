<template>
  <div id="app">
    <!-- Show login page if not authenticated -->
    <router-view v-if="!authStore.user || $route.name === 'login'" />
    
    <!-- Show main layout if authenticated -->
    <Layout v-else>
      <router-view />
    </Layout>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth.js'
import Layout from './components/Layout.vue'

const authStore = useAuthStore()

onMounted(() => {
  // Check if user is already logged in
  authStore.checkAuth()
})
</script>

<style>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
