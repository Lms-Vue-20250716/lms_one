<script setup>
import PageNavigation from '@/components/common/PageNavigation.vue';
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import StudentModal from '../StudentModal/StudentModal.vue';

const studentList = ref([]);
const studentCount = ref(0);
const route = useRoute();
const detailId = ref('');
const modalState = useModalState();

const studentSearch = (cPage = 1) => {
  const param = new URLSearchParams(route.query);
  param.append('currentPage', cPage);
  param.append('pageSize', 5);

  const today = new Date().toISOString().slice(0, 10);

  axios.post('/api/manage/studentListBody.do', param).then((res) => {
    if (route.query.regStDate > today) {
      alert('시작일은 오늘 이후 날짜일 수 없습니다.');
      return;
    }
    if (route.query.regEdDate > today) {
      alert('종료일은 오늘 이후 날짜일 수 없습니다.');
      return;
    }
    if (route.query.regStDate > route.query.regEdDate) {
      alert('종료일은 시작일보다 빠를 수 없습니다.');
      return;
    }

    studentList.value = res.data.list;
    studentCount.value = res.data.count;
  });
};

const studentStatusChange = (id, status) => {
  if (confirm('재학 상태를 변경하시겠습니까?')) {
    const param = {
      studentId: id,
      studentStatus: status,
    };

    axios.post('/api/manage/student-status', param).then((res) => {
      if (res.data === 'SUCCESS') {
        alert('재학 상태가 변경되었습니다.');
      } else {
        alert('변경 실패');
      }
      studentSearch();
    });
  } else {
    studentSearch();
    return;
  }
};

const studentDetail = (id) => {
  modalState.$patch({ isOpen: true, type: 'manageStudent' });
  detailId.value = id;
};

watch(
  () => route.query,
  () => {
    studentSearch();
  },
);

onMounted(() => {
  studentSearch();
});
</script>
<template>
  <div class="notice-main-container">
    <table class="notice-table">
      <thead class="notice-table-header">
        <tr>
          <th>학번</th>
          <th>이름</th>
          <th>연락처</th>
          <th>가입일자</th>
          <th>취업여부</th>
          <th>재학상태</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="studentCount > 0">
          <tr v-for="student in studentList" :key="student.studentId" class="list-table-row">
            <!-- <td class="font-bold hover:underline" @click="studentDetail(student.studentId)">
              {{ student.lecName }}
            </td> -->
            <td>
              {{ student.studentNumber }}
            </td>
            <td class="font-bold hover:underline" @click="studentDetail(student.studentId)">
              {{ student.studentName }}
            </td>
            <td>{{ student.studentHp }}</td>
            <td>{{ student.studentRegDate.substr(0, 10) }}</td>
            <td>
              {{ student.studentEmpStatus === 'Y' ? '취업' : '미취업' }}
            </td>
            <td>
              <select
                v-model="student.statusYN"
                @change="studentStatusChange(student.studentId, student.statusYN)"
              >
                <option value="N">탈퇴</option>
                <option value="Y">재학</option>
                <option value="W">승인 대기중</option>
              </select>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="4" class="list-empty-row">일치하는 검색 결과가 없습니다</td>
          </tr>
        </template>
      </tbody>
    </table>
    <PageNavigation
      :items-per-page="5"
      :total-items="studentCount"
      :on-page-change="studentSearch"
    />
  </div>
  <StudentModal
    v-if="modalState.isOpen && modalState.type == 'manageStudent'"
    :detail-id="detailId"
  />
</template>

<style scoped>
@import './styled.css';
</style>
