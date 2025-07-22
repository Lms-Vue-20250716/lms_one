<script setup>
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, onUnmounted, readonly, ref, watch } from 'vue';

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
const lecNameDirect = ref('');

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

  axios.post('/api/lecture/lectureDetail.do', param).then((res) => {
    detail.value = res.data.lectureDetailValue;

    lecName.value = detail.value.lecName;
    insName.value = detail.value.lecInstructorName;
    lecDaysCnt.value = detail.value.lecDaysCnt;
    lecPersonnel.value = detail.value.lecPersonnel;
    lecClassRoom.value = detail.value.lecRoomName;
    // lecStartDate.value = detail.value.lecStartDate;
    // lecEndDate.value = detail.value.lecEndDate;
  });
};

const lectureManageSave = () => {
  // lecInstructorId, roomId 추출
  const selectIns = insName.value;
  const selectRoom = lecClassRoom.value;

  const InsId = instructorInfoList.value.find((item) => item.insName === selectIns);
  const roomId = classRoomList.value.find((item) => item.roomName === selectRoom);

  // 강의명 직접 입력 시 저장
  if (lecName.value === 'direct' || lecName.value === '직접 입력') {
    if (!lecNameDirect.value) {
      alert('강의명을 입력해주세요.');
      return;
    }
    lecName.value = lecNameDirect.value;
  }

  if (!lecName.value) {
    alert('강의명을 선택해주세요.');
    return;
  }

  if (!insName.value) {
    alert('강사명을 입력해주세요.');
    return;
  }

  if (!lecClassRoom.value) {
    alert('강의실을 선택해주세요.');
    return;
  }

  // 정원 숫자 검사
  const personnelRaw = lecPersonnel.value;
  const personnel = parseInt(personnelRaw);

  if (!personnelRaw || isNaN(personnel)) {
    alert('정원은 숫자로 입력해주세요.');
    return;
  } else if (personnel === 0) {
    alert('정원은 0이하로 입력 할 수  없습니다.\n다시 입력해주세요.');
    return;
  }

  if (personnel > 50) {
    const confirmResult = confirm('정원이 50명을 초과했습니다. 계속 진행하시겠습니까?');
    if (!confirmResult) {
      return;
    }
  }

  if (!lecStartDate.value) {
    alert('강의 시작일을 선택해주세요.');
    return;
  }

  if (!lecEndDate.value) {
    alert('강의 종료일을 선택해주세요.');
    return;
  }

  if (!lecDaysCnt.value) {
    alert('강의 일수를 확인해주세요.');
    return;
  }

  const param = {
    // lecId: id,
    lecName: lecName.value,
    lecInstructorId: InsId.lecInstructorId,
    lecPersonnel: lecPersonnel.value,
    lecRoomId: roomId.roomId,
    lecStartDate: lecStartDate.value,
    lecEndDate: lecEndDate.value,
    lecDaysCnt: lecDaysCnt.value,
  };

  axios.post('/api/lecture/lectureManageSave.do', param).then((res) => {
    if (res.data.result === 'success') {
      alert('저장되었습니다.');
      modalState.$patch({ isOpen: false, type: null });
      emit('postSuccess');
    }
  });
};

const lectureManageUpdate = () => {
  // lecInstructorId, roomId 추출
  const selectIns = insName.value;
  const selectRoom = lecClassRoom.value;

  const InsId = instructorInfoList.value.find((item) => item.insName === selectIns);
  const roomId = classRoomList.value.find((item) => item.roomName === selectRoom);

  if (!insName.value) {
    alert('강사명을 입력해주세요.');
    return;
  }

  if (!lecClassRoom.value) {
    alert('강의실을 선택해주세요.');
    return;
  }

  // 정원 숫자 검사
  const personnelRaw = lecPersonnel.value;
  const personnel = parseInt(personnelRaw);

  if (!personnelRaw || isNaN(personnel)) {
    alert('정원은 숫자로 입력해주세요.');
    return;
  } else if (personnel === 0) {
    alert('정원은 0이하로 입력 할 수  없습니다.\n다시 입력해주세요.');
    return;
  }

  if (personnel > 50) {
    const confirmResult = confirm('정원이 50명을 초과했습니다. 계속 진행하시겠습니까?');
    if (!confirmResult) {
      return;
    }
  }

  if (!lecStartDate.value) {
    alert('강의 시작일을 선택해주세요.');
    return;
  }

  if (!lecEndDate.value) {
    alert('강의 종료일을 선택해주세요.');
    return;
  }

  if (!lecDaysCnt.value) {
    alert('강의 일수를 확인해주세요.');
    return;
  }

  const param = new URLSearchParams();
  param.append('lecId', id);
  param.append('lecName', lecName.value);
  param.append('lecInstructorId', InsId.lecInstructorId);
  param.append('lecPersonnel', lecPersonnel.value);
  param.append('lecRoomId', roomId.roomId);
  param.append('lecStartDate', lecStartDate.value);
  param.append('lecEndDate', lecEndDate.value);
  param.append('lecDaysCnt', lecDaysCnt.value);

  axios.post('/api/lecture/lectureManageUpdate.do', param).then((res) => {
    if (res.data.result === 'success') {
      alert('수정되었습니다.');
      modalState.$patch({ isOpen: false, type: null });
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
  }
  lectureSelectBox();
});

onUnmounted(() => {
  emit('unMountedModal', 0);
});

const validateEndDate = () => {
  const sDate = new Date(lecStartDate.value);

  do {
    sDate.setDate(sDate.getDate() + 1);
  } while (sDate.getDay() === 0 || sDate.getDay() === 6);

  const newEnd = sDate.toISOString().split('T')[0];
  lecEndDate.value = newEnd;
};

watch([lecStartDate, lecEndDate], ([newStart, newEnd]) => {
  if (newStart && newEnd) {
    if (newStart > newEnd) {
      alert('강의 종료일은 강의 시작일보다 빠를 수 없습니다.');
      validateEndDate();
    } else {
      dateCalc();
    }
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
                  <select v-model="lecName" name="lecName" :disabled="id ? true : isReadOnly">
                    <option>강의 선택</option>
                    <option v-for="lecName in lecNameList" :key="lecName.lecId">
                      {{ lecName.lecName }}
                    </option>
                  </select>
                  <div v-if="lecName === 'direct' || lecName === '직접 입력'">
                    <input v-model="lecNameDirect" type="text" />
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
                      :key="instructorInfo.lecInstructorId"
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
                  <input v-model="lecDaysCnt" type="text" name="lecDaysCnt" :disabled="readonly" />
                </td>
              </tr>
            </tbody>
          </table>
          <div class="button-container">
            <button type="button" @click="!id ? lectureManageSave() : lectureManageUpdate()">
              {{ !id ? '저장' : '수정' }}
            </button>
            <button type="button" @click="modalState.$patch({ isOpen: false, type: null })">
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
@import './ManageListModalStyled.css';
</style>
