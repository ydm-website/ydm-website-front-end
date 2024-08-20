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
            <label class="input input-bordered flex items-center gap-7 mt-2">
                Image
                <input type="file" class="file-input" @change="handleUpload" />
            </label>
            <!-- Menampilkan gambar yang sudah ada -->
            <div v-if="imagePreview" class="flex justify-center mt-4">
                <img :src="imagePreview" alt="Image Preview" class="image-preview" />
            </div>
            <div class="flex flex-row py-3 items-center justify-end gap-3">
                <input type="submit" :value="editMode ? 'Simpan' : 'Tambah'" class="btn btn-accent w-20">
                <div class="btn w-20" @click="handleClose">Close</div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
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

// Reactive data data
const data = reactive({
    name: props.data?.name || '',
    image: null,
});

// Preview URL
const imagePreview = ref(props.data?.image || null);

// Watch for changes to movie props to ensure reactivity
watch(() => props.data, (newVal) => {
    if (newVal) {
        Object.assign(data, newVal);
        imagePreview.value = newVal.image; 
    }
}, { immediate: true });

const handleUpload = (imageData) => {
    const selectImage = imageData.target.files[0];
    data.image = selectImage;
    imagePreview.value = URL.createObjectURL(selectImage);
};

const resetForm = () => {
    data.name = '';
    data.image = null;
    imagePreview.value = null;
};

const handleSubmit = async () => {
    try {
        const formData = new FormData();
        formData.append("name", data.name);
        if (data.image instanceof File) {
            formData.append("image", data.image);
        }
        if (props.form === "bidang") {
            if (props.editMode && props.data) {
                await customAPI.post(`/bidang/${props.data.id}?_method=PUT`, formData, {
                    headers: { 
                        Authorization: `Bearer ${authStore.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await customAPI.post('/bidang', formData, {
                    headers: { 
                        Authorization: `Bearer ${authStore.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
        } else if (props.form === "album") {
            if (props.editMode && props.data) {
                await customAPI.post(`/album-kegiatan/${props.data.id}?_method=PUT`, formData, {
                    headers: { 
                        Authorization: `Bearer ${authStore.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await customAPI.post('/album-kegiatan', formData, {
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
