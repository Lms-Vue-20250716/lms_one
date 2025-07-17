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

const handlerUpdate = () => {
  const formData = new FormData(formRef.value);
  formData.append('noticeId', id);
  axios.post('/api/support/noticeFileUpdate.do', formData).then((res) => {
    alert('수정되었습니다.');
    if (res.data.result === 'success') {
      modalState.$patch({ isOpen: false });
      emit('postSuccess');
    }
  });
};

const handleDelete = () => {
  if (!confirm('삭제하시겠습니까?')) {
  if (!confirm('삭제하시겠습니까?')) {
    return;
  }

  const param = new URLSearchParams();
  param.append('noticeId', id);
  axios.post('/api/support/noticeFileDelete.do', param).then((res) => {
    alert('삭제되었습니다.');
    modalState.$patch({ isOpen: false });
    emit('postSuccess');
  });
};

const searchDetail = () => {
  const param = new URLSearchParams();
  param.append('noticeId', id);
  axios.post('/api/support/noticeFileDetail.do', param).then((res) => {
    detail.value = res.data.detailValue;
    const imgExt = ['jpg', 'png', 'jpeg', 'webp', 'gif'];
    if (imgExt.includes(res.data.detailValue.fileExt.toLowerCase())) {
      getFileImage();
    }
  });
};
//미리보기 구현
const handlerFile = (e) => {
  //현재 파일이 이미지 파일이면 썸네일이 나올 것
  const fileInfo = e.target.files;
  const fileInfoSplit = fileInfo[0].name.split('.');
  const imgExt = ['jpg', 'png', 'jpeg', 'webp', 'gif'];
  if (imgExt.includes(fileInfoSplit[fileInfoSplit.length - 1].toLowerCase())) {
    imgObjectUrl.value = URL.createObjectURL(fileInfo[0]);
  }
};

//상세조회 썸네일 구현
const getFileImage = () => {
  const param = new URLSearchParams();
  param.append('noticeId', id);
  axios.post('/api/support/noticeDownload.do', param, { responseType: 'blob' }).then((res) => {
    imgObjectUrl.value = URL.createObjectURL(new Blob([res.data]));
  });
};

const downloadFile = () => {
  const param = new URLSearchParams();
  param.append('noticeId', id);
  axios.post('/api/support/noticeDownload.do', param, { responseType: 'blob' }).then((res) => {
    const url = URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', detail.value.fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
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
