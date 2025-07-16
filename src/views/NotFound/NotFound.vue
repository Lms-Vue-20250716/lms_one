<script setup>
import notFoundImage from '@/assets/404.jpg';
import './styled.css';
</script>
<template>
  <div class="not-found-container">
    <img :src="notFoundImage" alt="404 Not Found" class="not-found-image" @click="$router.go(-1)" />
  </div>
</template>
