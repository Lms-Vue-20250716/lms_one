<script setup>
import PageNavigation from '@/components/common/PageNavigation.vue';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useModalState } from '@/stores/modalState';
import QnARegisterModal from '../QnAModal/QnARegisterModal.vue';
import { useUserInfo } from '@/stores/loginInfoState';
import QnAStudentModal from '../QnAModal/QnAStudentModal.vue';

const route = useRoute();
const qnaList = ref([]);
const qnaCount = ref(0);
const detailId = ref(0);
const modalState = useModalState();
const userInfo = useUserInfo();

const qnaSearch = (cPage = 1) => {
  const query = [];

  query.push(`currentPage=${cPage}`);
  query.push(`pageSize=5`);
  query.push(
    Object.keys(route.query)
      .map((key) => {
        return `${key}=${route.query[key]}`;
      })
      .join('&'),
  );

  // const param = new URLSearchParams(route.query);
  // param.append('currentPage', cPage);
  // param.append('pageSize', 5);

  // { cPage : 1 }
  // const params = {
  //   currentPage: cPage,
  //   pageSize: 5,
  //   ...route.query,
  // };

  axios.get(`/api/support/qnaList.do?${query.join('&')}`).then((res) => {
    qnaList.value = res.data.list;
    qnaCount.value = res.data.count;
  });
};

const noticeDetail = (id) => {
  console.log(userInfo.user);
  modalState.$patch({ isOpen: true, type: 'detail', payload: userInfo.user.userType });
  detailId.value = id;
};

watch(
  () => {
    return route.query;
  },
  () => {
    qnaSearch();
  },
);

onMounted(() => {
  qnaSearch();
});
</script>

<template>
  <div class="notice-main-container">
    <table class="notice-table">
      <thead class="notice-table-header">
        <tr>
          <th>No.</th>
          <th>강의명</th>
          <th>제목</th>
          <th>작성일</th>
          <th>작성자</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="qnaCount > 0">
          <tr v-for="qna in qnaList" :key="qna.qnaId" class="notice-table-row">
            <td class="notice-cell">{{ qna.qnaId }}</td>
            <td
              class="notice-cell cursor-pointer text-blue-600 hover:underline"
              @click="noticeDetail(qna.qnaId)"
            >
              {{ qna.qnaTitle }}
            </td>
            <td class="notice-cell">{{ qna.regDate }}</td>
            <td class="notice-cell">{{ qna.loginId }}</td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="4" class="notice-empty-row">일치하는 검색 결과가 없습니다</td>
          </tr>
        </template>
      </tbody>
    </table>
    <PageNavigation :items-per-page="5" :total-items="qnaCount" :on-page-change="qnaSearch" />
  </div>
  <!-- <QnAModal
    v-if="modalState.isOpen"
    :detail-id
    @post-success="qnaSearch"
    @un-mounted-modal="detailId = $event"
  /> -->
  <QnARegisterModal
    v-if="modalState.isOpen && modalState.type === 'register'"
    @post-success="qnaSearch"
  />
  <QnAStudentModal
    v-if="
      modalState.isOpen && modalState.type === 'detail' && modalState.payload.toLoswerCase() === 's'
    "
    @post-success="qnaSearch"
  />
</template>

<style>
@import './styled.css';
</style>
