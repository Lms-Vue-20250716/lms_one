<script setup>
import ContentBox from '@/components/common/ContentBox.vue';
import { useModalState } from '@/stores/modalState';
import axios from 'axios';
import { ref } from 'vue';

const positiveRegex =
  /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
const passwordRules = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;

const modalState = useModalState();
const flagSwitch = ref(true);
const flagAuth = ref(false);
const flagNewPw = ref(false);
const email = ref('');
const authReceivedValue = ref('');
const authInputValue = ref();
const newPassword = ref('');
const checkPassword = ref('');

const isVaildEmail = (value) => {
  return positiveRegex.test(value);
};

const closeModal = (isMessage) => {
  modalState.$patch({ isOpen: false, type: null });
  isMessage && alert('취소되었습니다.');
};

//아이디 찾기
const selectFindInfoId = async () => {
  if (email.value === '') {
    alert('이메일 번호를 입력하세요.');
    document.getElementById('find-id-input').focus();
    return;
  } else if (!isVaildEmail(email.value)) {
    alert('잘못된 형식의 이메일 번호입니다.');
    document.getElementById('find-id-input').focus();
    return;
  }

  const param = new URLSearchParams();
  param.append('email', email.value);
  await axios
    .post('/api/selectFindInfoId.do', param)
    .then((res) => {
      if (res.data.result.toLowerCase() === 'fail') {
        alert('존재하지 않는 이메일 입니다.');
      } else if (res.data.result.toLowerCase() === 'success') {
        alert('찾으시고자 하는 아이디는 ' + res.data.loginId + ' 입니다.');
      }
    })
    .catch(() => {
      alert('서버 오류입니다. 관리자에게 문의하세요.');
    })
    .finally(() => {
      document.getElementById('find-id-input').value = '';
      email.value = '';
    });
};

//비밀번호 찾기
const selectFindInfoPW = async () => {
  if (email.value === '') {
    alert('이메일 번호를 입력하세요.');
    document.getElementById('find-pw-input').focus();
    return;
  } else if (!isVaildEmail(email.value)) {
    alert('잘못된 형식의 이메일 번호입니다.');
    document.getElementById('find-pw-input').focus();
    return;
  }

  const param = new URLSearchParams();
  param.append('email', email.value);
  await axios
    .post('/api/selectFindInfoPw.do', param)
    .then((res) => {
      const result = res.data.result;
      if (result.toLowerCase() === '') {
        alert('가입하신 이메일을 입력해주세요.');
      } else if (result.toLowerCase() === 'false') {
        alert('이메일 주소를 확인해주세요.');
      } else if (result.toLowerCase() === 'success') {
        alert('해당 이메일로 인증번호를 전송하였습니다.');
        flagAuth.value = true;
      }
    })
    .catch(() => {
      alert('서버 오류입니다. 관리자에게 문의하세요.');
    });

  // 인증 번호 발급
  // 소스 컨버팅 하면서 as-is 소스 확인 결과 인증번호를 따로 서버로 보내는 로직이 없고
  // 숨겨둔 input에다가 값을 넣어두고 그것에 대조하는 식으로 되어 있으므로
  // 전역 변수 하나 선언 후 그것과 유저 input 값 비교 방식으로 구현.
  await axios
    .post('/api/sendmail.do', param)
    .then((res) => {
      authReceivedValue.value = res.data.authNumId;
    })
    .catch(() => {
      alert('서버 오류입니다. 관리자에게 문의하세요.');
    });
};

const authCompare = () => {
  if (authInputValue.value.length < 1) {
    alert('인증번호를 입력해주세요.');
  } else if (authReceivedValue.value !== authInputValue.value) {
    alert('인증번호가 틀렸습니다.');
  } else if (authReceivedValue.value == authInputValue.value) {
    alert('인증번호가 맞습니다.');
    authReceivedValue.value = '';
    flagNewPw.value = true;
  }
};

const changePwdGo = async () => {
  if (newPassword.value === '') {
    alert('비밀번호를 입력하세요.');
    document.getElementById('new-password').focus();
    return;
  }

  if (checkPassword.value === '') {
    alert('비밀번호 확인을 입력하세요.');
    document.getElementById('check-password').focus();
    return;
  }

  if (!passwordRules.test(newPassword.value)) {
    alert('비밀 번호는 숫자,영문자,특수문자 조합으로 8~15자리를 사용해야 합니다.');
    document.getElementById('new-password').focus();
    return;
  }

  if (newPassword.value !== checkPassword.value) {
    alert('비밀번호가 맞지 않습니다.');
    document.getElementById('check-password').focus();
    return;
  }

  const param = new URLSearchParams();
  param.append('chPassword', newPassword.value);
  param.append('email', email.value);
  await axios
    .post('/api/changePwd.do', param)
    .then((res) => {
      console.log('res ', res);
      alert('비밀번호 변경 완료');
      closeModal(false);
    })
    .catch(() => {
      alert('비밀번호 변경 실패');
    });
};
</script>
<template>
  <Teleport to="body">
    <div class="modal-overlay">
      <div v-if="!flagNewPw" class="modal-container">
        <ContentBox>아이디/비밀번호 찾기</ContentBox>
        <div class="modal-form">
          <div class="button-container head">
            <button @click="flagSwitch = true">아이디 찾기</button>
            <button @click="flagSwitch = false">비밀번호 찾기</button>
          </div>
          <fieldset v-if="flagSwitch" class="default-fieldset">
            <legend class="legend"><label>아이디 찾기</label></legend>
            <input
              id="find-id-input"
              v-model="email"
              type="text"
              placeholder="가입하신 이메일을 입력하세요"
            />
            <button @click="selectFindInfoId">아이디 찾기</button>
          </fieldset>
          <fieldset v-else class="default-fieldset">
            <legend class="legend"><label>비밀번호 찾기</label></legend>
            <ul>
              <li>
                <input
                  id="find-pw-input"
                  v-model="email"
                  type="text"
                  placeholder="가입하신 이메일을 입력하세요"
                />
                <button @click="selectFindInfoPW">이메일 전송</button>
              </li>
              <li v-if="flagAuth">
                <input
                  id="find-id-auth"
                  v-model="authInputValue"
                  type="text"
                  placeholder="전송된 인증번호를 입력하세요"
                />
                <button @click="authCompare">인증하기</button>
              </li>
            </ul>
          </fieldset>

          <div class="button-container tail">
            <button @click.prevent="closeModal(false)">닫기</button>
          </div>
        </div>
      </div>
      <div v-else class="modal-container">
        <ContentBox>비밀번호 변경</ContentBox>
        <div class="modal-form">
          <table>
            <tbody>
              <tr>
                <th>새 비밀번호</th>
                <td>
                  <input
                    id="new-password"
                    v-model="newPassword"
                    type="password"
                    placeholder="새 비밀번호를 입력하세요"
                  />
                </td>
              </tr>
              <tr>
                <th>비밀번호 확인</th>
                <td>
                  <input
                    id="check-password"
                    v-model="checkPassword"
                    type="password"
                    placeholder="다시 한번 입력해 주세요"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div class="button-container tail">
            <button @click="changePwdGo">비밀번호 변경</button>
            <button @click="closeModal(true)">취소</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<style scoped>
@import './styled.css';
</style>
