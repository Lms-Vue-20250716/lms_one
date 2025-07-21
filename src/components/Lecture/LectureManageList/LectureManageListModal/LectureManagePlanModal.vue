<script setup>
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, onUnmounted, ref, watchEffect } from 'vue';

const modalState = useModalState();
const { detailId: id, detailInsId: insId } = defineProps({
  detailId: { type: Number, default: 0 },
  detailInsId: { type: String, default: '' },
});
const emit = defineEmits(['postSuccess', 'unMountedModal']);
const detail = ref('');
const lecWeekPlanList = ref([]);

const lectureManagePlanDetail = () => {
  const param = new URLSearchParams();
  param.append('lecId', id);
  param.append('lecInstructorId', insId);

  axios.post('/api/lecture/lectureManagePlanDetail.do', param).then((res) => {
    detail.value = res.data.lectureManagePlanDetailValue;
    lecWeekPlanList.value = detail.value.lecWeekPlanList;
    console.log(detail.value);
    console.log(lecWeekPlanList.value);
  });
};

const lectureManagePlanSave = () => {
  // lecId를 서버에서 String으로 받아야해서 변환
  const idToString = id.toString();

  const param = {
    lecId: idToString,
    lecGoal: detail.value.lecGoal,
    lecContent: detail.value.lecContent,
    lecSpecifics: detail.value.lecSpecifics,
    lecManageWeekPlanList: lecWeekPlanList.value,
  };

  axios.post('/api/lecture/lectureManagePlanSave.do', param).then((res) => {
    if (res.data.result === 'success') {
      alert('저장되었습니다.');
      modalState.$patch({ isOpen: true, type: null });
      emit('postSuccess');
    }
  });
};

const lectureManagePlanUpdate = () => {
  // lecId를 서버에서 String으로 받아야해서 변환
  const idToString = id.toString();

  const param = {
    lecId: idToString,
    lecGoal: detail.value.lecGoal,
    lecContent: detail.value.lecContent,
    lecSpecifics: detail.value.lecSpecifics,
    lecManageWeekPlanList: lecWeekPlanList.value,
  };

  axios.post('/api/lecture/lectureManagePlanUpdate.do', param).then((res) => {
    if (res.data.result === 'success') {
      alert('저장되었습니다.');
      modalState.$patch({ isOpen: true, type: null });
      emit('postSuccess');
    }
  });
};

watchEffect(() => {
  if (lecWeekPlanList.value.length === 0 && detail.value?.lecSectionCnt) {
    lecWeekPlanList.value = Array.from({ length: detail.value.lecSectionCnt }, (_, i) => ({
      lecWeekRound: i + 1,
      lecWeekGoal: '',
      lecWeekContent: '',
      lecWeekPlanId: '',
    }));
  }
});

onMounted(() => {
  lectureManagePlanDetail();
});

onUnmounted(() => {
  emit('unMountedModal', 0);
});
</script>
<template>
  <h1>강의 상세 및 계획서</h1>
  <div class="modal-overlay">
    <div class="modal">
      <h2>강의 상세</h2>
      <form>
        <table class="lecture-table">
          <tbody>
            <tr>
              <th>강의</th>
              <td><input v-model="detail.lecInstructorName" :disabled="true" /></td>
            </tr>
            <tr>
              <th>강사</th>
              <td><input v-model="detail.lecRoomName" :disabled="true" /></td>
            </tr>
            <tr>
              <th>강의실</th>
              <td><input v-model="detail.lecRoomName" :disabled="true" /></td>
            </tr>
            <tr>
              <th>이메일</th>
              <td><input v-model="detail.insEmail" :disabled="true" /></td>
            </tr>
            <tr>
              <th>연락처</th>
              <td><input v-model="detail.insHp" :disabled="true" /></td>
            </tr>
            <tr>
              <th>강의 시작일</th>
              <td><input v-model="detail.lecStartDate" :disabled="true" /></td>
            </tr>
            <tr>
              <th>강의 종료일</th>
              <td><input v-model="detail.lecEndDate" :disabled="true" /></td>
            </tr>
          </tbody>
        </table>

        <div class="section">
          <h3>강의 계획</h3>
          <table class="lecture-table">
            <tbody>
              <tr>
                <th>강의목표</th>
                <td><textarea v-model="detail.lecGoal"></textarea></td>
              </tr>
              <tr>
                <th>강의내용</th>
                <td><textarea v-model="detail.lecContent"></textarea></td>
              </tr>
              <tr>
                <th>기타사항</th>
                <td><textarea v-model="detail.lecSpecifics"></textarea></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="weekly-section">
          <h3>주차별 계획</h3>
          <table class="weekly-table">
            <thead>
              <tr>
                <th>주차</th>
                <th>학습목표</th>
                <th>학습내용</th>
              </tr>
            </thead>
            <!-- <tbody v-if="lecWeekPlanList.length > 0"> -->
            <tbody>
              <tr v-for="lecWeekPlan in lecWeekPlanList" :key="lecWeekPlan.lecWeekRound">
                <!-- <td>{{ lecWeekPlan.lecWeekRound }}주차</td>
                <td>{{ lecWeekPlan.lecWeekGoal || '' }}</td>
                <td>{{ lecWeekPlan.lecWeekContent || '' }}</td> -->
                <td>{{ lecWeekPlan.lecWeekRound }}주차</td>
                <td><input v-model="lecWeekPlan.lecWeekGoal" /></td>
                <td><input v-model="lecWeekPlan.lecWeekContent" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="buttons">
          <!-- detail.value.lecWeekPlanList.length != 0 ? 저장() : 수정() // button 까지 -->
          <button
            type="button"
            @click="
              lecWeekPlanList.length === 0 ? lectureManagePlanSave() : lectureManagePlanUpdate()
            "
          >
            {{ lecWeekPlanList.length === 0 ? '저장' : '수정' }}
          </button>
          <button type="button" @click="modalState.$patch({ isOpen: false, type: null })">
            취소
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style>
@import './ManagePlanModalStyled.css';
</style>
