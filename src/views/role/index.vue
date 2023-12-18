<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button @click="showDialog = true" type="primary" size="mini">添加角色</el-button>
      </div>
      <!-- 放置table组件 -->
      <el-table :data="list">
        <!-- 放置列 -->
        <el-table-column prop="name" width="200px" align="center" label="角色">
          <template v-slot="{ row }">
            <!-- 条件判断 -->
            <el-input v-if="row.isEdit" size="mini" v-model="row.editRow.name"></el-input>
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" width="200px" align="center" label="启用">
          <!-- 自定义列结构 -->
          <template v-slot="{ row }">
            <el-switch v-if="row.isEdit" size="mini" :active-value="1" :inactive-value="0"
              v-model="row.editRow.state"></el-switch>
            <span v-else>{{ row.state === 1 ? '已启用' : row.state === 0 ? '未启用' : '无' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" align="center" label="描述">
          <template v-slot="{ row }">
            <!-- 条件判断 -->
            <el-input v-if="row.isEdit" size="mini" v-model="row.editRow.description"></el-input>
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <!-- 放置操作按钮 -->
          <template v-slot="{ row }">
            <template v-if="row.isEdit">
              <el-button type="primary" size="mini" @click="btnEditOK(row)">确定</el-button>
              <el-button type="default" size="mini" @click="row.isEdit = false">取消</el-button>
            </template>
            <template v-else>
              <el-button size="mini" type="text" @click="btnPermission(row.id)">分配权限</el-button>
              <el-button size="mini" @click="btnEditRow(row)" type="text">编辑</el-button>
              <el-popconfirm @onConfirm="confirmDel(row.id)" title="这一段内容确定删除吗？">
                <el-button style="margin-left: 10px;" slot="reference" size="mini" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 放置分页组件 -->
      <el-row type="flex" justify="end" style="height: 60px;" align="middle">
        <el-pagination layout="prev, pager, next" :current-page="pageParams.page" :page-size="pageParams.pagesize"
          :total="pageParams.total" @current-change="changePage">
        </el-pagination>
      </el-row>
    </div>
    <!-- 放置弹层 -->
    <el-dialog title="新增角色" width="500px" :close-on-click-modal="false" :visible.sync="showDialog" @close="close">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" style="width: 300px;" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="启用" prop="state">
          <el-switch :active-value="1" :inactive-value="0" v-model="roleForm.state" size="mini"></el-switch>
        </el-form-item>
        <el-form-item prop="description" label="角色名描述">
          <el-input v-model="roleForm.description" type="textarea" :rows="3" style="width: 300px;" size="mini"></el-input>
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button type="primary" size="mini" @click="btnOK">确定</el-button>
              <el-button type="default" size="mini" @click="close">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 角色分配权限弹出层 -->
    <el-dialog title="分配权限" :close-on-click-modal="false" :visible.sync="showPermissionDialog">
      <!-- 放置权限数据 -->
      <el-tree ref="permTree" :data="permissionData" show-checkbox default-expand-all :default-checked-keys="permIds"
        check-strictly node-key="id" :props="{ label: 'name' }">
      </el-tree>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="assignPrem">确定</el-button>
          <el-button size="small" @click="showPermissionDialog = false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList, addRole, updateRole, DelRole, getRoleDetail, assignPrem } from '@/api/role'
import { getPermissionList } from '@/api/permission'
import { transListToTreeData } from '@/utils'
export default {
  name: 'Role',
  data() {
    return {
      showDialog: false,
      list: [],
      pageParams: {
        page: 1,
        pagesize: 5,
        total: 0,
      },
      roleForm: {
        name: '',
        description: '',
        state: 0 // 默认未启用
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }],
      },
      showPermissionDialog: false,
      permissionData: [],
      currentRoleId: null,
      permIds: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows, total } = await getRoleList(this.pageParams)
      this.list = rows
      this.pageParams.total = total
      // 针对每一行数据添加一个编辑标记
      this.list.forEach(item => {
        // item.isEdit = false // 添加一个标记
        this.$set(item, 'isEdit', false)
        this.$set(item, 'editRow', {
          name: item.name,
          state: item.state,
          description: item.description
        })
      })
    },
    changePage(newPage) {
      this.pageParams.page = newPage
      this.getRoleList()
    },
    close() {
      this.showDialog = false
      this.$refs.roleForm.resetFields()
    },
    btnOK() {
      this.$refs.roleForm.validate(async isOK => {
        if (isOK) {
          console.log(this.roleForm);
          await addRole(this.roleForm)
          this.$message.success('新增角色成功')
          this.getRoleList()
        }
        this.close()
      })
    },
    btnEditRow(row) {
      row.isEdit = true
      row.editRow.name = row.name
      row.editRow.description = row.description
      row.editRow.state = row.state
    },
    async btnEditOK(row) {
      if (row.editRow.name && row.editRow.description) {
        await updateRole({ ...row.editRow, id: row.id })
        this.$message.success('更新角色成功')
        Object.assign(row, {
          ...row.editRow,
          isEdit: false
        })
      } else {
        this.$message.warning('角色信息和角色描述不能为空')
      }
    },
    async confirmDel(id) {
      await DelRole(id)
      this.$message.success('删除角色成功')
      if (this.list.length === 1) this.pageParams.page--
      this.getRoleList()

    },
    async btnPermission(id) {
      this.currentRoleId = id
      const { permIds } = await getRoleDetail(id)
      this.permIds = permIds
      this.permissionData = transListToTreeData(await getPermissionList(), 0)
      this.showPermissionDialog = true
    },
    async assignPrem() {
      const data = {
        id: this.currentRoleId,
        permIds: this.$refs.permTree.getCheckedKeys()
      }
      await assignPrem(data)
      this.$message.success('分配权限成功')
      this.showPermissionDialog = false
    }
  },
}
</script>

<style scoped>
.role-operate {
  padding: 10px;
}
</style>