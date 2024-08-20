<template>
    <div class="py-16 my-10 mx-10">
            <SectionHeader :title1="'Pengurus'" :route1="'Pengurus'"/>
        <section id="pengurus">
            <div class="pt-10" v-if="authStore.user && authStore.user.role.name === 'admin'">
                <!-- ADD PENGURUS -->
                <button class="btn btn-md btn-accent mr-2" @click="openModalPengurus">
                    <span class="pi pi-plus"></span>
                </button>
                <div class="modal" :class="{ 'modal-open': showModalPengurus }">
                    <div class="modal-box">
                        <DialogPengurus 
                            @closeModal="closeModalPengurus" 
                            :peran="peran" 
                            :editMode="editModePengurus" 
                            :pengurus="selectedPengurus" 
                            @pengurusSaved="handleSavedPengurus" 
                        />
                    </div>
                </div>
            </div>
            
            <div v-if="loading">
                <LoadingComponent />
            </div>
            <div v-else>
                <div v-for="([peranName, pengurusInPeran]) in groupPengurus" :key="peranName">
                    <section :id="peranName" class="py-7">
                        <div class="flex flex-row gap-0.5 mb-2">
                            <p class="bg-warning text-warning text-2xl rounded-l">-</p>
                            <h2 class="text-2xl font-bold">{{ peranName }}</h2>
                        </div>
                        
                        <div class="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            <div v-for="pengurusItem in pengurusInPeran" :key="pengurusItem.id">
                                <div class="card bg-base-100 border border-slate-200 shadow-lg sm:w-[190px] md:w-[210px] lg:w-[300px]">
                                    <figure class="m-2 h-[400px] sm:h-[270px] lg:h-[372px]">
                                        <img :src="pengurusItem.image" :alt="pengurusItem.name" 
                                            class="w-full object-cover h-[400px] sm:h-[270px] lg:h-[372px] rounded-lg" 
                                        />
                                    </figure>
                                    <div class="card-body pt-2 px-0 items-center text-center">
                                        <h2 class="card-title">
                                            {{ pengurusItem.name }}
                                        </h2>
                                        <p>{{ pengurusItem.jabatan }}</p>

                                        <div class="card-actions grid grid-cols-2 gap-1 justify-center">
                                            <button 
                                                @click="openEditModalPengurus(pengurusItem)" 
                                                class="btn btn-warning btn-sm" 
                                                v-if="authStore.user && authStore.user.role.name === 'admin'"
                                            >
                                                <span class="pi pi-pencil text-neutral-content"></span>
                                            </button>
                                            <button 
                                                @click="handleDelete(pengurusItem.id)"
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
import LoadingComponent from '@/components/LoadingComponent.vue';
import DialogPengurus from '@/components/Dialog/DialogPengurus.vue';
import SectionHeader from '@/components/layouts/SectionHeader.vue';

const pengurus = ref([]);
const loading = ref(false);
const authStore = useAuthStore();

// Fetch data pengurus dari API
const FetchPengurus = async () => {
    try {
        loading.value = true;
        const { data } = await customAPI.get('/pengurus');
        pengurus.value = data.data;
    } catch (error) {
        console.error('Failed to fetch pengurus:', error);
    } finally {
        loading.value = false;
    }
};

const showModalPengurus = ref(false);
const editModePengurus = ref(false);
const selectedPengurus = ref(null);

const openModalPengurus = () => {
    showModalPengurus.value = true;
    editModePengurus.value = false;
    selectedPengurus.value = null;
};

const openEditModalPengurus = (pengurusItem) => {
    selectedPengurus.value = pengurusItem;
    editModePengurus.value = true;
    showModalPengurus.value = true;
};

const closeModalPengurus = () => {
    showModalPengurus.value = false;
    selectedPengurus.value = null;
    editModePengurus.value = false;
};

const handleSavedPengurus = () => {
    FetchPengurus(); 
    closeModalPengurus(); 
};

// Grouping pengurus berdasarkan peran dan mengurutkan berdasarkan tanggal
const groupPengurus = computed(() => {
    const pengurusMap = new Map();
    
    pengurus.value.forEach(pengurusItem => {
        if (!pengurusMap.has(pengurusItem.peran.name)) {
            pengurusMap.set(pengurusItem.peran.name, []);
        }
        pengurusMap.get(pengurusItem.peran.name).push(pengurusItem);
    });
    
    return Array.from(pengurusMap.entries()).map(([peranName, pengurusInPeran]) => {
        const sortedPengurusInPeran = pengurusInPeran.slice().sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
        });
        return [peranName, sortedPengurusInPeran];
    });
});

const peran = ref([]);

// Fetch semua data peran pengurus dari API
const AllPeran = async() => {
    const {data} = await customAPI.get('/peran-pengurus');
    peran.value = data.data;
};

// DELETE
const handleDelete = async (paramsId) => {
    try {
        await customAPI.post(`/pengurus/${paramsId}?_method=DELETE`, null, {
            headers: { Authorization: `Bearer ${authStore.token}` },
        });

        alert("Pengurus successfully deleted!");
        FetchPengurus();
    } catch (error) {
        console.error('Failed to delete pengurus:', error);
    }
};

onMounted(() => {
    FetchPengurus();
    AllPeran();
});
</script>
