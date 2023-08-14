<template>
	<ion-content :scroll-events="true">
		<v-form style="padding:10px;" class="v-form" v-bind:class="o.id<0?'yellow':(o.tmpId?'green':'')" store="poll" action="/api/poll">
			<span class="v-button-top-float" v-on:click="save"><i class="fa fa-save"></i></span>
			<h2 
			style="padding-left: 34px;margin-bottom:20px;position: relative;font-size: 24px;background-color: transparent;">
			<i class="fa fa-tree" style="position: absolute; left: 2px; top: 3px;"></i>4. ACTIVIDAD AGRÍCOLA</h2>
			<div><a :href="'/admin/poll/'+o.id">ID={{o.id}}</a></div>
			<v-fieldset legend="4.1 En los últimos 12 meses ¿Obtuvo producción agrícola?">
				<v-radio-group v-model="o.p_4_1" >
					<v-radio value="1" label="Si"/>
					<v-radio value="0" label="No"/>
				</v-radio-group>
			</v-fieldset>
			<template v-if="o.p_4_1==1">
				<v-fieldset legend="PRINCIPALES CULTIVOS SEGÚN ORDEN DE IMPORTANCIA">
					<div v-for="i in 6" :key="'f_4_1_'+i">
						<label>Cultivo {{i}}</label>
						<input v-model="o['p_4_2_'+i]">
						<v-fieldset v-if="o['p_4_2_'+i]" v-bind:legend="'PREGUNTAS para '+o['p_4_2_'+i]" closable="true">
							<label>Cantidad que Produjo</label>
							<input v-model="o['p_4_2_'+i+'_b']"/>
							<label>Equivalencia en kg.</label>
							<v-number v-model="o['p_4_2_'+i+'_c']"/>
							<v-fieldset legend="4.3. ¿Superficie sembrada? no debe superar unidad dede ser combo metros hectareas">
								<v-number v-model="o['p_4_3_'+i]"/>
								<label>Unidad</label>
								<v-select v-model="o['p_4_3_'+i+'_u']">
									<option>--SELECCIONAR--</option>
									<option value="M2">M2</option>
									<option value="HA">HA</option>
								</v-select>
							</v-fieldset>
							<v-fieldset legend="4.4. ¿Superficie cosechada? debe ser menor q superficie sembrada">
								<v-number v-model="o['p_4_4_'+i]"/>
								<div style="background:yellow" v-if="Number(o['p_4_4_'+i])>Number(o['p_4_3_'+i])">Superficie cosechada debe ser menor que Superficie sembrada</div>
								<label>Unidad</label>
								<v-select v-model="o['p_4_4_'+i+'_u']">
									<option>--SELECCIONAR--</option>
									<option value="M2">M2</option>
									<option value="HA">HA</option>
								</v-select>
							</v-fieldset>
							<v-fieldset legend="4.5. Destino de la produccion (Kg)">
								<table width="100%" class="table">
									<tr><td>Auto consumo</td><td width="80"><v-number v-model="o['p_4_5_'+i+'_1']"/></td></tr>
									<tr><td>Subproductos</td><td><v-number v-model="o['p_4_5_'+i+'_2']"/></td></tr>
									<tr><td>Semilla</td><td><v-number v-model="o['p_4_5_'+i+'_3']"/></td></tr>
									<tr><td>Al partir</td><td><v-number v-model="o['p_4_5_'+i+'_4']"/></td></tr>
									<tr><td>Pérdida</td><td><v-number v-model="o['p_4_5_'+i+'_5']"/></td></tr>
									<tr><td>Venta</td><td><v-number v-model="o['p_4_5_'+i+'_6']"/></td></tr>
									<tr><td>Otro (trueque, regalo, etc)</td><td><v-number v-model="o['p_4_5_'+i+'_7']"/></td></tr>
								</table>
							</v-fieldset>
							<v-fieldset v-if="o['p_4_5_'+i+'_6']>0" legend="4.6. ¿A cuánto lo vendió?">
								<label>Precio por unidad</label>
								<input v-model="o['p_4_6_'+i+'_1']"/>
								<label>Precio por kg.</label>
								<v-number v-model="o['p_4_6_'+i+'_2']"/>
							</v-fieldset>
						</v-fieldset>
					</div>
				</v-fieldset>
				<v-fieldset v-if="hasSubproduct" legend="4.7. CARACTERISTICAS DE LOS SUB PRODUCTOS">
					<div v-for="i in 5" :key="'f_4_7_'+i">
						<label>Sub Producto {{i}}</label>
						<input v-model="o['p_4_7_'+i]"/>
						<v-fieldset v-if="o['p_4_7_'+i]" v-bind:legend="'PREGUNTAS DE '+o['p_4_7_'+i]" closable="true">
							<label>Producción total (kg/lt)</label>
							<v-number v-model="o['p_4_7_'+i+'_1']"/>
							<label>Producción venta (kg/lt)</label>
							<v-number v-model="o['p_4_7_'+i+'_2']"  v-on:input="calculateTotal(i)"/>
							<template v-if="o['p_4_7_'+i+'_2']>0">
								<label>Precio</label>
								<v-number v-model="o['p_4_7_'+i+'_3']" v-on:input="calculateTotal(i)"/>
								<label>Ingreso por venta (Total)</label>
								<v-number disabled="disabled" v-model="o['p_4_7_'+i+'_4']"/>
							</template>
						</v-fieldset>
					</div>
				</v-fieldset>
				<v-fieldset v-if="hasVenta" legend="4.8. ¿Dónde comercializa habitualmente sus productos/ subproductos agrícolas?">
					<v-radio-group v-model="o.p_4_8" >
						<v-radio value="0" label="No comercializa"/>
						<v-radio value="1" label="Mercado - Lugar"/>
						<v-textarea v-if="o.p_4_8==1" v-model="o.p_4_8_1"/>
						<v-radio value="2" label="Feria - Lugar"/>
						<v-textarea v-if="o.p_4_8==2" v-model="o.p_4_8_2"/>
						<v-radio value="3" label="En su parcela"/>
						<v-radio value="4" label="Otros (especificar)"/>
						<v-textarea v-if="o.p_4_8==4" v-model="o.p_4_8_4"/>
					</v-radio-group>
				</v-fieldset>
				<v-fieldset legend="4.9. Costos de Producción en los últimos 12 meses">
					<table width="100%" class="table">
						<tr><td>Semillas y plantones</td><td><v-number v-model="o.p_4_9_1" v-on:input="changeP98(o)"/></td></tr>
						<tr><td>Abonos y/o fertilizantes</td><td><v-number v-on:input="changeP98(o)" v-model="o.p_4_9_2"/></td></tr>
						<tr><td>Pesticidas</td><td><v-number v-on:input="changeP98(o)" v-model="o.p_4_9_3"/></td></tr>
						<tr><td>Transporte</td><td><v-number v-on:input="changeP98(o)" v-model="o.p_4_9_4"/></td></tr>
						<tr><td>Agua</td><td><v-number v-on:input="changeP98(o)" v-model="o.p_4_9_5"/></td></tr>
						<tr><td>Alquiler de maquinaria</td><td><v-number v-on:input="changeP98(o)" v-model="o.p_4_9_6"/></td></tr>
						<tr><td>Pago a jornaleros</td><td><v-number v-on:input="changeP98(o)" v-model="o.p_4_9_7"/></td></tr>
						<tr><td>Otros</td><td><v-number v-on:input="changeP98(o)" v-model="o.p_4_9_8"/></td></tr>
						<tr><td>Total (Gabinete)</td><td><v-number disabled="disabled" v-model="o.p_4_9_9"/></td></tr>
					</table>
				</v-fieldset>
			</template>
		</v-form>
	</ion-content>
