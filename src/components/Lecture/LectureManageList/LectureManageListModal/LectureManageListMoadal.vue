<script setup>
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, onUnmounted, ref, watch } from 'vue';

const modalState = useModalState();
const { detailId: id } = defineProps({ detailId: { type: Number, default: 0 } });
const detail = ref({});
const classRoomList = ref([]);
const instructorInfoList = ref([]);
const lecNameList = ref([]);
const isWeekendAlertShown = ref(false);
const lecName = ref('');
const insName = ref('');
const lecPersonnel = ref('');
const lecClassRoom = ref('');
const lecStartDate = ref('');
const lecEndDate = ref('');
const lecDaysCnt = ref();
const emit = defineEmits(['postSuccess', 'unMountedModal']);

const lectureSelectBox = () => {
  const param = new URLSearchParams();
  axios.post('/api/lecture/lectureManageSelectBox.do', param).then((res) => {
    classRoomList.value = res.data.lecSelectBoxClassRoomList;
    instructorInfoList.value = res.data.lecSelectBoxInstructorInfoList;
    lecNameList.value = res.data.lecSelectBoxLecNameList;
  });
};

const lectureDetail = () => {
  const param = new URLSearchParams();
  param.append('lecId', id);

  axios.post('/api/lecture/lectureManageDetail.do', param).then((res) => {
    detail.value = res.data.lectureManageDetailValue;
    console.log('res.data.lectureManageDetailValue', res.data.lectureManageDetailValue);
    console.log(detail.value);
  });
};

const lectureManageSave = () => {
  const param = {
    lecId: id,
    lecName: lecName.value,
    insName: insName.value,
    lecPersonnel: lecPersonnel.value,
    lecClassRoom: lecClassRoom.value,
    lecStartDate: lecStartDate.value,
    lecEndDate: lecEndDate.value,
    lecDaysCnt: lecDaysCnt.value,
  };

  axios.post('/api/lecture/lectureManageSave.do', param).then((res) => {
    if (res.data.result === 'success') {
      alert('저장되었습니다.');
      modalState.$patch({ isOpen: true });
      emit('postSuccess');
    }
  });
};

const checkWeekend = () => {
  if (!lecStartDate.value) return;
  const date = new Date(lecStartDate.value);
  if (isWeekend(date)) {
    lecStartDate.value = '';
  }
};

const isWeekend = (date) => {
  const day = date.getDay();
  if (day === 0 || day === 6) {
    if (!isWeekendAlertShown.value) {
      alert('주말은 선택할 수 없습니다.');
      isWeekendAlertShown.value = true;
    }
    return true;
  }
  return false;
};

const dateCalc = () => {
  if (lecStartDate.value && lecEndDate.value) {
    const start = new Date(lecStartDate.value);
    const end = new Date(lecEndDate.value);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return;
    }

    if (start > end) {
      lecDaysCnt.value = 0;
      return;
    }

    let current = new Date(start);
    let count = 0;

    while (current <= end) {
      const day = current.getDay();

      if (day !== 0 && day !== 6) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    lecDaysCnt.value = count;

    if (count > 200) {
      alert('강의 기간은 최대 200일까지만 설정할 수 있습니다.');

      const adjustEndDt = new Date(start);
      let countedDays = 1;
      while (countedDays < 200) {
        adjustEndDt.setDate(adjustEndDt.getDate() + 1);
        const day = adjustEndDt.getDay();
        if (day !== 0 && day !== 6) {
          countedDays++;
        }
      }
      const newEndDate = formatDateToYMD(adjustEndDt);
      lecEndDate.value = newEndDate;

      lecDaysCnt.value = 200;
    }
  }
};

const formatDateToYMD = (date) => {
  return date.toISOString().slice(0, 10);
};

const numberFilter = () => {
  lecPersonnel.value = lecPersonnel.value.replace(/[^0-9]/g, '');
};

onMounted(() => {
  if (id) {
    lectureDetail();
  } else {
    lectureSelectBox();
  }
});

onUnmounted(() => {
  emit('unMountedModal', 0);
});

watch([lecStartDate, lecEndDate], ([newStart, newEnd]) => {
  if (newStart && newEnd) {
    dateCalc();
  }
});
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay">
      <div class="modal-container">
        <h2 class="modal-title">강의 상세</h2>
        <form ref="formRef" class="modal-form">
          <table>
            <tbody>
              <tr>
                <th>강의명</th>
                <td>
                  <select v-model="lecName" name="lecName">
                    <option>강의 선택</option>
                    <option>직접 입력</option>
                    <option v-for="lecName in lecNameList" :key="lecName.lecId">
                      {{ lecName.lecName }}
                    </option>
                  </select>
                  <div :hidden="lecName !== 'direct' && lecName !== '직접 입력'">
                    <input type="text" name="lecName" />
                  </div>
                </td>
              </tr>
              <tr>
                <th>강사</th>
                <td>
                  <select v-model="insName" name="insName">
                    <option>강사 선택</option>
                    <option
                      v-for="instructorInfo in instructorInfoList"
                      :key="instructorInfo.insNum"
                    >
                      {{ instructorInfo.insName }}
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>정원</th>
                <td>
                  <input
                    v-model="lecPersonnel"
                    type="text"
                    name="lecPersonnel"
                    @input="numberFilter"
                  />
                </td>
              </tr>
              <tr>
                <th>강의실</th>
                <td>
                  <select v-model="lecClassRoom" name="lecClassRoom">
                    <option>강의실 선택</option>
                    <option v-for="classRoom in classRoomList" :key="classRoom.roomId">
                      {{ classRoom.roomName }}
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>강의 시작일</th>
                <td>
                  <input
                    v-model="lecStartDate"
                    type="date"
                    name="lecStartDate"
                    @change="checkWeekend"
                  />
                </td>
              </tr>
              <tr>
                <th>강의 종료일</th>
                <td><input v-model="lecEndDate" type="date" name="lecEndDate" /></td>
              </tr>
              <tr>
                <th>강의 일수</th>
                <td>
                  <input v-model="lecDaysCnt" type="text" name="lecDaysCnt" />{{ lecDaysCnt }}
                </td>
              </tr>
            </tbody>
          </table>
          <div class="button-container">
            <button type="button" @click="lectureManageSave">{{ !id ? '저장' : '수정' }}</button>
            <button type="button" @click="modalState.$patch({ isOpen: false })">취소</button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style>
@import './ManageListModalStyled.css';
</style>
