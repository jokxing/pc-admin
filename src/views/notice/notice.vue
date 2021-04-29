<template>
    <div class="notice" v-loading="noticeLoading">
        <h4 class="title">公告</h4>
        <el-row class="notice_tab">
            <el-col :span="4" v-for="(item, index) in tabs" :key="index" :class="{ 'tab_active' : num == index }">
                <div @click="noticeTabClick(item, index)">{{ item }}</div>
            </el-col>
        </el-row>

        <el-table
            :data="tableData"
            style="width: 100%;cursor: pointer"
            :show-header="false"
            class="notice_table"
            id="notice_table"
            @row-click="openDetails">
            <el-table-column
                width="40">
                <i class="iconfont icon-notice primary-color"></i>
            </el-table-column>
            <el-table-column
                width="120">
                {{ type }}
            </el-table-column>
            <el-table-column
                prop="title">
            </el-table-column>
            <el-table-column
                prop="created_at"
                width="180"
                style="text-align: center;">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import { noticeApi } from '../../http/api.js'
    export default {
        data() {
            return {
                noticeLoading: true,
                tabs:['平台公告','会员讯息','体育公告','真人公告','彩票公告'],
                num: 0,
                type: "平台公告",
                tableData: [],
            }
        },
        methods: {
            // 初始化
            noticeInit () {
                var _this = this;
                var data = {
                    type: this.type
                }
                this.noticeLoading = true;
                noticeApi(data).then(res => {
                    _this.noticeLoading = false;
                    _this.tableData = res.data.message
                }).catch(err => {
                    _this.noticeLoading = false;
                })
            },
            // tab事件
            noticeTabClick (item, index) {
                this.num = index;
                this.type = item;
                this.noticeInit()
            },
            // 点击表格事件
            openDetails (row, column, event) {
                this.$router.push('/notice/noticeDetails/' + row.id)
            },
        },
        mounted() {
            this.noticeInit()
        },
    }
</script>

<style scoped>
</style>