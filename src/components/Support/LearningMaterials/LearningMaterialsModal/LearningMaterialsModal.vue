<script setup>
import { useModalState } from '@/stores/modalState';
import { useUserInfo } from '@/stores/loginInfoState';
import axios from 'axios';
import { computed, onMounted, onUnmounted, ref } from 'vue';

const emit = defineEmits(['postSuccess', 'unMountedModal']);
const { detailId: id, lectures = [] } = defineProps({
  detailId: { type: Number, default: 0 },
  lectures: { type: Array, default: () => [] },
});

const modalState = useModalState();
const userStore = useUserInfo();
const formRef = ref();
const detail = ref({});
const allLectures = ref(lectures);
const filteredLectures = ref(lectures);
const showDropdown = ref(false);

// 사용자 권한 체크
const userType = computed(() => userStore.user?.userType);
const canEdit = computed(() => userType.value === 'T');
const canDelete = computed(() => userType.value === 'T' || userType.value === 'M');
const canShowDropdown = computed(() => userType.value === 'T');

const isReadOnly = computed(() => {
  if (id && id > 0) {
    return !canEdit.value;
  }
  return false;
});

const initializeUser = async () => {
  await userStore.initializeFromSession();
};

const filterLectures = (e) => {
  const searchTerm = e.target.value.toLowerCase();
  filteredLectures.value =
    searchTerm === ''
      ? allLectures.value
      : allLectures.value.filter((lecture) => lecture.lecName.toLowerCase().includes(searchTerm));
  if (!isReadOnly.value && canShowDropdown.value) {
    showDropdown.value = true;
  }
};

const showAllLectures = () => {
  if (!isReadOnly.value && canShowDropdown.value) {
    filteredLectures.value = allLectures.value;
    showDropdown.value = true;
  }
};

const selectLecture = (lecture) => {
  detail.value.lecName = lecture.lecName;
  detail.value.lecId = lecture.lecId;
  showDropdown.value = false;
  document.activeElement?.blur();
};

const toggleDropdown = () => {
  if (!isReadOnly.value && canShowDropdown.value) {
    if (showDropdown.value) {
      showDropdown.value = false;
    } else {
      filteredLectures.value = allLectures.value;
      showDropdown.value = true;
    }
  }
};

const handleClickOutside = (e) => {
  if (!e.target.closest('.lecture-dropdown-container')) {
    showDropdown.value = false;
  }
};

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
  const formData = new FormData(formRef.value);
  formData.append('materiId', id);
  axios.post('/api/support/updateMtr.do', formData).then((res) => {
    alert('수정되었습니다.');
    if (res.data.result === 'success') {
      modalState.$patch({ isOpen: false });
      emit('postSuccess');
    }
  });
};

const handleDelete = () => {
  if (!confirm('삭제하시겠습니까?')) return;

  const param = new URLSearchParams();
  param.append('materiId', id);
  axios.post('/api/support/deleteMtr.do', param).then(() => {
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
  });
};
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    detail.value.fileName = file.name;
  } else {
    detail.value.fileName = '';
  }
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

onMounted(async () => {
  await initializeUser();
  if (id) {
    searchDetail();
  }
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  emit('unMountedModal', 0);
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay">
      <form ref="formRef" class="modal-form modal-container">
        <label>
          강의명:
          <div class="lecture-dropdown-container">
            <div class="lecture-input-wrapper">
              <input
                v-model="detail.lecName"
                type="text"
                name="lecName"
                :readonly="isReadOnly"
                placeholder="강의를 선택하세요 (검색 가능)"
                @focus="showAllLectures"
                @input="filterLectures"
              />
              <button
                v-if="!isReadOnly && canShowDropdown"
                type="button"
                class="dropdown-toggle-btn"
                @click="toggleDropdown"
              >
                ▼
              </button>
            </div>
            <input v-model="detail.lecId" type="hidden" name="lecId" />
            <input v-model="detail.materiId" type="hidden" name="materiId" />
            <div v-if="showDropdown && !isReadOnly && canShowDropdown" class="dropdown-list">
              <div
                v-for="lec in filteredLectures"
                :key="lec.lecId"
                class="dropdown-item"
                @click="selectLecture(lec)"
              >
                {{ lec.lecName }}
              </div>
              <div v-if="!filteredLectures.length" class="dropdown-item-empty">
                검색 결과가 없습니다.
              </div>
            </div>
          </div>
        </label>

        <label>
          제목:
          <input v-model="detail.materiTitle" type="text" name="mtrTitle" :readonly="isReadOnly" />
        </label>

        <label>
          내용:
          <textarea
            v-model="detail.materiContent"
            name="mtrContent"
            rows="5"
            :readonly="isReadOnly"
          ></textarea>
        </label>

        <div v-if="!isReadOnly">
          파일:
          <input id="fileInput" type="file" name="file" @change="handleFileChange" />
          <label class="img-label" for="fileInput">파일 첨부하기</label>
        </div>

        <div v-if="detail.fileName" class="cursor-pointer" @click="downloadFile">
          <div>
            <label>파일: {{ detail.fileName }}</label>
          </div>
        </div>

        <div class="button-container">
          <button v-if="canEdit" type="button" @click="!id ? handlerInsert() : handlerUpdate()">
            {{ !id ? '저장' : '수정' }}
          </button>
          <button v-if="id && canDelete" type="button" @click="handleDelete">삭제</button>
          <button type="button" @click="modalState.$patch({ isOpen: false })">나가기</button>
        </div>
      </form>
    </div>
  </Teleport>
</template>

<style>
@import './styled.css';
</style>
