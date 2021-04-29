<template>
    <div>
        <h4 class="title">代理邀请推广</h4>
        <el-row v-loading="showLoading">
            <el-col :span="24" class="agent_import_list">
                <img src="../../assets/img/generaAgentRegImport.png">
                <div class="right">
                    <span class="link">{{ q.url }}</span>
                    <el-dropdown trigger="click" @command="handleCpye">
                        <el-button type="primary" round>复制<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :command="beforeHandleCommand(q.wx, 'a')">防封短链(微信)</el-dropdown-item>
                            <el-dropdown-item :command="beforeHandleCommand(q.qq, 'a')">防封短链(QQ)</el-dropdown-item>
                            <el-dropdown-item :command="beforeHandleCommand(q.url, 'b')">长链接</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-col>
        </el-row>

        <!-- 隐藏复制方便获取连接 -->
        <button ref="copys" :data-clipboard-text="cpyeLink" style="display: none;">复制</button>  

        <!-- 复制弹窗 -->
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

        <!-- 重新生成弹窗 -->
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
    </div>
</template>

<script>
    import Clipboard from 'clipboard'; 
    import { generaAgentRegImportApi, makeShortLinkApi } from '../../http/api'
    export default {
        data () {
            return {
                showLoading: false,
                fullscreenLoading: false,
                q: "",
                dialogCpye: false,
                cpyeLink: "",
                dialogRegenerate: false,
                regenerateLink: "",
            }
        },
        methods: {
            generaAgentRegImport() {
                var _this = this;
                this.showLoading = true;
                generaAgentRegImportApi().then(res => {
                    _this.showLoading = false;
                    _this.q = res.data.message.link
                }).catch(err => {
                    _this.showLoading = false;
                })
            },
            //下拉传多个参数封装
            beforeHandleCommand(item,row){
                return {
                    'command': item,
                    'row': row
                }
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
        mounted () {
            this.generaAgentRegImport()
        }
    }
</script>

<style scoped>
    @import '../../assets/css/promotionZone.css';
</style>