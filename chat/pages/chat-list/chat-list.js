const app = getApp()
let self;
Page({
	data: {
		userInfo: {},
		msgs: [
			{
				user: {
					nickname: 'vins',
					avatar: 'https://wx.qlogo.cn/mmopen/vi_32/Dx5rDocUenz7UwVD3ic6ogSzdm03qN4C8DofyRtwkMe7kItyCCEgyQryKArsiaiaxFme6wRuFBd7Xia0VUia7C9cTYw/0'
				},
				content: 'hello',
				time: '2018-01-01 08:10:10',
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
				time: '2018-02-01 15:12:10',
			}
		]
	},
	onLoad: function () {
		self = this;
	},
	onShow: function () {
	}
})