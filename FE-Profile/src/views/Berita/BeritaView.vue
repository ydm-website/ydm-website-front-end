<template>
    <div class="py-16 my-10 mx-10">
        <div class="my-5">
            <SectionHeader :title1="'Berita'" :route1="'Berita'"/>
        </div>

        <section id="Berita">
            <div class="pt-10" v-if="authStore.user && authStore.user.role.name === 'admin'">
                <!-- ADD BERITA -->
                <button class="btn btn-md btn-accent mr-2" @click="openModalBerita">
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

                <!-- ADD Kategori -->
                <button class="btn btn-md mr-2" @click="openModalKategori">
                    <span class="pi pi-plus"></span> Kategori
                </button>
                <div class="modal" :class="{ 'modal-open': showModalKategori }">
                    <div class="modal-box">
                        <DialogNameInput
                            @closeModal="closeModalKategori" 
                            :editMode="editModeKategori" 
                            :data="selectedKategori" 
                            form="kategori"
                            @Saved="handleSavedKategori" 
                        />
                    </div>
                </div>
            </div>
            
            <div v-if="loading">
                <LoadingComponent />
            </div>
            <div v-else>
                <div v-for="({ kategoriName, kategoriId, berita }) in groupBerita" :key="kategoriId">
                    <section :id="kategoriName" class="py-5 my-2 border shadow-sm pt-2 px-2 rounded-lg">
                        <div class="mb-3 flex flex-row gap-3 items-center">
                            <div class="flex flex-row gap-1">
                                <p class="bg-warning text-warning text-xl rounded-l">-</p>
                                <h1 class="text-3xl font-bold">{{ kategoriName }}</h1>
                            </div>
                            <div class="text-right">
                                <RouterLink 
                                    :to="{ name: 'DetailKategori', params: { id: kategoriId } }" 
                                    class="btn btn-sm btn-secondary"
                                >
                                    Lihat semua
                                </RouterLink>
                            </div>
                        </div>
                        
                        <div class="carousel w-full h-[550px]">
                            <div v-for="(beritaItem, index) in berita" :key="beritaItem.id" class="carousel-item flex justify-center items-center my-2">
                                <div class="card bg-base-100 border border-slate-200 mr-2 shadow-lg w-[400px] h-full">
                                    <figure class="m-2 rounded-lg h-[200px] lg:h-[200px]">
                                        <img :src="beritaItem.image" :alt="beritaItem.title" 
                                            class="w-full object-cover rounded-lg h-[300px] lg:h-[400px]" 
                                        />
                                    </figure>
                                    <div class="card-body pt-2 px-0 items-center text-center">
                                        <h2 class="card-title" v-if="beritaItem.title.length >30">
                                            {{ beritaItem.title.substring(0, 29) }}....
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
                                        <div v-if="beritaItem.content.length >255">
                                            <p class="px-3 leading-relaxed text-justify">
                                                {{ beritaItem.content.substring(0, 255) }}. . . .
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
                    </section>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { customAPI } from '@/api';
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/AuthStore';
import { format } from 'date-fns';
import LoadingComponent from '@/components/LoadingComponent.vue';
import DialogBerita from '@/components/Dialog/DialogBerita.vue';
import DialogNameInput from '@/components/Dialog/DialogNameInput.vue';
import SectionHeader from '@/components/layouts/SectionHeader.vue';

const berita = ref([]);
const loading = ref(false);
const authStore = useAuthStore();

const formatDate = (date) => {
    return format(new Date(date), 'dd-MM-yyyy HH:mm:ss');
};

// Fetch data berita dari API
const FetchBerita = async () => {
    try {
        loading.value = true;
        const { data } = await customAPI.get('/berita');
        berita.value = data.data;
    } catch (error) {
        console.error('Failed to fetch berita:', error);
    } finally {
        loading.value = false;
    }
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

// Grouping Berita berdasarkan kategori dan mengurutkan berdasarkan tanggal
const groupBerita = computed(() => {
    const BeritaMap = new Map();
    
    berita.value.forEach(BeritaItem => {
        const kategoriName = BeritaItem.kategori.name;
        const kategoriId = BeritaItem.kategori.id;
        
        if (!BeritaMap.has(kategoriName)) {
            BeritaMap.set(kategoriName, {
                id: kategoriId,
                berita: []
            });
        }
        
        BeritaMap.get(kategoriName).berita.push(BeritaItem);
    });
    
    return Array.from(BeritaMap.entries()).map(([kategoriName, { id, berita }]) => {
        const sortedBeritaInKategori = berita.slice().sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
        });

        // Batasi berita menjadi maksimal 2
        const limitedBerita = sortedBeritaInKategori.slice(0, 10);

        return { kategoriName, kategoriId: id, berita: limitedBerita };
    });
});

const kategori = ref([]);

// Fetch semua data kategori ketgori dari API
const AllKategori = async() => {
    const {data} = await customAPI.get('/kategori-berita');
    kategori.value = data.data;
};

// DELETE
const handleDelete = async (paramsId) => {
    try {
        await customAPI.post(`/berita/${paramsId}?_method=DELETE`, null, {
            headers: { Authorization: `Bearer ${authStore.token}` },
        });

        alert("Berita successfully deleted!");
        FetchBerita();
    } catch (error) {
        console.error('Failed to delete berita:', error);
    }
};

onMounted(() => {
    FetchBerita();
    AllKategori();
});

const showModalKategori = ref(false);
const editModeKategori = ref(false);
const selectedKategori = ref(null);

const openModalKategori = () => {
    showModalKategori.value = true;
    editModeKategori.value = false;
    selectedKategori.value = null;
};

const closeModalKategori = () => {
    showModalKategori.value = false;
    selectedKategori.value = null;
    editModeKategori.value = false;
};

const handleSavedKategori = () => {
    AllKategori(); 
    closeModalKategori(); 
};
</script>
