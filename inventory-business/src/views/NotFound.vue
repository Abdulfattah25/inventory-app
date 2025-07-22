<template>
  <div class="not-found-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-6 col-md-8">
          <div class="not-found-content text-center">
            <!-- 404 Illustration -->
            <div class="error-code">
              <h1 class="display-1 fw-bold text-primary">404</h1>
            </div>
            
            <!-- Error Message -->
            <div class="error-message mb-4">
              <h2 class="h3 mb-3">Halaman Tidak Ditemukan</h2>
              <p class="text-muted mb-4">
                Maaf, halaman yang Anda cari tidak dapat ditemukan. 
                Mungkin halaman telah dipindahkan atau URL yang Anda masukkan salah.
              </p>
            </div>

            <!-- Illustration -->
            <div class="error-illustration mb-4">
              <svg width="200" height="150" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Background -->
                <rect width="200" height="150" fill="#f8f9fa" rx="10"/>
                
                <!-- Computer Screen -->
                <rect x="50" y="40" width="100" height="60" fill="#343a40" rx="5"/>
                <rect x="55" y="45" width="90" height="45" fill="#6c757d"/>
                
                <!-- Screen Content (X mark) -->
                <line x1="75" y1="60" x2="125" y2="80" stroke="#dc3545" stroke-width="3" stroke-linecap="round"/>
                <line x1="125" y1="60" x2="75" y2="80" stroke="#dc3545" stroke-width="3" stroke-linecap="round"/>
                
                <!-- Computer Stand -->
                <rect x="95" y="100" width="10" height="15" fill="#343a40"/>
                <rect x="80" y="115" width="40" height="5" fill="#343a40" rx="2"/>
                
                <!-- Floating Elements -->
                <circle cx="30" cy="30" r="3" fill="#007bff" opacity="0.6"/>
                <circle cx="170" cy="25" r="4" fill="#28a745" opacity="0.6"/>
                <circle cx="25" cy="120" r="2" fill="#ffc107" opacity="0.6"/>
                <circle cx="175" cy="130" r="3" fill="#dc3545" opacity="0.6"/>
              </svg>
            </div>

            <!-- Action Buttons -->
            <div class="error-actions">
              <button 
                class="btn btn-primary btn-lg me-3"
                @click="goHome"
              >
                <i class="bi bi-house me-2"></i>
                Kembali ke Beranda
              </button>
              
              <button 
                class="btn btn-outline-secondary btn-lg"
                @click="goBack"
              >
                <i class="bi bi-arrow-left me-2"></i>
                Kembali
              </button>
            </div>

            <!-- Help Links -->
            <div class="help-links mt-4">
              <p class="text-muted small mb-2">Butuh bantuan?</p>
              <div class="d-flex justify-content-center gap-3">
                <router-link to="/dashboard" class="text-decoration-none">
                  <i class="bi bi-speedometer2 me-1"></i>
                  Dashboard
                </router-link>
                <router-link to="/transactions" class="text-decoration-none">
                  <i class="bi bi-receipt me-1"></i>
                  Transaksi
                </router-link>
                <router-link to="/reports" class="text-decoration-none">
                  <i class="bi bi-graph-up me-1"></i>
                  Laporan
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'NotFound',
  setup() {
    const router = useRouter()

    const goHome = () => {
      router.push('/dashboard')
    }

    const goBack = () => {
      if (window.history.length > 1) {
        router.go(-1)
      } else {
        router.push('/dashboard')
      }
    }

    return {
      goHome,
      goBack
    }
  }
}
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.not-found-content {
  background: white;
  border-radius: 1rem;
  padding: 3rem 2rem;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
}

.error-code h1 {
  font-size: 8rem;
  line-height: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0;
}

.error-message h2 {
  color: #343a40;
  font-weight: 600;
}

.error-illustration {
  margin: 2rem 0;
}

.error-illustration svg {
  max-width: 100%;
  height: auto;
}

.btn {
  border-radius: 0.75rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-outline-secondary:hover {
  transform: translateY(-2px);
}

.help-links a {
  color: #6c757d;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.help-links a:hover {
  color: #495057;
}

/* Responsive */
@media (max-width: 768px) {
  .not-found-content {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }

  .error-code h1 {
    font-size: 6rem;
  }

  .error-actions {
    flex-direction: column;
    gap: 1rem;
  }

  .error-actions .btn {
    width: 100%;
    margin: 0 !important;
  }

  .help-links .d-flex {
    flex-direction: column;
    gap: 0.5rem;
  }
}

@media (max-width: 576px) {
  .error-code h1 {
    font-size: 4rem;
  }

  .error-illustration svg {
    width: 150px;
    height: auto;
  }
}

/* Animation */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.error-illustration {
  animation: float 3s ease-in-out infinite;
}

/* Loading animation for buttons */
.btn:active {
  transform: scale(0.98);
}
</style>
