<template>
    <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible="showDialog" @close="close">
        <el-button type="primary" size="mini" @click="toFu">确定</el-button>
        <el-form ref="addDept" :model="formData" :rules="rules" label-width="120px">
            <el-form-item prop="name" label="部门名称">
                <el-input v-model="formData.name" placeholder="2-10个字符" style="width: 80%;" size="mini"></el-input>
            </el-form-item>
            <el-form-item prop="code" label="部门编码">
                <el-input v-model="formData.code" placeholder="2-10个字符" style="width: 80%;" size="mini"></el-input>
            </el-form-item>
            <el-form-item prop="managerId" label="部门负责人">
                <el-select v-model="formData.managerId" placeholder="请选择负责人" style="width: 80%;" size="mini">
                    <!-- 下拉选项 循环负责人数据 -->
                    <el-option v-for="item in managerList" :key="item.id" :label="item.username"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="introduce" label="部门介绍">
                <el-input v-model="formData.introduce" placeholder="1-100个字符" type="textarea" :rows="4" size="mini"
                    style="width: 80%;"></el-input>
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
</template>

<script>
import { getDepartment, getManagerList, addDepartment, getDepartmentDetail, updateDepartment } from '@/api/department'
export default {
    data() {
        return {
            showDialog: false,
            dialogTitle: '',
            // 部门负责人列表
            managerList: [],
            // 部门列表
            departments: [],
            formData: {
                code: '',   // 部门编码
                introduce: '',   // 部门介绍
                managerId: '',   // 部门负责人ID
                name: '',   // 部门名称
                pid: ''   // 父级部门ID
            },
            rules: {
                code: [
                    { required: true, message: '部门编码不能为空', trigger: 'blur' },
                    { min: 2, max: 10, message: '部门编码长度为2-10个字符' },
                    {
                        trigger: 'blur',
                        validator: (rule, value, callback) => {
                            // let result =this.departments
                            if (this.formData.id) {
                                this.departments = this.departments.filter(item => item.id !== this.formData.id)
                            }
                            if (this.departments.some(item => item.code === value)) {
                                callback(new Error('部门编码已存在'))
                            } else {
                                callback()
                            }
                        }
                    }
                ],
                introduce: [
                    { required: true, message: '部门介绍不能为空', trigger: 'blur' },
                    { min: 1, max: 100, message: '部门介绍长度为1-100个字符' }
                ],
                managerId: [
                    { required: true, message: '部门负责人不能为空', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '部门名称不能为空', trigger: 'blur' },
                    { min: 2, max: 10, message: '部门名称长度为2-10个字符' },
                    {
                        trigger: 'blur',
                        validator: (rule, value, callback) => {
                            if (this.formData.id) {
                                this.departments = this.departments.filter(item => item.id !== this.formData.id)
                            }
                            if (this.departments.some(item => item.name === value)) {
                                callback(new Error('部门名称已存在'))
                            } else {
                                callback()
                            }
                        }
                    }
                ],
            }
        }
    },
    created() {

    },
    props: {
        // showDialog: {
        //     type: Boolean,
        //     default: false
        // },
        // currentNodeId: {
        //     type: Number,
        //     default: null
        // },
        // dialogTitle: {
        //     type: String,
        //     default: '新增部门'
        // }
    },
    methods: {
        toFu() {
            this.$parent.colo()
        },
        init(type, row) {
            this.getDepartment()
            this.getManagerList()
            this.dialogType = type;
            this.id = row.id;
            if (type === 'add') {
                this.dialogTitle = '新增部门';

            } else {
                this.dialogTitle = '编辑部门';
                this.formData = { ...row }
            }
            this.showDialog = true;
        },
        close() {
            // this.$emit('update:showDialog', false)
            this.$nextTick(() => { this.showDialog = false; this.$refs.addDept.resetFields() })
        },
        async getManagerList() {
            this.managerList = await getManagerList()
        },
        async getDepartment() {
            this.departments = await getDepartment()
        },
        btnOK() {
            this.$emit('makeSure', this.dialogType, this.formData, this.id);
            // this.$parent.makeSure(this.dialogType, this.formData)
            this.showDialog = false;
            this.formData = {};
            // this.$refs.addDept.validate(async isOK => {
            //     if (isOK) {
            //         if (this.dialogTitle === '新增部门') {
            //             await addDepartment({ ...this.formData, pid: this.currentNodeId })
            //             this.$message.success('新增部门成功')
            //         } else {
            //             await updateDepartment(this.formData)
            //             this.$message.success('修改部门成功')
            //         }
            //         // 通知父组件更新
            //         this.$emit('updateDepartment')
            //         this.close()
            //     }
            // })
        },
        // async getDepartmentDetail() {
        //     this.formData = await getDepartmentDetail(this.currentNodeId)
        // },
    }
}
</script>

<style></style>