<template>
  <div class="vue-easy-upload">
    <div class="FileList" :class="{ doubleRow: doubleRow }">
      <ul>
        <li class="fileItem" v-for="(item, index) in realFileList" :key="index">
          <span class="iconBox">
            <img
              :src="item.url"
              alt=""
              v-if="item.type === 'image'"
              @click="handleView(item)"
            />
            <img :src="iconClass[item.type]" alt="" v-else />
          </span>
          <span class="name">
            <span class="nameText" v-if="checkfiledInfo('name')">{{ item.name }}</span
            ><span class="size" v-if="checkfiledInfo('size')">
              <span class="sizeLabel" v-if="doubleRow"
                ><slot name="sizelabel">大小：</slot></span
              >{{ item.size }}</span
            ><span class="createPerson" v-if="checkfiledInfo('createPerson')"
              ><span class="personLabel" v-if="doubleRow"
                ><slot name="personlabel">上传人：</slot></span
              >{{ item.createPerson }}</span
            ><span class="date" v-if="checkfiledInfo('date')"
              ><span class="dateLabel" v-if="doubleRow"
                ><slot name="datelabel">上传日期：</slot></span
              >{{ item.date }}</span
            >
          </span>
          <div class="handleBtnBox">
            <span class="handleBtn" @click="handleView(item)">
              <slot name="preview">
                <i class="handleBtn veufont veui-sousuofangda"></i>
              </slot> </span
            ><span class="handleBtn" @click="handleDownload(item)" v-if="readonly">
              <slot name="download">
                <i class="veufont veui-xiazai"></i>
              </slot> </span
            ><span class="handleBtn" @click="handleDelete(item)" v-else>
              <slot name="delete">
                <i class="veufont veui-shanchu"></i>
              </slot>
            </span>
          </div>
        </li>
      </ul>
    </div>
    <div class="btnBox" v-if="!noBtn && !readonly">
      <label @click="showUpload" class="btn" :class="{ disabled: isLoading }">
        <slot name="title">{{ title }}</slot> </label
      ><span class="hint" v-show="hint">{{ hint }}</span>
    </div>
    <input
      type="file"
      v-show="false"
      name="vue-easy-upload"
      :ref="id"
      :accept="accept"
      :multiple="multiple"
      @change="hanldeFileChange"
    />
  </div>
</template>

