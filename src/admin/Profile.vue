<template>
	<div class="view">
		<template v-if="!o">No se pudo recuperar informacion</template>
		<template v-if="o">
			<div class="center" style="padding:20px;border-radius:10px">
				<div style="
overflow-y: hidden;
    width: calc(100vw - 90px);
    height: calc(100vw - 90px);
    border-radius: 50%;
">
				<img v-bind:key="img" style="width:100%;" 
					onerror="this.src=window.logo;this.className='error'" 
					v-bind:src="baseURL+'/thumb/160/foto/'+o.id+'.jpg'"/>
				</div>
				<div>{{o.fullName}}</div>
				<label>Usuario</label>
				<div>{{session.usuario}}</div>
				<div class="right" style="margin-top:10px">
					<v-uploader icon="image" value="" v-bind:click="test" v-on:input="changeImage($event.tempFile)"/>
				</div>
			</div>
			<v-fieldset legend="Informaci&oacute;n de contacto">
				<div class="right">
					<span v-show="!editContact" class="v-controls">
						<span v-on:click="editContact=1"><i class="fa fa-edit"></i></span>
					</span>
					<span v-show="editContact" class="v-controls">
						<span v-on:click="saveContact"><i class="fa fa-save"></i></span>
						<span v-on:click="editContact=0"><i class="fa fa-times"></i></span>
					</span>
				</div>
				<div class="v-form">
				<label>Nombres:</label>
				<div v-if="!editContact">{{o.names}}</div>
				<input v-if="editContact" required="true" v-model="o.names" />
				<label>Apellido Paterno:</label>
				<div v-if="!editContact">{{o.apPaterno}}</div>
				<input v-if="editContact" v-model="o.apPaterno" />
				<label>Apellido Materno:</label>
				<div v-if="!editContact">{{o.apMaterno}}</div>
				<input v-if="editContact" v-model="o.apMaterno" />
				<label>Correo:</label>
				<div v-if="!editContact" required="true" >{{o.mail}}</div>
				<input v-if="editContact" v-model="o.mail" />
				<label>Sexo:</label>
				<div v-if="!editContact">{{o.sex?(o.sex=='M'?'Masculino':'Femenino'):'---'}}</div>
				<v-radio-group v-if="editContact" v-model="o.sex" >
					<v-radio value="M" label="Masculino"></v-radio >
					<v-radio value="F" label="Femenino"></v-radio >
				</v-radio-group>
				<label>Celular:</label>
				<div v-if="!editContact">{{o.phone?o.phone:'---'}}</div>
				<input v-if="editContact" v-model="o.phone" />
				</div>
			</v-fieldset>
			<v-fieldset legend="Direcci&oacute;n de env&iacute;o">
				<div class="right">
					<span class="v-controls" v-show="!editAddress">
						<span v-on:click="editAddress=1"><i class="fa fa-edit"></i></span>
					</span>
					<span class="v-controls" v-show="editAddress">
						<span v-on:click="saveAddress"><i class="fa fa-save"></i></span>
						<span v-on:click="editAddress=0"><i class="fa fa-times"></i></span>
					</span>
				</div>
				<div class="v-form">
					<label>Departamento:</label>
					<div v-if="!editAddress" v-bind:title="o.idDep">{{o.departamento?o.departamento:'---'}}</div>
					<v-select v-model="o.ext.region" v-if="editAddress" v-on:input="$refs.provinceSelect.load({regionId:o.ext.region.code})">
						<option value="">Seleccionar Opci&oacute;n</option>
						<v-options url="/admin/directory/api/region/0/0" display-field="name"/>
					</v-select>
					<label>Provincia:</label>
					<div v-if="!editAddress" v-bind:title="o.idProv">{{o.provincia?o.provincia:'---'}}</div>
					<v-select v-bind:disabled="!o.ext.region" ref="provinceSelect" v-if="editAddress" v-model="o.ext.province" 
						v-on:input="$refs.districtSelect.load({provinceId:o.ext.province.code})">
						<option value="">Seleccionar Opci&oacute;n</option>
						<v-options url="/admin/directory/api/province/0/0" display-field="name"/>
					</v-select>
					<label>Distrito:</label>
					<div v-if="!editAddress" v-bind:title="o.idDist">{{o.distrito?o.distrito:'---'}}</div>
					<v-select v-bind:disabled="!o.ext.province" ref="districtSelect" v-if="editAddress" v-model="o.ext.district" >
						<option value="">Seleccionar Opci&oacute;n</option>
						<v-options url="/admin/directory/api/district/0/0" display-field="name"/>
					</v-select>
					<label>Direcci&oacute;n:</label>
					<div v-if="!editAddress">{{o.address?o.address:'---'}}</div>
					<input v-if="editAddress" v-model="o.address" maxlength="10"/>
				</div>
			</v-fieldset>
			<v-fieldset legend="Cambio de clave">
				<div class="controls right">
					<i v-on:click="changePassword" class="fa fa-save"></i>
				</div>
				<div class="v-form">
					<label>Contraseña actual:</label>
					<input type="password" v-model="o.pass" />
					<label>Contraseña nueva:</label>
					<input type="password" v-model="o.newPass" />
					<label>Repetir contraseña nueva:</label>
					<input type="password" v-model="o.confirm" />
				</div>
			</v-fieldset>
		</template>
	</div>
</template>
<script>
import {Plugins,CameraResultType,CameraSource} from '@capacitor/core';
var axios=window.axios;
window._.baseURL=window.axios.defaults.baseURL;
var _=window._;
export default {
	data:function(){return{o:null,count:0,tab:0,editContact:0,editAddress:0,img:0}},
	computed:{
		session:function(){
			return window.app.session;
		},
		baseURL(){return window._.baseURL;}
	},
	created(){
		window.app.title='Cuenta';
		window.logo=require('@/fs/images/No_image.svg');
		var me=this;
		axios.get('/api/user/'+me.session.uid).then(function(d){
			console.log(d);
			var o=d.data;
			o.ext={};
			me.o=o;
		});
	},
	methods:{
		changeImage(url){
			var me=this;
			axios.post('/admin/commerce/api/store/change-image',{image:url,people:me.session[0].idPer}).then(function(result){
				me.urlPerfil=result.data.trim();
				me.img++;
			});
		},
		saveContact:function(){
			var me=this;
			var o=JSON.clone(me.o);
			delete o.ext;
			axios.put('/admin/directory/api/people/save-contact',o).then(function(){
				me.editContact=0;
			})
		},
		saveAddress:function(){
			var me=this;
			var o=JSON.clone(me.o);
			//o.ext.province=o.ext.province.code;
			//o.ext.district=o.ext.district.code;			
			console.log(o);
			axios.put('/admin/directory/api/people/save-address',o).then(function(){
				me.editAddress=0; 
			})
		},
		changePassword:function(){
			var me=this;
			axios.put('/apishami/api/usuarios/cambiarclave/',{"svdUsuarios":{"usuario":me.session.usuario,"clave":me.o.pass},"claveNueva":me.o.newPass}).then(function(){
				_.MsgBox('Contraseña actualizada.');
			})
		},
		test(u){
			var me=this;
			me.count++;
			Plugins.Camera.getPhoto({
				quality: 100,
				allowEditing: true,
				source:CameraSource.Prompt,
				resultType: CameraResultType.Uri
			}).then(function(result){
				me.count--;
				if(me.count==0){
					fetch(result.webPath).then(r=>r.blob()).then(function(b) {
						u.submitFile(b,'name.'+result.format);
					});
				}
			});
		}
	}
};
</script>
<style scope>
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
		padding:15px;
	}
</style>