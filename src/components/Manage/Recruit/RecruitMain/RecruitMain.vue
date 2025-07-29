<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import PageNavigation from '@/components/common/PageNavigation.vue';
import RecruitModal from '../RecruitModal/RecruitModal.vue';

const route = useRoute();
const recruitCount = ref(0);
const recruitList = ref([]);
const modalState = useModalState();
const loginId = ref('');

const recruitSearch = async (cpage = 1) => {
  const param = new URLSearchParams(route.query);
  param.append('currentPage', cpage);
  param.append('pageSize', 5);

  await axios
    .post('/api/manage/recruitListBody.do', param)
    .then((res) => {
      recruitCount.value = res.data.count;
      recruitList.value = res.data.list;
    })
    .catch();
};

const getTodayAsLocalDate = (dateString) => {
  if (!dateString) {
    return;
  }
  const today = new Date(dateString);
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

watch(
  () => route.query,
  () => {
    recruitSearch();
  },
);

const recruitDetail = (id) => {
  modalState.$patch({ isOpen: true, type: 'recruit' });
  loginId.value = id;
};

onMounted(() => {
  recruitSearch();
});
</script>

<template>
  <div class="recruit-main-container">
    <table class="recruit-table">
      <thead class="recruit-table-header">
        <tr>
          <th>로그인ID</th>
          <th>학생명</th>
          <th>입사일</th>
          <th>퇴사일</th>
          <th>업체명</th>
          <th>재직여부</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="recruitCount > 0">
          <tr v-for="recruit in recruitList" :key="recruit.empId" class="recruit-table-row">
            <td class="recruit-cell">{{ recruit.loginID }}</td>
            <td
              class="recruit-cell cursor-pointer text-blue-600 hover:underline"
              @click="recruitDetail(recruit.loginID)"
            >
              {{ recruit.studentName }}
            </td>
            <td class="recruit-cell">{{ getTodayAsLocalDate(recruit.empJoinDate) }}</td>
            <td class="recruit-cell">{{ getTodayAsLocalDate(recruit.empRetireDate) }}</td>
            <td class="recruit-cell">{{ recruit.empName }}</td>
            <td class="recruit-cell">{{ !recruit.empRetireDate ? '취업' : '실업' }}</td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="6" class="recruit-empty-row">일치하는 검색 결과가 없습니다</td>
          </tr>
        </template>
      </tbody>
    </table>
    <PageNavigation
      :items-per-page="5"
      :total-items="recruitCount"
      :on-page-change="recruitSearch"
    />
  </div>
  <RecruitModal
    v-if="modalState.isOpen && modalState.type === 'recruit'"
    :login-id="loginId"
    @refresh-main="recruitSearch"
  />
</template>
<style scoped>
@import './styled.css';
</style>
