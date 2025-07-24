<script setup>
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, onUnmounted, ref } from 'vue';

const emit = defineEmits(['postSuccess', 'unMountedModal']);
const { detailId: id } = defineProps({ detailId: { type: Number, default: 0 } });

const modalState = useModalState();
const formRef = ref();
const detail = ref({});

const searchAddress = () => {
  new window.daum.Postcode({
    oncomplete: function (data) {
      const currentFormData = new FormData(formRef.value);
      const currentValues = {};
      for (let [key, value] of currentFormData.entries()) {
        currentValues[key] = value;
      }
      detail.value = {
        ...detail.value,
        ...currentValues,
        zipcode: data.zonecode,
        companyLoc: '001',
        roadAddress: data.roadAddress,
        detailAddress:
          data.roadAddress + (detail.value.detailAddress ? ' ' + detail.value.detailAddress : ''),
      };
    },
  }).open();
};

const handlerInsert = () => {
  const formData = new FormData(formRef.value);
  formData.append('companyId', id);

  axios.post('/api/system/companySave.do', formData).then((res) => {
    alert('저장되었습니다.');
    if (res.data.result === 'success') {
      modalState.$patch({ isOpen: false });
      emit('postSuccess');
    }
  });
};

const handlerUpdate = () => {
  const formData = new FormData(formRef.value);
  formData.append('companyId', id);

  axios.post('/api/system/companyUpdate.do', formData).then((res) => {
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
  param.append('companyId', id);
  axios.post('/api/system/companyDelete.do', param).then(() => {
    alert('삭제되었습니다.');
    modalState.$patch({ isOpen: false });
    emit('postSuccess');
  });
};

const searchDetail = () => {
  if (!id || id === 0) {
    detail.value = {};
    return;
  }
  const param = new URLSearchParams();
  param.append('companyId', id);
  axios.post('/api/system/companyDetail.do', param).then((res) => {
    const data = res.data.detailValue || {};
    detail.value = {
      ...data,
      roadAddress: data.companyLoc || '',
      companyLoc: data.zipcode || '',
      zipcode: data.zipcode || '',
    };
  });
};

onMounted(() => {
  searchDetail();
});
onUnmounted(() => {
  emit('unMountedModal', 0);
});
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="modal-title">
          {{ !id || id === 0 ? '회사 등록' : '회사 정보' }}
        </h2>
        <button type="button" class="close-button" @click="modalState.$patch({ isOpen: false })">
          ×
        </button>
      </div>

      <form ref="formRef" class="modal-form">
        <div class="form-row">
          <label class="form-label required">회사명</label>
          <input
            :value="detail.companyName || ''"
            type="text"
            name="companyName"
            class="form-input"
          />
        </div>

        <div class="form-row">
          <label class="form-label required">대표명</label>
          <input
            :value="detail.companyCeo || ''"
            type="text"
            name="companyCeo"
            class="form-input"
          />
        </div>

        <div class="form-row">
          <label class="form-label required">휴대전화</label>
          <input
            :value="detail.companyHp || ''"
            type="text"
            name="companyHp"
            class="form-input"
            placeholder="전화번호 입력"
          />
        </div>

        <div class="form-row">
          <label class="form-label required">우편번호</label>
          <div class="address-row">
            <input
              :value="detail.zipcode || ''"
              type="text"
              name="zipcode"
              class="form-input address-input"
              placeholder="우편번호"
              readonly
            />
            <button type="button" class="address-search-btn" @click="searchAddress">
              주소 검색
            </button>
          </div>
        </div>

        <div class="form-row">
          <label class="form-label required">기본주소</label>
          <input
            :value="detail.roadAddress || ''"
            type="text"
            class="form-input readonly"
            placeholder="기본주소"
            readonly
          />
          <input type="hidden" name="companyLoc" :value="detail.companyLoc || '001'" />
        </div>

        <div class="form-row">
          <label class="form-label required">상세주소</label>
          <input
            :value="detail.detailAddress || ''"
            type="text"
            name="companyDetailAddress"
            class="form-input"
            placeholder="상세주소 (도로명주소 + 상세주소)"
          />
        </div>

        <div class="form-row">
          <label class="form-label required">이메일</label>
          <input
            :value="detail.companyEmail || ''"
            type="email"
            name="companyEmail"
            class="form-input"
            placeholder="example@example.com"
          />
        </div>

        <div class="form-row">
          <label class="form-label required">가입일자</label>
          <input
            :value="detail.companyRegDate || ''"
            type="date"
            name="companyRegDate"
            class="form-input"
          />
        </div>

        <div class="button-container">
          <button type="button" @click="!id || id === 0 ? handlerInsert() : handlerUpdate()">
            {{ !id || id === 0 ? '저장' : '수정' }}
          </button>
          <button v-if="id && id !== 0" type="button" @click="handleDelete">삭제</button>
          <button type="button" class="cancel-button" @click="modalState.$patch({ isOpen: false })">
            취소
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style>
@import './styled.css';
</style>
