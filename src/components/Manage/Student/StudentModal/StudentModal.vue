<script setup>
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, ref } from 'vue';

const modalState = useModalState();
const { detailId: id } = defineProps({ detailId: { type: String, default: null } });
const detail = ref({});
const lectureInfoList = ref([]);

const studentDetail = () => {
  const studentId = id;

  axios.post(`/api/manage/student-detail/${studentId}`).then((res) => {
    detail.value = res.data;
    lectureInfoList.value = res.data.lectureInfo;
    console.log('lectureInfoList => ', lectureInfoList.value);
    console.log('stdt => ', lectureInfoList.value.lectureStartDate);
    console.log('eddt => ', lectureInfoList.value.lectureEndDate);
    console.log(res.data.lectureInfo[0].lectureStartDate);
  });
};

onMounted(() => {
  studentDetail();
});
</script>
<template>
  <div class="modal-overlay" @click="modalState.$patch({ isOpen: false, type: null })">
    <div class="modal-content" @click.stop>
      <!-- 모달 헤더 -->
      <div class="modal-header">
        <h2>학생 상세</h2>
        <button class="close-btn" @click="modalState.$patch({ isOpen: false, type: null })">
          ×
        </button>
      </div>

      <!-- 학생 정보 -->
      <div class="modal-body">
        <div class="info-section">
          <h3>학생 정보</h3>
          <table class="info-table">
            <tbody>
              <tr>
                <td class="label">학생ID</td>
                <td class="value">{{ detail.studentId }}</td>
                <td class="label">이름</td>
                <td class="value">{{ detail.studentName }}</td>
              </tr>
              <tr>
                <td class="label">학번</td>
                <td class="value">{{ detail.studentNumber }}</td>
                <td class="label">연락처</td>
                <td class="value">{{ detail.studentHp }}</td>
              </tr>
              <tr>
                <td class="label">이메일</td>
                <td class="value">{{ detail.studentEmail }}</td>
                <td class="label">생일</td>
                <td class="value">{{ detail.studentBirthday }}</td>
              </tr>
              <tr>
                <td class="label">재학 상태</td>
                <td class="value">{{ detail.statusYn === 'Y' ? '재학' : '탈퇴' }}</td>
                <td class="label">취업 상태</td>
                <td class="value">{{ detail.studentEmpStatus === 'Y' ? '취업' : '미취업' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 강의 목록 -->
        <div class="course-section">
          <h3>강의 목록</h3>
          <table class="course-table">
            <thead>
              <tr>
                <th>강의 번호</th>
                <th>강의명</th>
                <th>개강 일자</th>
                <th>종강 일자</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="lectureInfoList.length === 0">
                <td colspan="4" class="no-data">수강 강의 목록이 없습니다.</td>
              </tr>
              <tr v-for="lectureInfo in lectureInfoList" :key="lectureInfo.lecId">
                <td>{{ lectureInfo.lecId }}</td>
                <td>{{ lectureInfo.lectureName }}</td>
                <td>{{ new Date(lectureInfo.lectureStartDate).toISOString().slice(0, 10) }}</td>
                <td>{{ new Date(lectureInfo.lectureEndDate).toISOString().slice(0, 10) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 모달 푸터 -->
      <div class="modal-footer">
        <button class="confirm-btn" @click="modalState.$patch({ isOpen: false, type: null })">
          닫기
        </button>
      </div>
    </div>
  </div>
</template>

<style>
@import './studentModalstyled.css';
</style>
