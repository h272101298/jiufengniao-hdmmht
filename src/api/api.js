import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui';
import { MessageBox } from 'element-ui';
import router from '../router/index'

axios.defaults.timeout = 1500000
axios.defaults.withCredentials = true
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'


//请求拦截器
axios.interceptors.request.use(config => {
	if (config.method === 'post') {
		config.data = qs.stringify(config.data)
	}
	return config
}, 
error => {
	console.log('错误的传参！')
})

// axios.interceptors.request.use(config => {
// 	if (config.method === 'delete') {
// 		config.data = qs.stringify(config.data)
// 	}
// 	return config
// }, 
// error => {
// 	console.log('错误的传参！')
// })



//响应拦截器
// axios.interceptors.response.use(
// 	response => {
// 		return response;
// 	},
// 	error => {
// 		// console.log(error)
// 		if(error.response.status==401){
// 			var that=this;
// 			MessageBox.alert('请重新登录', '登录超时', {
// 				confirmButtonText: '确定',
// 				closeOnPressEscape:false,
// 				showClose:false,
// 				callback: action => {
// 					if(action=='confirm'){
// 						router.push('/login');
// 					}
// 				}
// 			});
// 		}else{
// 			Message({
// 				message: error.response.data.msg,
// 				type: 'error'
// 			});
// 		}
// 		return Promise.reject(error)
// 	})

let hosturl ='https://hudie.fengniaotuangou.cn'

let base = hosturl

export default hosturl

//登录
export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data) }//登录

export const requestLogout = params => { return axios.get(`${base}/logout`+`${params}`).then(res => res.data)}//登出


//广告
export const bannerGet = params => { return axios.get(`${base}/banners`+`${params}`).then(res => res.data)}//轮播列表

export const bannerDel = params => { return axios.delete(`${base}/banner`+`${params}`).then(res => res.data)}//轮播删除

export const bannerPost = params => { return axios.post(`${base}/banner`, params).then(res => res.data)}//轮播提交



export const launcherGet = params => { return axios.get(`${base}/launchers`+`${params}`).then(res => res.data)}//轮播列表

export const launcherDel = params => { return axios.delete(`${base}/launcher`+`${params}`).then(res => res.data)}//轮播删除

export const launcherPost = params => { return axios.post(`${base}/launcher`, params).then(res => res.data)}//轮播提交



//分销海报
export const posterGet = params => { return axios.get(`${base}/poster/configs`+`${params}`).then(res => res.data)}

export const posterPost = params => { return axios.post(`${base}/poster/config`, params).then(res => res.data)}

export const posterDel = params => { return axios.get(`${base}/del/poster/config`+`${params}`).then(res => res.data)}



//图库
export const picturePost = params => { return axios.post(`${base}/picture`, params).then(res => res.data) }

export const pictureGet = params => { return axios.get(`${base}/pictures`+`${params}`).then(res => res.data)}

export const pictureDel = params => { return axios.delete(`${base}/picture`+`${params}`).then(res => res.data)}

export const piccheck = params => { return axios.get(`${base}/check/picture`+`${params}`).then(res => res.data) }



//商品分类
export const typeGet = params => { return axios.get(`${base}/types`+`${params}`).then(res => res.data)}

export const typePost = params => { return axios.post(`${base}/type`, params).then(res => res.data)}

export const typeDel = params => { return axios.delete(`${base}/type`+`${params}`).then(res => res.data)}



// //商品列表
export const goodGet = params => { return axios.get(`${base}/goods`+`${params}`).then(res => res.data)}

export const goodPost = params => { return axios.post(`${base}/good`, params).then(res => res.data)}

export const goodDel = params => { return axios.delete(`${base}/good`+`${params}`).then(res => res.data)}

export const goodoneGet = params => { return axios.get(`${base}/good`+`${params}`).then(res => res.data)}

export const goodDefault = params => { return axios.post(`${base}/recommend`, params).then(res => res.data)}



