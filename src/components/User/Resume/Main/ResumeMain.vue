<script setup>
import PageNavigation from '@/components/common/PageNavigation.vue';
import { useModalState } from '@/stores/modalState';
import ResumeModal from '../Modal/ResumeModal.vue';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const modalState = useModalState();
const resumeLectureList = ref([]);
const resumeLectureCnt = ref(0);
const lecId = ref(0);

const resumeSearchList = (cPage = 1) => {
  const param = new URLSearchParams(route.query);
  param.append('currentPage', cPage);
  param.append('pageSize', 5);

  axios.post('/api/user/resumeLectureListBody.do', param).then((res) => {
    resumeLectureList.value = res.data.resumeLectureList;
    resumeLectureCnt.value = res.data.resumeLectureCnt;
  });
};

const opneModal = (id = 0) => {
  modalState.$patch({ isOpen: true, type: 'resume' });
  lecId.value = id;
};

watch(
  () => route.query,
  () => {
    resumeSearchList();
  },
);

onMounted(() => {
  resumeSearchList();
});
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
      <tbody id="resumeList" class="list-table-row">
        <tr v-for="resumeData in resumeLectureList" :key="resumeData.lecId">
          <td class="list-cell">{{ resumeData.lecId }}</td>
          <td
            class="list-cell cursor-pointer text-blue-600 hover:underline"
            @click="opneModal(resumeData.lecId)"
          >
            {{ resumeData.lecName }}
          </td>
          <td class="list-cell">{{ resumeData.lectureRound }}</td>
          <td class="list-cell">{{ resumeData.tutorName }}</td>
          <td class="list-cell">{{ resumeData.lecPersonnel }}</td>
          <td class="list-cell">{{ resumeData.lecStartDate }}</td>
          <td class="list-cell">{{ resumeData.lecEndDate }}</td>
          <!-- <td class="list-empty-row"></td> -->
        </tr>
      </tbody>
    </table>
    <ResumeModal v-if="modalState.isOpen && modalState.type === 'resume'" :lec-id="Number(lecId)" />
    <PageNavigation
      :total-items="resumeLectureCnt"
      :items-per-page="5"
      @page-change="resumeSearchList"
    />
  </div>
</template>
<style scoped>
@import './styled.css';
</style>
