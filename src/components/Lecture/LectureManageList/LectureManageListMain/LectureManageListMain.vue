<script setup>
import PageNavigation from '@/components/common/PageNavigation.vue';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useModalState } from '@/stores/modalState';
import LectureManageListMoadal from '../LectureManageListModal/LectureManageListMoadal.vue';

const route = useRoute();
const lectureList = ref([]);
const lectureCount = ref(0);
const modalState = useModalState();
const detailId = ref(0);

const lectureSearch = (cPage = 1) => {
  const param = new URLSearchParams(route.query);
  param.append('currentPage', cPage);
  param.append('pageSize', 5);

  axios.post('/api/lecture/lectureManageListBody.do', param).then((res) => {
    if (route.query.searchStDate > route.query.searchEdDate) {
      alert('잘못된 강의기간 조회입니다. 조회 날짜를 확인해주세요.');
    } else {
      lectureList.value = res.data.lectureManageList;
      lectureCount.value = res.data.lectureManageCnt;
    }
  });
};

const lectureDetail = (id) => {
  modalState.$patch({ isOpen: true });
  detailId.value = id;
};

watch(
  () => route.query,
  () => {
    lectureSearch();
  },
);

onMounted(() => {
  lectureSearch();
});
</script>

<template>
  <div class="notice-main-container">
    <table class="notice-table">
      <thead class="notice-table-header">
        <tr>
          <th>강의명</th>
          <th>강사</th>
          <th>강의 시작일</th>
          <th>강의 종료일</th>
          <th>정원</th>
          <th>강의실</th>
          <th>강의계획서</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="lectureCount > 0">
          <tr v-for="lecture in lectureList" :key="lecture.lecId" class="list-table-row">
            <td class="font-bold hover:underline" @click="lectureDetail(lecture.lecId)">
              {{ lecture.lecName }}
            </td>
            <td>{{ lecture.lecInstructorName }}</td>
            <td>{{ lecture.lecStartDate.substr(0, 10) }}</td>
            <td>{{ lecture.lecEndDate.substr(0, 10) }}</td>
            <td>{{ lecture.lecPersonnel }}</td>
            <td>{{ lecture.lecRoomName }}</td>
            <td><button>강의계획서보기</button></td>
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
      :total-items="lectureCount"
      :on-page-change="lectureSearch"
    />
  </div>
  <LectureManageListMoadal
    v-if="modalState.isOpen"
    :detail-id="detailId"
    @post-success="lectureSearch"
    @un-mounted-modal="detailId = $event"
  />
</template>

<!-- <style>
@import './styled.css';
</style> -->
