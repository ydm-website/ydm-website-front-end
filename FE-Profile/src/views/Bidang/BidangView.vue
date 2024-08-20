<template>
    <div class="py-16 my-10 mx-10">
        <SectionHeader :title1="'Bidang'" :route1="'Bidang'"/>
        <section id="Bidang">
            <div class="pt-10" v-if="authStore.user && authStore.user.role.name === 'admin'">
                <!-- ADD BIDANG -->
                <button class="btn btn-md btn-accent mr-2" @click="openModalBidang">
                    <span class="pi pi-plus"></span>
                </button>
                <div class="modal" :class="{ 'modal-open': showModalBidang }">
                    <div class="modal-box">
                        <DialogFolder 
                            @closeModal="closeModalBidang" 
                            :editMode="editModeBidang" 
                            :data="selectedBidang" 
                            form="bidang"
                            @Saved="handleSavedBidang" 
                        />
                    </div>
                </div>
            </div>
            
            <div v-if="loading">
                <LoadingComponent />
            </div>
            <div v-else>
                <div class="my-5 py-5 grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    <div v-for="bidangItem in bidang" :key="bidangItem.id">
                        <div 
                            class="card image-full border border-slate-200 shadow-xl h-[170px] sm:w-[190px] md:w-[210px] lg:w-[250px]"
                            @click="handleCardClick(bidangItem.id)"
                        >
                            <figure>
                                <img :src="bidangItem.image" :alt="bidangItem.name" 
                                    class="w-full object-cover" 
                                />
                            </figure>
                            <div class="card-body flex flex-col items-center justify-center">
                                <h2 class="card-title text-center">
                                    {{ bidangItem.name }}
                                </h2>

                                <div class="card-actions grid grid-cols-3 gap-1 justify-center">
                                    <RouterLink 
                                        :to="{ name:'DetailBidang', params: {id: bidangItem.id} }" 
                                        class="btn btn-info btn-sm"
                                        v-if="authStore.user && authStore.user.role.name === 'admin'"
                                    >
                                        <span class="pi pi-eye text-neutral-content"></span>
                                    </RouterLink>
                                    <button 
                                        @click="openEditModalBidang(bidangItem)" 
                                        class="btn btn-warning btn-sm" 
                                        v-if="authStore.user && authStore.user.role.name === 'admin'"
                                    >
                                        <span class="pi pi-pencil text-neutral-content"></span>
                                    </button>
                                    <button 
                                        @click="handleDelete(bidangItem.id)"
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
const bidang = ref([]);
const authStore = useAuthStore();

// Fetch data bidang dari API
const FetchBidang = async () => {
    try {
        loading.value = true;
        const { data } = await customAPI.get('/bidang');
        bidang.value = data.data;
    } catch (error) {
        console.error('Failed to fetch bidang:', error);
    } finally {
        loading.value = false;
    }
};

const showModalBidang = ref(false);
const editModeBidang = ref(false);
const selectedBidang = ref(null);

const openModalBidang = () => {
    showModalBidang.value = true;
    editModeBidang.value = false;
    selectedBidang.value = null;
};

const openEditModalBidang = (bidangItem) => {
    selectedBidang.value = bidangItem;
    editModeBidang.value = true;
    showModalBidang.value = true;
};

const closeModalBidang = () => {
    showModalBidang.value = false;
    selectedBidang.value = null;
    editModeBidang.value = false;
};

const handleSavedBidang = () => {
    FetchBidang(); 
    closeModalBidang(); 
};

// DELETE
const handleDelete = async (paramsId) => {
    try {
        await customAPI.post(`/bidang/${paramsId}?_method=DELETE`, null, {
            headers: { Authorization: `Bearer ${authStore.token}` },
        });

        alert("Bidang successfully deleted!");
        FetchBidang();
    } catch (error) {
        console.error('Failed to delete Bidang:', error);
    }
};

onMounted(() => {
    FetchBidang();
});

const handleCardClick  = (BidangID) => {
    if (!authStore.user || authStore.user.role.name !== 'admin') {
        router.push({ name:'DetailBidang', params: {id: BidangID} });
    }
}
</script>