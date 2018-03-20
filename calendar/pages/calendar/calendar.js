const app = getApp();
let self;
Page({
	data: {
		userInfo: {},
		classList: [],  // 班级列表
		curClass: {},  // 当前选择的班级
		tabType: 'month',
		weeks: ['日', '一', '二', '三', '四', '五', '六'],
		emptyDays: 0,
		thisYear: new Date().getFullYear(),
		thisMonth: new Date().getMonth() + 1,
		curYear: new Date().getFullYear(),
		curMonth: new Date().getMonth() + 1,
		curDay: new Date().getDate(),
		curWeek: 1,
		checkedDay: new Date().getDate(),
		fillDays: [],
		curCourses: [],  // 日程
		activities: [],  // 是否有活动
		isLoading: false,  // 是否正在加载
		isAuth: false,  // 收费授权
		isInitinal: true, // 时候在初始化状态
	},
	onLoad: function (options) {
		self = this;
		if (app.globalData.userInfo) {
			self.setData({
				userInfo: app.globalData.userInfo
			})
		} else {
			app.userInfoReadyCallback = (res) => {
				app.globalData.userInfo = { ...app.globalData.userInfo, ...res }
				self.setData({
					userInfo: app.globalData.userInfo
				})
			}
		}
		if (options.classId) {
			// 获取当前班级的课程表
			wx.showLoading({
				title: '加载中...',
				mask: true,
			})
			self.setData({
				curClass: {
					ID: options.classId
				}
			})
		}
	},
	onShow: function () {
		let { curYear, curMonth, curDay, checkedDay } = self.data;

		self.loadCalendar(curYear, curMonth);
		self.setData({
			tabType: 'month',
			curWeek: self.getDayWeeks(curYear, curMonth, curDay),
		})

		if (!self.data.userInfo.id) {
			return false;
		}
	},
	toggleTab(e) {
		let { curYear, curMonth, curWeek } = self.data;
		this.setData({
			tabType: e.currentTarget.dataset.type
		})
		if (e.currentTarget.dataset.type === 'month') {
			self.loadCalendar(curYear, curMonth);
		} else if (e.currentTarget.dataset.type === 'week') {
			// 获取当前周的日历
			self.loadCalendarByWeek(curYear, curWeek);
		}
	},
	loadCalendar (year, month) {
		let days = self.getMonthDays(year, month);
		let fillDays = [];
		for (let i = 0; i < days; i++) {
			fillDays.push(i + 1)
		}
		self.setData({
			curYear: year,
			curMonth: month,
			fillDays: fillDays,
			emptyDays: new Date(`${year}/${month}/1`).getDay()
		})
	},
	loadCalendarByWeek (year, week) {
		let date = new Date(`${year}/1/1`);
		let weekday_of_fistDay = date.getDay();
		let curday = date.setDate(7 * week - 6 - weekday_of_fistDay);
		curday = new Date(curday);
		this.setData({
			curWeek: week,
			curMonth: curday.getMonth() + 1,
			fillDays: self.getDaysOfWeek(year, week),
			emptyDays: 0
		});
	},
	getMonthDays (year, month) { // 一个月多少天
		return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] || (self.isLeapYear(year) ? 29 : 28);
	},
	getDayNumber(year, month, day) { //年内的第几天（001-366）
		day = day >>> 0;
		for (let i = 1; i < month; i++) {
			day += self.getMonthDays(year, i);
		}
		return day;
	},
	getDayWeeks (year, month, day) { // 当前天是第几周
		return Math.ceil(self.getDayNumber(year, month, day) / 7);
	},
	getDaysOfWeek (year, n) { // 获取第n周的七天
		let date = new Date(`${year}/1/1`);  // 今年第一天
		let weekday_of_fistDay = date.getDay();
		let curday = date.setDate(7 * n - 6 - weekday_of_fistDay);  // 第n周后的那一天
		curday = new Date(curday);
		let curDate = curday.getDate();  // 几号
		let curMonth = curday.getMonth() + 1; // 几月
		let days_curMonth = self.getMonthDays(year, curMonth);  // 当前月有几天
		let weekDays_array = [];
		let d;
		for (let i = 0; i < 7; i++) {
			d = curDate + i;
			if (d > days_curMonth) {
				d = d % days_curMonth;
			}
			weekDays_array.push(d)
		}
		return weekDays_array;
	},
	getDetailDaysOfWeek(year, n) {
		let date = new Date(`${year}/1/1`);
		let weekday_of_fistDay = date.getDay();
		let weekDays = [];
		let d, day;
		for (let i = 0; i < 7; i++) {
			d = new Date(`${year}/1/1`).setDate((7 * n) - 6 - weekday_of_fistDay + i);
			d = new Date(d);
			day = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-');
			weekDays.push(day)
		}
		return weekDays;
	},
	getWeeks_of_year (year) { // 获取一年有多少周
		year = year >>> 0;
		let day = 0;
		for (let i = 1; i < 13; i++) {
			day += self.getMonthDays(year, i);
		}
		return Math.ceil(day / 7);
	},
	isLeapYear (year) { // 是否是闰年
		year = year >>> 0;
		return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
	},
	preToggle () {
		let { tabType, curYear, curMonth, curWeek } = self.data;
		if (tabType === "month") {
			curMonth = (curMonth - 1) % 12;
			if (curMonth === 0) {
				curMonth = 12;
				curYear--;
			}
			self.setData({
				curMonth,
				curYear
			})
			self.loadCalendar(curYear, curMonth);
		} else if (tabType === "week") {
			curWeek = curWeek - 1;
			if (curWeek <= 0) {
				curYear = curYear - 1;
				curWeek = self.getWeeks_of_year(curYear)
			}
			self.setData({
				curYear,
				curWeek
			})
			self.loadCalendarByWeek(curYear, curWeek);
		}
	},
	nextToggle () {
		let { tabType, curYear, curMonth, curWeek } = self.data;
		if (tabType === "month") {
			curMonth = (curMonth + 1) % 13;
			if (curMonth === 0) {
				curMonth = 1;
				curYear++;
			}
			self.setData({
				curMonth,
				curYear
			})
			self.loadCalendar(curYear, curMonth);
		} else if (tabType === "week") {
			curWeek = curWeek + 1;
			let maxWeek = self.getWeeks_of_year(curYear)
			if (curWeek > maxWeek) {
				curWeek = 1;
				curYear = curYear + 1;
			}
			self.setData({
				curYear,
				curWeek
			})
			self.loadCalendarByWeek(curYear, curWeek);
		}
	},
	onSelect(e) {
		let { day, index } = e.target.dataset;
		let { tabType, curYear, curMonth, curWeek } = self.data;
		if (tabType === 'month') {
			self.setData({
				curYear,
				curMonth,
				checkedDay: day,
				thisYear: curYear,
				thisMonth: curMonth,
			})
		} else if (tabType === 'week') {
			// 选中的日期
			let date = new Date(`${curYear}/1/1`);
			let weekday_of_fistDay = date.getDay();
			let curday = date.setDate(7 * curWeek - 6 - weekday_of_fistDay + index);
			curday = new Date(curday);
			self.setData({
				curYear: curday.getFullYear(),
				curMonth: curday.getMonth() + 1,
				checkedDay: e.target.dataset.day,
				thisYear: curday.getFullYear(),
				thisMonth: curday.getMonth() + 1,
			})
		}
	}
})
