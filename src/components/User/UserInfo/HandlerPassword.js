//비밀번호 관련 처리
//제약 사항 정규식
const negativeRegex = /^.*(?=.*\D)(?=.*^[a-zA-Z])(?=.*^[!@#$%^&*+=]).*$/;
// 숫자, 영문자, 특수문자만
const positiveRegex = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;

//입력 제한, 숫자, 영문자, 특수문자만
export const filterInputUserPassword = (event, v_model_value) => {
  const inputValue = event.target.value;

  const cleanedValue = inputValue.replace(negativeRegex, '');
  if (v_model_value.value !== cleanedValue) {
    v_model_value = cleanedValue;
  }

  return v_model_value;
};

//유효성 검사
export const isVaildPassword = (value) => {
  return positiveRegex.test(value);
};
