import {ref} from 'vue'
import {defineStore} from 'pinia'

export const useLogoStore = defineStore('logo', () => {
    const logo = ref([
        {
            id:1,
            title: "Bumi",
            content: "Bahwa MI Dewi Masyithoh menjalankan misis sebagai Kholifatullah dil Ardli yaitu dengan menjalankan syareat-Nya sesuai dengan sunatullah.",
        },
        {
            id:2,
            title: "Padi dan Kapas",
            content: "Bahwa MI Dewi Masyithoh mempunyai misi mensejahterakan ummat baik di dunia maupun di akherat.",
        },
        {
            id:3,
            title: "Buku dan Pena",
            content: "Bahwa MI Dewi Masyithoh dalam menjalankan misi pendidikan selalu mengedepankan ilmu pengetahuan yang islami.",
        },
        {
            id:4,
            title: "Bintang Empat di Luar Lingkaran",
            content: "Bahwa MI Dewi Masyithoh mendasari misinya dengan syareat yang diajarkan oleh 4 imam madzhab (Hanafi, Maliki, Syafi'i, dan Hambali).",
        },
        {
            id:5,
            title: "Bintang Berjumlah Sembilan",
            content: "Bahwa MI Dewi Mayithoh mendasari misinya dengan misi akidah, fiqih, dan tasauf yang diajarkan oleh Wali Sanga.",
        },
        {
            id:6,
            title: "Lingkaran Tali",
            content: "Bahwa MI Dewi Masyithoh dalam ikhtiyarnya melaksanakan misi, selalu berdasarkan ukhuwah islamiyah, wathoniyah, basyariyah, dan nahdliyah.",
        },
        {
            id:7,
            title: "Bintang Lima di Dalam Lingkaran",
            content: "Bahwa MI Dewi Masyithoh mendasari misisnya dengan akidah Islam yang bersumberkan Qur'an dan Hadis yang disyareatkan melalui Nabi Muhammad SAW, serta ajaran-ajaran yang diajarkan oleh para sahabat (5 bintang personifikasi dari Nabi Muhammad SAW, Abu Bakar, Umar bin Khattab, Usman bin Affan, dan Ali bin Abu Thalib.",
        },
        {
            id:8,
            title: "Warna",
            content: "Warna putih melambangkan misi MI Dewi Masyithoh adalah misi suci. Warna Hijau melambangkan misi MI Dewi Masyithoh adalah misi kebaikan di dunia dan akherat. Warna kuning melambangkan misi MI Dewi Masyithoh adalah misi yang membawa kedamaian.",
        },
        {
            id:9,
            title: "Lampu",
            content: "Bahwa MI Dewi Masyithoh selalu berikhtiar agar dapat menjadi penerang umat.",
        },
    ]);

    return { logo }
})