const app = getApp();
let self;
Page({
	data: {
		userInfo: {}
	},
	onLoad: function (options) {
		self = this;
		if (app.globalData.userInfo) {
			this.setData({
				userInfo: app.globalData.userInfo
			})
		} else {
			app.userInfoReadyCallback = (res) => {
				app.globalData.userInfo = { ...app.globalData.userInfo, ...res }
				this.setData({
					userInfo: app.globalData.userInfo
				})
			}
		}
	}
})