<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import router from '@/router';
import axios from 'axios';

const lecNameList = ref([]);
const lectureName = ref('');
const lectureStartRound = ref('');
const lectureEnsRound = ref('');
const roundRangeArr = ref([]);

const get_LecNameSelectBox = () => {
  axios.post('/api/user/lecture-selectbox').then((res) => {
    lecNameList.value = res.data;
  });
};

const handlerLectureSearch = () => {
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
  // 강의 이름을 전체를 선택시에만 초기화
  if (flag) {
    filteredItems();
  }
};

// 강의 이름 선택시 회차에 select할 요소 추가
const getRoundRange = () => {
  // 1. 이전 데이터와 무관하게 강의 이름을 '전체'로 선택 했을 시 빈값 전달
  // 빈 값이면, 서버와 통신 필요 없으므로 종료
  if (!lectureName.value) {
    // 1-1. 강의 이름을 전체로 선택했다면 두 회차 탭을 초기화
    // 1-2. false인자를 통해 종료 회차의 제약 사항(시작회차보다 이전 선택 불가능)을 계산후 반영
    resetRounds(false);
    return;
  }

  // 2. 회차 정보를 가져옴, C++, C#같은 문자가 있고 해당 문자는 구분자 취급될 수 있으므로 인코딩함
  axios
    .post('/api/user/lecture-round-selectbox/' + encodeURIComponent(lectureName.value))
    .then((res) => {
      roundRangeArr.value = res.data;
    });

  // 3. 호출 완료 후 html 요소 전체로 설정
  // 3-1. false인자를 통해 종료 회차의 제약 사항(시작회차보다 이전 선택 불가능)을 계산후 반영
  resetRounds(false);
};

// computed인 계산된 속성을 사용하여 디렉티브를 통해 dom 조작이 적합함
// 시작 회차가 지정되면 그에 맞게 종료 회차를 렌더링
const filteredItems = computed(() => {
  // 시작 회차가 '전체'이면 종료 회차도 '전체'여야 함
  if (lectureStartRound.value === '') {
    //빈 값을 반환하여 배열을 모두 비움 (시작회차랑 종료회차 모두 없어짐)
    return [];
  } else {
    // 시작 배열이 특정 값을 선택하고 있으면 해당 값을 포함하여 더 큰 숫자만 보여줌. '전체'는 제외
    // 해당 시점에서 roundRangeArr 배열의 모든 값이 시작회차
    // filteredItems으로 계산되어 반환된 배열이 종료회차임
    return roundRangeArr.value.filter((item) => item.lectureRound >= lectureStartRound.value);
  }
});

// 종료회차를 감시하여 해당 값의 변화가 있으면 그 첫번째 요소 선택
// 길이가 0이면 요소가 없으므로 기본값인 '전체'선택
watch(filteredItems, (newfilteredItems) => {
  if (newfilteredItems.length > 0) {
    lectureEnsRound.value = newfilteredItems[0].lectureRound;
  } else {
    lectureEnsRound.value = '';
  }
});

//강의 이름이 '전체'이면 값은 '', 모두 초기화
watch(lectureName, () => {
  if (lectureName.value === '') {
    lectureStartRound.value = '';
    lectureEnsRound.value = '';
    roundRangeArr.value = [];
  }
});

onMounted(() => {
  get_LecNameSelectBox();
  handlerLectureSearch();
});
</script>
<template>
  <div class="list-container">
    <div class="input-box">
      강의 이름
      <select v-model="lectureName" name="lec" @change="getRoundRange">
        <option value="" selected>전체</option>
        <option v-for="lecture in lecNameList" :key="lecture.lecId">
          {{ lecture.lecName }}
        </option>
      </select>
      회차
      <select v-model="lectureStartRound" name="lectureStartRound">
        <option value="" selected>전체</option>
        <option
          v-for="round in roundRangeArr"
          :key="round.lectureRound"
          :value="round.lectureRound"
        >
          {{ round.lectureRound }}회차
        </option>
      </select>
      ~
      <select v-model="lectureEnsRound" name="lectureEnsRound">
        <option v-if="filteredItems.length > 0 ? false : true" value="" selected>전체</option>
        <option
          v-for="round in filteredItems"
          :key="round.lectureRound"
          :value="round.lectureRound"
        >
          {{ round.lectureRound }}회차
        </option>
      </select>
      <button @click="handlerLectureSearch">검색</button>
    </div>
  </div>
</template>
<style scoped>
@import './styled.css';
</style>
