const DOMINURL = 'https://wx.yude.org';
const BASEAPIURL = 'https://wx.yude.org/wp-json';
const WSSURL = 'https://wx.yude.org/wp-json';
const RECORD_TIME_LIMIT = 1000 * 60 * 60 * 48;
const SERVICETEL = '18210123456';
const ANONYMOUS = 20;
const GUEST = 20;

module.exports = {
	DOMINURL,  // 域名地址
  BASEAPIURL, // 数据请求地址
  WSSURL, // wss服务器地址
  RECORD_TIME_LIMIT, // 缓存时间限制（两天之内）
	SERVICETEL,  // 客服联系电话
	ANONYMOUS,  // 匿名用户
	GUEST,  // 游客
}