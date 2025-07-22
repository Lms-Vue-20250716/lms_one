<script setup>
import { useModalState } from '@/stores/modalState';
// import { useUserInfo } from '@/stores/userInfo';
import axios from 'axios';
import { computed, onMounted, ref, watch } from 'vue';

const emit = defineEmits(['postSuccess', 'unMountedModal']);
const props = defineProps({
  detailId: { type: Number, default: 0 },
  mode: { type: String, default: 'take' }, // 'take', 'result', 'edit'
  testId: { type: Number, default: 0 },
  lecId: { type: Number, default: 0 },
  studentId: { type: String, default: '' },
});

const modalState = useModalState();
// const userStore = useUserInfo();

const testData = ref({
  testQuestionInfoDetail: [],
  testQuestionOptionInfoDetail: [],
  testQuestionAnswerInfoDetail: [],
  testSubmitOptionDetailValue: [],
  testResultInfoValue: {},
});

const answers = ref([]);

// 모달 제목 계산
const modalTitle = computed(() => {
  switch (props.mode) {
    case 'take':
      return '시험 응시';
    case 'result':
      return '시험 결과';
    case 'edit':
      return '시험 수정';
    default:
      return '시험';
  }
});

// 제출 여부 확인
const isSubmitted = computed(() => {
  return (
    Array.isArray(testData.value.testSubmitOptionDetailValue) &&
    testData.value.testSubmitOptionDetailValue.length > 0
  );
});

// 제출 버튼 표시 여부
const showSubmitButton = computed(() => {
  return props.mode === 'take' && !isSubmitted.value;
});

// 시험 점수 계산 (디버깅 강화)
const testScore = computed(() => {
  console.log('=== testScore computed 실행됨 ===');
  console.log('현재 모드:', props.mode);

  if (props.mode !== 'result') {
    console.log('result 모드가 아님, null 반환');
    return null;
  }

  const { testQuestionInfoDetail, testQuestionAnswerInfoDetail, testSubmitOptionDetailValue } =
    testData.value;

  console.log('추출된 데이터:');
  console.log('- testQuestionInfoDetail:', testQuestionInfoDetail);
  console.log('- testQuestionAnswerInfoDetail:', testQuestionAnswerInfoDetail);
  console.log('- testSubmitOptionDetailValue:', testSubmitOptionDetailValue);

  // 데이터 존재 여부 확인
  if (
    !testQuestionInfoDetail ||
    !Array.isArray(testQuestionInfoDetail) ||
    testQuestionInfoDetail.length === 0
  ) {
    console.warn('testQuestionInfoDetail이 비어있거나 배열이 아닙니다:', testQuestionInfoDetail);
    return null;
  }

  if (!testQuestionAnswerInfoDetail || !Array.isArray(testQuestionAnswerInfoDetail)) {
    console.warn(
      'testQuestionAnswerInfoDetail이 비어있거나 배열이 아닙니다:',
      testQuestionAnswerInfoDetail,
    );
    return null;
  }

  if (!testSubmitOptionDetailValue || !Array.isArray(testSubmitOptionDetailValue)) {
    console.warn(
      'testSubmitOptionDetailValue이 비어있거나 배열이 아닙니다:',
      testSubmitOptionDetailValue,
    );
    console.log('제출된 답안이 없어서 점수 계산 불가');
    return {
      correctCount: 0,
      totalQuestions: testQuestionInfoDetail?.length || 0,
      earnedScore: 0,
      totalScore: 0,
      percentage: 0,
      noSubmission: true, // 제출 답안 없음을 표시
    };
  }

  console.log('=== testScore 계산 시작 ===');
  console.log('문제 수:', testQuestionInfoDetail.length);
  console.log('정답 데이터:', testQuestionAnswerInfoDetail);
  console.log('제출 답안 데이터:', testSubmitOptionDetailValue);

  let correctCount = 0;
  let totalQuestions = testQuestionInfoDetail.length;
  let totalScore = 0;
  let earnedScore = 0;

  testQuestionInfoDetail.forEach((question, index) => {
    const questionScore = parseInt(question.questionScore) || 0;
    totalScore += questionScore;

    console.log(`\n--- 문제 ${index + 1} (ID: ${question.questionId}) ---`);
    console.log('문제 점수:', questionScore);

    // 정답 찾기 (타입 변환 고려)
    const correctAnswer = testQuestionAnswerInfoDetail.find(
      (answer) => parseInt(answer.questionId) === parseInt(question.questionId),
    );

    // 제출된 답안 찾기 (타입 변환 고려)
    const submittedAnswer = testSubmitOptionDetailValue.find(
      (submit) => parseInt(submit.questionId) === parseInt(question.questionId),
    );

    console.log('정답 데이터:', correctAnswer);
    console.log('제출 답안:', submittedAnswer);

    if (!correctAnswer) {
      console.warn(`문제 ${question.questionId}의 정답을 찾을 수 없습니다`);
      return;
    }

    if (!submittedAnswer) {
      console.warn(`문제 ${question.questionId}의 제출 답안을 찾을 수 없습니다`);
      return;
    }

    // 정답 비교 (타입 변환 고려)
    const isCorrect =
      parseInt(correctAnswer.correctOptionId) === parseInt(submittedAnswer.optionId);
    console.log(
      `정답 옵션 ID: ${correctAnswer.correctOptionId}, 제출 옵션 ID: ${submittedAnswer.optionId}, 정답 여부: ${isCorrect}`,
    );

    if (isCorrect) {
      correctCount++;
      earnedScore += questionScore;
      console.log('정답! 획득 점수:', questionScore);
    } else {
      console.log('오답');
    }
  });

  const result = {
    correctCount,
    totalQuestions,
    earnedScore,
    totalScore,
    percentage: totalScore > 0 ? Math.round((earnedScore / totalScore) * 100) : 0,
  };

  console.log('=== 최종 결과 ===');
  console.log(result);

  return result;
});

