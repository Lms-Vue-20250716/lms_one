<script setup>
import PageNavigation from '@/components/common/PageNavigation.vue';
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import CommoncodeModal from '../CommoncodeModal/CommoncodeModal.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const commonList = ref([]);
const commonCount = ref(0);
const detailId = ref(0);
const modalState = useModalState();

const commonSearch = (cPage = 1) => {
  const param = {
    currentPage: cPage,
    pageSize: 5,
    ...route.query,
  };
  // const param = new URLSearchParams(route.query);
  // param.append('currentPage', cPage);
  // param.append('pageSize', 5);

  const urlParam = new URLSearchParams(param);

  console.log(param);
  axios.post(`/api/system/commonListJson.do`, urlParam).then((res) => {
    console.log('서버 응답 전체:', res.data);
    console.log('리스트 개수:', res.data.list.length);
    commonList.value = res.data.list;
    commonCount.value = res.data.CommonCnt;
  });
};

const commonDetail = (id) => {
  modalState.$patch({ isOpen: true });
  detailId.value = id;
};
watch(
  () => {
    return route.query;
  },
  () => {
    commonSearch();
  },
);
onMounted(() => {
  commonSearch();
});
</script>

<template>
  <div class="common-main-container">
    <table class="common-table">
      <thead class="common-table-header">
        <tr>
          <th>대분류</th>
          <th>그룹명</th>
          <th>상세코드</th>
          <th>상세명</th>
          <th>등록자</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="commonCount === 0">
          <tr>
            <td colspan="5" class="common-empty-row">데이터가 존재하지 않습니다.</td>
          </tr>
        </template>
        <template v-else>
          <tr
            v-for="item in commonList"
            :key="item.detailCode"
            class="common-table-row"
            id="listHover"
          >
            <td class="common-cell">
              <template v-if="item.useYn === 'equip'">장비</template>
              <template v-else-if="item.useYn === 'loc'">지역</template>
            </td>
            <td class="common-cell">{{ item.groupName }}</td>
            <td class="common-cell">{{ item.detailCode }}</td>
            <td class="common-cell">
              <a
                href="javascript:void(0);"
                class="cursor-pointer text-blue-600 hover:underline"
                @click="commonDetail(item.detailCode)"
              >
                {{ item.detailName }}
              </a>
            </td>
            <td class="common-cell">{{ item.regId }}</td>
          </tr>
        </template>
      </tbody>
    </table>
    <PageNavigation :items-per-page="5" :total-items="commonCount" :on-page-change="commonSearch" />
  </div>
  <CommoncodeModal
    v-if="modalState.isOpen"
    :detail-id="detailId"
    @post-success="commonSearch"
    @un-mounted-modal="detailId = $event"
  />
</template>

<style>
@import './styled.css';
</style>
