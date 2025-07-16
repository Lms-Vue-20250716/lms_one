<template>
  <div class="pagination-container">
    <button :disabled="currentPage === 1" class="pagination-button" @click="handlePageChange(1)">
      처음
    </button>

    <button
      :disabled="currentPage === 1"
      class="pagination-button"
      @click="handlePageChange(currentPage - 1)"
    >
      이전
    </button>

    <div class="pagination-numbers-container">
      <button
        v-for="page in pageNumbers"
        :key="page"
        :class="['pagination-number-button', { active: currentPage === page }]"
        @click="handlePageChange(page)"
      >
        {{ page }}
      </button>
    </div>

    <button
      :disabled="currentPage === totalPages"
      class="pagination-button"
      @click="handlePageChange(currentPage + 1)"
    >
      다음
    </button>

    <button
      :disabled="currentPage === totalPages"
      class="pagination-button"
      @click="handlePageChange(totalPages)"
    >
      마지막
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  totalItems: {
    type: Number,
    default: 0,
  },
  itemsPerPage: {
    type: Number,
    default: 5,
  },
  onPageChange: {
    type: Function,
    required: true,
  },
});

const currentPage = ref(1);
const pageRange = 5;

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage));

const pageNumbers = computed(() => {
  let start = Math.max(1, currentPage.value - Math.floor(pageRange / 2));
  const end = Math.min(start + pageRange - 1, totalPages.value);

  if (end === totalPages.value) {
    start = Math.max(1, end - pageRange + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const handlePageChange = (page) => {
  if (page === currentPage.value) return;

  currentPage.value = page;
  props.onPageChange(page);
};
</script>

<style scoped>
@import 'tailwindcss';

.pagination-container {
  @apply mt-4 flex items-center justify-center gap-2;
}

.pagination-button {
  @apply rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 ease-in-out;
}

.pagination-button:hover:not(:disabled) {
  @apply -translate-y-0.5 border-blue-400 bg-blue-50 text-blue-600 shadow-md;
}

.pagination-button:active:not(:disabled) {
  @apply translate-y-0 transform bg-blue-100;
}

.pagination-button:disabled {
  @apply cursor-not-allowed opacity-50;
}

.pagination-number-button {
  @apply rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 ease-in-out hover:bg-blue-50;
}

.pagination-number-button.active {
  @apply bg-blue-500 text-white shadow-md hover:bg-blue-600;
}

.pagination-numbers-container {
  @apply flex gap-1;
}
</style>
