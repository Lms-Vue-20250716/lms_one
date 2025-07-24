<script setup>
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, onUnmounted, ref } from 'vue';

const emit = defineEmits(['postSuccess', 'unMountedModal']);
const { detailId: id, roomId } = defineProps({
  detailId: { type: Number, default: 0 },
  roomId: { type: Number, default: 0 },
});

const modalState = useModalState();
const formRef = ref();
const detail = ref({
  equipSerial: '',
  equipName: '',
  equipQuantity: 0,
  equipPurchaseDate: '',
  equipPerioduseDate: '',
  equipGroup: '',
  roomId: '',
});

const eqpGrp = ref('');
const selectedRoom = ref(roomId);
const imgObjectUrl = ref('');
const classRoomList = ref([]);

const handlerInsert = () => {
  const formData = new FormData(formRef.value);
  axios.post('/api/system/equipFileSave.do', formData).then((res) => {
    alert('저장되었습니다.');
    if (res.data.result === 'success') {
      modalState.$patch({ isOpen: false });
      emit('postSuccess');
    }
  });
};

const handlerUpdate = () => {
  const formData = new FormData(formRef.value);
  formData.append('equipId', id);
  axios.post('/api/system/equipmentUpdate.do', formData).then((res) => {
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
  param.append('equipId', id);
  axios.post('/api/system/equipmentDelete.do', param).then((res) => {
    alert('삭제되었습니다.');
    modalState.$patch({ isOpen: false });
    emit('postSuccess');
  });
};

const searchDetail = async () => {
  const param = new URLSearchParams();
  param.append('equipId', id);
  const res = await axios.post('/api/system/equipmentDetail.do', param);
  const data = res.data.detailValue;

  data.equipPurchaseDate = data.equipPurchaseDate
    ? new Date(data.equipPurchaseDate).toISOString().split('T')[0]
    : '';
  data.equipPerioduseDate = data.equipPerioduseDate
    ? new Date(data.equipPerioduseDate).toISOString().split('T')[0]
    : '';

  detail.value = data;
  eqpGrp.value = data.equipGroup;
  selectedRoom.value = roomId;
};

const handlerFile = (e) => {
  const fileInfo = e.target.files;
  if (!fileInfo || fileInfo.length === 0) return;

  const fileName = fileInfo[0].name;
  const fileExt = fileName.split('.').pop().toLowerCase();
  const imgExt = ['jpg', 'png', 'jpeg', 'webp', 'gif'];

  if (imgExt.includes(fileExt)) {
    imgObjectUrl.value = URL.createObjectURL(fileInfo[0]);
  } else {
    imgObjectUrl.value = '';
  }
};

onMounted(() => {
  axios.post('/api/system/classroomJsonList.do').then((res) => {
    classRoomList.value = res.data.detailValue;
  });
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
        <h2 className="mb-4 text-center text-xl font-bold">장비 관리</h2>

        <label>
          <span> 시리얼넘버<span class="required">*</span> </span>
          <input type="text" name="equipSerial" v-model="detail.equipSerial" required />
        </label>

        <label>
          <span> 강의실<span class="required">*</span> </span>
          <select v-model="selectedRoom" name="roomId" required>
            <option value="">선택하세요</option>
            <option
              v-for="classroom in classRoomList"
              :key="classroom.roomId"
              :value="classroom.roomId"
            >
              {{ classroom.roomName }}
            </option>
          </select>
        </label>

        <label>
          <span> 장비명<span class="required">*</span> </span>
          <input type="text" name="equipName" v-model="detail.equipName" required />
        </label>

        <label>
          <span> 수량<span class="required">*</span> </span>
          <input
            type="number"
            name="equipQuantity"
            min="0"
            v-model="detail.equipQuantity"
            required
          />
        </label>

        <label>
          <span> 구매일자<span class="required">*</span> </span>
          <input type="date" name="equipPurchaseDate" v-model="detail.equipPurchaseDate" required />
        </label>

        <label>
          <span> 장비분류<span class="required">*</span> </span>
          <select v-model="eqpGrp" name="equipGroup" required>
            <option value="">장비를 선택하세요</option>
            <option value="com">컴퓨터</option>
            <option value="ms">마우스</option>
            <option value="msp">마우스패드</option>
            <option value="kb">키보드</option>
            <option value="mt">모니터</option>
            <option value="dk">책상</option>
            <option value="chr">의자</option>
            <option value="wb">화이트보드</option>
            <option value="etc">기타</option>
          </select>
        </label>

        <label>
          <span>사용기한</span>
          <input type="date" name="equipPerioduseDate" v-model="detail.equipPerioduseDate" />
        </label>

        <label>
          <span>파일</span>
          <div>
            <input id="fileInput" type="file" name="fileInput" @change="handlerFile" />
            <label htmlFor="fileInput" className="img-label"> 파일 선택 </label>
          </div>
        </label>
        <input v-model="selectedRoom" type="hidden" name="Fileclassroom" />
        <div>
          <label className="mb-2 block font-semibold text-gray-800"> 미리보기 </label>
          <img
            v-if="imgObjectUrl || detail.logicalPath"
            class="preview-image"
            alt="미리보기"
            :src="imgObjectUrl || '/api' + detail.logicalPath"
          />
          <div v-else>미리보기 없음</div>
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

<style scoped>
@import './styled.css';
.required {
  color: red;
  margin-left: 4px;
}
.preview-image {
  @apply h-[100px] w-[100px] object-cover;
}
</style>