//订单
export const allorderGet = params => { return axios.get(`${base}/orders`+`${params}`).then(res => res.data)}

export const oneorderGet = params => { return axios.get(`${base}/order`+`${params}`).then(res => res.data)}

export const shipgoods = params => { return axios.post(`${base}/delivery/order`, params).then(res => res.data)}

export const refund = params => { return axios.post(`${base}/refund/order`, params).then(res => res.data)}


//分销
export const aapplyGet = params => { return axios.get(`${base}/proxy/applies`+`${params}`).then(res => res.data)}

export const aapplycheck = params => { return axios.post(`${base}/proxy/apply`, params).then(res => res.data)}

export const agentGet = params => { return axios.get(`${base}/proxy/list`+`${params}`).then(res => res.data)}

export const ratioPost = params => { return axios.post(`${base}/proxy/amount/config`, params).then(res => res.data)}

export const ratioGet = params => { return axios.get(`${base}/proxy/amount/config`+`${params}`).then(res => res.data)}

export const comGetAll = params => { return axios.get(`${base}/proxy/amounts`+`${params}`).then(res => res.data)}

export const withdrawGet = params => { return axios.get(`${base}/withdraws`+`${params}`).then(res => res.data)}

export const withdrawCheck = params => { return axios.post(`${base}/withdraw`, params).then(res => res.data)}




// //统计数据
// export const countdataGet = params => { return axios.get(`${base}/count`+`${params}`).then(res => res.data)}


// //广告
// export const advertsGet = params => { return axios.get(`${base}/adverts`+`${params}`).then(res => res.data)}//轮播列表

// export const advertPost = params => { return axios.post(`${base}/advert`, params).then(res => res.data)}//轮播提交

// export const advertDel = params => { return axios.delete(`${base}/advert`+`${params}`).then(res => res.data)}//轮播删除

// export const posterPost = params => { return axios.post(`${base}/poster/configs`, params).then(res => res.data)}//海报提交

// export const posterGet = params => { return axios.get(`${base}/poster/configs`+`${params}`).then(res => res.data)}//海报获取

// export const iconPost = params => { return axios.post(`${base}/icon/config`, params).then(res => res.data)}//图标提交

// export const iconGet = params => { return axios.get(`${base}/icon/configs`+`${params}`).then(res => res.data)}//图标获取








// //商品分类
// export const typeGet = params => { return axios.get(`${base}/product/types`+`${params}`).then(res => res.data)}

// export const typePost = params => { return axios.post(`${base}/product/type`, params).then(res => res.data)}

// export const typeDel = params => { return axios.delete(`${base}/product/type`+`${params}`).then(res => res.data)}

// export const typehot = params => { return axios.get(`${base}/hot/type`+`${params}`).then(res => res.data)}//热门







// export const refundPost = params => { return axios.get(`${base}/refuse`+`${params}`).then(res => res.data)}

// // export const orderDel = params => { return axios.delete(`${base}/order/list`+`${params}`).then(res => res.data)}

// // export const exportOrder = params => { return axios.get(`${base3}/export/orders`+`${params}`).then(res => res.data)}






//快递
export const deliveryGet = params => { return axios.get(`${base}/expresses`+`${params}`).then(res => res.data)}

export const deliveryPost = params => { return axios.post(`${base}/express`, params).then(res => res.data)}

export const deliveryDel = params => { return axios.delete(`${base}/express`+`${params}`).then(res => res.data)}


//快递配置
export const kdconfigGet = params => { return axios.get(`${base}/express/config`+`${params}`).then(res => res.data)}

export const kdconfigPost = params => { return axios.post(`${base}/express/config`, params).then(res => res.data)}


// //用户
export const userGet = params => { return axios.get(`${base}/wechat/users`+`${params}`).then(res => res.data)}

// export const usertohy = params => { return axios.post(`${base1}/member/user`, params).then(res => res.data)}//用户成为会员、续费

// export const bindshop = params => { return axios.get(`${base3}/bind/user`+`${params}`).then(res => res.data)}

