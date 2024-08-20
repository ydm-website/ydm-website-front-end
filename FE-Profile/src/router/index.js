import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore'
import PublicLayout from '@/Layouts/PublicLayout.vue';
import HomeView from '@/views/HomeView.vue';
import ContactView from '@/views/ContactView.vue';
import BeritaView from '@/views/Berita/BeritaView.vue';
import DetailBeritaView from '@/views/Berita/DetailBeritaView.vue';
import BidangView from '@/views/Bidang/BidangView.vue';
import DetailBidangView from '@/views/Bidang/DetailBidangView.vue';
import LogoView from '@/views/Profile/LogoView.vue';
import PengumumanView from '@/views/Pengumuman/PengumumanView.vue';
import SettingView from '@/views/SettingView.vue';
import AlbumKegiatanView from '@/views/Album/AlbumKegiatanView.vue';
import DetailDokumentasiView from '@/views/Album/DetailDokumentasiView.vue';
import LoginView from '@/views/LoginView.vue';
import SejarahView from '@/views/Profile/SejarahView.vue';
import DownloadView from '@/views/DownloadView.vue';
import PengurusView from '@/views/Profile/PengurusView.vue';
import ProfileView from '@/views/Profile/ProfileView.vue';
import DetailKetegoriView from '@/views/Berita/DetailKategoriView.vue';
import DetailPengumumanView from '@/views/Pengumuman/DetailPengumumanView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: PublicLayout,
      children: [
        {
          path: '',
          name: 'Home',
          component: HomeView,
        },
        {
          path: 'album-kegiatan',
          name: 'Album Kegiatan',
          component: AlbumKegiatanView,
        },
        {
          path: 'album-kegiatan/:id',
          name: 'DetailAlbum',
          component: DetailDokumentasiView,
        },
        {
          path: 'berita',
          name: 'Berita',
          component: BeritaView,
        },
        {
          path: 'berita/:id',
          name: 'DetailBerita',
          component: DetailBeritaView,
        },
        {
          path: 'kategori/:id',
          name: 'DetailKategori',
          component: DetailKetegoriView,
        },
        {
          path: 'bidang',
          name: 'Bidang',
          component: BidangView,
        },
        {
          path: 'bidang/:id',
          name: 'DetailBidang',
          component: DetailBidangView,
        },
        {
          path: 'kontak',
          name: 'Kontak',
          component: ContactView,
        },
        {
          path: 'download',
          name: 'Download',
          component: DownloadView,
        },
        {
          path: 'logo',
          name: 'Panduan Logo',
          component: LogoView,
        },
        {
          path: 'pengumuman',
          name: 'Pengumuman',
          component: PengumumanView,
        },
        {
          path: 'pengumuman/:id',
          name: 'DetailPengumuman',
          component: DetailPengumumanView,
        },
        {
          path: 'pengurus',
          name: 'Pengurus',
          component: PengurusView,
        },
        {
          path: 'profil',
          name: 'Profil',
          component: ProfileView,
        },
        {
          path: 'setting',
          name: 'Setting',
          component: SettingView,
          meta: { isAdmin: true },
        },
        {
          path: 'sejarah',
          name: 'Sejarah',
          component: SejarahView,
        },
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: {requiresGuest: true, isLogin: true}
    },
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.token) {
    alert("You are not logged in");
    return next({ path: '/' });
  }

  // Check if user is authenticated and trying to access login/register
  if (to.meta.requiresGuest && authStore.token) {
    alert("You are already logged in");
    return next({ path: '/' });
  }

  // Check if user is admin for specific routes
  if (to.meta.isAdmin && authStore.user.role.name !== 'admin') {
    alert("You do not have permission to access this page");
    return next({ path: '/' });
  }
  
  next();
});

export default router
