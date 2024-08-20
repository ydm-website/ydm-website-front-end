<template>
    <div>
        <p class="font-bold text-2xl">{{ editMode ? 'Ubah Data' : 'Tambah Data' }}</p>
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="handleClose">✕</button>
        <hr class="pb-3">
        <form @submit.prevent="handleSubmit">
            <label class="input input-bordered flex items-center gap-8 mt-2">
                title
                <input type="text" required class="grow" placeholder="Enter title" v-model="hero.title" />
            </label>
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
    form: {
        type: String,
        required: true,
    },
    editMode: {
        type: Boolean,
        required: true,
    }
});

// Reactive hero data
const hero = reactive({
    title: props.hero?.title || '',
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
    hero.title = '';
    hero.deskripsi = '';
    hero.image = null;
    imagePreview.value = null;
};

const handleSubmit = async () => {
    try {
        const formData = new FormData();
        formData.append("title", hero.title);
        formData.append("deskripsi", hero.deskripsi);
        if (hero.image instanceof File) {
            formData.append("image", hero.image);
        }

        if (props.form === "hero") {
            if (props.editMode && props.hero) {
                await customAPI.post(`/hero/${props.hero.id}?_method=PUT`, formData, {
                    headers: { 
                        Authorization: `Bearer ${authStore.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await customAPI.post('/hero', formData, {
                    headers: { 
                        Authorization: `Bearer ${authStore.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
        } else if (props.form === "home") {
            if (props.editMode && props.hero) {
                await customAPI.post(`/home/${props.hero.id}?_method=PUT`, formData, {
                    headers: { 
                        Authorization: `Bearer ${authStore.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await customAPI.post('/home', formData, {
                    headers: { 
                        Authorization: `Bearer ${authStore.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
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
