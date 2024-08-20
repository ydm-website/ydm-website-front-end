<template>
    <div>
        <p class="font-bold text-2xl">Tambah Data</p>
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="handleClose">✕</button>
        <hr class="pb-3">
        <form @submit.prevent="handleSubmit">
            <label class="input input-bordered flex items-center gap-11 mt-2">
                Name
                <input type="text" required class="grow" placeholder="Enter name" v-model="user.name" />
            </label>
            <label class="input input-bordered flex items-center gap-12 mt-2">
                Email
                <input type="email" required class="grow" placeholder="Enter email" v-model="user.email" />
            </label>
            <label class="input input-bordered flex items-center gap-5 mt-2">
                Password
                <input type="password" required class="grow" placeholder="Enter password" v-model="user.password" />
            </label>
            <label class="input input-bordered flex items-center gap-10 mt-2">
                Role
                <select class="select select-ghost grow" required v-model="user.role_id">
                    <option disabled selected>Pilih Role</option>
                    <option v-for="item in role" :value="item.id" :key="role.id">
                        {{ item.name }}
                    </option>
                </select>
            </label>
            <div class="flex flex-row py-3 items-center justify-end gap-3">
                <input type="submit" value="Simpan" class="btn btn-accent w-20">
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
const emit = defineEmits(["closeModal", "UserSaved"]);

const props = defineProps({
    role: {
        type: Array,
        required: true,
    },
    user: {
        type: Object,
        default: () => null,
    },
});

// Reactive user data
const user = reactive({
    name: props.user?.name || '',
    email: props.user?.email || '',
    role_id: props.user?.role_id || '',
});

// Watch for changes to movie props to ensure reactivity
watch(() => props.user, (newVal) => {
    if (newVal) {
        Object.assign(user, newVal);
    }
}, { immediate: true });

const resetForm = () => {
    user.name = '';
    user.email = '';
    user.password = '';
    user.role_id = '';
};

const handleSubmit = async () => {
    try {
        const formData = new FormData();
        formData.append("name", user.name);
        formData.append("email", user.email);
        formData.append("password", user.password);
        formData.append("role_id", user.role_id);
        if (props.user) {
            await customAPI.post(`/user/${props.user.id}?_method=PUT`, formData, {
                headers: { 
                    Authorization: `Bearer ${authStore.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
        } else {
            await customAPI.post('/user', formData, {
                headers: { 
                    Authorization: `Bearer ${authStore.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
        }

        emit('UserSaved');
        resetForm(); 
        alert('User successfully saved!');
    } catch (error) {
        console.error('Failed to save user:', error);
    }
};

const handleClose = () => {
    resetForm();
    emit('closeModal');
}
</script>
