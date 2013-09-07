var outLookServiceClient = require('../lib/SMTPReminder.js');

/*
 * create meeting
 */
exports.create = function(req, res) {
	console.log(req.body);
	outLookServiceClient.sendMeetingBySMTP("setup", req.body, function(outlookServer_res) {
		if (outlookServer_res == "success") {
			res.send({
				status: "ok"
			});
		} else {
			res.send({
				status: "failed"
			});
		}

	});
};

/*
 * cancel meeting
 */
exports.del = function(req, res) {
	outLookServiceClient.sendMeetingBySMTP("cancel", req.body, function(outlookServer_res) {
		if (outlookServer_res == "success") {
			res.send({
				status: "ok"
			});
		} else {
			res.send({
				status: "failed"
			});
		}

	});
};