const fs = require('fs');

const Logger = (function() {
	let instance;

	function init() {
		return {
			tmp : '',
			// dir : '/log.txt',

			getFormatDate : function(date) {
				var year = date.getFullYear();

				var month = 1 + date.getMonth();
				month = month >= 10 ? month : '0' + month;

				var day = date.getDate();
				day = day >= 10 ? day : '0' + day;

				var hour = date.getHours();
				hour = hour >= 10 ? hour : '0' + hour;

				var min = date.getMinutes();
				min = min >= 10 ? min : '0' + min;

				var sec = date.getSeconds();
				sec = sec >= 10 ? sec : '0' + sec;

				var ssec = date.getMilliseconds();
				ssec = ssec >= 10 ? ssec : '00' + ssec;
				ssec = ssec >= 100 ? ssec : '0' + ssec;

				return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec + '.' + ssec
			},

			printLog : function(level, tag, message) {
				console.group('[' + level + ']  ' + tag);
				console.log(this.getFormatDate(new Date()));
				console.log(message);
				console.log();
				console.groupEnd();
			},

			storeLog : function(level, tag, message) {
				logContent = '[' + level + ']  ' + tag + '\n  ' + this.getFormatDate(new Date()) + '\n' + message + '\n\n';

				try { // make file if it doesn't exist
					fs.statSync(dir);
				}
				catch(err){
					if(err.code === 'ERR_INVALID_CALLBACK') {
						fs.writeFile(dir, '', (err) => {
							if(err) throw err;
						});
					}
				}

				fwrite = fs.openSync(this.dir,'a'); // open the log file
				fs.appendFile(this.dir, logContent, function (err) { // add additional log
					if (err) throw err;
				});
				fs.closeSync(fwrite); // close the log file
			},

			log : function(level, tag, message) {
				var lev = ['Debug', 'Info', 'Warn', 'Error'];

				this.printLog(lev[level-1], tag, message);
				this.storeLog(lev[level-1], tag, '  ' + JSON.stringify(message));
			},

			debug : function(message) {
				this.printLog('Debug', '', message);
				this.storeLog('Debug', '', '  ' + JSON.stringify(message));
			},

			info : function(message) {
				this.printLog('Info', '', message);
				this.storeLog('Info', '', '  ' + JSON.stringify(message));
			},

			warn : function(message) {
				this.printLog('Warn', '', message);
				this.storeLog('Warn', '', '  ' + JSON.stringify(message));
			},

			error : function(message) {
				this.printLog('Error', '', message);
				this.storeLog('Error', '', '  ' + JSON.stringify(message));
			},

			temp : function(message) {
				if(this.tmp == '') {
					this.tmp = this.tmp + JSON.stringify(message);
				}
				else {
					this.tmp = this.tmp + '\n  ' + JSON.stringify(message);
				}
			},

			flush : function(level) {
				this.log(level, '', this.tmp);
				this.tmp = '';
			}
		}
	}

	return {
		getInstance: function() {
			if(!instance) {
				instance = init();
			}

			return instance;
		}
	};
})();

exports.Logger = Logger
