<script>
    /**
     * 基于 Element-UI Table 组件封装的高阶表格组件，可无缝支持 element 的 table 组件。
     * 目前Table Attributes、Table Events、Table Methods、Table-column Attributes 完全对齐element-ui。以下为新增或有改动的配置
     * @author chenganxu <https://github.com/cgxqd/c-table>
     * @param {Array} data 表格显示数据，对应el-table data属性
     * @param {boolean} isLoading 表格组件是否显示loading 默认false
     * @param {string} align 配置表格全局table-column的对齐方式 ，默认值：'center'
     * @param {Object[]} config 配置表格的el-table-column
     * @param {string} config[].align 配置表格 el-table-column 对应列的对齐方式，权级高于c-table 的 align属性
     * @param {boolean} config[].shopTip|config[].showOverFlowTooltip 当前内容过长被隐藏时显示tooltip
     * @param {HTMLElement|function|string|*} config[].render 当前内容渲染，全能属性，类似Vue的render函数。
     * @param {boolean} has-pag 是否启动分页，默认不启动
     * @param {function} init 触发分页的请求函数
     * @param {Object} pagination 分页的配置信息
     * @param {number} pagination.page 当前页数
     * @param {number} pagination.pageSize 每页多少条个数
     * @param {number} pagination.total 总条目数
     * @param {Array} pageSizes 每页希纳是个数选择器的选项配置
     * @param {string} layout 组件布局 子组件用逗号隔开
     **/
    export default {
        name: 'CTable',
        render(h) {
            /** 将中横杠命名转为驼峰命名 */
            let toUpperCaseKey = (obj, retObj = {}) => (Object.keys(obj).forEach(key => (retObj[/[A-Z]/g.test(key) ? key.replace(/[A-Z]/g, $1 => `-${$1.toLowerCase()}`) : key] = obj[key])), retObj);

            /** 渲染 el-table-column */
            let renderColumn = (item, index) => {
                let props;
                item.align = item.align ? item.align : this.align;
                props = {
                    props: {
                        ...Object.assign({key: index, 'show-overflow-tooltip': item.showTip}, toUpperCaseKey(item))
                    }
                }

                if (this.showColumn(item.isShow)) {
                    /** 序号或者选择 */
                    if (item.type == 'index' || item.type == 'selection') {
                        return <el-table-column {...props}/>
                    }
                    /** 非 slot 情况 */
                    else if (!item.slot) {
                        return <el-table-column {...props} {...{
                            scopedSlots: {
                                default: ({row, ...arg}) => {
                                    let renderEle, retVal
                                    if (item.render) {
                                        renderEle = typeof (item.render) == 'function' ? (retVal = item.render(row[item.prop], {row, ...arg}, h), retVal ? retVal : item.render) : item.render;
                                        return renderEle.constructor.name == this.$vnode.constructor.name ? renderEle : h('span', renderEle)
                                    } else {
                                        return h('span', row[item.prop] || row[item.prop] === 0 ? row[item.prop] : '----')
                                    }
                                }
                            }
                        }}/>
                    }
                    /** slot情况 */
                    else if (item.slot) {
                        return <el-table-column {...props} {...{
                            scopedSlots: {
                                default: ({...arg}) => this.$scopedSlots[item.slot]({...arg})
                            }
                        }} />
                    }
                }
            };

            /** 多级表头 */
            let multisetTableHeader = (index, item, child, ele) => {
                let props
                let ret = child ? child : item
                ret.align = ret.align ? ret.align : this.align
                props = {
                    props: {
                        ...Object.assign({key: index}, toUpperCaseKey(ret))
                    }
                }
                return h('el-table-column', {...props}, ele)
            }

            /** 使用递归实现多级表头 */
            let renderTableColumn = (config) => {
                return config.map((item, index) => {
                    if (Array.isArray(item.children) && this.showColumn(item.isShow)) {
                        return multisetTableHeader(
                            index, item, null, item.children.map((child, childIndex) => {
                                if (child.children && this.showColumn(child.isShow)) {
                                    return multisetTableHeader(childIndex, item, child, renderTableColumn(child.children))
                                }
                                return renderColumn(child, childIndex)
                            })
                        )
                    }
                    return renderColumn(item, index)
                })
            }

            return <div class="c__table">
                <el-table
                    {...{
                        props: toUpperCaseKey(this.$attrs),
                        on: toUpperCaseKey(this.$listeners)
                    }}
                    data={this.data}
                    tableClassName={this.tableClassName}
                    tableStyle={this.tableStyle}
                    v-loading={this.isLoading}
                    ref='multipleTable'
                >{renderTableColumn(this.config)}</el-table>
                {this.hasPag && <div class="c__pagination">
                    <el-pagination current-page={this.pagination.page}
                                   page-size={this.pagination.pageSize}
                                   total={this.pagination.total}
                                   page-sizes={this.pageSizes}
                                   layout={this.layout}
                                   on-current-change={this.handleCurrentChange}
                                   on-size-change={this.handleSizeChange}
                    />
                </div>}
            </div>
        },
        computed: {
            showColumn(isShow) {
                return (isShow) => ((typeof isShow === 'boolean' && !isShow) ? false : true)
            }
        },
        mounted() {
            /** 将Table Methods 代理到当前作用域 this 中 */
            this.proxyMethods()
        },
        methods: {
            proxyMethods() {
                ["clearSelection", "toggleRowSelection", "toggleAllSelection", "toggleRowExpansion", "setCurrentRow", "clearSort", "clearFilter", "doLayout", "sort"]
                    .forEach(key => this[key] = this.$refs.multipleTable[key])
            },
            handleSizeChange(val) {
                this.pagination.pageSize = val
                this.init && this.init()
            },
            handleCurrentChange(val) {
                this.pagination.page = val
                this.init && this.init()
            },
        },
        props: {
            isLoading: Boolean,
            hasPag: Boolean,
            tableClassName: [String, Array, Object],
            tableStyle: [String, Array, Object],
            config: {
                type: Array,
                default: _ => []
            },
            data: {
                type: Array,
                default: _ => []
            },
            align: {
                type: String,
                default: 'center'
            },
            pagination: {
                type: Object,
                default: _ => ({})
            },
            pageSizes: {
                type: Array,
                default() {
                    return [20, 50, 100, 150]
                }
            },
            layout: {
                type: String,
                default() {
                    return 'total,sizes,prev,next,jumper'
                }
            },
            init: Function,
        }
    };
</script>
<style scoped>
    .c__pagination {
        display: flex;
        justify-content: center;
        margin-top: 10px;
    }
</style>