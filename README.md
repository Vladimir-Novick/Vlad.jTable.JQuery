# Vlad.jTable.JQuery

Modified Version jTable  JQuery plugin ( jTable.org )

![screenshot](https://raw.githubusercontent.com/Vladimir-Novick/Vlad.jTable.JQuery/master/screenshots/screen.png)

## CHANGELOG:

29.11.2017

  Added refresh buttons:

  *  Refresh Page  ![refresh page](https://raw.githubusercontent.com/Vladimir-Novick/Vlad.jTable.JQuery/master/screenshots/refresh_page.png) 
  *  Refresh Row  ![refresh page](https://raw.githubusercontent.com/Vladimir-Novick/Vlad.jTable.JQuery/master/screenshots/refresh_button.png) 
  
 . When user click ot the button , it updates current page/row using AJAX .
 
 Refresh row definition:
     action:

            refreshRowAction   - create refresh row button and define refresh row action

            for example :
                actions: {
                    refreshRowAction: '/StatusQuery/RefreshRow',
                          listAction: '/StatusQuery/GetQueList'
 
4.12.2017
 
      Added ability describe table column width in pixel size. 
	  
	  For example:
	     
             },
                Total: {
                    title: 'Total',
                    sorting: true,
                    width: '80px'
                },

5.12.2017

	Added number data type 
	   For example:
	   
	            ),
                Count: {
                    title: 'Queues',
                    key: false,
                    sorting: true,
                    width: '80px',
                    type: 'number'
                }
				
11.12.2017

       custom javascript action for table tr

                for example :
                     actions: {
                       refreshRowAction: '/StatusQuery/RefreshRow',
                             listAction: '/StatusQuery/GetQueList',
                     customRowOperation: makeRowCSS  //  where makeRowCSS(table_tr_object) - javascript function

       custom showing page message

             for example :
                   actions: {
                       refreshRowAction: '/StatusQuery/RefreshRow',
                             listAction: '/StatusQuery/GetQueList',
                     customRowOperation: makeRowCSS,  //  where makeRowCSS(table_tr_object) - javascript function
                         customShowInfo: showPageInfo  //  where showPageInfo(stringMessage) - javascript function 				

07.06.2018

		dynamic data refresh 
		
		for example:
		
		     actions: {
                refreshRowAction: '/DataQuery/GetServicesRow',
                refreshDataAction: '/DataQuery/GetServicesData',
                listAction: '/DataQuery/GetServicesList',
				
				<a id="refresh" href="#" class="btn btn-info" onclick="DataRefresh(); return false;"> Status</a>

				const DataRefresh = () => ) {
					$('#ActivitiesTableContainer').jtable('data_refresh');
				}
				
08.06.2018

     HTML5 Asynchronous JavaScript support

Example:

job_worker.js 	 file:
	 
	    /* HTML5 Web Worker function */

        const worker_ajax = (url, data, callback, type) => {

		var data_array, data_string, idx, req, value;
		if (data === null || typeof (data) === "undefined") {
			data = {};
		}

		if (callback === null || typeof (callback) === "undefined" ) {
			callback = function () { };
		}
		if (type === null || typeof (type) === "undefined") {
			type = 'GET';
		}
		data_array = [];
		for (idx in data) {
			value = data[idx];
			data_array.push("" + idx + "=" + value);
		}
		data_string = data_array.join("&");
		req = new XMLHttpRequest();
		req.open(type, url, false);
		req.setRequestHeader("Content-type", "application/json");
		req.onreadystatechange = function () {
			if (req.readyState === 4 && req.status === 200) {
				return callback(req.responseText); 
			}
		};
		req.send(data_string);
		return req;
	};

	const GetAllStatusesProcess = () => {

		worker_ajax("/DataQuery/GetAllStatusesProcess", { 'send': true }, function (data) {
			postMessage(data);
		}, 'POST');

		setTimeout("GetAllStatusesProcess()", 2000);
	}

	GetAllStatusesProcess();
	
	
JTable onLoad definition :

        /*
         * Load HTML 5 Async worker
        */
        $('#ActivitiesTableContainer').jtable('load', undefined, function () {
            if (typeof (worker) === "undefined" || worker === null ) {
                worker = new Worker("../js/job_workers.js");  // create html5 worker object
                worker.onmessage = function (event) { // get message from async worker
                    var data = event.data;
                    refreshStatusLines(data); 
                };
            }
        });
		
		    function refreshStatusLines(data) {
				$('#ActivitiesTableContainer').jtable('completeRefresh', 
				         JSON.parse(data)); // refresh exist fields 
			}
