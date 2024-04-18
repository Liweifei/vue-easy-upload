## vue-easy-upload(当前版本 V1.0.8)

> 简单、高效的 vue 文件上传组件

## 兼容版本

Vue2.x

## Install

```javascript
	npm i vue-easy-upload -S

	//main.js
	import veu from "vue-easy-upload";
	Vue.use(veu)

	//使用示例
	<vue-easy-upload
      :file-list="fileList"
      ref="veu"
      create-person="lwf"
      multiple
      max="4"
    >
    </vue-easy-upload>
```

## 效果图

![效果图](https://github.com/Liweifei/vue-easy-upload/blob/master/demo.jpg?raw=true)

## Attribute

| 属性                 | 类型                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                     | 默认                                  | 是否必传 |
| -------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | -------- |
| v-model              | Array                 | 列表实时数据                                                                                                                                                                                                                                                                                                                                                                                             | []                                    | false    |
| file-list            | Array                 | 默认文件信息                                                                                                                                                                                                                                                                                                                                                                                             | []                                    | false    |
| no-btn               | Boolean               | 不需要上传按钮，按钮可自定义，通过 showUpload 呼起，如$refs.veu.showUpload()                                                                                                                                                                                                                                                                                                                             | false                                 | false    |
| title                | String                | 按钮名                                                                                                                                                                                                                                                                                                                                                                                                   | 添加附件                              | false    |
| double-row           | Boolean               | 文件信息分两排展示                                                                                                                                                                                                                                                                                                                                                                                       | false                                 | false    |
| create-person        | String                | 文件上传的人员信息                                                                                                                                                                                                                                                                                                                                                                                       | ""                                    | false    |
| date-format          | String                | 默认日期格式                                                                                                                                                                                                                                                                                                                                                                                             | YYYY.MM.DD                            | false    |
| readonly             | Boolean               | 只读/不可用(自定义事件 showUpload 不受此影响)                                                                                                                                                                                                                                                                                                                                                            | false                                 | false    |
| always-show-btn      | Boolean               | 是否总是提供下载及删除按钮                                                                                                                                                                                                                                                                                                                                                                               | false                                 | false    |
| multiple             | Boolean               | 多选                                                                                                                                                                                                                                                                                                                                                                                                     | false                                 | false    |
| hint                 | String/Boolean        | 上传按钮旁提示信息                                                                                                                                                                                                                                                                                                                                                                                       | (不超过 50M)                          | false    |
| size-limit           | Number/String/Boolean | 单文件上传大小限制                                                                                                                                                                                                                                                                                                                                                                                       | 50 _ 1024 _ 1024                      | false    |
| filed-list           | Array                 | 列表可显示字段，可选项 name,size,createPerson,date                                                                                                                                                                                                                                                                                                                                                       | ["name","size","createPerson","date"] | false    |
| max                  | Number/String         | 最大可上传数量                                                                                                                                                                                                                                                                                                                                                                                           | 1995                                  | false    |
| accept               | String                | 同 input 的 accept                                                                                                                                                                                                                                                                                                                                                                                       | ""                                    | false    |
| **on-upload**        | Function              | **重要**，文件立即上传模式。选择文件后调用上传文件的实际方法,函数将返回 file（file 类型,若一次选择多个，则会调用多次）。注意必须返回 Promise,且（若是上传成功，请返回一个数组对象如 resolve([{id:555}])，对象应当为文件的必要存储信息，如 id 等，这些数据将会合并到文件项，后续会在如删除等操作中返回给调用者）或者失败，若不填则不立即调用上传接口，可配置成手动点击上传模式（即配置 on-manual-upload） | 无                                    | false    |
| **on-manual-upload** | Function              | **重要**，文件手动上传模式。选择文件后不立即调用上传接口,可调用接口再执行上传，即$refs.veu.manualUpload()。函数将返回未执行过上传的文件列表（Array 类型），注意必须返回 Promise,且必须返回（若是上传成功，请返回一个数组如 resolve([{id:555},{id:666}])，对象应当为文件的必要存储信息，如 id 等，这些数据将会合并到文件项，后续会在如删除等操作中回调）成功或者失败                                      |
| **on-delete**        | Function              | **重要**，删除操作方法，若可删除数据库数据，请必须配置此项！这是真正的执行方法，函数返回当前项数据（若没有上传到数据库，则不会发起此回调，ps 你不需要判断是否已上传），若没有配置，则会直接在当前列表中删除，注意必须返回 Promise,且必须返回成功或者失败                                                                                                                                                 | 无                                    | false    |
| on-preview           | Function              | 预览操作回调，注意，若不配置此项，则默认执行组件本身的预览方案，若配置此项，则执行自定义的，函数返回当前数据项                                                                                                                                                                                                                                                                                           | 无                                    | false    |
| on-download          | Function              | 下载按钮操作回调，注意，若不配置此项，则默认执行组件本身的下载方案，若配置此项，则执行自定义的，函数返回当前数据项                                                                                                                                                                                                                                                                                       | 无                                    | false    |

## emit 回调函数

| 函数名       | 说明                                           | 返回值                                                                  |
| ------------ | ---------------------------------------------- | ----------------------------------------------------------------------- |
| exceed       | 文件数量上限                                   | file                                                                    |
| size-limit   | 文件体积过大                                   | file                                                                    |
| after-upload | 文件添加成功（若是立即上传到后台，则等待回调） | file                                                                    |
| after-delete | 文件删除成功（若有配置函数，则等待回调）       | file                                                                    |
| error-trap   | 手动点击上传的回调                             | Object(msg:提示信息，type=0 无上传数据，type=1 未配置 on-manual-upload) |

## slot

| name        | 说明                                   |
| ----------- | -------------------------------------- |
| title       | 按钮文字                               |
| sizelabel   | 文件体积前缀，配置 double-row 才会生效 |
| personLabel | 创建人前缀，配置 double-row 才会生效   |
| dateLabel   | 上传日期前缀，配置 double-row 才会生效 |
| preview     | 预览操作按钮                           |
| download    | 下载操作按钮                           |
| delete      | 删除操作按钮                           |

## Other

1、后继会继续更新 vue3 版本

2、如果有其他问题邮件沟通1195669615@qq.com或者加 qq1195669615。若插件能够帮助到您，期待您的 star 哦！
