<template>
  <ContentBox>강의실정보</ContentBox>
  <ClassroomSearch />
  <ClassroomMain />
</template>
<script setup>
import ContentBox from '@/components/common/ContentBox.vue';
import ClassroomMain from '@/components/System/Classroom/ClassroomMain/ClassroomMain.vue';
import ClassroomSearch from '@/components/System/Classroom/ClassroomSearch/ClassroomSearch.vue';
</script>
