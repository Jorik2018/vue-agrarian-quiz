<template>
  <ion-content :scroll-events="true">
    <v-form style="padding: 10px" class="v-form" store="setting">
      <h2
        style="
          padding-left: 34px;
          margin-bottom: 20px;
          position: relative;
          font-size: 24px;
          background-color: transparent;
        "
      >
        <i
          class="fa fa-sliders-h"
          style="position: absolute; left: 2px; top: 3px"
        ></i>
        Configuracion
      </h2>
      <v-fieldset legend="Juridiccion de encuesta predeterminada">
        <v-button
          icon="fa fa-sync"
          value="Recuperar Datos Maestros"
          @click="load"
          style="width: -webkit-fill-available"
        />
        <label>Red:</label>
        <v-select
          v-model="o.red"
          ref="redSelect"
          v-bind:label="o.regionName ? o.regionName : '---'"
          v-on:input="$refs.microredSelect.load({ Codigo_Red: o.red })"
        >
          <option value="">Seleccionar Opción</option>
          <v-options store="red" display-field="name" value-field="code" />
        </v-select>
        <label>Microred:</label>
        <v-select
          autoload="false"
          :disabled="!o.red"
          ref="microredSelect"
          v-model="o.microred"
          :required="true"
          @input="$refs.establishment.load({ Codigo_Cocadenado: o.microred })"
        >
          <option>Select One...</option>
          <v-options store="microred" display-field="name" value-field="code" />
        </v-select>
        <label>Establecimiento:</label>
        <v-select
          ref="establishment"
          v-model="o.establishment"
          v-bind:autoload="false"
          v-bind:disabled="!o.microred"
          v-bind:required="true"
        >
          <option>Select One...</option>
          <v-options
            store="establishment"
            display-field="name"
            value-field="code"
          />
        </v-select>
        <label>Departamento:</label>
        <v-select
          v-model="o.region"
          ref="regionSelect"
          v-bind:label="o.regionName ? o.regionName : '---'"
          v-on:input="
            $refs.provinceSelect.load({ code: o.region ? o.region.code : '*' })
          "
        >
          <option value="">Seleccionar Opción</option>
          <v-options store="region" display-field="name" />
        </v-select>
        <label>Provincia:</label>
        <v-select
          v-bind:label="o.provinceName ? o.provinceName : '---'"
          autoload="false"
          v-bind:disabled="!o.region"
          ref="provinceSelect"
          v-model="o.province"
          @input="
            $refs.districtSelect.load({
              code: o.province ? o.province.code : '*',
            })
          "
        >
          <option value="">Seleccionar Opción</option>
          <v-options store="province" display-field="name" />
        </v-select>
        <label>Distrito:</label>
        <v-select
          autoload="false"
          v-bind:label="o.districtName ? o.districtName : '---'"
          v-bind:disabled="!o.province"
          @input="
            $refs.cpSelect.load({ code: o.district ? o.district.code : '*' })
          "
          ref="districtSelect"
          v-model="o.district"
        >
          <option value="">Seleccionar Opción</option>
          <v-options store="district" display-field="name" />
        </v-select>
        <label>Centro Poblado:</label>
        <v-select
          autoload="false"
          :label="o.districtName ? o.districtName : '---'"
          :disabled="!o.district"
          ref="cpSelect"
          v-model="o.town"
        >
          <option value="">Seleccionar Opción</option>
          <v-options store="sample" display-field="name" />
        </v-select>
        <v-button
          icon="fa fa-save"
          value="Guardar Seleccion"
          @click="save"
          style="margin-top: 10px; width: -webkit-fill-available"
        />
      </v-fieldset>
    </v-form>
  </ion-content>
</template>
<script>
import { IonContent } from "@ionic/vue";
export default window._.ui({
  components: { IonContent },
  props: ["id"],
  data() {
    return { o: {} };
  },
  methods: {
    load() {
      var me = this,axios = window.axios,db = window._.db;
      var timer;
      var reset = function () {
        me.k++;
      };
      var postAdd = function () {
        clearTimeout(timer);
        timer = setTimeout(reset, 500);
      };
      [
        ["/admin/directory/api/town/0/0", "town"],
        ["/admin/desarrollo-social/api/red/0/0", "red"],
        ["/admin/desarrollo-social/api/microred/0/0", "microred"],
		["/admin/desarrollo-social/api/establishment/0/0", "establishment"],
		["/admin/directory/api/district/0/0", "district"],
		["/admin/directory/api/region/0/0", "region"],
		["/admin/directory/api/province/0/0", "province"],
		["/api/poll/sample/0/0", "sample"],
      ].forEach((e) => {
        axios.get(e[0]).then(function (data) {
          var objectStore = db
            .transaction([e[1]], "readwrite")
            .objectStore(e[1]);
          data = data.data;
          objectStore.clear().onsuccess = () => {
            for (var i in data) {
              postAdd(objectStore.add(data[i]));
            }
          };
        });
      });
    },
    save() {
      localStorage.setItem("setting", JSON.stringify(this.o));
      this.app.toast("Configuracion grabada!");
    },
    changeRegion(e, o, s) {
      s.load({ regionId: o.id });
    },

    changeDistrict() {},

    changeProvince(e, o, s) {
      s.load({ provinceId: o.code });
    },
    close(o) {
      if (o.data.id) this.o.id = o.data.id;
    },
  },
});
</script>
<style scope>
.table input {
  width: 100% !important;
}
.table td {
  padding: 2px;
}
.ww > a:not(:last-child) {
  margin-bottom: 20px;
}
.ww > a {
  display: block;
  border: 1px solid gray;
  padding: 10px;
}
.ww span {
  font-size: 16px;
  font-weight: bolder;
}
.ww i {
  font-size: 14px;
  color: gray;
  display: block;
}
.ww div {
  display: inline-block;
  width: calc(100% - 100px);
  padding-top: 20px;
  float: left;
}
.ww img {
  width: 100px;
}
img.error {
  padding: 30% !important;
  width: 40% !important;
  background-color: transparent;
}
.cart-control > * {
  display: block;
  width: 90%;
}
.cart-control > *:not(:last-child) {
  margin-bottom: 10px;
}
.controls a:not(:last-child) {
  display: inline-block;
  margin-right: 10px;
}
.product {
  padding: 20px;
  background-color: white;
  position: relative;
}
.product-list iframe {
  width: 100%;
}
.controls {
  position: relative;
}
.controls > *:not(:last-child) {
  margin-right: 10px;
}
fieldset > div {
  padding: 10px;
}
.view {
  margin: 15px 0px;
}
.inner-scroll {
  --padding: 10px;
}
.v-fieldset {
  border: 1px solid #0f62ac;
}
.v-controls {
  font-size: 30px;
}
</style>