/*
 * taskTitle-->本地存储的任务数据
 * CpTask-->前端view未完成任务数组
 * OverTask-->前端view已完成数组
 */
var vm = new Vue({
	el:'#app',
	data:{
		task:{
			name:'',
			cp:'false'
		},
		check:true,
		uncheck:false,
		newname:'',
		CpTask:[],//申明空数组。进行数据接收
		OverTask:[]
	},
	mounted:function(){
		this.getLoc();
	},
	methods:{
		getLoc:function(){
			var self = this;
//			var json_data ={"lists":[{"name":"吃饭"},{"name":"睡觉"},{"name":"打豆豆"}]};
			if (window.localStorage) {
				//从本地获取任务的json数据，需要转化才json数据类型
				var json_data = '',
					over_json_data = '';
				/*判断是否有本地储存的任务数据*/
				if (localStorage.getItem("taskTitle")) {
					json_data = JSON.parse(localStorage.getItem("taskTitle"));
					console.log("有存储的taskTitle数据")
				}else{
					console.log("没有存储的taskTitle数据")
					/*没有数据则插入初始数据*/
					json_data={"lists":[{"name":"吃饭","cp":'false'},{"name":"睡觉","cp":'false'},{"name":"打豆豆","cp":'false'}]};
					localStorage.setItem("taskTitle", JSON.stringify(json_data));
//					console.log("没有数据则插入初始数据");
				}
				/*与上面的方式不同，这里是直接定义的json数据，获取长度为json_data.lists.length*/
				for(let i=0,len=json_data.lists.length;i<len;i++){
					//获取之后添加到AllTask数组中，显示在前端
					if(json_data.lists[i].cp=='true'){
						self.OverTask.push(json_data.lists[i]);
					}else{
						self.CpTask.push(json_data.lists[i]);
					}
				}
			} else {
			    alert("您的浏览器不支持本地存储~");	
			}
		},
		AddTask(){
			var self = this;
			var name = self.newname;
			var json_data = JSON.parse(localStorage.getItem("taskTitle"));
			self.task.name = name;
			json_data.lists.push(self.task);
			/*存储在本地setItem，需要转化为字符串类型*/
			localStorage.setItem("taskTitle", JSON.stringify(json_data));
			self.CpTask.push(self.task);
			self.newname='';
		},
		RemoveTask(e){
			var self = this;
			var save = e.target.offsetParent;
			var index = save.id;//获取删除对象的
			var cp = save.getAttribute("dcp");//获取删除对象的cp值，是否完成还是未完成
			var json_data = JSON.parse(localStorage.getItem("taskTitle"));
			if(cp=='false'){
				var name = self.CpTask[index].name;
				self.CpTask.splice(index,1);/*前端页面的移除，splice(下标位置，从这个位置起的个数)*/
				this.removet(name,json_data);/*本地数据的移除*/
			}else{
				var name = self.OverTask[index].name;
				self.OverTask.splice(index,1);/*前端页面的移除，splice(下标位置，从这个位置起的个数)*/
				this.removet(name,json_data);/*本地数据的移除*/
			}
		},
		/*勾选任务-->未完成到已完成，或已完成到未完成*/
		moveTask(e){
			var self = this;
			var save = e.target.offsetParent;
			var index = save.id;//获取删除对象的
			var cp = save.getAttribute("dcp");//获取删除对象的cp值，是否完成还是未完成
			var ncp =false;
			var json_data = JSON.parse(localStorage.getItem("taskTitle"));
			if(cp=='false'){
				let name = self.CpTask[index].name;
				self.CpTask.splice(index,1);
				let data={};
				data.name = name;
				data.cp = 'true';
				self.OverTask.push(data);//有问题，待定
				self.move(name,json_data,ncp);
//				var ind = json_data.lists.indexOft(name);
//				json_data.lists[ind].cp = !cp;
			}else{
				ncp = !ncp;
				let name = self.OverTask[index].name;
				self.OverTask.splice(index,1);
				let data={};
				data.name = name;
				data.cp = 'false';
				self.CpTask.push(data);//有问题，待定
				self.move(name,json_data,ncp);
//				var ind = json_data.lists.indexOft(name);
//				json_data.lists[ind].cp = !cp;
			}
		}
	}
});
Vue.prototype.removet = function(val,jd){//删除函数
	for (var i=0;i<jd.lists.length;i++) {
		if(jd.lists[i].name == val){
			jd.lists.splice(i,1);
			localStorage.setItem("taskTitle", JSON.stringify(jd));
		}
	}
}
Vue.prototype.move = function(val,jd,cp){//移动函数
	for (var i=0;i<jd.lists.length;i++) {
		if(jd.lists[i].name == val){
			if(cp){
				jd.lists[i].cp = 'false';
			}else{
				jd.lists[i].cp = 'true';
			}
			localStorage.setItem("taskTitle", JSON.stringify(jd));
		}
	}
}
console.log("制作 by 天汇https://rogelione.github.io");
