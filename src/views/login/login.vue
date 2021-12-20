<template>
    <div class="login" v-loading.fullscreen="fullscreenLoading">
        <headers></headers>

        <div class="login_banner">
            <div class="login_banner_inner fix">
                <div class="kuli">
                    <img src="../../assets/img/box_img.png">
                </div>
                
                <div class="login_form">
                    <ul>
                        <li v-for="(item, index) in tab" :key="index" :class="{ 'tab_active': item.url == routerUrl }" @click="tabClick(item)">
                            {{ item.text }}
                        </li>
                    </ul>
                    <!-- 登录 -->
                    <div class="login_form_inner" v-if="routerUrl == '/login'">
                        <h5>登录</h5>
                        <el-form>
                            <el-form-item>
                                <el-input placeholder="请输入手机号或者账号" v-model="username"></el-input>
                                <i class="el-icon-user-solid"></i>
                            </el-form-item>
                            <el-form-item>  
                                <el-input type="password" placeholder="请输入密码" v-model="password"></el-input>
                                <i class="iconfont icon-password"></i>
                            </el-form-item>
                        </el-form>
                        <div class="code" v-show="!is_codeSuccess" @click="appCodeClick">
                            <div class="geetest_radar">
                                <div class="geetest_dot"></div>
                            </div>
                            <span 
                                id="TencentCaptcha"
                                data-appid="appId"
                                data-cbfn="callback">点击按钮进行验证</span>
                        </div>
                        <div class="code code_success" v-show="is_codeSuccess">
                            <i class="iconfont icon-success"></i>
                            <span>验证成功</span>
                        </div>
                        <el-row class="login_form_other">
                            <span @click="is_remember =! is_remember">
                                <i class="primary-color" :class="{ 'el-icon-success': is_remember }"></i>
                                记住账号
                            </span>
                        </el-row>
                        <el-row class="login_form_btn">
                            <el-button round class="primary-button" @click="loginClick">登录</el-button>
                        </el-row>
                    </div>
                    <!-- 注册 -->
                    <div class="login_form_inner" v-if="routerUrl == '/register'">
                        <h5>注册</h5>
                        <el-form>
                            <el-form-item>
                                <el-input placeholder="上级" v-model="r.promote" :disabled="$route.query.code"></el-input>
                                <i class="el-icon-s-custom"></i>
                            </el-form-item>
                            <el-form-item>
                                <el-input placeholder="请输入手机号码" v-model="r.mobile" maxlength="11"></el-input>
                                <i class="iconfont icon-shouji"></i>
                            </el-form-item>
                            <el-form-item>
                                <el-input placeholder="请输入验证码" v-model="r.code" maxlength="4"></el-input>
                                <i class="iconfont icon-validCode"></i>
                                <span class="obtain_code primary-color" @click="codeClick">{{ codeText }}</span>
                            </el-form-item>
                            <el-form-item>  
                                <el-input type="password" placeholder="请输入密码" maxlength="20" v-model="r.password"></el-input>
                                <i class="iconfont icon-password"></i>
                            </el-form-item>
                            <el-form-item>
                                <el-input placeholder="姓名" maxlength="20" v-model="r.realname"></el-input>
                                <i class="el-icon-user-solid"></i>
                            </el-form-item>
                            <el-form-item>
                                <el-input placeholder="邮箱地址" v-model="r.email"></el-input>
                                <i class="el-icon-message"></i>
                            </el-form-item>
                            <el-form-item>
                                <el-input
                                    type="textarea"
                                    :rows="2"
                                    maxlength="100"
                                    placeholder="推广渠道可不填写，100字内"
                                    v-model="r.remark">
                                </el-input>
                                <i class="el-icon-s-promotion"></i>
                            </el-form-item>
                        </el-form>
                        <el-row class="login_form_other">
                            <span @click="is_read =! is_read" style="float: left">
                                <i class="primary-color" :class="{ 'el-icon-success': is_read }"></i>
                                我已经阅读并同意相关的服务条款
                            </span>
                        </el-row>
                        <el-row class="login_form_btn">
                            <el-button round class="primary-button" @click="registerClick">注册</el-button>
                        </el-row>
                    </div>
                </div>
                
                <div class="cl">
                    <img src="../../assets/img/box_img.png">
                </div>
            </div>
        </div>

        <div class="login_main">
            <img src="../../assets/img/login_title1.png" class="login_title">
            <h4>小标题小标题小标题</h4>
            <el-row class="extension">
                <ul class="fix">
                    <li>
                        <img src="../../assets/img/extension_img1.png" width="263">
                        <h3>标题标题标题</h3>
                        <p>小标题小标题小标题小标题小标题小标题<br/>小标题小标题小标题</p>
                    </li>
                    <li>
                        <img src="../../assets/img/extension_img2.png" width="309">
                        <h3>标题标题标题</h3>
                        <p>小标题小标题小标题小标题小标题小标题<br/>小标题小标题小标题</p>
                    </li>
                    <li>
                        <img src="../../assets/img/extension_img3.png" width="263">
                        <h3>标题标题标题</h3>
                        <p>小标题小标题小标题小标题小标题小标题<br/>小标题小标题小标题</p>
                    </li>
                </ul>
            </el-row>
            <el-row class="extension" style="margin-bottom: 153px">
                <ul class="fix">
                    <li>
                        <img src="../../assets/img/extension_img1.png" width="263">
                        <h3>标题标题标题</h3>
                        <p>小标题小标题小标题小标题小标题小标题<br/>小标题小标题小标题</p>
                    </li>
                    <li>
                        <img src="../../assets/img/extension_img2.png" width="309">
                        <h3>标题标题标题</h3>
                        <p>小标题小标题小标题小标题小标题小标题<br/>小标题小标题小标题</p>
                    </li>
                    <li>
                        <img src="../../assets/img/extension_img3.png" width="263">
                        <h3>标题标题标题</h3>
                        <p>小标题小标题小标题小标题小标题小标题<br/>小标题小标题小标题</p>
                    </li>
                </ul>
            </el-row>

            <img src="../../assets/img/login_title1.png" class="login_title">
            <h4>小标题小标题小标题</h4>
            <el-row class="guessing_competition">
                <ul>
                    <li>
                        <h5>标题标题标题%</h5>
                        <p>小标题小标题小标题</p>
                    </li>
                    <li>
                        <h5>标题标题标题</h5>
                        <p>小标题小标题小标题</p>
                    </li>
                </ul>
            </el-row>
        </div>

        <el-row>
            <footers></footers>
        </el-row>
    </div>
