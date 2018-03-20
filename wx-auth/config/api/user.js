const { wxRequest } = require('../../utils/request.js')


const listUsers = function (params) {
	return wxRequest('/wp/v2/users', params)
}


module.exports = {
	listUsers,  // 用户列表
}