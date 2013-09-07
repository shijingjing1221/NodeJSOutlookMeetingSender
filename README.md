OutlookMeetingSender
=====

OutlookMeetingSender
基于nodejs的轻量级应用，用到的组件有express, simplesmtp等


部署方法
----------------------------------
1. 下载代码到指定目录
2. 指定目录下运行

		$ npm install -d
    
3. 复制config.js.sample 为 config.js
4. 修改config.js中的设置

6. 可以开始运行程序了

		$ node app.js


一个开发工作的流程
----------------------------------
1. 检查issue列表，找到对应的issue
2. 从develop分支开一个新分支，在这个新分支上完成编码，部署测试，确定是否达成预期目标。
3. 如果issue完成，则将分支合并到develop分支，push到服务器上。完成一个开发工作。


Restful接口列表，遵循极简设计原则
----------------------------------
1. 创建meeting

		url： /meeting
		http method:   post
		lib:  SMTPReminder
		用户通过该接口创建meeting，meeting必须包含以下内容 	
		{ 
			subject: 'Test Bug',
  			description: 'Can\'t create event in http://www.yueke8.cn/',
  			from_name: 'Jingjing',
 			from_address: 'test@163.com',
  			to_name: 'Sjj',
  			to_address: 'test@gmail.com',
  			start_time: '2013-08-30T13:12:26.402Z',
  			end_time: '2013-08-30T13:12:26.402Z',
  			remindTime: '5',
  			location: 'Meeting Room' 
  		}


2. 删除meeting

		url:	/meeting
		http method:	del
		lib:  SMTPReminder
		用户通过该接口可以删除meeting，meeting必须包含以下内容 	
		{ 
			subject: 'Test Bug',
  			description: 'Can\'t create event in http://www.yueke8.cn/',
  			from_name: 'Jingjing',
 			from_address: 'test@163.com',
  			to_name: 'Sjj',
  			to_address: 'test@gmail.com',
  			start_time: '2013-08-30T13:12:26.402Z',
  			end_time: '2013-08-30T13:12:26.402Z',
  			remindTime: '5',
  			location: 'Meeting Room' 
  		}
