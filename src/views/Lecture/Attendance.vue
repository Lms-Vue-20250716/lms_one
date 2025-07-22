<template>
  <ContentBox>출결관리</ContentBox>
  <AttendanceSearch />
  <AttendanceMain />
</template>
<script setup>
import ContentBox from '@/components/common/ContentBox.vue';
import AttendanceMain from '@/components/Lecture/Attendance/AttendanceMain/AttendanceMain.vue';
import AttendanceSearch from '@/components/Lecture/Attendance/AttendanceSearch/AttendanceSearch.vue';
</script>
