const app = getApp();
const RECORD_TIME_LIMIT = 1000 * 60 * 60 * 48;
let self;
// 缺少时间格式化的函数
Page({
	data: {
		blur:function(){
			size:'60px'
		},
		userInfo: {
			avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/Dx5rDocUenz7UwVD3ic6ogSzdm03qN4C8DofyRtwkMe7kItyCCEgyQryKArsiaiaxFme6wRuFBd7Xia0VUia7C9cTYw/0',
			nickName: 'vins'
		},
		records: [
			{
				user: {
					nickname: 'vins',
					avatar: 'https://wx.qlogo.cn/mmopen/vi_32/Dx5rDocUenz7UwVD3ic6ogSzdm03qN4C8DofyRtwkMe7kItyCCEgyQryKArsiaiaxFme6wRuFBd7Xia0VUia7C9cTYw/0'
				},
				content: 'hello',
				time: '2018-02-06 08:10:10',
			},
			{
				user: {
					nickname: 'vins',
					avatar: 'https://wx.qlogo.cn/mmopen/vi_32/Dx5rDocUenz7UwVD3ic6ogSzdm03qN4C8DofyRtwkMe7kItyCCEgyQryKArsiaiaxFme6wRuFBd7Xia0VUia7C9cTYw/0'
				},
				content: 'noce to meet you！',
				time: '2018-02-02 09:10:10',
			},
			{
				user: {
					nickname: 'vins',
					avatar: 'https://wx.qlogo.cn/mmopen/vi_32/Dx5rDocUenz7UwVD3ic6ogSzdm03qN4C8DofyRtwkMe7kItyCCEgyQryKArsiaiaxFme6wRuFBd7Xia0VUia7C9cTYw/0'
				},
				content: 'what is it',
				time: '2018-02-05 15:12:10',
			}
		],
		replyVal: '',
		socketOpen: false,
	},
	onLoad: function () {
		self = this;
		if (app.globalData.userInfo) {
			this.setData({
				userInfo: app.globalData.userInfo
			})
		} else {
			app.userInfoReadyCallback = res => {
				this.setData({
					userInfo: res.userInfo
				})
			}
		}
		// 获取本地聊天记录
		wx.getStorage({
			key: 'records',
			success (res) {
				if (res.data && res.data.length > 0){
					// 只取最近两天的两天记录
					self.setData({
						records: res.data.filter((item) => {
							return new Date(item.time) > Date.now() - RECORD_TIME_LIMIT
						})
					})
				}
			}
		})
	},
	onsubmit (e) {
		let { records, userInfo } = self.data;
		let { formId, value } =  e.detail;
		records.push({
			user: {
				nickname: userInfo.nickName,
				avatar: userInfo.avatarUrl
			},
			content: value.reply,
			time: Date.now(),
		})
		console.log(records)
		self.setData({
			records,
			replyVal: ''
		})
		self.sendSocketMessage()
	},
	sendSocketMessage (msg) {
		let { socketOpen, records } = self.data;
		if (socketOpen) {
			wx.sendSocketMessage({
				data: msg,
				success (res) {
					console.log(res)
					// 写入本地缓存
					wx.setStorage({
						key: "records",
						data: records.filter((item) => {
							return new Date(item.time) > Date.now() - RECORD_TIME_LIMIT
						})
					})
				}
			})
		}
		// 写入本地缓存
		wx.setStorage({
			key: "records",
			data: records.filter((item) => {
				return new Date(item.time) > Date.now() - RECORD_TIME_LIMIT
			})
		})
	}
})