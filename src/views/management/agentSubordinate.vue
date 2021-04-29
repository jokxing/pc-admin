<template>
    <div v-loading.fullscreen="showLoading">
        <h4 class="title agent_subordinate">
            下级管理
            <el-button class="primary-button" size="medium" icon="el-icon-circle-plus-outline" @click="showMakeCode = true">
                创建<span v-if="level_id == 2">三</span><span v-if="level_id == 1">二</span>级代理
            </el-button>
        </h4>

        <el-row>
            <el-table
                ref="table"
                :data="tableData"
                border
                style="width: 100%"
                v-loading="tableLoading">
                <el-table-column
                    prop="id"
                    label="编号"
                    width="60">
                </el-table-column>
                <el-table-column
                    label="下级代理"
                    width="90">
                        <template slot-scope="scope">
                            <div v-if="level_id != 1">
                                {{ scope.row.code }}
                            </div>
                            <router-link :to="'/agentSubordinate/threeLevelAgency/' + scope.row.id" v-if="level_id == 1">
                                {{ scope.row.code }}
                            </router-link>
                        </template>
                </el-table-column>
                <el-table-column
                    prop="realname"
                    label="姓名">
                </el-table-column>
                <el-table-column
                    prop="money"
                    label="代理余额"
                    width="96">
                </el-table-column>
                <el-table-column
                    prop="cmoney"
                    label="彩金余额"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="status_text"
                    label="状态"
                    width="80">
                    <template slot-scope="scope">
                        <span 
                            :class="{ red: scope.row.status_text == '锁定', green: scope.row.status_text == '启动' }">
                            {{ scope.row.status_text }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="其它"
                    width="60">
                        <template slot-scope="scope">
                            <i class="iconfont primary-color" :class="{ 'icon-plus': !scope.row.showOther, 'icon-reduce': scope.row.showOther }" @click="toogleExpand(scope.row)"></i>
                        </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="182">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="启动" placement="top">
                                <i class="iconfont icon-qdong" @click="statusUpdate(scope.row,1)" v-if="scope.row.status_text == '锁定'"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="锁定" placement="top">
                                <i class="iconfont icon-close-b" @click="statusUpdate(scope.row,0)" v-if="scope.row.status_text == '启动'"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="编辑详情与资料" placement="top">
                                <i class="el-icon-edit-outline" @click="hanldEdit(scope.row)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="重置登陆密码" placement="top">
                                <i class="iconfont icon-password" @click="hanldLoginPwd(scope.row)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="重置支付密码" placement="top">
                                <i class="iconfont icon-1" @click="hanldPayPwd(scope.row)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="转账" placement="top">
                                <i class="iconfont icon-weibiaoti5" @click="hanldRechange(scope.row)"></i>
                            </el-tooltip>
                        </template>
                </el-table-column>
                <el-table-column
                    label="报表"
                    width="90">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="输赢报表" placement="top">
                                <i class="iconfont icon-yejibaobiao" @click="$router.push('/payoutReport?num=1&id=' + scope.row.id)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="佣金报表" placement="top">
                                <i class="iconfont icon-baobiao" @click="$alert('暂时不开放', '提示')"></i>
                            </el-tooltip>
                        </template>
                </el-table-column>

                <el-table-column type="expand" width="1">
                    <template slot-scope="scope">
                        <!-- 其它 -->
                        <el-table
                            :data="scope.row.otherDetail"
                            border>
                            <el-table-column
                                prop="user_num"
                                label="会员总数"
                                width="90">
                            </el-table-column>
                            <el-table-column
                                prop="user_register_num"
                                label="注册会员（本月）"
                                width="90">
                            </el-table-column>
                            <el-table-column
                                prop="user_valid_num"
                                label="有效会员（本月）"
                                width="90">
                            </el-table-column>
                            <el-table-column
                                prop="user_active_num"
                                label="活跃会员（本月）"
                                width="90">
                            </el-table-column>
                            <el-table-column
                                label="注册时间/ip">
                                <template slot-scope="scope">
                                    <div>
                                        {{ scope.row.created_at }} / {{ scope.row.created_ip }}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="登陆时间/ip">
                                <template slot-scope="scope">
                                    <div>
                                        {{ scope.row.login_at }} / {{ scope.row.login_ip }}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="remark"
                                label="备注">
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>

        <!-- 编辑详情与资料 -->
        <el-dialog
            title="编辑详情与资料"
            :visible.sync="showEdit"
            :close-on-click-modal=false
            width="40%">
            <div>
                <el-form ref="editForm" :model="editData" :rules="editRules" label-width="100px">
                    <el-form-item label="下级代理">
                        <el-input v-model="editData.code" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="姓名">
                        <el-input v-model="editData.realname" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input v-model="editData.mobile" placeholder="请输入手机号" maxlength="11"></el-input>
                    </el-form-item>
                    <el-form-item label="QQ" prop="qq">
                        <el-input v-model="editData.qq" placeholder="请输入QQ" maxlength="10"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editData.email" placeholder="请输入邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <el-input type="textarea" v-model="editData.remark" placeholder="请输入备注"></el-input>
                    </el-form-item>
                    <el-form-item label="其他联系方式" prop="otherc">
                        <el-input v-model="editData.otherc" placeholder="请输入其他联系方式"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="hideDialog('editForm')">取 消</el-button>
                <el-button type="primary" @click="editSubmit('editForm')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 重置登陆密码 -->
        <el-dialog
            title="重置登陆密码"
            :visible.sync="showLoginPwd"
            :close-on-click-modal=false
            width="30%">
            <div>
                <el-form ref="loginPwdForm" :model="loginPwdData" :rules="loginPwdRules" label-width="80px">
                    <el-form-item label="登陆密码" prop="password">
                        <el-input type="password" v-model="loginPwdData.password" placeholder="请输入登陆密码" maxlength="20"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="hideDialog('loginPwdForm')">取 消</el-button>
                <el-button type="primary" @click="loginPwdSubmit('loginPwdForm')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 重置支付密码 -->
        <el-dialog
            title="重置支付密码"
            :visible.sync="showPayPwd"
            :close-on-click-modal=false
            width="30%">
            <div>
                <el-form ref="payPwdForm" :model="payPwdData" :rules="payPwdRules" label-width="80px">
                    <el-form-item label="支付密码" prop="password">
                        <el-input type="password" v-model="payPwdData.password" placeholder="请输入支付密码" maxlength="6"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="hideDialog('payPwdForm')">取 消</el-button>
                <el-button type="primary" @click="payPwdSubmit('payPwdForm')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 转账 -->
        <el-dialog
            title="转账"
            :visible.sync="showTransfer"
            :close-on-click-modal=false
            width="30%">
            <div>
                <el-form ref="transferForm" :model="transferdData" :rules="transferRules" label-width="80px">
                    <el-form-item label="加减">
                        <el-input placeholder="+" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="金额" prop="ja1">
                        <el-input placeholder="请输入金额" v-model="transferdData.ja1"></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input type="textarea" v-model="transferdData.remark1"></el-input>
                    </el-form-item>
                    <el-form-item label="支付密码" prop="pay_pwd">
                        <el-input type="password" placeholder="请输入支付密码" v-model="transferdData.pay_pwd" maxlength="6"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="hideDialog('transferForm')">取 消</el-button>
                <el-button type="primary" @click="transferdSubmit('transferForm')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 创建三级代理 -->
        <makeCode 
            :showMakeCode="showMakeCode" 
            v-if="showMakeCode"
            @handleMakeCode="handleMakeCode($event)"
            @agentSubordinateData="agentSubordinateData"></makeCode>

        <!-- 限制支付密码 -->
        <el-dialog
            title="温馨提示"
            :visible.sync="showPay"
            :show-close=false
            width="35%"
            center
            :close-on-click-modal=false
            class="reminder">
            <p>为了您的资金安全，请先设置支付密码</p>
            <span slot="footer" class="dialog-footer">
                <el-button round plain class="btn_bor_primary" @click="showPay = false;">取 消</el-button>
                <el-button type="primary" round @click="showPay = false; $router.push('/information')">去设置</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { agentSubordinateApi,agentSubordinateStatusUpdateApi, agentSubordinateUpdateApi, agentSubordinateResetPasswordApi, agentSubordinateResetPayPasswordApi, agentSubordinateRechangeApi } from '../../http/api';
    import makeCode from './makeCode.vue'
    export default {
        data() {
            return {
                level_id: localStorage.getItem('level_id'),
                showLoading: false,
                tableLoading: false,
                tableData: [],
                // 编辑详情与资料
                showEdit:false,
                editData: {},
                editRules: {
                    mobile: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        { min: 11, max: 11, message: '请确认手机号格式', trigger: "blur" }
                    ],
                    status: [
                        { required: true, message: '请选择状态', trigger: 'blur' },
                    ],
                },
                // 重置登陆密码
                showLoginPwd: false,
                loginPwdData: {
                    id: "",
                    password: ""
                },
                loginPwdRules: {
                    password: [
                        { required: true, message: '请输入登录密码', trigger: 'blur' },
                        { min: 6, max: 20, message: '请输入6-20位密码', trigger: "blur" }
                    ],
                },
                // 重置支付密码
                showPayPwd: false,
                payPwdData: {
                    id: "",
                    password: ""
                },
                payPwdRules: {
                    password: [
                        { required: true, message: '请输入支付密码', trigger: 'blur' },
                        { min: 6, max: 6, message: '请输入6位支付密码', trigger: "blur" }
                    ],
                },
                // 转账
                showTransfer: false,
                transferdData: {
                    id: "",
                    ja1: "",
                    remark1: "",
                    pay_pwd: ""
                },
                transferRules: {
                    ja1: [
                        { required: true, message: '请输入金额', trigger: 'blur' },
                    ],
                    pay_pwd: [
                        { required: true, message: '请输入支付密码', trigger: 'blur' },
                        { min: 6, max: 6, message: '6位支付密码', trigger: 'blur'}
                    ]
                },
                // 创建三级代理
                showMakeCode: false,
                // 限制支付密码
                showPay: false
            }
        },
        methods: {
            // 初始化
            agentSubordinateData() {
                var _this = this;
                this.tableLoading = true;
                agentSubordinateApi().then(res => {
                    _this.tableLoading = false;
                    _this.tableData = res.data.message;
                    for(var i = 0; i < _this.tableData.length; i++){
                        _this.tableData[i]['showOther'] = false;
                        _this.tableData[i]['otherDetail'] = [
                            {
                                user_num: _this.tableData[i].user_num,
                                user_register_num: _this.tableData[i].user_register_num,
                                user_valid_num: _this.tableData[i].user_valid_num,
                                user_active_num: _this.tableData[i].user_active_num,
                                created_at: _this.tableData[i].created_at,
                                created_ip: _this.tableData[i].created_ip,
                                login_at: _this.tableData[i].login_at,
                                login_ip: _this.tableData[i].login_ip,
                                remark: _this.tableData[i].remark,
                            }
                        ]
                    }
                }).catch(err => {
                    _this.tableLoading = false
                })
            },
            // 展开里面表格
            toogleExpand(row) {
                let $table = this.$refs.table;
                this.tableData.map((item) => {
                    if(item.id != row.id){
                        item.showOther = false;
                    }
                    $table.toggleRowExpansion(item, false)
                })
                row.showOther =! row.showOther;
                if(!row.showOther){
                    $table.toggleRowExpansion(row, false)
                }else{
                    $table.toggleRowExpansion(row, true)
                }
            },
            // 操作-启动/锁定
            statusUpdate (row,index){
                var _this = this;
                var msg;
                if(row.status_text == '锁定'){
                    msg = "请确认启动" + row.code + "（" + row.realname + "）？"
                }else{
                    msg = "请确认锁定" + row.code + "（" + row.realname + "）？"
                }
                this.$confirm(msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var data = {
                        id: row.id,
                        status: index
                    }
                    _this.tableLoading = true;
                    agentSubordinateStatusUpdateApi(data).then(res => {
                        _this.agentSubordinateData()
                    }).catch(err => {
                        _this.tableLoading = false;
                        _this.$message.error(err.message)
                    })
                }).catch(() => {
                });
            },
            // 编辑详情与资料
            hanldEdit (row){
                this.showEdit = true;
                this.editData = Object.assign({}, row);
            },
            editSubmit (formName) {
                var _this = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var data = {
                            id: this.editData.id,
                            mobile: this.editData.mobile,
                            qq: this.editData.qq,
                            email: this.editData.email,
                            remark: this.editData.remark,
                            otherc: this.editData.otherc
                        }
                        _this.showLoading = true;
                        agentSubordinateUpdateApi(data).then(res => {
                            _this.showLoading = false;
                            _this.showEdit = false;
                            _this.$message.success(res.data.message);
                            _this.agentSubordinateData();
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
            // 重置登陆密码 
            hanldLoginPwd (row) {
                this.showLoginPwd = true;
                this.loginPwdData.id = row.id
            },
            loginPwdSubmit (formName) {
                var _this = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _this.showLoading = true;
                        agentSubordinateResetPasswordApi(_this.loginPwdData).then(res => {
                            _this.showLoading = false;
                            _this.showLoginPwd = false;
                            _this.$message.success(res.data.message);
                            _this.agentSubordinateData();
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
            // 重置支付密码
            hanldPayPwd (row) {
                this.showPayPwd = true;
                this.payPwdData.id = row.id
            },
            payPwdSubmit (formName) {
                var _this = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _this.showLoading = true;
                        agentSubordinateResetPayPasswordApi(_this.payPwdData).then(res => {
                            _this.showLoading = false;
                            _this.showPayPwd = false;
                            _this.$message.success(res.data.message);
                            _this.agentSubordinateData();
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
            // 转账
            hanldRechange(row) {
                if(row.status_text == "锁定"){
                    this.$alert('锁定的代理线，不能进行转账。')
                }else if(localStorage.getItem('has_pay_pwd') == 'false'){
                    this.showPay = true
                }else{
                    this.showTransfer = true;
                    this.transferdData.id = row.id
                }
            },
            transferdSubmit(formName) {
                var _this = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _this.showLoading = true;
                        agentSubordinateRechangeApi(_this.transferdData).then(res => {
                            _this.showLoading = false;
                            _this.showTransfer = false;
                            _this.$message.success(res.data.message);
                            _this.agentSubordinateData();
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
            // 弹窗-取消
            hideDialog (formName) {
                this.showEdit = false;
                this.showLoginPwd = false;
                this.showPayPwd = false;
                this.showTransfer = false;
                this.$refs[formName].resetFields();
            },
            // 创建三级代理
            handleMakeCode (msg) {
                this.showMakeCode = msg
            }
        },
        mounted () {
            this.agentSubordinateData()
        },
        components: {
            makeCode
        }
    }
</script>