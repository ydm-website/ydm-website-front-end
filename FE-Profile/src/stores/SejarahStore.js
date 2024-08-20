import {ref} from 'vue'
import {defineStore} from 'pinia'

export const useSejarahStore = defineStore('sejarah', () => {
    const sejarah = ref([
        {
            id:1,
            title: "Masa Rintisan",
            content: "Berdirinya Taman Kanak-kanak Dewi Masyithoh pada tahun 1967 merupakan titik awal pelestarian visi dan misi alm. KH Tartib. Dan selanjutnya  kegiatan pendidikan formal melalui lembaga sekolah, dengan disusul kemudian berdirinya Madrasah Ibtidaiyah( MI ). Bersamaan dengan kegiatan pendidikan formal tersebut pengelola pendidikan bersama dengan Muslimat Nahdlatul Ulama Ranting Banyumudal mengadakan kegiatan-kegiatan yang lain yang mendampingi kegiatan formal tersebut, antara lain : majlis ta’lim, santunan anak-anak yatim , beasiswa anak-anak yang tidak mampu serta kegiatan -kegiatan lain.",
        },
        {
            id:2,
            title: "Masa Penguatan",
            content: "Sejak awal kegiatan , para pengelola semuanya terdiri dari para ibu-ibu yang mayoritas pengurus Muslimat Nahdlatul Ulama Ranting Banyumudal dan baru sejak tahun 1980, bergabunglah para bapak-bapak yang dimotori oleh anak alm. KH Tartib yang lima yaitu H. Mu’ala Hata . mulai ikut mengelola kegiatan  dan secara formal berdirilah sebuah lembaga yang dikenal sampai sekarang dengan Yayasan Dewi Masyithoh Moga. Bergabungnya pengelolaan antara ibu-ibu dan bapak –bapak menjadikan kegiatan bertambah kuat dan mempunyai dampak yang positif terhadap masyarakat Moga khususnya dan Pemalang pada umumnya. Dan mulai tahun delapan puluhan, yayasan Dewi Masyithoh, merupakan Yayasan yang cukup dikenal dan dipercaya sebagai yayasan yang kuat dan banyak kegiatannya.",
        },
        {
            id:3,
            title: "Masa Pengembangan",
            content: "Dengan berjalannya waktu, banyak muncul generasi muda di Banyumudal yang mempunyai kompetensi dan profesi yang berkembang sesuai dengan jamannya.  Bertambahnya   generasi ini berdampak sangat positif terhadap perkembangan Yayasan Dewi Masyitoh. Kegiatan-kegiatan yang sudah berjalan mulai banyak dikelola oleh tenaga-tenaga professional. Bidang kegiatannyapun bertambah banyak , diantaranya bidang kesehatan, pengemberdayaan ZIS , dengan mengikuti perkembangan yang ada dalam masyarakat.",
        },
        {
            id:4,
            title: "Masa Peralihan",
            content: "Tahun  2017 merupakan 50 tahun umur Yayasan Dewi Masyithoh. Bersamaan dengan itu, para pendiri dan perintis Yayasan Dewi Masyithoh sudah mulai termakan oleh usia. Dengan usia generasi pertama putra-putri alm. KH Tartib yang sudah udzur, seharusnyalah mulai diadakan peralihan generasi pengelola Yayasan. Generasi Bani Tartib yang saat ini sudah banyak bermunculan dengan profesi dan kompetensi yang beraneka ragam merupakan generasi yang seharusnya dan sepantasnya menerima estafet pengelolaan Yayasan Dewi Masyithoh yang merupakan pengejawantahan  visi dan misi Almarhum KH Tartib dan Alarhumah Hj. Zubaedah. Inilah merupakan saat yang tepat untuk alih generasi  pengelolaan Yayasan Dewi Masyithoh dengan misi yang selalu dijaga konsistensinya yaitu membawa misi mempertahankan dan melestarikan faham Ahlussunah wal Jama’ah AnNahdliyah.",
        },
    ]);

    return { sejarah }
})