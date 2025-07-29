<script setup>
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import ContentBox from '@/components/common/ContentBox.vue';

Chart.register(
  BarController, // 막대 차트 컨트롤러
  BarElement, // 막대 요소
  CategoryScale, // 범주형 X축 (대부분 막대, 선 차트에 필요)
  LinearScale, // 선형 Y축 (대부분 막대, 선 차트에 필요)
  Tooltip, // 툴팁 기능 (선택 사항이지만 유용)
  Legend, // 범례 기능 (선택 사항이지만 유용)
);

// **모달 관련**
const rendering = ref(true);
const statisticsInfoList = ref([]);
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
  document.body.style.overflow = 'visible';
  modalState.$patch({ isOpen: false, type: null });
};

// 데이터 가져오기
const lactureStatistics = () => {
  const param = new URLSearchParams();
  props.lec && param.append('lectureName', props.lec);
  props.lectureStartRound && param.append('lectureStartAround', props.lectureStartRound);
  props.lectureEnsRound && param.append('lectureEndAround', props.lectureEnsRound);

  if (props.lec === '') {
    rendering.value = false;
    return;
  } else {
    rendering.value = true;
  }
  axios
    .post('/api/user/lacture-statistics/', param)
    .then((res) => {
      statisticsInfoList.value = res.data;
    })
    .catch(() => {});
};

// **차트 관련**
// 차트 기능 구현
const charDraw = () => {
  const ctxStudentPersonnel = document.getElementById('chartStudentPersonnel');
  const ctxFaildStudent = document.getElementById('chartFaildStudent');
  const attendClassPersonData = {
    labels: [],
    datasets: [
      {
        label: '수강 인원',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const failPersonChartData = {
    labels: [],
    datasets: [
      {
        label: '과락 인원',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  let findMaxValue = [];
  statisticsInfoList.value.forEach((statisticsInfo) => {
    attendClassPersonData.labels.push(statisticsInfo.lectureRound + '회');
    attendClassPersonData.datasets[0].data.push(statisticsInfo.lecPersonnel);

    failPersonChartData.labels.push(statisticsInfo.lectureRound + '회');
    failPersonChartData.datasets[0].data.push(statisticsInfo.failedStudents);

    findMaxValue.push(statisticsInfo.lecPersonnel);
  });

  const totalPerson = new Chart(ctxStudentPersonnel, {
    type: 'bar',
    data: attendClassPersonData,
    options: {
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 5,
          },
          beginAtZero: true,
        },
      },
    },
  });
  const failSutdent = new Chart(ctxFaildStudent, {
    type: 'bar',
    data: failPersonChartData,
    options: {
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 5,
          },
          beginAtZero: true,
        },
      },
    },
  });

  totalPerson.options.scales.y.max = Math.max(...findMaxValue);
  failSutdent.options.scales.y.max = Math.max(...findMaxValue);

  totalPerson.update();
  failSutdent.update();
};

// ** 컴포넌트 생명주기**
// 모달 생성시 실행
onMounted(() => {
  document.body.style.overflow = 'hidden';
  lactureStatistics();
});

watch(
  () => statisticsInfoList.value,
  () => {
    charDraw();
  },
);
</script>
<template>
  <!-- 강의 통계 모달 -->
  <Teleport to="body">
    <div class="modal-overlay">
      <div v-if="rendering" class="modal-container-statistics">
        <ContentBox>강의 통계</ContentBox>
        <div class="rounded-element">
          <table class="statistics-table">
            <colgroup>
              <col style="width: 9%" />
              <col style="width: 9%" />
              <col style="width: 9%" />
              <col style="width: 1%" />
              <col style="width: 15%" />
              <col style="width: 15%" />
              <col style="width: 1%" />
              <col style="width: 10%" />
              <col style="width: 10%" />
              <col style="width: 10%" />
              <col style="width: 10%" />
            </colgroup>
            <thead class="statistics-table-header">
              <tr>
                <th>강의 번호</th>
                <th>강의 이름</th>
                <th>강사 이름</th>
                <th>회차</th>
                <th>개강일</th>
                <th>종강일</th>
                <th>정원</th>
                <th>평균 점수</th>
                <th>최고 점수</th>
                <th>최저 점수</th>
                <th>과락 인원</th>
              </tr>
            </thead>
            <tbody id="statisticsPage" class="statistics-table-row">
              <tr v-for="statisticsInfo in statisticsInfoList" :key="statisticsInfo.lecId">
                <td class="statistics-cell">{{ statisticsInfo.lecId }}</td>
                <td class="statistics-cell">{{ statisticsInfo.lecName }}</td>
                <td class="statistics-cell">{{ statisticsInfo.tutorName }}</td>
                <td class="statistics-cell">{{ statisticsInfo.lectureRound }}</td>
                <td class="statistics-cell">{{ statisticsInfo.lecStartDate.split(' ')[0] }}</td>
                <td class="statistics-cell">{{ statisticsInfo.lecEndDate.split(' ')[0] }}</td>
                <td class="statistics-cell">{{ statisticsInfo.lecPersonnel }}</td>
                <td class="statistics-cell">{{ statisticsInfo.avgScore }}</td>
                <td class="statistics-cell">{{ statisticsInfo.maxScore }}</td>
                <td class="statistics-cell">{{ statisticsInfo.minScore }}</td>
                <td class="statistics-cell">{{ statisticsInfo.failedStudents }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="scrollable-area">
          <div class="charts">
            <ContentBox>수강인원</ContentBox>
            <canvas id="chartStudentPersonnel"></canvas>
            <ContentBox>과락인원</ContentBox>
            <canvas id="chartFaildStudent"></canvas>
          </div>
        </div>
        <div class="button-container">
          <button class="closePop" @click="modalClose">닫기</button>
        </div>
      </div>
      <div v-else class="modal-container-error">
        <ContentBox>오류</ContentBox>
        <strong class="centered-div-flex"
          >통계를 내고자 하는 데이터를 선택해주세요. '전체'는 허용하지 않습니다.</strong
        >
        <div class="button-container">
          <button class="closePop" @click="modalClose">닫기</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<style scoped>
@import './styled.css';
</style>
