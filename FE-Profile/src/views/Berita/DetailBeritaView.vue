<template>
    <div class="py-16 my-10 mx-10">
        <div class="my-5">
            <SectionHeader :title1="'Berita'" :route1="'Berita'" :title2="headerKategori.name" :route2="'DetailKategori'" :id2="Berita.kategori_id" :title3="Berita.title" :route3="'DetailBerita'" :id3="Berita.id"/>
        </div>
        <section id="Detail Berita">
            <div v-if="loading">
                <LoadingComponent />
            </div>
            <div v-else>
                <div class="card border border-slate-200 shadow-lg">
                    <div class="card-body flex flex-col">
                        <div class="flex flex-row gap-2" v-if="authStore.user && authStore.user.role.name === 'admin'">
                            <button 
                                @click="openEditModalBerita()" 
                                class="btn btn-warning btn-sm" 
                                v-if="authStore.user && authStore.user.role.name === 'admin'"
                            >
                                <span class="pi pi-pencil text-neutral-content"></span>
                            </button>
                            <div class="modal" :class="{ 'modal-open': showModalBerita }">
                                <div class="modal-box">
                                    <DialogBerita 
                                        @closeModal="closeModalBerita" 
                                        :kategori="kategori" 
                                        :editMode="editModeBerita" 
                                        :berita="selectedBerita" 
                                        @beritaSaved="handleSavedBerita" 
                                    />
                                </div>
                            </div>
                            <button 
                                @click="handleDelete(Berita.id)"
                                class="btn btn-error btn-sm"
                                v-if="authStore.user && authStore.user.role.name === 'admin'"
                            >
                                <span class="pi pi-trash text-neutral-content"></span>
                            </button>
                        </div>
                        <h2 class="text-2xl font-bold break-words w-full">
                            {{ Berita.title }}
                        </h2>
                        
                        <p class="text-xs">
                            <span class="pi pi-user"></span> {{ Berita.author }}
                        </p>
                        <hr>
                        <figure class="rounded-lg">
                            <img :src="Berita.image" :alt="Berita.title" 
                                class="w-full object-cover rounded-lg h-[300px] lg:h-[400px]" 
                            />
                        </figure>
                        <p class="leading-relaxed text-justify">{{ Berita.content }}</p>
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
import DialogBerita from '@/components/Dialog/DialogBerita.vue';
import SectionHeader from '@/components/layouts/SectionHeader.vue';

const Berita = ref("");
const loading = ref(false);
const route = useRoute();
const authStore = useAuthStore();
const router = useRouter();
const headerKategori = ref("");

const BeritaById = async () => {
    try {
        loading.value = true;
        const { data } = await customAPI.get(`/berita/${route.params.id}`);
        Berita.value = data.data;
        console.log(Berita);
        headerKategori.value = data.data.kategori;
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    BeritaById();
    AllKategori();
});

// Function to handle delete
const handleDelete = async (paramsId) => {
    try {
        await customAPI.post(`/berita/${paramsId}?_method=DELETE`, null, {
            headers: { Authorization: `Bearer ${authStore.token}` },
        });

        alert("Detail successfully deleted!");
        router.push({ name: 'Berita' });
    } catch (error) {
        console.error('Failed to delete:', error);
    }
};

const kategori = ref([]);

// Fetch semua data kategori ketgori dari API
const AllKategori = async() => {
    const {data} = await customAPI.get('/kategori-berita');
    kategori.value = data.data;
};

const showModalBerita = ref(false);
const editModeBerita = ref(false);
const selectedBerita = ref(null);

const openEditModalBerita = () => {
    selectedBerita.value = Berita.value;
    editModeBerita.value = true;
    showModalBerita.value = true;
};

const closeModalBerita = () => {
    showModalBerita.value = false;
    selectedBerita.value = null;
    editModeBerita.value = false;
};

const handleSavedBerita = () => {
    BeritaById(); 
    closeModalBerita(); 
};
</script>