<template>
  <div class="login-page">
    <div class="container-fluid h-100">
      <div class="row h-100">
        <!-- Left Side - Branding -->
        <div class="col-lg-6 d-none d-lg-flex login-brand">
          <div class="brand-content">
            <div class="brand-logo">
              <i class="bi bi-cash-coin display-1 text-white"></i>
            </div>
            <h1 class="brand-title">Cash Flow App</h1>
            <p class="brand-subtitle">
              Kelola keuangan Anda dengan mudah dan efisien
            </p>
            <div class="brand-features">
              <div class="feature-item">
                <i class="bi bi-check-circle-fill"></i>
                <span>Pencatatan transaksi real-time</span>
              </div>
              <div class="feature-item">
                <i class="bi bi-check-circle-fill"></i>
                <span>Laporan keuangan lengkap</span>
              </div>
              <div class="feature-item">
                <i class="bi bi-check-circle-fill"></i>
                <span>Manajemen kategori fleksibel</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Login Form -->
        <div class="col-lg-6 login-form-section">
          <div class="login-form-container">
            <!-- Mobile Brand -->
            <div class="mobile-brand d-lg-none text-center mb-4">
              <i class="bi bi-cash-coin display-4 text-primary"></i>
              <h2 class="mt-2">Cash Flow App</h2>
            </div>

            <!-- Login Form -->
            <div class="login-form">
              <div class="form-header text-center mb-4">
                <h3 class="form-title">Masuk ke Akun Anda</h3>
                <p class="form-subtitle text-muted">
                  Silakan masukkan kredensial Anda untuk melanjutkan
                </p>
              </div>

              <form @submit.prevent="handleLogin">
                <!-- Email Field -->
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-envelope"></i>
                    </span>
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      class="form-control"
                      :class="{ 'is-invalid': errors.email }"
                      placeholder="Masukkan email Anda"
                      required
                      autocomplete="email"
                    >
                    <div v-if="errors.email" class="invalid-feedback">
                      {{ errors.email }}
                    </div>
                  </div>
                </div>

                <!-- Password Field -->
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-lock"></i>
                    </span>
                    <input
                      id="password"
                      v-model="form.password"
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control"
                      :class="{ 'is-invalid': errors.password }"
                      placeholder="Masukkan password Anda"
                      required
                      autocomplete="current-password"
                    >
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="togglePassword"
                    >
                      <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                    <div v-if="errors.password" class="invalid-feedback">
                      {{ errors.password }}
                    </div>
                  </div>
                </div>

                <!-- Remember Me & Forgot Password -->
                <div class="row mb-3">
                  <div class="col-6">
                    <div class="form-check">
                      <input
                        id="remember"
                        v-model="form.remember"
                        class="form-check-input"
                        type="checkbox"
                      >
                      <label class="form-check-label" for="remember">
                        Ingat saya
                      </label>
                    </div>
                  </div>
                  <div class="col-6 text-end">
                    <router-link
                      to="/forgot-password"
                      class="text-decoration-none small"
                    >
                      Lupa password?
                    </router-link>
                  </div>
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  class="btn btn-primary w-100 mb-3"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'Memproses...' : 'Masuk' }}
                </button>

                <!-- Divider -->
                <div class="divider mb-3">
                  <span>atau</span>
                </div>

                <!-- Register Link -->
                <div class="text-center">
                  <span class="text-muted">Belum punya akun? </span>
                  <router-link to="/register" class="text-decoration-none">
                    Daftar sekarang
                  </router-link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    // Reactive data
    const loading = ref(false)
    const showPassword = ref(false)
    const form = reactive({
      email: '',
      password: '',
      remember: false
    })
    const errors = reactive({})

    // Methods
    const validateForm = () => {
      const newErrors = {}

      if (!form.email) {
        newErrors.email = 'Email wajib diisi'
      } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        newErrors.email = 'Format email tidak valid'
      }

      if (!form.password) {
        newErrors.password = 'Password wajib diisi'
      } else if (form.password.length < 6) {
        newErrors.password = 'Password minimal 6 karakter'
      }

      Object.assign(errors, newErrors)
      return Object.keys(newErrors).length === 0
    }

    const clearErrors = () => {
      Object.keys(errors).forEach(key => {
        delete errors[key]
      })
    }

    const handleLogin = async () => {
      clearErrors()
      
      if (!validateForm()) return

      loading.value = true

      try {
        const result = await authStore.login(form.email, form.password)
        
        if (result.success) {
          // Login successful, redirect will be handled by auth store
        } else {
          // Handle login error
          if (result.error.includes('email')) {
            errors.email = 'Email tidak ditemukan'
          } else if (result.error.includes('password')) {
            errors.password = 'Password salah'
          }
        }
      } catch (error) {
        console.error('Login error:', error)
      } finally {
        loading.value = false
      }
    }

    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }

    return {
      loading,
      showPassword,
      form,
      errors,
      handleLogin,
      togglePassword
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-brand {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login-brand::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="1" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="1" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.brand-content {
  text-align: center;
  color: white;
  z-index: 1;
  position: relative;
  max-width: 400px;
  padding: 2rem;
}

.brand-title {
  font-size: 3rem;
  font-weight: 700;
  margin: 1rem 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.brand-subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.brand-features {
  text-align: left;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.feature-item i {
  margin-right: 0.75rem;
  color: #28a745;
}

.login-form-section {
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-form-container {
  width: 100%;
  max-width: 400px;
}

.login-form {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.form-title {
  color: #333;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-subtitle {
  font-size: 0.9rem;
}

.input-group-text {
  background: #f8f9fa;
  border-right: none;
}

.form-control {
  border-left: none;
  padding-left: 0;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 0.75rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #dee2e6;
}

.divider span {
  background: white;
  padding: 0 1rem;
  color: #6c757d;
  font-size: 0.875rem;
}

.mobile-brand {
  margin-bottom: 2rem;
}

/* Responsive */
@media (max-width: 991.98px) {
  .login-page {
    background: white;
  }
  
  .login-form-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  .login-form {
    background: white;
    color: #333;
  }
}

@media (max-width: 575.98px) {
  .login-form-container {
    padding: 1rem;
  }
  
  .login-form {
    padding: 1.5rem;
  }
  
  .brand-title {
    font-size: 2rem;
  }
}
</style>
