<script setup>
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, onUnmounted, ref } from 'vue';

const emit = defineEmits(['postSuccess', 'unMountedModal']);
const { detailId: id } = defineProps({ detailId: { type: Number, default: 0 } });

const modalState = useModalState();
const formRef = ref();
const originalCode = ref('');
const detail = ref({
  useYn: '',
  groupName: '',
  detailCode: '',
  detailName: '',
  regId: '',
});
const handlerUpdate = () => {
  if (!detail.value.detailCode.trim()) {
    alert('시리얼코드를 입력해주세요.');
    return;
  }
  if (!detail.value.detailName.trim()) {
    alert('상세명을 입력해주세요.');
    return;
  }
  const formData = new FormData(formRef.value);
  formData.append('oldDetailCode', originalCode.value);
  formData.append('newDetailCode', detail.value.detailCode);
  formData.append('regId', id);

  axios.post('/api/system/commonUpdate.do', formData).then((res) => {
    if (res.data.result === 'success') {
      alert('수정되었습니다.');
      modalState.$patch({ isOpen: false });
      emit('postSuccess');
    } else {
      alert('수정에 실패했습니다.');
    }
  });
};

const searchDetail = () => {
  const param = new URLSearchParams();
  param.append('detailCode', id);
  axios.post('/api/system/commonDetail.do', param).then((res) => {
    console.log('서버 응답:', res.data);
    detail.value = res.data.detailValue;
    originalCode.value = res.data.detailValue.detailCode;
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
      <div class="modal-container">
        <div class="modal-header">
          <h2>공통 코드</h2>
          <button type="button" class="close-button" @click="modalState.$patch({ isOpen: false })">
            ✕
          </button>
        </div>

        <form ref="formRef" class="modal-form">
          <table class="modal-table">
            <tbody>
              <tr>
                <td class="label-cell">대분류</td>
                <td class="input-cell">
                  <input v-model="detail.useYn" type="text" name="useYn" readonly />
                </td>
              </tr>
              <tr>
                <td class="label-cell">그룹코드</td>
                <td class="input-cell">
                  <input v-model="detail.groupName" type="text" name="groupName" readonly />
                </td>
              </tr>
              <tr>
                <td class="label-cell">시리얼코드<span class="required">*</span></td>
                <td class="input-cell">
                  <input v-model="detail.detailCode" type="text" name="detailCode" required />
                </td>
              </tr>
              <tr>
                <td class="label-cell">상세명<span class="required">*</span></td>
                <td class="input-cell">
                  <input v-model="detail.detailName" type="text" name="detailName" required />
                </td>
              </tr>
              <tr>
                <td class="label-cell">번호</td>
                <td class="input-cell">
                  <input v-model="detail.regId" type="text" name="regId" readonly />
                </td>
              </tr>
            </tbody>
          </table>

          <div class="button-container">
            <button type="submit" @click="handlerUpdate()">수정</button>
            <button type="button" @click="modalState.$patch({ isOpen: false })">취소</button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
<style>
@import './styled.css';
</style>
