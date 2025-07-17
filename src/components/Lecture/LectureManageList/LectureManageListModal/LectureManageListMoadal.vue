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
  axios.post('/api/lecture/lectureDetail.do', param).then((res) => {
    detail.value = res.data.lectureDetailValue;
  });
};

onMounted(() => {
  id && searchDetail();
});
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay">
      <div class="modal-container">
        <h2 class="modal-title">강의 상세</h2>
        <form class="modal-form">
          <table>
            <tbody>
              <tr>
                <th>강의명</th>
                <td>{{ detail.lecName }}</td>
              </tr>
              <tr>
                <th>강사</th>
                <td>
                  <select v-model="detail.lecInstructorName">
                    <option value="">강사 선택</option>
                    <option value="서다인">서다인</option>
                    <option value="양지호">양지호</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>정원</th>
                <td><input v-model="detail.lecPersonnel" /></td>
              </tr>
              <tr>
                <th>강의실</th>
                <td>{{ detail.lecRoomName }}</td>
              </tr>
              <tr>
                <th>강의 시작일</th>
                <td><input v-model="detail.lecStartDate" type="date" /></td>
              </tr>
              <tr>
                <th>강의 종료일</th>
                <td><input v-model="detail.lecEndDate" type="date" /></td>
              </tr>
              <tr>
                <th>강의 일수</th>
                <td>{{ detail.lecDaysCnt }}</td>
              </tr>
            </tbody>
          </table>
          <div class="button-container">
            <button type="button">수정</button>
            <button type="button" @click="modalState.$patch({ isOpen: false })">취소</button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style>
@import './ManageListModalStyled.css';
</style>
