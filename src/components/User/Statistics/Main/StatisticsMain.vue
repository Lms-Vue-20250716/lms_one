<script setup>
import PageNavigation from '@/components/common/PageNavigation.vue';
import axios from 'axios';
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const statisticsLectureList = ref([]);
const statisticsLectureCnt = ref(0);

const statisticsListSearch = (cPage = 1) => {
  /*
    lectureName
    lectureStartAround
    lectureEndAround
    위 값을 route를 통해 받음
  */
  const param = new URLSearchParams(route.query);
  param.append('currentPage', cPage);
  param.append('pageSize', 5);

  // 해당 컨트롤러가 반환하는 데이터가 statistics와 같고 json 사용으로 편하게 하기 위해 해당 controller에 요청
  axios.post('/api/user/resumeLectureListBody.do', param).then((res) => {
    statisticsLectureList.value = res.data.resumeLectureList;
    statisticsLectureCnt.value = res.data.resumeLectureCnt;
  });
};

onMounted(() => {
  statisticsListSearch();
});

//StatisticsSearch에서 받아옴
watch(
  () => route.query,
  () => {
    statisticsListSearch();
  },
);
</script>
<template>
  <div id="wrap_area">
    <div id="container">
      <ul>
        <li class="contents">
          <div class="content">
            <!-- 검색 -->
            <!--리스트-->
            <div class="divStaticList">
              <table class="col">
                <colgroup>
                  <col width="50px" />
                  <col width="200px" />
                  <col width="60px" />
                  <col width="50px" />
                  <col width="60px" />
                  <col width="50px" />
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col">강의 번호</th>
                    <th scope="col">강의 이름</th>
                    <th scope="col">회차</th>
                    <th scope="col">개강일</th>
                    <th scope="col">종강일</th>
                    <th scope="col">정원</th>
                  </tr>
                </thead>
                <tbody id="statisticsList">
                  <tr v-for="statistics in statisticsLectureList" :key="statistics.lecId">
                    <td>{{ statistics.lecId }}</td>
                    <td>{{ statistics.lecName }}</td>
                    <td>{{ statistics.lectureRound }}</td>
                    <td>{{ statistics.lecStartDate }}</td>
                    <td>{{ statistics.lecEndDate }}</td>
                    <td>{{ statistics.lecPersonnel }}</td>
                  </tr>
                </tbody>
              </table>

              <!-- 페이징 처리 -->
              <PageNavigation
                :total-items="statisticsLectureCnt"
                :items-per-page="5"
                :on-page-change="statisticsListSearch"
              />
            </div>
          </div>
          <!--// content -->
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped></style>
