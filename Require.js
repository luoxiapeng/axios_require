/*
  @author  SmallLuo
  @email   949123073@qq.com
  @vesion  1.0
  @description
 */
import axios from 'axios';
import qs from 'qs';
axios.defaults.timeout = 5000;
axios.defaults.baseURL ='';

axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;
// 请求超时拦截器
axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
    var config = err.config;
    // If config does not exist or the retry option is not set, reject
    if(!config || !config.retry) return Promise.reject(err);
    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0;
    // Check if we've maxed out the total number of retries
    if(config.__retryCount >= config.retry) {
        // Reject with the error
        // 请求超时可以在这里这里设置跳转页面

        return Promise.reject(err);
    }
    // Increase the retry count
    config.__retryCount += 1;
    // Create new promise to handle exponential backoff
    var backoff = new Promise(function(resolve) {
        setTimeout(function() {
            resolve();
        }, config.retryDelay || 1);
    });
    // Return the promise in which recalls axios to retry the request
    return backoff.then(function() {
        return axios(config);
    });
});

//http request 拦截器
axios.interceptors.request.use(
    config => {
        // const token = getCookie('名称');注意使用的时候需要引入cookie方法，推荐js-cookie
        config.data = JSON.stringify(config.data);
        config.headers = {
            'Content-Type':'application/x-www-form-urlencoded'
        };
        return config;
    },
    error => {
        return Promise.reject(err);
    }
);

//http response 拦截器（在开发中我们经常遇到这样的需求，需要用户直接点击一个链接进入到一个页面，用户点击后链接后会触发401拦截返回登录界面，登录后又跳转到链接的页面而不是首页）
axios.interceptors.response.use(
    response => {
    if(response.data.errCode ==2){
    router.push({
        path:"/login",
        querry:{redirect:router.currentRoute.fullPath}//从哪个页面跳转
        });
    }
        return response;
    },
    error => {
        return Promise.reject(error);
    }
)


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function get(url,params={}){
    // console.log(qs.stringify(params));
    return new Promise((resolve,reject) => {
        axios.get(url,{
        params:qs.parse(params)
    }).then(response => {
        resolve(response.data);
    }).catch(err => {
            reject(err);
        });
    });
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url,data = {}){
    return new Promise((resolve,reject) => {
        axios.post(url,qs.parse(data)).then(response => {
            resolve(response.data);
        },
        err => {
                reject(err);
            });
        });
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url,data = {}){
    return new Promise((resolve,reject) => {
        axios.patch(url,qs.parse(data))
        .then(response => {
        resolve(response.data);
    },err => {
            reject(err);
        });
})
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url,data = {}){
    return new Promise((resolve,reject) => {
        axios.put(url,qs.parse(data))
        .then(response => {
        resolve(response.data);
    },err => {
            reject(err);
        });
})
}


// import {post,fetch,patch,put} from './utils/http'
// //定义全局变量
// Vue.prototype.$post=post;
// Vue.prototype.$fetch=fetch;
// Vue.prototype.$patch=patch;
// Vue.prototype.$put=put;


// this.$fetch('/api/v2/movie/top250')
//     .then((response) => {
//         console.log(response)
//     })