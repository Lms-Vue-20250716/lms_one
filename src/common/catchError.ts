import { AxiosError } from 'axios';

interface IError {
  message: string;
  statusCode: 404 | 500 | 401;
  error?: string;
}

export const catchError = (error: AxiosError<IError>) => {
  const status = error.response.data?.statusCode;
  const message = error.response.data?.message;
  // 서버 에러
  status === 500 && alert(message);
  // 로그인 서버 쿠키 만료
  status === 401 && alert(`${message} ${error}`);
};
