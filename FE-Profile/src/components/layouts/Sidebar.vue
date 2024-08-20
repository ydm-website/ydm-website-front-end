<template>
    <!-- Sidebar -->
    <div class="drawer-side">
        <label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label>
        <ul class="menu bg-base-100 text-neutral font-semibold min-h-full my-16 w-60 p-4">
            <li v-for="side in filteredSide" :key="side.id">
                <template v-if="side.name === 'Profil'">
                        <summary>
                            {{ side.name }}
                        </summary>
                        <ul class="p-2 w-[200px]">
                            <li v-for="profile in profileList" :key="profile.id">
                                <RouterLink :to="{ name: profile.name }">
                                    <span :class="profile.icon"></span>
                                    {{ profile.name }}
                                </RouterLink>
                            </li>
                        </ul>
                </template>
                <template v-else>
                    <RouterLink :to="{ name: side.name }">{{ side.name }}</RouterLink>
                </template>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/AuthStore';

const authStore = useAuthStore();

const listSideBar = [
    { id: 1, name: "Profil" },
    { id: 2, name: "Bidang" },
    { id: 3, name: "Pengumuman" },
    { id: 4, name: "Berita" },
    { id: 5, name: "Album Kegiatan" },
    { id: 6, name: "Download" },
    { id: 7, name: "Kontak" },
    { id: 8, name: "Setting", admin: true },
];

const profileList = [
    { id: 1, name: "Profil", icon: "pi pi-verified" },
    { id: 2, name: "Pengurus", icon: "pi pi-users" },
    { id: 3, name: "Sejarah", icon: "pi pi-book" },
    { id: 4, name: "Panduan Logo", icon: "pi pi-th-large" },
];

const filteredSide = computed(() => {
    return listSideBar.filter(side => {
        return authStore.user?.role?.name === 'admin' ? true : !side.admin;
    });
});
</script>

<style scoped>
.drawer-side {
    z-index: 20
}
</style>
