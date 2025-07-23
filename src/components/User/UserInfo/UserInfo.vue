<script setup>
import ContentBox from '@/components/common/ContentBox.vue';
import { useModalState } from '@/stores/modalState';
import { ref, watch } from 'vue';
import { filterInputUserId } from './HandlerUserInfo.js';
import { filterInputUserName } from './HandlerUserName.js';

//받아야 하는 값
const identityType = ref('S');
const identityValue = ref('');
const locationValue = ref('');
const userNameValue = ref('');
const passwordValue = ref('');
const passwordCheckerValue = ref('');
const phoneNumberValue = ref('');
const sexValue = ref('');
const birthdayValue = ref('');
const emailValue = ref('');
const accountValue = ref('');
const bankTypeValue = ref('');

const getTodayAsLocalDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const modalState = useModalState();

const submitUserInfo = () => {
  closeModal();
};
const closeModal = () => {
  modalState.$patch({ isOpen: false, type: null });
};

const tempPlaceholder = ref('');
const handlerPlaceholder = (event, isFocus) => {
  if (isFocus) {
    tempPlaceholder.value = event.target.placeholder;
    event.target.placeholder = '';
  } else {
    event.target.placeholder = tempPlaceholder.value;
  }
};

watch(
  () => identityValue.value,
  () => {
    console.log('identityValue : ' + identityValue.value);
  },
);

const formRef = ref();
</script>
<template>
  <Teleport to="body">
    <div class="modal-overlay">
      <form id="registerForm" ref="formRef" class="modal-container">
        <div class="modal-form">
          <ContentBox>회원가입</ContentBox>
          <!-- s : 여기에 내용입력 -->
          <table>
            <tbody>
              <tr>
                <th>회원 유형<span class="font_red">*</span></th>
                <td>
                  <select v-model="identityType">
                    <option value="S" selected>학생</option>
                    <option value="T">강사</option>
                  </select>
                </td>
                <th>아이디<span class="font_red">*</span></th>
                <td>
                  <input
                    v-model="identityValue"
                    type="text"
                    name="loginId"
                    placeholder="숫자, 영문자 조합으로 6~20자리"
                    title="숫자, 영문자 조합으로 6~20자리"
                    minlength="6"
                    maxlength="20"
                    @input="identityValue = filterInputUserId($event, identityValue)"
                    @focus="handlerPlaceholder($event, true)"
                    @focusout="handlerPlaceholder($event, false)"
                  />
                  <button>중복확인</button>
                </td>
              </tr>

              <tr>
                <th>주소<span class="font_red">*</span></th>
                <td>
                  <select v-model="locationValue" name="loc">
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
                <th>이름<span class="font_red">*</span></th>
                <td>
                  <input
                    v-model="userNameValue"
                    type="text"
                    name="username"
                    autocomplete="username"
                    minlength="2"
                    placeholder="이름은 한글 또는 영문 2자 이상이어야 합니다."
                    title="이름은 한글 또는 영문 2자 이상이어야 합니다."
                    @input="userNameValue = filterInputUserName($event, identityValue)"
                    @focus="handlerPlaceholder($event, true)"
                    @focusout="handlerPlaceholder($event, false)"
                  />
                </td>
              </tr>

              <tr>
                <th>비밀번호 <span class="font_red">*</span></th>
                <td>
                  <input
                    v-model="passwordValue"
                    type="password"
                    placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리"
                    name="password"
                    autocomplete="new-password"
                    title="숫자, 영문자, 특수문자 조합으로 8~15자리"
                    minlength="8"
                    maxlength="15"
                    @focus="handlerPlaceholder($event, true)"
                    @focusout="handlerPlaceholder($event, false)"
                  />
                </td>
                <th>비밀번호 확인<span class="font_red">*</span></th>
                <td>
                  <input
                    v-model="passwordCheckerValue"
                    type="password"
                    placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리"
                    name="password-check"
                    autocomplete="new-password"
                    title="숫자, 영문자, 특수문자 조합으로 8~15자리"
                    minlength="8"
                    maxlength="15"
                    @focus="handlerPlaceholder($event, true)"
                    @focusout="handlerPlaceholder($event, false)"
                  />
                </td>
              </tr>

              <tr>
                <th>전화번호<span class="font_red">*</span></th>
                <td><input v-bind="phoneNumberValue" type="text" name="hp" /></td>
                <th>성별<span class="font_red">*</span></th>
                <td>
                  <select v-bind="sexValue" name="sex">
                    <option value="" selected="">선택</option>
                    <option value="남성">남성</option>
                    <option value="여성">여성</option>
                  </select>
                </td>
              </tr>

              <tr>
                <th>생년월일 <span class="font_red">*</span></th>
                <td>
                  <input
                    v-bind="birthdayValue"
                    type="date"
                    name="birthday"
                    style="font-size: 15px"
                    :max="getTodayAsLocalDate"
                  />
                </td>

                <th>이메일<span class="font_red">*</span></th>
                <td>
                  <input
                    v-bind="emailValue"
                    type="text"
                    name="email"
                    placeholder="happyjob@happyjop.com"
                    title="happyjob@happyjop.com"
                    @focus="handlerPlaceholder($event, true)"
                    @focusout="handlerPlaceholder($event, false)"
                  />
                  <button @click="emailCheck">중복확인</button>
                </td>
              </tr>

              <!-- 강사일 경우 추가 필드 -->
              <tr v-if="identityType === 'T'" id="accountFields">
                <th>계좌번호<span class="font_red">*</span></th>
                <td>
                  <input
                    v-model="accountValue"
                    type="text"
                    name="insAccount"
                    placeholder="계좌번호"
                    @focus="handlerPlaceholder($event, true)"
                    @focusout="handlerPlaceholder($event, false)"
                  />
                </td>
                <th>은행명<span class="font_red">*</span></th>
                <td>
                  <select v-bind="bankTypeValue" name="insBank">
                    <option value="" selected="">선택</option>
                    <option value="신한은행">신한은행</option>
                    <option value="우리은행">우리은행</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="button-container">
            <button @submit.prevent="submitUserInfo">회원가입</button>
            <button @click.prevent="closeModal">취소</button>
          </div>
        </div>
      </form>
    </div>
  </Teleport>
</template>
<style scoped>
@import './styled.css';
</style>
