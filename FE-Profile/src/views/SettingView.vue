<template>
    <div class="py-16 my-10 mx-10">
        <div class="my-5">
            <SectionHeader :title1="'Setting'" :route1="'Setting'"/>
        </div>
        <div v-if="loading">
            <LoadingComponent />
        </div>
        <div v-else>
            <div class="flex flex-col lg:flex-row lg:gap-10 justify-center">
                <section id="Role" class="border shadow-sm mb-5 pt-2 px-2 rounded-lg lg:h-[400px] lg:w-[400px]">
                    <h1 class="text-neutral border rounded-lg shadow-sm font-bold text-4xl py-4 text-center">Role</h1>

                    <!-- ADD Role -->
                    <button class="btn btn-sm btn-accent mt-4 mx-5" @click="openModalRole">
                        <span class="pi pi-plus"></span>
                    </button>
                    <div class="modal" :class="{ 'modal-open': showModalRole }">
                        <div class="modal-box">
                            <DialogNameInput
                                @closeModal="closeModalRole" 
                                :editMode="editModeRole" 
                                :data="selectedRole" 
                                form="role"
                                @Saved="handleSavedRole" 
                            />
                        </div>
                    </div>
                    
                    <div class="overflow-x-auto px-5 py-5">
                        <div class="h-[280px] overflow-y-auto">
                            <table class="table table-xs table-pin-rows">
                                <thead>
                                    <tr class="text-center">
                                        <th>#</th>
                                        <td>Name</td>
                                        <td>Aksi</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in roles" :key="item.id" class="text-center">
                                        <th>{{ index + 1 }}</th>
                                        <td class="w-[150px]">{{ item.name }}</td>
                                        <td>
                                            <div class="flex flex-row gap-2 justify-center">
                                                <button 
                                                    @click="openEditModalRole(item)" 
                                                    class="mt-auto bg-warning text-white py-2 px-4 rounded hover:bg-base-200 hover:text-neutral" 
                                                    v-if="authStore.user && authStore.user.role.name === 'admin'"
                                                >
                                                    <span class="pi pi-pencil"></span>
                                                </button>
                                                <button 
                                                    @click="handleDeleteRole(item.id)" 
                                                    class="mt-auto bg-red-500 text-white py-2 px-4 rounded hover:bg-base-200 hover:text-neutral"
                                                    v-if="authStore.user && authStore.user.role.name === 'admin'"
                                                >
                                                    <span class="pi pi-trash"></span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <section id="Peran" class="border shadow-sm mb-5 pt-2 px-2 rounded-lg lg:h-[400px] lg:w-[400px]">
                    <h1 class="text-neutral border rounded-lg shadow-sm font-bold text-4xl py-4 text-center">Peran Pengurus</h1>

                    <!-- ADD Peran -->
                    <button class="btn btn-sm btn-accent mt-4 mx-5" @click="openModalPeran">
                        <span class="pi pi-plus"></span>
                    </button>
                    <div class="modal" :class="{ 'modal-open': showModalPeran }">
                        <div class="modal-box">
                            <DialogNameInput
                                @closeModal="closeModalPeran" 
                                :editMode="editModePeran" 
                                :data="selectedPeran" 
                                form="peran"
                                @Saved="handleSavedPeran" 
                            />
                        </div>
                    </div>
                    
                    <div class="overflow-x-auto px-5 py-5">
                        <div class="h-[280px] overflow-y-auto">
                            <table class="table table-xs table-pin-rows">
                                <thead>
                                    <tr class="text-center">
                                        <th>#</th>
                                        <td>Name</td>
                                        <td>Aksi</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in peran" :key="item.id" class="text-center">
                                        <th>{{ index + 1 }}</th>
                                        <td class="w-[150px]">{{ item.name }}</td>
                                        <td>
                                            <div class="flex flex-row gap-2 justify-center">
                                                <button 
                                                    @click="openEditModalPeran(item)" 
                                                    class="mt-auto bg-warning text-white py-2 px-4 rounded hover:bg-base-200 hover:text-neutral" 
                                                    v-if="authStore.user && authStore.user.role.name === 'admin'"
                                                >
                                                    <span class="pi pi-pencil"></span>
                                                </button>
                                                <button 
                                                    @click="handleDeletePeran(item.id)" 
                                                    class="mt-auto bg-red-500 text-white py-2 px-4 rounded hover:bg-base-200 hover:text-neutral"
                                                    v-if="authStore.user && authStore.user.role.name === 'admin'"
                                                >
                                                    <span class="pi pi-trash"></span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <section id="Kategori" class="border shadow-sm mb-5 pt-2 px-2 rounded-lg lg:h-[400px] lg:w-[400px]">
                    <h1 class="text-neutral border rounded-lg shadow-sm font-bold text-4xl py-4 text-center">Kategori Berita</h1>

                    <!-- ADD Kategori -->
                    <button class="btn btn-sm btn-accent mt-4 mx-5" @click="openModalKategori">
                        <span class="pi pi-plus"></span>
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
                    
                    <div class="overflow-x-auto px-5 py-5">
                        <div class="h-[280px] overflow-y-auto">
                            <table class="table table-xs table-pin-rows">
                                <thead>
                                    <tr class="text-center">
                                        <th>#</th>
                                        <td>Name</td>
                                        <td>Aksi</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in kategori" :key="item.id" class="text-center">
                                        <th>{{ index + 1 }}</th>
                                        <td class="w-[150px]">{{ item.name }}</td>
                                        <td>
                                            <div class="flex flex-row gap-2 justify-center">
                                                <button 
                                                    @click="openEditModalKategori(item)" 
                                                    class="mt-auto bg-warning text-white py-2 px-4 rounded hover:bg-base-200 hover:text-neutral" 
                                                    v-if="authStore.user && authStore.user.role.name === 'admin'"
                                                >
                                                    <span class="pi pi-pencil"></span>
                                                </button>
                                                <button 
                                                    @click="handleDeleteKategori(item.id)" 
                                                    class="mt-auto bg-red-500 text-white py-2 px-4 rounded hover:bg-base-200 hover:text-neutral"
                                                    v-if="authStore.user && authStore.user.role.name === 'admin'"
                                                >
                                                    <span class="pi pi-trash"></span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
            <div class="flex flex-col lg:flex-row gap-5 lg:mx-8 justify-center">
                <section id="User" class="border shadow-sm mb-5 pt-2 px-2 rounded-lg lg:h-[400px] lg:w-[680px]">
                    <h1 class="text-neutral border rounded-lg shadow-sm font-bold text-4xl py-4 text-center">User</h1>

                    <!-- ADD User -->
                    <button class="btn btn-sm btn-accent mt-4 mx-5" @click="openModalUser">
                        <span class="pi pi-plus"></span>
                    </button>
                    <div class="modal" :class="{ 'modal-open': showModalUser }">
                        <div class="modal-box">
                            <DialogUser 
                                @closeModal="closeModalUser"
                                :user="selectedUser" 
                                :role="roles"
                                @UserSaved="handleSavedUser" 
                            />
                        </div>
                    </div>
                    
                    <div class="overflow-x-auto px-5 py-5">
                        <div class="h-[280px] overflow-y-auto">
                            <table class="table table-xs table-pin-rows">
                                <thead>
                                    <tr class="text-center">
                                        <th>#</th>
                                        <td>Name</td>
                                        <td>Email</td>
                                        <td>Role</td>
                                        <td>Aksi</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in users" :key="item.id" class="text-center">
                                        <th>{{ index + 1 }}</th>
                                        <td>{{ item.name }}</td>
                                        <td>{{ item.email }}</td>
                                        <td>{{ item.role.name }}</td>
                                        <td>
                                            <button 
                                                @click="handleDeleteUser(item.id)" 
                                                class="mt-auto bg-red-500 text-white py-2 px-4 rounded hover:bg-base-200 hover:text-neutral"
                                                v-if="authStore.user && authStore.user.role.name === 'admin'"
                                            >
                                                <span class="pi pi-trash"></span>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
                <section id="Video" class="border shadow-sm mb-5 pt-2 px-2 rounded-lg lg:h-[400px] lg:w-[680px]">
                    <h1 class="text-neutral border rounded-lg shadow-sm font-bold text-4xl py-4 text-center">Video</h1>

                    <!-- ADD Video -->
                    <button class="btn btn-sm btn-accent mt-4 mx-5" @click="openModalVideo">
                        <span class="pi pi-plus"></span>
                    </button>
                    <div class="modal" :class="{ 'modal-open': showModalVideo }">
                        <div class="modal-box">
                            <DialogKonten
                                @closeModal="closeModalVideo" 
                                :editMode="editModeVideo" 
                                :data="selectedVideo" 
                                form="video"
                                @Saved="handleSavedVideo" 
                            />
                        </div>
                    </div>
                    
                    <div class="overflow-x-auto px-5 py-5">
                        <div class="h-[280px] overflow-y-auto">
                            <table class="table table-xs table-pin-rows">
                                <thead>
                                    <tr class="text-center">
                                        <th>#</th>
                                        <td>Title</td>
                                        <td>URL</td>
                                        <td>Aksi</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in video" :key="item.id" class="text-center">
                                        <th>{{ index + 1 }}</th>
                                        <td class="w-[150px]">{{ item.title }}</td>
                                        <td class="w-[150px] text-blue-500">
                                            <a :href="item.url" target="_blank">{{ item.url }}</a>
                                        </td>
                                        <td>
                                            <div class="flex flex-row gap-2 justify-center">
                                                <button 
                                                    @click="openEditModalVideo(item)" 
                                                    class="mt-auto bg-warning text-white py-2 px-4 rounded hover:bg-base-200 hover:text-neutral" 
                                                    v-if="authStore.user && authStore.user.role.name === 'admin'"
                                                >
                                                    <span class="pi pi-pencil"></span>
                                                </button>
                                                <button 
                                                    @click="handleDeleteVideo(item.id)" 
                                                    class="mt-auto bg-red-500 text-white py-2 px-4 rounded hover:bg-base-200 hover:text-neutral"
                                                    v-if="authStore.user && authStore.user.role.name === 'admin'"
                                                >
                                                    <span class="pi pi-trash"></span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup>
