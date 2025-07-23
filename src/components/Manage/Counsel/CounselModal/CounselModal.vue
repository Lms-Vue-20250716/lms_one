<script setup>
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, onUnmounted, ref } from 'vue';

const formRef = ref();
const modalState = useModalState();
const { detailId: id, lectureList: lecList } = defineProps({
  detailId: { type: Number, default: 0 },
  lectureList: { type: Array, default: () => [] },
});
const detail = ref({});
const emit = defineEmits(['postSuccess', 'unMountedModal']);

const counselDetail = () => {
  const param = new URLSearchParams();
  param.append('counselId', id);

  axios.post('/api/manage/counselDetail.do', param).then((res) => {
    detail.value = res.data.detailValue;
  });
  console.log('detail.value => ', detail.value);
  console.log('detail.value.lecId => ', detail.value.lecId);
  console.log('lecList => ', lecList);
};

const counselSave = () => {
  const lecId = lecList.find((item) => item.lecName === detail.value.lecName);

  // console.log('detail.value', detail.value);
  // console.log('detail.value.lecId =>', lecId);
  // console.log('detail.value.lecName =>', detail.value.lecName);
  // console.log('lecList =>', lecList);
  // console.log('lecId =>', lecId);
  // console.log('lecId.lecId =>', lecId.lecId);

  const param = new URLSearchParams();
  param.append('counselId', '');
  param.append('counselStudentName', detail.value.counselStudentName);
  param.append('counselTitle', detail.value.counselTitle);
  param.append('counselContent', detail.value.counselContent);
  param.append('counselLecId', lecId.lecId);

  if (!detail.value.lecName) {
    alert('과목을 선택해주세요.');
    return;
  }
  if (!detail.value.counselStudentName) {
    alert('학생이름을 입력해주세요.');
    return;
  }
  if (!detail.value.counselTitle) {
    alert('제목을 입력해주세요.');
    return;
  }
  if (!detail.value.counselContent) {
    alert('내용을 입력해주세요.');
    return;
  }

  axios.post('/api/manage/counselSave.do', param).then((res) => {
    if (res.data.result === 'success') {
      alert('저장되었습니다.');
      modalState.$patch({ isOpen: false, type: null });
      emit('postSuccess');
    }
  });
};

const counselUpdate = () => {
  const lecId = lecList.find((item) => item.lecName === detail.value.lecName);

  const param = new URLSearchParams();
  param.append('counselId', id);
  param.append('counselStudentName', detail.value.counselStudentName);
  param.append('counselTitle', detail.value.counselTitle);
  param.append('counselContent', detail.value.counselContent);
  param.append('counselLecId', lecId.lecId);

  if (!detail.value.lecName) {
    alert('과목을 선택해주세요.');
    return;
  }
  if (!detail.value.counselStudentName) {
    alert('학생이름을 입력해주세요.');
    return;
  }
  if (!detail.value.counselTitle) {
    alert('제목을 입력해주세요.');
    return;
  }
  if (!detail.value.counselContent) {
    alert('내용을 입력해주세요.');
    return;
  }

  axios.post('/api/manage/counselUpdate.do', param).then((res) => {
    if (res.data.result === 'success') {
      alert('저장되었습니다.');
      modalState.$patch({ isOpen: false, type: null });
      emit('postSuccess');
    }
  });
};

const counselDelete = () => {
  const param = new URLSearchParams();
  param.append('counselId', id);

  axios.post('/api/manage/counselDelete.do', param).then((res) => {
    if (res.data.result === 'success') {
      alert('삭제되었습니다.');
      modalState.$patch({ isOpen: false, type: null });
      emit('postSuccess');
    }
  });
};

onMounted(() => {
  if (id && modalState.isOpen && modalState.type == 'manageCounsel') {
    counselDetail();
  }
});

onUnmounted(() => {
  emit('unMountedModal', 0);
});
</script>

<template>
  <Teleport to="body">
    <form ref="formRef">
      <div class="modal-overlay" @click="modalState.$patch({ isOpen: false, type: null })">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h2 class="modal-title">상담관리</h2>
            <button class="close-button" @click="modalState.$patch({ isOpen: false, type: null })">
              ×
            </button>
          </div>

          <div class="modal-body">
            <div class="form-row">
              <label class="form-label required">상담 과목</label>
              <select v-model="detail.lecName" class="form-select">
                <option>-- 과목을 선택하세요 --</option>
                <option v-for="lec in lecList" :key="lec.lecId">{{ lec.lecName }}</option>
              </select>
            </div>

            <div class="form-row">
              <label class="form-label required">상담 학생</label>
              <input v-model="detail.counselStudentName" type="text" class="form-input" />
            </div>

            <div class="form-row">
              <label class="form-label required">상담 제목</label>
              <input v-model="detail.counselTitle" type="text" class="form-input" />
            </div>

            <div class="form-row">
              <label class="form-label required">상담 내용</label>
              <textarea v-model="detail.counselContent" class="form-textarea" rows="4"></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              @click="modalState.type === 'manageCounsel' ? counselUpdate() : counselSave()"
            >
              {{ modalState.type === 'manageCounsel' ? '수정' : '저장' }}
            </button>
            <button
              v-if="modalState.type === 'manageCounsel'"
              type="button"
              class="btn btn-secondary"
              @click="counselDelete()"
            >
              삭제
            </button>
            <button
              type="button"
              class="btn btn-cancel"
              @click="modalState.$patch({ isOpen: false, type: null })"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </form>
  </Teleport>
</template>

<style scope>
@import './counselModalStyled.css';
</style>
