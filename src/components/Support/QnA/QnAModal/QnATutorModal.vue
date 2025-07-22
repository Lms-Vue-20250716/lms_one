<script setup>
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, onUnmounted, ref } from 'vue';

const emit = defineEmits(['postSuccess', 'unMountedModal']);
const { detailId: id } = defineProps({ detailId: { type: Number, default: 0 } });

const modalState = useModalState();
const formRef = ref();
const detail = ref({});

const handlerUpdate = () => {
  if (!detail.value.qnaAnswer) {
    alert('내용을 작성해 주세요');
    return;
  }

  const formData = new FormData(formRef.value);
  formData.append('qnaId', id);
  axios.post('/api/support/qnaAnswerUpdate', formData).then((res) => {
    alert('저장되었습니다.');
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
  param.append('qnaId', id);
  axios.post('/api/support/qnaDelete', param).then((res) => {
    if (res.data.result === 'sucess') {
      alert('삭제되었습니다.');
      modalState.$patch({ isOpen: false });
      emit('postSuccess');
    } else {
      alert('삭제에 실패하였습니다.');
    }
  });
};

const searchDetail = () => {
  const param = [];
  param.push(`qnaId=${id}`);
  axios.get(`/api/support/qnaDetail?${param.join('&')}`).then((res) => {
    detail.value = res.data;
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
          제목 :<input v-model="detail.qnaTitle" type="text" name="fileTitle" readonly />
        </label>
        <label>
          내용 :<input v-model="detail.qnaContent" type="text" name="fileContent" readonly />
        </label>
        <label>댓글 작성자: {{ detail.tutorLoginId }}</label>
        <label>내용: <textarea v-model="detail.qnaAnswer" name="qnaAnswer"> </textarea></label>
        <label> 댓글 작성일: <input v-model="detail.qnaAnswerDate" readonly /></label>
        <div class="button-container">
          <button type="button" @click="handlerUpdate">저장</button>
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
