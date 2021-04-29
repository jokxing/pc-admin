<template>
    <div class="contact_us" v-loading.fullscreen="fullscreenLoading">
        <h3 class="title">联系我们</h3>

        <el-row>
            <h5>在线客服</h5>
            <el-button size="medium" plain class="btn_bor_primary" @click="serviceClick('1')">在线客服1</el-button>
            <el-button size="medium" plain class="btn_bor_primary" @click="serviceClick('2')">在线客服2</el-button>
        </el-row>

        <el-row class="social">
            <h5>电脑软件客服</h5>
            <a class="btn_bor_primary" v-for="(item, index) in data.social_network" :key="index" :href="item.account" target="_blank">
                <img :src="item.icon" width="20" /> {{ item.name }}
            </a>

            <!-- <el-button size="medium" plain class="btn_bor_primary" v-for="(item, index) in data.social_network" :key="index" @click="socialClick(item)"><img :src="item.icon" width="20" /> {{ item.name }}</el-button> -->

            <!-- <el-button size="medium" plain class="btn_bor_primary" icon="iconfont icon-qq" @click="qqClick"> QQ客服</el-button>
            <el-button size="medium" plain class="btn_bor_primary" icon="iconfont icon-telegram-plane"> telegram客服</el-button>
            <el-button size="medium" plain class="btn_bor_primary" icon="iconfont icon-skype"> skype客服</el-button> -->
        </el-row>

        <el-row>
            <h5>回电服务</h5>
            <p>本公司提供24小时全天候的高素质客户服务热线，及多种语言选择，包括华语、台语及英语，如有任何疑问请与我们联系。</p>
            <el-form label-width="100px">
                <el-form-item label="问题类型：">
                    <el-col :span="9">
                        <el-select v-model="callType" placeholder="请选择问题类型">
                            <el-option
                                v-for="(item,index) in callTypeArr"
                                :key="index"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="语言：">
                    <el-col :span="9">
                        <el-select v-model="callLanguage" placeholder="请选择语言">
                            <el-option
                                v-for="(item,index) in callLanguageArr"
                                :key="index"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="手机号：">
                    <el-col :span="9">
                        <el-input placeholder="+请加上区域码 例如大陆地区+86 台湾地区+886" maxlength="20" v-model="phoneText"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-col :span="9">
                        <el-button plain class="btn_bor_primary" style="width: 100%" @click="submitBackcall">确 认</el-button>
                    </el-col>
                </el-form-item>
            </el-form>
        </el-row>

        <el-row>
            <h5>中文语音客服</h5>
            <p>本公司提供24小时全天候的高素质在线客户服务，让您能随时随地的联系我们，即时的为您服务。</p>
            <el-col :span="9">
                <a class="btn_bor_primary" :href="'tel:' + data.telephone">{{ data.telephone }}</a>
            </el-col>
        </el-row>

        <el-row>
            <h5>电子邮件客服</h5>
            <p>如您有任何相关问题，希望通过电子邮件与我们联系，请发邮件到下方地址，我们专业的客服人员，将尽速回复您的疑问，谢谢!</p>
            <el-col :span="9">
                <a class="btn_bor_primary" :href="'mailto:' + data.email">{{ data.email }}</a>
            </el-col>
        </el-row>

        <el-dialog
            :title="serviceTitle"
            :visible.sync="showService"
            :before-close="handleClose"
            :width="dialogWidth">
            <iframe :src="iframeUrl" frameborder="0" :width=serviceWidth :height=serviceHeight></iframe>
        </el-dialog>
    </div>
</template>

<script>
    import { contact_usApi,backcallApi } from '../../http/api'
    export default {
        data() {
            return {
                fullscreenLoading: false,
                showService: false,
                iframeUrl: "",
                serviceTitle: "",
                serviceWidth: "",
                serviceHeight: "",
                dialogWidth: "",
                callType: "",
                callTypeArr: ['点数问题','球赛问题','彩球问题','现场游戏问题','会员注册问题','电子游戏问题'],
                callLanguage: "",
                callLanguageArr: ['华语','台语','English','Tiếng Việt'],
                phoneText:"",
                data: ""
            }
        },
        methods: {
            contactUsInit () {
                var _this = this;
                this.fullscreenLoading = true;
                contact_usApi().then(res => {
                    _this.fullscreenLoading = false;
                    _this.data = res.data.message
                }).catch(err => {
                    _this.fullscreenLoading = false
                })
            },
            // 在线客服
            serviceClick (row) {
                this.showService = true;
                this.serviceTitle = "在线客服" + row;
                if(row == '1'){
                    this.dialogWidth = "540px"
                    this.serviceWidth = "504";
                    this.serviceHeight = "606";
                    this.iframeUrl = this.data.link
                }else{
                    this.dialogWidth = "940px"
                    this.serviceWidth = "900";
                    this.serviceHeight = "530";
                    this.iframeUrl = this.data.backup_link
                }
            },
            handleClose() {
                this.showService = false
                this.iframeUrl = ""
            },
            // 唤起客服工具
            socialClick (item) {
                window.open('http://wpa.qq.com/msgrd?v=3&uin=' + item.account + '&site=qq&menu=yes', 'newwindow', 'height=900, width=1024, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no')
            },
            // QQ客服
            // qqClick() {
            //     window.open('http://wpa.qq.com/msgrd?v=3&uin=23890238&site=qq&menu=yes', 'newwindow', 'height=900, width=1024, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no')
            // },
            // 下载
            qqDownloadClick () {
                window.location.href = 'http://dldir1.qq.com/qqfile/qq/QQ8.9.2/20760/QQ8.9.2.exe'
            },
            // 回电服务-提交
            submitBackcall () {
                var _this = this;
                if(this.callType == ''){
                    this.$message.error('请选择问题类型')
                }else if (this.callLanguage == ''){
                    this.$message.error('请选择语言')
                }else if (this.phoneText == ''){
                    this.$message.error('请输入手机号')
                }else {
                    var data = {
                        openPopupText: this.callType,
                        openLanguageText: this.callLanguage,
                        phoneText: this.phoneText
                    }
                    this.fullscreenLoading = true;
                    backcallApi(data).then(res => {
                        _this.fullscreenLoading = false;
                        _this.$message.success(res.data.message)
                    }).catch(err => {
                        _this.fullscreenLoading = false;
                        _this.$message.error(err.message)
                    })
                }
            }
        },
        mounted() {
            this.contactUsInit()
        },
    }
</script>

<style scoped>
    @import url(../../assets/css/personalCenter.css);
</style>