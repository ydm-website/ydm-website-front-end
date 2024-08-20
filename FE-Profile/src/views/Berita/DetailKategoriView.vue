<template>
    <div class="py-16 my-10 mx-10">
        <div class="mt-5 mb-6">
            <SectionHeader :title1="'Berita'" :route1="'Berita'" :title2="category.name" :route2="'DetailKategori'" :id2="category.id"/>
        </div>
        <section id="Berita" >
            <div v-if="loading">
                <LoadingComponent />
            </div>
            <div v-else>
                <!-- ADD BERITA -->
                <button 
                    class="btn btn-md btn-accent mt-3 mr-2" 
                    @click="openModalBerita"
                    v-if="authStore.user && authStore.user.role.name === 'admin'"
                >
                    <span class="pi pi-plus"></span>
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
                <div class="grid gap-2 lg:grid-cols-2 my-3">
                    <div v-for="beritaItem in category.list_berita" :key="beritaItem.id">
                        <div class="card bg-base-100 border border-slate-200 shadow-lg ">
                            <figure class="p-3 rounded-lg">
                                <img :src="beritaItem.image" :alt="beritaItem.title" 
                                    class="w-full object-cover rounded-lg h-[200px] lg:h-[300px]" 
                                />
                            </figure>
                            <div class="card-body pt-2 px-0 items-center text-center">
                                <h2 class="card-title" v-if="beritaItem.title.length >58">
                                    {{ beritaItem.title.substring(0, 58) }}....
                                </h2>
                                <h2 class="card-title" v-else>
                                    {{ beritaItem.title }}
                                </h2>
                                <div class="flex flex-row gap-5 items-center">
                                    <p class="text-xs">
                                        <span class="pi pi-user mr-1"></span> {{ beritaItem.author }}
                                    </p>
                                    <p class="text-xs">
                                        <span class="pi pi-clock ml-1"></span> {{ formatDate(beritaItem.created_at) }}
                                    </p>
                                </div>
                                <div v-if="beritaItem.content.length >280">
                                    <p class="px-3 leading-relaxed text-justify">
                                        {{ beritaItem.content.substring(0, 280) }}. . . .
                                        <RouterLink 
                                            :to="{ name: 'DetailBerita', params: { id: beritaItem.id } }" 
                                            class="text-blue-600"
                                        >
                                            selengkapnya
                                        </RouterLink>
                                    </p>
                                </div>
                                <div v-else>
                                    <p class="px-3 leading-relaxed text-justify">{{ beritaItem.content }}</p>
                                </div>

                                <div class="card-actions grid grid-cols-2 gap-1 justify-center">
                                    <button 
                                        @click="openEditModalBerita(beritaItem)" 
                                        class="btn btn-warning btn-sm" 
                                        v-if="authStore.user && authStore.user.role.name === 'admin'"
                                    >
                                        <span class="pi pi-pencil text-neutral-content"></span>
                                    </button>
                                    <button 
                                        @click="handleDelete(beritaItem.id)"
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
import { useRoute } from 'vue-router';
import { format } from 'date-fns';
import { useAuthStore } from '@/stores/AuthStore';
import LoadingComponent from '@/components/LoadingComponent.vue';
import DialogBerita from '@/components/Dialog/DialogBerita.vue';
import SectionHeader from '@/components/layouts/SectionHeader.vue';

const loading = ref(false);
const route = useRoute();
const category = ref("")
const authStore = useAuthStore();

const formatDate = (date) => {
    return format(new Date(date), 'dd-MM-yyyy HH:mm:ss');
};

const CategoryById = async ()=> {
    try {
        loading.value = true;
        const {data} = await customAPI.get(`/kategori-berita/${route.params.id}`);
        category.value = data.data;   
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    CategoryById();
    AllKategori();
})

const kategori = ref([]);

// Fetch semua data kategori ketgori dari API
const AllKategori = async() => {
    const {data} = await customAPI.get('/kategori-berita');
    kategori.value = data.data;
};

const showModalBerita = ref(false);
const editModeBerita = ref(false);
const selectedBerita = ref(null);

const openModalBerita = () => {
    showModalBerita.value = true;
    editModeBerita.value = false;
    selectedBerita.value = null;
};

const openEditModalBerita = (BeritaItem) => {
    selectedBerita.value = BeritaItem;
    editModeBerita.value = true;
    showModalBerita.value = true;
};

const closeModalBerita = () => {
    showModalBerita.value = false;
    selectedBerita.value = null;
    editModeBerita.value = false;
};

const handleSavedBerita = () => {
    FetchBerita(); 
    closeModalBerita(); 
};
</script>