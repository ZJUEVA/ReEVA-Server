import axios from 'axios';


export const request = axios.create({
	baseURL: process.env.NODE_ENV === 'production' ? '/api/v1/' : `//${window.location.hostname}:3000/`
});

request.interceptors.request.use(
	config => {
		if (localStorage.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
			config.headers.Authorization = `Bearer ${localStorage.token}`;
		}
		return config;
	},
	err => {
		return Promise.reject(err);
	});