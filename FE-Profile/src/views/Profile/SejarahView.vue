<template>
    <div class="py-16 my-10 mx-10">
        <SectionHeader :title1="'Sejarah'" :route1="'Sejarah'"/>
        <section id="sejarah">
            <div class="my-7 px-5">
                <ul class="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical py-8">
                    <li v-for="item in sejarah" :key="item.id">
                        <template v-if="item.id % 2 == 1">
                            <div class="timeline-middle">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    class="h-5 w-5">
                                    <path
                                        fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="bg-neutral text-base-100 p-5 rounded-lg timeline-start mb-10 md:text-end">
                                <div class="text-xl font-black pb-2">{{ item.title }}</div>
                                <p class=" leading-relaxed text-justify">{{ item.content }}</p>
                            </div>
                            <hr class="bg-neutral"/>
                        </template>
                        <template v-else>
                            <hr class="bg-neutral"/>
                            <div class="timeline-middle">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    class="h-5 w-5">
                                    <path
                                        fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="bg-neutral text-base-100 p-5 rounded-lg timeline-end mb-10">
                                <div class="text-xl font-black pb-2">{{ item.title }}</div>
                                <p class=" leading-relaxed text-justify">{{ item.content }}</p>
                            </div>
                            <hr class="bg-neutral"/>
                        </template>
                    </li>
                </ul>
            </div>
        </section>
    </div>
</template>

<script setup>
    import { storeToRefs } from 'pinia';
    import { useSejarahStore } from '@/stores/SejarahStore';
    import SectionHeader from '@/components/layouts/SectionHeader.vue';

    const SejarahStore = useSejarahStore();

    const { sejarah } = storeToRefs(SejarahStore);
</script>