<template>
    <div class="py-16 my-10 mx-10">
        <div class="my-5">
            <SectionHeader :title1="'Kontak'" :route1="'Kontak'"/>
        </div>
        <section id="Kontak">
            <div v-if="loading">
                <LoadingComponent />
            </div>
            <div v-else>
                <div v-for="item in kontak" :key="item.id">
                    <button 
                        class="btn btn-sm btn-accent my-4 mx-5" 
                        @click="openEditModalKontak(item)"
                        v-if="authStore.user && authStore.user.role.name === 'admin'"
                    >
                        <span class="pi pi-pencil"></span>
                    </button>
                    <div class="modal" :class="{ 'modal-open': showModalKontak }">
                        <div class="modal-box">
                            <DialogKontak
                                @closeModal="closeModalKontak" 
                                :editMode="editModeKontak" 
                                :data="selectedKontak" 
                                @Saved="handleSavedKontak" 
                            />
                        </div>
                    </div>
                    <div class="grid lg:grid-cols-3 gap-2 lg:gap-20 mx-5 items-center justify-center">
                        <div class="card bg-neutral border shadow-lg items-center text-center">
                            <div class="card-body">
                                <h2 class="text-3xl font-bold text-base-100">Alamat</h2>
                                <p class="text-base-100 text-xl">{{ item.address }}</p>
                            </div>
                        </div>
                        <div class="card bg-neutral border shadow-lg items-center text-center">
                            <div class="card-body">
                                <h2 class="text-3xl font-bold text-base-100">Telepon</h2>
                                <p class="text-base-100 text-xl">{{ item.call }}</p>
                            </div>
                        </div>
                        <div class="card bg-neutral border shadow-lg items-center text-center">
                            <div class="card-body">
                                <h2 class="text-3xl font-bold text-base-100">Email</h2>
                                <p class="text-base-100 text-xl">{{ item.email }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <section id="Lokasi" class="mx-5 my-5 py-10">
                    <div class="card border bg-neutral shadow-lg">
                        <LocationIframe/>
                    </div>
                </section>

                <section id="Kontak Instansi" class="mx-5 my-5 py-10" v-if="authStore.user || other.length > 0">
                    <h1 class="text-4xl font-bold">Kontak Terkait</h1>
                    <hr class="my-1">

                    <button 
                        class="btn btn-sm btn-accent my-4 px-4" 
                        @click="openModalOther"
                        v-if="authStore.user && authStore.user.role.name === 'admin'"
                    >
                        <span class="pi pi-plus"></span>
                    </button>
                    <div class="modal" :class="{ 'modal-open': showModalOther }">
                        <div class="modal-box">
                            <DialogOtherContact
                                @closeModal="closeModalOther" 
                                :editMode="editModeOther" 
                                :data="selectedOther" 
                                @Saved="handleSavedOther" 
                            />
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-2">
                        <div v-for="item in other" :key="item.id">
                            <div class="my-3">
                                <div class="flex flex-col">
                                    <div class="flex flex-row gap-1">
                                        <p class="bg-warning text-warning text-lg rounded-l">-</p>
                                        <h1 class="text-lg font-bold">{{ item.instansi }}</h1>
                                        <button 
                                            @click="openEditModalOther(item)" 
                                            class="ml-3 btn btn-warning btn-sm" 
                                            v-if="authStore.user && authStore.user.role.name === 'admin'"
                                        >
                                            <span class="pi pi-pencil text-neutral-content"></span>
                                        </button>
                                        <button 
                                            @click="handleDelete(item.id)"
                                            class="btn btn-error btn-sm"
                                            v-if="authStore.user && authStore.user.role.name === 'admin'"
                                        >
                                            <span class="pi pi-trash text-neutral-content"></span>
                                        </button>
                                    </div>
                                    
                                    <div class="flex flex-row">
                                        <div class="my-1">
                                            <h1>Address</h1>
                                            <h1>Telp</h1>
                                            <h1>Email</h1>
                                            <h1>Website</h1>
                                        </div>
                                        <div class="mx-3 my-1">
                                            <h1>:</h1>
                                            <h1>:</h1>
                                            <h1>:</h1>
                                            <h1>:</h1>
                                        </div>
                                        <div class="my-1">
                                            <h1>{{ item.address }}</h1>
                                            <h1>{{ item.call }}</h1>
                                            <h1>{{ item.email }}</h1>
                                            <h1>{{ item.website }}</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </section>
            </div>
        </section>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { customAPI } from '@/api';
import { useAuthStore } from '@/stores/AuthStore';
import LoadingComponent from '@/components/LoadingComponent.vue';
import LocationIframe from '@/components/LocationIframe.vue';
import DialogKontak from '@/components/Dialog/DialogKontak.vue';
import DialogOtherContact from '@/components/Dialog/DialogOtherContact.vue';
import SectionHeader from '@/components/layouts/SectionHeader.vue';

const authStore = useAuthStore();
const loading = ref(false);

const kontak = ref("");
const getKontak = async () => {
    try {
        loading.value = true;
        const { data } = await customAPI.get('/kontak');
        kontak.value = data.data;
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
};

const other = ref("");
const getOther = async () => {
    try {
        loading.value = true;
        const { data } = await customAPI.get('/other-contact');
        other.value = data.data;
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    getKontak();
    getOther();
});

const showModalKontak = ref(false);
const editModeKontak = ref(false);
const selectedKontak = ref(null);

const openEditModalKontak = (KontakItem) => {
    selectedKontak.value = KontakItem;  
    editModeKontak.value = true;
    showModalKontak.value = true;
};

const closeModalKontak = () => {
    showModalKontak.value = false;
    selectedKontak.value = null;
    editModeKontak.value = false;
};

const handleSavedKontak = () => {
    getKontak(); 
    closeModalKontak(); 
};

//OTHER HANDLE
const showModalOther = ref(false);
const editModeOther = ref(false);
const selectedOther = ref(null);

const openModalOther = () => {
    showModalOther.value = true;
    editModeOther.value = false;
    selectedOther.value = null;
};

const openEditModalOther = (OtherItem) => {
    selectedOther.value = OtherItem;  
    editModeOther.value = true;
    showModalOther.value = true;
};

const closeModalOther = () => {
    showModalOther.value = false;
    selectedOther.value = null;
    editModeOther.value = false;
};

const handleSavedOther = () => {
    getOther(); 
    closeModalOther(); 
};

// Function to handle delete
const handleDelete = async (paramsId) => {
    try {
        await customAPI.post(`/other-contact/${paramsId}?_method=DELETE`, null, {
            headers: { Authorization: `Bearer ${authStore.token}` },
        });

        alert("Detail successfully deleted!");
        getOther();
    } catch (error) {
        console.error('Failed to delete:', error);
    }
};
</script>