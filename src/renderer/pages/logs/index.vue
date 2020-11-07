<template>
        <div class="logs-main">
            <newHead></newHead>
            <div class="logs-center">
                <div class="flex">
                    <div class="anm" v-for="(item,index) in btList" :key="index" @click="getLog(item,index)">{{item.name}}</div>
                </div>
                <div style="margin-top:1rem">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="pageSize"
                        :page-sizes="pageSizes"
                        background
                        align="center"
                        layout="total, sizes, prev, next, jumper"
                        :total="total">
                    </el-pagination>
                    <div>
                        <el-table
                            :data="wsErrTableData"
                            max-height="385"
                            border
                            style="width: 100%">
                            <el-table-column
                            align="center"
                            label="连接总控失败期间发起的踢人指令">
                                <el-table-column
                                prop="date"
                                align="center"
                                sortable
                                label="时间">
                                </el-table-column>
                                <el-table-column
                                prop="message"
                                align="center"
                                sortable
                                show-overflow-tooltip
                                label="消息">
                                </el-table-column>
                                <el-table-column
                                prop="ip"
                                sortable
                                align="center"
                                label="IP">
                                </el-table-column>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="flex">
                    <div class="reset-bt" @click="resetWsMsg" v-if="btKey==1&&wsErrData.length>0">
                                一键重发指令
                    </div>
                    <div class="reset-bt reset-bg-warning" @click="cleanLog('err')" v-if="wsErrData.length>0">清空漏踢日志</div>
                </div>
            </div>
        </div>
</template>

<script>
import newHead from '@/components/newHead'
export default {
    components:{newHead},
    activated() {
        this.getLog('t',0)
    },
    data() {
        return {
            btList:[
                // {name:'ws其它',key:'log'},
                {name:'ws漏踢',key:'ws'},
            ],
            btKey:0,
            wsOtherData:[],
            wsErrData:[],
            total:0,
            pageSize:10,
            pageSizes:[10,20,30,50],
            currentPage:1
        }
    },
    computed: {
        wsErrTableData:{
            get:function(){
                this.$nextTick(()=>{
                    this.total = this.wsErrData.length
                })
                return this.wsErrData.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage)
            },
            set:function(val){
                console.log(val);
                this.total = this.wsErrData.length
            }
        }
    },
    methods: {
        getLog(data,index){
            this.currentPage = 1
            this.total = 0
            this.btKey=index
            let doms = document.getElementsByClassName('anm')
            Array.from(doms).forEach((item,j)=>{
                if(j==index){
                    doms[j].classList.add('anmClick')
                }else{
                    doms[j].classList.remove('anmClick')
                }
            })
            this.getWsErr()
        },
        cleanLog(key){
            this.$confirm(`将清空日志,该操作不可逆 是否继续`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(async () => {
                switch (key) {
                    case 'other':
                        await this.$axios.post('cleanTxt',{key:'wsErr'})
                        break;
                    case 'err':
                        await this.$axios.post('cleanTxt',{key:'wsOther'})
                        break;
                }
                this.getLog('t',this.btKey)
            }).catch(()=>{
                this.$message({
                type:'info',
                message: '已取消操作'
                });
            })
        },
        resetWsMsg(){
            this.$confirm(`将重发踢人指令,该操作不可逆 是否继续`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                let sData = []
                this.wsErrData.forEach((item)=>{
                    let timeG = new Date().getTime()-(new Date(item.date)).getTime()
                    if(timeG/(1000*60)<60){
                        sData.push(item.message)
                    }
                })
                if(sData.length!=0){
                    this.$pm.resetWsMsg(sData)
                    this.getLog('t',1)
                }else{
                    this.$message.error('近一小时内无漏掉的命令')
                }
            }).catch(()=>{
                this.$message({
                type:'info',
                message: '已取消操作'
                });
            })
        },
        async getWsErr(){
            this.wsErrData = []
            let {data:res} = await this.$axios.post('getWsErrLog')
            if(res&&res!=0){
                res = res.split(';').filter(item=>item!='')
                this.wsErrData = res.map((item)=>JSON.parse(item)).sort((a,b)=>Date.parse(b.date)-Date.parse(a.date))
            }
        },
        //每页条数变化
        handleSizeChange(val){
            this.pageSize = val
        },
        //当前页数变化
        handleCurrentChange(val){
            this.currentPage = val
        },
    },
}
</script>

<style lang="scss" scoped>
.logs-main{
    width: 100%;
    height: 100vh;
}
.logs-center{
    padding: 0 1rem;
}
.flex{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.anm{
		list-style: none;
		width: 100px;
		height: 100px;
		margin: 0 25px;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		color: rgba(#000, 1);
		position: relative;
		transition: 0.6s ease;
        cursor: pointer;
		&::before {
			content: "";
			position: absolute;
			top: 50%;
			left: 50%;
			margin: -50px 0 0 -50px;
			width: 100%;
			height: 100%;
			opacity: 0.5;
			background: #fff;
			transition: 0.6s ease;
			animation: blob 12s linear infinite alternate;
		}
		&.link--twitter::before {
			background: linear-gradient(165deg, #1DA1F2, #657786);
		}
		&.link--facebook::before {
			background: linear-gradient(165deg, #3C5A99, #dfe3ee);
		}
		&.link--instagram::before {
			background: linear-gradient(165deg, #405de6, #fd1d1d);
		}
		&:hover {
			color: rgb(0, 0, 0);
			&:before {
				opacity: .5;
                background: #55b5f1;
			}
		}
}
.anmClick{
    &:before {
				opacity: .5;
                background: #55b5f1;
	}
}
@keyframes blob {
	0%,
	100% {
		border-radius: 43% 77% 80% 40% / 40% 40% 80% 80%;
	}
	20% {
		border-radius: 47% 73% 61% 59% / 47% 75% 45% 73%;
	}
	40% {
		border-radius: 46% 74% 74% 46% / 74% 58% 62% 46%;
	}
	60% {
		border-radius: 47% 73% 61% 59% / 40% 40% 80% 80%;
	}
	80% {
		border-radius: 50% 70% 52% 68% / 51% 61% 59% 69%;
	}
}
.reset-bt{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 30px;
    width:90px;
    height:45px;
    cursor: pointer;
    color: black;
    margin: .3rem .7rem;
    background: linear-gradient(-125deg, #57bdbf, #2f9de2);
    font-size: 13px;
    box-shadow: rgba($color: #000000, $alpha: .3) 0px 0px 9px;
}
.reset-bg-warning{
    background: linear-gradient(-125deg, #ca3e25, #e2c72f);
}
</style>
