import { TableColumn } from "element-ui/types/table-column";
import { Table } from "ant-design-vue/types/table/table";
import { FormModelItem } from "ant-design-vue/types/form-model/form-item";
import { Component } from "vue";
type FormType =
  | "input"
  | "select"
  | "textarea"
  | "file"
  | "image"
  | "date"
  | "datetime"
  | "daterange"
  | "datetimerange"
  | "custom";
interface TableFormItem {
  /**会在表单 该项的上方生成一个小标题 */
  subtitle: string;
  /**colspan (针对modalform组件中的form)*/
  span: number;
  offset: number;
  /**字段标识符 */
  prop: string;
  searchProp: string;
  /**该字段在列表中展示时使用的标识符（例如一些后台翻译好的字典） */
  tableProp: string;

  /**字段中文名 */
  label: string;
  /**表格显示的字段名  如果没有则显示label */
  tableLabel: string;
  searchLabel: string;

  /**透传给表单input的属性 */
  inputProps: Object;
  /**透传给搜索表单input的属性 */
  searchInputProps: Object;
  /**透传给a-form-model-item的属性 */
  formItemProps: FormModelItem;
  /**透传给搜索a-form-model-item 的属性 */
  searchFormItemProps: FormModelItem;

  /**当formType为custom时会渲染该组件 会同时影响searchForm 和modalForm （属性传递请看源文件）*/
  component: Component;

  /**是否展示在列表中 */
  list: boolean;
  /**是否作为列表的查询参数 */
  search: boolean;
  /**是否展示在创建表单中（默认为true） */
  form: boolean;
  /**是否展示在编辑表单中（默认为true） */
  edit: boolean;

  /**字段表单类型 */
  formType: FormType;
  searchFormType: FormType;

  /** 字段默认值*/
  defaultValue: string;
  /** 字段默认值(查询参数)*/
  defaultSearchValue: string;

  /**--------传给formitem的一级属性----- */
  /** 字段校验*/
  rules: any[];

  /**-------传给formiteminput的一级属性------ */
  /**字典code  formType为select 会读取它 */
  dictCode: string;
  /**输入框最大输入长度 */
  maxLength: number;

  /** */
  labelColSpan: number; //影响modalform中label的宽度
}

interface ApiResult {
  success: boolean; //必须返回该值
  [key: string]: any;
}

interface Action {
  type: "table" | "tool" | "none"; //table是嵌入表格   tool是在tool栏 none不渲染  默认table
  btnText: string; //按钮的文案
  api:
    | string
    | ((formData: any) => Promise<ApiResult>)
    | ((searchParams: any) => Promise<ApiResult>);
  callback: (row: any, context: any) => void; //
  tag: "delete" /**点击后会有一个询问框 */ | undefined; //标注按钮身份  有些逻辑集成在protable中()
  show: (record: any) => boolean; //是否显示该按钮
}

/**
 * list（必填） | create | detail | update | delete 五组action会有默认值的处理 string类型会作为api的
 */
interface Actions {
  list: string | Function | Action;
  create: string | Function | Action;
  detail: string | Function | Action;
  update: string | Function | Action;
  delete: string | Function | Action;
  //可以无限扩展actions
  [key: any]: Action;
}

interface ProTableConfig {
  primaryKey: string | ((row) => any); //默认id
  fields: TableFormItem[];
  actions: Actions;
  outBtnNum: number; //默认是1，按照actions的排列顺序展示按钮
  spreadTableAction: boolean; //是否展开表格按钮
  alwaysSpreadSearch: boolean; //是否始终展开tool按钮

  tableProps: Table; //透传给table的属性
  labelWidth: String; //modalform 统一设置 label的宽度 默认100px
}
