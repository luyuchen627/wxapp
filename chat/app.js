App({
	onLaunch: function () {
		let self = this;
		wx.checkSession({
			fail () {
			}
		})
	},
	globalData: {
		userInfo: null,
	}
})