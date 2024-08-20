<template>
    <!-- Navbar -->
    <div class="navbar bg-base-100 shadow-md w-full z-20 fixed flex flex-row gap-2">
        <div class="flex-none lg:hidden">
            <label for="my-drawer-3" aria-label="open sidebar" class="btn btn-square btn-ghost">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    class="inline-block h-6 w-6 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </label>
        </div>
        <div class="navbar-start">
            <RouterLink to="/" class="btn btn-ghost text-lg">
                YAYASAN DEWI MASYITHOH
            </RouterLink>
        </div>
        <div class="hidden lg:block text-center lg:navbar-center">
            <ul class="menu menu-horizontal px-2 items-center">
                <!-- Navbar menu content here -->
                <li v-for="nav in filteredNav" :key="nav.id">
                    <template v-if="nav.name === 'Profil'">
                        <li class="dropdown rounded-lg px-0 py-0 hover:bg-white hover:text-neutral">
                            <details>
                                <summary class="font-semibold">
                                    {{ nav.name }}
                                </summary>
                                <ul class="dropdown-content rounded-lg bg-base-200 text-neutral p-2 w-[170px]">
                                    <li v-for="profile in profileList" :key="profile.id">
                                        <RouterLink :to="{ name: profile.name }" class="gap-3"> 
                                            <span :class="profile.icon"></span>
                                            {{ profile.name }}
                                        </RouterLink>
                                    </li>
                                </ul>
                            </details>
                        </li>
                    </template>
                    <template v-else>
                        <div class="font-semibold hover:bg-base-200 hover:text-neutral">
                            <RouterLink class="font-semibold" :to="{ name: `${nav.name}`}" >{{ nav.name }}</RouterLink>
                        </div>
                    </template>
                </li>
                
            </ul>
        </div>
        <div class="navbar-end px-3 ">
            <ul class="flex justify-start rounded-lg px-4 py-1 font-semibold hover:bg-base-200 hover:text-neutral">
                <li v-if="authStore.user && authStore.token" @click="handleLogout">
                    <span class="pi pi-sign-out" style="font-size: 15px;"></span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { computed } from 'vue';
import { useAuthStore } from '@/stores/AuthStore';

const authStore = useAuthStore();

const listNav = [
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

const filteredNav = computed(() => {
    return listNav.filter(nav => {
        return authStore.user?.role?.name === 'admin' ? true : !nav.admin;
    });
});

const handleLogout = () => {
    authStore.logoutUser();
};
</script>
