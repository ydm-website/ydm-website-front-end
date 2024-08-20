<template>
    <div class="py-6 lg:py-0 my-10 lg:my-0">
        <section id="Hero">
            <div v-if="loading">
                <LoadingComponent />
            </div>
            <div v-else>
                <div ref="carousel" class="carousel w-full overflow-hidden relative">
                    <div class="carousel-item relative w-full" v-for="item in hero" :key="item.id">
                        <div
                            class="hero min-h-[300px] md:min-h-[500px] lg:min-h-[680px] bg-cover bg-center"
                            :style="{ backgroundImage: `url(${item.image})` }"
                        >
                            <div class="hero-overlay bg-opacity-60"></div>
                            <div class="hero-content text-white text-center">
                                <div class="max-w-full">
                                    <h1 class="mb-5 text-2xl lg:text-5xl font-bold">
                                        {{ item.title }}
                                    </h1>
                                    <p class="hidden lg:block mb-5 text-lg">
                                        {{ item.deskripsi }}
                                    </p>
                                    <button 
                                        @click="openEditModalHero(item)" 
                                        class="mt-auto bg-warning text-white py-2 px-3 rounded hover:bg-base-200 hover:text-neutral" 
                                        v-if="authStore.user && authStore.user.role.name === 'admin'"
                                    >
                                        <span class="pi pi-pencil"></span> Ubah
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal" :class="{ 'modal-open': showModalHero }">
                <div class="modal-box">
                    <DialogHome 
                        @closeModal="closeModalHero" 
                        :editMode="editModeHero" 
                        :hero="selectedHero" 
                        form="hero"
                        @heroSaved="handleSavedHero" 
                    />
                </div>
            </div>
        </section>
        
        
        <div class="flex flex-col items-start mt-5 lg:flex-row">
            <div class="flex flex-col">
                
                <section id="pengumuman" class="mx-4 py-5 lg:w-[400px]">
                    <div class="my-2 items-center flex flex-col rounded-lg shadow-sm border h-[700px] overflow-hidden">
                        <div class="bg-neutral text-base-100 gap-3 w-full items-center rounded-t-lg flex flex-row py-2 px-3 mb-2 font-bold text-lg">
                            <span class="pi pi-megaphone"></span>
                            <h1> Pengumuman </h1>
                        </div>
                        
                        <div class="overflow-y-auto w-full">
                            <div v-if="loading">
                                <LoadingComponent />
                            </div>
                            <div v-else>
                                <div v-for="item in pengumuman" :key="item.id">
                                    <div 
                                        @click="handleCardClickPengumuman(item.id)"
                                        class="card bg-base-100 border lg:w-[370px] mx-2 mb-2 rounded-sm"
                                    >
                                        <div class="card-body">
                                            <h2 v-if="item.title.length >39" class="text-lg font-semibold">
                                                {{ item.title.substring(0,38) }} ...
                                            </h2>
                                            <h2 v-else class="text-lg font-semibold">
                                                {{ item.title }}
                                            </h2>

                                            <p class="text-xs">
                                                <span class="pi pi-clock ml-1 text-xs"></span> {{ formatDate(item.created_at) }}
                                            </p>
                                            <hr>

                                            <p v-if="item.content.length >300" class="text-sm leading-relaxed text-justify">
                                                {{ item.content.substring(0,300) }} ...
                                            </p>
                                            <p v-else class="text-sm leading-relaxed text-justify">
                                                {{ item.content }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="Berita" class="mx-4 pb-5 lg:w-[400px]">
                    <div class="my-2 items-center flex flex-col rounded-lg shadow-sm border h-[800px] overflow-hidden">
                        <div class="bg-neutral text-base-100 gap-3 w-full items-center rounded-t-lg flex flex-row py-2 px-3 mb-2 font-bold text-lg">
                            <span class="pi pi-th-large"></span>
                            <h1> Berita </h1>
                        </div>
                        <div class="overflow-y-auto w-full">
                            <div v-if="loading">
                                <LoadingComponent />
                            </div>
                            <div v-else>
                                <div v-for="item in berita" :key="item.id">
                                    <div 
                                        @click="handleCardClickBerita(item.id)"
                                        class="card bg-base-100 border lg:w-[370px] mx-2 mb-2 rounded-sm"
                                    >
                                        <div class="card-body p-2">
                                            <h2 v-if="item.title.length >39" class="text-lg font-semibold">
                                                {{ item.title.substring(0,38) }} ...
                                            </h2>
                                            <h2 v-else class="text-lg font-semibold">
                                                {{ item.title }}
                                            </h2>

                                            <div class="flex flex-row items-start">
                                                <p class="text-xs w-0">
                                                    <span class="pi pi-clock ml-1"></span> {{ formatDate(item.created_at) }}
                                                </p>
                                                <p class="text-xs">
                                                    <span class="pi pi-user mr-1"></span> {{ item.author }}
                                                </p>
                                            </div>

                                            <hr>

                                            <div class="flex flex-col sm:flex-row md:flex-row lg:flex-row gap-2 items-center">
                                                <figure class="py-3 rounded-lg h-[100px] lg:h-[100px] w-[300px] lg:w-[600px]">
                                                    <img :src="item.image" :alt="item.title" 
                                                        class="object-cover rounded-lg h-[200px] lg:h-[100px] w-[300px] lg:w-[100px]" 
                                                    />
                                                </figure>
                                                <p v-if="item.content.length >136" class="text-sm leading-relaxed text-justify">
                                                    {{ item.content.substring(0,136) }} ...
                                                </p>
                                                <p v-else class="text-sm leading-relaxed text-justify">
                                                    {{ item.content }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </section>
            </div>

            <div class="flex flex-col">
                <section id="about" class="py-5">
                    <div v-if="loading">
                        <LoadingComponent />
                    </div>
                    <div v-else>
                        <div class="px-5 flex flex-col justify-center">
                            <div v-for="item in home" :key="item.id">
                                <h1 class="font-bold text-4xl pb-3 text-center">{{ item.title }}</h1>
                                <hr class="mx-5 my-2">
                                <button 
                                    @click="openEditModalHome(item)" 
                                    class="mt-auto bg-warning text-white mx-5 py-2 px-3 rounded hover:bg-base-200 hover:text-neutral" 
                                    v-if="authStore.user && authStore.user.role.name === 'admin'"
                                >
                                    <span class="pi pi-pencil"></span>
                                </button>
                                <div class="modal" :class="{ 'modal-open': showModalHome }">
                                    <div class="modal-box">
                                        <DialogHome 
                                            @closeModal="closeModalHome" 
                                            :editMode="editModeHome" 
                                            :hero="selectedHome" 
                                            form="home"
                                            @heroSaved="handleSavedHome" 
                                        />
                                    </div>
                                </div>
                                <div class="py-4">
                                    <figure class="px-5">
                                        <img :src="item.image" alt="" class="lg:h-[60vh] lg:w-[600vh] rounded-lg">
                                    </figure>
                                </div>
                                <p class="px-5 leading-relaxed text-justify text-lg">
                                    {{ item.deskripsi }}
                                </p>
                            </div>
                            
                        </div>
                    </div>
                </section>
                <section id="video" class="my-5 px-5">
                    <h1 class="text-4xl font-bold text-center">Video Terbaru</h1>
                    <hr class="mx-5 my-2">
                    <div v-if="loading">
                        <LoadingComponent />
                    </div>
                    <div v-else>
                        <div class="grid lg:grid-cols-3 gap-5 py-5 px-5">
                            <div v-for="item in video" :key="item.id">
                                <div class="card bg-base-100 border border-slate-200 shadow-lg">
                                    <figure class="m-2 lg:m-0 lg:px-3 rounded-lg h-[200px]">
                                        <YoutubeIframe :video-id="extractVideoId(item.url)"/>
                                    </figure>
                                    <div class="card-body pt-0 px-2 items-center text-center">
                                        <h2 class="text-xl font-bold break-words w-full">
                                            {{ item.title }}
                                        </h2>
                                        <p class="text-xs">
                                            <span class="pi pi-clock ml-1"></span> {{ formatDate(item.created_at) }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="Lokasi" class="my-5 px-10">
                    <h1 class="text-4xl font-bold text-center">Lokasi</h1>
                    <hr class="mx-5 my-2">
                    <div class="card border border-slate-200 shadow-lg">
                        <LocationIframe/>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { customAPI } from '@/api';
import { useAuthStore } from '@/stores/AuthStore';
import { format } from 'date-fns';
import { useRouter } from 'vue-router';
import DialogHome from '@/components/Dialog/DialogHome.vue';
import YoutubeIframe from '@/components/YoutubeIframe.vue';
import LocationIframe from '@/components/LocationIframe.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';

const extractVideoId = (url) => {
    try {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);

        return match ? match[1] : '';
    } catch (e) {
        console.error('Error extracting video ID:', e);
        return '';
    }
};

const authStore = useAuthStore();
const loading = ref(false);
const router = useRouter(); 

const formatDate = (date) => {
    return format(new Date(date), 'dd-MM-yyyy HH:mm:ss');
};

const berita = ref([]);
const AllBerita = async () => {
    try {
        loading.value = true;
        const { data } = await customAPI.get('/dashboard-berita');
        berita.value = data.data;
    } catch (error) {
        console.error('Failed to fetch berita:', error);
    } finally {
        loading.value = false;
    }
};

const pengumuman = ref([]);
const AllPengumuman = async () => {
    try {
        loading.value = true;
        const { data } = await customAPI.get('/dashboard-pengumuman');
        pengumuman.value = data.data;
    } catch (error) {
        console.error('Failed to fetch pengumuman:', error);
    } finally {
        loading.value = false;
    }
};

const video = ref([]);
const AllVideo = async () => {
    try {
        loading.value = true;
        const { data } = await customAPI.get('/dashboard-video');
        video.value = data.data;
    } catch (error) {
        console.error('Failed to fetch video:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(()=>{
    AllBerita();
    AllPengumuman();
    AllVideo();
    AllHome();
})

const hero = ref([]);
const AllHeader = async () => {
    try {
        loading.value = true;
        const { data } = await customAPI.get('/hero');
        hero.value = data.data;
    } catch (error) {
        console.error('Failed to fetch hero:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    await AllHeader();

    const carouselElement = document.querySelector('.carousel');
    const slides = carouselElement.querySelectorAll('.carousel-item');
    const totalSlides = slides.length + 4;
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.transform = `translateX(${(i - index) * 100}%)`;
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 2) % totalSlides;
        showSlide(currentSlide);
    }

    // Mengatur interval autoplay
    const autoplayInterval = setInterval(nextSlide, 5000);

    // Pastikan slide pertama ditampilkan saat halaman dimuat
    showSlide(currentSlide);
});

// EDIT HERO
const showModalHero = ref(false);
const editModeHero = ref(false);
const selectedHero = ref(null);

const openEditModalHero = (HeroItem) => {
    selectedHero.value = HeroItem;  
    editModeHero.value = true;
    showModalHero.value = true;
};

const closeModalHero = () => {
    showModalHero.value = false;
    selectedHero.value = null;
    editModeHero.value = false;
};

const handleSavedHero = () => {
    AllHeader(); 
    closeModalHero(); 
};

const home = ref([]);
const AllHome = async () => {
    try {
        loading.value = true;
        const { data } = await customAPI.get('/home');
        home.value = data.data;
    } catch (error) {
        console.error('Failed to fetch home:', error);
    } finally {
        loading.value = false;
    }
};

// EDIT HOME
const showModalHome = ref(false);
const editModeHome = ref(false);
const selectedHome = ref(null);

const openEditModalHome = (HomeItem) => {
    selectedHome.value = HomeItem;  
    editModeHome.value = true;
    showModalHome.value = true;
};

const closeModalHome = () => {
    showModalHome.value = false;
    selectedHome.value = null;
    editModeHome.value = false;
};

const handleSavedHome = () => {
    AllHome(); 
    closeModalHome(); 
};

const handleCardClickPengumuman  = (PengumumanID) => {
    router.push({ name:'DetailPengumuman', params: {id: PengumumanID} });
}

const handleCardClickBerita  = (BeritaID) => {
    router.push({ name:'DetailBerita', params: {id: BeritaID} });
}
</script>


<style scoped>
.carousel {
    display: flex;
    overflow: hidden;
    position: relative;
}

.carousel-item {
    flex: 0 0 100%;
    transition: transform 1s ease-in-out; /* Mengatur kecepatan transisi */
    position: relative;
}

.hero {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover;
    background-position: center;
}

.hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
}

.hero-content {
    position: relative;
    z-index: 1;
}
</style>
