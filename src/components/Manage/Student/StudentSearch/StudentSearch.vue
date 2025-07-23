<script setup>
import router from '@/router';
import { onMounted, ref } from 'vue';

const searchName = ref('');
const regStDate = ref('');
const regEdDate = ref('');
const searchStatusYn = ref('');

const handlerSearch = () => {
  const query = [];

  !searchName.value || query.push(`searchName=${searchName.value}`);
  !regStDate.value || query.push(`regStDate=${regStDate.value}`);
  !regEdDate.value || query.push(`regEdDate=${regEdDate.value}`);
  !searchStatusYn.value || query.push(`searchStatusYn=${searchStatusYn.value}`);

  const queryString = query.length > 0 ? `?${query.join('&')}` : '';

  router.push(queryString);
};

onMounted(() => {
  window.location.search && router.replace(window.location.pathname);
});
</script>

<template>
  <div class="list-container">
    <div class="input-box">
      이름
      <input v-model="searchName" />
      재학상태
      <select v-model="searchStatusYn">
        <option value="">선택</option>
        <option value="W">승인대기</option>
        <option value="Y">재학</option>
        <option value="N">탈퇴</option>
      </select>
      가입 기간
      <input v-model="regStDate" type="date" /> ~
      <input v-model="regEdDate" type="date" />
      <button @click="handlerSearch">검색</button>
    </div>
  </div>
</template>
