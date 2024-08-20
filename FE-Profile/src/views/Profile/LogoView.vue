<template>
    <div class="py-16 my-10 mx-10">
        <SectionHeader :title1="'Logo'" :route1="'Panduan Logo'"/>
        <section id="logo">
            <div class="my-8 px-5 py-5 flex flex-col gap-6">
                <div >
                    <img :src="logoImage" alt="" class="h-[250px] w-[250px] lg:h-[300px] lg:w-[300px] mx-auto">
                </div>
                <div class="grid lg:grid-cols-3 py-5 gap-2">
                    <div v-for="item in logo" :key="item.id">
                        <div class="collapse collapse-arrow bg-base-200">
                            <input type="checkbox" />
                            <div class="collapse-title lg:text-xl font-medium lg:text-center">{{ item.title }}</div>
                            <div class="collapse-content">
                                <p class="leading-relaxed text-justify">{{ item.content }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
<script setup>
    import { storeToRefs } from 'pinia';
    import { useLogoStore } from '@/stores/LogoStore';
    import SectionHeader from '@/components/layouts/SectionHeader.vue';

    import logoImage from '@/assets/Logo.png';

    const LogoStore = useLogoStore();
    const { logo } = storeToRefs(LogoStore);
</script>