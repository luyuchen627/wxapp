const { BASEAPIURL } = require("../config/index.js");
const errCodes = require('../config/errcodes.js');
const { parseJson } = require("./util.js");
// 数据请求
const wxRequest = (apiUrl, params = {}, method) => {
	return new Promise((resolve, reject) => {
		wx.request({
			url: `${BASEAPIURL}${apiUrl}`,
			method: method || 'GET',
			data: params.data || {},
			dataType: 'json',
			header: {
				Accept: 'application/json',
				"Content-Type": params.ContentType || "application/json",
				"Authorization": params.noAuth ? "" : "Basic bHp6Omx1emhlbnpoZW4="
			},
			success (res) {
				let data = parseJson(res.data);
				if (!data.code) {
					typeof params.success == "function" && params.success(data, res.header);
					resolve(data, res.header);
				} else {
					if (typeof params.error == "function") {
						let hideError = params.error(data);
						if (!hideError) {
							setTimeout(() => {
								wx.showToast({
									title: data.code ? (errCodes[data.code] || errCodes['default']) : `${data.message}`,
									image: '/assert/imgs/error_tip.png',
									duration: 2000,
								});
							}, 0)
						}
					} else {
						setTimeout(() => {
							wx.showToast({
								title: data.code ? (errCodes[data.code] || errCodes['default']) : `${data.message}`,
								image: '/assert/imgs/error_tip.png',
								duration: 2000,
							});
						}, 0)
					}
					// typeof params.error == "function" && params.error(data);
					reject(res);
				}
			},
			fail (res) {
				setTimeout(() => {
					wx.showModal({
						title: '请求失败！',
						content: '请检查网络后，重新请求!',
					});
				}, 0)
				typeof params.fail == "function" && params.fail(res);
			},
			complete(res) {
				if (!params.showLoading) {
					wx.hideLoading();
				}
				typeof params.complete == "function" && params.complete(res);
			},
		});
	})
};

module.exports = {
	wxRequest
}
