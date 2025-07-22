<template>
  <ContentBox>시험정보</ContentBox>
  <TestInfoSearch />
  <TestInfoMain />
</template>
<script setup>
import ContentBox from '@/components/common/ContentBox.vue';
import TestInfoMain from '@/components/Lecture/TestInfo/TestInfoMain/TestInfoMain.vue';
import TestInfoSearch from '@/components/Lecture/TestInfo/TestInfoSearch/TestInfoSearch.vue';
</script>
