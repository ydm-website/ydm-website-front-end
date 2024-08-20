<template>
    <div class="py-16 my-10 mx-10">
        <div class="my-5">
            <SectionHeader :title1="'Pengumuman'" :route1="'Pengumuman'" :title2="Pengumuman.title" :route2="'DetailPengumuman'" :id2="Pengumuman.id"/>
        </div>
        <section id="Detail Pengumuman">
            <div v-if="loading">
                <LoadingComponent />
            </div>
            <div v-else>
                <div class="card border border-slate-200 shadow-lg">
                    <div class="card-body flex flex-col">
                        <div class="flex flex-row gap-2">
                            <button 
                                @click="openEditModalPengumuman()" 
                                class="btn btn-warning btn-sm" 
                                v-if="authStore.user && authStore.user.role.name === 'admin'"
                            >
                                <span class="pi pi-pencil text-neutral-content"></span>
                            </button>
                            <div class="modal" :class="{ 'modal-open': showModalPengumuman }">
                                <div class="modal-box">
                                    <DialogPengumuman 
                                        @closeModal="closeModalPengumuman" 
                                        :editMode="editModePengumuman" 
                                        :data="selectedPengumuman" 
                                        @Saved="handleSavedPengumuman" 
                                    />
                                </div>
                            </div>
                            <button 
                                @click="handleDelete(Pengumuman.id)"
                                class="btn btn-error btn-sm"
                                v-if="authStore.user && authStore.user.role.name === 'admin'"
                            >
                                <span class="pi pi-trash"></span>
                            </button>
                        </div>
                        <h2 class="text-2xl font-bold break-words w-full">
                            {{ Pengumuman.title }}
                        </h2>
                        
                        <hr>
                        <p class=" leading-relaxed text-justify">{{ Pengumuman.content }}</p>
                        <div v-if="Pengumuman.file">
                            <a :href="Pengumuman.file" download class="btn btn-info btn-sm btn-outline">Download File</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router';
import { customAPI } from '@/api';
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/AuthStore';
import LoadingComponent from '@/components/LoadingComponent.vue';
import DialogPengumuman from '@/components/Dialog/DialogPengumuman.vue';
import SectionHeader from '@/components/layouts/SectionHeader.vue';

const Pengumuman = ref("");
const loading = ref(false);
const route = useRoute();
const authStore = useAuthStore();
const router = useRouter();

const PengumumanById = async () => {
    try {
        loading.value = true;
        const { data } = await customAPI.get(`/pengumuman/${route.params.id}`);
        Pengumuman.value = data.data;
        console.log(Pengumuman);
        
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    PengumumanById();
});

// Function to handle delete
const handleDelete = async (paramsId) => {
    try {
        await customAPI.post(`/pengumuman/${paramsId}?_method=DELETE`, null, {
            headers: { Authorization: `Bearer ${authStore.token}` },
        });

        alert("Detail successfully deleted!");
        router.push({ name: 'Pengumuman' });
    } catch (error) {
        console.error('Failed to delete:', error);
    }
};

const showModalPengumuman = ref(false);
const editModePengumuman = ref(false);
const selectedPengumuman = ref(null);

const openEditModalPengumuman = () => {
    selectedPengumuman.value = Pengumuman.value;
    editModePengumuman.value = true;
    showModalPengumuman.value = true;
};

const closeModalPengumuman = () => {
    showModalPengumuman.value = false;
    selectedPengumuman.value = null;
    editModePengumuman.value = false;
};

const handleSavedPengumuman = () => {
    PengumumanById(); 
    closeModalPengumuman(); 
};
</script>