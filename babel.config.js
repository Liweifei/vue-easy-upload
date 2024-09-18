module.exports = {
  presets: [
    ['@vue/cli-plugin-babel/preset', {
      useBuiltIns: 'usage',
      forceAllTransforms: true
    }]
  ],
  "plugins": [
    [
      "import",
      {
        "libraryName": "vxe-table",
        "style": true // 样式是否也按需加载
      }
    ]
  ]
}
