<template>
    <div>
        <p class="font-bold text-2xl">{{ editMode ? 'Ubah Data' : 'Tambah Data' }}</p>
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="handleClose">✕</button>
        <hr class="pb-3">
        <form @submit.prevent="handleSubmit">
            <label class="input input-bordered flex items-center gap-9 mt-2">
                Title
                <input type="text" required class="grow" placeholder="Enter title" v-model="dokumentasi.title" />
            </label>
            <label class="textarea textarea-bordered flex items-center gap-1 mt-2">
                Caption
                <textarea class="textarea textarea-ghost grow" placeholder="Enter description" required v-model="dokumentasi.image_caption"></textarea>
            </label>
            <label class="input input-bordered flex items-center gap-8 mt-2">
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
const emit = defineEmits(["closeModal", "dokumentasiSaved"]);

const props = defineProps({
    albumId: {
        type: String,
        required: true,
    },
    dokumentasi: {
        type: Object,
        default: () => null,
    },
    editMode: {
        type: Boolean,
        required: true,
    }
});


// Reactive album data
const dokumentasi = reactive({
    title: props.dokumentasi?.title || '',
    image_caption: props.dokumentasi?.image_caption || '',
    image: null,
    album_id: props.albumId || '',
});

// Preview URL
const imagePreview = ref(props.dokumentasi?.image || null);

// Watch for changes to movie props to ensure reactivity
watch(() => props.dokumentasi, (newVal) => {
    if (newVal) {
        Object.assign(dokumentasi, newVal);
        imagePreview.value = newVal.image; 
    }
}, { immediate: true });

const handleUpload = (imageData) => {
    const selectImage = imageData.target.files[0];
    dokumentasi.image = selectImage;
    imagePreview.value = URL.createObjectURL(selectImage);
};

const resetForm = () => {
    dokumentasi.title = '';
    dokumentasi.image_caption = '';
    dokumentasi.image = null;
    imagePreview.value = null;
    dokumentasi.album_id = '';
};

const handleSubmit = async () => {
    try {
        const formData = new FormData();
        formData.append("title", dokumentasi.title);
        formData.append("image_caption", dokumentasi.image_caption);
        formData.append("album_id", props.albumId);
        if (dokumentasi.image instanceof File) {
            formData.append("image", dokumentasi.image);
        }

        if (props.editMode && props.dokumentasi) {
            await customAPI.post(`/dokumentasi/${props.dokumentasi.id}?_method=PUT`, formData, {
                headers: { 
                    Authorization: `Bearer ${authStore.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
        } else {
            await customAPI.post('/dokumentasi', formData, {
                headers: { 
                    Authorization: `Bearer ${authStore.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
        }

        emit('dokumentasiSaved');
        resetForm(); 
        alert('Dokumentasi successfully saved!');
    } catch (error) {
        console.error('Failed to save detail dokumentasi:', error);
    }
};

const handleClose = () => {
    resetForm();
    emit('closeModal');
}
</script>
