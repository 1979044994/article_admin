<template>
  <fs-page>
    <fs-crud ref="crudRef" v-bind="crudBinding" />
  </fs-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { AddReq, CreateCrudOptionsProps, CreateCrudOptionsRet, DelReq, dict, EditReq, useCrud, useFs, UserPageQuery, UserPageRes } from "@fast-crud/fast-crud";
import _ from "lodash-es";

//此处为crudOptions配置
const createCrudOptions = function ({ crudOptions, context }: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const {props,ctx} = context
  //本地模拟后台crud接口方法 ----开始
  const records = [{ id: 1, name: "Hello World", type: 1 }];
  const pageRequest = async (query: UserPageQuery): Promise<UserPageRes> => {
    return {  //由于上面request.transformRes配置了透传，所以此处返回的数据结构为fs-crud要求的结构：{records,currentPage,pageSize,total}
      records:[...records],
      currentPage: 1,
      pageSize: 20,
      total: records.length
    };
  };
  const editRequest = async ({ form, row }: EditReq) => {
    const target = _.find(records, (item) => {
      return row.id === item.id;
    });
    _.merge(target, form);
    return target;
  };
  const delRequest = async ({ row }: DelReq) => {
    _.remove(records, (item) => {
      return item.id === row.id;
    });
  };
  const addRequest = async ({ form }: AddReq) => {
    const maxRecord = _.maxBy(records, (item) => {
      return item.id;
    });
    form.id = (maxRecord?.id || 0) + 1;
    records.push(form);
    return form;
  };
  //本地模拟后台crud接口方法 -----结束

  // context.xxx = xxx //往上下文中可以放入自定义变量

  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest
      },
      columns: {
        name: {
          title: "姓名",
          type: "text",
          search: { show: true },
          column: {
            resizable: true,
            width: 200
          }
        },
        type: {
          title: "类型",
          type: "dict-select",
          dict: dict({
            data: [
              { value: 1, label: "开始" },
              { value: 0, label: "停止" }
            ]
          })
        }
      }
    }
  };
};

//此处为组件定义
export default defineComponent({
  name: "FsCrudHelloWorld",
  setup(props:any,ctx:any) {
    // 演示自定义变量传递, 将会传递给createCrudOptions
    const context: any = {
      props,ctx
    };
    //  =======你可以简写为下面这一行========
    const { crudRef, crudBinding, crudExpose } = useFs({ createCrudOptions, context });

    // 页面打开后获取列表数据
    onMounted(() => {
      crudExpose.doRefresh();
    });
    return {
      crudBinding,
      crudRef
    };
  }
});
</script>
