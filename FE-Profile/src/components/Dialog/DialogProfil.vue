<template>
    <div>
        <p class="font-bold text-2xl">{{ editMode ? 'Ubah Data' : 'Tambah Data' }}</p>
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="handleClose">✕</button>
        <hr class="pb-3">
        <form @submit.prevent="handleSubmit">
            <label class="textarea textarea-bordered flex items-center gap-1 mt-2">
                Deskripsi
                <textarea class="textarea textarea-ghost grow" placeholder="Enter description" required v-model="hero.deskripsi"></textarea>
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
const emit = defineEmits(["closeModal", "heroSaved"]);

const props = defineProps({
    hero: {
        type: Object,
        default: () => null,
    },
    editMode: {
        type: Boolean,
        required: true,
    }
});

// Reactive hero data
const hero = reactive({
    deskripsi: props.hero?.deskripsi || '',
    image: null,
});

// Preview URL
const imagePreview = ref(props.hero?.image || null);

// Watch for changes to movie props to ensure reactivity
watch(() => props.hero, (newVal) => {
    if (newVal) {
        Object.assign(hero, newVal);
        imagePreview.value = newVal.image; 
    }
}, { immediate: true });

const handleUpload = (imageData) => {
    const selectImage = imageData.target.files[0];
    hero.image = selectImage;
    imagePreview.value = URL.createObjectURL(selectImage);
};

const resetForm = () => {
    hero.deskripsi = '';
    hero.image = null;
    imagePreview.value = null;
};

const handleSubmit = async () => {
    try {
        const formData = new FormData();
        formData.append("deskripsi", hero.deskripsi);
        if (hero.image instanceof File) {
            formData.append("image", hero.image);
        }

        if (props.editMode && props.hero) {
            await customAPI.post(`/profil/${props.hero.id}?_method=PUT`, formData, {
                headers: { 
                    Authorization: `Bearer ${authStore.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
        } else {
            await customAPI.post('/profil', formData, {
                headers: { 
                    Authorization: `Bearer ${authStore.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
        }

        emit('heroSaved');
        resetForm(); 
        alert('hero successfully saved!');
    } catch (error) {
        console.error('Failed to save hero:', error);
    }
};

const handleClose = () => {
    resetForm();
    emit('closeModal');
}
</script>
