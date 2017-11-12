/*
 * taskTitle-->本地存储的任务数据
 * CpTask-->前端view未完成任务数组
 * OverTask-->前端view已完成数组
 */
console.log("https://rogelione.github.io/")
var vm = new Vue({
	el:'#app',
	data:{
		task:{
			name:'',
			cp:false,
			disabled:true,
			edit:true,
			ms:false
		},
		undisabled:true,
		newname:'',
		editname:'',
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
					json_data={"lists":[
						{"name":"吃饭","cp":false},
						{"name":"睡觉","cp":false},
						{"name":"打豆豆","cp":false}
						]};
					localStorage.setItem("taskTitle", JSON.stringify(json_data));
//					console.log("没有数据则插入初始数据");
				}
				/*与上面的方式不同，这里是直接定义的json数据，获取长度为json_data.lists.length*/
				for(let i=0,len=json_data.lists.length;i<len;i++){
					//获取之后添加到数组中，显示在前端
					let data = {"disabled":true,"edit":true,"ms":false};
						data.name = json_data.lists[i].name;
						data.cp = json_data.lists[i].cp;
					if(json_data.lists[i].cp){
						
						self.OverTask.push(data);
					}else{
						console.log(data.name)
						self.CpTask.push(data);
					}
				}
			} else {
			    alert("您的浏览器不支持本地存储~");	
			}
		},
		AddTask(){//添加任务
			var self = this;
			var name = self.newname;
			if(name.trim()!=''){
				let data = {};
				data.name = name;
				data.cp = false;
				self.task.name = name;
				var json_data = JSON.parse(localStorage.getItem("taskTitle"));
				json_data.lists.push(data);
				/*存储在本地setItem，需要转化为字符串类型*/
				localStorage.setItem("taskTitle", JSON.stringify(json_data));
				self.CpTask.push(self.task);
				self.newname='';
				}else{
					alert('还是输入您的任务吧！')
				}
			},
		RemoveTask(index,name){//移除任务
			var self = this;
			var json_data = JSON.parse(localStorage.getItem("taskTitle"));
			var indexA = self.indexOf(name,json_data);//在所以任务里的位置
			var cp = json_data.lists[indexA].cp; //取得任务的cp值，判断是否完成
			if(cp){
				self.OverTask.splice(index,1);/*前端页面的移除，splice(下标位置，从这个位置起的个数)*/
				self.removet(name,json_data);/*本地数据的移除*/
			}else{
				self.CpTask.splice(index,1);
				self.removet(name,json_data);
			}
		},
		moveTask(index,name){/*勾选任务-->未完成到已完成，或已完成到未完成*/
			var self = this;
			var json_data = JSON.parse(localStorage.getItem("taskTitle"));
			var indexA = self.indexOf(name,json_data);//在所以任务里的位置
			if(indexA == -1){
				alert('请点击确认,修改成功后可移动任务!');
			}else{
			var cp = json_data.lists[indexA].cp; //取得任务的cp值，判断是否完成
			if(cp){
				self.OverTask.splice(index,1);
				let data = {"disabled":true,"edit":true,"ms":false};
				data.name = name;
				data.cp = !cp;
				self.CpTask.push(data);
				self.move(name,json_data,cp);
			}else{
				self.CpTask.splice(index,1);
				let data = {"disabled":true,"edit":true,"ms":false};
				data.name = name;
				data.cp = !cp;
				self.OverTask.push(data);
				self.move(name,json_data,cp);
			}
			}
		},
		ToEditTask(index){
			var self = this;
			self.CpTask[index].disabled = !self.CpTask[index].disabled;
			self.CpTask[index].edit = !self.CpTask[index].edit;
			self.CpTask[index].ms = !self.CpTask[index].ms;
			self.focus = !self.focus;
			console.log(self.focus)
			self.editname = self.CpTask[index].name;//把修改前的值存如，为确实修改传值
		},
		EditTask(index,qname){//qname为修改后的值
			if(qname.trim()==''){
				alert('您的任务哪去了？咋是空的？')
			}else{
				var self = this;
				var wname = self.editname;//wname为还未修改后的值，点击编辑时存的值
				var json_data = JSON.parse(localStorage.getItem("taskTitle"));
				var ind = this.indexOf(wname,json_data);
				json_data.lists[ind].name = qname;
				localStorage.setItem("taskTitle", JSON.stringify(json_data));
				self.CpTask[index].edit = !self.CpTask[index].edit;
				self.CpTask[index].ms = !self.CpTask[index].ms;
				self.CpTask[index].disabled = !self.CpTask[index].disabled;
				self.focus = !self.focus;
			}
		}
	}
});
Vue.prototype.removet = function(val,jd){//本地任务数据删除函数
	var index = this.indexOf(val,jd);
	jd.lists.splice(index,1);
	localStorage.setItem("taskTitle", JSON.stringify(jd));
}
Vue.prototype.indexOf = function(val,jd){//查询本地任务数据的所在下标
	for (var i=0;i<jd.lists.length;i++) {
		if(jd.lists[i].name == val){
			return i;
		}
	}
	return -1;
}
Vue.prototype.move = function(val,jd,cp){//移动任务数据函数(修改本地任务的cp值)
	var index = this.indexOf(val,jd);
	jd.lists[index].cp = !cp;
	localStorage.setItem("taskTitle", JSON.stringify(jd));
}

