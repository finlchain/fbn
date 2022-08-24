//
const config = require('../../config/config.js');
const define = require('./../../config/define.js');
const util = require('./../utils/commonUtil.js');
const dbUtil = require("./../db/dbUtil.js");
const dbFB = require("./../db/dbFB.js");
const dbFBHandler = require("./../db/dbFBHandler.js");
const dbRepl = require("./../db/dbRepl.js");
const logger = require('./../utils/winlog.js');

//
module.exports.setReplInfo = async (subnet_id, blk_num, ip, role, log_file, log_pos, cluster_p2p_addr) => {
    let sql = dbFB.querys.fb.repl_info.insertReplInfo;

    let query_result = await dbUtil.queryPre(sql, [subnet_id, blk_num, ip, role, log_file, log_pos, cluster_p2p_addr]);
}

//
module.exports.delReplInfo = async (subnet_id, blk_num, ip, role, log_file, log_pos, cluster_p2p_addr) => {
    let sql = dbFB.querys.fb.repl_info.deleteReplInfo;

    let query_result = await dbUtil.queryPre(sql, [subnet_id, blk_num, ip, role, log_file, log_pos, cluster_p2p_addr]);
}

//
module.exports.saveReplInfo = async (replData) => {
    let clusterP2pAddr = replData.cluster_p2p_addr;
    
    let replBlkNum = replData.blk_num;
    let ip =  replData.ip;
    let logFile = replData.log_file;
    let logPos = replData.log_pos;

    let subNetId = clusterP2pAddr.slice(10, 14);

    logger.info("clusterP2pAddr : " + clusterP2pAddr + ", subNetId : " + subNetId);
    logger.info("ip : " + ip + ", logFile : " + logFile + ", logPos : " + logPos + ", replBlkNum : " + replBlkNum);
    await dbRepl.setReplSlaveInfo(subNetId, ip, logFile, logPos, define.DB_DEFINE.REPL_PORT);

    //
    // let fbnServerIdHex = '0x' + subNetId + define.NODE_ROLE.NUM.DBN.toString();
    // let fbnServerId = parseInt(fbnServerIdHex);
    // logger.info("fbnServerIdHex : " + fbnServerIdHex + ", fbnServerId : " + fbnServerId);

    let fbnServerId = util.ipToInt(util.getMyReplIP().toString());
    logger.info("fbnServerId : " + fbnServerId);

    let res = await dbRepl.setReplMaster(fbnServerId);

    //
    // dbFBHandler.setReplInfo(subNetId, replBlkNum, util.getMyReplIP().toString(), define.NODE_ROLE.NUM.ISAG, res.fileName, res.filePosition, clusterP2pAddr);
}