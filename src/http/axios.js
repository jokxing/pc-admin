import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'
import {guid,getServerDate} from './utils.js'

// axios.defaults.timeout = 10000 // 请求超时时间

const Service = axios.create({
    baseURL: '/',
})

// axios 请求拦截器
const serverTimestamp = getServerDate();
const localTimestamp = new Date().getTime();
Service.interceptors.request.use(
    config=>{
        if(localStorage.getItem("access_token")){
			config.headers.Authorization = 'Bearer' + '  ' + localStorage.getItem('access_token');
        }
        const timestamp = Math.ceil((new Date().getTime() - localTimestamp + serverTimestamp) / 1000) 
		const nonce = guid()
		const signature = aes(timestamp,serverTimestamp,localTimestamp,nonce,config.url);
		config.headers['Timestamp'] = timestamp;
		config.headers['Nonce'] = nonce;
        config.headers['Signature'] = signature;
        return config
    },error=>{
        Message.error({ message: '请求超时!' });
        return Promise.reject(error)
    }
)

// axios respone拦截器
window.i = 0
Service.interceptors.response.use(
    res=>{
        window.i = 0;
        if(res.status == 200){
            return res;
        }else if (res.status == 401){
            router.push('/login');
            localStorage.removeItem('access_token');
            localStorage.removeItem('expires_time');
            localStorage.removeItem('mobile');
            localStorage.removeItem('agentLink');
            localStorage.removeItem('withdrawMoney');
            localStorage.removeItem('selectedBgImg');
            localStorage.removeItem('money');
            localStorage.removeItem('generateBankCardData');
            localStorage.removeItem('cmoney');
            localStorage.removeItem('has_pay_pwd');
            return res;
        }else if (res.status == 201) {
            return res;
        }
        return res;
    },
    error=>{
        if (error && error.response) {
            const responseCode = error.response.status;
            switch (responseCode) {
            case 400:
                error.message = '请求错误(400)'
                break
            case 401:
                error.message = error.response.data.message;
                router.push('/login');
                localStorage.removeItem('access_token');
                localStorage.removeItem('expires_time');
                localStorage.removeItem('mobile');
                localStorage.removeItem('agentLink');
                localStorage.removeItem('withdrawMoney');
                localStorage.removeItem('selectedBgImg');
                localStorage.removeItem('money');
                localStorage.removeItem('generateBankCardData');
                localStorage.removeItem('cmoney');
                localStorage.removeItem('has_pay_pwd');
                break
            case 403:
                error.message = '拒绝访问(403)'
                break
            case 404:
                error.message = '请求出错(404)'
                break
            case 408:
                error.message = '请求超时(408)'
                break
            case 500:
                if(error.response.data.message == 'Unauthenticated.'){
                    error.message = '';
                    router.push('/login');
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('expires_time');
                    localStorage.removeItem('mobile');
                    localStorage.removeItem('agentLink');
                    localStorage.removeItem('withdrawMoney');
                    localStorage.removeItem('selectedBgImg');
                    localStorage.removeItem('money');
                    localStorage.removeItem('generateBankCardData');
                    localStorage.removeItem('cmoney');
                    localStorage.removeItem('has_pay_pwd');
                }else{
                    error.message = '服务器错误(500)'
                }
                break
            case 501:
                error.message = '服务未实现(501)'
                break
            case 502:
                error.message = '网络错误(502)'
                break
            case 503:
                error.message = '服务不可用(503)'
                break
            case 504:
                error.message = '网络超时(504)'
                break
            case 505:
                error.message = 'HTTP版本不受支持(505)'
                break
            default:
                // error.message = `连接出错(${error.response.status})！`            
            }
            if(error.response.status == 401){
                if(window.i == 0){
                    if(error.message != ''){
                        Message.error({
                            message: error.message,
                            position: 'middle',
                            duration: 2000
                        })
                    }
                }
                window.i++
            }else{
                window.i = 0;
                if(error.response.status != 412){
                    if(error.message != ''){
                        Message.error({
                            message: error.message,
                            position: 'middle',
                            duration: 2000
                        })
                    }
                }
            }
            return Promise.reject(error.response.data)
        }
    }
)

export default Service;