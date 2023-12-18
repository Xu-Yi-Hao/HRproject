<template>
  <div class="container">
    <div class="app-container">
      <el-button class="btn-add" size="mini" type="primary" @click="addPermission(0, 1)">添加权限</el-button>
      <el-table :data="list" row-key="id" default-expand-all>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="code" label="标识"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button size="mini" type="text" v-if="row.type === 1" @click="addPermission(row.id, 2)">添加</el-button>
            <el-button size="mini" type="text" @click="editPer(row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="delPer(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- Form -->
    <el-dialog title="新增权限点" :visible.sync="showDialog" width="500px" :close-on-click-modal="false" @close="close">
      <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width: 300px;" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width: 300px;" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="formData.description" style="width: 300px;" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="启用" prop="enVisible">
          <el-switch active-value="1" inactive-value="0" v-model="formData.enVisible" size="mini"></el-switch>
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col>
          <el-button size="mini" type="primary" @click="btnOK">确定</el-button>
          <el-button size="mini" @click="close">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { transListToTreeData } from '@/utils'
import { getPermissionList, addPermission, getPermission, updatePermission, delPermission } from '@/api/permission'
export default {
  name: 'Permission',
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: '',
        code: '',
        description: '',
        enVisible: '0',
        type: '',
        pid: ''
      },
      rules: {
        name: [
          { required: true, trigger: 'blur', message: '权限名称不能为空' },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.list.some(item => item.name === value)) {
                callback(new Error('权限名称已存在'))
              }
              callback()
            }
          }
        ],
        code: [
          { required: true, trigger: 'blur', message: '权限标识不能为空' },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.list.some(item => item.code === value)) {
                callback(new Error('权限标识已存在'))
              }
              callback()
            }
          }
        ]
      }
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      this.list = transListToTreeData(await getPermissionList(), 0)
    },
    addPermission(pid, type) {
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },
    close() {
      this.showDialog = false
      this.formData = {
        name: '',
        code: '',
        description: '',
        enVisible: '0',
        type: '',
        pid: ''
      }
    },
    btnOK() {
      this.$refs.perForm.validate(async isOK => {
        if (isOK) {
          if (this.formData.id) {
            await updatePermission(this.formData)
            this.$message.success('修改权限成功')
          } else {
            await addPermission(this.formData)
            this.$message.success('新增权限成功')
          }
          this.getPermissionList()
        }
        this.close()
      })
    },
    async editPer(id) {
      this.formData = await getPermission(id)
      this.showDialog = true
    },
    async delPer(id) {
      try {
        await this.$confirm('确定要删除该数据吗')
        await delPermission(id)
        this.getPermissionList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error);
      }
    }
  },
}
</script>

<style scoped>
.btn-add {
  margin: 10px;
}
</style>