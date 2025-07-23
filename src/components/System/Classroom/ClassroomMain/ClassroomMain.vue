<script setup>
import PageNavigation from '@/components/common/PageNavigation.vue';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useModalState } from '@/stores/modalState';
import { useUserInfo } from '@/stores/loginInfoState';
import ClassroomModal from '../ClassroomModal/ClassroomModal.vue';

const route = useRoute();
const classroomList = ref([]);
const classroomCount = ref(0);
const detailId = ref(0);
const modalState = useModalState();
const userInfo = useUserInfo();

const classroomSearch = (cPage = 1) => {
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

  axios.get(`/api/system/classroomListBody.do?${query.join('&')}`).then((res) => {
    console.log(res.data);
    classroomList.value = res.data.list;
    classroomCount.value = res.data.count;
  });
};

const classroomDetail = (id) => {
  modalState.$patch({ isOpen: true });
  detailId.value = id;
};

watch(
  () => {
    return route.query;
  },
  () => {
    classroomSearch();
  },
);

onMounted(() => {
  classroomSearch();
});
</script>

<template>
  <div class="notice-main-container">
    <table class="notice-table">
      <thead class="notice-table-header">
        <tr>
          <th>번호</th>
          <th>강의실 이름</th>
          <th>강의실 정원</th>
          <th>강의실 사이즈</th>
          <th>비고</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="classroomCount > 0">
          <tr v-for="classroom in classroomList" :key="classroom.roomId" class="notice-table-row">
            <td class="notice-cell">{{ classroom.roomId }}</td>
            <td
              class="notice-cell cursor-pointer text-blue-600 hover:underline"
              @click="classroomDetail(classroom.roomId)"
            >
              {{ classroom.roomName }}
            </td>
            <td class="notice-cell">{{ classroom.roomPersonnel }}</td>
            <td class="notice-cell">{{ classroom.roomSize }}</td>
            <td class="notice-cell">{{ classroom.roomRemark }}</td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="4" class="notice-empty-row">일치하는 검색 결과가 없습니다</td>
          </tr>
        </template>
      </tbody>
    </table>
    <PageNavigation
      :items-per-page="5"
      :total-items="classroomCount"
      :on-page-change="classroomSearch"
    />
  </div>
  <ClassroomModal
    v-if="modalState.isOpen"
    :detail-id="detailId"
    @post-success="classroomSearch"
    @un-mounted-modal="detailId = $event"
  />
</template>

<style>
@import './styled.css';
</style>
