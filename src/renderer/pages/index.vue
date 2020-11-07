<template>
  <div id="wrapper">
      <main-head></main-head>
        <div>
        </div>
        <el-row>
          <el-col :span="24">
          <el-table
            border
            :data="tableData"
            max-height="380"
            >
            <el-table-column
              prop="pid"
              align="center"
              label="pId">
            </el-table-column>
            <el-table-column
              prop="name"
              align="center"
              label="任务名">
            </el-table-column>
            <el-table-column
              prop="pm2_env.restart_time"
              align="center"
              label="重启次数">
            </el-table-column>
            <el-table-column
              prop="pm2_env.status"
              align="center"
              label="状态">
              <template slot-scope="scope">
                <div>
                  <el-tag type="success" v-if="scope.row.pm2_env.status=='online'">启动</el-tag>
                  <el-tag type="warning" v-if="scope.row.pm2_env.status=='stopped'">停止</el-tag>
                  <el-tag type="danger" v-if="scope.row.pm2_env.status=='errored'">错误</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="pm2_env.watch"
              align="center"
              label="监听">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.pm2_env.watch==true">是</el-tag>
                <el-tag type="warning" v-if="scope.row.pm2_env.watch==false">否</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="runtime"
              align="center"
              label="已运行">
              <template slot-scope="scope">
                  <el-tag type="info">{{scope.row.runtime}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作">
              <template slot-scope="scope">
                    <el-button type="primary" plain round @click="restart(scope.row)" style="transform:scale(.9)">重启</el-button>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作">
              <template slot-scope="scope">
                <div class="flex">
                    <el-button type="danger" plain round @click="killProgRestart(scope.row)" style="transform:scale(.9)">杀死进程</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          </el-col>
        </el-row>
        <div class="hadBox boxShadow">
          <div v-for="(item,index) in handleList" :key="index" class="">
            <div class="had-item boxShadow" :class="item.name=='高级操作'?'bg-danger':''" @click="hadHandle(item)">
              <i :class="item.icon"></i>
              <p>{{item.name}}</p>
            </div>
          </div>
        </div>

        <el-dialog
          title="谨慎操作"
          :visible.sync="centerDialogVisible"
          width="80%"
          center>
          <div class="flex">
            <div v-for="(item,index) in superFnList" :key="index" class="had-item boxShadow bg-danger" @click="superFnHandle(item)">
              <i :class="item.icon"></i>
              <p>{{item.name}}</p>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false" style="width:80%;background:skyblue">取 消</el-button>
          </span>
        </el-dialog>
      </div>
</template>

<script>
  import mainHead from '../components/mainHead'
  export default {
    name: 'index',
    components: { mainHead },
    data() {
      return {
        tableData:[],
        handleList:[
          {name:'获取状态',icon:'el-icon-document'},
          {name:'重启所有',icon:'el-icon-refresh-right'},
          {name:'漏踢日志',icon:'el-icon-view'},
          {name:'高级操作',icon:'el-icon-warning-outline'},
          {name:'打开日志',icon:'el-icon-view'},
        ],
        centerDialogVisible:false,
        superFnList:[
          {name:'重载',key:'resurrect',icon:'el-icon-sunset'},
          {name:'清空日志',key:'flush',icon:'el-icon-delete'}
        ]
      }
    },
    activated() {
      this.getData()
    },
    methods: {
      getData(){
        let data = this.$pm.getJList()
        if(data){
          console.log(data);
          data.forEach((item)=>{
            let runtime = parseInt((new Date().getTime()-item.pm2_env.pm_uptime)/(1000*60))
            item.runtime = runtime<60?`${runtime}分`:(runtime<1440?`${(runtime/(60)).toFixed(2)}时`:`${(runtime/(24*60)).toFixed(2)}天`)
          })
          this.tableData = data
          this.$message.success('获取成功')
        }
      },
      restart(data){
        this.$confirm(`将重启${data.name}服务,是否继续`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let valid = this.$pm.restart(data.name)
            console.log(valid);
            if(valid){
                this.$message({
                type: 'success',
                message: '重启成功,请稍后手动获取状态!'
              });
            }else{
              this.$message({
                type: 'error',
                message: '出错了!'
              });
            }
          }).catch(()=>{
            this.$message({
              type:'info',
              message: '已取消操作'
            });
          })
      },
      killProgRestart(data){
        this.$confirm(`将杀死该进程,是否继续`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let valid = this.$pm.killProgRestart(data.pid,data.name)
            if(valid){
              this.$message.success('杀死进程,请手动重启并获取最新状态')
            }else{
              this.$message({
                type: 'error',
                message: '出错了!'
              });
            }
          }).catch(()=>{
            this.$message({
              type:'info',
              message: '已取消操作'
            });
        })
      },
      restartAll(){
        this.$confirm(`将重启所有服务,是否继续`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let valid = this.$pm.restartAll()
            if(valid){
              console.log(valid);
              this.$message.success('重启成功,请稍后手动获取最新状态')
            }else{
              this.$message({
                type: 'error',
                message: '出错了!'
              });
            }
          }).catch(()=>{
            this.$message({
              type:'info',
              message: '已取消操作'
            });
          })
      },
      openLogs(){
        let win = this.$Win.createWin({
          width: 800,
          height: 650,
          windowConfig: {
            name:'logs',
            // vibrancy:true,
            router: 'logs'
          }
        })
        win.on('closed', () => {
          win = null
        })
        win.show()
      },
      hadHandle(item){
        let key = item.name
        switch (key) {
          case '获取状态':
            this.getData()
            break;
          case '重启所有':
            this.restartAll()
            break;
          case '漏踢日志':
            this.openLogs()
            break;
          case '高级操作':
            this.centerDialogVisible = true
            break;
          case '打开日志':
            this.$pm.openLogPath()
            break;
        }
    },
    superFnHandle(data){
      this.$confirm(`将进行${data.name},该操作不可逆 是否继续`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let valid = this.$pm.superHandle(data.key)
            if(valid){
              this.$message.success(`${data.name}操作成功`)
            }else{
              this.$message({
                type: 'error',
                message: '出错了!'
              });
            }
            this.centerDialogVisible =false
          }).catch(()=>{
            this.$message({
              type:'info',
              message: '已取消操作'
            });
          })
    }
    }
  }
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }
  #wrapper {
    height: 100vh;
    padding: 0 .7rem;
    width: 100%;
  }
  .hadBox{
    width: 96%;
    margin-top:1rem;
    display: flex;
    justify-content: space-around;
    position: fixed;
    bottom: 20px;
    border-radius: 30px;
    padding: 5px 0;
    transform:scale(.9);

    overflow: hidden;
    background:rgba($color: #000000, $alpha: .7);
  }
  .boxShadow{
    box-shadow: rgba($color: #000000, $alpha: .3) 0px 0px 9px;
  }
  .had-item{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 70px;
    height: 70px;
    margin: 0 .7rem;
    background: linear-gradient(-125deg, #57bdbf, #2f9de2);
    font-size: 13px;
    cursor: pointer;
    i{
      font-size: 30px;
    }
  }
  .bg-danger{
    background: linear-gradient(-125deg, #f3c257, #e2682f);
  }
  .flex{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-table .cell{
    display: flex;
    justify-content: center;
  }
</style>
