<template>
	<ion-content :scroll-events="true" >
		<v-form ref="form" style="padding:10px;" class="v-form" v-bind:class="o.id<0||(o.tmpId&&!o.synchronized)?'yellow':(o.tmpId?'green':'')" 
		store="people" action="/api/poll/people">
			<a class="v-button-top-float" v-on:click="save"><i class="fa fa-save"></i></a>	
			<h2 
			style="margin-right: 50px;padding-left: 34px;margin-bottom:20px;position: relative;font-size: 24px;background-color: transparent;">
			<i class="fa fa-home" style="position: absolute; left: 2px; top: 3px;"></i>2. MIEMBRO DEL HOGAR</h2>
			<div v-bind:class="o.id<0?'yellow':''">
				<a :href="'/admin/poll/'+o.encuesta_id">ENCUESTA={{o.encuesta_id}}</a> > ID={{o.id}}</div>
			<v-fieldset legend="2.1. NOMBRES Y APELLIDOS">
				<input v-model="o.fullName" required="required"/>
				<label>Parentesco:</label>
				<v-radio-group v-model="o.p_2_1_1" >
					<v-radio value="1" label="Jefe/a de hogar"/>
					<v-radio value="2" label="Esposo/a – compañero/a – conviviente del jefe/a de hogar"/>
					<v-radio value="3" label="Hijo/a – Hijastro/a"/>
					<v-radio value="4" label="Yerno/Nuera del jefe/a de hogar"/>
					<v-radio value="5" label="Nieto/a del jefe/a de hogar"/>
					<v-radio value="6" label="Padre o madre"/>
					<v-radio value="7" label="Suegro o suegra"/>
					<v-radio value="8" label="Otro Pariente"/>
					<v-radio value="9" label="Trabajador hogar"/>
					<v-radio value="10" label="Pensionista"/>
					<v-radio value="10" label="Otra perssona no pariente"/>
				</v-radio-group>
			</v-fieldset>
			<v-fieldset legend="2.2. Sexo">
				<v-radio-group v-model="o.p_2_2" >
					<v-radio value="1" label="Masculino"/>
					<v-radio value="2" label="Femenino"/>
				</v-radio-group>
			</v-fieldset>
			<v-fieldset legend="2.3. Edad">
				<v-number v-model="o.p_2_3" required="required"/>
			</v-fieldset>
			<v-fieldset v-if="o.p_2_3>=3" legend="2.4. ¿Sabe leer y escribir?">
				<v-radio-group v-model="o.p_2_4" >
					<v-radio value="1" label="Si"/>
					<v-radio value="0" label="No"/>
				</v-radio-group>
			</v-fieldset>
			<v-fieldset legend="2.5. ¿Hasta que nivel estudió?">
				<v-radio-group v-model="o.p_2_5" >
					<v-radio value="0" label="Sin nivel"/>
					<v-radio value="1" label="Inicial"/>
					<v-radio value="2" label="Primaria"/>
					<v-radio value="3" label="Secundaria"/>
					<v-radio value="4" label="Superior técnico"/>
					<v-radio value="5" label="Superior universitario"/>
					
				</v-radio-group>
			</v-fieldset>
			<v-fieldset v-show="o.p_2_5>3" legend="2.6. ¿Que carrera estudió?">
				<v-textarea v-model="o.p_2_6" maxlength="100" />
			</v-fieldset>
			<template v-if="o.p_2_3>=14">
			<v-fieldset legend="2.7. ¿Trabaja actualmente?">
				<v-radio-group v-model="o.p_2_7" >
					<v-radio value="1" label="Si"/>
					<v-radio value="0" label="No"/>
				</v-radio-group>
			</v-fieldset>
			<v-fieldset legend="2.8. ¿Actualmente busca trabajo?">
				<v-radio-group v-model="o.p_2_8" required="required">
					<v-radio value="1" label="Si"/>
					<v-radio value="0" label="No"/>
				</v-radio-group>
			</v-fieldset>
			<v-fieldset legend="2.9. Su ocupación principal es:">
				<v-radio-group v-model="o.p_2_9">
					<v-radio value="0" label="Agricultura"/>
					<v-radio value="1" label="Ganadería"/>
					<v-radio value="2" label="Comercio"/>
					<v-radio value="3" label="Servicios"/>
					<v-radio value="4" label="Construcción"/>
					<v-radio value="5" label="Minería"/>
					<v-radio value="6" label="Transporte"/>
					<v-radio value="7" label="Artesanía"/>
					<v-radio value="8" label="Otro (especificar)"/>
					<v-textarea v-if="o.p_2_9==8" v-model="o.p_2_9_1" />
				</v-radio-group>
			</v-fieldset>
			<v-fieldset v-if="o.p_2_7>0" legend="2.10. Ingreso mensual">
				<v-number v-model="o.p_2_10" required="required"/>
			</v-fieldset>
			<v-fieldset v-if="o.p_2_9==2||o.p_2_9==2||o.p_2_9==7" legend="2.11. Especificar tipo de negocio">
				<v-textarea v-model="o.p_2_11" />
			</v-fieldset>
			<v-fieldset legend="2.12. ¿Hace cuántos años realiza esta actividad?">
				<v-number v-model="o.p_2_12"/>
			</v-fieldset>
			</template>
			<v-fieldset legend="2.13. ¿Presenta alguna discapacidad?">
				<v-radio-group v-model="o.p_2_13" >
					<v-radio value="1" label="Si"/>
					<v-radio value="0" label="No"/>
				</v-radio-group>
			</v-fieldset>
		</v-form>
	</ion-content>