import { customAPI } from '@/api';
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/AuthStore';
import LoadingComponent from '@/components/LoadingComponent.vue';
import DialogUser from '@/components/Dialog/DialogUser.vue';
import DialogNameInput from '@/components/Dialog/DialogNameInput.vue';
import DialogKonten from '@/components/Dialog/DialogKonten.vue';
import SectionHeader from '@/components/layouts/SectionHeader.vue';

const authStore = useAuthStore();
const loading = ref(false);

onMounted(() => {
    FetchRole();
    FetchUser();
    FetchPeran();
    FetchVideo();
    FetchKategori();
});

// KATEGORI BERITA
const kategori = ref([]);
const FetchKategori = async () => {
    try {
        loading.value = true;
        const { data } = await customAPI.get('/kategori-berita', {
            headers: { Authorization: `Bearer ${authStore.token}` },
        });
        kategori.value = data.data;
    } catch (error) {
        console.error('Failed to fetch role:', error);
    } finally {
        loading.value = false;
    }
};

const showModalKategori = ref(false);
const editModeKategori = ref(false);
const selectedKategori = ref(null);

const openModalKategori = () => {
    showModalKategori.value = true;
    editModeKategori.value = false;
    selectedKategori.value = null;
};

const openEditModalKategori = (KategoriItem) => {
    selectedKategori.value = KategoriItem;  
    editModeKategori.value = true;
    showModalKategori.value = true;
};

