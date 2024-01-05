import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
import { FastCrud } from "@fast-crud/fast-crud";
import "@fast-crud/fast-crud/dist/style.css";
import ui from "@fast-crud/ui-element";
import "dayjs/locale/zh-cn";
createApp(App).use(ui).use(FastCrud, {
  // i18n, //i18n配置，可选，默认使用中文，具体用法请看demo里的 src/i18n/index.js 文件
  // 此处配置公共的dictRequest（字典请求）
  // async dictRequest({ dict }) {
  //   return await request({ url: dict.url }); //根据dict的url，异步返回一个字典数组
  // },
  //公共crud配置
  commonOptions() {
    return {
      request: {
        //接口请求配置
        //你项目后台接口大概率与fast-crud所需要的返回结构不一致，所以需要配置此项
        //请参考文档http://fast-crud.docmirror.cn/api/crud-options/request.html
        transformQuery: ({ page, form, sort }) => {
          //转换为你pageRequest所需要的请求参数结构
          return { page, form, sort };
        },
        transformRes: ({ res }) => {
          //将pageRequest的返回数据，转换为fast-crud所需要的格式
          //return {records,currentPage,pageSize,total};
          return { ...res }
        }
      },

      };
  },
}).use(ElementPlus, { size: "small", locale: zhCn }).mount('#app')
