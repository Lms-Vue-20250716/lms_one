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
      detail.value = {
        ...detail.value,
        zipcode: data.zonecode,
        roadAddress: data.roadAddress,
      };
    },
  }).open();
};

const handlerInsert = () => {
  const param = {
    companyName: detail.value.companyName || '',
    companyCeo: detail.value.companyCeo || '',
    companyHp: detail.value.companyHp || '',
    companyLoc: detail.value.zipcode || '',
    companyEmail: detail.value.companyEmail || '',
    companyRegDate: detail.value.companyRegDate || '',
    companyDetailAddress: detail.value.detailAddress || '',
    detailName: detail.value.roadAddress || '',
  };

  axios
    .post('/api/system/companySave.do', param, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((res) => {
      alert('저장되었습니다.');
      if (res.data.result === 'success') {
        modalState.$patch({ isOpen: false });
        emit('postSuccess');
      }
    });
};

const handlerUpdate = () => {
  const param = {
    companyId: id,
    companyName: detail.value.companyName || '',
    companyCeo: detail.value.companyCeo || '',
    companyHp: detail.value.companyHp || '',
    companyLoc: detail.value.zipcode || '',
    companyEmail: detail.value.companyEmail || '',
    companyRegDate: detail.value.companyRegDate || '',
    companyDetailAddress: detail.value.detailAddress || '',
    detailName: detail.value.roadAddress || '',
  };

  axios
    .post('/api/system/companyUpdate.do', param, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((res) => {
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
  const param = {
    companyId: id,
  };

  axios
    .post('/api/system/companyDelete.do', param, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then(() => {
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
  const param = {
    companyId: id,
  };

  axios
    .post('/api/system/companyDetail.do', param, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((res) => {
      const data = res.data.detailValue || {};
      detail.value = {
        companyName: data.companyName || '',
        companyCeo: data.companyCeo || '',
        companyHp: data.companyHp || '',
        companyEmail: data.companyEmail || '',
        companyRegDate: formatDate(data.companyRegDate) || '',
        detailAddress: data.detailAddress || '',
        zipcode: data.zipcode || '',
        roadAddress: data.companyLoc || '',
      };
    });
};

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return year + '-' + month + '-' + day;
};

const formatPhoneNumber = (event) => {
  const input = event.target;
  let numbers = input.value.replace(/\D/g, '');
  let formatted = '';

  if (numbers.startsWith('02')) {
    if (numbers.length <= 2) {
      formatted = numbers;
    } else if (numbers.length <= 5) {
      formatted = numbers.slice(0, 2) + '-' + numbers.slice(2);
    } else if (numbers.length <= 9) {
      formatted = numbers.slice(0, 2) + '-' + numbers.slice(2, 5) + '-' + numbers.slice(5);
    } else {
      formatted = numbers.slice(0, 2) + '-' + numbers.slice(2, 6) + '-' + numbers.slice(6, 10);
    }
  } else {
    if (numbers.length <= 3) {
      formatted = numbers;
    } else if (numbers.length <= 7) {
      formatted = numbers.slice(0, 3) + '-' + numbers.slice(3);
    } else if (numbers.length <= 11) {
      formatted = numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7, 11);
    } else {
      formatted = numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7, 11);
    }
  }

  detail.value.companyHp = formatted;
};

const validateEmail = (event) => {
  const value = event.target.value;
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  detail.value.emailValid = value.length === 0 || isValid;
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
          <label class="form-label required">회사명 *</label>
          <input v-model="detail.companyName" type="text" class="form-input" />
        </div>

        <div class="form-row">
          <label class="form-label required">대표명 *</label>
          <input v-model="detail.companyCeo" type="text" class="form-input" />
        </div>

        <div class="form-row">
          <label class="form-label required">휴대전화 *</label>
          <input
            v-model="detail.companyHp"
            type="text"
            class="form-input"
            placeholder="전화번호 입력"
            maxlength="13"
            @input="formatPhoneNumber"
          />
        </div>

        <div class="form-row">
          <label class="form-label required">우편번호 *</label>
          <div class="address-row">
            <input
              v-model="detail.zipcode"
              type="text"
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
          <label class="form-label required">기본주소 *</label>
          <input
            v-model="detail.roadAddress"
            type="text"
            class="form-input readonly"
            placeholder="기본주소"
            readonly
          />
        </div>

        <div class="form-row">
          <label class="form-label required">상세주소 *</label>
          <input
            v-model="detail.detailAddress"
            type="text"
            class="form-input"
            placeholder="상세주소"
          />
        </div>

        <div class="form-row">
          <label class="form-label required">이메일 *</label>
          <input
            v-model="detail.companyEmail"
            type="email"
            class="form-input"
            placeholder="example@example.com"
            @input="validateEmail"
          />
          <div v-if="detail.emailValid === false" class="email-warning">
            이메일 형식이 올바르지 않습니다.
          </div>
        </div>

        <div class="form-row">
          <label class="form-label required">가입일자 *</label>
          <input v-model="detail.companyRegDate" type="date" class="form-input" />
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
