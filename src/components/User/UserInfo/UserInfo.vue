<script setup></script>
<template>
  <Teleport to="body">
    <div>
      <form id="RegisterForm">
        <dl>
          <dt class="signtitle">
            <strong>회원가입</strong>
          </dt>
          <dd>
            <div></div>
            <!-- s : 여기에 내용입력 -->
            <table class="row">
              <tbody>
                <tr>
                  <th scope="row">회원 유형<span class="font_red">*</span></th>
                  <td colspan="3">
                    <select>
                      <option value="S" selected>학생</option>
                      <option value="T">강사</option>
                    </select>
                  </td>
                  <th scope="row">아이디<span class="font_red">*</span></th>
                  <td colspan="3">
                    <input
                      type="text"
                      name="loginId"
                      placeholder="숫자, 영문자 조합으로 6~20자리 "
                    />
                  </td>
                  <td colspan="1">
                    <input type="button" value="중복확인" />
                  </td>
                </tr>

                <tr>
                  <th scope="row">주소<span class="font_red">*</span></th>
                  <td colspan="3">
                    <select name="loc">
                      <option value="" selected="selected">도/광역시 선택</option>
                      <option value="서울특별시">서울특별시</option>
                      <option value="전라남도">전라남도</option>
                      <option value="경기도">경기도</option>
                      <option value="부산광역시">부산광역시</option>
                      <option value="대구광역시">대구광역시</option>
                      <option value="인천광역시">인천광역시</option>
                      <!-- 추가적인 도/광역시 추가 -->
                    </select>
                  </td>
                  <th scope="row">이름<span class="font_red">*</span></th>
                  <td colspan="3"><input name="name" /></td>
                </tr>

                <tr>
                  <input type="hidden" value="" />
                  <th scope="row">비밀번호 <span class="font_red">*</span></th>
                  <td colspan="3">
                    <input
                      type="password"
                      placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리 "
                      name="password"
                    />
                  </td>
                  <th scope="row">비밀번호 확인<span class="font_red">*</span></th>
                  <td colspan="4">
                    <input
                      type="password"
                      placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리 "
                      name="password1"
                    />
                  </td>
                </tr>

                <tr>
                  <th scope="row">전화번호<span class="font_red">*</span></th>
                  <td colspan="3"><input class="inputTxt p100" name="hp" /></td>
                  <th scope="row">성별<span class="font_red">*</span></th>
                  <td colspan="4">
                    <select name="sex">
                      <option value="" selected="">선택</option>
                      <option value="남성">남성</option>
                      <option value="여성">여성</option>
                    </select>
                  </td>
                </tr>

                <tr>
                  <th scope="row">생년월일 <span class="font_red">*</span></th>
                  <td colspan="3">
                    <input
                      type="date"
                      class="inputTxt p100"
                      name="birthday"
                      style="font-size: 15px"
                      max="<%= java.time.LocalDate.now() %>"
                    />
                  </td>

                  <th scope="row">이메일<span class="font_red">*</span></th>
                  <td colspan="3">
                    <input
                      type="text"
                      class="inputTxt p100"
                      name="email"
                      placeholder="happyjob@happyjop.com"
                    />
                  </td>
                  <td colspan="1">
                    <input
                      type="button"
                      value="중복확인"
                      onclick="emailCheck()"
                      style="width: 130px; height: 20px"
                    />
                  </td>
                </tr>

                <!-- 강사일 경우 추가 필드 -->
                <tr id="accountFields" style="display: none">
                  <th scope="row">계좌번호<span class="font_red">*</span></th>
                  <td colspan="3">
                    <input type="text" name="insAccount" placeholder="계좌번호" />
                  </td>
                  <th scope="row">은행명<span class="font_red">*</span></th>
                  <td colspan="4">
                    <select name="insBank">
                      <option value="" selected="">선택</option>
                      <option value="신한은행">신한은행</option>
                      <option value="우리은행">우리은행</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="btn_areaC mt30">
              <a href="javascript:CompleteRegister();" name="btn"> <span>회원가입</span></a>
              <a href="javascript:fcancleModal()" name="btn"><span>취소</span></a>
            </div>
          </dd>
        </dl>
      </form>
    </div>
  </Teleport>
</template>
<style scoped>
@import 'styled.css';
</style>
