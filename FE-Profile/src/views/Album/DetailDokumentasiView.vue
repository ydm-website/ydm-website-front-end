<template>
    <div class="py-16 my-10 mx-10">
        <div class="my-5">
            <SectionHeader :title1="'Album'" :route1="'Album Kegiatan'" :title2="DetaillAlbum.name" :route2="'DetailAlbum'" :id2="DetaillAlbum.id"/>
        </div>
        <section id="Dokumentasi" >
            <div class="pt-10" v-if="authStore.user && authStore.user.role.name === 'admin'">
                <!-- ADD Detail -->
                <button class="btn btn-md btn-accent mr-2" @click="openModalDokumentasi">
                    <span class="pi pi-plus"></span>
                </button>
                <div class="modal" :class="{ 'modal-open': showModalDokumentasi }">
                    <div class="modal-box">
                        <DialogDokumentasi 
                            @closeModal="closeModalDokumentasi" 
                            :editMode="editModeDokumentasi" 
                            :albumId="DetaillAlbum.id"
                            :dokumentasi="selectedDokumentasi" 
                            @dokumentasiSaved="handleSavedDokumentasi" 
                        />
                    </div>
                </div>
            </div>
            <div v-if="loading">
                <LoadingComponent />
            </div>
            <div v-else class="grid lg:grid-cols-2 gap-3 py-8" >
                <div v-for="item in dokumentasi">
                    <div class="card bg-base-100 border shadow-lg mb-5 max-w-xs mx-auto lg:max-w-full lg:mx-0">
                        <div class="p-3">
                            <h2 class="text-2xl text-center font-bold  break-words">
                                {{ item.title }}
                            </h2>
                        </div>
                        
                        <div class="pb-3">
                            <figure class="px-3">
                                <img :src="item.image" alt="Shoes" class="rounded-lg lg:h-[400px] lg:w-[700px]" />
                            </figure>
                        </div>
                        
                        <div class="px-3">
                            <p class="text-lg leading-relaxed text-justify pb-3 break-words w-full">
                                {{ item.image_caption }}
                            </p>
                        </div>

                        <div class="flex flex-row gap-2 justify-center pb-3">
                            <button 
                                @click="openEditModalDokumentasi(item)" 
                                class="mt-auto bg-warning text-white py-2 px-4 rounded" 
                                v-if="authStore.user && authStore.user.role.name === 'admin'"
                            >
                                <span class="pi pi-pencil"></span>
                            </button>
                            <button 
                                @click="handleDelete(item.id)" 
                                class="mt-auto bg-red-500 text-white py-2 px-4 rounded"
                                v-if="authStore.user && authStore.user.role.name === 'admin'"
                            >
                                <span class="pi pi-trash"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { customAPI } from '@/api';
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/AuthStore';
import LoadingComponent from '@/components/LoadingComponent.vue';
import DialogDokumentasi from '@/components/Dialog/DialogDokumentasi.vue';
import SectionHeader from '@/components/layouts/SectionHeader.vue';

const DetaillAlbum = ref("");
const AlbumID = ref("");
const dokumentasi = ref([]);
const loading = ref(false);
const route = useRoute();
const authStore = useAuthStore();

const AlbumById = async () => {
    try {
        loading.value = true;
        const { data } = await customAPI.get(`/album-kegiatan/${route.params.id}`);
        DetaillAlbum.value = data.data;
        AlbumID.value = data.data.id;
        dokumentasi.value = data.data.list_dokumentasi;
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    AlbumById();
});

// Function to handle delete
const handleDelete = async (paramsId) => {
    try {
        await customAPI.post(`/dokumentasi/${paramsId}?_method=DELETE`, null, {
            headers: { Authorization: `Bearer ${authStore.token}` },
        });

        alert("Detail successfully deleted!");
        await AlbumById();
    } catch (error) {
        console.error('Failed to delete:', error);
    }
};

const showModalDokumentasi = ref(false);
const editModeDokumentasi = ref(false);
const selectedDokumentasi = ref(null);

const openModalDokumentasi = () => {
    showModalDokumentasi.value = true;
    editModeDokumentasi.value = false;
    selectedDokumentasi.value = null;
};

const openEditModalDokumentasi = (detailItem) => {
    selectedDokumentasi.value = detailItem;
    editModeDokumentasi.value = true;
    showModalDokumentasi.value = true;
};

const closeModalDokumentasi = () => {
    showModalDokumentasi.value = false;
    selectedDokumentasi.value = null;
    editModeDokumentasi.value = false;
};

const handleSavedDokumentasi = () => {
    AlbumById(); 
    closeModalDokumentasi(); 
};
</script>