const closeModalKategori = () => {
    showModalKategori.value = false;
    selectedKategori.value = null;
    editModeKategori.value = false;
};

const handleSavedKategori = () => {
    FetchKategori(); 
    closeModalKategori(); 
};

// DELETE Kategori
const handleDeleteKategori = async (paramsId) => {
    try {
        await customAPI.post(`/kategori-berita/${paramsId}?_method=DELETE`, null, {
            headers: { Authorization: `Bearer ${authStore.token}` },
        });

        alert("Kategori successfully deleted!");
        FetchKategori();
    } catch (error) {
        console.error('Failed to delete Kategori:', error);
    }
};

// ROLE
const roles = ref([]);
const FetchRole = async () => {
    try {
        loading.value = true;
        const { data } = await customAPI.get('/role', {
            headers: { Authorization: `Bearer ${authStore.token}` },
        });
        roles.value = data.data;
    } catch (error) {
        console.error('Failed to fetch role:', error);
    } finally {
        loading.value = false;
    }
};

const showModalRole = ref(false);
const editModeRole = ref(false);
const selectedRole = ref(null);

const openModalRole = () => {
    showModalRole.value = true;
    editModeRole.value = false;
    selectedRole.value = null;
};

const openEditModalRole = (RoleItem) => {
    selectedRole.value = RoleItem;  
    editModeRole.value = true;
    showModalRole.value = true;
};

const closeModalRole = () => {
    showModalRole.value = false;
    selectedRole.value = null;
    editModeRole.value = false;
};

