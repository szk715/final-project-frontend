import axios from 'axios';
import { stringify } from 'qs';
import { notification } from 'antd';

const request = async (reqParams) => {
  const {
    url,
    method = 'get',
    timeout,
    params = {},
    headers = {},
    restMethod,
    operateConfig,
    ...other
  } = reqParams;

  // 默认初始参数
  const defaultOptions = {
    timeout: timeout || 5000,
    responseType: 'json',
    paramsSerializer(param) {
      return stringify(Object.assign({}, param), {
        arrayFormat: 'brackets',
        encode: true
      });
    },
    // 允许带上cookie
    withCredentials: true
  };

  const instance = axios.create();

  // 3. 统一处理header
  let header = {
    'Content-Type': 'application/json'
  };
  // 4. 定义axios参数
  const options = {
    ...defaultOptions,
    method,
    url,
    headers: { ...headers, ...header },
    ...other
  };

  // 5.格式化get和post的参数
  if (method === 'post') {
    options.data = params;
  } else {
    options.params = params;
  }

  const response = await instance(options)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      notification.error({
        message: '请求异常',
        description: error?.message || '未知错误'
      });
      return error;
    });

  return response;
};

export default request;
