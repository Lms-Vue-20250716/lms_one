<script setup>
import router from '@/router';
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, onUnmounted, ref } from 'vue';

const emit = defineEmits(['postSuccess', 'unMountedModal']);
const { detailId: id } = defineProps({ detailId: { type: Number, default: 0 } });

const modalState = useModalState();
const formRef = ref();
const lectureList = ref([]);
const lecture = ref();
const title = ref('');
const content = ref('');

const handlerInsert = () => {
  if (!lecture.value) {
    alert('강의를 선택하세요');
    return;
  }
  if (!title.value) {
    alert('제목을 입력하세요');
    return;
  }
  if (!content.value) {
    alert('내용을 입력하세요');
    return;
  }

  const formData = new FormData(formRef.value);

  axios.post('/api/support/qnaSave', formData).then((res) => {
    alert('저장되었습니다.');
    if (res.data.result === 'success') {
      modalState.$patch({ isOpen: false });
      emit('postSuccess');
    }
  });
};

onMounted(() => {
  axios.post('/api/support/getQnaLectureListBody.do').then((res) => {
    lectureList.value = res.data.lectureList;
  });
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
          강의 :
          <select v-model="lecture" name="lecId">
            <option v-for="lec in lectureList" :key="lec.lecId" :value="lec.lecId">
              {{ lec.lecName }}
            </option>
          </select>
        </label>
        <label> 제목 :<input v-model.lazy="title" type="text" name="qnaTitle" /> </label>
        <label> 내용 :<textarea v-model.lazy="content" name="qnaContent"> </textarea></label>
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
