import "../src/assets/icon/iconfont.css";
import C from './template.vue';
//凡是vue插件一定有这个方法。目的是use使用，fn直接当作install方法，返回对象的话就需要个install方法

const Upload = function (Vue) {
    Vue.component(C.name, C) 
}
export default Upload;