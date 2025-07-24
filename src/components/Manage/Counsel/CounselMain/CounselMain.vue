<script setup>
import PageNavigation from '@/components/common/PageNavigation.vue';
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import CounselModal from '../CounselModal/CounselModal.vue';

const counselList = ref([]);
const counselCount = ref(0);
const route = useRoute();
const detailId = ref(0);
const lectureList = ref([]);
const modalState = useModalState();

const counselSearch = (cPage = 1) => {
  const param = new URLSearchParams(route.query);
  param.append('currentPage', cPage);
  param.append('pageSize', 5);

  axios.post('/api/manage/getCounselListBody.do', param).then((res) => {
    counselList.value = res.data.counselList;
    counselCount.value = res.data.counselCnt;
    lectureList.value = res.data.lectures;
  });
};

const counselDetail = (id) => {
  modalState.$patch({ isOpen: true, type: 'manageCounsel' });
  detailId.value = id;
};

watch(
  () => route.query,
  () => {
    counselSearch();
  },
);

onMounted(() => {
  counselSearch();
});
</script>
<template>
  <div class="notice-main-container">
    <table class="notice-table">
      <thead class="notice-table-header">
        <tr>
          <th>No.</th>
          <th>상담 과목</th>
          <th>상담 제목</th>
          <th>상담 학생</th>
          <th>상담 일</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="counselCount > 0">
          <tr v-for="counsel in counselList" :key="counsel.lecId" class="list-table-row">
            <td>
              {{ counsel.counselId }}
            </td>
            <td>
              {{ counsel.lecName }}
            </td>
            <td class="font-bold hover:underline" @click="counselDetail(counsel.counselId)">
              {{ counsel.counselTitle }}
            </td>
            <td>{{ counsel.counselStudentName }}</td>
            <td>
              {{ counsel.counselRegDate }}
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="4" class="list-empty-row">일치하는 검색 결과가 없습니다</td>
          </tr>
        </template>
      </tbody>
    </table>
    <PageNavigation
      :items-per-page="5"
      :total-items="counselCount"
      :on-page-change="counselSearch"
    />
  </div>
  <CounselModal
    v-if="modalState.isOpen && (modalState.type == 'manageCounsel' || 'manageCounselCreate')"
    :detail-id="detailId"
    :lecture-list="lectureList"
    @post-success="counselSearch"
    @un-mounted-modal="detailId = $event"
  />
</template>

<style scoped>
@import './styled.css';
</style>
