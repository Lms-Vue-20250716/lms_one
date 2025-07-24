//전화번호 정보 관련 처리
//제약사항 정규식
//숫자를 제외한 모든 문자
const negativeRegex = /\D/g;
//지역번호 및 휴대폰 번호 정규식 (대한민국 기준)
const positiveRegex = /^(01[0-9])-?\d{4}-?\d{4}$|^0(?:2|[3-6]\d)-?\d{3,4}-?\d{4}$/;

// 문자열이 <input /> 태그를 통해 들어오므로 커서의 위치에 따라 가변적임 그러므로 원하지 않은 입력이 들어올 수 있음
// 1. filterInputPhoneNumber 을 통해서 숫자만 입력받게 만들고
// 2. input에서 포커스를 잃을 때, formattedPhoneNumber을 통해 자동으로 하이픈이 추가되게 나눔

export const filterInputPhoneNumber = (event, v_model_value) => {
  const inputValue = event.target.value;
  const cleanedValue = inputValue.replace(negativeRegex, '');
  v_model_value = cleanedValue;
  return v_model_value;
};

export const formattedPhoneNumber = (v_model_value) => {
  const cleanedValue = v_model_value.replace(negativeRegex, '');
  let result = cleanedValue;
  if (cleanedValue.length === 11) {
    // 11자리 (주로 휴대폰): 3-4-4 패턴
    result = cleanedValue.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  } else if (cleanedValue.length === 10) {
    // 10자리 (지역번호 포함): 02와 같은 2자리 지역번호 고려
    if (cleanedValue.startsWith('02')) {
      // 서울 지역번호인 경우 2-4-4 패턴
      result = cleanedValue.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
    } else {
      // 그 외 3자리 지역번호인 경우 3-3-4 패턴
      result = cleanedValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
  }
  return result;
};

export const isVaildPhoneNumber = (value) => {
  return positiveRegex.test(value);
};