</template>
<script>
import {IonContent} from '@ionic/vue';
export default window._.ui({
	components:{IonContent},
	props:['id'],
	data(){return{
	trayLocation:null,
	s:{},options:{
	vegetable:['Papa blanca','Maíz Amiláceo','Trigo','Alfalfa',
		'Papa Huayro','Haba','Cebada grano','Papa nativa',
		'Maíz choclo','Oca','Papa amarilla','Olluco',
		'Avena forrajera','Otro cultivo'],
	regime:['Propia','Alquilada','En usufructo','Propia por herencia/sucesión','Otro régimen','No tiene tierras'],
	destiny:['Venta','Autoconsumo','Mixta (Venta y autoconsumo)'],
	destinySell:['Venta en la misma localidad/comunidad/centro poblado','Venta fuera de la localidad/comunidad/centro poblado',
	'Mercado local (feria local, centro de acopio local)',
	'Mercado regional (feria regional, centro de acopio regional)',
	'Mercado exterior',
	'Agroindustria',
	'Mercados de Lima']
	},o:{id:null,synchronized:null},count:0,img:0}},
	created(){
		var me=this;
		if(me.id<0){
			me.getStoredList('poll').then((poll)=>{
				poll.forEach(e =>{
					if(e.tmpId==Math.abs(me.id)){me.o=e;}
				});
			});
		}else if(me.id)
			window.axios.get('/api/poll/'+me.id,{params:{poll:me.app.poll}}).then((d)=>{
				me.o=d.data;
			});
	},
	computed:{
		hasVenta(){
			for(var i=0;i<6;i++)if(this.o['p_4_7_'+(i+1)+'_2']>0||this.o['p_4_5_'+(i+1)+'_6']>0)return 1;
		},
		hasSubproduct(){
			for(var i=0;i<6;i++){
				if(this.o['p_4_5_'+(i+1)+'_2']>0)return 1;
			}
			
		},
	},
	methods:{
		calculateTotal(i){
			this.o['p_4_7_'+i+'_4']=(this.o['p_4_7_'+i+'_2']>0&&this.o['p_4_7_'+i+'_3']>0)?
				this.o['p_4_7_'+i+'_2']*this.o['p_4_7_'+i+'_3']:null;
				console.log(this.o['p_4_7_'+i+'_4']);
		},
		process(o){
			o.poll=this.app.poll;
			return o;
		},
		close(o){
			if(o.data.id)this.o.id=o.data.id;
		},
		changeP98(o){
			var v=0;
			for(var i=1;i<=8;i++){
				if(o['p_4_9_'+i])v+=parseInt(o['p_4_9_'+i]);
			}
			this.o['p_4_9_9']=v?v:null;
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