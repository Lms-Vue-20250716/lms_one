//아이디 관련 정보 처리
//제약사항 정규식
//숫자, 영문자가 아닌 모든 문자, filter에 사용
const negativeRegex = /[^a-z0-9]/g;
//"숫자, 영문자 조합으로 6~20자리"
const positiveRegex = /^[a-z0-9]{6,20}$/g;

//입력시 허가된 정규식에 해당하는 문자만 입력 가능
export const filterInputUserId = (event, v_model_value) => {
  const inputValue = event.target.value;

  const cleanedValue = inputValue.replace(negativeRegex, '');
  if (v_model_value.value !== cleanedValue) {
    v_model_value = cleanedValue;
  }

  return v_model_value;
};

// 아이디 입력 값의 유효성 검사
// "숫자, 영문자 조합으로 6~20자리"
export const isVaildUserInfo = (value) => {
  return positiveRegex.text(value);
};

// 중복 확인 버튼을 눌렀을 때, 처리작업
export const checkDuplicationId = (value) => {
  //axios로 차후 작성
  alert('아이디는 숫자,영문자 조합으로 6~20자리를 사용해야 합니다.');
};
