<template>
    <div class="information" v-loading.fullscreen.lock="fullscreenLoading">
        <h3 class="title">个人资料</h3>

        <el-row>
            <h5>个人信息</h5>
            <ul>
                <li>
                    <span class="left">姓名</span>
                    <span class="right">{{ data.realname }}</span>
                </li>
                <li>
                    <span class="left">代理账号</span>
                    <span class="right">{{ data.code }}</span>
                </li>
                <li>
                    <span class="left">登录密码</span>
                    <span class="right">
                        <el-button type="text" @click="showLoginPass = true">修改</el-button>
                        <el-button type="text" @click="showCode = true;passType = 'loginPwd'">重置</el-button>
                    </span>
                </li>
            </ul>
        </el-row>

        <el-row>
            <h5>安全信息</h5>
            <ul>
                <li>
                    <span class="left">手机号</span>
                    <span class="right">{{ data.mobile }}</span>
                </li>
                <li>
                    <span class="left">支付密码</span>
                    <span class="right">
                        <el-button type="text" v-if="has_pay_pwd" @click="showPayPass = true">修改</el-button>
                        <el-button type="text" @click="showCode = true;passType = 'payPwd'">{{ resetText }}</el-button>
                    </span>
                </li>
            </ul>
        </el-row>

        <el-row>
            <h5>联系信息</h5>
            <el-table
                :data="contactInformation"
                border
                style="width: 100%">
                <el-table-column
                    prop="contact"
                    label="联系方式">

                </el-table-column>
                <el-table-column
                    prop="link"
                    label="联系号码">
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>

        <!-- 修改登录密码 -->
        <el-dialog
            title="修改登录密码"
            :visible.sync="showLoginPass"
            :show-close=false
            width="490px"
            center>
            <el-form>
                <el-form-item>
                    <el-input type="password" placeholder="请输入旧密码" maxlength="20" v-model="PwdData.old_pwd"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input type="password" placeholder="请输入6-20位密码" maxlength="20" v-model="PwdData.pwd"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input type="password" placeholder="请再次输入新密码" maxlength="20" v-model="againPass"></el-input>
                </el-form-item>
            </el-form>
            <p>忘记密码？<el-button type="text" style="width: auto" @click="showLoginPass = false;showCode = true">立即重置</el-button></p>
            <span slot="footer" class="dialog-footer">
                <el-button round plain class="btn_bor_primary" @click="showLoginPass = false">取 消</el-button>
                <el-button type="primary" round @click="submitLoginPass">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改支付密码 -->
        <el-dialog
            title="修改支付密码"
            :visible.sync="showPayPass"
            :show-close=false
            width="490px"
            center>
            <el-form>
                <el-form-item>
                    <el-input type="password" placeholder="请输入旧密码" maxlength="6" v-model="payPwdData.old_pay_pwd"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input type="password" placeholder="请输入6位的支付密码" maxlength="6" v-model="payPwdData.pay_pwd"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input type="password" placeholder="请再次输入新密码" maxlength="6" v-model="againPayPass"></el-input>
                </el-form-item>
            </el-form>
            <p>忘记密码？<el-button type="text" style="width: auto" @click="showPayPass = false;showCode = true">立即重置</el-button></p>
            <span slot="footer" class="dialog-footer">
                <el-button round plain class="btn_bor_primary" @click="showPayPass = false">取 消</el-button>
                <el-button type="primary" round @click="submitPayPass">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 验证码 -->
        <el-dialog
            title="安全验证"
            :visible.sync="showCode"
            :show-close=false
            width="490px"
            center
            class="verification">
            <p>请输入 <span class="primary-color">{{ data.mobile }}</span> 收到的短信验证码</p>
            <el-form style="margin-bottom: 10px">
                <el-form-item>
                    <el-input placeholder="请输入验证码" maxlength="4" v-model="codeData.code"></el-input>
                    <el-button type="text" class="code" @click="sendCode">{{ codeText }}</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button round plain class="btn_bor_primary" @click="showCode = false">取 消</el-button>
                <el-button type="primary" round @click="setupPayPass">下一步，设置新密码</el-button>
            </span>
        </el-dialog>
        
        <!-- 重置登录密码 -->
        <el-dialog
            title="重置登录密码"
            :visible.sync="showResetLoginPass"
            :show-close=false
            width="40%"
            center
            :close-on-click-modal=false
            class="verification">
            <el-form style="margin-bottom: 10px">
                <el-form-item>
                    <el-input type="password" placeholder="请输入6-20位的登录密码" maxlength="20" v-model="resetPwdData.pwd"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input type="password" placeholder="再次确认登录密码" maxlength="20" v-model="againPwd"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button round plain class="btn_bor_primary" @click="showResetLoginPass = false">取 消</el-button>
                <el-button type="primary" round @click="submitResetPass">确 认</el-button>
            </span>
        </el-dialog>

        <!-- 重置支付密码 -->
        <el-dialog
            title="重置支付密码"
            :visible.sync="showResetPayPass"
            :show-close=false
            width="40%"
            center
            :close-on-click-modal=false
            class="verification">
            <el-form style="margin-bottom: 10px">
                <el-form-item>
                    <el-input type="password" placeholder="请输入6位的支付密码" maxlength="6" v-model="resetPayPwdData.pwd"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input type="password" placeholder="再次确认支付密码" maxlength="6" v-model="againPayPwd"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button round plain class="btn_bor_primary" @click="showResetPayPass = false">取 消</el-button>
                <el-button type="primary" round @click="submitResetPayPass">确 认</el-button>
            </span>
        </el-dialog>

        <!-- 编辑联系方式 -->
        <el-dialog
            title="编辑联系方式"
            :visible.sync="showEdit"
            :show-close=false
            width="450px"
            center
            :close-on-click-modal=false
            class="verification">
            <el-form style="margin-bottom: 10px">
                <el-form-item label="联系方式：" label-width="82px" style="margin-bottom: 0">
                    <span>{{ editData.contact }}</span>
                </el-form-item>
                <el-form-item label="联系号码：" label-width="82px">
                    <el-input :placeholder="'请输入' + editData.contact" v-model="editValue"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button round plain class="btn_bor_primary" @click="showEdit = false">取 消</el-button>
                <el-button type="primary" round @click="submitEdit">确 认</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { agentBaseInfoApi, updatePwdApi, setPwdApi, updatePayPwdApi, SendSmsApi, checkCodeApi, setPayPwdApi, agentEditInfoApi } from '../../http/api'
    export default {
        data() {
            return {
                has_pay_pwd: false,
                fullscreenLoading: false,
                contactInformation:[
                    {
                        contact: "QQ",
                        link: "--",
                    },
                    {
                        contact: "邮箱",
                        link: "--",
                    },
                    {
                        contact: "其他联系方式",
                        link: "--",
                    },
                ],
                data: "",
                // 密码类型
                passType: "",
                // 修改登录密码
                showLoginPass: false,
                PwdData: {
                    old_pwd: "",
                    pwd: ""
                },
                againPass: "",
                // 修改支付密码
                showPayPass: false,
                payPwdData: {
                    old_pay_pwd: "",
                    pay_pwd: ""
                },
                againPayPass: "",
                // 验证码
                showCode: false,
                codeText: "获取验证码",
                codeSet: null,
                codeData: {
                    key: "",
                    code: ""
                },
                // 重置登录密码
                showResetLoginPass: false,
                againPwd: "",
                resetPwdData: {
                    code: "",
                    pwd: ""
                },
                // 重置支付密码
                showResetPayPass: false,
                resetText: "",
                resetPayPwdData: {
                    code: "",
                    pwd: ""
                },
                againPayPwd: "",
                // 编辑
                showEdit: false,
                editData: "",
                editValue: "",
            }
        },
        methods: {
            // 初始化
            agentBaseInfoData () {
                var _this = this;
                agentBaseInfoApi().then(res => {
                    _this.data = res.data.message;
                    if(_this.data.qq){
                        _this.contactInformation[0].link = _this.data.qq
                    }
                    if(_this.data.email){
                        _this.contactInformation[1].link = _this.data.email
                    }
                    if(_this.data.otherc){
                        _this.contactInformation[2].link = _this.data.otherc
                    }
                }).catch(err => {

                })
            },
            //修改登录密码-提交 
            submitLoginPass () {
                var _this = this;
                if(this.PwdData.old_pwd == ''){
                    this.$message.error('请输入旧密码')
                }else if(this.PwdData.pwd == ''){
                    this.$message.error('请输入新密码')
                }else if (this.againPass != this.PwdData.pwd){
                    this.$message.error('两次密码输入不一致')
                }else{
                    this.fullscreenLoading = true;
                    updatePwdApi(_this.PwdData).then(res => {
                        _this.fullscreenLoading = false;
                        _this.showLoginPass = false;
                        _this.$message.success(res.data.message)
                    }).catch(err => {
                        _this.fullscreenLoading = false;
                        _this.$message.error(err.message)
                    })
                }
            },
            // 修改支付密码-提交
            submitPayPass () {
                var _this = this;
                if(this.payPwdData.old_pay_pwd == ''){
                    this.$message.error('请输入旧密码')
                }else if (this.payPwdData.pay_pwd == '') {
                    this.$message.error('请输入新密码')
                }else if (this.againPayPass != this.payPwdData.pay_pwd){
                    this.$message.error('两次密码输入不一致')
                }else{
                    this.fullscreenLoading = true;
                    updatePayPwdApi(_this.payPwdData).then(res => {
                        _this.fullscreenLoading = false;
                        _this.showPayPass = false;
                        _this.$message.success(res.data.message)
                    }).catch(err => {
                        _this.fullscreenLoading = false;
                        _this.$message.error(err.message)
                    })
                }
            },
            // 发送验证码
            sendCode () {
                var _this = this;
                if(this.codeText == '获取验证码' || this.codeText == '重新获取'){
                    this.codeText = '发送中'
                    SendSmsApi().then(res => {
                        _this.codeData.key = res.data.key;
                        var cont = 90;
                        _this.codeText = cont + "s";
                        _this.codeSet = setInterval(() => {
                            cont--;
                            _this.codeText = cont + "s";
                            if(cont == 0){
                                clearInterval(_this.codeSet);
                                _this.codeText = "重新获取"
                            }
                        }, 1000);
                    }).catch(err => {
                        _this.codeText = '获取验证码';
                        _this.$message.error(res.message)
                    })
                }
            },
            // 下一步,设置新支付密码
            setupPayPass () {
                var _this = this;
                if(this.codeData.key == ''){
                    this.$message.error('请获取验证码')
                }else if(this.codeData.code == ''){
                    this.$message.error('请输入验证码')
                }else{
                    checkCodeApi(_this.codeData).then(res => {
                        _this.showCode = false;
                        if(_this.passType == 'payPwd'){ //支付密码
                            _this.showResetPayPass = true;
                            _this.resetPayPwdData.code = res.data.code
                        }else{  //登录密码
                            _this.showResetLoginPass = true;
                            _this.resetPwdData.code = res.data.code
                        }
                    }).catch(err => {
                        _this.$message.error(err.message)
                    })
                }
            },
            // 重置登录密码-提交
            submitResetPass () {
                var _this = this;
                if(this.resetPwdData.pwd == ''){
                    this.$message.error('请输入新支付密码')
                }else if(this.againPwd == ''){
                    this.$message.error('请输入再次确认支付密码')
                }else if(this.againPwd != this.resetPwdData.pwd){
                    this.$message.error('两次密码输入不一致')
                }else{
                    this.fullscreenLoading = true;
                    setPwdApi(_this.resetPwdData).then(res => {
                        _this.fullscreenLoading = false;
                        _this.showResetLoginPass = false;
                        _this.$message.success(res.data.message);
                        _this.codeData.code = '';
                        _this.resetPwdData.pwd = ''
                    }).catch(err => {
                        _this.fullscreenLoading = false
                        _this.$message.error(err.message)
                    })
                }
            },
            // 重置支付密码-提交
            submitResetPayPass () {
                var _this = this;
                if(this.resetPayPwdData.pwd == ''){
                    this.$message.error('请输入新支付密码')
                }else if(this.againPayPwd == ''){
                    this.$message.error('请输入再次确认支付密码')
                }else if(this.againPayPwd != this.resetPayPwdData.pwd){
                    this.$message.error('两次密码输入不一致')
                }else{
                    this.fullscreenLoading = true;
                    setPayPwdApi(_this.resetPayPwdData).then(res => {
                        _this.fullscreenLoading = false;
                        _this.showResetPayPass = false;
                        _this.$message.success(res.data.message);
                        _this.codeData.code = '';
                        _this.resetPayPwdData.pwd = ''
                    }).catch(err => {
                        _this.fullscreenLoading = false
                        _this.$message.error(err.message)
                    })
                }
            },
            // 编辑
            handleEdit (row) {
                this.editData = row;
                this.editValue = row.link;
                this.showEdit = true;
            },
            // 编辑-提交
            submitEdit () {
                if(this.editValue == ''){
                    this.$message.error("请输入" + this.editData.contact);
                }else{
                    if(this.editValue.indexOf('*') != -1){
                        this.showEdit = false;
                    }else{
                        var column = ""
                        if(this.editData.contact == "QQ"){
                            column = "qq";
                            var data = {
                                column: column,
                                value: this.editValue
                            }
                            this.agentEditInfoData(data)
                        }else if(this.editData.contact == '其他联系方式') {
                            column = 'otherc';
                            var data = {
                                column: column,
                                value: this.editValue
                            }
                            this.agentEditInfoData(data)
                        }else{
                            column = "email";
                            var emails = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
                            if(!emails.test(this.editValue)){
                                this.$message.error('邮箱格式错误')
                            }else{
                                var data = {
                                    column: column,
                                    value: this.editValue
                                }
                                this.agentEditInfoData(data)
                            }
                        }
                    }
                }
            },
            agentEditInfoData (data){
                var _this = this;
                this.fullscreenLoading = true;
                agentEditInfoApi(data).then(res => {
                    _this.fullscreenLoading = false;
                    _this.showEdit = false;
                    _this.$message.success(res.data.message)
                    _this.agentBaseInfoData()
                }).catch(err => {
                    _this.fullscreenLoading = false;
                    _this.$message.error(err.message)
                })
            }
        },
        mounted () {
            this.agentBaseInfoData()

            var has_pay_pwd = localStorage.getItem('has_pay_pwd');
            if(has_pay_pwd == 'true'){
                this.resetText = "重置";
                this.has_pay_pwd = true;
            }else{
                this.resetText = "去设置"
                this.has_pay_pwd = false
            }
        },
        beforeDestroy() {
            clearInterval(this.codeSet)
        },
    }
</script>

<style scoped>
    @import url(../../assets/css/personalCenter.css);
</style>