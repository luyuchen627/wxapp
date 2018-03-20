const formatTime = (date, formatType) => {
	date = date || new Date()
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()
	let dateFormat = [year, month, day].map(formatNumber).join('-')
	let timeFormat = [hour, minute, second].map(formatNumber).join(':')
	return formatType ? (dateFormat + ' ' + timeFormat) : dateFormat
}

const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}

// 两个日期相差天数
const dataInterval = (date1, date2) => {
	if (date1.constructor.name !== 'Date' || date2.constructor.name !== 'Date') {
		throw new Error('params must be date!')
	}
	let diff = Math.abs(date2.getTime() - date1.getTime()) //相差的毫秒数
	let day = diff / (1000 * 60 * 60 * 24); //相差秒数
	return Math.ceil(day) + 1
}

// 友好的时间格式
const diffTime = (date) => {
	date = new Date(date);
	let time = Math.ceil((Date.now() - date.getTime()) / (1000 * 60)); // 转化为分钟数
	return time < 10 ? '刚刚' : (time <= 60 ? time + '分钟前' : (time <= 60 * 24 ? Math.floor(time / 60) + '小时前' : (time <= 60 * 24 * 3 ? Math.floor(time / 60 / 24) + "天前" : ((time > 60 * 24 * 3) ? date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() : ''))))
}

// 验证手机号
const testMobile = str => {
	return /^((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8}$/.test(str);
}
// 验证邮箱
const testEmail = str => {
	return /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(str);
}

// 检查是否为json字符串
const parseJson = str => {
	if (typeof str === 'string') {
		try {
			if (str.search(/^\{/) > -1 || str.search(/^\[/) > -1) {
				var obj = JSON.parse(str);
				return obj;
			} else {
				return str;
			}
		} catch (e) {
			throw new Error('Cannot be converted to json format.');
		}
	} else if (typeof str == 'object') {
		return str;
	} else {
		throw new Error("params is not json type");
	}
}
// 类型检测
const typeIs = (obj, type) => {
	if (!type) {
		throw new Error("Miss required parameter -- type");
	}
	return obj.constructor.name === type;
}

module.exports = {
	formatTime,
	dataInterval,
	diffTime,
	formatNumber,
	testMobile,
	testEmail,
	parseJson,
	typeIs
}
