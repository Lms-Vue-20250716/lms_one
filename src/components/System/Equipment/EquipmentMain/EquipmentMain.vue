<script setup>
import PageNavigation from '@/components/common/PageNavigation.vue';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useModalState } from '@/stores/modalState';
import EquipmentModal from '../EquipmentModal/EquipmentModal.vue';

const route = useRoute();
const eqpList = ref([]);
const eqpCount = ref(0);
const detailId = ref(0);
const modalState = useModalState();
const { detailId: id } = defineProps({ detailId: { type: Number, default: 0 } });

const classroomEqpSearch = (cPage = 1) => {
  const param = new URLSearchParams(route.query);
  param.append('roomId', id);
  param.append('currentPage', cPage);
  param.append('pageSize', 5);

  // { cPage : 1 }
  // const params = {
  //   currentPage: cPage,
  //   pageSize: 5,
  //   ...route.query,
  // };

  axios.post(`/api/system/equipmentListBody.do`, param).then((res) => {
    eqpList.value = res.data.list;
    eqpCount.value = res.data.count;
  });
};

const equipmentDetail = (eqpId) => {
  modalState.$patch({ isOpen: true });
  detailId.value = eqpId;
};

const handleDeleteExpiredEquipment = (equipId) => {
  if (!confirm('해당 장비를 삭제하시겠습니까?')) {
    return;
  }

  const params = new URLSearchParams();
  params.append('equipId', equipId.toString());

  axios.post('/api/system/equipmentDelete.do', params).then(() => {
    alert('삭제되었습니다.');
    classroomEqpSearch(); // 목록 새로고침
  });
};

watch(
  () => {
    return route.query;
  },
  () => {
    classroomEqpSearch();
  },
);
watch(
  () => {
    return id;
  },
  () => {
    classroomEqpSearch();
  },
);

onMounted(() => {
  classroomEqpSearch();
});
</script>

<template>
  <table class="notice-table">
    <thead class="notice-table-header">
      <tr>
        <th>정보</th>
        <th>시리얼넘버</th>
        <th>분류</th>
        <th>장비명</th>
        <th>수량</th>
        <th>구매일자</th>
        <th>잔여 사용기한</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="eqpCount > 0">
        <tr v-for="eqp in eqpList" :key="eqp.equipId" class="notice-table-row">
          <td class="notice-cell">
            <img
              :src="'/api' + eqp.logicalPath"
              style="width: 50px; height: auto; border-radius: 5px"
            />
          </td>
          <td class="notice-cell">{{ eqp.equipSerial }}</td>
          <td class="notice-cell">{{ eqp.equipGroup }}</td>
          <td
            class="notice-cell cursor-pointer text-blue-600 hover:underline"
            @click="equipmentDetail(eqp.equipId)"
          >
            {{ eqp.equipName }}
          </td>
          <td class="notice-cell">{{ eqp.equipQuantity }}</td>
          <td class="notice-cell">
            {{ new Date(eqp.equipPurchaseDate).toISOString().split('T')[0] }}
          </td>
          <td v-if="eqp.remainPeroid > 0" class="notice-cell">{{ eqp.remainPeroid }}일</td>
          <td
            v-else
            class="notice-cell text-red-800 underline"
            @click="handleDeleteExpiredEquipment"
          >
            장비 삭제
          </td>
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
    :total-items="eqpCount"
    :on-page-change="classroomEqpSearch"
  />
  <EquipmentModal
    v-if="modalState.isOpen"
    :detail-id="detailId"
    :room-id="id"
    @post-success="classroomEqpSearch"
    @un-mounted-modal="detailId = $event"
  />
</template>

<style>
@import './styled.css';
</style>