// export const unbindshop = params => { return axios.get(`${base3}/unbind/user`+`${params}`).then(res => res.data)}



// //会员
// export const mconfigPost = params => { return axios.post(`${base1}/member/level`, params).then(res => res.data)}//设置会员等级

// export const mconfigGet = params => { return axios.get(`${base1}/member/levels`+`${params}`).then(res => res.data)}//获取会员等级

// export const mconfigDel = params => { return axios.delete(`${base1}/member/level`+`${params}`).then(res => res.data)}//删除会员等级

// export const memberGet = params => { return axios.get(`${base1}/member/users`+`${params}`).then(res => res.data)}//会员列表

// export const memberpay = params => { return axios.get(`${base1}/member/records`+`${params}`).then(res => res.data)}//会员充值记录


// //管理员
// export const adminGet = params => { return axios.get(`${base}/users`+`${params}`).then(res => res.data)}

// export const adminPost = params => { return axios.post(`${base}/user`, params).then(res => res.data)}

// export const adminDel = params => { return axios.delete(`${base}/user`+`${params}`).then(res => res.data)}


// //角色
// export const permissionGet = params => { return axios.get(`${base}/permissions`+`${params}`).then(res => res.data)}

// export const roleGet = params => { return axios.get(`${base}/roles`+`${params}`).then(res => res.data)}

// export const rolePost = params => { return axios.post(`${base}/role`, params).then(res => res.data)}

// export const roleDel = params => { return axios.delete(`${base}/role`+`${params}`).then(res => res.data)}

// export const defaultrole = params => { return axios.get(`${base}/default/role`+`${params}`).then(res => res.data)}



// //基本设置
export const signPost = params => { return axios.post(`${base}/sign/config`, params).then(res => res.data)}

export const signGet = params => { return axios.get(`${base}/sign/configs`+`${params}`).then(res => res.data)}

// export const integralPost = params => { return axios.post(`${base3}/score/config`, params).then(res => res.data)}

// export const integralGet = params => { return axios.get(`${base3}/score/config`+`${params}`).then(res => res.data)}




//设计师等级
export const levelPost = params => { return axios.post(`${base}/level/config`, params).then(res => res.data)}

export const levelsGet = params => { return axios.get(`${base}/level/configs`+`${params}`).then(res => res.data)}

export const levelGet = params => { return axios.get(`${base}/level/config`+`${params}`).then(res => res.data)}

export const levelDel = params => { return axios.get(`${base}/del/level/config`+`${params}`).then(res => res.data)}







// //微信设置
export const wxconfigPost = params => { return axios.post(`${base}/tx/config`, params).then(res => res.data)}

export const wxconfigGet = params => { return axios.get(`${base}/tx/config`+`${params}`).then(res => res.data)}






export const configPost = params => { return axios.post(`${base}/notify/config`, params).then(res => res.data)}

export const configsGet = params => { return axios.get(`${base}/notify/configs`+`${params}`).then(res => res.data)}

export const configGet = params => { return axios.get(`${base}/notify/config`+`${params}`).then(res => res.data)}

export const configDel = params => { return axios.get(`${base}/del/notify/config`+`${params}`).then(res => res.data)}


//帮助文档
export const documentGet = params => { return axios.get(`${base}/documents`+`${params}`).then(res => res.data)}

export const documentPost = params => { return axios.post(`${base}/document`, params).then(res => res.data)}

export const documentDel = params => { return axios.delete(`${base}/document`+`${params}`).then(res => res.data)}




// //积分商城
export const igoodGet = params => { return axios.get(`${base}/score/products`+`${params}`).then(res => res.data)}

export const igoodPost = params => { return axios.post(`${base}/score/product`, params).then(res => res.data)}

export const igoodDel = params => { return axios.delete(`${base}/score/product`+`${params}`).then(res => res.data)}

export const igoodoneGet = params => { return axios.get(`${base}/score/product`+`${params}`).then(res => res.data)}

