<template>
	<v-form  v-bind:header="(o.id?'Editar':'Crear')+' Tienda'" class="ion-content-yellow" action="/admin/commerce/api/store" v-if="o">
		<div class="v-form view-list">
			<label>Nombre de la tienda *</label>
			<v-textarea v-model="o.name" required="required" rows="1" />
			<label>Descripción</label>
			<v-textarea v-model="o.description" required="required" rows="1" />
			<label>Categoría</label>
			<v-select v-model="o.categoryId" required="required" autoload="true">
				<option>Seleccionar Una...</option>
				<v-options url="/admin/commerce/api/shami/category/0/0"  value-field="id">
					<template v-slot="{item}">
						{{item.name}} - {{item.name}}
					</template>
				</v-options>
			</v-select>
			<template v-if="session.rol==4">
				<label>Vendedor *</label>
				<v-autocomplete queryEvent="enter" placeholder="Ingrese mas de 2 letras y presione ENTER" 
										minQueryLength="3" 
										emptyMessage="Buscar por nombre (2 caracteres min.)" 
										size="60" required="required" 
										v-model="o.seller" src="/admin/commerce/api/usuario">
					<template v-slot:label="{selected}" v-if="o.seller">{{selected.people.apPaterno}} {{selected.people.apMaterno}} {{selected.people.nombres}}</template>
					<template v-slot="{row}">
						{{row}}
					</template>
				</v-autocomplete>
			</template>
			<label>Dirección</label>
			<v-textarea v-model="o.address" required="required" rows="1" />
			<label>Google Maps</label>
			<v-textarea v-model="o.mapa" rows="1" />
			<label>Facebook</label>
			<v-textarea v-model="o.facebook" rows="1" />
			<label>Twitter</label>
			<v-textarea v-model="o.twitter" rows="1" />
			<label>Instagram</label>
			<v-textarea v-model="o.instagram" rows="1" />
			<label>Youtube</label>
			<v-textarea v-model="o.youtube" rows="1" />
			<label>Vídeo</label>
			<v-textarea v-model="o.video" rows="1" />
			<label>Telefono{{o.phone}}</label>
			<v-textarea v-model="o.phone" rows="1" />
			<label>Logo</label>
			<div class="right" v-bind:key="'a-'+k1" style="background-color: white;border: 1px solid #c7c7c7;border-radius: 8px;padding: 10px;">
				<img v-bind:src="o.ext.logo?(baseURL+'/fs/temp/'+o.ext.logo):(baseURL+'/fs/shami/store/'+o.logo)" 
					onerror="this.src=window.logo;this.style.padding='50px';this.style.objectFit='unset';" 
					onload="this.style.padding=(this.src.endsWith(window.logo)?'50px':'0px');this.style.objectFit=(this.src.endsWith(window.logo)?'unset':'cover');"
					style="width:100%;height:min-height:100px;height:300px;margin-bottom: 10px;object-fit: cover;"/>
				<v-uploader value="" icon="image" v-bind:click="test" v-on:input="o.ext.logo=$event.tempFile;k1++"/>
			</div>
			<label>Imagenes</label>
			<div v-bind:key="'b-'+k2" style="border:1px solid #0f62ac;background-color:white;border:1px solid #c7c7c7;border-radius:8px;padding:10px;">
				<div>
					<template v-for="(img,i) in o.ext.images">
						<div v-if="!img.removed" style="height:150px;max-height:150px;overflow-y:hidden;width:50%;display:inline-block;position:relative;border: 1px solid #c3c3c3;" 
						v-bind:key="i">
						<img style="width:100%;height: 100%;object-fit: cover;"
						v-bind:src="img.tmp?(baseURL+'/fs/temp/'+img.tmp):(baseURL+'/fs/shami/store/'+o.id+'/'+img.src)"
						onerror="this.src=window.logo;this.className='error'" />
						<span v-on:click="remove(o.ext.images,i)" class="center span-rounded" style="top:5px;">
						<i class="fa fa-trash"></i>
						</span>
						<span v-show="(img.tmp?img.tmp:img.src)!=o.tienda" style="bottom:5px;" v-on:click="o.tienda=img.tmp?img.tmp:img.src" class="center span-rounded"><i class="far fa-star"></i></span>
						<span v-show="(img.tmp?img.tmp:img.src)==o.tienda" style="bottom:5px;" class="center span-rounded yellow"><i class="far fa-star"></i></span>
						</div>
					</template>
				</div>
				<div class="right" style="margin-top:10px">
					<v-uploader icon="image" value="" v-bind:click="test" v-on:input="o.ext.images.push({tmp:$event.tempFile});k2++"/>
				</div>
			</div>
			<center>
				<v-button v-on:click="save" value="Registrar" class="blue"/>
			</center>
		</div>
	</v-form>
</template>
<script>
	import {Camera,CameraResultType/*,CameraSource*/} from '@capacitor/camera';
	var axios=window.axios;
	export default window.ui({
		props:['id'],
		data(){return{k1:0,k2:0,o:{tienda:null,ext:{logo:null,image:null,images:[]}},tab:0,count:0}},
		mounted(){
			var me=this;
			window.app.title='Crear Tienda';
			if(me.id)
				axios.get('/admin/commerce/api/store/'+me.id).then((d)=>{
					var o=d.data;
					if(!o.ext)o.ext={};
					if(!o.ext.logo)o.ext.logo=null;
					if(!o.ext.image)o.ext.image=null;
					if(!o.ext.images)o.ext.images=[];
					me.o=o;
					window.app.title=me.o.name;
				});
			else
				me.o={tienda:null,ext:{logo:null,image:null,images:[]}};
		},
		methods:{
			close(r){if(r===true){this.$router.back();}},
			test(u){
				var me=this;
				me.count++;
				Camera.getPhoto({
					quality: 100,
					allowEditing: true,
					//source:CameraSource.Prompt,
					resultType: CameraResultType.Uri
				}).then(function(result){
					me.count--;
					if(me.count==0){
						fetch(result.webPath).then(r=>r.blob()).then((b)=>{
							u.submitFile(b,'name.'+result.format);
						});
					}
				});
			},
			remove(l,i){
				var o=l[i];
				if(o.tmp)
					l.splice(i,1);
				else
					o.removed=1;
			},
			process(o){
				console.log(o);
				o.sellerId=this.session.idUsuario;
				o.logo=o.logo?o.logo:'';
				o.youtube=o.youtube?o.youtube:'';
				
				return o;
			},
			close(o){
				var me=this,id=me.o.id;
				me.o.id=o.id;
				if(!id){
					me.open('/admin/store',true);
				}
			}
		}
	});
</script>