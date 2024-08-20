<template>
    <div class="pt-16 my-10 mx-10">
        <div class="my-5">
            <SectionHeader :title1="'Download'" :route1="'Download'"/>
        </div>
        <!-- ADD download -->
        <button 
            class="btn btn-sm btn-accent my-4 px-4" 
            @click="openModalDownload"
            v-if="authStore.user && authStore.user.role.name === 'admin'"
        >
            <span class="pi pi-plus"></span>
        </button>
        <div class="modal" :class="{ 'modal-open': showModalDownload }">
            <div class="modal-box">
                <DialogKonten
                    @closeModal="closeModalDownload" 
                    :editMode="editModeDownload" 
                    :data="selectedDownload" 
                    form="download"
                    @Saved="handleSavedDownload" 
                />
            </div>
        </div>
        
        <div v-if="loading">
            <LoadingComponent />
        </div>
        <div v-else>
            <section id="Download" class="border shadow-sm mt-5 pt-2 px-2 rounded-lg" >
                <div class="overflow-x-auto px-5 py-5">
                    <div class="h-[500px] overflow-y-auto">
                        <table class="table table-xs table-pin-rows">
                            <thead>
                                <tr class="text-center bg-base-200 text-sm">
                                    <th>#</th>
                                    <td>Title</td>
                                    <td>URL</td>
                                    <td>Update At</td>
                                    <td v-if="authStore.user && authStore.user.role.name === 'admin'">Aksi</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in download" :key="item.id" class="text-center">
                                    <th>{{ index + 1 }}</th>
                                    <td class="w-[400px]">{{ item.title }}</td>
                                    <td class="w-[600px] text-blue-500">
                                        <a :href="item.url" target="_blank">{{ item.url }}</a>
                                    </td>
                                    <td>{{ formatDate(item.updated_at) }}</td>
                                    <td v-if="authStore.user && authStore.user.role.name === 'admin'">
                                        <div class="flex flex-row gap-2 justify-center">
                                            <button 
                                                @click="openEditModalDownload(item)" 
                                                class="mt-auto bg-warning text-white py-2 px-4 rounded hover:bg-base-200 hover:text-neutral" 
                                                v-if="authStore.user && authStore.user.role.name === 'admin'"
                                            >
                                                <span class="pi pi-pencil"></span>
                                            </button>
                                            <button 
                                                @click="handleDeleteDownload(item.id)" 
                                                class="mt-auto bg-red-500 text-white py-2 px-4 rounded hover:bg-base-200 hover:text-neutral"
                                                v-if="authStore.user && authStore.user.role.name === 'admin'"
                                            >
                                                <span class="pi pi-trash"></span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>
<script setup>
import { customAPI } from '@/api';
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/AuthStore';
import { format } from 'date-fns';
import LoadingComponent from '@/components/LoadingComponent.vue';
import DialogKonten from '@/components/Dialog/DialogKonten.vue';
import SectionHeader from '@/components/layouts/SectionHeader.vue';

const formatDate = (date) => {
    return format(new Date(date), 'dd-MM-yyyy HH:mm:ss');
};
const authStore = useAuthStore();
const loading = ref(false);
const download = ref([]);

onMounted(() => {
    FetchDownload();
});

const FetchDownload = async () => {
    try {
        loading.value = true;
        const { data } = await customAPI.get('/download', {
            headers: { Authorization: `Bearer ${authStore.token}` },
        });
        download.value = data.data;
    } catch (error) {
        console.error('Failed to fetch peran:', error);
    } finally {
        loading.value = false;
    }
};

const showModalDownload = ref(false);
const editModeDownload = ref(false);
const selectedDownload = ref(null);

const openModalDownload = () => {
    showModalDownload.value = true;
    editModeDownload.value = false;
    selectedDownload.value = null;
};

const openEditModalDownload = (DownloadItem) => {
    selectedDownload.value = DownloadItem;  
    editModeDownload.value = true;
    showModalDownload.value = true;
};

const closeModalDownload = () => {
    showModalDownload.value = false;
    selectedDownload.value = null;
    editModeDownload.value = false;
};

const handleSavedDownload = () => {
    FetchDownload(); 
    closeModalDownload(); 
};

// DELETE Download
const handleDeleteDownload = async (paramsId) => {
    try {
        await customAPI.post(`/download/${paramsId}?_method=DELETE`, null, {
            headers: { Authorization: `Bearer ${authStore.token}` },
        });

        alert("Download successfully deleted!");
        FetchDownload();
    } catch (error) {
        console.error('Failed to delete Download:', error);
    }
};
</script>