<script>
import util from "./util";
import dayjs from "dayjs";
import fileList from "../src/assets/FileList/fileList";
export default {
  name: "vue-easy-upload",
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    noBtn: {
      //不需要上传按钮，按钮可自定义
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "添加附件",
    },
    doubleRow: {
      type: Boolean,
      default: false,
    },
    createPerson: {
      type: String,
      default: "",
    },
    dateFormat: {
      type: String,
      default: "YYYY.MM.DD",
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    hint: {
      type: String | Boolean,
      default: "(不超过50M)",
    },
    sizeLimit: {
      //单文件上传大小限制
      type: Number | String | Boolean,
      default: 50 * 1024 * 1024, //默认限制50M
    },
    fileList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    filedList: {
      type: Array,
      default: () => {
        return ["name", "size", "createPerson", "date"];
      },
    },
    max: {
      type: Number | String,
      default: 1995,
    },
    accept: {
      type: String,
      // default: ".gif, .jpg, .jpeg, .png",
      default: "",
    },
    onUpload: {
      //自动上传
      //必须返回Promise,且必须返回成功或者失败，否则状态不对
      type: Function,
    },
    onManualUpload: {
      //手动上传
      //必须返回Promise,且必须返回成功或者失败，否则状态不对
      type: Function,
    },
    onDelete: {
      //必须返回Promise,且必须返回成功或者失败，否则状态不对
      type: Function,
    },
    onPreview: {
      //自定义或者自身的自带preview=2选1
      type: Function,
    },
    onDownload: {
      //自定义或者自身的自带download=2选1
      type: Function,
    },
  },
  data() {
    return {
      id: `VEU${Math.random().toString().replace(".", "")}`,
      realFileList: [], //格式化后的文件列表
      manualUploadIndex: [], //手动上传的实际数据项索引
      loadingNum: 0,
      iconClass: {
        //img=>just show
        // txt: require("../src/assets/FileList/fujian_1.png"),
        // pdf: require("../src/assets/FileList/fujian_2.png"),
        // ppt: require("../src/assets/FileList/fujian_8.png"),
        // zip: require("../src/assets/FileList/fujian_10.png"),
        // excel: require("../src/assets/FileList/fujian_12.png"),
        // audio: require("../src/assets/FileList/fujian_14.png"),
        // video: require("../src/assets/FileList/fujian_15.png"),
        // word: require("../src/assets/FileList/fujian_16.png"),
        // file: require("../src/assets/FileList/fujian_17.png"),
        ...fileList,
      },
    };
  },
  watch: {
    fileList: {
      handler(val) {
        this.dataInitial(val);
      },
      immediate: true,
    },
    realFileList: {
      handler(val) {
        this.$emit("input", val);
      },
      immediate: true,
    },
  },
  computed: {
    isLoading() {
      return this.loadingNum > 0;
    },
  },
  methods: {
    dataInitial(list) {
      this.realFileList = list.map((item) => {
        // item.hasOwnProperty("already") || (item.already = true);
        const { fileSize } = item;
        return {
          ...item,
          already: true,
          type: util.getFileType(item),
          size: util.formatFileSize(fileSize), //文件名，根据接口返回信息去设置
        };
      });
    },
    showUpload() {
      this.isLoading || this.$refs[this.id].click();
    },
    checkfiledInfo(filed) {
      return this.filedList.includes(filed);
    },
    getFileUrl(file) {
      //获取文件地址
      let url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    hanldeFileChange(event) {
      //input file change
      const files = Array.from(event.target.files);
      const currentLh = this.realFileList.length; //提交前先查看文件长度
      files.forEach((file, index) => {
        if (this.checkExceed(currentLh, index + 1)) {
          this.$emit("exceed", file);
          return;
        } else if (this.checkSize(file)) {
          this.$emit("size-limit", file);
          return;
        } else {
          this.handleUpload(file);
        }
      });
    },
    handleView(file) {
      //查看文件
      if (this.onPreview && typeof this.onPreview === "function") {
        this.onPreview(file);
      } else {
        this.doPreview(file);
      }
    },
    handleDownload(file) {
      //查看文件
      if (this.onDownload && typeof this.onDownload === "function") {
        this.onDownload(file);
      } else {
        this.doDownload(file);
      }
    },
    doPreview(file) {
      // 从后台拿的文件如下download=window.open是blob
      const { type, url } = file;
      const openTypeList = ["pdf", "video", "audio"];
      if (openTypeList.includes(type)) {
        window.open(url);
      } else {
        this.doDownload(file);
      }
    },
    doDownload(file) {
      //下载
      const { type, url, name, blob } = file;
      if (type == "image") {
        window.open(url);
      } else if ("download" in document.createElement("a")) {
        // 非IE下载
        const elink = document.createElement("a");
        elink.download = name;
        elink.style.display = "none";
        // elink.href = URL.createObjectURL(blob);
        elink.href = url;
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      } else {
        // IE10+下载
        if (blob) {
          navigator.msSaveBlob(blob, name);
        } else {
          window.location.href(url);
        }
      }
    },
    checkExceed(pre, cur) {
      //pre当前总长
      //cur 当前是第几项，如果是第二项就+2，可能是这项越界
      return pre + cur > this.max ? true : false;
    },
    checkSize(file) {
      //pre当前总长
      //cur 当前是第几项，如果是第二项就+2，可能是这项越界
      return file.size > this.sizeLimit;
    },
    addLoading() {
      this.loadingNum++;
    },
    delLoading() {
      this.loadingNum--;
      this.loadingNum = this.loadingNum || 0;
    },
    handleUpload(blob) {
      if (this.onUpload && typeof this.onUpload === "function") {
        const cb = this.onUpload(blob);
        if (cb && cb.then) {
          this.addLoading();
          cb.then((param) => {
            //上传成功自定义方法需要提供id、createPerson等必要信息
            this.doAdd(blob, param);
          }).catch(() => {
            this.delLoading();
          });
        } else if (cb) {
          this.doAdd(blob, cb);
        }
      } else {
        this.doAdd(blob);
      }
    },
    doAdd(blob, param = false) {
      this.delLoading();
      const date = new Date();
      let item = {
        already: !!param, //有回调说明上传成功=>置为已经上传
        createPerson: this.createPerson,
        dateTime: date,
        date: this.formatDate(date),
        blob,
        name: blob.name,
        url: this.getFileUrl(blob),
        type: util.getFileType(blob),
        size: util.formatFileSize(blob.size || blob.fileSize), //文件名，根据接口返回信息去设置
      };
      typeof param === "object" && Object.assign(item, param);
      this.realFileList.push(item);
      this.$refs[this.id].value = null;
      this.$emit("after-upload", item);
    },
    formatDate(d = new Date()) {
      const fm = this.dateFormat || "YYYY.MM.DD";
      return dayjs(d).format(fm);
    },
    handleDelete(file) {
      const { already } = file;
      if (already && this.onDelete && typeof this.onDelete === "function") {
        const cb = this.onDelete(file);
        if (cb && cb.then) {
          this.addLoading();
          cb.then(() => {
            this.doRemove(file);
          }).catch(() => {
            this.delLoading();
          });
        } else if (cb != false) {
          this.doRemove(file);
        }
      } else {
        this.doRemove(file);
      }
    },
    doRemove(file) {
      this.delLoading();
      const index = this.realFileList.findIndex((item) => file === item);
      if (index >= 0) {
        this.realFileList.splice(index, 1);
        this.$emit("after-delete", file, index);
      }
    },
    manualUpload() {
      return new Promise((resolve, reject) => {
        if (typeof this.onManualUpload === "function") {
          let manualUploadIndex = [];
          const fileList = this.realFileList.filter((item, index) => {
            const io = !item.already;
            io && manualUploadIndex.push(index);
            return io;
          });
          if (fileList.length > 0) {
            this.manualUploadIndex = manualUploadIndex;
            this.addLoading();
            this.onManualUpload(fileList)
              .then((uploadList) => {
                this.setUpload(uploadList);
                this.delLoading();
                resolve();
              })
              .catch(() => {
                this.delLoading();
                reject();
              });
          } else {
            this.$emit("error-trap", {
              type: 0, //无上传数据
              msg: "请选择文件进行上传",
            });
            reject();
          }
        } else {
          this.$emit("error-trap", {
            type: 1, //未设置上传方法
            msg: "未设置上传方法",
          });
          reject();
        }
      });
    },
    setUpload(uploadList) {
      uploadList.forEach((item, index) => {
        const rs = this.realFileList[this.manualUploadIndex[index]];
        if (rs) {
          Object.assign(rs, { already: true, ...item });
        }
      });
    },
  },
  created() {},
};
</script>

<style scoped src="./main.css"></style>
