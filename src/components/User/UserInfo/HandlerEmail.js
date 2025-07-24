//이메일 정보 관련 처리
//제약사항 정규식

import axios from 'axios';

const positiveRegex =
  /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

export const isVaildEmail = (value) => {
  return positiveRegex.test(value);
};

export const checkDuplicationEmail = (event) => {
  const inputTag = event.target.previousElementSibling;
  if (inputTag.value === '') {
    alert('이메일을 입력해주세요.');
    inputTag.focus();
    return false;
  }

  if (!isVaildEmail(inputTag.value)) {
    alert('이메일 형식을 확인해주세요.');
    return false;
  }

  const param = new URLSearchParams();
  param.append('email', inputTag.value);
  axios
    .post('/api/user/checkEmail/', param)
    .then((res) => {
      if (res.data.toLowerCase() === 'false') {
        alert('중복된 이메일이 존재합니다.');
        return false;
      } else if (res.data.toLowerCase() == 'true') {
        alert('사용 가능한 이메일입니다.');
        return true;
      } else {
        alert('이메일 확인 중 오류가 발생했습니다.');
        return false;
      }
    })
    .catch(() => {
      alert('서버와의 연결 실패');
      return false;
    });
};
