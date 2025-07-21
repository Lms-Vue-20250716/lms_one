<script setup>
import PageNavigation from '@/components/common/PageNavigation.vue';
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import LearningMaterialsModal from '../LearningMaterialsModal/LearningMaterialsModal.vue';

const route = useRoute();
const materialList = ref([]);
const materialCount = ref(0);
const detailId = ref(0);
const modalState = useModalState();

const materialSearch = (cPage = 1) => {
  const param = new URLSearchParams(route.query);
  param.append('currentPage', cPage);
  param.append('pageSize', 5);

  axios.post(`/api/support/getMtrListBody.do`, param).then((res) => {
    console.log('응답:', res.data);
    materialList.value = res.data.mtrList;
    materialCount.value = res.data.mtrCnt || 0;
  });
};

const materialDetail = (id) => {
  modalState.$patch({ isOpen: true });
  detailId.value = id;
};

watch(
  () => {
    return route.query;
  },
  () => {
    materialSearch();
  },
);

onMounted(() => {
  materialSearch(1);
});
</script>
<template>
  <div class="material-main-container">
    <table class="material-table">
      <thead class="material-table-header">
        <tr>
          <th>강의명</th>
          <th>작성자</th>
          <th>제목</th>
          <th>작성일</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="materialCount > 0">
          <tr v-for="material in materialList" :key="material.materiId" class="material-table-row">
            <td class="material-cell">{{ material.lecName }}</td>
            <td class="material-cell">{{ material.loginId }}</td>
            <td
              class="material-cell cursor-pointer text-blue-600 hover:underline"
              @click="materialDetail(material.materiId, material.lecId, material.lecName)"
            >
              {{ material.materiTitle }}
            </td>
            <td class="material-cell">{{ material.materiDate }}</td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="4" class="material-empty-row">데이터가 존재하지 않습니다.</td>
          </tr>
        </template>
      </tbody>
    </table>
    <PageNavigation
      :items-per-page="5"
      :total-items="materialCount"
      :on-page-change="materialSearch"
    />
  </div>
  <LearningMaterialsModal
    v-if="modalState.isOpen"
    :detail-id="detailId"
    @post-success="materialSearch"
    @un-mounted-modal="detailId = $event"
  />
</template>

<style>
@import './styled.css';
</style>
