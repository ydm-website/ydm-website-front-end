<template>
    <div>
        <p class="font-bold text-2xl">{{ editMode ? 'Ubah Data' : 'Tambah Data' }}</p>
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="handleClose">✕</button>
        <hr class="pb-3">
        <form @submit.prevent="handleSubmit">
            <label class="input input-bordered flex items-center gap-7 mt-2">
                Instansi
                <input type="text" required class="grow" placeholder="Enter name" v-model="data.instansi" />
            </label>
            <label class="input input-bordered flex items-center gap-6 mt-2">
                Address
                <input type="text" required class="grow" placeholder="Enter name" v-model="data.address" />
            </label>
            <label class="input input-bordered flex items-center gap-7 mt-2">
                Telepon
                <input type="text" required class="grow" placeholder="Enter name" v-model="data.call" />
            </label>
            <label class="input input-bordered flex items-center gap-11 mt-2">
                Email
                <input type="text" required class="grow" placeholder="Enter name" v-model="data.email" />
            </label>
            <label class="input input-bordered flex items-center gap-6 mt-2">
                Website
                <input type="text" required class="grow" placeholder="Enter name" v-model="data.website" />
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
    editMode: {
        type: Boolean,
        required: true,
    }
});

// Reactive data
const data = reactive({
    instansi: props.data?.instansi || '',
    address: props.data?.address || '',
    call: props.data?.call || '',
    email: props.data?.email || '',
    website: props.data?.website || '',
});

// Watch for changes to movie props to ensure reactivity
watch(() => props.data, (newVal) => {
    if (newVal) {
        Object.assign(data, newVal);
    }
}, { immediate: true });

const resetForm = () => {
    data.instansi = '';
    data.address = '';
    data.call = '';
    data.email = '';
    data.website = '';
};

const handleSubmit = async () => {
    try {
        const formData = new FormData();
        formData.append("instansi", data.instansi);
        formData.append("address", data.address);
        formData.append("call", data.call);
        formData.append("email", data.email);
        formData.append("website", data.website);
        if (props.editMode && props.data) {
            await customAPI.post(`/other-contact/${props.data.id}?_method=PUT`, formData, {
                headers: { 
                    Authorization: `Bearer ${authStore.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
        } else {
            await customAPI.post('/other-contact', formData, {
                headers: { 
                    Authorization: `Bearer ${authStore.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
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