</template>

<script>
    import headers from '../../components/header.vue'
    import footers from '../../components/footer.vue'
    import { loginApi, SendSmsApi, registerApi } from '../../http/api.js'
    import '../../assets/js/TCaptcha.js'
    export default {
        data() {
            return {
                fullscreenLoading: false,
                tab: [
                    {
                        text: '登录', 
                        url: '/login'
                    },
                    {
                        text: '注册',
                        url: '/register'
                    }
                ],
                num:0,
                appId: "123456789",
                // 登录
                username: "",
                password: "",
                code: "",
                randstr: "",
                is_remember: false,
                is_codeSuccess: false,
                routerUrl: "/login",
                // 注册提交
                r:{
                    promote: "",
                    vcode: "",
                    randstr: "",
                    mobile: "",
                    code: "",
                    key: "",
                    password: "",
                    realname: "",
                    email: "",
                    remark: ""
                },
                is_read: false,
                // 验证码
                codeText: "获取验证码",
                // 定时器
                codeSet: null
            }
        },
        methods: {
            // tab
            tabClick (item) {
                if(item.url != this.$router.history.current.path){
                    this.$router.push(item.url)
                    this.routerUrl = item.url
                }
            },
            // 验证
            appCodeClick () {
                var _this = this;
                var captcha1 = new TencentCaptcha(_this.appId, function(res) {
                    if(res.ret === 0){
                        _this.code = res.ticket;
                        _this.randstr = res.randstr;
                        _this.is_codeSuccess = true
                    }
                });
                captcha1.show(); 
            },
            // 登录
            loginClick () {
                if(this.username == ''){
                    this.$message.error('请填写账号')
                }else if (this.password == ''){
                    this.$message.error('请填写密码')
                }else if(this.code == ''){
                    this.$message.error('请完成验证')
                }else{
                    var data = {
                        username: this.username,
                        password: this.password,
                        code: this.code,
                        randstr: this.randstr
                    }
                    this.loginSubmit(data)
                }
            },
            loginSubmit(data) {
                var _this = this;
                this.fullscreenLoading = true;
                loginApi(data).then(res => {
                    _this.fullscreenLoading = false;
                    if(_this.is_remember){
                        var passData = {
                            username: this.username,
                            password: this.password,
                        }
                        _this.$cookies.set('passData',JSON.stringify(passData), '1m')
                    }else{
                        if(_this.$cookies.get('passData')){
                            _this.$cookies.remove('passData')
                        }
                    }

                    const expires_time = new Date().getTime() + res.data.expires_in * 1000;
                    localStorage.setItem("access_token", res.data.access_token);
                    localStorage.setItem("expires_time", expires_time);

                    localStorage.setItem('level_id', res.data.level_id)
                    
                    _this.$router.push('/home')
                }).catch(err => {
                    _this.fullscreenLoading = false;
                    _this.$message.error(err.message);
                    // 错误返回重置验证
                    _this.is_codeSuccess = false;
                    _this.code = '';
                    _this.randstr = ''
                })
            },
            // 获取验证码
            codeClick() {
                var _this = this;
                var tel = /^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/;
                if(this.r.mobile == ''){
                    this.$message.error('请输入手机号')
                }else if(!tel.test(this.r.mobile)){
                    this.$message.error('手机号格式错误')
                }else{
                    if(this.codeText == '获取验证码' || this.codeText == '重新获取'){
                        this.codeText = '发送中'
                        var data = '?mobile=' + this.r.mobile
                        SendSmsApi(data).then(res => {
                            _this.r.key = res.data.key;
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
                            _this.$message.error(err.message)
                        })
                    }
                }
            },
            // 注册
            registerClick() {
                var _this = this;
                var tel = /^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/;
                if(this.r.mobile == ''){
                    this.$message.error('请输入手机号')
                }else if(!tel.test(this.r.mobile)){
                    this.$message.error('手机号格式错误')
                }else if(this.r.code == ''){
                    this.$message.error('请输入验证码')
                }else if(this.r.password == ''){
                    this.$message.error('请输入密码')
                }else if(this.r.realname == ''){
                    this.$message.error('请输入姓名')
                }else if(this.r.email == ''){
                    this.$message.error('请输入邮箱')
                }else if(!this.is_read){
                    this.$message.error('请打勾服务条款')
                }else if(this.r.key == ''){
                    this.$message.error('请获取验证码')
                }else{
                    var captcha1 = new TencentCaptcha(_this.appId, function(res) {
                        if(res.ret === 0){
                            _this.r.vcode = res.ticket;
                            _this.r.randstr = res.randstr;
                            _this.registerSubmit()
                        }
                    });
                    captcha1.show(); 
                }
            },
            registerSubmit () {
                var _this = this;
                this.fullscreenLoading = true;
                registerApi(_this.r).then(res => {
                    _this.fullscreenLoading = false
                    _this.$message.success(res.data.message)
                    _this.r = {
                        vcode: "",
                        randstr: "",
                        mobile: "",
                        code: "",
                        key: "",
                        password: "",
                        realname: "",
                        email: "",
                        promote: ""
                    };
                    clearInterval(_this.codeSet);
                    _this.codeText = "获取验证码"
                }).catch(err => {
                    _this.fullscreenLoading = false;
                    _this.$message.error(err.message);
                })
            }
        },
        mounted() {
            this.routerUrl = this.$router.history.current.path;
            if(this.$cookies.get('passData')){
                this.is_remember = true;
                var data = this.$cookies.get('passData');
                var passData = typeof data == 'string' ? JSON.parse(data) : data;
                this.username = passData.username;
                this.password = passData.password
            }

            if(this.routerUrl == '/register' && this.$route.query.code){
                this.r.promote = this.$route.query.code
            }
        },
        components: {
            headers,
            footers
        },
        beforeDestroy () {
            clearInterval(this.codeSet);
        }
    }
</script>

<style scoped>
    @import url(../../assets/css/login.css);
</style>