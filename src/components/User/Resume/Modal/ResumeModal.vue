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
const checkboxCheckedList = ref([]);
const formRef = ref();

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
  const modfiy = document.getElementById('modifyFile');
  modfiy.click();
};

const uploadInputClick = (id) => {
  studentId.value = id;
  const upload = document.getElementById('uploadFile');
  upload.click();
};

const modifyResume = () => {
  console.log(formRef, formRef.value);
  const formData = new FormData(formRef.value);

  axios
    .post('/api/user/update-resume/' + studentId.value, formData)
    .then((res) => {
      if (res.data.toLowerCase() === 'success') {
        alert('수정 완료');
        studentLectureDetail();
      }
    })
    .catch((res) => {
      if (res.data.toLowerCase() === 'fail') {
        alert('수정 실패');
      }
    });
};

const uploadResume = () => {
  console.log(formRef, formRef.value);
  const formData = new FormData(formRef.value);

  axios
    .post('/api/user/create-resume/' + studentId.value, formData)
    .then((res) => {
      if (res.data.toLowerCase() === 'success') {
        alert('등록 성공');
        studentLectureDetail();
      }
    })
    .catch((res) => {
      if (res.data.toLowerCase() === 'success') {
        alert('등록 실패');
      }
    });
};

const downloadFile = (fileName = null, id = 0) => {
  if (!fileName) {
    return;
  }
  const param = new URLSearchParams();

  axios
    .post('/api/user/download-resume/' + id, param, { responseType: 'blob' })
    .then((res) => {
      const url = URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    })
    .catch((error) => {
      if (error.response.status >= 500 && error.response.status < 600) {
        alert('서버 오류, 관리자에게 문의하세요.');
      } else if (error.response.status === 404) {
        alert('요청한 페이지가 없습니다.');
      } else if (error.response.status >= 400 && error.response.status < 500) {
        alert('클라이언트측의 올바르지 않은 요청입니다.');
      }
    });
};

const hoverEvent = (fileName) => {
  if (fileName) {
    return 'text-hover-decoration';
  } else {
    return null;
  }
};

const checkedFigureList = (event) => {
  const elements = document.getElementsByClassName('checkbox-target');
  if (event.target.value.toLowerCase() === 'all') {
    if (event.target.checked) {
      for (let index = 0; index < elements.length; index++) {
        elements[index].checked = !elements[index].checked;
        if (elements[index].checked) {
          checkboxCheckedList.value.push(elements[index].value);
        }
      }
    } else {
      for (let index = 0; index < elements.length; index++) {
        elements[index].checked = false;
        checkboxCheckedList.value.pop();
      }
    }
  } else {
    const checkbox_all = document.getElementsByClassName('checkbox-source');
    if (!checkboxCheckedList.value.includes(event.target.value)) {
      checkboxCheckedList.value.push(event.target.value);
      if (checkboxCheckedList.value.length === elements.length) {
        checkbox_all[0].checked = true;
      }
    } else {
      const index = checkboxCheckedList.value.indexOf(event.target.value);
      if (index > -1) {
        checkboxCheckedList.value.splice(index, 1);
      }
      checkbox_all[0].checked = false;
    }
  }
};

const sendEmail = () => {
  if (companySelectList.value.length === 0) {
    alert('기업을 선택해주세요.');

    return;
  }

  if (checkboxCheckedList.value.length === 0) {
    alert('학생을 선택해주세요.');
    return;
  }

  const companyIdArr = [];
  for (let index = 0; index < companySelectList.value.length; index++) {
    companyIdArr.push(companySelectList.value[index].companyId);
  }

  const param = {
    companyIds: companyIdArr,
    studentIds: checkboxCheckedList.value,
  };

  axios
    .post('/api/user/send-resume/', param)
    .then((res) => {
      if (res.data.toLowerCase() === 'success') {
        alert('이메일 전송 완료');
        companySelectList.value = [];
        checkboxCheckedList.value = [];
        const checkbox_all = document.getElementsByClassName('checkbox-source');
        const elements = document.getElementsByClassName('checkbox-target');
        checkbox_all[0].checked = false;
        for (let index = 0; index < elements.length; index++) {
          elements[index].checked = false;
        }
        companySelectBox();
        studentLectureDetail();
      }
    })
    .catch((error) => {
      let text = '이메일 전송 실패\n';
      if (error.response.status >= 500 && error.response.status < 600) {
        text += '서버 오류, 관리자에게 문의하세요.';
      } else if (error.response.status === 404) {
        text += '요청한 페이지가 없습니다.';
      } else if (error.response.status >= 400 && error.response.status < 500) {
        text += '클라이언트측의 올바르지 않은 요청입니다.';
      }
      alert(text);
    });
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
          <select
            v-model="selectedCompany"
            name="company"
            style="max-width: 250px"
            @click.prevent="null"
          >
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

          <form ref="formRef">
            <br /><strong style>선택된 기업 목록</strong><br />
            <table class="col">
              <thead>
                <tr>
                  <th>기업명</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="companySelectList.length > 0">
                  <tr
                    v-for="registeredCompany in companySelectList"
                    :key="registeredCompany.companyId"
                  >
                    <td>{{ registeredCompany.companyName }}</td>
                    <td>
                      <button
                        class="delete-button"
                        @click.prevent="deleteSelectedCompany(registeredCompany.companyId)"
                      >
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
                  <th scope="col">
                    <input
                      type="checkbox"
                      class="checkbox-source"
                      value="all"
                      @change="checkedFigureList($event)"
                    />
                  </th>
                  <th scope="col">이름</th>
                  <th scope="col">학번</th>
                  <th scope="col">전화번호</th>
                  <th scope="col">이메일</th>
                  <th scope="col">이력서</th>
                  <th scope="col">이력서 관리</th>
                </tr>
              </thead>
              <tbody ref="formRef">
                <template v-if="studentLectureList.length > 0">
                  <tr v-for="studentInfo in studentLectureList" :key="studentInfo.studentId">
                    <td>
                      <input
                        type="checkbox"
                        class="checkbox-target"
                        :value="studentInfo.studentId"
                        @change="checkedFigureList($event)"
                      />
                    </td>
                    <td>{{ studentInfo.name }}</td>
                    <td>{{ studentInfo.studentsNumber }}</td>
                    <td>{{ studentInfo.hp }}</td>
                    <td>{{ studentInfo.email }}</td>
                    <td
                      :class="hoverEvent(studentInfo.fileName)"
                      @click.prevent="downloadFile(studentInfo.fileName, studentInfo.studentId)"
                    >
                      {{ studentInfo.fileName ? studentInfo.fileName : '-' }}
                    </td>
                    <td v-if="studentInfo.fileName">
                      <input id="modifyFile" name="modifyFile" type="file" @change="modifyResume" />
                      <button
                        class="modify-button"
                        @click.prevent="modifyInputClick(studentInfo.studentId)"
                      >
                        수정
                      </button>
                    </td>
                    <td v-else>
                      <input id="uploadFile" name="uploadFile" type="file" @change="uploadResume" />
                      <button
                        class="upload-button"
                        @click.prevent="uploadInputClick(studentInfo.studentId)"
                      >
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
          </form>
          <div class="button-container">
            <button @click="sendEmail">전송</button>
            <button @click="modalState.$patch({ isOpen: false, type: null })">취소</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<style scoped>
@import './styled.css';
</style>
