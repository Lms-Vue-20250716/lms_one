<script setup>
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { ref } from 'vue';

const emit = defineEmits(['postSuccess', 'unMountedModal']);
const { detailId: id } = defineProps({ detailId: { type: Number, default: 0 } });

const modalState = useModalState();
const formRef = ref();
const detail = ref({});
const handlerInsert = () => {
  const formData = new FormData(formRef.value);
  axios.post('api/lecture/testInfoSave.do', formData).then((res) => {
    alert('저장되었습니다.');
    if (res.data.result === 'success') {
      modalState.$patch({ isOpen: false });
      emit('postSuccess');
    }
  });
};
const handlerUpdate = () => {
  const formData = new FormData(formRef.value);
  formData.append('lecId', id);
  axios.post('api/lecture/testInfoUpdate.do', formData).then((res) => {
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
  param.append('lecId', id);
  axios.post('/api/lecture/testInfoDelete.do', param).then((res) => {
    alert('삭제되었습니다.');
    modalState.$patch({ isOpen: false });
    emit('postSuccess');
  });
};
</script>
<template>123</template>
