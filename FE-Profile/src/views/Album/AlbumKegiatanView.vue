<template>
    <div class="py-16 my-10 mx-10">
        <div class="my-5">
            <SectionHeader :title1="'Album'" :route1="'Album Kegiatan'" />
        </div>
        <section id="ALBUM" >
            <div class="pt-10" v-if="authStore.user && authStore.user.role.name === 'admin'">
                <!-- ADD ALBUM -->
                <button class="btn btn-md btn-accent mr-2" @click="openModalAlbum">
                    <span class="pi pi-plus"></span>
                </button>
                <div class="modal" :class="{ 'modal-open': showModalAlbum }">
                    <div class="modal-box">
                        <DialogFolder 
                            @closeModal="closeModalAlbum" 
                            :editMode="editModeAlbum" 
                            :data="selectedAlbum" 
                            form="album"
                            @Saved="handleSavedAlbum" 
                        />
                    </div>
                </div>
            </div>
            
            <div v-if="loading">
                <LoadingComponent />
            </div>
            <div v-else>
                <div class="py-5 grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    <div v-for="AlbumItem in album" :key="AlbumItem.id">
                        <div 
                            class="card image-full border border-slate-200 shadow-xl h-[170px] sm:w-[190px] md:w-[210px] lg:w-[250px]"
                            @click="handleCardClick(AlbumItem.id)"
                        >
                            <figure>
                                <img :src="AlbumItem.image" :alt="AlbumItem.name" 
                                    class="w-full object-cover" 
                                />
                            </figure>
                            <div class="card-body flex flex-col items-center justify-center">
                                <h2 class="card-title text-center">
                                    {{ AlbumItem.name }}
                                </h2>

                                <div class="card-actions grid grid-cols-3 gap-1 justify-center">
                                    <RouterLink 
                                        :to="{ name:'DetailAlbum', params: {id: AlbumItem.id} }" 
                                        class="btn btn-info btn-sm"
                                        v-if="authStore.user && authStore.user.role.name === 'admin'"
                                    >
                                        <span class="pi pi-eye text-neutral-content"></span>
                                    </RouterLink>
                                    <button 
                                        @click="openEditModalAlbum(AlbumItem)" 
                                        class="btn btn-warning btn-sm" 
                                        v-if="authStore.user && authStore.user.role.name === 'admin'"
                                    >
                                        <span class="pi pi-pencil text-neutral-content"></span>
                                    </button>
                                    <button 
                                        @click="handleDelete(AlbumItem.id)"
                                        class="btn btn-error btn-sm"
                                        v-if="authStore.user && authStore.user.role.name === 'admin'"
                                    >
                                        <span class="pi pi-trash text-neutral-content"></span>
                                    </button>
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
import DialogFolder from '@/components/Dialog/DialogFolder.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import SectionHeader from '@/components/layouts/SectionHeader.vue';

const loading = ref(false);
const router = useRouter(); 
const album = ref([]);
const authStore = useAuthStore();

// Fetch data Album dari API
const FetchAlbum = async () => {
    try {
        loading.value = true;
        const { data } = await customAPI.get('/album-kegiatan');
        album.value = data.data;
    } catch (error) {
        console.error('Failed to fetch album:', error);
    } finally {
        loading.value = false;
    }
};

const showModalAlbum = ref(false);
const editModeAlbum = ref(false);
const selectedAlbum = ref(null);

const openModalAlbum = () => {
    showModalAlbum.value = true;
    editModeAlbum.value = false;
    selectedAlbum.value = null;
};

const openEditModalAlbum = (AlbumItem) => {
    selectedAlbum.value = AlbumItem;
    editModeAlbum.value = true;
    showModalAlbum.value = true;
};

const closeModalAlbum = () => {
    showModalAlbum.value = false;
    selectedAlbum.value = null;
    editModeAlbum.value = false;
};

const handleSavedAlbum = () => {
    FetchAlbum(); 
    closeModalAlbum(); 
};

// DELETE
const handleDelete = async (paramsId) => {
    try {
        await customAPI.post(`/album-kegiatan/${paramsId}?_method=DELETE`, null, {
            headers: { Authorization: `Bearer ${authStore.token}` },
        });

        alert("Album successfully deleted!");
        FetchAlbum();
    } catch (error) {
        console.error('Failed to delete Album:', error);
    }
};

onMounted(() => {
    FetchAlbum();
});

const handleCardClick  = (AlbumID) => {
    if (!authStore.user || authStore.user.role.name !== 'admin') {
        router.push({ name:'DetailAlbum', params: {id: AlbumID} });
    }
}
</script>