<script setup>
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, ref } from 'vue';

const statisticsDatas = ref([]);
const modalState = useModalState();
const props = defineProps({
  lec: {
    type: String,
    default: '',
    require: true,
  },
  lectureStartRound: {
    type: Number,
    default: 0,
    require: true,
  },
  lectureEnsRound: {
    type: Number,
    default: 0,
    require: true,
  },
});

const modalClose = () => {
  modalState.$patch({ isOpen: false, type: null });
};

// 데이터 가져오기
const lactureStatistics = () => {
  const param = new URLSearchParams();
  param.append('lectureName', props.lec);
  param.append('lectureStartAround', props.lectureStartRound);
  param.append('lectureEndAround', props.lectureEnsRound);
  axios.post('/api/user/lacture-statistics/', param).then((res) => {
    console.log(res.data);
    statisticsDatas.value = res.data;
  });
};

// 차트 기능 구현
onMounted(() => {
  lactureStatistics();
});
</script>
<template>
  <!-- 강의 통계 모달 -->
  <Teleport to="body">
    <div class="modal-overlay">
      <label>강의 통계</label>
      <div class="modal-container-statistics">
        <table class="col">
          <thead>
            <tr>
              <th scope="col">강의 번호</th>
              <th scope="col">강의 이름</th>
              <th scope="col">강사 이름</th>
              <th scope="col">회차</th>
              <th scope="col">개강일</th>
              <th scope="col">종강일</th>
              <th scope="col">정원</th>
              <th scope="col">평균 점수</th>
              <th scope="col">최고 점수</th>
              <th scope="col">최저 점수</th>
              <th scope="col">과락 인원</th>
            </tr>
          </thead>
          <tbody id="statisticsPage"></tbody>
        </table>

        <div class="charts">
          <canvas id="chartStudentPersonnel"></canvas>
          <canvas id="chartFaildStudent"></canvas>
        </div>
        <button class="closePop" @click="modalClose"><span>닫기</span></button>
      </div>
    </div>
  </Teleport>
</template>
<style scoped>
@import './styled.css';
</style>
