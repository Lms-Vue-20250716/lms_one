<script>
import { ref, reactive, computed, watch } from 'vue';
import axios from 'axios';

export default {
  name: 'TestQuestionInfoDetailModal',
  props: {
    userType: {
      type: String,
      default: '',
    },
    loginId: {
      type: String,
      default: '',
    },
  },
  emits: ['post-success'],
  setup(props, { emit }) {
    // 반응형 데이터
    const showModal = ref(false);
    const testId = ref('');
    const lecId = ref('');
    const maxQuestionCount = ref('');
    const totalMaxScore = ref('');
    const modalTitle = ref('시험 상세');

    // 문제 등록 폼 데이터
    const questionForm = reactive({
      content: '',
      score: '',
      choices: ['', '', '', '', ''],
      correctAnswer: '1번',
    });

    // 원본 데이터 보관
    const originalQuestionData = reactive({
      questionList: [],
      optionList: [],
      answerList: [],
    });

    // 화면 표시용 문제 목록
    const displayQuestions = ref([]);

    // 강사 여부 확인
    const isInstructor = ref(false);

    // 계산된 속성들
    const maxQuestionCountDisabled = computed(() => {
      return isInstructor.value || displayQuestions.value.length > 0;
    });

    const deleteHeaderText = computed(() => {
      return isInstructor.value ? '삭제' : '삭제';
    });

    const questionListTitle = computed(() => {
      return '문제 추가 목록';
    });

    const showQuestionRegistration = computed(() => {
      return !isInstructor.value;
    });

    const showSaveButton = computed(() => {
      return !isInstructor.value && displayQuestions.value.length === 0;
    });

    const showUpdateButton = computed(() => {
      return !isInstructor.value && displayQuestions.value.length > 0;
    });

    // 총점 자동 계산
    watch(
      displayQuestions,
      (newQuestions) => {
        const total = newQuestions.reduce((sum, question) => {
          return sum + parseInt(question.score || 0, 10);
        }, 0);
        totalMaxScore.value = total;
      },
      { deep: true },
    );

    // 메서드들
    const openModal = async (testIdParam, lecIdParam) => {
      testId.value = testIdParam;
      lecId.value = lecIdParam;

      try {
        const response = await fetchTestQuestionDetail(testIdParam, lecIdParam);
        processTestQuestionData(response);
        showModal.value = true;
      } catch (error) {
        alert('기존 문제 정보를 불러오지 못했습니다.\n인터넷 연결 또는 서버 상태를 확인하세요.');
      }
    };

    const fetchTestQuestionDetail = async (testIdParam, lecIdParam) => {
      const param = {
        lecId: lecIdParam,
        testId: testIdParam,
      };

      const response = await axios.post('/api/lecture/testQuestionInfoDetail.do', param, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      });

      return response.data;
    };

    const processTestQuestionData = (res) => {
      const lecInstructorId = res.lecInstructorId;
      const questionList = res.testQuestionInfoDetail;
      const optionList = res.testQuestionOptionInfoDetail;
      const answerList = res.testQuestionAnswerInfoDetail;

      // 강사 여부 확인
      isInstructor.value = props.userType === 'T' && props.loginId === lecInstructorId;

      // 원본 데이터 저장
      originalQuestionData.questionList = questionList;
      originalQuestionData.optionList = optionList;
      originalQuestionData.answerList = answerList;

      // 화면 초기화
      resetModalData();

      if (questionList && questionList.length > 0) {
        processQuestionList(questionList, optionList, answerList);
      } else {
        handleNoQuestions();
      }
    };

    const resetModalData = () => {
      displayQuestions.value = [];
      maxQuestionCount.value = '';
      totalMaxScore.value = '';
      questionForm.content = '';
      questionForm.score = '';
      questionForm.choices = ['', '', '', '', ''];
      questionForm.correctAnswer = '1번';
    };

    const processQuestionList = (questionList, optionList, answerList) => {
      const questions = [];

      for (let i = 0; i < questionList.length; i++) {
        const question = questionList[i];
        const questionId = question.questionId;

        // 해당 문제의 보기들 추출
        const choices = optionList
          .filter((option) => option.questionId === questionId)
          .map((option) => ({
            id: option.optionId,
            content: option.optionContent,
          }));

        // 해당 문제의 정답 찾기
        const answerData = answerList.find((answer) => answer.questionId === questionId);
        const correctOptionId = answerData ? answerData.correctOptionId : null;

        // 화면에 표시할 문제 객체 구성
        const questionObj = {
          id: questionId,
          content: question.questionContent,
          score: question.questionScore,
          correct: correctOptionId,
          choices: choices,
          showChoices: false,
          remark: question.remark || '',
        };

        questions.push(questionObj);
      }

      displayQuestions.value = questions;
      maxQuestionCount.value = questions.length;
    };

    const handleNoQuestions = () => {
      if (isInstructor.value) {
        alert('아직 등록된 문제가 없습니다.\n시험 문제를 등록해주세요.');
        closeModal();
        emit('post-success');
      } else {
        alert('아직 등록된 문제가 없습니다.\n시험 문제를 등록해주세요.');
      }
    };

    const addQuestion = () => {
      // 폼 검증
      if (!questionForm.content.trim()) {
        alert('문제 내용을 입력해주세요.');
        return;
      }
      if (!questionForm.score) {
        alert('점수를 입력해주세요.');
        return;
      }

      // 보기 검증
      const validChoices = questionForm.choices.filter((choice) => choice.trim());
      if (validChoices.length < 2) {
        alert('최소 2개의 보기를 입력해주세요.');
        return;
      }

      // 문제 추가
      const newQuestion = {
        id: Date.now(), // 임시 ID
        content: questionForm.content,
        score: parseInt(questionForm.score),
        choices: questionForm.choices
          .map((choice, index) => ({
            id: index + 1,
            content: choice,
          }))
          .filter((choice) => choice.content.trim()),
        correct: parseInt(questionForm.correctAnswer.replace('번', '')),
        showChoices: false,
        remark: '',
      };

      displayQuestions.value.push(newQuestion);

      // 폼 초기화
      questionForm.content = '';
      questionForm.score = '';
      questionForm.choices = ['', '', '', '', ''];
      questionForm.correctAnswer = '1번';
    };

    const deleteQuestion = (index) => {
      if (confirm('이 문제를 삭제하시겠습니까?')) {
        displayQuestions.value.splice(index, 1);
      }
    };

    const saveTestQuestionInfo = async () => {
      try {
        const lectureId = lecId.value;
        const testIdValue = testId.value;
        const questions = displayQuestions.value;

        // 사용자 입력 최대 문제 수 및 총 만점
        const maxQuestions = parseInt(maxQuestionCount.value, 10);
        const maxTotalScore = parseInt(totalMaxScore.value, 10);

        // 문제 수 검사
        if (questions.length === 0) {
          alert('문제를 하나 이상 추가해주세요.');
          return;
        }

        if (questions.length > maxQuestions) {
          alert(`최대 문제 수(${maxQuestions}개)를 초과했습니다.`);
          return;
        } else if (questions.length < maxQuestions) {
          alert(`최대 문제 수(${maxQuestions}개)보다 미만입니다.`);
          return;
        }

        // 총 배점 검사
        const totalScore = questions.reduce(
          (sum, question) => sum + parseInt(question.score || 0, 10),
          0,
        );
        if (totalScore !== maxTotalScore) {
          alert(`총 배점이 ${maxTotalScore}점이 되어야 합니다. 현재 합계는 ${totalScore}점입니다.`);
          return;
        }

        const questionList = [];
        const optionList = [];
        const answerList = [];

        questions.forEach((question, index) => {
          const questionNo = index + 1;
          const questionId = lectureId + testIdValue + questionNo;

          // 시험문제리스트
          questionList.push({
            lecId: lectureId,
            testId: testIdValue,
            questionId: questionId,
            questionScore: question.score,
            questionNumber: questionNo,
            questionContent: question.content,
          });

          // 시험문제보기리스트
          question.choices.forEach((choice, choiceIndex) => {
            const optionNo = choiceIndex + 1;
            optionList.push({
              lecId: lectureId,
              testId: testIdValue,
              questionId: questionId,
              optionId: optionNo,
              optionContent: choice.content,
            });
          });

          // 시험문제답리스트
          answerList.push({
            lecId: lectureId,
            testId: testIdValue,
            questionId: questionId,
            correctOptionId: question.correct,
          });
        });

        const param = {
          questionList: questionList,
          optionList: optionList,
          answerList: answerList,
        };

        const response = await axios.post('/api/lecture/testQuestionsInfoSave.do', param, {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
        });

        if (response.data.result === 'success') {
          alert('저장이 완료되었습니다.');
          closeModal();
          emit('post-success');
        } else {
          alert('저장 실패하였습니다.');
        }
      } catch (error) {
        alert('서버 오류가 발생했습니다.');
      }
    };

    const updateTestQuestionInfo = () => {
      // 수정 로직 - saveTestQuestionInfo와 동일하게 처리
      saveTestQuestionInfo();
    };

    const closeModal = () => {
      showModal.value = false;
      resetModalData();
    };

    // 외부에서 호출할 수 있도록 expose
    return {
      // 반응형 데이터
      showModal,
      maxQuestionCount,
      totalMaxScore,
      modalTitle,
      displayQuestions,
      isInstructor,
      questionForm,

      // 계산된 속성
      maxQuestionCountDisabled,
      deleteHeaderText,
      questionListTitle,
      showQuestionRegistration,
      showSaveButton,
      showUpdateButton,

      // 메서드
      openModal,
      addQuestion,
      deleteQuestion,
      saveTestQuestionInfo,
      updateTestQuestionInfo,
      closeModal,
    };
  },
};
</script>

