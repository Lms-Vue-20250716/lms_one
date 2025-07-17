<script setup>
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useUserInfo } from '@/stores/loginInfoState';

const modalState = useModalState();
const { detailId: id } = defineProps({ detailId: { type: Number, default: 0 } });
const detail = ref({});
const userStore = useUserInfo();
const lecWeekPlanList = ref([]);
const isLectureRegist = ref();

const searchDetail = () => {
  const param = new URLSearchParams();
  param.append('lecId', id);
  axios.post('/api/lecture/lectureDetail.do', param).then((res) => {
    detail.value = res.data.lectureDetailValue;
    lecWeekPlanList.value = detail.value.lecWeekPlanList;
    isLectureRegist.value = res.data.isLectureRegistrationAvailable;
  });
};

const lectureRegister = () => {
  const param = new URLSearchParams();
  param.append('lecId', id);
  param.append('studentId', userStore.user.loginId);

  axios.post('/api/lecture/lectureStdRegister.do', param).then((res) => {
    if (res.data.result === 'success') {
      alert('신청되었습니다.');
      modalState.$patch({ isOpen: false });
    } else if (res.data.result === 'loginIdNotExist') {
      alert('학생정보가 등록되어 있지 않아 수강 신청할 수 없습니다.관리자에게 문의하시오.');
    } else if (res.data.result === 'lecIdAlreadyExist') {
      alert('이미 수강 신청한 강의입니다.');
    } else if (res.data.result === 'lecExceedsCapacity') {
      alert('현재 수강 인원이 모두 마감되었습니다. 다른 강의를 확인해 주세요.');
    }
  });
};

onMounted(() => {
  id && searchDetail();
});
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay">
      <form ref="formRef" class="modal-form modal-container">
        <table>
          <tbody>
            <tr>
              <th colspan="4" class="left-align">
                <h2>강의 상세</h2>
              </th>
            </tr>

            <tr>
              <th>강의</th>
              <td>{{ detail.lecName }}</td>
            </tr>

            <tr>
              <th>강사</th>
              <td>{{ detail.lecInstructorName }}</td>
              <th>강의실<span style="color: red">*</span></th>
              <td>{{ detail.lecRoomName }}</td>
            </tr>

            <tr>
              <th>이메일</th>
              <td>{{ detail.insEmail }}</td>
              <th>연락처</th>
              <td>{{ detail.insHp }}</td>
            </tr>

            <tr>
              <th>강의 시작일</th>
              <td>{{ detail.lecStartDate }}</td>
              <th>강의 종료일</th>
              <td>{{ detail.lecEndDate }}</td>
            </tr>

            <tr>
              <th>정원</th>
              <td>{{ detail.lecPersonnel }}</td>
              <th>강의 일수(주차)</th>
              <td>{{ detail.lecDaysCnt }} ({{ detail.lecSectionCnt }}주차)</td>
            </tr>
          </tbody>
        </table>
        <hr />
        <div>
          <table>
            <tbody>
              <tr>
                <th colspan="4" class="left-align">
                  <h2>강의 계획</h2>
                </th>
              </tr>

              <!-- 강의 목표 -->
              <tr>
                <th colspan="4">강의목표<span style="color: red">*</span></th>
              </tr>
              <template v-if="detail.lecGoal && detail.lecGoal.length > 0">
                <tr>
                  <td>
                    {{ detail.lecGoal }}
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td>'아직 입력된 정보가 없습니다.'</td>
                </tr>
              </template>

              <!-- 강의 내용 -->
              <tr>
                <th colspan="4">강의내용<span style="color: red">*</span></th>
              </tr>
              <template v-if="detail.lecContent && detail.lecContent.length > 0">
                <tr>
                  <td>
                    {{ detail.lecContent }}
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td>'아직 입력된 정보가 없습니다.'</td>
                </tr>
              </template>

              <!-- 강의 기타사항 -->
              <tr>
                <th colspan="4">강의기타사항<span style="color: red">*</span></th>
              </tr>
              <template v-if="detail.lectureSpecifics && detail.lectureSpecifics.length > 0">
                <tr>
                  <td>
                    {{ detail.lectureSpecifics }}
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td>'아직 입력된 정보가 없습니다.'</td>
                </tr>
              </template>
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th>주차</th>
                <th>학습 목표</th>
                <th>학습 내용</th>
              </tr>
            </thead>
            <tbody v-if="lecWeekPlanList.length > 0">
              <tr v-for="lecWeekPlan in lecWeekPlanList" :key="lecWeekPlan.lecWeekRound">
                <td>{{ lecWeekPlan.lecWeekRound }}주차</td>
                <td>{{ lecWeekPlan.lecWeekGoal || '' }}</td>
                <td>{{ lecWeekPlan.lecWeekContent || '' }}</td>
              </tr>
            </tbody>

            <tbody v-else>
              <tr v-for="i in detail.lecSectionCnt" :key="i">
                <td>{{ i }}주차</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="button-container">
          <button
            v-if="userStore.user.userType === 'S' && isLectureRegist"
            type="button"
            @click="lectureRegister()"
          >
            신청
          </button>
          <button type="button" @click="modalState.$patch({ isOpen: false })">취소</button>
        </div>
      </form>
    </div>
  </Teleport>
</template>

<style>
@import './ListModalStyled.css';
</style>
