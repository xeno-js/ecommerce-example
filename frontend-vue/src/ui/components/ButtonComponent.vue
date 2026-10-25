<template>
    <button :class="buttonClass" :disabled="disabled" @click="handleClick">
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    disabled?: boolean;
    type?: 'primary' | 'secondary' | 'danger';
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    type: 'primary',
});

// Definiamo l'emissione dell'evento click includendo l'event nativo
const emit = defineEmits(['click']);

const handleClick = (event: MouseEvent) => {
    if (!props.disabled) {
        emit('click', event);
    }
};

const buttonClass = computed(() => {
    const base = "px-4 py-2 font-medium rounded-lg transition duration-200 flex items-center justify-center";
    if (props.disabled) return `${base} bg-slate-300 text-slate-500 cursor-not-allowed`;

    switch (props.type) {
        case 'secondary':
            return `${base} bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600`;
        case 'danger':
            return `${base} bg-red-600 text-white hover:bg-red-700`;
        case 'primary':
        default:
            return `${base} bg-purple-600 text-white hover:bg-purple-700`;
    }
});
</script>