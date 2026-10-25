<script setup lang="ts">
defineProps<{
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}>();

defineEmits(['prev', 'next']);
</script>

<template>
    <div v-if="totalPages > 1" class="flex justify-center items-center gap-6 mt-10">
        <button @click="$emit('prev')" :disabled="!hasPreviousPage"
            class="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-purple-700 transition">
            &larr; back
        </button>
        <span class="text-slate-700 dark:text-slate-200 font-medium">
            PAg {{ currentPage }} of {{ totalPages }}
        </span>
        <button @click="$emit('next')" :disabled="!hasNextPage"
            class="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-purple-700 transition">
            next &rarr;
        </button>
    </div>
</template>