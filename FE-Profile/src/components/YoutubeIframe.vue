<template>
    <div class="youtube-video-wrapper">
        <iframe
            :src="`https://www.youtube.com/embed/${videoId}`"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
        ></iframe>
    </div>
</template>

<script setup>
const props = defineProps({
    videoId: {
        type: String,
        required: true,
    },
});
</script>

<style scoped>
.youtube-video-wrapper {
    position: relative;
    width: 100%;
    padding-top: 56.25%; /* 16:9 Aspect Ratio */
    height: 0;
    overflow: hidden;
}

.youtube-video-wrapper iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
