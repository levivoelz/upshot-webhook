function upshotTest(hook=null) {
	var GoogleSpreadsheet = require('google-spreadsheet');

	if (!hook) {
		(function() {require('dotenv').config()})()
	};


	var async = require('async');
	const env = hook ? hook.env : process.env;
	const params = hook ? hook.params : {};
	const text = params.text
		? params.text.split(/ at | with snippet /)
		: ['test name', 'test@email.com', 'test snippet']

	var doc = new GoogleSpreadsheet(env.MY_GOOG_SHEET_ID);
	var sheet;

	async.series([
	  function setAuth(step) {
	    var creds = {
	      client_email: env.MY_GOOG_EMAIL,
	      private_key: env.MY_GOOG_KEY
	    }

	    doc.useServiceAccountAuth(creds, step);
	  },

	  function getInfoAndWorksheets(step) {
	    doc.getInfo(function(err, info) {
				if (err) output(err, true)
	      sheet = info.worksheets[0];
	      step();
	    });
	  },

	  function workingWithRows(step) {
	    sheet.getRows({}, function(err, rows){
				if (err) output(err, true)

				const data = {
					name: text[0],
					email: text[1],
					snippet: text[2]
				};

				sheet.addRow(data, function(err) {
					if (err) output(err, true);

					output({data});
				});
	    });
	  }
	]);

	function output(message, error) {
		if (hook) {
			if (error) {
				hook.res.json({status: 'failure', error: message});
			}

			hook.res.json({status: 'success', message});
		} else {
			if (error) {
				console.error(message);
			}

			console.log(message);
		}
	}
}

upshotTest()

module.exports = upshotTest;
