<template>
  <div class="uploadBox">
    <!-- <vue-easy-upload create-person="lwf" multiple max="2"> -->
    <vue-easy-upload
      v-model="relList"
      :hint="false"
      :file-list="fileList"
      :filed-list='["name","size","date"]'
      ref="veu"
      multiple
      max="4"
      double-row
      :on-upload="onUpload"
      :onManualUpload="onManualUpload"
      @error-trap="onErrorTrap"
    >
      <template #title>
        <i class="handleBtn veufont veui-sousuofangda"></i>文件上传
      </template>
    </vue-easy-upload>
    <!-- edit list -->
    <br />
    <button @click="getRealList"><h2>获取时时数据</h2></button>
    <button @click="manualUpload"><h2>手动上传</h2></button>
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />

    <vue-easy-upload
      create-person="lwf2"
      multiple
      max="2"
      :size-limit="1000000"
      @exceed="onExceed"
      @size-limit="onSizelimit"
      :file-list="fileList"
      :on-upload="onUpload"
      :on-delete="onDelete"
      :on-preview="onPreview"
    >
    </vue-easy-upload>
    <!-- edit list -->
    <br />
    <button @click="asyncList"><h2>async list</h2></button>
    <h1>以下为只读</h1>
    <vue-easy-upload
      create-person="lwf"
      multiple
      max="2"
      @exceed="onExceed"
      :file-list="fileList"
      readonly
      double-row
    >
      <template #preview> <span class="view">预览</span> </template>
      <template #download><span class="download">下载</span></template>
      <template #sizelabel><span class="">大小：</span></template>
      <template #personlabel><span class="">上传人：</span></template>
      <template #datelabel><span class="">上传日期：</span></template>
    </vue-easy-upload>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      relList: [],
      fileList: [],
    };
  },
  mounted() {},
  methods: {
    manualUpload() {
      //手动上传发起
      this.$refs.veu.manualUpload();
    },
    getRealList() {
      //获取时时数据
      console.log(this.relList);
    },
    onErrorTrap(param){//无手动上传数据时提示
      console.log(param.msg)
    },
    onManualUpload(fileList) {
      //手动上传request
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const list = fileList.map((item) => {
            return {
              id: Math.random(),
            };
          });
          resolve(list);
          // reject()
        }, 100);
      });
    },
    asyncList() {
      this.fileList = [
        {
          id: "1505801845921062914",
          url: "http://cssmobanobs.obs.cn-east-3.myhuaweicloud.com/d_res/20231988.xlsx",
          fileSize: 2638,
          name: "趋势.xlsx",
          createPerson: "李小明",
          date: "2022.09.07",
        },
        {
          id: "1505803810193317890",
          url: "https://picsum.photos/536/354",
          fileSize: 196432,
          name: "图片.png",
          createPerson: "王大锤",
          date: "2022.09.07",
        },
      ];
    },
    onExceed(file) {
      console.log("文件上限");
    },
    onSizelimit(file) {
      console.log("体积上限");
    },
    onUpload(file) {
      console.log(file);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(file.map(()=>{
            return {id:Math.random()}
          }));
          // reject()
        }, 100);
      });
    },
    onDelete(file) {
      return new Promise((resolve, reject) => {
        if (confirm("确定删除么")) {
          console.log(file);
          setTimeout(() => {
            resolve();
          }, 100);
        } else {
          reject();
        }
      });
    },
    onPreview(file) {
      console.log("自定义处理文件");
    },
  },
};
</script>
<style scoped>
.uploadBox {
  width: 460px;
}
.view {
  color: #00ae68;
}
.download {
  color: #3688ff;
}
</style>
