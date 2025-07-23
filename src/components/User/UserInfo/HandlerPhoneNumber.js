export const formatPhoneNumber = (value) => {
  value = value.replace(/[^0-9]/g, '');

  let result = '';

  if (value.length < 4) {
    result = value;
  } else if (value.length < 7) {
    result = value.slice(0, 3) + '-' + value.slice(3);
    result = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7);
  } else {
    result = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
  }
  return result;
};

export const isVaildPhoneNumber = (value) => {
  return '/^010-\\d{4}-\\d{4}$/'.test(value) || '/^0\\d{1,2}-\\d{3,4}-\\d{4}$/'.test(value);
};
