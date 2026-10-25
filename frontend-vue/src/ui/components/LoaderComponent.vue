<template>
    <div class="flex flex-col items-center justify-center p-6 space-y-4">
        <div class="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p v-if="text" class="text-sm font-medium text-slate-600 dark:text-slate-300">{{ text }}</p>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    text?: string;
}>();
</script>