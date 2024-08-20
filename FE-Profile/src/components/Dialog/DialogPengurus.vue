<template>
    <div>
        <p class="font-bold text-2xl">{{ editMode ? 'Ubah Data' : 'Tambah Data' }}</p>
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="handleClose">✕</button>
        <hr class="pb-3">
        <form @submit.prevent="handleSubmit">
            <label class="input input-bordered flex items-center gap-8 mt-2">
                Name
                <input type="text" required class="grow" placeholder="Enter name" v-model="pengurus.name" />
            </label>
            <label class="input input-bordered flex items-center gap-5 mt-2">
                Jabatan
                <input type="text" required class="grow" placeholder="Enter name" v-model="pengurus.jabatan" />
            </label>
            <label class="input input-bordered flex items-center gap-4 mt-2">
                Peran
                <select class="select select-ghost grow" required v-model="pengurus.peran_id">
                    <option disabled selected>Pilih Peran</option>
                    <option v-for="item in peran" :value="item.id" :key="peran.id">
                        {{ item.name }}
                    </option>
                </select>
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
const emit = defineEmits(["closeModal", "pengurusSaved"]);

const props = defineProps({
    peran: {
        type: Array,
        required: true,
    },
    pengurus: {
        type: Object,
        default: () => null,
    },
    editMode: {
        type: Boolean,
        required: true,
    }
});

// Reactive pengurus data
const pengurus = reactive({
    name: props.pengurus?.name || '',
    jabatan: props.pengurus?.jabatan || '',
    peran_id: props.pengurus?.peran_id || '',
    image: null,
});

// Preview URL
const imagePreview = ref(props.pengurus?.image || null);

// Watch for changes to movie props to ensure reactivity
watch(() => props.pengurus, (newVal) => {
    if (newVal) {
        Object.assign(pengurus, newVal);
        imagePreview.value = newVal.image; 
    }
}, { immediate: true });

const handleUpload = (imageData) => {
    const selectImage = imageData.target.files[0];
    pengurus.image = selectImage;
    imagePreview.value = URL.createObjectURL(selectImage);
};

const resetForm = () => {
    pengurus.name = '';
    pengurus.jabatan = '';
    pengurus.peran_id = '';
    pengurus.image = null;
    imagePreview.value = null;
};

const handleSubmit = async () => {
    try {
        const formData = new FormData();
        formData.append("name", pengurus.name);
        formData.append("jabatan", pengurus.jabatan);
        formData.append("peran_id", pengurus.peran_id);
        if (pengurus.image instanceof File) {
            formData.append("image", pengurus.image);
        }

        if (props.editMode && props.pengurus) {
            await customAPI.post(`/pengurus/${props.pengurus.id}?_method=PUT`, formData, {
                headers: { 
                    Authorization: `Bearer ${authStore.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
        } else {
            await customAPI.post('/pengurus', formData, {
                headers: { 
                    Authorization: `Bearer ${authStore.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
        }

        emit('pengurusSaved');
        resetForm(); 
        alert('Pengurus successfully saved!');
    } catch (error) {
        console.error('Failed to save pengurus:', error);
    }
};

const handleClose = () => {
    resetForm();
    emit('closeModal');
}
</script>
