<script setup>
import PageNavigation from '@/components/common/PageNavigation.vue';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const atdLecList = ref([]);
const atdLecCount = ref(0);

const atdLecSearch = (cPage = 1) => {
  const param = new URLSearchParams(route.query);
  param.append('currentPage', cPage);
  param.append('pageSize', 5);

  axios.post(`/api/lecture/AttendanceLectureListBody.do`, param).then((res) => {
    console.log(res.data);
    atdLecList.value = res.data.list;
    atdLecCount.value = res.data.count;
  });
};

const handleAttendCheck = (lecId) => {
  if (!confirm('출석하시겠습니까?')) {
    return;
  }
  const param = new URLSearchParams();
  param.append('lecId', lecId.toString());
  axios.post('/api/lecture/attendanceEnter.do', param).then((res) => {
    if (res.data.result === 'success') {
      alert('출석처리되었습니다.');
      atdLecSearch();
    } else {
      alert('출석처리에 실패하였습니다. 날자를 확인해주세요.');
    }
  });
};

const handleAttendOut = (lecId) => {
  if (!confirm('퇴실하시겠습니까?')) {
    return;
  }
  const param = new URLSearchParams();
  param.append('lecId', lecId.toString());
  axios.post('/api/lecture/attendanceOut.do', param).then((res) => {
    if (res.data.result === 'success') {
      alert('퇴실처리되었습니다.');
      atdLecSearch();
    } else {
      alert('퇴실처리에 실패하였습니다.');
    }
  });
};
function buttonStyle(color) {
  return {
    width: '80%',
    height: '80%',
    color: 'white',
    backgroundColor: color,
    border: '0',
    margin: '0',
    padding: '0',
  };
}

watch(
  () => {
    return route.query;
  },
  () => {
    atdLecSearch();
  },
);

onMounted(() => {
  atdLecSearch();
});
</script>

<template>
  <div class="notice-main-container">
    <table class="notice-table">
      <thead class="notice-table-header">
        <tr>
          <th>번호</th>
          <th>강의이름</th>
          <th>개강일자</th>
          <th>종강일자</th>
          <th>강의실</th>
          <th>-</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="atdLecCount > 0">
          <tr v-for="lec in atdLecList" :key="lec.lecId" class="notice-table-row">
            <td class="notice-cell">{{ lec.lecId }}</td>
            <td class="notice-cell">{{ lec.lecName }}</td>
            <td class="notice-cell">{{ new Date(lec.lecStartDate).toISOString().slice(0, 10) }}</td>
            <td class="notice-cell">{{ new Date(lec.lecEndDate).toISOString().slice(0, 10) }}</td>
            <td class="notice-cell">{{ lec.roomName }}</td>
            <td>
              <button
                v-if="!lec.attendState || lec.attendState === null"
                :style="buttonStyle('#5367d9')"
                @click="handleAttendCheck(lec.lecId)"
              >
                출석
              </button>
              <button
                v-else-if="lec.attendEnddate === null"
                :style="buttonStyle('#d95e53')"
                @click="handleAttendOut(lec.lecId)"
              >
                퇴실
              </button>
              <template v-else>
                <span v-if="lec.attendState === 'L'">지각</span>
                <span v-else-if="lec.attendState === 'E'">출석</span>
                <span v-else-if="lec.attendState === 'F'">결석</span>
                <span v-else-if="lec.attendState === 'J'">조퇴</span>
              </template>
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
    <PageNavigation :items-per-page="5" :total-items="atdLecCount" :on-page-change="atdLecSearch" />
  </div>
  <!-- <QnAModal
    v-if="modalState.isOpen"
    :detail-id
    @post-success="qnaSearch"
    @un-mounted-modal="detailId = $event"
  /> -->
</template>

<style>
@import './styled.css';
</style>
