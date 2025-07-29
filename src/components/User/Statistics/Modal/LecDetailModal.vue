<script setup>
import ContentBox from '@/components/common/ContentBox.vue';
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
        <ContentBox>강의 상세</ContentBox>
        <!-- s : 여기에 내용입력 -->
        <table class="modal-table">
          <tbody>
            <tr>
              <th>강의 이름</th>
              <td>
                {{ lecDetail.lecName }}
              </td>
              <th>담당 강사</th>
              <td>
                {{ lecDetail.lectureRound }}
              </td>
            </tr>
            <tr>
              <th>회차</th>
              <td>
                {{ lecDetail.tutorName }}
              </td>
              <th>정원</th>
              <td>
                {{ lecDetail.lecPersonnel }}
              </td>
            </tr>
            <tr>
              <th>개강 일자</th>
              <td>
                {{ String(lecDetail.lecStartDate).split(' ')[0] }}
              </td>
              <th>종강 일자</th>
              <td>
                {{ String(lecDetail.lecEndDate).split(' ')[0] }}
              </td>
            </tr>
            <tr>
              <th>평균 점수</th>
              <td>
                {{ lecDetail.avgScore > 0 ? lecDetail.avgScore : '미기재' }}
              </td>
              <th>과락 인원</th>
              <td>
                {{ lecDetail.failedStudents > 0 ? lecDetail.failedStudents : '없음' }}
              </td>
            </tr>
          </tbody>
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
