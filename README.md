# [c-table](https://github.com/cgxqd/c-table)

基于 `Element-UI` `Table` 组件封装的高阶表格组件，可无缝支持 element 的 table 组件。


## 安装

> 首先组件依赖 Element Table，先要安装 Element：
```bash
npm i element-ui
```

> 安装 c-table:
```bash
#npm
npm i @cgxqd/c-table
#yarn
yarn add @cgxqd/c-table
```


## 引入 Element、c-table
> 在 main.js 中写入以下内容：
```html
<script>
    import Vue from 'vue';
    import ElementUI from 'element-ui';
    import CTable from '@cgxqd/c-table'
    import 'element-ui/lib/theme-chalk/index.css';
    import App from './App.vue';

    Vue.use(ElementUI);
    Vue.use(CTable)

    new Vue({
        el: '#app',
        render: h => h(App)
    });
</script>
```

## 使用
> elementUI自带的属性方法，请参考[elementUi](https://element.eleme.io/#/zh-CN/component/installation)文档

>### 基础的表格
```html
<template>
    <c-table :data="tableData" :config="tableConfig" :isLoading="false" @selection-change="handleSelectionChange"></c-table>
</template>

<script>
    export default {
        data() {
            return {
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }],
                tableConfig: [
                    {type:'selection',width:60},
                    {label: '序号',type:'index',width:60},
                    {label: '日期',prop:'date'},
                    {label: '姓名',prop:'name'},
                    {label: '地址',prop:'address'},
                ]
            }
        },
        methods:{
            handleSelectionChange(v){},
        }   
    }
</script>
```

>### 含有分页的表格
```html
<template>
    <c-table :data="tableData" :config="tableConfig" has-pag :pagination="form" :init="init" ></c-table>
</template>

<script>
    export default {
        data() {
            return {
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }],
                tableConfig: [
                    {label: '日期',prop:'date'},
                    {label: '姓名',prop:'name'},
                    {label: '地址',prop:'address'},
                ],
                form:{
                    page:1,     
                    pageSize:20,     
                    total:0,     
                }
            }
        },  
        methods:{
            init(){
                 //触发请求函数 
            },
        },
    }
</script>
```

>### 多级表头
```html
<template>
    <div>
        <c-table :data='tableData' :config='tableConfig'></c-table>
    </div>
</template>
<script>

    export default {
        data() {
            return {
                tableData: [{
                    date: '2016-05-03',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-02',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-08',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-06',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-07',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }],
                tableConfig: [
                    {label: '日期', prop: 'date'},
                    {
                        label: '配送信息', children: [
                            {label:'姓名',prop:'name'},
                            {label:'省份',prop:'province'},
                            {label:'市区',prop:'city'},
                            {label:'地址',prop:'address'},
                            {label:'邮编',prop:'zip'},
                        ]
                    }
                ],
            };
        },
    };
</script>
```

>### render渲染
```html
    <script>
        export default {
            data(){
                return {
                    config:[
                        {label:'时间',prop:'time',render:this.filterTime},
                        {label:'金额',prop:'price',render:price=>`￥${price}`}
                        {label:'操作',render:<el-link type='primary'>编辑</el-link>},
                    ]
                }
            },
            methods:{
                filterTime(time,{row},h){
                    console.log(time);// 打印时间
                    console.log(row.time);// 打印时间
                    /**时间过滤 */
                    // return h('span',time);
                    return <span>{time}</span>
                }
            }       
        }   
    </script>
```

>### slot插槽
```html
    <template>
        <div>
            <c-table :data='tableData' :config='tableConfig'>
                <template slot="filterTime" slot-scope="{row}">{{row.time}}</template>
            </c-table>
        </div>
    </template>
    <script>
        export default {
            data(){
                return {
                    tableData:[],
                    config:[
                        {label:'时间',slot:'filterTime'},
                    ]
                }
            },   
        }   
    </script>
```

>### isShow是否显示当前列
```html
    <template>
        <div>
            <c-table :data='tableData' :config='tableConfig'></c-table>
        </div>
    </template>
    <script>
        export default {
            data(){
                return {
                    tableData: [{
                        date: '2016-05-02',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-04',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1517 弄'
                    }, {
                        date: '2016-05-01',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1519 弄'
                    }, {
                        date: '2016-05-03',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1516 弄'
                    }],
                    tableConfig: [
                        {label: '日期',prop:'date'},
                        {label: '姓名',prop:'name'},
                        {label: '地址',prop:'address'},
                        {label: '地址',isShow:false,render:<el-link>删除</el-link>},
                    ],
                }
            },   
        }   
    </script>
```
### c-table Methods
> 详细使用请参考 [Element Table Methods](https://element.eleme.io/#/zh-CN/component/table#table-methods)
```html
    <c-table ref='testRef' />
    // 调用方法 this.$refs.testRef.clearSelection()
```

### c-table Attributes && c-table Events
> 以下属性为新增属性，其他具体的属性设置可以参考 [Element Table Attributes](https://element.eleme.io/#/zh-CN/component/table#table-column-attributes) 、[Table Events](https://element.eleme.io/#/zh-CN/component/table#table-events)文档

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| isLoading | 表格组件是否显示loading | Boolean | - | false |
| align | 配置表格全局table-column的对齐方式 | String | left/center/right | center |
| tableClassName | 给el-table 设置 className | String/Object/Array | - | - |
| tableStyle | 给el-table 设置 style | String/Object/Array | - | - |
| has-pag | 是否启动分页 | Boolean | - | false |
| init | 触发分页的请求函数 | Function | - | - |
| layout | 组件布局 子组件用逗号隔开 | String | - | total,sizes,prev,next,jumper |
| pageSizes | 每页希纳是个数选择器的选项配置 | Array | - | [20, 50, 100, 150] |
| pagination | 分页的配置信息 | Object | - | - |
| config | 配置表格的el-table-column | Array | - | [] |


### pagination
>具体的属性设置可以参考 [Element Pagination](https://element.eleme.io/#/zh-CN/component/pagination) 文档

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| page | 当前页数 | Number | - | 1 |
| page-size | 每页多少条个数 | Number | - | 20 |
| total | 总条目数 | Number | - | - |

### config
>config 中每项的配置项其实就是 Element Table-column 上的 props 属性，具体的属性设置可以参考 [Element Table-column](https://element.eleme.io/#/zh-CN/component/table#table-column-attributes) 文档，以下为新增属性。

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| render | 渲染属性 | function(cellValue,{row,column,$index},h),HTMLElement,String,* | - | - |
| slot | 插槽名 | String | - | - |
| isShow | 当前列是否显示 | Boolean | - | true |
