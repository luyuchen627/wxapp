const app = getApp();
Page({
	data: {
		userInfo: {},
		htmlDom: '<div><h2>我是h2标签</h2> <p>我是p标签</p></div>',
	},
	onShow: function () {
		this.setData({
			htmlDom: app.towxml.toJson(this.data.htmlDom, 'html')
		})
	}
})