<template>
  <div class="container">
    <div class="app-container">
      <!-- 展示树形结构 -->
      <el-tree :data="departments" :props="defaultProps" default-expand-all :expand-on-click-node="false">
        <!-- 节点结构 -->
        <template v-slot="{ data }">
          <el-row style="width: 100%;height: 40px;" type="flex" justify="space-between" align="middle">
            <el-col>{{ data.name }}</el-col>
            <el-col :span="4">
              <span class="tree-manager">{{ data.managerName }}</span>
              <el-dropdown @command="operateDept($event, data)">
                <!-- 显示区域内容 -->
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <!-- 下拉菜单选项 -->
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="del">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
    <!-- 放置弹层 -->
    <!-- <AppDept ref="addDept" @updateDepartment="getDepartment" :show-dialog.sync="showDialog"
      :current-node-id="currentNodeId" :dialog-title="dialogTitle"></AppDept> -->
    <AppDept ref="addDeptRef" @makeSure="makeSure" />
  </div>
</template>
<script>
import { getDepartment, delDepartment, addDepartment, updateDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'
import AppDept from './components/add-dept.vue'
export default {
  name: 'Department',
  components: { AppDept },
  data() {
    return {
      dialogTitle: '',
      currentNodeId: null, // 存储当前点击的id
      showDialog: false, // 控制弹层的隐藏显示
      departments: [],  // 数据属性
      defaultProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    // 封装获取列表数据方法
    async getDepartment() {
      const result = await getDepartment()
      this.departments = transListToTreeData(result, 0)
    },
    async makeSure(type, val, id) {
      switch (type) {
        case 'add':
          // 掉新增接口
          // 少了个pid的参数
          await addDepartment({ ...val, pid: id })
          this.$message.success('新增部门成功')
          this.getDepartment()
          break;
        case 'edit':
          // 掉编辑接口
          updateDepartment(val)
          this.$message.success('修改部门成功')
          this.getDepartment()
          break;

        default:
          break;
      }
    },
    // 操作部门方法
    operateDept(type, row) {

      switch (type) {
        case 'add':
          this.$refs.addDeptRef.init(type, row);
          break;
        case 'edit':
          this.$refs.addDeptRef.init(type, row);
          break;
        case 'del':
          // 打开删除弹框 传id
          this.$confirm('您确认要删除该部门吗', { confirmButtonText: '确定', cancelButtonText: '取消', }).then(async () => {
            await delDepartment(row.id)
            this.$message.success('删除成功!');
            this.getDepartment()
          }).catch(() => {
            this.$message.info('已取消删除');
          });
          break;

        default:
          break;
      }
      // if (type === 'add') {
      //   // 添加子部门
      //   this.dialogTitle = '新增部门'
      //   this.showDialog = true // 显示弹层
      //   this.currentNodeId = id
      // } else if (type === 'edit') {
      //   this.dialogTitle = '编辑部门'
      //   // 编辑部门
      //   this.showDialog = true
      //   this.currentNodeId = id
      //   this.$nextTick(() => {
      //     this.$refs.addDept.getDepartmentDetail()
      //   })
      // } else {
      //   // 删除部门
      //   this.$confirm('您确认要删除该部门吗', { confirmButtonText: '确定', cancelButtonText: '取消', }).then(async () => {
      //     await delDepartment(id)
      //     this.$message.success('删除成功!');
      //     this.getDepartment()
      //   }).catch(() => {
      //     this.$message.info('已取消删除');
      //   });
      // }
    },
    // operateDept(type, id) {
    //   if (type === 'add') {
    //     // 添加子部门
    //     this.dialogTitle = '新增部门'
    //     this.showDialog = true // 显示弹层
    //     this.currentNodeId = id
    //   } else if (type === 'edit') {
    //     this.dialogTitle = '编辑部门'
    //     // 编辑部门
    //     this.showDialog = true
    //     this.currentNodeId = id
    //     this.$nextTick(() => {
    //       this.$refs.addDept.getDepartmentDetail()
    //     })
    //   } else {
    //     // 删除部门
    //     this.$confirm('您确认要删除该部门吗', { confirmButtonText: '确定', cancelButtonText: '取消', }).then(async () => {
    //       await delDepartment(id)
    //       this.$message.success('删除成功!');
    //       this.getDepartment()
    //     }).catch(() => {
    //       this.$message.info('已取消删除');
    //     });
    //   }
    // }
  },
}
</script>

<style lang="css" scoped>
.app-container {
  padding: 30px 140px;
  font-size: 14px;
}

.tree-manager {
  width: 50%;
  display: inline-block;
  margin: 10px;
}
</style>
