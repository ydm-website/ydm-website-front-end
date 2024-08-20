<template>
    <div>
        <p class="font-bold text-2xl">{{ editMode ? 'Ubah Data' : 'Tambah Data' }}</p>
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="handleClose">✕</button>
        <hr class="pb-3">
        <form @submit.prevent="handleSubmit">
            <label class="input input-bordered flex items-center gap-6 mt-2">
                Address
                <input type="text" required class="grow" placeholder="Enter name" v-model="data.address" />
            </label>
            <label class="input input-bordered flex items-center gap-7 mt-2">
                Telepon
                <input type="text" required class="grow" placeholder="Enter name" v-model="data.call" />
            </label>
            <label class="input input-bordered flex items-center gap-12 mt-2">
                Email
                <input type="text" required class="grow" placeholder="Enter name" v-model="data.email" />
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
    address: props.data?.address || '',
    call: props.data?.call || '',
    email: props.data?.email || '',
});

// Watch for changes to movie props to ensure reactivity
watch(() => props.data, (newVal) => {
    if (newVal) {
        Object.assign(data, newVal);
    }
}, { immediate: true });

const resetForm = () => {
    data.address = '';
    data.call = '';
    data.email = '';
};

const handleSubmit = async () => {
    try {
        const formData = new FormData();
        formData.append("address", data.address);
        formData.append("call", data.call);
        formData.append("email", data.email);
        if (props.editMode && props.data) {
            await customAPI.post(`/kontak/${props.data.id}?_method=PUT`, formData, {
                headers: { 
                    Authorization: `Bearer ${authStore.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
        } else {
            await customAPI.post('/kontak', formData, {
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
