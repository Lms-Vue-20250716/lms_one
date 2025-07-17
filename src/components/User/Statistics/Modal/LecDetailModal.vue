<script setup>
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, ref } from 'vue';

const modalState = useModalState();
const lecDetail = ref('');

const props = defineProps({
  lectureId: {
    type: Number,
    default: 0,
    require: true,
  },
});

const lectureDetail = () => {
  axios.post('/api/user/lec-detail/' + props.lectureId).then((res) => {
    lecDetail.value = res.data;
  });
};

const modalClose = () => {
  modalState.$patch({ isOpen: false, type: null });
};

onMounted(() => {
  lectureDetail();
});
</script>

<template>
  <!-- 강의 상세 모달 -->
  <Teleport to="body">
    <div id="lecDetailModal" class="modal-overlay">
      <div class="modal-container-detail">
        <label>강의 상세</label>
        <!-- s : 여기에 내용입력 -->
        <table class="modal-table">
          <thead>
            <tr>
              <th scope="row">강의 이름</th>
              <td colspan="3">
                {{ lecDetail.lecName }}
              </td>

              <th scope="row">회차</th>
              <td colspan="3">
                {{ lecDetail.lectureRound }}
              </td>
            </tr>
            <tr>
              <th scope="row">담당 강사</th>
              <td colspan="3">
                {{ lecDetail.tutorName }}
              </td>

              <th scope="row">정원</th>
              <td colspan="3">
                {{ lecDetail.lecPersonnel }}
              </td>
            </tr>
            <tr>
              <th scope="row">개강 일자</th>
              <td colspan="3">
                {{ lecDetail.lecStartDate }}
              </td>

              <th scope="row">종강 일자</th>
              <td colspan="3">
                {{ lecDetail.lecEndDate }}
              </td>
            </tr>

            <tr>
              <th scope="row">평균 점수</th>
              <td colspan="3">
                {{ lecDetail.avgScore }}
              </td>

              <th scope="row">과락 인원</th>
              <td colspan="3">
                {{ lecDetail.failedStudents }}
              </td>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <div class="button-container">
          <button @click="modalClose">닫기</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<style scoped>
@import './styled.css';
</style>
