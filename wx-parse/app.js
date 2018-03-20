const Towxml = require('/assert/towxml/main.js');

App({
	onLaunch: function () {
		wx.getUserInfo({
			success: (res) => {
				this.globalData.userInfo = res.userInfo
			}
		})
	},
	globalData: {
		userInfo: null,
	},
	towxml: new Towxml()
})