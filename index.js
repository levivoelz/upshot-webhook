function upshotTest(hook) {
	var GoogleSpreadsheet = require("google-sheets-node-api");
	var mySheet = new GoogleSpreadsheet(hook.env.MY_GOOG_SHEET_ID);
	var creds = {
		client_email: hook.env.MY_GOOG_EMAIL,
		private_key: hook.env.MY_GOOG_KEY
	};

	hook.res.json({status: 'failure :-(', error: hook.env.MY_GOOG_SHEET_ID})

	mySheet.useServiceAccountAuth(creds)
		.then(mySheet.getInfo.bind(mySheet))
		.then(function(sheet_info) {
	    var sheet1 = sheet_info.worksheets[0];
	 		var data = {'Col1': 'Val1', Col2: 'Val2', Col3:'Val3', Col4: 'Val4', Col5: 'Val5', Col6: 'Val6', Col7: 'Val7'};

	    sheet1.addRow(data)
	      // .then(sheet1.getRows.bind(sheet1, null))
	      .then(function(rows) {
	        hook.res.json({status: 'success!', data});
	      })
	      // .spread(function(rows) {
	      //   console.log('Done deleteing');
	      //   rows[1].Col7 = 'new val2';
	      //   return rows[1].save();
	      // })
	      // .then(console.log.bind(console, 'Done saving'))
	      .catch(function(e) {
	        hook.res.json({status: 'failure :-(', error: err});
	      });
		})
		.catch(function(err) {
			hook.res.json({status: 'failure :-(', error: err});
		});
}
// function upshotTest(hook=null) {
// 	var dev = hook ? false : true;
// 	if (dev) require('dotenv').config();
//
// 	var Spreadsheet = require('google-sheets-node-api');
//
// 	const env = dev ? process.env : hook.env;
//
// 	var sheetId = env.MY_GOOG_SHEET_ID;
// 	var email = env.MY_GOOG_EMAIL;
// 	var key = env.MY_GOOG_KEY;
//
// 	Spreadsheet.load({
// 	  debug: true,
// 	  spreadsheetId: sheetId,
// 	  worksheetName: 'Sheet1',
// 	  oauth : {
// 	    email: email,
// 	    key: key
// 	  }
//
// 	}, sheetReady);
//
// 	function sheetReady(err, spreadsheet) {
// 	  if (err) throw err;
//
// 		spreadsheet.receive(function(err, rows, info) {
// 			const params = hook ? hook.params : {}
// 			const text = params.text ? params.text.split(/ at | with snippet /) : []
//
// 			const data ={
// 				[info.lastRow + 1]: {
// 					1: text[0],
// 					2: text[1],
// 					3: text[2]
// 				}
// 			};
//
// 			spreadsheet.add(data);
//
// 			spreadsheet.send(function(err) {
// 			  if (err) {
// 					if (hook) {
// 						hook.res.json({status: 'failure', error: err})
// 					} else {
// 						throw err;
// 					}
// 				}
//
// 				hook ? hook.res.json({status: 'success!', data}) : console.log(data);
// 			});
// 		});
// 	}
//   // var host = hook.req.host;
// };

// upshotTest()

module['exports'] = upshotTest;
