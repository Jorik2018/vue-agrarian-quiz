<template>
	<ion-content :scroll-events="true">
		<v-form style="padding:10px;" class="v-form" :class="o.id<0||(o.tmpId&&!o.synchronized)?'yellow':(o.tmpId?'green':'')" store="poll" action="/api/poll">
			<span class="v-button-top-float" v-on:click="save"><i class="fa fa-save"></i></span>	
			<h2 
			style="padding-left: 34px;margin-bottom:20px;position: relative;font-size: 24px;background-color: transparent;">
			<i class="fa fa-users" style="position: absolute; left: 2px; top: 3px;"></i>
			TIERRA</h2>
			<div><a :href="'/admin/poll/'+o.id">ID={{o.id}}</a></div>
			<v-fieldset legend="¿Cuántos terrenos o parcelas potencialmente productivos posee en la localidad?">
					<label>Localidad:</label>
					<input disabled="disabled" v-model="o.p_1_1"/>
					<label>Cantidad:</label>
					<v-number v-model="o.p_3_2" min="0" max="9"/>
			</v-fieldset>
			<template v-if="o.p_3_2">
			<v-fieldset v-for="i in 1*o.p_3_2" :key="i" :legend="'TERRENO '+i">
				<label>Tenencia:</label>
				<v-select v-model="o['p_3_2_'+i]" >
					<option>--SELECCIONAR--</option>
					<option v-for="(value,key) in options.tenencia" :key="'p_3_2_'+i+'_'+key" :value="key+1">{{value}}</option>
				</v-select>
				<template v-if="o['p_3_2_'+i]">
					<label>Unidad de medida de terreno:</label>
					<v-radio-group v-model="o['p_3_3_'+i]" >
						<v-radio value="M2"/>
						<v-radio value="Hectareas"/>
					</v-radio-group>
					<label>3.4. Distribución del área total del terreno (La suma de total deberá ser el área total del terreno)</label>
					<table width="100%" class="table">
						<tr><td>a. Área con cultivo agrícola o en barbecho</td><td width="80"><v-number v-model="o['p_3_4_'+i+'_1']" 	min="0" v-on:input="p_56(i)" /></td></tr>
						<tr><td>b. Pastos cultivados o forraje</td><td><v-number v-on:input="p_56(i)" v-model="o['p_3_4_'+i+'_2']" min="0"/></td></tr>
						<tr><td>c. Pastos naturales</td><td><v-number v-on:input="p_56(i)" v-model="o['p_3_4_'+i+'_3']" min="0"/></td></tr>
						<tr><td>d. Descanso</td><td><v-number v-on:input="p_56(i)" v-model="o['p_3_4_'+i+'_4']" min="0"/></td></tr>
						<tr><td>e. Zona forestal</td><td><v-number v-on:input="p_56(i)" v-model="o['p_3_4_'+i+'_5']" min="0"/></td></tr>
						<tr><td>f. Área eriaza, improductiva</td><td><v-number v-on:input="p_56(i)" v-model="o['p_3_4_'+i+'_6']" min="0"/></td></tr>
					</table>
					<label>3.5. Tipo de riego que usa para el terreno:</label>
					<v-select v-model="o['p_3_5_'+i]" >
						<option>--SELECCIONAR--</option>
						<option v-for="(value,key) in options.tipoRiego" :key="'p_3_5_'+i+'_'+key" :value="key+1">{{key+1}}. {{value}}</option>
					</v-select>
					<!--agregar nombre medio de riuego-->
					<v-textarea :placeholder="'Nombre '+options.tipoRiego[o['p_3_5_'+i]-1]" style="margin-top:5px;" v-model="o['p_3_5_'+i+'_1']" v-if="o['p_3_5_'+i]>1"/>
					<label>3.6. El sistema de riego que aplica en su terreno es:</label>
					<v-select v-model="o['p_3_6_'+i]" >
						<option>--SELECCIONAR--</option>
						<option v-for="(value,key) in options.sistemaRiego" :key="'p_3_5_'+i+'_'+key" :value="key+1">{{key+1}}. {{value}}</option>
					</v-select>
					<input style="margin-top:10px" v-if="o['p_3_6_'+i]==3" v-model="o['p_3_6_'+i+'_1']"/>
				</template>
			</v-fieldset>
			</template>
		</v-form>
	</ion-content>
</template>
<script>
import {IonContent} from '@ionic/vue';
var axios=window.axios;
export default window._.ui({
	components:{IonContent},
	props:['id'],
	data(){
		return{o:{id:null,synchronized:null,p_101_2:null},options:{
			tenencia:['1. Propia','2.  Alquilada','3. En usufructo (la C.C. le dio)',
			'4. Propio por herencia/sucesión (de padres, suegros, abuelos)','5. Otro (especificar)'],
			tipoRiego:['Con la lluvia (secano)','Río','Quebrada','Manante','Otro (especificar)'],
			sistemaRiego:['Aspersion','Gravedad','Inundaciones Otros (especificar)']
		}}
	},
	created(){
		
	},
	mounted(){
		this.changeRouter();
	},
	methods:{
		intValue(v){
			return parseInt(v);
		},
		process(o){
			o.poll=this.app.poll;
			return o;
		},
		changeRouter(){
			var me=this;
			if(me.id<0){
				me.getStoredList('poll').then((poll)=>{
					poll.forEach(e =>{
						if(e.tmpId==Math.abs(me.id)){me.o=e;me.kk++;}
					});
				});
			}else if(me.id)
				axios.get('/api/poll/'+me.id,{params:{poll:me.app.poll}}).then((d)=>{
					var o=d.data;
					if(o.p_29_2)o.p_29_2=me.pad(o.p_29_2,4);
					if(o.p_29_3)o.p_29_3=me.pad(o.p_29_3,6);
					if(o.p_31_2)o.p_31_2=me.pad(o.p_31_2,4);
					if(o.p_31_3)o.p_31_3=me.pad(o.p_31_3,6);
					me.o=o;
				});
		},
		close(o){
			if(o.data.id)this.o.id=o.data.id;
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