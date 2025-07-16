<script setup></script>
<template>
    	    <!-- 강의 통계 모달 -->
    <div id="lecStatisticsModal" class="layerPop layerType2" style="width: 1000px;"> 
	
		<dl>
			<dt>
				<strong>강의 통계</strong>
			</dt>
			
			<dd class="content">
				<!-- s : 여기에 내용입력 -->
				<table class="row">
					<caption>caption</caption>
				</table>
				
			
			
			<table class="col">
    			<caption>caption</caption>
			    <colgroup>
			        <col width="50px">
			        <col width="200px">
			        <col width="60px">
			        <col width="50px">
			        <col width="60px">
			        <col width="50px">
			    </colgroup>
			    <thead>
			        <tr>
			            <th scope="col">강의 번호</th>
			            <th scope="col">강의 이름</th>
			            <th scope="col">강사 이름</th>
			            <th scope="col">회차</th>
			            <th scope="col">개강일 </th>
			            <th scope="col">종강일 </th>
			            <th scope="col">정원</th>
			            <th scope="col">평균 점수</th>
			            <th scope="col">최고 점수</th>
			            <th scope="col">최저 점수</th>
			            <th scope="col">과락 인원</th>
			        </tr>
			    </thead>
			    <tbody id="statisticsPage"></tbody>
			</table>

		<div class="charts">
		    <canvas id="chartStudentPersonnel"></canvas>
		    <canvas id="chartFaildStudent"></canvas>
		</div>

			</dd>
		</dl>
		<a href="" class="closePop"><span class="hidden">닫기</span></a>
	</div>

</template>
<style scoped></style>