</template>
<script>
import {IonContent} from '@ionic/vue';
export default window._.ui({
	components:{IonContent},
	props:['id','parent'],
	data(){return{o:{id:null,encuesta_id:null}}},
	created(){
		var me=this;
		me.$on('sync',(data,o)=>{
			me.getStoredList('poll').then((polls)=>{
				polls.forEach(e =>{
					if(o.encuesta_id<0&&e.tmpId==Math.abs(o.encuesta_id)||e.id==o.encuesta_id){
						e.people.forEach((e2,i)=>{
							if(e2.tmpId==o.tmpId)e.people[i]=o;
						});
						window._.db.transaction(['poll'], "readwrite").objectStore('poll').put(e);
					}
				});
			});
		});
		me.$on('stored',(o,data)=>{
			me.getStoredList('poll').then((polls)=>{
				polls.forEach(e =>{
					if(o.encuesta_id<0&&e.tmpId==Math.abs(o.encuesta_id)||e.id==o.encuesta_id){
						delete e.synchronized;
						e.people=data;
						window._.db.transaction(['poll'], "readwrite").objectStore('poll').put(e);
					}
				});
			});
		});
	},
	mounted(){
		var me=this;
		me.$on('stored',(o,data)=>{
			var me=this;
			me.getStoredList('poll').then((polls)=>{
				polls.forEach(e =>{
					if(o.encuesta_id<0&&e.tmpId==Math.abs(o.encuesta_id)||e.id==o.encuesta_id){
						delete e.synchronized;
						e.people=data;
						window._.db.transaction(['poll'], "readwrite").objectStore('poll').put(e);
					}
				});
			});
		});
		me.changeRouter();
	},
	methods:{
		changeRouter(){
			var me=this;
			me.o.encuesta_id=me.parent;
			//es un registro temporal
			if(me.id<0){
				me.getStoredList('people').then((people)=>{
					people.forEach(e =>{
						if(e.tmpId==Math.abs(me.id)){
							if(me.parent)e.encuesta_id=me.parent;
							me.o=e;
						}
					});
				});
			}else if(me.id){
				window.axios.get('/api/poll/people/'+me.id,{params:{poll:me.app.poll}}).then((d)=>{
					me.o=d.data;
				});
			}else if(me.parent<0){
				me.o.tmpId=+new Date();
			}
		},
		process(o){
			o.poll=this.app.poll;
			return o;
		},
		close(o){
			var me=this;
			if(o.data.id)me.o.id=o.data.id;
			if(o.data.tmpId)me.o.tmpId=o.data.tmpId;
			me.$router.replace('/admin/poll/people/'+me.o.encuesta_id+'/'+me.o.id);

		}
	}
});
</script>
<style scope>
	.table input{
		width:100% !important;
	}
	.table td{
		padding:2px;
	}
	.ww > a:not(:last-child){
		margin-bottom:20px;
	}
	.ww > a{
		display:block;
		border:1px solid gray;
		padding:10px;
	}
	.ww span{
		font-size:16px;
		font-weight:bolder;
	}
	.ww i{
		font-size:14px;
		color:gray;
		display:block;
	}
	.ww div{
		display: inline-block;
		width: calc(100% - 100px);
		padding-top: 20px;
		float: left;
	}
	.ww img{
		width:100px;
	}
	img.error{
		padding: 30% !important;
		width: 40% !important;
		background-color: transparent;
	}
	.cart-control > *{
		display:block;
		width:90%;
	}
	.cart-control > *:not(:last-child){
		margin-bottom:10px;
	}
	.controls a:not(:last-child){
		display:inline-block;
		margin-right:10px;
	}
	.product{
		padding:20px;background-color: white;
		position:relative;
	}
	.product-list iframe{
		width:100%;
	}
	.controls{
		position:relative;
	}
	.controls > *:not(:last-child){
		margin-right:10px;
	}
	fieldset > div{
		padding:10px;
	}
	.view{
		margin:15px 0px;
	}
	.inner-scroll{
		--padding:10px;
	}
	.v-fieldset {
		border: 1px solid #0f62ac;
	}
	.v-controls{
		font-size:30px;
	}
</style>