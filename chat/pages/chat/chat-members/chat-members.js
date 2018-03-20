Page({
  data: {
		members: [
			{
				user_id: 1,
				avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/Dx5rDocUenz7UwVD3ic6ogSzdm03qN4C8DofyRtwkMe7kItyCCEgyQryKArsiaiaxFme6wRuFBd7Xia0VUia7C9cTYw/0',
				user_name: 'vins'
			},
			{
				user_id: 2,
				avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/Dx5rDocUenz7UwVD3ic6ogSzdm03qN4C8DofyRtwkMe7kItyCCEgyQryKArsiaiaxFme6wRuFBd7Xia0VUia7C9cTYw/0',
				user_name: 'vins1'
			},
			{
				user_id: 3,
				avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/Dx5rDocUenz7UwVD3ic6ogSzdm03qN4C8DofyRtwkMe7kItyCCEgyQryKArsiaiaxFme6wRuFBd7Xia0VUia7C9cTYw/0',
				user_name: 'vins2'
			}
		]
  },
  onLoad: function (options) {
		// 获取聊天室中的所有成员消息
		console.log(options.roomId)
  },
})