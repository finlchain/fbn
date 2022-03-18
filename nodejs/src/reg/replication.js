//
const config = require('./../../config/config.js');
const define = require('./../../config/define.js');
const cliHandler = require('./../cli/cliHandler.js');
const dbUtil = require('./../db/dbUtil.js');
const dbFB = require('./../db/dbFB.js');
const util = require('./../utils/commonUtil.js');
const logger = require('./../utils/winlog.js');

// Replication Reset
module.exports.resetReplData = async () => {
    logger.debug("func : resetReplData");

    await dbUtil.query(dbFB.querys.fb.truncateFbReplInfo);
}

// Replication Get
module.exports.getReplData = async (blkNum, role, clusterP2pAddr) => {
    logger.debug("func : getReplData");

    let query_result;

    //
    if (typeof blkNum === 'undefined')
    {
        query_result = await dbUtil.query(dbFB.querys.fb.repl_info.selectReplInfo);
    }
    else if (typeof role === 'undefined')
    {
        let maxBlkNum;

        let query_result_1 = await dbUtil.queryPre(dbFB.querys.fb.repl_info.selectMaxReplInfoByBN, [blkNum]);
        if (query_result_1.length)
        {
            maxBlkNum = query_result_1[0].max_blk_num;
            logger.debug("maxBlkNum : " + maxBlkNum);
    
            query_result = await dbUtil.queryPre(dbFB.querys.fb.repl_info.selectReplInfoByBN, [maxBlkNum]);
        }
    }
    else if (typeof clusterP2pAddr === 'undefined')
    {
        let maxBlkNum;

        let query_result_1 = await dbUtil.queryPre(dbFB.querys.fb.repl_info.selectMaxReplInfoByBNAndRole, [blkNum, role]);
        if (query_result_1.length)
        {
            maxBlkNum = query_result_1[0].max_blk_num;
            logger.debug("maxBlkNum : " + maxBlkNum);
            
            query_result = await dbUtil.queryPre(dbFB.querys.fb.repl_info.selectReplInfoByBNAndRole, [maxBlkNum, role]);
        }
    }
    else
    {
        let maxBlkNum;

        let query_result_1 = await dbUtil.queryPre(dbFB.querys.fb.repl_info.selectMaxReplInfoByBNAndRole, [blkNum, role]);
        if (query_result_1.length)
        {
            maxBlkNum = query_result_1[0].max_blk_num;
            logger.debug("maxBlkNum : " + maxBlkNum);
    
            query_result = await dbUtil.queryPre(dbFB.querys.fb.repl_info.selectReplInfoByBNAndRoleAndClusterP2pAddr, [maxBlkNum, role, clusterP2pAddr]);
        }
    }
    
    //
    if (!query_result.length)
    {
        logger.error("Error - getReplData");
    }

    return query_result;
}

module.exports.getReplDataArr = async (blkNum, role, clusterP2pAddr) => {
    let replDataArr = new Array();

    let replData = await this.getReplData(blkNum, role, clusterP2pAddr);

    if (replData.length)
    {
        for(var i = 0; i < replData.length; i++)
        {
            // 
            // replDataArr.push({data : replData[i].repl_data});
            // blk_num, ip, role, log_file, log_pos, cluster_p2p_addr
            replDataArr.push({blk_num : replData[i].blk_num, ip : replData[i].ip, role : replData[i].role, 
                    log_file : replData[i].log_file, log_pos : replData[i].log_pos, cluster_p2p_addr : replData[i].cluster_p2p_addr});
        }
    }
    else
    {
        logger.error("Error - getReplDataArr : No replDataArr");
    }

    return replDataArr;
}