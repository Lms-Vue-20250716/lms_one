<script setup>
import ContentBox from '@/components/common/ContentBox.vue';
import { useModalState } from '@/stores/modalState';
import { ref } from 'vue';
import { filterInputUserId, isVaildUserInfo, checkDuplicationId } from './HandlerUserInfo.js';
import { filterInputUserName, isVaildName } from './HandlerUserName.js';
import { filterInputUserPassword, isVaildPassword } from './HandlerPassword.js';
import {
  filterInputPhoneNumber,
  isVaildPhoneNumber,
  formattedPhoneNumber,
} from './HandlerPhoneNumber.js';
import { filterInputBankNumber } from './HandlerBankInfo.js';
import { checkDuplicationEmail } from './HandlerEmail.js';
import axios from 'axios';

//받아야 하는 값
const identityType = ref('S');
const identityValue = ref('');
const duplicationIdCheck = ref(false);
const locationValue = ref('');
const genderValue = ref('');
const userNameValue = ref('');
const passwordValue = ref('');
const passwordCheckerValue = ref('');
const phoneNumberValue = ref('');
const birthdayValue = ref('');
const emailValue = ref('');
const duplicationEmailCheck = ref(false);
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

const tempPlaceholder = ref('');
const handlerPlaceholder = (event, isFocus) => {
  if (isFocus) {
    tempPlaceholder.value = event.target.placeholder;
    event.target.placeholder = '';
  } else {
    event.target.placeholder = tempPlaceholder.value;
  }
};

//유효성 검사 체크리스트
const vaildFormData = () => {
  /* 아이디 기입 확인*/
  if (!isVaildUserInfo(identityValue.value)) {
    alert('아이디를 입력해주세요. 숫자,영문자 조합으로 6~20자리를 사용해야 합니다.');
    document.getElementById('loginId').focus();
    return false;
  }

  /* 아이디 중복 확인 */
  console.log('duplicationIdCheck', duplicationIdCheck.value);
  if (!duplicationIdCheck.value) {
    alert('아이디 중복확인을 진행해주세요.');
    document.getElementById('loginId').focus();
    return false;
  }

  //주소
  if (!locationValue.value) {
    alert('주소를 선택해주세요.');
    document.getElementById('loc').focus();
    return false;
  }

  //이름
  if (!isVaildName(userNameValue.value)) {
    alert('이름은 한글 또는 영문 2자 이상이어야 합니다.');
    document.getElementById('username').focus();
    return false;
  }

  /* 비밀번호 유효성 검사 */
  if (!isVaildPassword(passwordValue.value)) {
    alert('비밀 번호는 숫자,영문자,특수문자 조합으로 8~15자리를 사용해야 합니다.');
    document.getElementById('password').focus();
    return false;
  }

  /* 비밀번호 확인 */
  if (passwordValue.value !== passwordCheckerValue.value) {
    alert('비밀번호가 맞지 않습니다.');
    document.getElementById('password-check').focus();
    return false;
  }

  /* 전화번호 확인 */
  if (!isVaildPhoneNumber(phoneNumberValue.value)) {
    alert('전화번호 형식이 아닙니다.');
    document.getElementById('hp').focus();
    return false;
  }

  //성별
  if (!genderValue.value) {
    alert('성별을 선택해주세요.');
    document.getElementById('gender').focus();
    return false;
  }
  //생년월일
  if (!birthdayValue.value) {
    alert('생년월일을 입력해주세요.');
    document.getElementById('birthday').focus();
    return false;
  }

  /* 이메일 중복 확인 */
  console.log('duplicationEmailCheck', duplicationEmailCheck.value);
  if (!duplicationEmailCheck.value) {
    alert('이메일 중복확인을 해주세요');
    document.getElementById('email').focus();
    return false;
  }

  //강사에 해당할 시, 추가 인증
  if (identityType.value === 'T') {
    if (!accountValue.value) {
      alert('계좌번호를 입력해주세요.');
      document.getElementById('insAccount').focus();
      return false;
    }
    if (!bankTypeValue.value) {
      alert('은행명을 선택해주세요.');
      document.getElementById('insBank').focus();
      return false;
    }
  }

  return true;
};

const formRef = ref();

