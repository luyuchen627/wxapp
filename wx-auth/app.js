const { listUsers } = require('/config/api/index.js');
const { getUserSession, wxUserInfo } = require('/utils/user.js');

App({
	onLaunch: function () {
		let self = this;
		wx.checkSession({
			fail () {
				getUserSession().then((sessionid, openid) => {
					self.globalData.sessionid = sessionid;
					self.globalData.openid = openid;
					wx.getSetting({
						success: res => {
							self.wxAuth(true)
						}
					})
				})
			}
		})
		// 获取用户信息
		wx.getSetting({
			success: (res) => {
				self.wxAuth()
			}
		})
	},
	wxAuth(withCredentials) {
		let self = this;
		wx.getUserInfo({  // 身份认证接口写好后，替换为身份认证的api
			withCredentials: withCredentials,
			success: (res) => {
				self.globalData.userInfo = { ...self.globalData.userInfo, ...res.userInfo }

				try {
					let yude_openid = wx.getStorageSync('yude_openid');
					if (yude_openid) {
						listUsers({
							data: {
								slug: yude_openid.split('-').join('')
							}
						}).then((user) => {
							if (user && user.length > 0) {
								console.log('已授权')
								self.globalData.userInfo = { ...user[0], ...self.globalData.userInfo };
								self.globalData.isuser = true;
							} else {
								if (withCredentials) {
									wxUserInfo({
										encryptedData: res.encryptedData,
										iv: res.iv
									}).then((res) => {
										console.log(res)
										self.globalData.userInfo = { ...self.globalData.userInfo, ...res }
										if (self.userInfoReadyCallback) {
											self.userInfoReadyCallback(res)
										}
									})
								}
							}
							if (self.userInfoReadyCallback) {
								self.userInfoReadyCallback(user[0])
							}
						})
					} else {
						getUserSession();
						self.globalData.isuser = false;
					}
				} catch(err) {
					self.globalData.isuser = false;
					console.log(err)
				}
			},
			fail: (res) => {
				if (wx.openSetting) {
					wx.openSetting({
						success: (res) => {
							self.wxAuth()
						}
					})
				} else {
					wx.showModal({
						title: '提示',
						content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
					})
				}
			}
		})
	},
	globalData: {
		userInfo: null,
		isuser: false
	}
})