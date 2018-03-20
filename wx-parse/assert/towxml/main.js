class towxml {
	constructor(option) {
		const _ts = this;
		option = option || {};
		for (let i in option) {
			_ts.config[i] = option[i];
		};

		_ts.m = {};

		let mdOption = {
			html: true,
			xhtmlOut: true,
			typographer: true,
		};

		if (global) {
			_ts.m.html2json = require('./lib/html2json');
		} else if (window) {
			_ts.m.html2json = window.html2json;
		};
		_ts.wxmlTag = ['view', 'video', 'swiper', 'block', 'swiper-item', 'button', 'slider', 'scroll-view', 'movable-area', 'movable-view', 'text', 'progress', 'checkbox-group', 'label', 'checkbox', 'form', 'switch', 'input', 'radio-group', 'radio', 'picker', 'picker-view', 'switch', 'textarea', 'navigator', 'audio', 'image', 'map', 'canvas', 'contact-button'];
	}


	//html转wxml
	html2wxml(htmlContent) {
		htmlContent = htmlContent.replace(/(\\r\\n|\\n)/ig, "<br/>");
		htmlContent = htmlContent.replace(/(\&nbsp;)/ig, " ");
		const _ts = this;
		let re = /<[^<]*>/ig,
			wxml = htmlContent.replace(re, (word) => {
				//检查是否为关闭标签
				let isCloseLabel = (() => {
					let star = word.substr(0, 2);
					return star === '</';
				})();
				//处理关闭标签替换
				if (isCloseLabel) {
					let labelName = word.substr(2, word.length - 3).toLowerCase();
					if (_ts.isConversion(labelName)) {
						return '</' + _ts.newLabel(labelName) + '>';
					};
				}
				//处理开始标签替换
				else {
					let delWordBbrackets = word.substr(1, word.length - 2), //剔除首尾尖括号
						wordSplit = delWordBbrackets.split(' '), //得到元素标签与属性
						labelName = wordSplit[0].toLowerCase(), //取得tagName
						className_htmlTag = 'h2w__' + labelName;

					if (_ts.isConversion(labelName)) {

						wordSplit.splice(0, 1); //剔除元素的标签

						//检查元素是否已经有className，有的话在原基础上添加新的类名
						let wordSplitLen = wordSplit.length,
							isClassExist = (() => {
								if (wordSplitLen) {
									for (let i = 0; i < wordSplitLen; i++) {
										let item = wordSplit[i],
											re = /class="/ig;
										if (re.test(item)) {
											wordSplit[i] = item.replace(re, (word) => {
												return word + className_htmlTag + ' ';
											});
											return true;
										};
									};
								};
								return false;
							})();

						//如果元素没有className，则新加上className
						if (!isClassExist) {
							wordSplit.unshift('class="' + className_htmlTag + '"');
						};

						//组合属性
						let newAttrs = (() => {
							let s = '';
							wordSplit.forEach((item, index) => {
								s += item + ' ';
							});
							s = s.substr(0, s.length - 1);
							return s;
						})();

						//如果是图片
						if (labelName === 'img') {
							return '<image ' + newAttrs + '></image>'
						};

						return '<' + _ts.newLabel(labelName) + ' ' + newAttrs + '>' + _ts.needClose(labelName);
					};
				};

				return word;
			});
		return wxml;
	}

	//检查标签是否需要转换
	isConversion(labelName) {
		const _ts = this;
		return !_ts.wxmlTag.some((item, index) => {
			return labelName === item;
		});
	}

	//处理自关闭标签,hr,br这些需要添加</view>关闭标签
	needClose(labelName) {
		let arr = ['hr', 'br'],
			s = '',
			closeTag = arr.some((item, index) => {
				return labelName === item;
			});

		if (closeTag) {
			s = '</view>';
		};
		return s;
	}

	//html与wxml对应的标签
	newLabel(labelName) {
		let temp = 'view';
		switch (labelName) {
			case 'a':
				temp = 'navigator';
				break;
			case 'span':
			case 'b':
			case 'strong':
			case 'i':
			case 'em':
			case 'code':
			case 'sub':
			case 'sup':
			case 'g-emoji':
			case 'mark':
			case 'ins':
				temp = 'text';
				break;
		};
		return temp;
	}

	// html2json
	toJson(content) {
		const _ts = this;

		let json = '',
			sortOutJson;
		
		json = _ts.m.html2json(_ts.html2wxml(content));

		//遍历json将多个class属性合为一个
		(sortOutJson = (json) => {
			for (let i in json) {
				if (i === 'child' && typeof json[i] === 'object' && json[i].length) {
					json[i].forEach((item, index) => {
						sortOutJson(item);
					});
				};
				if (i === 'attr') {
					if (typeof json[i].class === 'string') {
						json[i].className = json[i].class;
					} else if (typeof json[i].class === 'object' && json[i].class.length) {
						json[i].className = json[i].class.toString().replace(/,/g, ' ');
					};
				};
			};
		})(json);
		json.theme = 'light';

		return json;
	}
};

module.exports = towxml;