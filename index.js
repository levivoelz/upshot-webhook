var GoogleSpreadsheet = require('google-spreadsheet');
console.log(GoogleSpreadsheet)

function upshotTest(hook) {
	// if (!hook) {
	// 	require('dotenv').config()
	// };


	var async = require('async');
	const env = hook.env; // ? hook.env : process.env;
	const params = hook.params || {}; // ? hook.params : {};
	const text = params.text
		? params.text.split(/ at | with snippet /)
		: ['test name', 'test@email.com', 'test snippet']

	// spreadsheet key is the long id in the sheets URL
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
				if (err) {
					console.log(err)
				}
	      // console.log('Loaded doc: '+info.title+' by '+info.author.email);
	      sheet = info.worksheets[0];
	      // console.log('sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
				hook.res.json({status: 'success', error: step})
	      step();
	    });
	  },

	  function workingWithRows(step) {
	    // google provides some query options
			hook.res.json({status: 'success', error: 'none'})
	    sheet.getRows({
	      // offset: 0,
	      // limit: 0,
	      // orderby: 'col1'
	    }, function( err, rows ){
				if (err) {
					hook.res.json({status: 'failure :-(', error: err})
				}
	      // console.log('Read ' + rows.length + ' rows');
				// console.log('rows: ', rows[0].colname)

				hook.res.json({status: 'success', error: 'none'})
				sheet.addRow({
					name: text[0],
					email: text[1],
					snippet: text[2]
				}, function(err) {
					if (err) {
						hook.res.json({status: 'failure :-(', error: err})
					}

					hook.res.json({status: 'success', error: 'none'})
					// console.log(err)
				})

	      // the row is an object with keys set by the column headers
	      // rows[0].colname = 'new val';
	      // rows[0].save(); // this is async

	      // deleting a row
	      // rows[0].del();  // this is async

	      step();
	    });
	  }

	  // function workingWithCells(step) {
	  //   sheet.getCells({
	  //     'min-row': 1,
	  //     'max-row': 5,
	  //     'return-empty': true
	  //   }, function(err, cells) {
	  //     var cell = cells[0];
	  //     console.log('Cell R'+cell.row+'C'+cell.col+' = '+cells.value);
		//
	  //     // cells have a value, numericValue, and formula
	  //     cell.value == '1'
	  //     cell.numericValue == 1;
	  //     cell.formula == '=ROW()';
		//
	  //     // updating `value` is "smart" and generally handles things for you
	  //     cell.value = 123;
	  //     cell.value = '=A1+B2'
	  //     cell.save(); //async
		//
	  //     // bulk updates make it easy to update many cells at once
	  //     cells[0].value = 1;
	  //     cells[1].value = 2;
	  //     cells[2].formula = '=A1+B1';
	  //     sheet.bulkUpdateCells(cells); //async
		//
	  //     step();
	  //   });
	  // }//,
		//
	  // function managingSheets(step) {
	  //   doc.addWorksheet({
	  //     title: 'my new sheet'
	  //   }, function(err, sheet) {
		//
	  //     // change a sheet's title
	  //     sheet.setTitle('new title'); //async
		//
	  //     //resize a sheet
	  //     sheet.resize({rowCount: 50, colCount: 20}); //async
		//
	  //     sheet.setHeaderRow(['name', 'age', 'phone']); //async
		//
	  //     // removing a worksheet
	  //     sheet.del(); //async
		//
	  //     step();
	  //   });
	  // }
	]);
}

// function upshotTest(hook=null) {
// 	var GoogleSpreadsheet = require("google-sheets-node-api");
// 	const env = hook ? hook.env : process.env
// 	var mySheet = new GoogleSpreadsheet(env.MY_GOOG_SHEET_ID);
// 	var creds = {
// 		client_email: env.MY_GOOG_EMAIL,
// 		private_key: env.MY_GOOG_KEY
// 	};
//
// 	// hook.res.json({status: 'failure :-(', error: hook.env.MY_GOOG_SHEET_ID})
//
// 	mySheet.useServiceAccountAuth(creds)
// 		.then(mySheet.getSpreadsheet.bind(mySheet))
// 		.then(function(sheetInfo) {
// 			console.log(sheetInfo)
// 	    var sheet1 = sheetInfo.worksheets[0];
// 	 		var data = {Col1: 'Val1', Col2: 'Val2', Col3:'Val3', Col4: 'Val4', Col5: 'Val5', Col6: 'Val6', Col7: 'Val7'};
//
// 	    sheet1.addRow(data)
// 	      // .then(sheet1.getRows.bind(sheet1, null))
// 				.then(function(rows) {
//             return [rows, rows[0].del()];
//         })
//         .spread(function(rows) {
//             console.log('Done deleteing');
//             rows[1].Col7 = 'new val2';
//             return rows[1].save();
//         })
//         .then(console.log.bind(console, 'Done saving'))
//         .catch(function(e) {
//             console.error(e);
//         });
// 		})
// 		.catch(function(err) {
// 			throw err;
// 			// hook.res.json({status: 'failure :-(', error: err});
// 		});
// }
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

module.exports = upshotTest;
