<template>
    <div class="py-16 my-10 mx-10">
        <SectionHeader :title1="'Profil'" :route1="'Profil'"/>
        <section id="Pendahuluan">
            <div v-if="loading">
                <LoadingComponent />
            </div>
            <div v-else>
                <div 
                    class="flex flex-col"
                    v-for="item in profil" :key="item.id"
                >
                    <div class="mt-5">
                        <button 
                            @click="openEditModalProfil(item)" 
                            class="mt-auto bg-warning text-white py-2 px-3 rounded hover:bg-base-200 hover:text-neutral" 
                            v-if="authStore.user && authStore.user.role.name === 'admin'"
                        >
                            <span class="pi pi-pencil"></span>
                        </button>
                        <div class="modal" :class="{ 'modal-open': showModalProfil }">
                            <div class="modal-box">
                                <DialogProfil 
                                    @closeModal="closeModalProfil" 
                                    :editMode="editModeProfil" 
                                    :hero="selectedProfil" 
                                    @heroSaved="handleSavedProfil" 
                                />
                            </div>
                        </div>
                    </div>
                    <div class="clear
                    px-5 pb-4 flex flex-col items-center lg:flex-row gap-3" >
                        <div class="lg:w-[350rem]">
                            <img :src="item.image" alt="" class="lg:h-[80vh] lg:w-[400vh] mx-auto">
                        </div>
                        <div>
                            <p class="pb-3 lg:pr-4 leading-relaxed text-justify">
                                {{ item.deskripsi }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <section id="visi_misi" class="mb-5 pt-2 px-2 ">
            <div class="my-5 px-5 rounded-lg flex flex-col items-center lg:flex-row gap-3">
                <div class="flex flex-col">
                    <h1 class="font-bold text-2xl lg:text-5xl pb-2 text-center">Visi dan Misi</h1>
                    <img :src="visimisiImage" alt="" class="lg:h-[300px] lg:w-[420px] mx-auto">
                </div>
                <div role="tablist" class="tabs tabs-lifted">
                    <input type="radio" name="my_tabs_2" role="tab" class="tab" aria-label="Visi" checked="checked"/>
                    <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6 lg:h-[380px]">
                        <div class="overflow-x-auto py-5">
                            <p>BERIKHTIAR SELURUH KEGIATAN  MENJADIKAN  MANUSIA  YANG BERMANFA’AT BUAT SIAPAPUN.</p>
                        </div>
                    </div>
                    <input type="radio" name="my_tabs_2" role="tab" class="tab" aria-label="Misi" />
                    <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6 lg:h-[380px]">
                        <div class="overflow-x-auto py-5">
                            <ol>
                                <li v-for="item in misi" :key="item.id" class="py-2">
                                    {{ item.id }}. {{ item.content }}
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
<script setup>
    import { storeToRefs } from 'pinia';
    import { useMisiStore } from '@/stores/MisiStore';
    import { ref, onMounted } from 'vue';
    import { customAPI } from '@/api';
    import { useAuthStore } from '@/stores/AuthStore';
    import SectionHeader from '@/components/layouts/SectionHeader.vue';
    import DialogProfil from '@/components/Dialog/DialogProfil.vue';
    import LoadingComponent from '@/components/LoadingComponent.vue';
    import visimisiImage from '@/assets/visi-misi-1.png';

    const MisiStore = useMisiStore();
    const { misi } = storeToRefs(MisiStore);
    const authStore = useAuthStore();
    const loading = ref(false);

    onMounted(()=>{
        AllProfil();
    })

    const profil = ref([]);
    const AllProfil = async () => {
        try {
            loading.value = true;
            const { data } = await customAPI.get('/profil');
            profil.value = data.data;
        } catch (error) {
            console.error('Failed to fetch profil:', error);
        } finally {
            loading.value = false;
        }
    };

    // EDIT profil
    const showModalProfil = ref(false);
    const editModeProfil = ref(false);
    const selectedProfil = ref(null);

    const openEditModalProfil = (ProfilItem) => {
        selectedProfil.value = ProfilItem;  
        editModeProfil.value = true;
        showModalProfil.value = true;
    };

    const closeModalProfil = () => {
        showModalProfil.value = false;
        selectedProfil.value = null;
        editModeProfil.value = false;
    };

    const handleSavedProfil = () => {
        AllProfil(); 
        closeModalProfil(); 
    };
</script>