<template>
    <div>
        <el-dialog
            title="创建三级代理"
            :visible.sync="showMakeCode"
            :close-on-click-modal=false
            :show-close=false
            width="40%">
            <div>
                <el-form ref="addForm" :model="addData" :rules="addRules" label-width="100px">
                    <el-form-item label="代理账号">
                        <el-input v-model="addData.code" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" placeholder="输入密码" v-model="addData.password" maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="realname">
                        <el-input placeholder="请输入姓名" v-model="addData.realname"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input placeholder="请输入手机号" v-model="addData.mobile" maxlength="11"></el-input>
                    </el-form-item>
                    <el-form-item label="QQ">
                        <el-input placeholder="请输入QQ" v-model="addData.qq" maxlength="10"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <el-input placeholder="请输入邮箱" v-model="addData.email"></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input type="textarea" v-model="addData.remark"></el-input>
                    </el-form-item>
                    <el-form-item label="其他联系方式">
                        <el-input placeholder="请输入其他联系方式" v-model="addData.otherc"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="hideDialog('addForm')">取 消</el-button>
                <el-button type="primary" @click="addSubmit('addForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { agentSubordinateMakeCodoApi, agentSubordinateAddApi } from '../../http/api'
    export default {
        props: ['showMakeCode'],
        data () {
            return {
                showLoading: true,
                addData:{
                    code: "loading..",
                    password: "",
                    realname: "",
                    mobile: "",
                    qq: "",
                    email: "",
                    remark: "",
                    status: 1,
                    otherc: ""
                },
                addRules: {
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 20, message: '请输入6-20位密码', trigger: 'blur'}
                    ],
                    realname: [
                        { required: true, message: '请输入姓名', trigger: 'blur' },
                    ],
                    mobile: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        { min: 11, max: 11, message: '请输入手机号确认格式', trigger: 'blur'}
                    ],
                },
            }
        },
        methods: {
            addMakeCodeData () {
                var _this = this;
                agentSubordinateMakeCodoApi().then(res => {
                    _this.showLoading = false;
                    _this.addData.code = res.data.message.code
                }).catch(err => {
                    _this.showLoading = false;
                })
            },
            addSubmit (formName) {
                var _this = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _this.showLoading = true;
                        agentSubordinateAddApi(_this.addData).then(res => {
                            _this.showLoading = false;
                            _this.$emit('handleMakeCode', false);
                            _this.$message.success(res.data.message);
                            _this.$emit('agentSubordinateData')
                            _this.$refs[formName].resetFields();
                        }).catch(err => {
                            _this.showLoading = false;
                            _this.$message.error(err.message)
                        })
                    } else {
                        return false;
                    }
                });
            },
            hideDialog(formName) {
                this.$emit('handleMakeCode', false);
                this.$refs[formName].resetFields();
            }
        },
        mounted() {
            this.addMakeCodeData()
        },
    }
</script>