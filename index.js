import CTable from './src/table'

/* istanbul ignore next */
CTable.install = function (Vue) {
    Vue.component(CTable.name, CTable)
}
export default CTable