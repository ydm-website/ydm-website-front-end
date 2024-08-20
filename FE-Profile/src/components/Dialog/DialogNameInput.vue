<template>
    <div>
        <p class="font-bold text-2xl">{{ editMode ? 'Ubah Data' : 'Tambah Data' }}</p>
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="handleClose">✕</button>
        <hr class="pb-3">
        <form @submit.prevent="handleSubmit">
            <label class="input input-bordered flex items-center gap-8 mt-2">
                Name
                <input type="text" required class="grow" placeholder="Enter name" v-model="data.name" />
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
    name: props.data?.name || '',
});

// Watch for changes to movie props to ensure reactivity
watch(() => props.data, (newVal) => {
    if (newVal) {
        Object.assign(data, newVal);
    }
}, { immediate: true });

const resetForm = () => {
    data.name = '';
};

const handleSubmit = async () => {
    try {
        const formData = new FormData();
        formData.append("name", data.name);
        if (props.form === "peran") {
            if (props.editMode && props.data) {
                await customAPI.post(`/peran-pengurus/${props.data.id}?_method=PUT`, formData, {
                    headers: { 
                        Authorization: `Bearer ${authStore.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await customAPI.post('/peran-pengurus', formData, {
                    headers: { 
                        Authorization: `Bearer ${authStore.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
        } else if (props.form === "role") {
            if (props.editMode && props.data) {
                await customAPI.post(`/role/${props.data.id}?_method=PUT`, formData, {
                    headers: { 
                        Authorization: `Bearer ${authStore.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await customAPI.post('/role', formData, {
                    headers: { 
                        Authorization: `Bearer ${authStore.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
        } else if (props.form === "kategori") {
            if (props.editMode && props.data) {
                await customAPI.post(`/kategori-berita/${props.data.id}?_method=PUT`, formData, {
                    headers: { 
                        Authorization: `Bearer ${authStore.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await customAPI.post('/kategori-berita', formData, {
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
