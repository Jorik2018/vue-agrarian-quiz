<template>
	<ion-content :scroll-events="true">
		<v-form style="padding:10px;" class="v-form" 
			:class="o.id<0||(o.tmpId&&!o.synchronized)?'yellow':(o.tmpId?'green':'')" store="poll" action="/api/poll">
			<span  class="v-button-top-float" v-on:click="save"><i class="fa fa-save"></i></span>			
			<h2 
			style="margin-right: 50px;padding-left: 34px;margin-bottom:20px;position: relative;font-size: 24px;background-color: transparent;">FICHA AGROPECUARIA</h2>
			<div v-if="o.id" :class="o.id<0?'yellow':''">ID={{o.id}}</div>
			<v-fieldset legend="INFORMACION DEL ENCUESTADOR">
				<label>Región:</label>
				<v-select v-model="o.region"
					@input="$refs.province.load({code:pad(o.region,2)})">
					<option value="">Seleccionar Opci&oacute;n</option>
					<v-options store="region" value-field="id" display-field="name"/>
				</v-select>
				<label>Provincia:</label>
				<v-select v-model="o.provincia" ref="province" :required="true" :autoload="false" 
					:disabled="!o.region"
                    @input="$refs.district.load({code:o.provincia})"> 
                    <option>Select One...</option>
                    <v-options store="province" value-field="code" display-field="name"/>
                </v-select> 
				<label>Distrito:</label>
				<v-select v-model="o.distrito" ref="district" :autoload="false" 
					store="district_selected" 
					@input="$refs.cp.load({code:o.distrito})"
					:disabled="!o.provincia" name="district" required="required"> 
                    <option value="">Select One...</option> 
                    <v-options store="district" value-field="code" display-field="name"/> 
                </v-select>
				<label>Centro Poblado:</label>
				<v-select ref="cp"
					@input="changeTown" 
					autoload="false" :disabled="!o.distrito" v-model="o.centro_poblado" >
					<option value="">Seleccionar Opci&oacute;n</option>
					<v-options store="sample" value-field="code" display-field="name"/>
				</v-select>
				<label>Hogar</label>
				<v-number v-model="o.hogar" required="true" min="1"/>
				<v-button style="margin-top:10px;" icon="fa-map" value="Obtener Geolocalización" v-on:click="printCurrentPosition"/>
				<div v-if="o.lat&&o.lat!=0||o.lon&&o.lon!=0||trayLocation" style="margin-top:10px;border:1px solid #ffcf00;background-color:#ffff80;padding:10px;">({{o.lat}},{{o.lon}})</div>
			</v-fieldset>
			<v-fieldset legend="1. INFORMACIÓN GENERAL">
				<label>1.1. Localidad</label>
				<input disabled="disabled" v-model="o.p_1_1"/>
				<label>1.2. Barrio / Sector / Caserio</label>
				<v-textarea v-model="o.p_1_2" maxlength="150"/>
				<label>1.3. Nombre Informante</label>
				<v-textarea v-model="o.p_1_3" maxlength="150"/>
				<label>1.4. Teléfono</label>
				<input v-model="o.p_1_4"/>
				<label>1.5. Es jefe de hogar</label>
				<v-radio-group v-model="o.p_1_5" >
					<v-radio value="1" label="Si"/>
					<v-radio value="0" label="No"/>
				</v-radio-group>
				<label>1.6. Es comunero</label>
				<v-radio-group v-model="o.p_1_6" >
					<v-radio value="1" label="Si"/>
					<v-radio value="0" label="No"/>
				</v-radio-group>
				<label>1.7. Sexo</label>
				<v-radio-group v-model="o.p_1_7" >
					<v-radio value="0" label="Hombre"/>
					<v-radio value="1" label="Mujer"/>
				</v-radio-group>
				<label>1.8. Edad</label>
				<v-number v-model="o.p_1_8"/>
				<label>1.9. Viven habitualmente en esta localidad</label>
				<v-radio-group v-model="o.p_1_9" >
					<v-radio value="1" label="Si"/>
					<v-radio value="0" label="No"/>
				</v-radio-group>
				<label>1.10. ¿Por lo general a qué lugar se desplazan más?</label>
				<v-radio-group v-model="o.p_1_10" >
					<v-radio value="0" label="Ninguno"/>
					<v-radio value="1" label="Especificar"/>
					<v-textarea v-if="o.p_1_10" v-model="o.p_1_10_1" maxlength="100"/>
				</v-radio-group>
				<label>1.11. ¿Con qué frecuencia se desplazan a este lugar? (veces/período)</label>
				<input v-model="o.p_1_11" />
				<label>1.12. ¿Cuál es el principal motivo de desplazamiento? </label>
				<v-textarea v-model="o.p_1_12" maxlength="100"/>
				<label>1.13. ¿Qué actividad económica realiza en ese lugar?</label>
				<v-textarea v-model="o.p_1_13" maxlength="100"/>
			</v-fieldset>
			<div class="xyz" v-if="o.id">
				<a :href="'/admin/poll/peoples/'+(o.tmpId?-o.tmpId:o.id)">2. MIEMBROS DEL HOGAR</a>
				<a :href="'/admin/poll/sectionA/'+(o.tmpId?-o.tmpId:o.id)">2. VIVIENDA</a>
				<a :href="'/admin/poll/sectionC/'+(o.tmpId?-o.tmpId:o.id)">3. TIERRA</a>
				<a :href="'/admin/poll/sectionH/'+(o.tmpId?-o.tmpId:o.id)">4. ACTIVIDAD AGRICOLA</a>
				<a :href="'/admin/poll/sectionI/'+(o.tmpId?-o.tmpId:o.id)">5. ACTIVIDAD PRECUARIO</a>
			</div>
		</v-form>
	</ion-content>