const handleSavedRole = () => {
    FetchRole(); 
    closeModalRole(); 
};

// DELETEROLE
const handleDeleteRole = async (paramsId) => {
    try {
        await customAPI.post(`/role/${paramsId}?_method=DELETE`, null, {
            headers: { Authorization: `Bearer ${authStore.token}` },
        });

        alert("Role successfully deleted!");
        FetchRole();
    } catch (error) {
        console.error('Failed to delete Role:', error);
    }
};

// USER
const users = ref([]);
const FetchUser = async () => {
    try {
        loading.value = true;
        const { data } = await customAPI.get('/user', {
            headers: { Authorization: `Bearer ${authStore.token}` },
        });
        users.value = data.data;
    } catch (error) {
        console.error('Failed to fetch users:', error);
    } finally {
        loading.value = false;
    }
};

const showModalUser = ref(false);
const selectedUser = ref(null);

const openModalUser = () => {
    showModalUser.value = true;
    selectedUser.value = null;
};

const closeModalUser = () => {
    showModalUser.value = false;
    selectedUser.value = null;
};

const handleSavedUser = () => {
    FetchUser(); 
    closeModalUser(); 
};

// DELETEROLE
const handleDeleteUser = async (paramsId) => {
    try {
        await customAPI.post(`/user/${paramsId}?_method=DELETE`, null, {
            headers: { Authorization: `Bearer ${authStore.token}` },
        });

        alert("User successfully deleted!");
        FetchUser();
    } catch (error) {
        console.error('Failed to delete RoUserle:', error);
    }
};

// PERAN
const peran = ref([]);
const FetchPeran = async () => {
    try {
        loading.value = true;
        const { data } = await customAPI.get('/peran-pengurus', {
            headers: { Authorization: `Bearer ${authStore.token}` },
        });
        peran.value = data.data;
    } catch (error) {
        console.error('Failed to fetch peran:', error);
    } finally {
        loading.value = false;
    }
};

const showModalPeran = ref(false);
const editModePeran = ref(false);
const selectedPeran = ref(null);

const openModalPeran = () => {
    showModalPeran.value = true;
    editModePeran.value = false;
    selectedPeran.value = null;
};

const openEditModalPeran = (PeranItem) => {
    selectedPeran.value = PeranItem;  
    editModePeran.value = true;
    showModalPeran.value = true;
};

const closeModalPeran = () => {
    showModalPeran.value = false;
    selectedPeran.value = null;
    editModePeran.value = false;
};

const handleSavedPeran = () => {
    FetchPeran(); 
    closeModalPeran(); 
};

// DELETE PERAN
const handleDeletePeran = async (paramsId) => {
    try {
        await customAPI.post(`/peran-pengurus/${paramsId}?_method=DELETE`, null, {
            headers: { Authorization: `Bearer ${authStore.token}` },
        });

        alert("Peran successfully deleted!");
        FetchRole();
    } catch (error) {
        console.error('Failed to delete Peran:', error);
    }
};

// VIDEO
const video = ref([]);
const FetchVideo = async () => {
    try {
        loading.value = true;
        const { data } = await customAPI.get('/video', {
            headers: { Authorization: `Bearer ${authStore.token}` },
        });
        video.value = data.data;
    } catch (error) {
        console.error('Failed to fetch peran:', error);
    } finally {
        loading.value = false;
    }
};

const showModalVideo = ref(false);
const editModeVideo = ref(false);
const selectedVideo = ref(null);

const openModalVideo = () => {
    showModalVideo.value = true;
    editModeVideo.value = false;
    selectedVideo.value = null;
};

const openEditModalVideo = (VideoItem) => {
    selectedVideo.value = VideoItem;  
    editModeVideo.value = true;
    showModalVideo.value = true;
};

const closeModalVideo = () => {
    showModalVideo.value = false;
    selectedVideo.value = null;
    editModeVideo.value = false;
};

const handleSavedVideo = () => {
    FetchVideo(); 
    closeModalVideo(); 
};

// DELETE VIDEO
const handleDeleteVideo = async (paramsId) => {
    try {
        await customAPI.post(`/video/${paramsId}?_method=DELETE`, null, {
            headers: { Authorization: `Bearer ${authStore.token}` },
        });

        alert("Video successfully deleted!");
        FetchVideo();
    } catch (error) {
        console.error('Failed to delete Video:', error);
    }
};
</script>
