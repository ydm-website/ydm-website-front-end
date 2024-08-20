<template>
    <div class="relative p-4">
        <p class="font-bold text-2xl mb-3">{{ editMode ? 'Ubah Data' : 'Tambah Data' }}</p>
        <button 
            class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" 
            @click="handleClose">✕
        </button>
        <form @submit.prevent="handleSubmit">
            <div class="mb-4">
                <label class="block font-semibold mb-2">Title</label>
                <input type="text" required class="input input-bordered w-full" placeholder="Enter title" v-model="data.title" />
            </div>

            <div class="mb-4">
                <label class="block font-semibold mb-2">Detail</label>
                <textarea class="textarea textarea-bordered w-full" placeholder="Enter detail" required v-model="data.content"></textarea>
            </div>

            <div class="mb-4">
                <label class="block font-semibold mb-2">File</label>
                <input type="file" class="file-input w-full" @change="handleUpload" accept=".pdf" />
            </div>

            <div v-if="filePreview" class="flex justify-center mt-4">
                <embed v-if="isPdf" :src="filePreview" width="600" height="400" type="application/pdf" />
                <p v-else>Preview not available for this file type.</p>
            </div>

            <div class="flex justify-end gap-3 mt-6">
                <input type="submit" :value="editMode ? 'Simpan' : 'Tambah'" class="btn btn-accent w-24"/>
                <button type="button" class="btn btn-outline w-24" @click="handleClose">
                    Close
                </button>
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
    editMode: {
        type: Boolean,
        required: true,
    }
});

const data = reactive({
    title: props.data?.title || '',
    content: props.data?.content || '',
    file: null,
});

const filePreview = ref(props.data?.file || null);
const isPdf = ref(true);

watch(() => props.data, (newVal) => {
    if (newVal) {
        Object.assign(data, newVal);
        filePreview.value = newVal.file;
        isPdf.value = /\.(pdf)$/i.test(newVal.file);
    }
}, { immediate: true });

const handleUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
        data.file = selectedFile;
        filePreview.value = URL.createObjectURL(selectedFile);
        isPdf.value = true;
    } else {
        alert('Invalid file type. Only PDF files are allowed.');
        filePreview.value = null;
        data.file = null;
        isPdf.value = false;
    }
};

const resetForm = () => {
    data.title = '';
    data.content = '';
    data.file = null;
    filePreview.value = null;
    isPdf.value = false;
};

const handleSubmit = async () => {
    try {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("content", data.content);
        if (data.file instanceof File) {
            formData.append("file", data.file);
        }

        const endpoint = props.editMode && props.data 
            ? `/pengumuman/${props.data.id}?_method=PUT` 
            : '/pengumuman';

        await customAPI.post(endpoint, formData, {
            headers: { 
                Authorization: `Bearer ${authStore.token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

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
