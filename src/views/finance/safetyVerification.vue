<template>
    <div class="safety_verification" v-loading.fullscreen.lock="fullscreenLoading">
        <el-page-header @back="codeBack" content="安全验证"></el-page-header>
        <div class="drawing_explain">
            <i class="iconfont icon-bangzhu primary-color"></i>
            <el-link :underline="false">提款说明</el-link>
        </div>

        <el-row class="withdraw_infor">
            <h3 class="primary-color">{{ withdrawMoney }}.00<span>元</span></h3>
            <span style="margin-left: 17px">共 {{ bankTable.length }} 张卡</span>
        </el-row>

        <el-row class="bank_list">
            <table rules=none>
                <thead>
                    <tr>
                        <th style="width: 242px;">银行</th>
                        <th style="width: 200px;">卡号</th>
                        <th style="width: 100px;">姓名</th>
                        <th style="width: 240px;">
                            金额
                            <el-tooltip class="item" effect="dark" placement="top">
                                <div slot="content" style="font-size: 14px;line-height: 20px">为了您的提款安全，建议您使用我们<br/>生成的安全金额，且单笔最高提款金<br/>额为49999</div>
                                <i class="iconfont icon-jiufuqianbao"></i>
                            </el-tooltip>
                        </th>
                        <th style="width: 150px;">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in bankTable" :key="index">
                        <td>
                            <div class="grey" v-show="item.bank_name == ''">
                                <div class="bank_img"></div>
                                银行名称
                            </div>
                            <div v-show="item.bank_name != ''">
                                <div class="bank_img">
                                    <img :src="item.bankImg" width="22">
                                </div>
                                {{ item.bank_name }}
                            </div>
                        </td>

                        <td class="grey" v-show="item.card_number == ''">待填写</td>
                        <td v-show="item.card_number != ''">{{ item.card_number }}</td>

                        <td class="grey" v-show="item.account == ''">待填写</td>
                        <td v-show="item.account != ''">{{ item.account }}</td>
                        <td>
                            <el-input v-model="item.money" @input.delete.native="moneyKeyup($event,index)" @focus="moneyFocus(index)"></el-input>
                        </td>
                        <td class="primary-color">
                            <span @click="modifyClick(item,index)">修改</span>
                            <i class="el-icon-delete" @click="delClick(index)"></i>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="grey">差额：{{ difference }} 元</td>
                    </tr>
                </tbody>
            </table>
        </el-row>

        <el-row class="withdraw_btn">
            <el-button plain round class="primary-color bor_primary" @click="addBankClick">+添加银行卡</el-button>
        </el-row>

        <el-row class="payment_password">
            <p>支付密码</p>
            <el-input type="password" v-model="password" maxlength="6"></el-input>
            <span class="primary-color" @click="$router.push('/information')">忘记密码 ？</span>
        </el-row>

        <el-row class="withdraw_btn">
            <el-button class="primary-button" round @click="submit">确认提款</el-button>
        </el-row>

        <!-- 添加银行卡 -->
        <el-dialog
            title="添加银行卡信息"
            :visible.sync="dialogVisible"
            :close-on-click-modal=false
            :show-close=false
            width="680px">
                <el-row class="add_bank_form">
                    <ul>
                        <li>
                            <p>银行卡卡号</p>
                            <span v-if="bankTabNum != -1" class="bank_num">{{ bankForm.card_number.substring(0,4) + '****' + bankForm.card_number.substring(bankForm.card_number,bankForm.card_number.length-4) }}</span>
                            <el-input placeholder="请输入银行卡号" v-model="bankForm.card_number" v-if="bankTabNum == -1" maxlength="19"></el-input>
                        </li>
                        <li>
                            <p>持卡人姓名</p>
                            <el-input placeholder="持卡人姓名" :disabled="bankTabNum != -1" v-model="bankForm.account"></el-input>
                        </li>
                        <li>
                            <p>开户银行</p>
                            <el-select v-model="bankForm.bank_name" :disabled="bankTabNum != -1">
                                <el-option v-for="(item,index) in bankList" :key="index" :label="item.label" :value="item.label"></el-option>
                            </el-select>
                        </li>
                    </ul>
                </el-row>
                <el-row class="add_bank_form">
                    <ul>
                        <li>
                            <p>开户行地址</p>
                            <el-select v-model="bankForm.card_address.province" placeholder="省" :disabled="bankTabNum != -1">
                                <el-option v-for="(item,index) in arr" :key="index" :label="item.name" :value="item.name"></el-option>
                            </el-select>
                        </li>
                        <li>
                            <p></p>
                            <el-select v-model="bankForm.card_address.city" placeholder="市" :disabled="bankTabNum != -1">
                                <el-option v-for="(item,index) in cityArr" :key="index" :label="item.name" :value="item.name"></el-option>
                            </el-select>
                        </li>
                        <li>
                            <p></p>
                            <el-select v-model="bankForm.card_address.district" placeholder="区" :disabled="bankTabNum != -1">
                                <el-option v-for="(item,index) in districtArr" :key="index" :label="item.name" :value="item.name"></el-option>
                            </el-select>
                        </li>
                    </ul>
                </el-row>
                <el-row class="recently_used_card">
                    <h5>我的银行卡</h5>
                    <div class="no_card" v-show="bankCardList.length == 0">
                        <i class="iconfont icon-zu"></i>
                        <p>暂无银行卡信息，记录最近10张银行卡信息</p>
                    </div>
                    <el-row v-show="bankCardList.length > 0">
                        <ul>
                            <li :class="{ 'bor_active': bankTabNum == index }" v-for="(item, index) in bankCardList" :key="index" @click="bankTabClick(item,index)">
                                <img :src="item.img" width="30">
                                <span>****{{ item.card_number.substring(item.card_number,item.card_number.length-4) }}</span>
                                <i class="el-icon-error" @click.stop="deleteClick(item.id)"></i>
                            </li>
                        </ul>
                    </el-row>
                </el-row>
                <span slot="footer" class="dialog-footer">
                    <el-button plain @click="addBankCancel">取 消</el-button>
                    <el-button type="primary" @click="addBankConfirm">确 定</el-button>
                </span>
        </el-dialog>

        <!-- 发送验证码 -->
        <el-dialog
            title="本次需要安全验证"
            :visible.sync="codeVisible"
            :before-close="codeClose"
            width="380px">
                <el-row class="withdraw_code">
                    <p>请使用已绑定手机号<span class="primary-color">{{ mobile }}</span>做本次验证 </p>
                    <el-input placeholder="请输入验证码" v-model="code"></el-input>
                    <span class="primary-color code" @click="sendCodeClick">{{ codeText }}</span>
                </el-row>
                <span slot="footer" class="dialog-footer">
                    <el-button plain @click="withDrawClick">提交</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
    import bankArr from '../../assets/js/bankArr.js'
    import arrAll from '../../../public/js/city.js'
    import { BankCardListApi, AddBankCardApi, DelBankCardApi, SendSmsApi, checkPayPwdApi, withDrawApi } from '../../http/api.js'
    export default {
        data() {
            return {
                fullscreenLoading: false,
                tableData: [],
                dialogVisible: false,
                codeVisible: false,
                bankList: bankArr,
                bankType: "",
                // 城市
                arr: [],
                cityArr: [],
                districtArr: [],
                province: "",
                city: "",
                district: "",
                // 银行卡tab
                bankTabNum: -1,
                // 银行卡表单
                bankForm: {
                    account: "",
                    bank_name: "",
                    card_number: "",
                    card_address: {
                        province: "",
                        city: "",
                        district: "",
                    }
                },
                // 银行卡列表
                bankCardList: [],
                // 获取银行卡的索引
                i: -1,
                // 银行表格
                bankTable: [],
                // 提款金额
                withdrawMoney: 0,
                // 差额
                difference: 0,
                keyupNum: 0,
                pre_difference: 0,
                // 支付密码
                password: "",
                // 验证码
                codeText: "获取验证码",
                codeSet: null,
                key: "",
                code: "",
                // 手机号
                mobile: ""
            }
        },
        methods: {
            // 输入金额获取事件
            moneyFocus (index) {
                this.keyupNum = this.bankTable[index].money == '' ? 0 : parseFloat(this.bankTable[index].money);

                var sumMoney = 0;
                for(var i = 0; i < this.bankTable.length; i++) {
                    sumMoney += this.bankTable[i].money == '' ? 0 : parseFloat(this.bankTable[i].money)
                    this.pre_difference = parseInt(this.withdrawMoney) - sumMoney
                }
            },
            // 输入金额事件
            moneyKeyup (event,index) {
                // 超过49999
                if(parseInt(this.bankTable[index].money) > 49999){
                    this.bankTable[index].money = 49999
                }

                var sumMoney = 0;
                for(var i = 0; i < this.bankTable.length; i++) {
                    sumMoney += this.bankTable[i].money == '' ? 0 : parseFloat(this.bankTable[i].money)
                    this.difference = (parseFloat(this.withdrawMoney) - sumMoney).toFixed(2);
                }

                if(event.inputType != 'deleteContentBackward'){ //否删除按钮
                    if(sumMoney > parseFloat(this.withdrawMoney)){
                        this.bankTable[index].money = this.keyupNum + parseFloat(this.pre_difference);
                        this.difference = 0;
                        if(this.difference < 0){
                            this.difference = this.pre_difference
                        }
                    }else{
                        this.keyupNum = parseFloat(this.bankTable[index].money);
                        this.pre_difference = this.difference
                    }
                }else{ //是删除按钮
                    this.keyupNum = this.bankTable[index].money == "" ? 0 : parseFloat(this.bankTable[index].money);
                    this.pre_difference = this.difference
                }

                var generateBankCardData = JSON.stringify(this.bankTable)
                localStorage.setItem('generateBankCardData',generateBankCardData)
            },
            // 添加银行卡-弹窗
            addBankClick () {
                var _this = this;
                this.dialogVisible = true;
                this.BankCardListData()
            },
            BankCardListData(){
                var _this = this;
                BankCardListApi().then(res => {
                    _this.bankCardList = res.data.message;
                    for(var i = 0; i < _this.bankCardList.length; i++){
                        for(var j = 0; j < bankArr.length; j++){
                            if(_this.bankCardList[i].bank_name == bankArr[j].label){
                                _this.bankCardList[i]['img'] = bankArr[j].img;
                            }
                        }
                    }
                }).catch(err => {
                })
            },
            // 银行卡tab
            bankTabClick(item,index) {
                this.bankTabNum = index;
                this.bankForm = item;
            },
            // 删除银行卡
            deleteClick (id) {
                var _this = this;
                var data = {
                    id: id
                }
                this.$confirm('确认删除该银行卡?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.fullscreenLoading = true;
                    DelBankCardApi(data).then(res => {
                        _this.fullscreenLoading = false;
                        _this.$message.success(res.data.message);
                        _this.addBankClick()
                    }).catch(err => {
                        _this.fullscreenLoading = false;
                        _this.$message.error(err.message)
                    })
                }).catch(() => {
                });
            },
            // 添加银行卡-弹窗-取消
            addBankCancel () {
                this.dialogVisible = false;
                this.bankForm = {
                    account: "",
                    bank_name: "",
                    card_number: "",
                    card_address: {
                        province: "",
                        city: "",
                        district: "",
                    },
                    bankId: ""
                };
                this.bankTabNum = -1
            },
            // 添加银行卡-弹窗-确认
            addBankConfirm () {
                var _this = this;
                if(this.bankForm.card_number == ''){
                    this.$message({
                        message: "银行卡卡号应为13-19位数字",
                        type: "warning"
                    })
                }else if(this.bankForm.account == ""){
                    this.$message({
                        message: "请填写持卡人姓名",
                        type: "warning"
                    })
                }else if(this.bankForm.bank_name == ""){
                    this.$message({
                        message: "请选择开户银行",
                        type: "warning"
                    })
                }else if(this.bankForm.card_address.province == '' || this.bankForm.card_address.city == '' || this.bankForm.card_address.district == ''){
                    this.$message({
                        message: "请选择开户行地址",
                        type: "warning"
                    })
                }else if (this.bankForm.account.length < 2){
                    this.$message({
                        message: "请输入正确的姓名",
                        type: "warning"
                    })
                }else{
                    // 添加银行卡
                    if(this.bankTabNum == -1){
                        var data = {
                            account: this.bankForm.account,
                            bank_name: this.bankForm.bank_name,
                            card_number: this.bankForm.card_number,
                            province: this.bankForm.card_address.province,
                            city: this.bankForm.card_address.city,
                            district: this.bankForm.card_address.district,
                        }
                        this.fullscreenLoading = true;
                        AddBankCardApi(data).then(res => {
                            _this.fullscreenLoading = false;
                            _this.dialogVisible = false;

                            for(var j = 0; j < bankArr.length; j++){
                                if(_this.bankForm.bank_name == bankArr[j].label){
                                    data['bankImg'] = bankArr[j].img
                                }
                            }
                            // 给表格对应的行赋值
                            //修改
                            if(_this.i != -1){
                                data['i'] = _this.i;
                                data['money'] = _this.bankTable[_this.i].money;
                                data['bankId'] = res.data.message.id;
                                _this.bankTable[_this.i] = data;
                            }else{ //添加
                                data['i'] = _this.bankTable.length + 1;
                                data['money'] = '';
                                data['bankId'] = res.data.message.id;
                                _this.bankTable.push(data)
                            }
                            // 有修改表格对应的表单就更新localStorage
                            var bankData = JSON.stringify(_this.bankTable);
                            localStorage.setItem('generateBankCardData', bankData)
                            // 重置
                            _this.bankForm = {
                                account: "",
                                bank_name: "",
                                card_number: "",
                                card_address: {
                                    province: "",
                                    city: "",
                                    district: "",
                                }
                            };
                            _this.bankTabNum = -1;
                            _this.i = -1
                        }).catch(err => {
                            _this.fullscreenLoading = false;
                            _this.$message.error(err.message)
                        })
                    }else{ //选中银行卡
                        _this.dialogVisible = false;
                        var data = {
                            account: this.bankForm.account,
                            bank_name: this.bankForm.bank_name,
                            bankImg: this.bankForm.img,
                            card_number: this.bankForm.card_number,
                            province: this.bankForm.card_address.province,
                            city: this.bankForm.card_address.city,
                            district: this.bankForm.card_address.district,
                            bankId: this.bankForm.id
                        }
                        // 修改
                        if(this.i != -1){
                            data.i = this.i;
                            data.money = this.bankTable[this.i].money;
                            this.bankTable[this.i] = data;
                        }else{ //添加
                            data.i = this.bankTable.length + 1;
                            data.money = '';
                            this.bankTable.push(data)
                        }
                        // 有修改表格对应的表单就更新localStorage
                        var bankData = JSON.stringify(this.bankTable);
                        localStorage.setItem('generateBankCardData', bankData)
                        // 重置
                        _this.bankForm = {
                            account: "",
                            bank_name: "",
                            card_number: "",
                            card_address: {
                                province: "",
                                city: "",
                                district: "",
                            },
                            bankId: ""
                        };
                        _this.bankTabNum = -1;
                        _this.i = -1
                    }
                }
            },
            // 修改
            modifyClick (item,index) {
                this.dialogVisible = true;
                this.i = index;
                this.BankCardListData();
            },
            // 删除
            delClick (index) {
                this.bankTable.splice(index,1);
                var generateBankCardData = JSON.stringify(this.bankTable);
                localStorage.setItem('generateBankCardData',generateBankCardData);

                if(this.bankTable.length > 0){
                    var num = 0;
                    for(var i = 0; i < this.bankTable.length; i++) {
                        num += this.bankTable[i].money == '' ? 0 : parseFloat(this.bankTable[i].money)
                        this.difference = (this.withdrawMoney - num).toFixed(2)
                    }
                }else{
                    this.difference = this.withdrawMoney
                }
            },
            // 提交
            submit () {
                var _this = this;
                var is_perfect = false;
                for(var i = 0; i < this.bankTable.length; i++){
                    if(this.bankTable[i].account == ""){
                        is_perfect = true
                    }else if(this.bankTable[i].money == ''){
                        is_perfect = true
                    }else{
                        is_perfect = false
                    }
                }
                
                if(is_perfect){
                    this.$message({
                        message: '请完善银行卡信息或提款金额',
                        type: 'warning'
                    });
                }else if(this.password == ''){
                    this.$message({
                        message: '请输入支付密码',
                        type: 'warning'
                    });
                }else if(this.password.length < 6){
                    this.$message({
                        message: '支付密码为6位数字或者字母，请重新输入',
                        type: 'warning'
                    });
                }else{
                    var data = {
                        pay_pwd: this.password
                    };
                    this.fullscreenLoading = true;
                    checkPayPwdApi(data).then(res => {
                        _this.fullscreenLoading = false
                        _this.codeVisible = true
                    }).catch(err => {
                        _this.fullscreenLoading = false;
                        _this.$message.error(err.message)
                    })
                }
            },
            // 发送验证码
            sendCodeClick () {
                var _this = this;
                if(this.codeText == '获取验证码' || this.codeText == '重新获取'){
                    this.codeText = "发送中";
                    SendSmsApi().then(res => {
                        _this.key = res.data.key;
                        var cont = 90;
                        _this.codeText = cont + "s";
                        _this.codeSet = setInterval(function(){
                            cont --;
                            _this.codeText = cont + "s";
                            if(cont == 0){
                                clearInterval(_this.codeSet);
                                _this.codeText = '重新获取'
                            }
                        },1000)
                    }).catch(err => {
                        _this.codeText = "获取验证码";
                        _this.$message.error(err.message)
                    })
                }
            },
            // 发起提款
            withDrawClick () {
                var _this = this;
                if(this.code == ''){
                    this.$message.error('验证码不能为空')
                }else if(this.key == ''){
                    this.$message.error('请发送验证码')
                }else{
                    var data = {
                        code: this.code,
                        key: this.key,
                        bank: JSON.stringify(this.bankTable),
                        password: this.password
                    }
                    this.fullscreenLoading = true;
                    withDrawApi(data).then(res => {
                        _this.fullscreenLoading = false;
                        _this.$message.success(res.data.message);
                        _this.$router.push({
                            name: 'drawing',
                            params: {
                                activeName: "second"
                            }
                        })
                        localStorage.removeItem('generateBankCardData')
                    }).catch(err => {
                        _this.fullscreenLoading = false;
                        _this.$message.error(err.message)
                    })
                }
            },
            // 关闭验证码弹窗时候重置
            codeClose() {
                this.codeVisible = false;
                clearInterval(this.codeSet);
                this.codeText = '获取验证码';
                this.key = "";
                this.code = "";
                this.mesCode = ""
            },
            //省市联动
	    	updateCity () {
                this.bankForm.card_address.city = "";
                this.bankForm.card_address.district = "";
				for (var i in this.arr) {
					var obj = this.arr[i];
					if (obj.name == this.bankForm.card_address.province) {
						this.cityArr = obj.sub;
						break;
					}
				}
            },
            updateDistrict () {
                this.bankForm.card_address.district = "";
                for (var i in this.cityArr) {
                    var obj = this.cityArr[i];
                    if (obj.name == this.bankForm.card_address.city) {
                        this.districtArr = obj.sub;
                        break;
                    }
                }
            },
            // 返回
            codeBack() {
                this.$router.go(-1);
                this.$cookies.remove('withdrawMoney')
            }
        },
		beforeMount: function () {
            this.updateCity();
		},
		watch: {
			"bankForm.card_address.province" () {
                if(this.bankTabNum == '-1'){
                    this.updateCity();
                    this.updateDistrict()
                }
            },
            "bankForm.card_address.city" () {
                if(this.bankTabNum == '-1'){
                    this.updateDistrict()    
                }
            }
		},
        mounted() {
            this.arr = arrAll;
            var generateBankCardData = localStorage.getItem('generateBankCardData');
            this.bankTable = JSON.parse(generateBankCardData);
            this.withdrawMoney = localStorage.getItem('withdrawMoney');

            // 刷新后差额=提款总价-表格金额
            if(this.bankTable.length > 0){
                var num = 0;
                for(var i = 0; i < this.bankTable.length; i++) {
                    num += this.bankTable[i].money == '' ? 0 : parseFloat(this.bankTable[i].money)
                    this.difference = (this.withdrawMoney - num).toFixed(2)
                }
            }else{
                this.difference = this.withdrawMoney
            }

            // 获取手机号
            this.mobile = localStorage.getItem('mobile')
        },
        beforeDestroy() {
            clearInterval(this.codeSet);
        },
    }
</script>

<style scoped>
    @import url(../../assets/css/finance.css);
</style>