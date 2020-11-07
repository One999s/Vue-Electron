

const process = require('child_process')
const {Message:$message} = require('element-ui')
const fs = require('fs');
const os = require('os')
import axios from 'axios'
class pm{
    allData=[];
    restartCode=null;
    init(){
        try{
            this.allData = JSON.parse(fs.readFileSync('./serve.json','utf-8'))
        }catch(err){
            $message.error('读取文件失败')
        }
    }
    getJList(){
        let valList = process.execSync(`pm2 jlist`)
        return JSON.parse(valList.toString())
    }
    restart(key){
        let valid = process.exec(`pm2 restart ${key} --watch`)
        return valid
    }
    restartAll(){
        let valid = process.exec(`pm2 restart all --watch`)
        return valid
    }
    killProgRestart(pid,name){
        let valid = process.exec(`pm2 stop ${name} --watch && taskkill /pid ${pid} -t -f`)
        console.log(valid);
        return valid
    }
    superHandle(data){
        let valid = null;
        switch (data) {
            case 'resurrect':
                valid = process.exec(`pm2 resurrect`)
                return valid;
            case 'flush':
                valid = process.exec(`pm2 flush`)
                return valid;
        }
    }
    async resetWsMsg(data){
        let {data:res} = await axios.post('resetWsMsg',data)
        if(res.status==200){
            $message.success('成功')
        }else{
            $message.error(res.msg)
        }
    }
    async openLogPath(){
        let filePath = os.userInfo().homedir
        process.spawn('explorer.exe',[filePath+`\\.pm2\\logs`])
    }
}
export default pm