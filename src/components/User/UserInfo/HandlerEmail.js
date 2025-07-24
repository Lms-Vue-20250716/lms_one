//이메일 정보 관련 처리
//제약사항 정규식

import axios from 'axios';

const positiveRegex =
  /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

export const isVaildEmail = (value) => {
  return positiveRegex.test(value);
};

/* 유의*/
// 일반 반환값과 Promise를 통한 반환 값이 존재함
// Promise를 통한 반환이 처리되기 전에 함수가 종료되서 아무것도 반환 안할 수도 있음
// async/await를 사용하여 axios에 await를 걸어 axios가 값을 반드시 반환하도록 보장함
export const checkDuplicationEmail = async (event) => {
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
  await axios
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
