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
  const formData = new FormData(formRef.value);
  axios.post('/api/support/saveMtr.do', formData).then((res) => {
    alert('저장되었습니다.');
    if (res.data.result === 'success') {
      modalState.$patch({ isOpen: false });
      emit('postSuccess');
    }
  });
};
const handlerUpdate = () => {
  const formDate = new FormData(formRef.value);
  formDate.append('materiId', id);
  axios.post('/api/support/updateMtr.do', formDate).then((res) => {
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
  param.append('materiId', id);
  axios.post('/api/support/deleteMtr.do', param).then((res) => {
    alert('삭제되었습니다.');
    modalState.$patch({ isOpen: false });
    emit('postSuccess');
  });
};
const searchDetail = () => {
  const param = new URLSearchParams();
  param.append('materiId', id);
  axios.post('/api/support/getMtrDetail.do', param).then((res) => {
    detail.value = res.data.detailValue;
    // const imgExt = ['jpg', 'png', 'jpeg', 'webp', 'gif'];
    // if (imgExt.includes(res.data.detailValue.fileExt.toLowerCase())) {
    //   getFileImage();
    // }
  });
};
const downloadFile = () => {
  const param = new URLSearchParams();
  param.append('materiId', id);
  axios.post('/api/support/materiDownload.do', param, { responseType: 'blob' }).then((res) => {
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
      <form ref="formRef" class="modal-form modal-container" @submit.prevent>
        <!-- 강의명 -->
        <label>
          강의명:
          <input
            v-model="detail.lecName"
            type="text"
            name="lecName"
            @focus="showDropdown = true"
            @input="filterLectures"
          />
          <input v-model="detail.lecId" type="hidden" name="lecId" />
          <input v-model="detail.materiId" type="hidden" name="materiId" />
        </label>
        <!-- 드롭다운 -->
        <div v-if="showDropdown" class="dropdown" @mouseleave="showDropdown = false">
          <div
            v-for="lec in filteredLectures"
            :key="lec.lecId"
            class="lec-item"
            @click="selectLecture(lec)"
          >
            {{ lec.lecName }}
          </div>
          <div v-if="!filteredLectures.length" class="lec-item-empty">
            수강중인 강의가 없습니다.
          </div>
        </div>
        <!-- 제목 -->
        <label>
          제목:
          <input v-model="detail.mtrTitle" type="text" name="mtrTitle" />
        </label>
        <!-- 내용 -->
        <label>
          내용:
          <textarea v-model="detail.mtrContent" name="mtrContent" rows="5"></textarea>
        </label>
        <!-- 파일 -->
        <label>
          파일:
          <input id="fileInput" type="file" name="file" @change="handlerFile" />
          <label class="img-label" for="fileInput">파일 첨부하기</label>
          <div class="cursor-pointer" @click="downloadFile">
            <div>
              <label>미리보기</label>
              <!-- <img :src="imgObjectUrl" class="preview-image" /> -->
            </div>
          </div>
        </label>

        <!-- 다운로드 링크 -->
        <div v-if="downloadUrl" class="cursor-pointer">
          <a :href="downloadUrl" download>파일 선택 또는 다운로드</a>
        </div>

        <!-- 버튼 -->
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
