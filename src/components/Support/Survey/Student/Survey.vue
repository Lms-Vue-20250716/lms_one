<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

const options = ['매우 나쁨', '나쁨', '보통', '좋음', '매우 좋음'];
const lectureList = ref([]);

const selectedLecId = ref(0);
const survey = ref([]);
const surveyIndex = ref(0);
const isFinished = ref(false);
const answers = ref([]);

const handleSelect = () => {
  const param = new URLSearchParams();
  param.append('lecId', selectedLecId.value);
  axios.post('/api/support/getSurveyContents.do', param).then((res) => {
    survey.value = res.data;
    isFinished.value = false;
    surveyIndex.value = 0;
    answers.value = Array(res.data.length).fill('');
  });
};

const handlePrevious = () => {
  surveyIndex.value--;
};

const handleNext = () => {
  surveyIndex.value++;
};

const isCompletable = () => {
  return answers.value.every((x) => x !== '');
};

const handleComplete = () => {
  if (!confirm('제출하시겠습니까?')) {
    return;
  }

  answers.value.forEach((ans, idx) => {
    const param = new URLSearchParams();
    param.append('lecId', selectedLecId.value);
    param.append('surveyId', idx + 1); // 서버 설문 ID가 1부터 시작한다면
    param.append('surveyResult', options.indexOf(ans) + 1); // 1~5로 전송

    axios.post('/api/support/saveResult.do', param);
  });
  isFinished.value = true;
};

onMounted(() => {
  axios.post('/api/support/lecture-surveyJson').then((res) => {
    console.log(res.data);
    lectureList.value = res.data.lectures;
  });
});
</script>

<template>
  <div class="notice-main-container">
    <table class="notice-table">
      <tbody>
        <tr class="notice-table-row">
          <th class="notice-cell" style="background-color: beige">강의선택</th>
          <td class="notice-cell">
            <select v-model="selectedLecId" style="width: 100%" @change="handleSelect">
              <option :value="0">강의를 선택해주세요.</option>
              <option v-for="lecture in lectureList" :key="lecture.lecId" :value="lecture.lecId">
                {{ lecture.lecName }}
              </option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="w-full max-w-6xl overflow-hidden rounded-lg bg-white shadow-lg">
      <div class="mb-4">
        <p class="mb-2 font-semibold">설문조사</p>
        <p v-if="selectedLecId !== 0 && survey.length === 0" class="mb-2 font-semibold">
          이미 완료한 설문입니다.
        </p>
        <p v-else-if="selectedLecId === 0" class="mb-2 font-semibold">강의를 선택해 주세요.</p>
        <p v-else-if="isFinished" class="mb-2 font-semibold">수고하셨습니다.</p>
        <template v-else>
          <p class="mb-2 font-semibold">
            Q{{ surveyIndex + 1 }}.
            {{ survey[surveyIndex] }}
          </p>
          <div class="flex flex-wrap gap-4">
            <label v-for="option in options" :key="option" class="flex items-center gap-1">
              <input
                v-model="answers[surveyIndex]"
                type="radio"
                :value="option"
                class="accent-blue-600"
              />
              {{ option }}
            </label>
          </div>
        </template>
      </div>
      <button
        class="btn"
        :disabled="selectedLecId === 0 || surveyIndex === 0 || survey.length === 0 || isFinished"
        @click="handlePrevious"
      >
        이전
      </button>
      <button
        v-if="surveyIndex === survey.length - 1"
        class="btn"
        :disabled="isFinished || !isCompletable()"
        @click="handleComplete"
      >
        완료
      </button>
      <button
        v-else
        class="btn"
        :disabled="selectedLecId === 0 || survey.length === 0 || !answers[surveyIndex]"
        @click="handleNext"
      >
        다음
      </button>
    </div>
  </div>
</template>

<style scoped>
@import './styled.css';

.btn {
  @apply rounded border px-4 py-2 text-sm font-semibold transition duration-200;

  @apply border-gray-300 bg-white text-gray-800;

  &:disabled {
    @apply cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400;
  }

  &:hover:enabled {
    @apply bg-gray-200;
  }
}
</style>
