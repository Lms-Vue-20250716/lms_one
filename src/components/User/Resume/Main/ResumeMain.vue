<script setup>
import PageNavigation from '@/components/common/PageNavigation.vue';
</script>
<template>
  <div class="list-main-container">
    <table class="list-table">
      <thead class="list-table-header">
        <tr>
          <th scope="col">강의 번호</th>
          <th scope="col">강의 이름</th>
          <th scope="col">회차</th>
          <th scope="col">담당 강사</th>
          <th scope="col">정원</th>
          <th scope="col">개강일</th>
          <th scope="col">종강일</th>
        </tr>
      </thead>
      <tbody class="list-table-row" id="resumeList">
        <td class="list-cell"></td>
        <!-- <td class="list-empty-row"></td> -->
      </tbody>
    </table>

    <PageNavigation />
  </div>
</template>
<style scoped>
@import './styled.css';
</style>
