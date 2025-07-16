<script setup>
import router from '@/router';
import axios from 'axios';
import { onMounted, ref } from 'vue';

const lecNameList = ref([]);

const lectureName = ref('');
const lectureStartRound = ref('');
const lectureEnsRound = ref('');

const get_LecNameSelectBox = () => {
  axios.post('/api/user/lecture-selectbox').then((res) => {
    lecNameList.value = res.data;
  });
};

const handlerStatisticsSearch = () => {
  const query = [];
  !lectureName.value || query.push(`lectureName=${lectureName.value}`);
  !lectureStartRound.value || query.push(`lectureStartAround=${lectureStartRound.value}`);
  !lectureEnsRound.value || query.push(`lectureEndAround=${lectureEnsRound.value}`);
  const queryString = query.length > 0 ? `?${query.join('&')}` : '';

  console.log('쿼리 : ', queryString);
  router.push(queryString);
};

onMounted(() => {
  get_LecNameSelectBox();
});
</script>
<template>
  <!--
  <p class="Location">
    <a href="#" class="btn_set home">메인으로</a>
    <a href="#" class="btn_nav bold">사용자 관리</a>
    <span class="btn_nav bold">통계</span>
    <a href="#" class="btn_set refresh" id="refreshBtn">새로고침</a>
  </p>
  -->
  <p class="conTitle" style="height: 110px">
    <span style="display: block">강의 통계</span>

    <!--  검색 -->
    <span class="fr" style="margin-top: 0px">
      <span>
        강의 이름
        <select id="lectureList" v-model="lectureName" name="lec">
          <!-- 아래 옵션의 value 속성을 ""로 맞추면 script의 !lectureName.value 구문에 의해 true로 인식되고(값이 없음) ||의 뒤의 명령문 실행 안함 -->
          <option value="" selected>전체</option>
          <option v-for="lecture in lecNameList" :key="lecture.lecId">
            {{ lecture.lecName }}
          </option>
        </select>
      </span>

      <span>
        <span style="margin: 0 8px">
          회차
          <select v-model="lectureStartRound" name="lectureStartRound">
            <option value="" selected>전체</option>
          </select>
          ~
          <select v-model="lectureEnsRound" name="lectureEnsRound">
            <option value="" selected>전체</option>
          </select>
        </span>
        <span>
          <button
            class="btnType"
            href=""
            name="searchbtn"
            id="searchBtn"
            @click="handlerStatisticsSearch"
          >
            검색
          </button>
          <a class="btnType" href="javascript:statistics();" name="modal"><span>통계</span></a>
        </span>
      </span>
    </span>
  </p>
</template>
<style scoped>
.btnType {
  /* 이 클래스 이름은 이 스타일을 적용할 HTML 요소에 부여되어야 합니다. */
  margin-top: 1rem; /* mt-4 */
  border-radius: 0.5rem; /* rounded-lg */
  background-color: #0c0a32; /* bg-blue-950 (Tailwind CSS 기본 색상 팔레트 기준) */
  padding-left: 1rem; /* px-4 */
  padding-right: 1rem; /* px-4 */
  padding-top: 0.5rem; /* py-2 */
  padding-bottom: 0.5rem; /* py-2 */
  color: #fff; /* text-white */
  transition-property: all; /* transition */
  transition-duration: 300ms; /* duration-300 */
  transition-timing-function: ease-in-out; /* ease-in-out */
}

.btnType:hover {
  background-color: #93c5fd; /* hover:bg-blue-300 (Tailwind CSS 기본 색상 팔레트 기준) */
}
</style>
