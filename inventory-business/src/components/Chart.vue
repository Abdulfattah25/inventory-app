<template>
  <div class="chart-container">
    <canvas
      ref="chartCanvas"
      :width="width"
      :height="height"
    ></canvas>
    
    <!-- Loading State -->
    <div v-if="loading" class="chart-loading">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="mt-2">Memuat data...</div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && isEmpty" class="chart-empty">
      <i class="bi bi-graph-up fs-1 text-muted"></i>
      <div class="mt-2 text-muted">{{ emptyMessage }}</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import Chart from 'chart.js/auto'

export default {
  name: 'Chart',
  props: {
    type: {
      type: String,
      default: 'line',
      validator: (value) => ['line', 'bar', 'pie', 'doughnut', 'radar', 'polarArea'].includes(value)
    },
    data: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 200
    },
    loading: {
      type: Boolean,
      default: false
    },
    emptyMessage: {
      type: String,
      default: 'Tidak ada data untuk ditampilkan'
    }
  },
  emits: ['chart-created', 'chart-updated', 'chart-destroyed'],
  setup(props, { emit }) {
    const chartCanvas = ref(null)
    const chartInstance = ref(null)

    // Computed
    const isEmpty = computed(() => {
      if (!props.data || !props.data.datasets) return true
      return props.data.datasets.every(dataset => 
        !dataset.data || dataset.data.length === 0 || 
        dataset.data.every(value => value === 0 || value === null || value === undefined)
      )
    })

    // Default chart options
    const defaultOptions = computed(() => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || ''
              if (label) {
                label += ': '
              }
              
              // Format currency for financial data
              if (typeof context.parsed.y === 'number') {
                label += new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                }).format(context.parsed.y)
              } else {
                label += context.parsed.y
              }
              
              return label
            }
          }
        }
      },
      scales: props.type === 'pie' || props.type === 'doughnut' ? {} : {
        x: {
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            font: {
              size: 11
            }
          }
        },
        y: {
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            font: {
              size: 11
            },
            callback: function(value) {
              // Format currency for y-axis
              return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                notation: 'compact'
              }).format(value)
            }
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
      }
    }))

    // Merge options
    const mergedOptions = computed(() => {
      return {
        ...defaultOptions.value,
        ...props.options
      }
    })

    // Methods
    const createChart = async () => {
      if (!chartCanvas.value || props.loading || isEmpty.value) return

      await nextTick()

      try {
        chartInstance.value = new Chart(chartCanvas.value, {
          type: props.type,
          data: props.data,
          options: mergedOptions.value
        })

        emit('chart-created', chartInstance.value)
      } catch (error) {
        console.error('Error creating chart:', error)
      }
    }

    const updateChart = () => {
      if (!chartInstance.value || props.loading) return

      try {
        chartInstance.value.data = props.data
        chartInstance.value.options = mergedOptions.value
        chartInstance.value.update('active')

        emit('chart-updated', chartInstance.value)
      } catch (error) {
        console.error('Error updating chart:', error)
      }
    }

    const destroyChart = () => {
      if (chartInstance.value) {
        chartInstance.value.destroy()
        chartInstance.value = null
        emit('chart-destroyed')
      }
    }

    const resizeChart = () => {
      if (chartInstance.value) {
        chartInstance.value.resize()
      }
    }

    // Watchers
    watch(() => props.data, () => {
      if (isEmpty.value) {
        destroyChart()
      } else if (chartInstance.value) {
        updateChart()
      } else {
        createChart()
      }
    }, { deep: true })

    watch(() => props.options, () => {
      if (chartInstance.value && !isEmpty.value) {
        updateChart()
      }
    }, { deep: true })

    watch(() => props.type, () => {
      destroyChart()
      if (!isEmpty.value) {
        createChart()
      }
    })

    watch(() => props.loading, (newValue) => {
      if (!newValue && !isEmpty.value && !chartInstance.value) {
        createChart()
      }
    })

    // Lifecycle
    onMounted(() => {
      if (!props.loading && !isEmpty.value) {
        createChart()
      }
      
      // Add resize listener
      window.addEventListener('resize', resizeChart)
    })

    onUnmounted(() => {
      destroyChart()
      window.removeEventListener('resize', resizeChart)
    })

    return {
      chartCanvas,
      isEmpty
    }
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 200px;
}

.chart-loading,
.chart-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
}

.chart-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.chart-empty {
  color: var(--bs-secondary);
}

canvas {
  max-width: 100%;
  height: auto;
}

/* Dark theme adjustments */
[data-bs-theme="dark"] .chart-container {
  color: var(--bs-gray-300);
}
</style>
