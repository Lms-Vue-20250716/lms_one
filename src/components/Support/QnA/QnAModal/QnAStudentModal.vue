<script setup>
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, onUnmounted, ref } from 'vue';

const emit = defineEmits(['postSuccess', 'unMountedModal']);
const { detailId: id } = defineProps({ detailId: { type: Number, default: 0 } });

const modalState = useModalState();
const detail = ref({});

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
          <button type="button" @click="modalState.$patch({ isOpen: false })">나가기</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style>
@import './styled.css';
</style>