</template>
<script>
import {IonContent} from '@ionic/vue';
import { Geolocation } from '@capacitor/geolocation';

var axios=window.axios;
export default window._.ui({
	components:{IonContent},
	props:['id'],
	data(){return{trayLocation:null,regionList:[],provinceList:[],districtList:[],townList:[],
	o:{id:null,region:null,provincia:null,distrito:null,centro_poblado:null,lat:null,lon:null,people:[]}}},
	updated(){
		window.app.bindLinks(this.$el);
	},
	async created(){
		var me=this;
		if(me.id<0){
			me.getStoredList('poll').then((polls)=>{
				polls.forEach(e =>{
					if(e.tmpId==Math.abs(me.id)){
						me.o=e;
						me.trayLocation=e.lat&&e.lon;
					}
				});
			});
		}else if(me.id)
			axios.get('/api/poll/'+me.id,{params:{poll:me.app.poll}}).then((d)=>{
				me.o=d.data;
			});
		me.removeStored('people');
	},
	methods:{
		process(o){
			var me=this;
			if(!me.trayLocation){
				me.MsgBox('Debe tratar de obtener la geolocalización.');
				return false;
			}
			o.poll=me.app.poll;
			return o;
		},
		changeTown(o,o2){
			if(o2&&o2.name)this.o.p_1_1=o2.name;
		},
		async printCurrentPosition(){
			var me=this;
			me.trayLocation=1;
			const coordinates = await Geolocation.getCurrentPosition();
			//Debe ponerse una vntana de permiso
			var c=coordinates.coords;
			me.o.lat=c.latitude;
			me.o.lon=c.longitude;
			
		},
		close(o){
			var me=this;
			if(o.data.id)me.o.id=o.data.id;
			if(o.data.tmpId)me.o.tmpId=o.data.tmpId;
			me.$router.replace('/admin/poll/'+me.o.id);
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
	.xyz{
		padding:0px !important;
	}
	.xyz > a{
		background-color: #e1ffea;
		display:block;
		border: 1px solid gray;
		margin-top: 10px;
		padding: 10px;
	}
</style>