<script setup>
import ContentBox from '@/components/common/ContentBox.vue';
import StudentMain from '@/components/Manage/Student/StudentMain/StudentMain.vue';
import StudentSearch from '@/components/Manage/Student/StudentSearch/StudentSearch.vue';
</script>

<template>
  <ContentBox>학생 관리</ContentBox>
  <StudentSearch />
  <StudentMain />
</template>
