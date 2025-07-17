<script setup>
import router from '@/router';
import axios from 'axios';
import { computed, onMounted, ref, watch } from 'vue';
import LecStatisticsModal from '../Modal/LecStatisticsModal.vue';
import { useModalState } from '@/stores/modalState';

const lecNameList = ref([]);
const lectureName = ref('');
const lectureStartRound = ref('');
const lectureEnsRound = ref('');
const roundRangeArr = ref('');
const modal = useModalState();

const get_LecNameSelectBox = () => {
  axios.post('/api/user/lecture-selectbox').then((res) => {
    lecNameList.value = res.data;
  });
};

const handlerStatisticsSearch = () => {
  const query = [];
  if (lectureName.value) {
    //C++, C#같은 문자가 있고 해당 문자는 구분자 취급될 수 있으므로 인코딩함
    const encodingValue = encodeURIComponent(lectureName.value);
    query.push(`lectureName=${encodingValue}`);
  }

  !lectureStartRound.value || query.push(`lectureStartAround=${lectureStartRound.value}`);
  !lectureEnsRound.value || query.push(`lectureEndAround=${lectureEnsRound.value}`);
  const queryString = query.length > 0 ? `?${query.join('&')}` : '';

  router.push(queryString);
};

// 회차 관련 정보 초기화
const resetRounds = (flag = true) => {
  lectureStartRound.value = '';
  lectureEnsRound.value = '';
  //document.getElementById('lectureStartRound').value = '';
  //document.getElementById('lectureEnsRound').value = '';
  // 강의 이름을 전체를 선택시에만 초기화
  if (flag) {
    filteredItems();
  }
};

// 강의 이름 선택시 해야할 기능
const getRoundRange = () => {
  // 1. 강의 이름을 전체를 선택 했을 시 전체 초기화 서버와 통신 필요 없으므로 종료
  if (!lectureName.value) {
    resetRounds();
    return;
  }

  // 2. 회차 정보를 가져옴, C++, C#같은 문자가 있고 해당 문자는 구분자 취급될 수 있으므로 인코딩함
  axios
    .post('/api/user/lecture-round-selectbox/' + encodeURIComponent(lectureName.value))
    .then((res) => {
      roundRangeArr.value = res.data;
      //roundRangeArr.value = res.data;
    });

  // 3. 호출 완료 후 html 요소 전체로 설정
  resetRounds(false);
};

// computed인 계산된 속성을 사용하여 디렉티브를 통해 dom 조작이 적합함
// 시작 회차가 지정되면 그에 맞게 종료 회차를 렌더링
const filteredItems = computed(() => {
  // 시작 회차가 '전체'이면
  if (lectureStartRound.value === '') {
    return [];
  } else {
    // 시작 배열이 특정 값을 선택하고 있으면 해당 값을 포함하여 더 큰 숫자만 보여줌. '전체'는 제외
    return roundRangeArr.value.filter((item) => item.lectureRound >= lectureStartRound.value);
  }
});

const lectureStatistics = () => {
  modal.$patch({ isOpen: true, type: 'lecStatistics' });
};

onMounted(() => {
  window.location.search && router.replace(window.location.pathname);
  get_LecNameSelectBox();
});

watch(filteredItems, (newfilteredItems) => {
  if (newfilteredItems.length > 0) {
    lectureEnsRound.value = newfilteredItems[0].lectureRound;
  } else {
    lectureEnsRound.value = '';
  }
});
</script>
<template>
  <div class="notice-container">
    <span>
      <span>
        강의 이름
        <select id="lectureList" v-model="lectureName" @change="getRoundRange">
          <!-- 아래 옵션의 value 속성을 ""로 맞추면 script의 !lectureName.value 구문에 의해 true로 인식되고(값이 없음) ||의 뒤의 명령문 실행 안함 -->
          <option value="" selected>전체</option>
          <option v-for="lecture in lecNameList" :key="lecture.lecId">
            {{ lecture.lecName }}
          </option>
        </select>
      </span>
      <span>
        회차
        <select id="lectureStartRound" v-model="lectureStartRound" @change="EnsRoundLimitation">
          <option value="" selected>전체</option>
          <option
            v-for="option in roundRangeArr"
            :key="option.lectureRound"
            :value="option.lectureRound"
          >
            {{ option.lectureRound }}회차
          </option>
        </select>
        ~
        <select id="lectureEnsRound" v-model="lectureEnsRound">
          <option v-if="filteredItems.length > 0 ? false : true" value="" selected>전체</option>
          <option
            v-for="option in filteredItems"
            :key="option.lectureRound"
            :value="option.lectureRound"
            name="lectureEns"
          >
            {{ option.lectureRound }}회차
          </option>
        </select>
      </span>
      <span>
        <button class="btnType" name="searchbtn" id="searchBtn" @click="handlerStatisticsSearch">
          검색
        </button>
        <!-- <a class="btnType" href="javascript:statistics();" name="modal"><span>통계</span></a> -->
        <button class="btnType" @click="lectureStatistics" name="modal">통계</button>
      </span>
    </span>
  </div>
  <LecStatisticsModal v-if="modal.isOpen && modal.type === 'lecStatistics'" />
</template>
<style scoped>
@import './styled.css';
</style>
