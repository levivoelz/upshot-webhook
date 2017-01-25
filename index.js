function upshotTest(hook=null) {
	var dev = hook ? false : true;
	if (dev) require('dotenv').config();

	var Spreadsheet = require('edit-google-spreadsheet');

	const env = dev ? process.env : hook.env;

	var sheetId = env.MY_GOOG_SHEET_ID;
	var email = env.MY_GOOG_EMAIL;
	var key = env.MY_GOOG_KEY;

	Spreadsheet.load({
	  debug: true,
	  spreadsheetId: sheetId,
	  worksheetName: 'Sheet1',
	  oauth : {
	    email: email,
	    key: key
	  }

	}, sheetReady);

	function sheetReady(err, spreadsheet) {
	  if (err) throw err;

		spreadsheet.receive(function(err, rows, info) {
			const params = hook ? hook.params : {}
			const text = params.text ? params.text.split(/ at | with snippet /) : []

			const data ={
				[info.lastRow + 1]: {
					1: text[0],
					2: text[1],
					3: text[2]
				}
			};

			spreadsheet.add(data);

			spreadsheet.send(function(err) {
			  if (err) {
					if (hook) {
						hook.res.json({status: 'failure', error: err})
					} else {
						throw err;
					}
				}

				hook ? hook.res.json({status: 'success!', data}) : console.log(data);
			});
		});
	}
  // var host = hook.req.host;
};

// upshotTest()

module.exports = upshotTest;
