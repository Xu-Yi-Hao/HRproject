<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input style="margin-bottom:10px" type="text" prefix-icon="el-icon-search" size="small" @input="changeValue"
          v-model="queryParams.keyword" placeholder="输入员工姓名全员搜索" />
        <!-- 树形组件 -->
        <el-tree ref="deptTree" :data="departments" :props="defaultProps" default-expand-all :expand-on-click-node="false"
          highlight-current node-key="id" @current-change="selectNode">
        </el-tree>
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button size="mini" type="primary" @click="$router.push('/employee/detail')"
            v-permission="'add-employee'">添加员工</el-button>
          <el-button size="mini" @click="showExcelDialog = true">excel导入</el-button>
          <el-button size="mini" @click="exportEmployee">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table :data="list">
          <el-table-column prop="staffPhoto" align="center" label="头像">
            <template v-slot="{ row }">
              <el-avatar v-if="row.staffPhoto" :src="row.staffPhoto" :size="30"></el-avatar>
              <span v-else class="username">{{ row.username.charAt(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="mobile" label="手机号" sortable></el-table-column>
          <el-table-column prop="workNumber" label="工号" sortable></el-table-column>
          <el-table-column prop="formOfEmployment" label="聘用形式">
            <template v-slot="{ row }">
              <span>{{ row.formOfEmployment === 1 ? '正式' : row.formOfEmployment === 2 ? '非正式' : '无' }}</span>

            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门"></el-table-column>
          <el-table-column prop="timeOfEntry" label="入职时间" sortable></el-table-column>
          <el-table-column label="操作" width="280px">
            <template v-slot="{ row }">
              <el-button size="mini" type="text" @click="$router.push(`/employee/detail/${row.id}`)">查看</el-button>
              <el-button size="mini" type="text" @click="btnRole(row.id)">角色</el-button>
              <el-popconfirm @onConfirm="confirmDel(row.id)" title="确认删除该该行数据吗？">
                <el-button style="margin-left: 10px;" slot="reference" size="mini" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row style="height: 60px;" align="middle" type="flex" justify="end">
          <el-pagination layout="total, prev, pager, next" :total="total" :current-page="queryParams.page"
            :page-size="queryParams.pagesize" @current-change="changePage">
          </el-pagination>
        </el-row>
      </div>
    </div>
    <!-- 放置导入组件 -->
    <importExcel :show-excel-dialog.sync="showExcelDialog" @uploadSuccess="getEmployeeList"></importExcel>
    <!-- 弹出层 -->
    <el-dialog :visible.sync="showRoleDialog" title="分配角色" :close-on-click-modal="false">
      <!-- 弹出层内容 -->
      <el-checkbox-group v-model="roleIds">
        <el-checkbox v-for="item in roleList" :label="item.id" :key="item.id">{{ item.name }}</el-checkbox>
      </el-checkbox-group>
      <el-row justify="center" type="flex" slot="footer">
        <el-col :span="4">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="showRoleDialog = false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartment } from '@/api/department'
import { getEmployeeList, exportEmployee, delEmployee, getEnableRoleList, assignRole, getEmployeeInfo } from '@/api/employee'
import { transListToTreeData } from '@/utils'
import FileSaver from 'file-saver'
import importExcel from './components/import-excel.vue'
export default {
  name: 'Employee',
  data() {
    return {
      total: 0,
      departments: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      queryParams: {
        departmentId: null,
        page: 1,
        pagesize: 10,
        keyword: ''
      },
      list: [],
      showExcelDialog: false,
      showRoleDialog: false,
      roleList: [],
      roleIds: [],
      currentUserId: null
    }
  },
  components: { importExcel },
  created() {
    this.getDepartment(this.queryParams)
  },
  methods: {
    // 获取树形节点
    async getDepartment() {
      this.departments = transListToTreeData(await getDepartment(), 0)
      this.queryParams.departmentId = this.departments[0].id
      this.$nextTick(() => {
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId)
      })
      this.getEmployeeList()
    },
    // 选择节点查询员工列表
    selectNode(node) {
      this.queryParams.departmentId = node.id
      this.queryParams.page = 1
      this.getEmployeeList()
    },
    // 获取员工列表
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.queryParams)
      this.total = total
      this.list = rows
    },
    // 分页查询
    changePage(newPage) {
      this.queryParams.page = newPage
      this.getEmployeeList()
    },
    // 姓名模糊查询
    changeValue() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.queryParams.page = 1
        this.getEmployeeList()
      }, 1000);
    },
    // 导出员工excel
    async exportEmployee() {
      FileSaver.saveAs(await exportEmployee(), '员工信息表.xlsx')
    },
    // 删除员工
    async confirmDel(id) {
      await delEmployee(id)
      this.$message.success('删除员工数据成功')
      if (this.list.length === 1 & this.queryParams.page > 1) this.queryParams.page--
      this.getEmployeeList()
    },
    async btnRole(id) {
      this.roleList = await getEnableRoleList()
      this.currentUserId = id
      const { roleIds } = await getEmployeeInfo(id)
      this.roleIds = roleIds
      this.showRoleDialog = true
    },
    async btnOK() {
      const data = {
        id: this.currentUserId,
        roleIds: this.roleIds
      }
      await assignRole(data)
      this.$message.success('分配角色成功')
      this.showRoleDialog = false
    }
  },
}
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;

  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }

  .right {
    flex: 1;
    padding: 20px;

    .opeate-tools {
      margin: 10px;
    }

    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04C9BE;
      font-size: 12px;
      display: inline-block;
    }
  }
}
</style>