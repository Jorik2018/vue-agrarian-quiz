<template>
	<v-form header="Monitores4" style="position:relative;" action="/api/poll/supervisor">
		<v-table ref="tm"
		src="/api/poll/supervisor"
v-on:row-select="rss"
		v-on:updated="app.bindLinks($el)">
			<template v-slot:default="{row}"> 
				<td width="80" class="center">{{pad(row.id,4)}}</td>
				<td width="300">{{row.diplayName}}</td> 
				<td width="140" class="center"> {{row.people?row.people.length:0}}</td>
				<td width="120" class="center"> {{row.tmpId|date}} </td> 
			</template> 
			<template v-slot:columns="">
				<td width="80" class="center" header="ID"></td>
				<td width="300" header="IDENTIFICACION MUESTRAL"></td>
				<td width="140" header="MIEMBROS"></td>
				<td width="120" header="FECHA"></td>
			</template>
		</v-table>
		<span class="v-cart" v-on:click="ss" style="color:white;position:abolute;right:10px;float:right;">kkk
			<span><i class="fa fa-plus"></i></span>
		</span>
	</v-form>
</template>
<script>
	export default window.ui({
		props:['src'],
		computed:{
			filter(){
				console.log(window.app.session.rol);
				var p={},me=this;
				if(me.query){
					p.query=me.query;
				}
				return p;
			}
		},
		data(){return {rowSelectedCount2:0,page:0,data:[],mode:0,query:null}},
		updated(){
			window.app.bindLinks(this.$el);
		},
		created(){
			this.changeRoute();
			if (!window._.indexedDB)window._.MsgBox('dbi no suported');
			
			this.$on('sync',function(dr,dl){
				if(dr.people&&dl.people){
					for(var ki=0;ki<dr.people.length;ki++){
						for(var kj=0;kj<dl.people.length;kj++){
							if(dl.people[kj].tmpId==dr.people[ki].tmpId){
								if(dr.people[ki].id){
									dl.people[kj].id=dr.people[ki].id;
									dl.people[kj].synchronized=1;
								}
								if(dr.people[ki].encuesta_id){
									dl.people[kj].encuesta_id=dr.people[ki].encuesta_id;
									dl.people[kj].parent=dr.people[ki].encuesta_id;
								}
								console.log(dl.people[kj]);
							}
						}
					}
				}
			});
		},
		methods:{
			ss(){
				var me=this;
				me.$refs.tm.load();
				alert(12);
			},
			rss(e){
				e=e.selection;
				this.rowSelectedCount2=e?e.length:0;
			},
			changeRoute(){
				window.app.title='Tiendas';window.logo=require('@/fs/images/shami-icon-blue.svg');
			}
		}
	});
</script>
<style scope>
	img.error{
		padding: 40px !important;
		width: calc(100% - 80px) !important;
		background-color: transparent;
	}
	a{
		display:inline-block;
	}
	.controls a:not(:last-child){
		display:inline-block;
		margin-right:0px;
	}
	.store-list{
		background-color: rgb(240, 240, 240);padding: 20px;
	}
	.store{
		padding: 0px;
		background-color: white;
		position:relative;
		width: calc(100% - 0px);
	}
	.store:not(:last-child){
		margin-bottom:20px;
	}
	.store img{
		width: 60%;
		margin: 0 auto !important;
		border: 0;
	}
	.store-info .controls{
		position:absolute;
		top:0px;
		right:-10px;
	}
	.v-no-results {
		background: white !important;
	}
</style>