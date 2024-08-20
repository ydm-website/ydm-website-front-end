import {ref} from 'vue'
import {defineStore} from 'pinia'

export const useMisiStore = defineStore('misi', () => {
    const misi = ref([
        {
            id:1,
            content: "Mengusahakan kegiatan pendidikan, menjadikan pendidikan yang bermanfaat dan bermutu.",
        },
        {
            id:2,
            content: "Mengusahakan kegiatan social, menghasilkan perubahan dari sesuatu yang kurang menjadi lebih.",
        },
        {
            id:3,
            content: "Mengusahakan kegiatan da’wah, memunculkan hikmah dan kesejukan.",
        },
        {
            id:4,
            content: "Mengusahakan kegiatan kesehatan ,menjadikan ihtiyar suatu keharusan.",
        },
        {
            id:5,
            content: "Mengusahakan pendayagunaan ZIS  menghasilkan sesuatu yang terukur.",
        },
        {
            id:6,
            content: "Mengusahakan pemberdayaandana lebih produktif.",
        },
        {
            id:7,
            content: "Mengusahakan kegiatan menghasilkan jaringan yang lebih kuat dan luas.",
        },
        {
            id:8,
            content: "Mengusahakan seluruh kegiatan terkoneksi satu dengan yang lain.",
        },
    ]);

    return { misi }
})