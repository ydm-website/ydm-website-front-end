<template>
    <div class="flex flex-col min-h-screen">
        <div class="drawer">
            <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
            <div class="drawer-content  flex flex-col flex-grow">
                <Navbar v-if="!isLogin" />

                <NavbarAuth v-if="isLogin" />

                <main 
                    class="flex-grow max-w-8xl rounded-xl pb-36"
                    :class="{'my-36': isLogin}" 
                >
                    <RouterView v-slot="{ Component, route }" v-if="!route.meta.inPublicLayout">
                        <Transition name="fade" mode="out-in">
                            <component :is="Component" :key="route.path"></component>
                        </Transition>
                    </RouterView>
                </main>
                <Footer />
            </div>
            <Sidebar />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router'
import Navbar from '@/components/layouts/Navbar.vue';
import NavbarAuth from '@/components/layouts/NavbarAuth.vue';
import Sidebar from '@/components/layouts/Sidebar.vue';
import Footer from '@/components/layouts/Footer.vue';

const route = useRoute();
const isLogin = computed(() => route.meta.isLogin || false);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>