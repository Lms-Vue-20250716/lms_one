<script setup lang="ts">
import ContentBox from '@/components/common/ContentBox.vue';
import TutorMain from '@/components/Manage/Tutor/TutorMain/TutorMain.vue';
import TutorSearch from '@/components/Manage/Tutor/TutorSearch/TutorSearch.vue';
</script>

<template>
  <ContentBox>강사 관리</ContentBox>
  <TutorSearch />
  <TutorMain />
</template>
