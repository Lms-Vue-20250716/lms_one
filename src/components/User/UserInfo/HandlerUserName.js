//이름 관련 정보 처리
//제약 사항 정규식
//모든 숫자, filter에 사용
const negativeRegex = /\d/;

//한글과 영어, 2문자 이상
const positiveRegex = /^[가-힣a-zA-Z]{2,}$/;

export const filterInputUserName = (event, v_model_value) => {
  const inputValue = event.target.value;

  const cleanedValue = inputValue.replace(negativeRegex, '');
  if (v_model_value.value !== cleanedValue) {
    v_model_value = cleanedValue;
  }

  return v_model_value;
};

// 유효성 검사
// 한글과 영어 최소 2문자 이상
export const isVaildName = (value) => {
  return positiveRegex.test(value);
};
