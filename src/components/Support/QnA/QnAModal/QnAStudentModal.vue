<script setup>
import router from '@/router';
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, onUnmounted, ref } from 'vue';

const emit = defineEmits(['postSuccess', 'unMountedModal']);
const { detailId: id } = defineProps({ detailId: { type: Number, default: 0 } });

const modalState = useModalState();
const formRef = ref();
const detail = ref({});
const imgObjectUrl = ref('');
const handlerInsert = () => {
  const formData = new FormData(formRef.value);

  axios.post('/api/support/noticeFileSave.do', formData).then((res) => {
    alert('저장되었습니다.');
    if (res.data.result === 'success') {
      modalState.$patch({ isOpen: false });
      emit('postSuccess');
    }
  });
};

const searchDetail = () => {
  const param = new URLSearchParams();
  param.append('qnaId', id);
  axios.post('/api/support/qnaDetail', param).then((res) => {
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
        <label> 제목 :<input v-model="detail.noticeTitle" type="text" name="fileTitle" /> </label>
        <label>
          내용 :<input v-model="detail.noticeContent" type="text" name="fileContent" />
        </label>
        파일 :
        <input id="fileInput" type="file" name="file" @change="handlerFile" />
        <label class="img-label" htmlFor="fileInput"> 파일 첨부하기 </label>
        <div class="cursor-pointer" @click="downloadFile">
          <div>
            <label>미리보기</label>
            <img :src="imgObjectUrl" class="preview-image" />
          </div>
        </div>
        <div class="button-container">
          <button type="button" @click="handlerInsert">저장</button>
          <button type="button" @click="modalState.$patch({ isOpen: false })">나가기</button>
        </div>
      </form>
    </div>
  </Teleport>
</template>

<style>
@import './styled.css';
</style>
