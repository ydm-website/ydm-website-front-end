<template>
    <div>
        <p class="font-bold text-2xl">{{ editMode ? 'Ubah Data' : 'Tambah Data' }}</p>
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="handleClose">✕</button>
        <hr class="pb-3">
        <form @submit.prevent="handleSubmit">
            <label class="input input-bordered flex items-center gap-8 mt-2">
                Title
                <input type="text" required class="grow" placeholder="Enter title" v-model="data.title" />
            </label>
            <label class="input input-bordered flex items-center gap-8 mt-2">
                URL
                <input type="text" required class="grow" placeholder="Enter URL" v-model="data.url" />
            </label>
            <div class="flex flex-row py-3 items-center justify-end gap-3">
                <input type="submit" :value="editMode ? 'Simpan' : 'Tambah'" class="btn btn-accent w-20">
                <div class="btn w-20" @click="handleClose">Close</div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { reactive, watch } from 'vue';
import { customAPI } from '@/api';
import { useAuthStore } from '@/stores/AuthStore';

const authStore = useAuthStore();
const emit = defineEmits(["closeModal", "Saved"]);

const props = defineProps({
    data: {
        type: Object,
        default: () => null,
    },
    form: {
        type: String,
        required: true,
    },
    editMode: {
        type: Boolean,
        required: true,
    }
});

// Reactive data
const data = reactive({
    title: props.data?.title || '',
    url: props.data?.url || '',
});

// Watch for changes to movie props to ensure reactivity
watch(() => props.data, (newVal) => {
    if (newVal) {
        Object.assign(data, newVal);
    }
}, { immediate: true });

const resetForm = () => {
    data.title = '';
    data.url = '';
};

const handleSubmit = async () => {
    try {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("url", data.url);
        if (props.form === "video") {
            if (props.editMode && props.data) {
                await customAPI.post(`/video/${props.data.id}?_method=PUT`, formData, {
                    headers: { 
                        Authorization: `Bearer ${authStore.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await customAPI.post('/video', formData, {
                    headers: { 
                        Authorization: `Bearer ${authStore.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
        } else if (props.form === "download") {
            if (props.editMode && props.data) {
                await customAPI.post(`/download/${props.data.id}?_method=PUT`, formData, {
                    headers: { 
                        Authorization: `Bearer ${authStore.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await customAPI.post('/download', formData, {
                    headers: { 
                        Authorization: `Bearer ${authStore.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
        } 
        
        
        emit('Saved');
        resetForm(); 
        alert('Data successfully saved!');
    } catch (error) {
        console.error('Failed to save data:', error);
    }
};

const handleClose = () => {
    resetForm();
    emit('closeModal');
}
</script>
