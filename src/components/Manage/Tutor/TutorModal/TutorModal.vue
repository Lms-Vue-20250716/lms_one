<script setup>
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, ref } from 'vue';

const modalState = useModalState();
const { detailId: id } = defineProps({ detailId: { type: String, default: null } });
const detail = ref({});
const lectureInfoList = ref([]);

const tutorDetail = () => {
  const tutorId = id;

  axios.post(`/api/manage/tutor-detail/${tutorId}`).then((res) => {
    detail.value = res.data;
    lectureInfoList.value = res.data.lectureInfo;
  });
};

onMounted(() => {
  tutorDetail();
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
                <td class="label">강사ID</td>
                <td class="value">{{ detail.insId }}</td>
                <td class="label">이름</td>
                <td class="value">{{ detail.insName }}</td>
              </tr>
              <tr>
                <td class="label">강사 번호</td>
                <td class="value">{{ detail.insNumber }}</td>
                <td class="label">연락처</td>
                <td class="value">{{ detail.insHp }}</td>
              </tr>
              <tr>
                <td class="label">이메일</td>
                <td class="value">{{ detail.insEmail }}</td>
                <td class="label">재직 상태</td>
                <td class="value">{{ detail.insStatusYn === 'Y' ? '재직' : '퇴직' }}</td>
              </tr>
              <tr>
                <td class="label">은행</td>
                <td class="value">{{ detail.insBank }}</td>
                <td class="label">계좌 번호</td>
                <td class="value">{{ detail.insAccount }}</td>
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
                <td>{{ lectureInfo.lecName }}</td>
                <td>{{ lectureInfo.lecStartDate }}</td>
                <td>{{ lectureInfo.lecEndDate }}</td>
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
@import './tutorModalstyled.css';
</style>
