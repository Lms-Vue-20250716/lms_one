<script setup>
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, onUnmounted, ref } from 'vue';

const emit = defineEmits(['postSuccess', 'unMountedModal']);
const { detailId: id } = defineProps({ detailId: { type: Number, default: 0 } });

const modalState = useModalState();
const detail = ref({});

const handleDelete = () => {
  if (!confirm('삭제하시겠습니까?')) {
    return;
  }

  const param = new URLSearchParams();
  param.append('noticeId', id);
  axios.post('/api/support/noticeFileDelete.do', param).then((res) => {
    if (res.data.result === 'success') {
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
    console.log(res.data);
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
      <div class="modal-form modal-container">
        <label>
          제목 :<input v-model="detail.qnaTitle" type="text" name="qnaTitle" readonly />
        </label>
        <label>
          내용 :<input v-model="detail.qnaContent" type="text" name="qnaContent" readonly />
        </label>

        <template v-if="detail.qnaAnswer">
          댓글
          <label>댓글 작성자: {{ detail.tutorLoginId }}</label>
          <label>내용: <textarea v-model="detail.qnaAnswer" readonly> </textarea></label>
          <label> 댓글 작성일: <input v-model="detail.qnaAnswerDate" readonly /></label>
        </template>
        <div class="button-container">
          <button type="button" @click="handleDelete">삭제</button>
          <button type="button" @click="modalState.$patch({ isOpen: false })">나가기</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style>
@import './styled.css';
</style>
