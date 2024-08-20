<template>
    <div>
        <div class="breadcrumbs text-sm bg-neutral text-neutral-content rounded-xl font-bold">
            <ul class="px-4">
                <li>
                    <RouterLink :to="{ name:'Home'}">
                        <span class="pi pi-home"></span>
                    </RouterLink>
                </li>
                <li v-if="props.title1">
                    <RouterLink :to="{ name: `${props.route1}`}">
                        {{ props.title1 }}
                    </RouterLink>
                </li>
                <li v-if="props.title2">
                    <RouterLink :to="{ name: `${props.route2}`, params: {id: `${props.id2}`}}">
                        {{ props.title2 }}
                    </RouterLink>
                </li>
                <li v-if="props.title3">
                    <RouterLink :to="{ name: `${props.route3}`, params: {id: `${props.id3}`}}">
                        {{ props.title3 }}
                    </RouterLink>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
import { RouterLink } from 'vue-router';
const props = defineProps({
    title1: {
        type: String,
    },
    route1: {
        type: String,
    },
    title2: {
        type: String,
    },
    route2: {
        type: String,
    },
    id2: {
        type: String,
    },
    title3: {
        type: String,
    },
    route3: {
        type: String,
    },
    id3: {
        type: String,
    },
})
</script>