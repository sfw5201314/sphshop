//使用uuid生成一个随机的token
import { v4 as uuidv4 } from 'uuid'
export const getUUID = () => {
  //首先看看是否本地存储了uuid
  let uuid_token = localStorage.getItem("UUIDTOKEN");
  //如果没有uuid那就生成
  if (uuid_token === null) {
    uuid_token = uuidv4();
    localStorage.setItem("UUIDTOKEN", uuid_token);
  }
  //一定要有返回值
  return uuid_token
}