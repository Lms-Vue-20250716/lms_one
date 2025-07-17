<script setup>
import ContentBox from '@/components/common/ContentBox.vue';
import LectureManageListMain from '@/components/Lecture/LectureManageList/LectureManageListMain/LectureManageListMain.vue';
import LectureManageListSearch from '@/components/Lecture/LectureManageList/LectureManageListSearch/LectureManageListSearch.vue';
</script>

<template>
  <ContentBox>강의 목록 관리</ContentBox>
  <LectureManageListSearch />
  <LectureManageListMain />
</template>
