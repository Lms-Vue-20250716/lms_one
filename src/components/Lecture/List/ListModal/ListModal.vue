<script setup>
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, ref } from 'vue';

const modalState = useModalState();
const { detailId: id } = defineProps({ detailId: { type: Number, default: 0 } });
const detail = ref({});

const searchDetail = () => {
  const param = new URLSearchParams();
  param.append('lecId', id);
  console.log('deatil1------------', detail.value);
  axios.post('/api/lecture/lectureDetail.do').then((res) => {
    detail.value = res.data.detailValue;
  });
  console.log('deatil2------------', detail.value);
};

onMounted(() => {
  id && searchDetail();
  console.log('id---------------', id);
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
              <td colspan="4"><input v-model="detail.lecName" /></td>
            </tr>

            <tr>
              <th>강사</th>
              <td><input v-model="detail.lecInstructor" /></td>
              <th>강의실<span style="color: red">*</span></th>
              <td><input v-model="detail.lecClassRoom" /></td>
            </tr>

            <tr>
              <th>이메일</th>
              <td><input v-model="detail.insEmail" /></td>
              <th>연락처</th>
              <td><input v-model="detail.insHp" /></td>
            </tr>

            <tr>
              <th>강의 시작일</th>
              <td><input v-model="detail.lecStartDate" /></td>
              <th>강의 종료일</th>
              <td><input v-model="detail.lecEndDate" /></td>
            </tr>

            <tr>
              <th>정원</th>
              <td><input v-model="detail.lecPersonnel" /></td>
              <th>강의 일수(주차)</th>
              <td>
                <input v-model="detail.lecDaysCnt" /> (<input v-model="detail.lecSectionCnt" />주차)
              </td>
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
              <tr>
                <td colspan="4">
                  <input v-model="detail.lectureGoal" />
                </td>
              </tr>

              <!-- 강의 내용 -->
              <tr>
                <th colspan="4">강의내용<span style="color: red">*</span></th>
              </tr>
              <tr>
                <td colspan="4">
                  <input v-model="detail.lectureContent" />
                </td>
              </tr>

              <!-- 강의 기타사항 -->
              <tr>
                <th colspan="4">강의기타사항<span style="color: red">*</span></th>
              </tr>
              <tr>
                <td colspan="4">
                  <input v-model="detail.lectureSpecifics" />
                </td>
              </tr>

              <!-- 주차별 계획 헤더 -->
              <tr>
                <th>주차<span style="color: red">*</span></th>
                <th>학습목표<span style="color: red">*</span></th>
                <th>학습내용<span style="color: red">*</span></th>
              </tr>
            </tbody>

            <!-- 주차별 계획 바디 -->
            <tbody>
              <!-- <tr v-for="(week, index) in lectureWeekPlan" :key="index"> -->
              <tr>
                <td><input v-model="detail.week" /></td>
                <td><input v-model="detail.week" /></td>
                <td><input v-model="detail.week" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="button-container">
          <button type="button" @click="modalState.$patch({ isOpen: false })">취소</button>
        </div>
      </form>
    </div>
  </Teleport>
</template>
