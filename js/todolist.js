//var vm = new Vue({
//	el:'#app',
//	data:{
//		task:{
//			name:''
//		},
//		AllTask:[]//申明空数组。进行数据接收
//	},
//	mounted:function(){
//		this.getData();
//	},
//	methods:{
//		getData:function(){
//			var self = this;
//			this.$http.get("js/task-json.json").then(function (res){
//				console.log(res);
//				//获取当前数组的长度
//				for(var i=0,len=res.body.lists.length;i<len;i++){
//					//已经获取json数组中的数据，接下来如何传递到前端页面中
//					//获取全部数据
//					var selData = res.body.lists[i];
//					//获取数组中的部分数据
//					var part = res.body.lists[i].task;
//					console.log(selData);
//					//将获取的azx数据push到空的数组中itenList，
//					self.AllTask.push(selData);
//				}
//			})
//		},
//		AddTask:function(){
//			this.AllTask.push(this.task);
//			this.task = {name:''}
//		}
//	}
//});
/*LocalStorage的写法，上面是用json数据预留，不好添加和修改*/
var vm = new Vue({
	el:'#app',
	data:{
		task:{
			name:''
		},
		AllTask:[],//申明空数组。进行数据接收
		OverTask:[]
	},
	mounted:function(){
		this.getLoc();
	},
	methods:{
		getLoc:function(){
			var self = this;//上下问，用self来接收，可以防止下面出现匿名作用域
//			var json_data ={"lists":[{"name":"吃饭"},{"name":"睡觉"},{"name":"打豆豆"}]};
			if (window.localStorage) {
				//从本地获取任务的json数据，需要转化才json数据类型
				var json_data = '',
					over_json_data = '';
				/*判断是否有待完成的任务*/
				if (localStorage.getItem("taskTitle")) {
					json_data = JSON.parse(localStorage.getItem("taskTitle"));
					console.log("有存储的taskTitle数据")
				}else{
					console.log("没有存储的taskTitle数据")
					/*没有数据则插入初始数据*/
					json_data={"lists":[{"name":"吃饭"},{"name":"睡觉"},{"name":"打豆豆"}]};
					localStorage.setItem("taskTitle", JSON.stringify(json_data));
//					console.log("没有数据则插入初始数据");
				}
				/*判断是否有已完成的任务，没有则插入空数据*/
				if (localStorage.getItem("OvertaskTitle")) {
					over_json_data = JSON.parse(localStorage.getItem("OvertaskTitle"));
					console.log("有存储的OvertaskTitle数据")
					
				}else{
					console.log("没有存储的OvertaskTitle数据")
					/*没有数据则插入初始数据*/
					over_json_data={"lists":[]};
					localStorage.setItem("OvertaskTitle", JSON.stringify(over_json_data));
//					console.log("没有存储的OvertaskTitle数据");
				}
				/*与上面的方式不同，这里是直接定义的json数据，获取长度为json_data.lists.length*/
				for(var i=0,len=json_data.lists.length;i<len;i++){
					//获取之后添加到AllTask数组中，显示在前端
					self.AllTask.push(json_data.lists[i]);
				}
				for(var j=0,leng=over_json_data.lists.length;j<leng;j++){
					//获取之后添加到AllTask数组中，显示在前端
					console.log("你看得到我嘛？我是列出已完成任务的过程")
					self.OverTask.push(over_json_data.lists[j]);
				}
			} else {
			    alert("不支持本地存储")	
			}
		},
		AddTask:function(){
			var self = this;
			var json_data = JSON.parse(localStorage.getItem("taskTitle"));
			console.log(self.task)
			json_data.lists.push(self.task);
			/*存储在本地setItem，需要转化为字符串类型*/
			localStorage.setItem("taskTitle", JSON.stringify(json_data));
			self.AllTask.push(self.task);
			self.task = {name:''}
		},
		RemoveTask:function(index){
			var self = this;
			/*前端页面的移除，splice(下标位置，从这个位置起的个数)*/
			self.AllTask.splice(index,1);
			/*本地数据的移除，先从本地的数据取出数组删除，之后再添加，暂时想不到其他的办法*/
			var json_data = JSON.parse(localStorage.getItem("taskTitle"));
			json_data.lists.splice(index,1);
			localStorage.setItem("taskTitle", JSON.stringify(json_data));
		},
		RemoveOverTask:function(index){
			var self = this;
			/*前端页面的移除，splice(下标位置，从这个位置起的个数)*/
			self.OverTask.splice(index,1);
			/*本地数据的移除，先从本地的数据取出数组删除，之后再添加，暂时想不到其他的办法*/
			var over_json_data = JSON.parse(localStorage.getItem("OvertaskTitle"));
			over_json_data.lists.splice(index,1);
			localStorage.setItem("OvertaskTitle", JSON.stringify(over_json_data));
		},
		/*将未完成的任务勾选至已完成的列表中*/
		toOverTask:function(index){
			var self = this;
			/*未完成前端页面的移除*/
			self.AllTask.splice(index,1);
			/*未完成的本地数据移除*/
			var json_data = JSON.parse(localStorage.getItem("taskTitle"));
			console.log(json_data.lists);
			/*在移除前先取出*/
			var tempTask = json_data.lists[index];
			console.log("这里是移除未完成的任务的过程，index和数据是:,"+index+","+tempTask.name);
			/*取出之后添加到已完成的前端页面，之后进行本地数据的添加*/
			var over_json_data = JSON.parse(localStorage.getItem("OvertaskTitle"));
			over_json_data.lists.push(tempTask);
			self.OverTask.push(tempTask);
			console.log(over_json_data);
			localStorage.setItem("OvertaskTitle", JSON.stringify(over_json_data));
			json_data.lists.splice(index,1);
			localStorage.setItem("taskTitle", JSON.stringify(json_data));
		},
		toAllTask:function(index){
			var self = this;
			/*已完成的视图的移除*/
			self.OverTask.splice(index,1);
			/*已完成的本地数据移除*/
			var over_json_data = JSON.parse(localStorage.getItem("OvertaskTitle"));
			console.log(over_json_data);
			/*在移除前先取出*/
			var tempTask = over_json_data.lists[index];
			console.log("这里是移除已完成的任务的过程，index和数据是:,"+index+","+tempTask.name);
			/*取出之后添加到已完成的前端页面，之后进行本地数据的添加*/
			var json_data = JSON.parse(localStorage.getItem("taskTitle"));//取出
			json_data.lists.push(tempTask);
			self.AllTask.push(tempTask);//前端页面显示
			console.log(json_data);
			/*添加后增加到本地数据*/
			localStorage.setItem("taskTitle", JSON.stringify(json_data));
			/*未完成任务的本地数据移除*/
			over_json_data.lists.splice(index,1);
			localStorage.setItem("OvertaskTitle", JSON.stringify(over_json_data));
		}
		
	}
});