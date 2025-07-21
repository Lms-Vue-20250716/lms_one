<script setup>
import ContentBox from '@/components/common/ContentBox.vue';
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';

const modalState = useModalState();
const props = defineProps({
  lecId: {
    type: Number,
    default: 0,
    require: true,
  },
});

const companySelectBoxList = ref([]);
const companySelectList = ref([]);
const selectedCompany = ref('');
const studentLectureList = ref([]);
const studentId = ref(0);

const companySelectBox = () => {
  axios.post('/api/user/company-list').then((res) => {
    companySelectBoxList.value = res.data;
  });
};

const studentLectureDetail = () => {
  axios.post('/api/user/students-lecture/' + props.lecId).then((res) => {
    studentLectureList.value = res.data;
  });
};

const deleteSelectedCompany = (id) => {
  const index = companySelectList.value.findIndex((item) => item.companyId === id);
  companySelectList.value.splice(index, 1);
};

const modifyInputClick = (id) => {
  studentId.value = id;
  console.log('modifyInputClick', id);
  const modfiy = document.getElementById('modifyFile');
  modfiy.click();
};

const uploadInputClick = (id) => {
  studentId.value = id;
  console.log('uploadInputClick', id);
  const upload = document.getElementById('uploadFile');
  upload.click();
};

const modifyResume = (event) => {
  console.log(event.target.files);
  console.log('modifyResume', studentId.value);
  const file = event.target.files[0];
  console.log(file);
  if (file) {
    const formData = new FormData();
    formData.append('file', file);

    axios('/api/user/update-resume/' + studentId.value, formData)
      .then((res) => {
        console.log(res);
        alert('수정 성공');
      })
      .catch((res) => {
        console.log(res);
        alert('수정 실패');
      });
  }
};

const uploadResume = (event) => {
  console.log(event.target.files);
  console.log('uploadResume', studentId.value);
  const file = event.target.files[0];
  console.log(file);
  if (file) {
    const formData = new FormData();
    formData.append('file', file);

    axios('/api/user/create-resume/' + studentId.value, formData)
      .then((res) => {
        console.log(res);
        alert('등록 성공');
      })
      .catch((res) => {
        console.log(res);
        alert('등록 실패');
      });
  }
};

watch(
  () => selectedCompany.value,
  () => {
    if (!!selectedCompany.value && !companySelectList.value.includes(selectedCompany.value)) {
      companySelectList.value.push(selectedCompany.value);
    }
  },
);

onMounted(() => {
  companySelectBox();
  studentLectureDetail();
});
</script>
<template>
  <Teleport to="body">
    <div class="modal-overlay">
      <div class="modal-container">
        <ContentBox>이력서 관리</ContentBox>

        <div class="modal-form">
          <!-- 기업 선택 -->
          <br />
          <strong>이메일 전송할 기업 선택</strong><br />

          <select v-model="selectedCompany" name="company">
            <option value="" selected>전체</option>
            <option
              v-for="company in companySelectBoxList"
              :key="company.companyId"
              :value="company"
            >
              {{ company.companyName }}
            </option>
          </select>
          <!-- 회사 목록 -->

          <strong>선택된 기업 목록</strong><br />
          <table class="col">
            <thead>
              <tr>
                <th>기업명</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="companySelectList.length > 0">
                <tr v-for="company in companySelectList" :key="company.companyId">
                  <td>{{ company.companyName }}</td>
                  <td>
                    <button class="delete-button" @click="deleteSelectedCompany(company.companyId)">
                      삭제
                    </button>
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td colspan="2">선택한 회사가 없습니다.</td>
                </tr>
              </template>
            </tbody>
          </table>
          <!-- s : 여기에 내용입력 -->
          <strong>학생 목록</strong><br />
          <table class="row"></table>

          <table class="col">
            <thead>
              <tr>
                <th scope="col"><input type="checkbox" /></th>
                <th scope="col">이름</th>
                <th scope="col">학번</th>
                <th scope="col">전화번호</th>
                <th scope="col">이메일</th>
                <th scope="col">이력서</th>
                <th scope="col">이력서 관리</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="studentLectureList.length > 0">
                <tr v-for="studentInfo in studentLectureList" :key="studentInfo.studentId">
                  <td><input type="checkbox" /></td>
                  <td>{{ studentInfo.name }}</td>
                  <td>{{ studentInfo.studentsNumber }}</td>
                  <td>{{ studentInfo.hp }}</td>
                  <td>{{ studentInfo.email }}</td>
                  <td>{{ studentInfo.fileName ? studentInfo.fileName : '-' }}</td>
                  <td v-if="studentInfo.fileName">
                    <input
                      id="modifyFile"
                      name="modifyFile"
                      type="file"
                      @change="modifyResume($event)"
                    />
                    <button class="modify-button" @click="modifyInputClick(studentInfo.studentId)">
                      수정
                    </button>
                  </td>
                  <td v-else>
                    <input
                      id="uploadFile"
                      name="uploadFile"
                      type="file"
                      @change="uploadResume($event)"
                    />
                    <button class="upload-button" @click="uploadInputClick(studentInfo.studentId)">
                      업로드
                    </button>
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td colspan="7">학생 목록이 없습니다.</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <div class="button-container">
          <button>전송</button>
          <button @click="modalState.$patch({ isOpen: false, type: null })">취소</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<style scoped>
@import './styled.css';
</style>
