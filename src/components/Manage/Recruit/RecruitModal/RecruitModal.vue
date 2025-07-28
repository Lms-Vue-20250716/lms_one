<script setup>
import ContentBox from '@/components/common/ContentBox.vue';
import PageNavigation from '@/components/common/PageNavigation.vue';
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';

const modalState = useModalState();
const props = defineProps({ loginId: { type: String, default: '' } });
const recruitDetailList = ref([]);
const recruitDetailCount = ref(0);
const saveFlag = ref({ main: 0, detail: 1, registeredNew: 2 });
const currentFlag = ref(saveFlag.value.main);
const recruitDetailInfo = ref([]);
const infoEmpId = ref(0);
const infoEmpName = ref('');
const infoEmpJoinDate = ref('');
const infoLoginId = ref('');
const infoEmpRetireDate = ref('');

const recruitDetail = (cpage = 1) => {
  const param = new URLSearchParams();
  param.append('loginID', props.loginId);
  param.append('currentPage', cpage);
  param.append('pageSize', 5);

  axios.post('/api/manage/RecruitDetailBody.do', param).then((res) => {
    recruitDetailList.value = res.data.list;
    recruitDetailCount.value = res.data.count;
  });
};

const recruitChangeModal = (recruit) => {
  currentFlag.value = saveFlag.value.detail;

  infoEmpId.value = recruit.empId;
  infoEmpName.value = recruit.empName;
  infoEmpJoinDate.value = recruit.empJoinDate;
  infoLoginId.value = recruit.loginID;
  infoEmpRetireDate.value = recruit.empRetireDate;

  const param = new URLSearchParams();
  param.append('empId', recruit.empId);

  // 응답중 empId의 값과 loginID이 null이 날라옴 recruit에 들어있는 거랑 크게 차이 없으니
  // 매개변수 값을 제외한 나머지 값만 덮어씌우기
  axios.post('/api/manage/empStudentDetail.do', param).then((res) => {
    recruitDetailInfo.value = res.data.detailValue;
    infoEmpName.value = recruitDetailInfo.value.empName;
    infoEmpJoinDate.value = recruitDetailInfo.value.empJoinDate;
    infoEmpRetireDate.value = recruitDetailInfo.value.empRetireDate;
  });
};

const empStudentUpdate = () => {
  if (!infoEmpName.value) {
    alert('업체명을 입력해주세요.');
    return;
  }
  if (!infoEmpJoinDate.value) {
    alert('입사일을 입력해주세요.');
    return;
  }

  if (
    !infoEmpRetireDate.value &&
    new Date(infoEmpRetireDate.value) < new Date(infoEmpJoinDate.value)
  ) {
    alert('퇴직일자가 입사일보다 빠를 수 없습니다.');
    return;
  }

  //as-is에서 이전 항목 리스트의 날자 범위끼리 충돌하는지 검증하는 것이 없으므로
  //같은 방식으로 그대로 컨버팅

  const param = new URLSearchParams();
  param.append('empId', infoEmpId.value);
  param.append('empName', infoEmpName.value);
  param.append('empJoinDate', infoEmpJoinDate.value);
  param.append('loginID', infoLoginId.value);
  param.append('empRetireDate', infoEmpRetireDate.value);

  axios
    .post('/api/manage/empStudentUpdate.do', param)
    .then((res) => {
      console.log('res', res);
      if (res.data.result.toLowerCase() === 'success') {
        alert('수정되었습니다.');
      } else if (res.data.result.toLowerCase() == 'retirefail') {
        alert('입사와 퇴직일자를 확인해주세요.');
      } else {
        alert('약속되지 않은 응답.');
      }
    })
    .catch(() => {
      alert('서버 오류');
    })
    .finally(closeModal());
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

const isEnabled = (isEnable) => {
  if (isEnable === 'Y') {
    return false;
  } else {
    return true;
  }
};

const closeModal = () => {
  modalState.$patch({ isOpen: false, type: null });
};

onMounted(() => {
  recruitDetail();
});
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay">
      <div class="modal-container">
        <div v-if="currentFlag === saveFlag.main">
          <ContentBox>취업 상세 목록</ContentBox>
          <table class="modal-table">
            <thead class="modal-table-header">
              <tr>
                <th>번호</th>
                <th>학생명</th>
                <th>입사일</th>
                <th>퇴사일</th>
                <th>업체명</th>
                <th>재직여부</th>
                <th>-</th>
              </tr>
            </thead>
            <tbody v-if="recruitDetailList.length > 0">
              <tr v-for="recruit in recruitDetailList" :key="recruit.empId">
                <td class="modal-cell">{{ recruit.empId }}</td>
                <td
                  class="modal-cell cursor-pointer hover:underline"
                  @click="recruitChangeModal(recruit)"
                >
                  {{ recruit.studentName }}
                </td>
                <td class="modal-cell">{{ getTodayAsLocalDate(recruit.empJoinDate) }}</td>
                <td class="modal-cell">{{ getTodayAsLocalDate(recruit.empRetireDate) }}</td>
                <td class="modal-cell">{{ recruit.empName }}</td>
                <td class="modal-cell">{{ !recruit.empRetireDate ? '취업' : '퇴직' }}</td>
                <td class="center-button">
                  <button :disabled="isEnabled(!recruit.empRetireDate ? 'Y' : 'N')">퇴직</button>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="7" style="text-align: center">데이터가 존재하지 않습니다.</td>
              </tr>
            </tbody>
          </table>
          <PageNavigation
            :items-per-page="5"
            :total-items="recruitDetailCount"
            :on-page-change="recruitDetail"
          />
          <div class="button-container">
            <button type="button" @click="currentFlag = saveFlag.registeredNew">신규</button>
            <button type="button" @click="closeModal">닫기</button>
          </div>
        </div>
        <div v-else-if="currentFlag === saveFlag.detail">
          <ContentBox>학생 정보 상세 보기</ContentBox>
          <table class="modal-table-detail-info">
            <tbody>
              <tr>
                <th>기업명</th>
                <td><input v-model="infoEmpName" type="text" /></td>
              </tr>
              <tr>
                <th>입사일</th>
                <td><input v-model="infoEmpJoinDate" type="date" /></td>
              </tr>
              <tr>
                <th>퇴사일</th>
                <td><input v-model="infoEmpRetireDate" type="date" /></td>
              </tr>
            </tbody>
          </table>
          <div class="button-container">
            <button type="button" @click="empStudentUpdate">수정</button>
            <button type="button" @click="closeModal">닫기</button>
          </div>
        </div>
        <div v-else-if="currentFlag === saveFlag.registeredNew">
          <ContentBox>취업 정보</ContentBox>
          <table class="modal-table-registered-new">
            <tbody>
              <tr>
                <th>업체명<label>*</label></th>
                <td><input type="text" /></td>
              </tr>
              <tr>
                <th>입사일<label>*</label></th>
                <td><input type="date" /></td>
              </tr>
            </tbody>
          </table>
          <div class="button-container">
            <button type="button" @click="null">저장</button>
            <button type="button" @click="closeModal">닫기</button>
          </div>
        </div>
        <div v-else></div>
      </div>
    </div>
  </Teleport>
</template>
<style scoped>
@import './styled.css';
</style>
