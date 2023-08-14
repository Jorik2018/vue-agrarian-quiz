<template>
	<ion-content :scroll-events="true">
		<v-form style="padding:10px;" class="v-form" v-bind:class="o.id<0?'yellow':(o.tmpId?'green':'')" store="poll" action="/api/poll">
			<span class="v-button-top-float" v-on:click="save"><i class="fa fa-save"></i></span>
			<h2 
			style="padding-left: 34px;margin-bottom:20px;position: relative;font-size: 24px;background-color: transparent;">
			<i class="fa fa-tree" style="position: absolute; left: 2px; top: 3px;"></i>5. ACTIVIDAD PECUARIA</h2>
			<div><a :href="'/admin/poll/'+o.id">ID={{o.id}}</a></div>
			<v-fieldset legend="Tiene animales">
				<v-checkbox label="Ganado" v-model="o.p_5_0_1"/>
				<v-checkbox label="Menores" v-model="o.p_5_0_2"/>
			</v-fieldset>
			<template v-if="o.p_5_0_1||o.p_5_0_2">
			<v-fieldset legend="5.1. TIPOS DE ANIMALES CRIADOS EN LOS ULTIMOS 12 MESES">
				<div v-for="i in 9" :key="'type-'+i">
					<label>Tipo Especie {{i}}</label>
					<v-select v-model="o['p_5_2_'+i]">
						<option>--SELECCIONAR--</option>
						<template v-if="o.p_5_0_1">
							<option value="">----GANADO--</option>
							<option v-for="(value,key) in options.typeAnimal" v-bind:key="'p_76_1_'+i+'_'+key" v-bind:value="value">{{value}}</option>
						</template>
						<template v-if="o.p_5_0_2">
							<option value="">----ANIMALES MENORES--</option>
							<option v-for="(value,key) in options.typeAnimalMinor" v-bind:key="'p_76_1_'+i+'_'+key+'m'" v-bind:value="value">{{value}}</option>
						</template>
						
					</v-select>
					<template v-if="o['p_5_2_'+i]">
						
						<input style="margin-top:10px" v-if="o['p_5_2_'+i]=='OTROS (ESPECIFICAR)'" v-model="o['p_5_1_'+i]"/>
						
						<v-fieldset v-bind:legend="'PREGUNTAS para '+(o['p_5_1_'+i]?o['p_5_1_'+i]:o['p_5_2_'+i])" closable="true">
							<v-fieldset legend="5.3. Destino de la producción ¿Cuántos animales consumió, cuántos vendió y cuántos murieron? (Anotar en cantidad/número) ">
								<table width="100%" class="table">
									<tr><td>En pie (vivos)</td><td width="80">
									<v-number min="0" v-on:input="calculateTotal(i)" v-model="o['p_5_3_'+i+'_1']"/></td></tr>
									<tr><td>Consumo</td><td width="80">
									<v-number min="0" v-on:input="calculateTotal(i)" v-model="o['p_5_3_'+i+'_2']"/></td></tr>
									<tr><td>Muertes/robo</td><td>
									<v-number min="0" v-on:input="calculateTotal(i)" v-model="o['p_5_3_'+i+'_3']"/></td></tr>
									<tr><td>Vendidos</td><td>
									<v-number min="0" v-on:input="calculateTotal(i)" v-model="o['p_5_3_'+i+'_4']"/></td></tr>
								</table>
							</v-fieldset>
							<label>5.4. Total de animales en los ultimos 12 meses (propios/cantidad)</label>
							<v-number disabled="disabled" v-model="o['p_5_4_'+i]"/>
							<label>5.5. Valor total de la venta (soles)</label>
							<v-number v-model="o['p_5_5_'+i]"/>
							<label>5.6. ¿Cuánto es el peso promedio de la producción en pie por animal? </label>
							<v-number v-model="o['p_5_6_'+i]"/>
							<label>5.7. ¿Cuánto es el peso promedio de la producción de carne por animal? </label>
							<v-number v-model="o['p_5_7_'+i]"/>
							<label>5.8. Precio promedio de la unidad (en pie) (S/. por cabeza)</label>
							<v-number v-model="o['p_5_8_'+i]"/>
						</v-fieldset>
					</template>
				</div>
			</v-fieldset>
			<v-fieldset legend="5.9. CARACTERISTICAS DE LOS SUB PRODUCTOS EN LOS ULTIMOS 12 MESES">
				<div v-for="i in 5" :key="'type-'+i">
					<label>Subproducto {{i}}</label>
					<input v-model="o['p_5_9_'+i]"/>
					<v-fieldset v-if="o['p_5_9_'+i]" v-bind:legend="'DESCRIPCION DE '+o['p_5_9_'+i]" closable="true">
						<label>Producción total (kg /LT)</label>
						<v-number v-model="o['p_5_9_'+i+'_1']"/>
						<label>Producción venta (kg /Lt)</label>
						<v-number v-model="o['p_5_9_'+i+'_2']" v-on:input="calculateTotal2(i)"/>
						<label>Precio</label>
						<v-number v-model="o['p_5_9_'+i+'_3']" v-on:input="calculateTotal2(i)"/>
						<label>Ingreso por venta(Total)</label>
						<v-number v-model="o['p_5_9_'+i+'_4']"/>
					</v-fieldset>
				</div>
			</v-fieldset>
			<v-fieldset v-if="hasVenta" legend="5.10. SOLO SI HAY VENTA, ¿Dónde comercializa habitualmente sus productos/ subproductos pecuarios?">
				<v-radio-group v-model="o['p_5_10']" >
					<v-radio value="0" label="No comercializa"/>
					<v-radio value="1" label="Mercado - Lugar"/>
					<v-textarea v-if="o['p_5_10']==1" v-model="o['p_5_10_1']"/>
					<v-radio value="2" label="Feria - Lugar"/>
					<v-textarea v-if="o['p_5_10']==2" v-model="o['p_5_10_2']"/>
					<v-radio value="3" label="En su parcela"/>
					<v-radio value="4" label="Vivienda"/>
					<v-radio value="5" label="Otros (especificar)"/>
					<v-textarea v-if="o['p_5_10']==5" v-model="o['p_5_10_5']"/>
				</v-radio-group>
			</v-fieldset>
			<v-fieldset legend="5.11. Para su actividad pecuaria, en los últimos 12 meses ¿Cuánto gastaron? (en nuevos soles)">
				<table width="100%" class="table">
					<tr><td>Alimentos para animales? (Pastos, sal, afrecho, purina, otros)</td>
					<td width="80"><v-number v-model="o['p_5_11_1']" v-on:input="changeP98(o)"/></td></tr>
					<tr><td>Servicios veterinarios</td><td><v-number v-model="o['p_5_11_2']" v-on:input="changeP98(o)"/></td></tr>
					<tr><td>Productos veterinarios (medicamentos/ dosificación)</td><td>
					<v-number v-model="o['p_5_11_3']" v-on:input="changeP98(o)"/></td></tr>
					<tr><td>Pago de peones y/o trabajadores</td><td><v-number v-model="o['p_5_11_4']" v-on:input="changeP98(o)"/></td></tr>
					<tr><td>Insumos adicionales para la elaboración de subproductos</td><td><v-number v-model="o['p_5_11_5']" v-on:input="changeP98(o)"/></td></tr>
					<tr><td>Otros</td><td><v-number v-on:input="changeP98(o)" v-model="o['p_5_11_6']"/></td></tr>
					<tr><td>Total Costo</td><td><v-number v-model="o['p_5_11_7']"/></td></tr>
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
	typeAnimal:['VACUNO','OVINO','PORCINO','CAPRINO','EQUINOS','AUQUENIDOS'],
	typeAnimalMinor:['AVES DE CORRAL','CUYES','CONEJOS','OTROS (ESPECIFICAR)'],
	regime:['Propia','Alquilada','En usufructo','Propia por herencia/sucesión','Otro régimen','No tiene tierras'],
	destiny:['Venta','Autoconsumo','Mixta (Venta y autoconsumo)'],
	destinySell:['Venta en la misma localidad/comunidad/centro poblado','Venta fuera de la localidad/comunidad/centro poblado',
	'Mercado local (feria local, centro de acopio local)',
	'Mercado regional (feria regional, centro de acopio regional)',
	'Mercado exterior',
	'Agroindustria',
	'Mercados de Lima']
	},o:{id:null,synchronized:null},count:0,img:0}},
	computed:{
		hasVenta(){
			for(var i=0;i<9;i++)if(this.o['p_5_3_'+(i+1)+'_4']>0||this.o['p_5_9_'+(i+1)+'_2']>0)return 1;
		}
	},
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
	methods:{
		calculateTotal2(i){
			if(this.o['p_5_9_'+i+'_2']>0&&this.o['p_5_9_'+i+'_3']>0)
				this.o['p_5_9_'+i+'_4']=Number(this.o['p_5_9_'+i+'_2'])*Number(this.o['p_5_9_'+i+'_3']);
		},
		calculateTotal(i){
			var t=0;
			for(var j=0;j<4;j++){
				if(this.o['p_5_3_'+i+'_'+(j+1)])
					t+=Number(this.o['p_5_3_'+i+'_'+(j+1)]);
			}
			this.o['p_5_4_'+i]=t;
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
			for(var i=1;i<=6;i++){
				if(o['p_5_11_'+i])v+=parseInt(o['p_5_11_'+i]);
			}
			this.o['p_5_11_7']=v?v:null;
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