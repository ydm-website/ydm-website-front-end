<template>
    <div>
        <p class="font-bold text-2xl">{{ editMode ? 'Ubah Data' : 'Tambah Data' }}</p>
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="handleClose">✕</button>
        <hr class="pb-3">
        <form @submit.prevent="handleSubmit">
            <label class="input input-bordered flex items-center gap-12 mt-2">
                Title
                <input type="text" required class="grow" placeholder="Enter title" v-model="berita.title" />
            </label>
            <label class="input input-bordered flex items-center gap-8 mt-2">
                Author
                <input type="text" required class="grow" placeholder="Enter author" v-model="berita.author" />
            </label>
            <label class="textarea textarea-bordered flex items-center gap-5 mt-2">
                Konten
                <textarea class="textarea textarea-ghost grow" placeholder="Enter description" required v-model="berita.content"></textarea>
            </label>
            <label class="input input-bordered flex items-center gap-1 mt-2">
                Kategori
                <select class="select select-ghost grow" required v-model="berita.kategori_id">
                    <option disabled selected>Pilih kategori</option>
                    <option v-for="item in kategori" :value="item.id" :key="kategori.id">
                        {{ item.name }}
                    </option>
                </select>
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
const emit = defineEmits(["closeModal", "beritaSaved"]);

const props = defineProps({
    kategori: {
        type: Array,
        required: true,
    },
    berita: {
        type: Object,
        default: () => null,
    },
    editMode: {
        type: Boolean,
        required: true,
    }
});

// Reactive berita data
const berita = reactive({
    title: props.berita?.title || '',
    author: props.berita?.author || '',
    content: props.berita?.content || '',
    kategori_id: props.berita?.kategori_id || '',
    image: null,
});

// Preview URL
const imagePreview = ref(props.berita?.image || null);

// Watch for changes to props to ensure reactivity
watch(() => props.berita, (newVal) => {
    if (newVal) {
        Object.assign(berita, newVal);
        imagePreview.value = newVal.image; 
    }
}, { immediate: true });

const handleUpload = (imageData) => {
    const selectImage = imageData.target.files[0];
    berita.image = selectImage;
    imagePreview.value = URL.createObjectURL(selectImage);
};

const resetForm = () => {
    berita.title = '';
    berita.author = '';
    berita.content = '';
    berita.kategori_id = '';
    berita.image = null;
    imagePreview.value = null;
};

const handleSubmit = async () => {
    try {
        const formData = new FormData();
        formData.append("title", berita.title);
        formData.append("author", berita.author);
        formData.append("content", berita.content);
        formData.append("kategori_id", berita.kategori_id);
        if (berita.image instanceof File) {
            formData.append("image", berita.image);
        }

        if (props.editMode && props.berita) {
            await customAPI.post(`/berita/${props.berita.id}?_method=PUT`, formData, {
                headers: { 
                    Authorization: `Bearer ${authStore.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
        } else {
            await customAPI.post('/berita', formData, {
                headers: { 
                    Authorization: `Bearer ${authStore.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
        }

        emit('beritaSaved');
        resetForm(); 
        alert('berita successfully saved!');
    } catch (error) {
        console.error('Failed to save berita:', error);
    }
};

const handleClose = () => {
    resetForm();
    emit('closeModal');
}
</script>