// 현재 날짜시간 포맷
const getCurrentDateTime = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = ('0' + (now.getMonth() + 1)).slice(-2);
  const dd = ('0' + now.getDate()).slice(-2);
  const hh = ('0' + now.getHours()).slice(-2);
  const min = ('0' + now.getMinutes()).slice(-2);
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:00`;
};

// 답안 변경 처리
const handleAnswerChange = (questionId, optionId, questionData) => {
  const answerIndex = answers.value.findIndex((a) => a.questionId === questionId);
  const answerData = {
    questionId: parseInt(questionId),
    testId: parseInt(questionData.testId),
    lecId: parseInt(questionData.lecId),
    optionId: parseInt(optionId),
    studentId: props.studentId,
    submitDate: getCurrentDateTime(),
  };

  if (answerIndex >= 0) {
    answers.value[answerIndex] = answerData;
  } else {
    answers.value.push(answerData);
  }
};

// 답안 검증
const validateAnswers = () => {
  const unansweredQuestions = [];

  testData.value.testQuestionInfoDetail.forEach((question, index) => {
    const hasAnswer = answers.value.some((answer) => answer.questionId === question.questionId);
    if (!hasAnswer) {
      unansweredQuestions.push(`${index + 1}번`);
    }
  });

  return unansweredQuestions;
};

// 시험 제출 처리
const handleSubmit = async () => {
  if (props.mode !== 'take') return;

  const unanswered = validateAnswers();
  if (unanswered.length > 0) {
    alert(`다음 문항에 답변하지 않았습니다:\n${unanswered.join(', ')}`);
    return;
  }

  if (!confirm('정말로 시험을 제출하시겠습니까?')) {
    return;
  }

  try {
    const submitData = {
      answers: answers.value,
      lecId: props.lecId,
      testId: props.testId,
      studentId: props.studentId,
      submitDate: getCurrentDateTime(),
    };

    const response = await axios.post('/api/lecture/testTakeSubmit.do', submitData, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });

    if (response.data.result === 'success') {
      alert('시험이 성공적으로 제출되었습니다.');
      modalState.isOpen = false;
      emit('postSuccess');
    } else if (response.data.result === 'isExist') {
      alert('이미 제출된 시험입니다.');
      modalState.isOpen = false;
      emit('postSuccess');
    } else {
      alert('제출에 실패했습니다. 다시 시도해 주세요.');
    }
  } catch (error) {
    console.error('Submit error:', error);
    alert('제출 중 오류가 발생했습니다. 관리자에게 문의하세요.');
  }
};

// 시험 데이터 로드
const loadTestData = async () => {
  try {
    const endpoint =
      props.mode === 'result'
        ? '/api/lecture/testTakeSubmitResultDetail.do'
        : '/api/lecture/testQuestionNOptionInfoDetail.do';

    const params = {
      testId: props.testId,
      lecId: props.lecId,
      studentId: props.studentId,
    };
    const urlParam = new URLSearchParams(params);
    await axios.post(endpoint, urlParam).then((res) => {
      testData.value = res.data;
    });

    // 문제 존재 여부 확인
    if (
      testData.value.testQuestionInfoDetail.length === 0 &&
      testData.value.testQuestionOptionInfoDetail.length === 0
    ) {
      alert('문제가 아직 출제되지 않았습니다.');
      modalState.isOpen = false;
      return;
    }

    // 기존 제출 답안 로드
    if (
      testData.value.testSubmitOptionDetailValue &&
      Array.isArray(testData.value.testSubmitOptionDetailValue)
    ) {
      testData.value.testSubmitOptionDetailValue.forEach((submit) => {
        answers.value.push({
          questionId: submit.questionId,
          testId: submit.testId,
          lecId: submit.lecId,
          optionId: submit.optionId,
          studentId: submit.studentId,
          submitDate: submit.submitDate,
        });
      });
    }
  } catch (error) {
    console.error('Load test data error:', error);
    alert('데이터를 불러오는 중 오류가 발생했습니다.');
  }
};

// 옵션 선택 여부 확인
const isOptionSelected = (questionId, optionId) => {
  if (props.mode === 'result') {
    return testData.value.testSubmitOptionDetailValue.some(
      (submit) => submit.questionId === questionId && submit.optionId === optionId,
    );
  }
  return answers.value.some(
    (answer) => answer.questionId === questionId && answer.optionId === optionId,
  );
};

// 옵션 비활성화 여부 확인
const isOptionDisabled = () => {
  return props.mode === 'result' || isSubmitted.value;
};

// 정답 여부 확인
const isCorrectAnswer = (questionId, optionId) => {
  if (props.mode !== 'result') return false;
  const correctAnswer = testData.value.testQuestionAnswerInfoDetail.find(
    (answer) => answer.questionId === questionId,
  );
  return correctAnswer && correctAnswer.correctOptionId === optionId;
};

// 선택한 답안이 틀렸는지 확인
const isWrongAnswer = (questionId, optionId) => {
  if (props.mode !== 'result') return false;
  return isOptionSelected(questionId, optionId) && !isCorrectAnswer(questionId, optionId);
};

onMounted(() => {
  console.log(props.lecId);
  console.log(props.testId);
  console.log(props.studentId);

  loadTestData();
});

watch(
  () => props.detailId,
  () => {
    if (props.detailId > 0) {
      loadTestData();
    }
  },
);
</script>

<template>
  <div class="test-modal">
    <div class="modal-container">
      <div class="modal-header">
        <h3>{{ modalTitle }}</h3>
        <button @click="modalState.isOpen = false" class="close-btn">×</button>
      </div>

      <div class="modal-content">
        <!-- 결과 모드일 때 점수 표시 -->
        <div v-if="mode === 'result' && testScore" class="result-summary">
          <div class="result-header">시험 결과</div>
          <div class="result-item">
            <span class="result-label">채점 문제수/채점 점수</span>
            <span class="result-value">
              {{ testScore.correctCount }}/{{ testScore.totalQuestions }} ({{
                testScore.earnedScore
              }}/{{ testScore.totalScore }}점)
            </span>
          </div>
          <div class="result-item">
            <span class="result-label">전체 문제 수</span>
            <span class="result-value">{{ testScore.totalQuestions }}문제</span>
          </div>
          <div class="result-item">
            <span class="result-label">시험 제출일</span>
            <span class="result-value">{{
              testData.testResultInfoValue.testResultRegDate?.split('.')[0] || '2025-07-18 09:11:00'
            }}</span>
          </div>
        </div>

        <!-- 문제 목록 -->
        <div class="questions-container">
          <div
            v-for="question in testData.testQuestionInfoDetail"
            :key="question.questionId"
            class="question-box"
          >
            <div class="question-title">
              Q{{ question.questionNumber }}. {{ question.questionContent }}
              <span v-if="mode === 'result'"> ({{ question.questionScore }}점)</span>
            </div>

            <div class="question-options">
              <div
                v-for="option in testData.testQuestionOptionInfoDetail.filter(
                  (opt) => opt.questionId === question.questionId,
                )"
                :key="option.optionId"
                class="option-item"
                :class="{
                  'correct-answer':
                    mode === 'result' && isCorrectAnswer(question.questionId, option.optionId),
                  'wrong-answer':
                    mode === 'result' && isWrongAnswer(question.questionId, option.optionId),
                }"
              >
                <label>
                  <input
                    type="radio"
                    :name="`question_${question.questionId}`"
                    :value="option.optionId"
                    :checked="isOptionSelected(question.questionId, option.optionId)"
                    :disabled="isOptionDisabled(question.questionId, option.optionId)"
                    @change="handleAnswerChange(question.questionId, option.optionId, question)"
                  />
                  보기{{ option.optionId }}. {{ option.optionContent }}
                  <span
                    v-if="
                      mode === 'result' && isCorrectAnswer(question.questionId, option.optionId)
                    "
                    class="correct-mark"
                  >
                    (정답)
                  </span>
                  <span
                    v-else-if="
                      mode === 'result' && isWrongAnswer(question.questionId, option.optionId)
                    "
                    class="wrong-mark"
                  >
                    (오답)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button v-if="showSubmitButton" @click="handleSubmit" class="btn-submit">제출</button>
        <button @click="modalState.isOpen = false" class="btn-cancel">취소</button>
      </div>
    </div>
  </div>
</template>
<style>
@import './styled.css';
</style>
