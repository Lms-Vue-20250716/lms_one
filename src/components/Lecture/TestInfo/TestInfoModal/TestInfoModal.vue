<script setup>
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, onUnmounted, ref } from 'vue';

const emit = defineEmits(['postSuccess', 'unMountedModal']);
// const { detailId: id } = defineProps({ detailId: { type: Number, default: 0 } });
const props = defineProps({ detailId: { type: Number, default: 0 } });

const modalState = useModalState();
const formRef = ref();
const detail = ref({
  lecId: '',
  lecName: '',
  lecInstructorName: '',
  lecRoomName: '',
  testBeginDate: '',
  testEndDate: '',
  testType: 'NORMAL',
});
const lectureList = ref([]);

const getLectureList = async () => {
  try {
    const res = await axios.post('/api/lecture/lectureSelectBoxList.do');
    lectureList.value = res.data.lecSelectBoxList || [];
  } catch (error) {
    console.error('강의 목록 가져오기 실패:', error);
  }
};
const handlerInsert = () => {
  const formData = new FormData(formRef.value);
  if (!formData.get('lecId')) {
    alert('강의를 선택해주세요.');
    return;
  }

  const requestData = {
    lecId: formData.get('lecId'),
    testBeginDate: formData.get('testBeginDate'),
    testEndDate: formData.get('testEndDate'),
    testType: formData.get('testType') || 0,
  };
  axios
    .post('/api/lecture/testInfoSave.do', requestData)
    .then((res) => {
      if (res.data.result === 'success') {
        alert('저장되었습니다.');
        modalState.$patch({ isOpen: false });
        emit('postSuccess');
      } else {
        alert('저장에 실패했습니다.');
      }
    })
    .catch((error) => {
      console.error('저장실패:', error);
      alert('저장 중 오류가 발생했습니다.');
    });
};
const handlerUpdate = () => {
  const formData = new FormData(formRef.value);

  const requestData = {
    testId: props.detailId.testId,
    lecId: props.detailId.lecId,
    testBeginDate: formData.get('testBeginDate'),
    testEndDate: formData.get('testEndDate'),
  };
  const param = new URLSearchParams(requestData);
  axios
    .post('/api/lecture/testInfoUpdate.do', param)
    .then((res) => {
      if (res.data.result === 'success') {
        alert('수정되었습니다.');
        modalState.$patch({ isOpen: false });
        emit('postSuccess');
      } else {
        alert('수정에 실패했습니다.');
      }
    })
    .catch((error) => {
      console.error('수정 실패:', error);
      alert('수정 중 오류가 발생했습니다.');
    });
};
const handleDelete = () => {
  if (!confirm('삭제하시겠습니까?')) {
    return;
  }

  const param = new URLSearchParams();
  param.append('testId', props.detailId.testId);
  param.append('lecId', props.detailId.lecId);
  axios
    .post('/api/lecture/testInfoDelete.do', param)
    .then((res) => {
      if (res.data.result === 'success') {
        alert('삭제되었습니다.');
        modalState.$patch({ isOpen: false });
        emit('postSuccess');
      } else {
        alert('삭제에 실패했습니다.');
      }
    })
    .catch((error) => {
      console.error('삭제 실패:', error);
      alert('삭제 중 오류가 발생했습니다.');
    });
};
const searchDetail = () => {
  const param = new URLSearchParams();
  param.append('testId', props.detailId.testId);
  param.append('lecId', props.detailId.lecId);

  axios
    .post('/api/lecture/testInfoDetail.do', param)
    .then((res) => {
      detail.value = res.data.testInfoDetail || {};
    })
    .catch((error) => {
      console.error('상세 정보 가져오기 실패:', error);
      detail.value = {};
    });
};
const onLectureChange = () => {
  if (!detail.value.lecId) return;

  const selectedLecture = lectureList.value.find((lec) => lec.lecId == detail.value.lecId);
  if (selectedLecture) {
    detail.value.lecInstructorName = selectedLecture.lecInstructorName || '';
    detail.value.lecRoomName = selectedLecture.lecRoomName || '';
  }
};
onMounted(async () => {
  await getLectureList();

  if (typeof props.detailId === 'object' && props.detailId.testId) {
    searchDetail();
  }
});

onUnmounted(() => {
  emit('unMountedModal', 0);
});
</script>
<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="modalState.$patch({ isOpen: false })">
      <form ref="formRef" class="modal-form modal-container">
        <h2 class="modal-title">
          {{
            typeof detailId === 'object' && detailId.testId ? '시험 정보 수정' : '시험 정보 등록'
          }}
        </h2>
        <div class="form-group">
          <label for="lecture">강의</label>
          <select
            id="lecId"
            v-model="detail.lecId"
            name="lecId"
            @change="onLectureChange"
            :disabled="typeof detailId === 'object' && detailId.testId"
          >
            <option value="">강의를 선택하세요</option>
            <option v-for="lecture in lectureList" :key="lecture.lecId" :value="lecture.lecId">
              {{ lecture.lecName }}
            </option>
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="instructor">강사</label>
            <input
              id="instructor"
              v-model="detail.lecInstructorName"
              type="text"
              name="instructor"
              placeholder="강사명을 입력하세요"
              readonly
            />
          </div>
          <div class="form-group">
            <label for="classroom">강의실</label>
            <input
              id="classroom"
              v-model="detail.lecRoomName"
              type="text"
              name="classroom"
              placeholder="강의실을 입력하세요"
              readonly
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="testBeginDate">시험 시작일</label>
            <input
              id="testBeginDate"
              v-model="detail.testBeginDate"
              type="datetime-local"
              name="testBeginDate"
              required
            />
          </div>
          <div class="form-group">
            <label for="testEndDate">시험 종료일</label>
            <input
              id="testEndDate"
              v-model="detail.testEndDate"
              type="datetime-local"
              name="testEndDate"
              required
            />
          </div>
        </div>
        <div class="button-container">
          <button
            type="button"
            @click="
              typeof detailId === 'object' && detailId.testId ? handlerUpdate() : handlerInsert()
            "
            class="btn-primary"
          >
            {{ typeof detailId === 'object' && detailId.testId ? '수정' : '저장' }}
          </button>
          <button
            v-if="typeof detailId === 'object' && detailId.testId"
            type="button"
            @click="handleDelete"
            class="btn-danger"
          >
            삭제
          </button>
          <button type="button" @click="modalState.$patch({ isOpen: false })" class="btn-secondary">
            나가기
          </button>
        </div>
      </form>
    </div>
  </Teleport>
</template>
<style>
@import './styled.css';
</style>