const submitUserInfo = () => {
  if (!vaildFormData()) {
    return;
  }

  const param = new URLSearchParams();
  param.append('userType', identityType.value);
  param.append('loginId', identityValue.value);
  //param.append('ckIdcheckreg', duplicationIdCheck.value);
  param.append('loc', locationValue.value);
  param.append('sex', genderValue.value);
  param.append('name', userNameValue.value);
  param.append('password', passwordValue.value);
  param.append('password1', passwordCheckerValue.value);
  param.append('hp', phoneNumberValue.value);
  param.append('birthday', birthdayValue.value);
  param.append('email', emailValue.value);
  //param.append('ckEmailcheckreg', duplicationEmailCheck.value);
  param.append('insAccount', accountValue.value);
  param.append('insBank', bankTypeValue.value);

  axios
    .post('/api/user/register', param)
    .then((res) => {
      if (res.data.toLowerCase() === 'success') {
        alert('회원가입이 완료되었습니다.');
        window.location.href = '/';
      } else {
        alert('회원가입 중 오류가 발생했습니다.');
      }
    })
    .catch(() => {
      alert('서버 오류');
    });

  closeModal();
};
const closeModal = () => {
  modalState.$patch({ isOpen: false, type: null });
};
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
                  <select v-model="identityType" required>
                    <option value="S" selected>학생</option>
                    <option value="T">강사</option>
                  </select>
                </td>
                <th>아이디<span class="font_red">*</span></th>
                <td>
                  <input
                    id="loginId"
                    v-model="identityValue"
                    type="text"
                    placeholder="숫자, 영문자 조합으로 6~20자리"
                    title="숫자, 영문자 조합으로 6~20자리"
                    minlength="6"
                    maxlength="20"
                    required
                    @input="identityValue = filterInputUserId($event, identityValue)"
                    @focus="handlerPlaceholder($event, true)"
                    @focusout="handlerPlaceholder($event, false)"
                  />
                  <button @click.prevent.self="duplicationIdCheck = checkDuplicationId($event)">
                    중복확인
                  </button>
                </td>
              </tr>

              <tr>
                <th>주소<span class="font_red">*</span></th>
                <td>
                  <select id="loc" v-model="locationValue" required>
                    <option value="" selected>도/광역시 선택</option>
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
                    id="username"
                    v-model="userNameValue"
                    type="text"
                    autocomplete="username"
                    minlength="2"
                    placeholder="이름은 한글 또는 영문 2자 이상이어야 합니다."
                    title="이름은 한글 또는 영문 2자 이상이어야 합니다."
                    required
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
                    id="password"
                    v-model="passwordValue"
                    type="password"
                    placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리"
                    autocomplete="new-password"
                    title="숫자, 영문자, 특수문자 조합으로 8~15자리"
                    minlength="8"
                    maxlength="15"
                    required
                    @input="passwordValue = filterInputUserPassword($event, passwordValue)"
                    @focus="handlerPlaceholder($event, true)"
                    @focusout="handlerPlaceholder($event, false)"
                  />
                </td>
                <th>비밀번호 확인<span class="font_red">*</span></th>
                <td>
                  <input
                    id="password-check"
                    v-model="passwordCheckerValue"
                    type="password"
                    placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리"
                    autocomplete="new-password"
                    title="숫자, 영문자, 특수문자 조합으로 8~15자리"
                    minlength="8"
                    maxlength="15"
                    required
                    @input="
                      passwordCheckerValue = filterInputUserPassword($event, passwordCheckerValue)
                    "
                    @focus="handlerPlaceholder($event, true)"
                    @focusout="handlerPlaceholder($event, false)"
                  />
                </td>
              </tr>

              <tr>
                <th>전화번호<span class="font_red">*</span></th>
                <td>
                  <input
                    id="hp"
                    v-model="phoneNumberValue"
                    type="text"
                    placeholder="대한민국 전화번호 형식만 허용(국제번호 제외, 하이픈 없이)"
                    maxlength="11"
                    required
                    @input="phoneNumberValue = filterInputPhoneNumber($event, phoneNumberValue)"
                    @focus="handlerPlaceholder($event, true)"
                    @focusout="
                      (handlerPlaceholder($event, false),
                      (phoneNumberValue = formattedPhoneNumber(phoneNumberValue)))
                    "
                  />
                </td>
                <th>성별<span class="font_red">*</span></th>
                <td>
                  <select id="gender" v-model="genderValue" required>
                    <option value="" selected>선택</option>
                    <option value="남성">남성</option>
                    <option value="여성">여성</option>
                  </select>
                </td>
              </tr>

              <tr>
                <th>생년월일 <span class="font_red">*</span></th>
                <td>
                  <input
                    id="birthday"
                    v-model="birthdayValue"
                    type="date"
                    style="font-size: 15px"
                    :max="getTodayAsLocalDate"
                    required
                  />
                </td>

                <th>이메일<span class="font_red">*</span></th>
                <td>
                  <input
                    id="email"
                    v-model="emailValue"
                    type="text"
                    placeholder="happyjob@happyjop.com"
                    title="happyjob@happyjop.com"
                    required
                    @focus="handlerPlaceholder($event, true)"
                    @focusout="handlerPlaceholder($event, false)"
                  />
                  <button
                    @click.prevent.self="duplicationEmailCheck = checkDuplicationEmail($event)"
                  >
                    중복확인
                  </button>
                </td>
              </tr>

              <!-- 강사일 경우 추가 필드 -->
              <tr v-if="identityType === 'T'" id="accountFields">
                <th>계좌번호<span class="font_red">*</span></th>
                <td>
                  <input
                    id="insAccount"
                    v-model="accountValue"
                    type="text"
                    placeholder="계좌번호, 하이픈(-)을 뺀 숫자만"
                    required
                    maxlength="20"
                    @input="accountValue = filterInputBankNumber($event)"
                    @focus="handlerPlaceholder($event, true)"
                    @focusout="handlerPlaceholder($event, false)"
                  />
                </td>
                <th>은행명<span class="font_red">*</span></th>
                <td>
                  <select id="insBank" v-model="bankTypeValue" required>
                    <option value="" selected="">선택</option>
                    <option value="신한은행">신한은행</option>
                    <option value="우리은행">우리은행</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="button-container">
            <button @click.prevent="submitUserInfo">회원가입</button>
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