<template>
  <div>
    <!-- 모달 오버레이 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <!-- 모달 헤더 -->
        <div class="modal-header">
          <h3>{{ modalTitle }}</h3>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>

        <div class="modal-body">
          <!-- 문제 등록 섹션 -->
          <div class="question-form-section">
            <h4>문제 등록</h4>

            <!-- 상단 입력 그룹 -->
            <div class="top-input-row">
              <div class="input-group">
                <label>최대 문제 수</label>
                <input
                  v-model="maxQuestionCount"
                  :disabled="maxQuestionCountDisabled"
                  type="number"
                  class="form-input"
                />
              </div>

              <div class="input-group">
                <label>총점</label>
                <input v-model="totalMaxScore" type="number" readonly class="form-input" />
              </div>

              <div class="input-group">
                <label>점수</label>
                <input v-model="questionForm.score" type="number" class="form-input" />
              </div>

              <div class="input-group">
                <label>정답 보기</label>
                <select v-model="questionForm.correctAnswer" class="form-select">
                  <option>1번</option>
                  <option>2번</option>
                  <option>3번</option>
                  <option>4번</option>
                  <option>5번</option>
                </select>
              </div>
            </div>

            <!-- 문제 내용 -->
            <div class="content-row">
              <div class="input-group full-width">
                <label>문제 내용</label>
                <textarea
                  v-model="questionForm.content"
                  class="form-textarea"
                  rows="3"
                  placeholder="문제 내용을 입력하세요"
                ></textarea>
              </div>
            </div>

            <!-- 보기 입력 -->
            <div class="choices-section">
              <div v-for="(choice, index) in questionForm.choices" :key="index" class="choice-row">
                <label>보기{{ index + 1 }}</label>
                <input
                  v-model="questionForm.choices[index]"
                  type="text"
                  class="form-input choice-input"
                  :placeholder="`보기 ${index + 1} 내용`"
                />
              </div>
            </div>

            <!-- 문제 추가 버튼 -->
            <div class="add-button-section">
              <button @click="addQuestion" class="btn btn-primary">문제 추가</button>
            </div>
          </div>

          <!-- 문제 목록 섹션 -->
          <div class="question-list-section">
            <h4>{{ questionListTitle }}</h4>

            <div class="table-container">
              <table class="question-table">
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>내용</th>
                    <th>배점</th>
                    <th>정답</th>
                    <th>삭제</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(question, index) in displayQuestions" :key="question.id">
                    <td>{{ index + 1 }}</td>
                    <td class="content-cell">{{ question.content }}</td>
                    <td>{{ question.score }}</td>
                    <td>{{ question.correct }}번</td>
                    <td>
                      <button @click="deleteQuestion(index)" class="btn btn-danger btn-sm">
                        삭제
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 모달 푸터 -->
        <div class="modal-footer">
          <button v-if="showSaveButton" @click="saveTestQuestionInfo" class="btn btn-success">
            저장
          </button>
          <button v-if="showUpdateButton" @click="updateTestQuestionInfo" class="btn btn-primary">
            수정
          </button>
          <button @click="closeModal" class="btn btn-secondary">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
@import './styled2.css';
</style>
