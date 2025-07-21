<script setup>
import PageNavigation from '@/components/common/PageNavigation.vue';
import axios from 'axios';
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import LecDetailModal from '../Modal/LecDetailModal.vue';
import { useModalState } from '@/stores/modalState';

const route = useRoute();
const statisticsLectureList = ref([]);
const statisticsLectureCnt = ref(0);
const lectureId = ref(0);
const modal = useModalState();

const statisticsListSearch = (cPage = 1) => {
  /*
    lectureName
    lectureStartAround
    lectureEndAround
    위 값을 route를 통해 받음
  */
  const param = new URLSearchParams(route.query);
  param.append('currentPage', cPage);
  param.append('pageSize', 5);

  // 해당 컨트롤러가 반환하는 데이터가 statistics와 같고 json 사용으로 편하게 하기 위해 해당 controller에 요청
  axios.post('/api/user/resumeLectureListBody.do', param).then((res) => {
    statisticsLectureList.value = res.data.resumeLectureList;
    statisticsLectureCnt.value = res.data.resumeLectureCnt;
  });
};

const lecDetail = (lecId) => {
  modal.$patch({ isOpen: true, type: 'lecDetail' });
  lectureId.value = lecId;
};

onMounted(() => {
  statisticsListSearch();
});

//StatisticsSearch에서 받아옴
watch(
  () => route.query,
  () => {
    statisticsListSearch();
  },
);
</script>
<template>
  <div class="notice-main-container">
    <table class="notice-table">
      <thead class="notice-table-header">
        <tr>
          <th scope="col">강의 번호</th>
          <th scope="col">강의 이름</th>
          <th scope="col">회차</th>
          <th scope="col">개강일</th>
          <th scope="col">종강일</th>
          <th scope="col">정원</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="statistics in statisticsLectureList" :key="statistics.lecId">
          <td class="notice-cell">{{ statistics.lecId }}</td>
          <td
            class="notice-cell cursor-pointer text-blue-600 hover:underline"
            @click="lecDetail(statistics.lecId)"
          >
            {{ statistics.lecName }}
          </td>
          <td class="notice-cell">{{ statistics.lectureRound }}</td>
          <td class="notice-cell">{{ statistics.lecStartDate }}</td>
          <td class="notice-cell">{{ statistics.lecEndDate }}</td>
          <td class="notice-cell">{{ statistics.lecPersonnel }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 페이징 처리 -->
    <PageNavigation
      :total-items="statisticsLectureCnt"
      :items-per-page="5"
      :on-page-change="statisticsListSearch"
    />
  </div>
  <LecDetailModal
    v-if="modal.isOpen && modal.type === 'lecDetail'"
    :lecture-id="Number(lectureId)"
  />
</template>
<style scoped>
@import './styled.css';
</style>
