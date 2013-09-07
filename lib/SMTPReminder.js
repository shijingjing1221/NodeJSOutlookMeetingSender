var md5 = require("blueimp-md5/js/md5").md5,
    simplesmtp = require("simplesmtp"),
    config = require('../config');

exports.sendMeetingBySMTP = function(method, meetingInfo, cb){
if(remindTime == undefined || remindTime == null){
    remindTime = 15;
}

var from_name = meetingInfo.from_name, from_address = meetingInfo.from_address;
var to_name = meetingInfo.to_name, to_address = meetingInfo.to_address; 
var st = new Date(meetingInfo.start_time), et = new Date(meetingInfo.end_time); 
var location = meetingInfo.location;
var subject = meetingInfo.subject, description = meetingInfo.subject; 
var remindTime = (meetingInfo.remindTime)?(meetingInfo.remindTime):15;
start_time = st.toISOString().replace(/-/g, '').replace(/:/g, '').replace(/\.\d+/, '');
end_time = et.toISOString().replace(/-/g, '').replace(/:/g, '').replace(/\.\d+/, '');
var uid = md5(from_address + to_address + start_time + end_time);
var now = new Date();
var now_format = now.toISOString().replace(/-/g, '').replace(/:/g, '').replace(/\.\d+/, '');
if(typeof(description) == 'undefined' || description == null){
    description = "This is a soft reminder.";
}

var mime_boundary = "----Meeting Booking----"+ md5(now.valueOf());

var headers = "From: " +from_name +" <"+ from_address+">\n";
headers += "Reply-To: "+from_name+" <"+ from_address +">\n";
headers += "MIME-Version: 1.0\n";
headers += "Content-Type: multipart/alternative; boundary=\""+mime_boundary+"\"\n";
headers += "Content-class: urn:content-classes:calendarmessage\n";

//Create Email Body (HTML)
var message = "--"+mime_boundary+"\r\n";
message += "Content-Type: text/html; charset=UTF-8\n";
message += "Content-Transfer-Encoding: 8bit\n\n";
message += "<html>\n";
message += "<body>\n";
message += '<p>Dear '+to_name+',</p>';
message += '<p>'+description+'</p>';
message += 'Thanks,<br />'+from_name+'\n';
message += "</body>\n";
message += "</html>\n";
message += "--"+mime_boundary+"\r\n";

//status / url / recurid /

var ical = 'BEGIN:VCALENDAR' + "\r\n" +
'PRODID:-//Microsoft Corporation//Outlook 10.0 MIMEDIR//EN' + "\r\n" +
'VERSION:2.0' + "\r\n";
if(method == 'setup'){
	ical += 'METHOD:REQUEST' + "\r\n";
}else if(method == "cancel"){
	ical += 'METHOD:CANCEL' + "\r\n";
}

ical += 'BEGIN:VEVENT' + "\r\n" +
'ORGANIZER;CN="' + from_name + '":MAILTO:'+from_address+ "\r\n" +
'ATTENDEE;CN="'+to_name+'";ROLE=REQ-PARTICIPANT;RSVP=TRUE:MAILTO:'+to_address+"\r\n" +
'LAST-MODIFIED:' + now_format + "\r\n" +
'UID:'+ uid +"\r\n" +
'DTSTART:'+start_time+ "\r\n" +
'DTEND:'+end_time+ "\r\n" +
'TRANSP:OPAQUE'+ "\r\n" +
'SEQUENCE:1'+ "\r\n" +
'SUMMARY:' + subject + "\r\n" +
'LOCATION:' + location + "\r\n" +
'CLASS:PUBLIC'+ "\r\n" +
'PRIORITY:5'+ "\r\n" +
'BEGIN:VALARM' + "\r\n" +
'TRIGGER:-PT'+ remindTime +'M' + "\r\n" +
'ACTION:DISPLAY' + "\r\n" +
'DESCRIPTION:Reminder' + "\r\n" +
'END:VALARM' + "\r\n";

if(method == "cancel"){
	ical += "STATUS:CANCELLED\r\n";
}
ical +='X-WR-RELCALID:'+ "THISISENGLISHCLASSREMINDERPID\r\n" +
'END:VEVENT'+ "\r\n" +
'END:VCALENDAR'+ "\r\n";
message += 'Content-Type: text/calendar;name="meeting.ics";method=REQUEST\n';
message += "Content-Transfer-Encoding: 8bit\n\n";
message += ical;
message +="\r\n\r\n";
message += "--"+mime_boundary+"--\r\n\r\n";
var whole_contents = headers + "\r\n" + message;

console.log(whole_contents);

var client = simplesmtp.connect(config.reminder.smtp_port,
    config.reminder.smtp_host,
    {
        'secureConnection': true,
        auth: {
            "user":config.reminder.gmail_user,
            "pass":config.reminder.gmail_pass
        }
    });

client.once("idle", function(){
    client.useEnvelope({
        from: config.reminder.gmail_user,
        to: [ to_address ]
    });
});

client.on("rcptFailed", function(addresses){
    console.log("The following addresses were rejected: ", addresses);
});

client.on("message", function(){
    client.write(whole_contents);
    client.end();
});

client.on("ready", function(success, response){
    if(success){
        console.log("The message was transmitted successfully with "+response);
    }
    cb("success");
    client.quit();
});
}