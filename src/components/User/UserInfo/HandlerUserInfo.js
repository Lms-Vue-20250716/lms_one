//아이디 관련 정보 처리
//제약사항 정규식

import axios from 'axios';

//숫자, 영문자가 아닌 모든 문자, filter에 사용
const negativeRegex = /[^a-z0-9]/;
//"숫자, 영문자 조합으로 6~20자리"
const positiveRegex = /^[a-z0-9]{6,20}$/;

//입력시 허가된 정규식에 해당하는 문자만 입력 가능
export const filterInputUserId = (event, v_model_value) => {
  const inputValue = event.target.value;

  const cleanedValue = inputValue.replace(negativeRegex, '');
  if (v_model_value !== cleanedValue) {
    v_model_value = cleanedValue;
  }

  return v_model_value;
};

// 아이디 입력 값의 유효성 검사
// "숫자, 영문자 조합으로 6~20자리"
export const isVaildUserInfo = (value) => {
  const reuslt = positiveRegex.test(value);
  return reuslt;
};

// 중복 확인 버튼을 눌렀을 때, 처리작업
export const checkDuplicationId = (event) => {
  const inputTag = event.target.previousElementSibling;
  if (inputTag.value === '') {
    alert('아이디를 입력해주세요.');
    inputTag.focus();
    return false;
  }

  if (!isVaildUserInfo(inputTag.value)) {
    alert('아이디는 숫자,영문자 조합으로 6~20자리를 사용해야 합니다.');
    return false;
  }

  axios
    .get('/api/user/checkId/' + inputTag.value)
    .then((res) => {
      if (res.data.toLowerCase() === 'false') {
        alert('중복된 아이디가 존재합니다');
        return false;
      } else if (res.data.toLowerCase() == 'true') {
        alert('사용할 수 있는 아이디입니다.');
        return true;
      } else {
        alert('아이디 확인 중 오류가 발생했습니다.');
        return false;
      }
    })
    .catch(() => {
      alert('서버와의 연결 실패');
      return false;
    });
};
