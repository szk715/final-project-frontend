import axios from "axios";
const URL = "http://81.70.197.141:7001";
axios.create({
  headers: "content-type:application/json",
});
export const fetchData = (name) => {
  return axios.get(`${URL}/${name}`);
};
export const DelData = (name, id) => {
  return axios.delete(`${URL}/${name}/${id}/`);
};
export const AddData = (name, data) => {
  return axios.post(`${URL}/${name}/`, { ...data });
};
export const UpdateData = (name, data) => {
  return axios.put(`${URL}/${name}/`, { ...data });
};
