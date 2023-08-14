<template>
	<ion-content :scroll-events="true">
		<v-form style="padding:10px;" class="v-form" :class="o.id<0||(o.tmpId&&!o.synchronized)?'yellow':(o.tmpId?'green':'')" store="poll" action="/api/poll">
			<a class="v-button-top-float" v-on:click="save"><i class="fa fa-save"></i></a>	
			<h2 
			style="margin-right: 50px;padding-left: 34px;margin-bottom:20px;position: relative;font-size: 24px;background-color: transparent;">
			<i class="fa fa-home" style="position: absolute; left: 2px; top: 3px;"></i>2. VIVIENDA</h2>
			<div><a :href="'/admin/poll/'+o.id">ID={{o.id}}</a></div>
			<template v-if="o.hogar!=1">
				Hogar={{o.hogar}}, es un numero mayor de 1 por lo que pertenece a la misma vivienda.
			</template>
			<template v-else>
				<v-fieldset legend="2.14. ¿SU VIVIENDA ES?">
					<v-radio-group v-model="o.p_2_14" >
						<v-radio value="1" label="Propia"/>
						<v-radio value="2" label="Alquilada"/>
						<v-radio value="3" label="En usufructo"/>
						<v-radio value="4" label="Otro (especificar)"/>
						<v-textarea v-if="o.p_2_14==4" maxlength="100" v-model="o.p_2_14_1"/>
					</v-radio-group>
				</v-fieldset>
				<v-fieldset legend="2.15. ¿Cuenta con titulo de propiedad?">
					<v-radio-group v-model="o.p_2_15" >
						<v-radio value="1" label="Si"/>
						<v-radio value="0" label="No"/>
					</v-radio-group>
				</v-fieldset>
				<v-fieldset legend="2.16. ¿El abastecimiento de agua es?">
					<v-radio-group v-model="o.p_2_16" >
						<v-radio value="1" label="Red pública"/>
						<v-radio value="2" label="Acequia o canal"/>
						<v-radio value="3" label="Manantial, río, quebrada"/>
						<v-radio value="4" label="Otro (especificar)"/>
						<v-textarea v-if="o.p_2_16==4" v-model="o.p_2_16_1" maxlength="100"/>
					</v-radio-group>
				</v-fieldset>
				<v-fieldset legend="2.17. ¿El servicio higienico de su hogar utiliza?">
					<v-radio-group v-model="o.p_2_17" >
						<v-radio value="1" label="Red pública o desagüe"/>
						<v-radio value="2" label="Pozo ciego (letrina)"/>
						<v-radio value="3" label="Pozo séptico"/>
						<v-radio value="4" label="Campo abierto"/>
						<v-radio value="5" label="Otro (especificar)"/>
						<v-textarea v-if="o.p_2_17==5" v-model="o.p_2_17_1"/>
					</v-radio-group>
				</v-fieldset>
				<v-fieldset legend="2.18. Tipo de alumbrado">
					<v-radio-group v-model="o.p_2_18" > 
						<v-radio value="1" label="Eléctrico por red pública"/>
						<v-radio value="2" label="Panel solar"/>
						<v-radio value="3" label="Lámpara"/>
						<v-radio value="4" label="Vela"/>
						<v-radio value="5" label="Otro (especificar)"/>
						<v-textarea v-if="o.p_2_18==5" v-model="o.p_2_18_1"/>
					</v-radio-group>
				</v-fieldset>
				<v-fieldset legend="2.19. Material predominante en paredes">
					<v-radio-group v-model="o.p_2_19" >
						<v-radio value="1" label="Adobe"/>
						<v-radio value="2" label="Tapia"/>
						<v-radio value="3" label="Ladrillo"/>
						<v-radio value="4" label="Otro (especificar)"/>
						<v-textarea v-if="o.p_2_19==4" v-model="o.p_2_19_1"/>
					</v-radio-group>
				</v-fieldset>
				<v-fieldset legend="2.20. Material predominante en piso">
					<v-radio-group v-model="o.p_2_20" >
						<v-radio value="1" label="Tierra"/>
						<v-radio value="2" label="Cemento"/>
						<v-radio value="3" label="Empedrado"/>
						<v-radio value="4" label="Madera"/>
						<v-radio value="5" label="Otro (especificar)"/>
						<v-textarea v-if="o.p_2_20==5" v-model="o.p_2_20_1" maxlength="100"/>
					</v-radio-group>
				</v-fieldset>
				<v-fieldset legend="2.21. Material predominante en techo">
					<v-radio-group v-model="o.p_2_21" >
						<v-radio value="1" label="Plancha de calamina/cemento"/>
						<v-radio value="2" label="Paja"/>
						<v-radio value="3" label="Concreto armado"/>
						<v-radio value="4" label="Otro (especificar)"/>
						<v-textarea v-if="o.p_2_21==4" v-model="o.p_2_21_1" maxlength="100"/>
					</v-radio-group>
				</v-fieldset>
				<v-fieldset legend="2.22. Recibe ayuda social de algún programa del estado">
					
						<v-checkbox v-model="o.p_2_22_1" label="Penion 65"/>
						<v-checkbox v-model="o.p_2_22_2" label="Juntos"/>
						<v-checkbox v-model="o.p_2_22_3" label="vaso de leche"/>
						<v-checkbox v-model="o.p_2_22_4" label="SIS"/>
						<v-checkbox v-model="o.p_2_22_5" label="Qalliwarma"/>
						<v-checkbox v-model="o.p_2_22_6" label="Comedor popular"/>
						<v-checkbox v-model="o.p_2_22_7" label="Contigo"/>
						<v-checkbox v-model="o.p_2_22_8" label="Bono COVID 19 hogares"/>
		
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
	data(){return{o:{id:null,synchronized:null},count:0}},
	mounted(){
		this.changeRouter();
	},
	methods:{
		changeRouter(){
			var me=this;
			if(me.id<0){
				me.getStoredList('poll').then((poll)=>{
					poll.forEach(e =>{
						if(e.tmpId==Math.abs(me.id)){
							me.o=e;me.kk++;
						}
					});
				});
			}else if(me.id)
				axios.get('/api/poll/'+me.id,{params:{poll:me.app.poll}}).then((d)=>{
					me.o=d.data;
				});
		},
		process(o){
			o.poll=this.app.poll;
			return o;
		},
		close(o){
			if(o.id)this.o.id=o.id;
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