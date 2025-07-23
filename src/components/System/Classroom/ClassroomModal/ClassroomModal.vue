<script setup>
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, onUnmounted, ref } from 'vue';

const emit = defineEmits(['postSuccess', 'unMountedModal']);
const { detailId: id } = defineProps({ detailId: { type: Number, default: 0 } });

const modalState = useModalState();
const formRef = ref();
const detail = ref({});

const handlerInsert = () => {
  if (!confirm('저장하시겠습니까?')) {
    return;
  }
  if (detail.value.roomName.trim() === '') {
    alert('강의실 이름을 입력해 주세요.');
    return;
  }
  const formData = new FormData(formRef.value);
  axios.post('/api/system/classroomSave.do', formData).then((res) => {
    alert('저장되었습니다.');
    if (res.data.result === 'success') {
      modalState.$patch({ isOpen: false });
      emit('postSuccess');
    }
  });
};

const handlerUpdate = () => {
  if (!confirm('수정하시겠습니까?')) {
    return;
  }

  const formData = new FormData(formRef.value);
  formData.append('roomId', id);
  axios.post('/api/system/classroomUpdate.do', formData).then((res) => {
    alert('수정되었습니다.');
    if (res.data.result === 'success') {
      modalState.$patch({ isOpen: false });
      emit('postSuccess');
    }
  });
};

const handleDelete = () => {
  if (!confirm('삭제하시겠습니까?')) {
    return;
  }

  const param = new URLSearchParams();
  param.append('roomId', id);
  axios.post('/api/system/classroomDelete.do', param).then((res) => {
    alert('삭제되었습니다.');
    modalState.$patch({ isOpen: false });
    emit('postSuccess');
  });
};

const searchDetail = () => {
  const param = new URLSearchParams();
  param.append('roomId', id);
  axios.post('/api/system/classroomDetail.do', param).then((res) => {
    detail.value = res.data.detailValue;
  });
};

onMounted(() => {
  if (id) {
    searchDetail();
  }
});

onUnmounted(() => {
  emit('unMountedModal', 0);
});
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay">
      <form ref="formRef" class="modal-form modal-container">
        <label>
          강의실 이름<input v-model="detail.roomName" type="text" name="roomName" required="true" />
        </label>
        <label>
          강의실 정원 :<input
            v-model="detail.roomPersonnel"
            type="number"
            name="roomPersonnel"
            class="border"
          />
        </label>
        <label>
          강의실 사이즈 :<input v-model="detail.roomSize" type="text" name="roomSize" />
        </label>
        <label> 비고 :<input v-model="detail.roomRemark" type="text" name="roomRemark" /> </label>
        <div class="button-container">
          <button type="button" @click="!id ? handlerInsert() : handlerUpdate()">
            {{ !id ? '저장' : '수정' }}
          </button>
          <button v-if="id" type="button" @click="handleDelete">삭제</button>
          <button type="button" @click="modalState.$patch({ isOpen: false })">나가기</button>
        </div>
      </form>
    </div>
  </Teleport>
</template>

<style>
@import './styled.css';
</style>
