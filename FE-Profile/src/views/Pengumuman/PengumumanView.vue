<template>
    <div class="py-16 my-10 mx-10">
        <SectionHeader :title1="'Pengumuman'" :route1="'Pengumuman'"/>
        <section id="Pengumuman">
            <div class="pt-10" v-if="authStore.user && authStore.user.role.name === 'admin'">
                <!-- ADD Pengumuman -->
                <button class="btn btn-md btn-accent mr-2" @click="openModalPengumuman">
                    <span class="pi pi-plus"></span>
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
            </div>
            
            <div v-if="loading">
                <LoadingComponent />
            </div>
            <div v-else>
                <div class="mt-5 py-5 flex flex-col gap-3 ">
                    <div v-for="PengumumanItem in pengumuman" :key="PengumumanItem.id">
                        <div 
                            class="card border border-slate-200 shadow-lg"
                            @click="handleCardClick(PengumumanItem.id)"
                        >
                            <div class="card-body flex flex-col">
                                <div class="flex flex-row gap-2" v-if="authStore.user && authStore.user.role.name === 'admin'">
                                    <button 
                                        @click="openEditModalPengumuman(PengumumanItem)" 
                                        class="btn btn-warning btn-sm"
                                    >
                                        <span class="pi pi-pencil text-neutral-content"></span>
                                    </button>
                                    <button 
                                        @click="handleDelete(PengumumanItem.id)"
                                        class="btn btn-error btn-sm"
                                    >
                                        <span class="pi pi-trash text-neutral-content"></span>
                                    </button>
                                </div>
                                <h2 class="text-2xl font-bold break-words w-full">
                                    {{ PengumumanItem.title }}
                                </h2>
                                <p class="text-xs">
                                    Updated At : {{ formatDate(PengumumanItem.updated_at) }}
                                </p>
                                <hr>
                                <div v-if="PengumumanItem.content.length > 650">
                                    <p class="leading-relaxed text-justify" v-if="PengumumanItem.content.length > 650">
                                        {{ PengumumanItem.content.substring(0,650) }} . . .
                                        <RouterLink 
                                            :to="{ name:'DetailPengumuman', params: {id: PengumumanItem.id} }" 
                                            class="text-info"
                                        >
                                            selengkapnya
                                        </RouterLink>
                                    </p>
                                    <div class="flex flex-row gap-2">
                                        <div v-if="PengumumanItem.file">
                                            <a :href="PengumumanItem.file" download class="btn btn-info btn-sm btn-outline">Download File</a>
                                        </div>
                                    </div>
                                </div>
                                <div v-else>
                                    <p class="leading-relaxed text-justify">
                                        {{ PengumumanItem.content }}
                                    </p>
                                    <div v-if="PengumumanItem.file">
                                        <a :href="PengumumanItem.file" download class="btn btn-info btn-sm btn-outline">Download File</a>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { customAPI } from '@/api';
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/AuthStore';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import DialogPengumuman from '@/components/Dialog/DialogPengumuman.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import SectionHeader from '@/components/layouts/SectionHeader.vue';

const formatDate = (date) => {
    return format(new Date(date), 'dd-MM-yyyy HH:mm:ss');
};

const loading = ref(false);
const router = useRouter(); 
const pengumuman = ref([]);
const authStore = useAuthStore();

// Fetch data Pengumuman dari API
const FetchPengumuman = async () => {
    try {
        loading.value = true;
        const { data } = await customAPI.get('/pengumuman');
        pengumuman.value = data.data;
    } catch (error) {
        console.error('Failed to fetch pengumuman:', error);
    } finally {
        loading.value = false;
    }
};

const showModalPengumuman = ref(false);
const editModePengumuman = ref(false);
const selectedPengumuman = ref(null);

const openModalPengumuman = () => {
    showModalPengumuman.value = true;
    editModePengumuman.value = false;
    selectedPengumuman.value = null;
};

const openEditModalPengumuman = (PengumumanItem) => {
    selectedPengumuman.value = PengumumanItem;
    editModePengumuman.value = true;
    showModalPengumuman.value = true;
};

const closeModalPengumuman = () => {
    showModalPengumuman.value = false;
    selectedPengumuman.value = null;
    editModePengumuman.value = false;
};

const handleSavedPengumuman = () => {
    FetchPengumuman(); 
    closeModalPengumuman(); 
};

// DELETE
const handleDelete = async (paramsId) => {
    try {
        await customAPI.post(`/pengumuman/${paramsId}?_method=DELETE`, null, {
            headers: { Authorization: `Bearer ${authStore.token}` },
        });

        alert("Pengumuman successfully deleted!");
        FetchPengumuman();
    } catch (error) {
        console.error('Failed to delete Pengumuman:', error);
    }
};

onMounted(() => {
    FetchPengumuman();
});

const handleCardClick  = (PengumumanID) => {
    if (!authStore.user || authStore.user.role.name !== 'admin') {
        router.push({ name:'DetailPengumuman', params: {id: PengumumanID} });
    }
}

</script>
