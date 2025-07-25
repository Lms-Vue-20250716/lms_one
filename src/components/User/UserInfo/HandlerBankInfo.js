//은행 정보 관련 처리
//제약사항 정규식
const negativeRegex = /\D/;
const positiveRegex = /\d/;

export const filterInputBankNumber = (event) => {
  const inputValue = event.target.value;
  const cleanedValue = inputValue.replace(negativeRegex, '');
  return cleanedValue;
};

export const isVaildEmail = (value) => {
  return positiveRegex.test(value);
};
