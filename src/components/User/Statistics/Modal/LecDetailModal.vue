<script setup></script>
<template>
    <!-- 강의 상세 모달 -->
    <div id="lecDetailModal" class="layerPop layerType2" style="width: 600px;"> 
		<dl>
			<dt>
				<strong>강의 상세</strong>
			</dt>
			<dd class="content">
				<!-- s : 여기에 내용입력 -->
				<table class="row">
					<caption>caption</caption>

					<tbody>
						<tr>
							<th scope="row">강의 이름 </th>
							<td colspan="3"><input type="text" class="inputTxt p100"
								name="lecName" id="lecName" /></td>
			
							<th scope="row">회차</th>
							<td colspan="3">
								<input type="text" class="inputTxt p100"
								name="lectureRound" id="lectureRound" /></td>
						
						</tr>
							<tr>
							<th scope="row">담당 강사</th>
							<td colspan="3"><input type="text" class="inputTxt p100"
								name="tutorName" id="tutorName" /></td>
			
							<th scope="row">정원 </th>
							<td colspan="3">
								<input type="text" class="inputTxt p100"
								name="lecPersonnel" id="lecPersonnel" /></td>
					
						</tr>
							<tr>
							<th scope="row">개강 일자 </th>
							<td colspan="3"><input type="text" class="inputTxt p100"
								name="lecStartDate" id="lecStartDate" /></td>
			
							<th scope="row">종강 일자 </th>
							<td colspan="3">
								<input type="text" class="inputTxt p100"
								name="lecEndDate" id="lecEndDate" /></td>
						</tr>

							<tr>
							<th scope="row">평균 점수 </th>
							<td colspan="3"><input type="text" class="inputTxt p100"
								name="avgScore" id="avgScore" /></td>
			
							<th scope="row">과락 인원 </th>
							<td colspan="3">
								<input type="text" class="inputTxt p100"
								name="failedStudents" id="failedStudents" /></td>
						</tr>
			
					</tbody>
				</table>

				<!-- e : 여기에 내용입력 -->

				<div class="btn_areaC mt30">
					<a href=""	class="btnType gray"  id="btnClose" name="btn"><span>취소</span></a>
				</div>
			</dd>

		</dl>
		<a href="" class="closePop"><span class="hidden">닫기</span></a>
	</div>
</template>
<style scoped></style>