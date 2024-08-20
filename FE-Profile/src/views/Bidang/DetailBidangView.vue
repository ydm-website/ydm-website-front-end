<template>
    <div class="py-16 my-10 mx-10">
        <div v-if="loading">
            <LoadingComponent />
        </div>
        <div v-else>
            <div
                class="hero min-h-[200px] lg:min-h-[500px] rounded-lg"
                :style="{ backgroundImage: `url(${DetaillBidang.image})` }"
            >
                <div class="hero-overlay rounded-lg bg-opacity-60 flex items-center justify-center">
                    <div class="hero-content text-neutral-content text-center max-w-[900px]">
                        <h1 class="lg:mb-5 lg:pb-3 text-3xl md:text-5xl lg:text-6xl font-bold">
                            {{ DetaillBidang.name }}
                        </h1>
                    </div>
                </div>
            </div>
            <div class="my-5">
                <SectionHeader :title1="'Bidang'" :route1="'Bidang'" :title2="DetaillBidang.name" :route2="'DetailBidang'" :id2="DetaillBidang.id"/>
            </div>

            <div class="pt-10" v-if="authStore.user && authStore.user.role.name === 'admin'">
                <!-- ADD Detail -->
                <button class="btn btn-md btn-accent mr-2" @click="openModalDetailBidang">
                    <span class="pi pi-plus"></span>
                </button>
                <div class="modal" :class="{ 'modal-open': showModalDetailBidang }">
                    <div class="modal-box">
                        <DialogDetailBidang 
                            @closeModal="closeModalDetailBidang" 
                            :editMode="editModeDetailBidang" 
                            :bidangId="BidangID"
                            :detailBidang="selectedDetailBidang" 
                            @detailBidangSaved="handleSavedDetailBidang" 
                        />
                    </div>
                </div>
            </div>
            
            
            <div v-for="item in detail" :key="item.id">
                <section :id="item.name" class="border shadow-sm rounded-lg my-2" >
                    <div class="my-5 px-10 py-4 rounded-lg flex flex-col items-center lg:flex-row">
                        <div class="lg:w-[400px] flex justify-center">
                            <figure>
                                <img :src="item.image" :alt="item.name" class="h-[180px] w-[250px] rounded-lg">
                            </figure>
                        </div>
                        <div class="flex flex-col w-full">
                            <p class="font-bold text-center lg:text-start text-2xl lg:text-3xl pb-2 break-words">
                                {{ item.name }}
                            </p>
                            <p class="pb-3 leading-relaxed text-justify lg:text-lg">
                                {{ item.deskripsi }}
                            </p>
                            <div class="flex flex-row gap-2 justify-center lg:justify-start">
                                <button 
                                    @click="openEditModalDetailBidang(item)" 
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
                </section>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { customAPI } from '@/api';
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/AuthStore';
import LoadingComponent from '@/components/LoadingComponent.vue';
import DialogDetailBidang from '@/components/Dialog/DialogDetailBidang.vue';
import SectionHeader from '@/components/layouts/SectionHeader.vue';

const DetaillBidang = ref("");
const BidangID = ref("");
const detail = ref([]);
const loading = ref(false);
const route = useRoute();
const authStore = useAuthStore();

const BidangById = async () => {
    try {
        loading.value = true;
        const { data } = await customAPI.get(`/bidang/${route.params.id}`);
        DetaillBidang.value = data.data;
        BidangID.value = data.data.id;
        detail.value = data.data.list_detail;
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    BidangById();
});

// Function to handle delete
const handleDelete = async (paramsId) => {
    try {
        await customAPI.post(`/detail-bidang/${paramsId}?_method=DELETE`, null, {
            headers: { Authorization: `Bearer ${authStore.token}` },
        });

        alert("Detail successfully deleted!");
        await BidangById();
    } catch (error) {
        console.error('Failed to delete:', error);
    }
};

const showModalDetailBidang = ref(false);
const editModeDetailBidang = ref(false);
const selectedDetailBidang = ref(null);

const openModalDetailBidang = () => {
    showModalDetailBidang.value = true;
    editModeDetailBidang.value = false;
    selectedDetailBidang.value = null;
};

const openEditModalDetailBidang = (detailItem) => {
    selectedDetailBidang.value = detailItem;
    editModeDetailBidang.value = true;
    showModalDetailBidang.value = true;
};

const closeModalDetailBidang = () => {
    showModalDetailBidang.value = false;
    selectedDetailBidang.value = null;
    editModeDetailBidang.value = false;
};

const handleSavedDetailBidang = () => {
    BidangById(); 
    closeModalDetailBidang(); 
};
</script>
