<template>
    <div class="agent_import">
        <el-tabs v-model="activeName">
            <el-tab-pane label="推广网址" name="first">
                <el-row v-loading="showLoading" style="min-height: 600px">
                    <el-col :span="24" class="agent_import_list" v-for="(item, index) in list" :key="index">
                        <img :src="require('../../assets/img/' + item.img)">
                        <div class="right">
                            <span class="link" :class="{ 'link_app': item.link.url.indexOf('.app') != -1 }">
                                {{ item.link.url }}
                                <br>
                                <em v-if="item.link.url.indexOf('.app') != -1">注：1、下载跟注册时IP需保持一致，否则会注册到总线</em>
                                <em v-if="item.link.url.indexOf('.app') != -1"><i style="opacity: 0;">注：</i>2、下载后未注册，一定时间后再注册会飞回总线</em>
                                <em v-if="item.link.url.indexOf('.app') != -1"><i style="opacity: 0;">注：</i>3、如出现会员新注册不在名下可进行转线申请</em>
                            </span>
                            <el-dropdown trigger="click" @command="handleAppdown">
                                <el-button plain round>下载<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item :command="beforeHandleCommand(item.link.wx)">防封二维码(微信)</el-dropdown-item>
                                    <el-dropdown-item :command="beforeHandleCommand(item.link.qq)">防封二维码(QQ)</el-dropdown-item>
                                    <el-dropdown-item :command="beforeHandleCommand(item.link.url)">长链接二维码</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <el-dropdown trigger="click" @command="handleCpye">
                                <el-button type="primary" round>复制<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item :command="beforeHandleCommand(item.link.wx, 'a')">防封短链(微信)</el-dropdown-item>
                                    <el-dropdown-item :command="beforeHandleCommand(item.link.qq, 'a')">防封短链(QQ)</el-dropdown-item>
                                    <el-dropdown-item :command="beforeHandleCommand(item.link.url, 'b')">长链接</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="专属域名" name="second">
                <el-row v-loading="showLoading">
                    <el-col :span="24" class="agent_import_list" v-for="(item, index) in me" :key="index">
                        <!-- <div class="me_box">专属域名</div> -->
                        <img src="../../assets/img/me1.png" v-if="index == 0">
                        <img src="../../assets/img/me2.png" v-if="index == 1">
                        <img src="../../assets/img/me1.png" v-if="index == 2">
                        <img src="../../assets/img/me2.png" v-if="index == 3">
                        <div class="right">
                            <span class="link">{{ item }}</span>
                            <el-button type="primary" round @click="handleCpye(item, 'b')">复制</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>

        <!-- 隐藏复制方便获取连接 -->
        <button ref="copys" :data-clipboard-text="cpyeLink" style="display: none;">复制</button>    

        <!-- 推广网址-二维码弹窗 -->
        <el-dialog
            title="下载二维码"
            :visible.sync="dialogVisible"
            :close-on-click-modal=false
            width="670px"
            class="QRcode_popup"
            @closed="handleClose">
                <el-row>
                    <div class="left">
                        <div id="downloadQrcode">
                            <div class="QRcode" ref="appdownQrCodeDiv"></div>
                            <img src="../../assets/img/logo_img.png" width="40">
                        </div>
                        <el-button round plain class="btn_bor_primary" @click="downloadLocal">下载到本地</el-button>
                    </div>
                    <div class="right">
                        <div class="QRcode" ref="linkQrCodeDiv"></div>
                        <p>扫一扫，手机查看</p>
                    </div>
                </el-row>
        </el-dialog>

        <!-- 推广网址-复制弹窗 -->
        <el-dialog
            title="复制成功"
            :visible.sync="dialogCpye"
            :close-on-click-modal=false
            width="410px">
                <span>已帮您复制微信防封短链 {{ cpyeLink }}</span>
                <span slot="footer" class="dialog-footer">
                    <el-button plain round v-loading.fullscreen.lock="fullscreenLoading" @click="regenerate">重新生成</el-button>
                    <el-button type="primary" round @click="dialogCpye = false">我知道了</el-button>
                </span>
        </el-dialog>

        <!-- 推广网址-重新生成弹窗 -->
        <el-dialog
            title="温馨提示"
            :visible.sync="dialogRegenerate"
            :close-on-click-modal=false
            width="410px"
            style="text-align: center;">
                <span style="line-height: 24px">已帮您重新生成微信防封短链并复制: <br>{{ regenerateLink }}</span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" round @click="dialogRegenerate = false">我知道了</el-button>
                </span>
        </el-dialog>

        <!-- 专属域名-复制弹窗 -->
        <el-dialog
            title="复制成功"
            :visible.sync="meDialogCpye"
            :close-on-click-modal=false
            width="410px">
                <span>复制成功 {{ cpyeLink }}</span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" round @click="meDialogCpye = false">我知道了</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
    import QRCode from 'qrcodejs2';
    import Clipboard from 'clipboard'; 
    import html2canvas from "html2canvas";
    import { ganeraAgentImportApi, makeShortLinkApi } from '../../http/api'
    export default {
        data() {
            return {
                activeName: 'first',
                list: [],
                me: [],
                showLoading: true,
                fullscreenLoading: false,
                dialogVisible: false,
                dialogCpye: false,
                dialogRegenerate: false,
                cpyeLink: "",
                regenerateLink: "",
                meDialogCpye: false
            }
        },
        methods: {
            // 初始化
            ganeraAgentImportData () {
                var _this = this;
                ganeraAgentImportApi().then(res => {
                    _this.showLoading = false;
                    _this.me = res.data.message.me.link;
                    var res = res.data.message;
                    Object.keys(res).forEach(function(j,k){
                        for(var i = 0; i < res[j].length; i++){
                            _this.list.push(res[j][i])
                        }
                    })
                }).catch(err => {
                    _this.showLoading = false
                })
            },
            // 下载到本地
            downloadLocal() {
                var dragContainer = document.getElementById("downloadQrcode");
                let opts = {
                    useCORS: true,
                    scale: 1
                };
                html2canvas(dragContainer,opts).then((canvas) => {
                    var url = canvas.toDataURL('image/png');    
                    var a = document.createElement("a");
                    a.href = url;
                    a.download = "下载";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                });
            },
            //下拉传多个参数封装
            beforeHandleCommand(item,row){
                return {
                    'command': item,
                    'row': row
                }
            },
            // 下载的下拉事件
            handleAppdown(command) {
                var _this = this;
                this.dialogVisible = true;
                setTimeout(function(){
                    new QRCode(_this.$refs.appdownQrCodeDiv, {
                        text: command.command,
                        width: 190,
                        height: 190,
                        colorDark: "#000", //二维码颜色
                        colorLight: "#fff", //二维码背景色
                        correctLevel: QRCode.CorrectLevel.L//容错率，L/M/H
                    })
                    new QRCode(_this.$refs.linkQrCodeDiv, {
                        text: command.command,
                        width: 190,
                        height: 190,
                        colorDark: "#000", //二维码颜色
                        colorLight: "#fff", //二维码背景色
                        correctLevel: QRCode.CorrectLevel.L//容错率，L/M/H
                    })
                },300)
            },
            // 下载弹窗关闭
            handleClose() {
                this.$refs.appdownQrCodeDiv.innerHTML = '';
                this.$refs.linkQrCodeDiv.innerHTML = '';
            },
            // 复制的下拉事件
            handleCpye (command) {
                if(command.command){
                    this.cpyeLink = command.command;
                }else{
                    this.cpyeLink = command
                }
                new Clipboard(this.$refs.copys);
                this.$nextTick(v => {
                    this.$refs.copys.click()
                })
                if(command.row == 'a'){
                    this.dialogCpye = true;
                }else if(command.row == 'b'){
                    this.$message.success('复制成功');
                }else{
                    this.meDialogCpye = true;
                }
            },
            // 重新生成
            regenerate () {
                var _this = this;
                this.dialogCpye = false;
                this.fullscreenLoading = true;
                var data = {
                    url: this.cpyeLink
                }
                makeShortLinkApi(data).then(res => {
                    _this.fullscreenLoading = false;
                    _this.dialogRegenerate = true;
                    _this.regenerateLink = res.data.message
                }).catch(err => {
                    _this.fullscreenLoading = false
                })
            }
        },
        mounted() {
            this.ganeraAgentImportData();
        },
    }
</script>

<style scoped>
    @import '../../assets/css/promotionZone.css';
</style>