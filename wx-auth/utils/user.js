const { DOMINURL } = require('../config/index.js')
const getUserSession = function () {
	return new Promise((resolve, reject) => {
		wx.login({
			success: (res) => {
				wx.request({
					url: `${DOMINURL}/wx_server/auth/jscode2session`,
					method: 'GET',
					data: {
						code: res.code
					},
					success(res) {
						if (res.data.errcode === 200) {
							let data = res.data.data;
							wx.setStorage({
								key: 'yude_sessionid',
								data: data.sessionid,
							})
							wx.setStorage({
								key: 'yude_openid',
								data: data.openid,
							})
							resolve(data.sessionid, data.openid);
						} else {
							wx.showModal({
								title: '请求失败！',
								content: '请检查网络后，重新请求!',
							});
						}
					},
					fail(res) {
						wx.showModal({
							title: '请求失败！',
							content: '请检查网络后，重新请求!',
						});
						reject(res)
					}
				});
			}
		})
	})
}

const getLocalSession = function () {
	return new Promise((resolve, reject) => {
		wx.getStorage({
			key: 'yude_sessionid',
			success: function (res) {
				wx.request({
					url: `${DOMINURL}/wx_server/auth/checksession`,
					header: {
						Cookie: `PHPSESSID=${res.data}`,
						'content-type': 'application/x-www-form-urlencoded'
					},
					success (resquest) {
						if (resquest.data.errcode !== 200) {
							getUserSession().then((sessionid) => {
								resolve(sessionid);
							})
						} else {
							resolve(res.data)
						}
					}
				})
			},
			fail() {
				getUserSession().then((sessionid) => {
					resolve(sessionid, true);
				})
			}
		})
	});
}

const wxUserInfo = function (params) {
	return getLocalSession().then((sessionid) => {
		return new Promise((resolve, reject) => {
			wx.request({
				url: `${DOMINURL}/wx_server/auth/decryptData`,
				method: 'POST',
				header: {
					Cookie: `PHPSESSID=${sessionid}`,
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: {
					encryptedData: params.encryptedData,
					iv: params.iv
				},
				success(res) {
					if (res.data.errcode == 200) {
						let data = JSON.parse(res.data.data);
						wx.setStorage({
							key: 'yude_unionid',
							data: data.unionId,
						})
						resolve(data);
					} else {
						wx.showModal({
							title: '请求失败！',
							content: res.data.errmsg,
						});
						reject(res);
					}
				},
				fail(res) {
					reject(res);
					wx.showModal({
						title: '请求失败！',
						content: '请检查网络后，重新请求!',
					});
				}
			});
		})
	}).catch((err) => {
		console.log(err);
	})
}

const wxUserPhone = function (params) {
	return getLocalSession().then((sessionid) => {
		return new Promise((resolve, reject) => {
			wx.request({
				url: `${DOMINURL}/wx_server/auth/decryptData`,
				method: 'POST',
				header: {
					Cookie: `PHPSESSID=${sessionid}`,
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: {
					encryptedData: params.encryptedData,
					iv: params.iv
				},
				success(res) {
					if (res.data.errcode == 200) {
						let data = JSON.parse(res.data.data);
						resolve(data);
					} else {
						wx.showModal({
							title: '请求失败！',
							content: res.data.errmsg,
						});
						reject(res);
					}
				},
				fail(res) {
					reject(res);
					wx.showModal({
						title: '请求失败！',
						content: '请检查网络后，重新请求!',
					});
				}
			});
		})
	}).catch((err) => {
		console.log(err);
	})
}

module.exports = {
	getUserSession,
	getLocalSession,
	wxUserInfo,
	wxUserPhone,
}