<template>
  <div class="dashboard-container">
    <ul class="dashboard-ul">
      <li class="menu-bar"><LeftMenu /></li>
      <li class="content bg-gray-50">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </li>
    </ul>
  </div>
</template>

<script setup>
import LeftMenu from '../LeftMenu/LeftMenu.vue';

// keep-alive
// 1. 성능 최적화
// 컴포넌트의 상태를 메모리에 유지
// 컴포넌트 재렌더링 방지
// 불필요한 API 호출 감소

// 2. 사용자 경험 향상
// 페이지 전환 시 이전 상태 유지
// 양식 작성 중 페이지 이동 후 돌아와도 데이터 유지
// 스크롤 위치 보존
</script>

<style lang="css" scoped>
@import './styled.css';
</style>
