<template>
    <div>
        <p class="font-bold text-2xl">{{ editMode ? 'Ubah Data' : 'Tambah Data' }}</p>
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="handleClose">✕</button>
        <hr class="pb-3">
        <form @submit.prevent="handleSubmit">
            <label class="input input-bordered flex items-center gap-9 mt-2">
                Name
                <input type="text" required class="grow" placeholder="Enter name" v-model="detailBidang.name" />
            </label>
            <label class="textarea textarea-bordered flex items-center gap-1 mt-2">
                Deskripsi
                <textarea class="textarea textarea-ghost grow" placeholder="Enter description" required v-model="detailBidang.deskripsi"></textarea>
            </label>
            <input type="hidden" required class="grow" placeholder="Enter bidang ID" v-model="detailBidang.bidang_id" />
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
const emit = defineEmits(["closeModal", "detailBidangSaved"]);

const props = defineProps({
    bidangId: {
        type: String,
        required: true,
    },
    detailBidang: {
        type: Object,
        default: () => null,
    },
    editMode: {
        type: Boolean,
        required: true,
    }
});


// Reactive bidang data
const detailBidang = reactive({
    name: props.detailBidang?.name || '',
    deskripsi: props.detailBidang?.deskripsi || '',
    image: null,
    bidang_id: props.bidangId || '',
});

// Preview URL
const imagePreview = ref(props.detailBidang?.image || null);

// Watch for changes to movie props to ensure reactivity
watch(() => props.detailBidang, (newVal) => {
    if (newVal) {
        Object.assign(detailBidang, newVal);
        imagePreview.value = newVal.image; 
    }
}, { immediate: true });

const handleUpload = (imageData) => {
    const selectImage = imageData.target.files[0];
    detailBidang.image = selectImage;
    imagePreview.value = URL.createObjectURL(selectImage);
};

const resetForm = () => {
    detailBidang.name = '';
    detailBidang.deskripsi = '';
    detailBidang.image = null;
    imagePreview.value = null;
    detailBidang.bidang_id = '';
};

const handleSubmit = async () => {
    try {
        const formData = new FormData();
        formData.append("name", detailBidang.name);
        formData.append("deskripsi", detailBidang.deskripsi);
        formData.append("bidang_id", detailBidang.bidang_id);
        if (detailBidang.image instanceof File) {
            formData.append("image", detailBidang.image);
        }

        if (props.editMode && props.detailBidang) {
            await customAPI.post(`/detail-bidang/${props.detailBidang.id}?_method=PUT`, formData, {
                headers: { 
                    Authorization: `Bearer ${authStore.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
        } else {
            await customAPI.post('/detail-bidang', formData, {
                headers: { 
                    Authorization: `Bearer ${authStore.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
        }

        emit('detailBidangSaved');
        resetForm(); 
        alert('Detail Bidang successfully saved!');
    } catch (error) {
        console.error('Failed to save detail bidang:', error);
    }
};

const handleClose = () => {
    resetForm();
    emit('closeModal');
}
</script>
