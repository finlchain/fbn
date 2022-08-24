//
const os = require('os');

//
const config = require('./../../config/config.js');
const define = require('./../../config/define.js');
const util = require('./../utils/commonUtil.js');
const dbUtil = require('./../db/dbUtil.js');
const dbIS = require('./../db/dbIS.js');
const dbNN = require('./../db/dbNN.js');
const dbFB = require('./../db/dbFB.js');
const dbFBHandler = require('./../db/dbFBHandler.js');
const dbMain = require('./../db/dbMain.js');
const dbRepl = require("./../db/dbRepl.js");
const repl = require("./../reg/replication.js");
const webApi = require("./../net/webApi.js");
const logger = require('./../utils/winlog.js');
const { initDatabaseIS } = require('../db/dbIS.js');

//
let DEFAULT_IDX = 0xFF;
//
let replDataArrInfo;
let replDataArrIdx = DEFAULT_IDX;

//
module.exports.handler = async (cmd) => {
    let retVal = true;

    logger.debug('FBN CLI Received Data : ' + cmd);

    let cmdSplit = cmd.split(' ');

    //
    if(cmd.toString() === define.CMD.DB_DT) 
    {
        logger.info("DB Truncated");

        //
        await dbIS.truncateIsDB();
        //
        await dbNN.truncateScDB();
        await dbNN.truncateBlockDB();
        await dbNN.truncateAccountDB();

        //
        await dbFB.truncateFbDB();
    }
    else if(cmd.slice(0,7) === define.CMD.DB_INIT)
    {
        //
        await dbMain.initDatabase();
    }
    else if(cmd.slice(0,9) === define.CMD.DB_ACT_QUERY)
    {
        await dbUtil.actQuery(cmd.slice(10));
    }
    else if(cmd.slice(0,8) === define.CMD.REPL_INFO)
    {
        let apiRoutePath = '/fb/repl/info';
        let apiRes = await webApi.APICallProc(apiRoutePath, config.FBN_CONFIG, webApi.WEBAPI_DEFINE.METHOD.GET);

        logger.debug("apiRes : " + JSON.stringify(apiRes));

        if (apiRes.errorCode === 0)
        {
            replDataArrInfo = apiRes.contents.replInfo;
            
            // logger.debug("replDataArrInfo : " + JSON.stringify(replDataArrInfo));

            logger.info("Replication Information");
            logger.info("====================================================================");
            await util.asyncForEach(replDataArrInfo, async(element, index) => {
                // logger.debug("replDataArrInfo[" + index + "] : " + JSON.stringify(element));
                let subnet_id = util.hexStrToInt(element.cluster_p2p_addr.slice(define.P2P_DEFINE.P2P_ROOT_SPLIT_INDEX.START));
                logger.info("idx[" + index + "] : blk_num (" + element.blk_num + "), ip (" + element.ip + "), role (" + define.getRoleStr(element.role) + "), subnet_id (" + subnet_id + ")");
            });
            logger.info("====================================================================");
        }
    }
    else if(cmd.slice(0,7) === define.CMD.REPL_SET)
    {
        if (cmdSplit.length === 3)
        {
            let idxStr = cmdSplit[2];

            let idx = util.strToInt(idxStr);

            if (!isNaN(idx))
            {
                logger.debug("idx : " + idx);
                logger.debug("replDataArrInfo : " + replDataArrInfo);

                if (typeof replDataArrInfo !== 'undefined')
                {
                    logger.debug("replDataArrInfo.length : " + replDataArrInfo.length);
                    if (replDataArrInfo.length)
                    {
                        if (idx < replDataArrInfo.length)
                        {
                            //
                            replDataArrIdx = idx;
                            let replData = replDataArrInfo[idx];

                            //
                            await repl.saveReplMyData(replData.blk_num, replData.cluster_p2p_addr);

                            //
                            await dbFBHandler.saveReplInfo(replData);
                        }
                    }
                }
            }
            else
            {
                logger.debug("it is Not a Number.");
            }
        }
        else if (cmdSplit.length === 2)
        {
            //
            logger.debug("Missing parameter.");

            // //
            // let apiRoutePath = '/fb/repl/info';
            // let apiKey1 = 'nodeRule';
            // let apiVal1 = define.NODE_ROLE.NUM.ISAG;

            // //
            // let apiPath = `${apiRoutePath}?${apiKey1}=${apiVal1}`;
            // logger.debug("apiPath : " + apiPath);

            // //
            // let apiRes = await webApi.APICallProc(apiPath, config.ISAG_CONFIG, webApi.WEBAPI_DEFINE.METHOD.GET);


            // logger.debug("apiRes : " + JSON.stringify(apiRes));

            // if (apiRes.errorCode === 0)
            // {
            //     let replDataArr = apiRes.contents.replInfo;
                
            //     let replData = replDataArr[0];
            //     if (os.hostname().includes('puri'))
            //     {
            //         replData = replDataArr[1];
            //     }

            //     await dbFBHandler.saveReplInfo(replData);
            // }
        }
    }
    else if (cmd.slice(0,7) === define.CMD.REPL_GET)
    {
        logger.info("Replication No Action");

        let replDataArr = await repl.getReplDataArr();
        if (replDataArr.length)
        {
            logger.debug("replDataArr : " + JSON.stringify(replDataArr));
        }
    }
    else if (cmd.slice(0,8) === define.CMD.REPL_STOP)
    {
        logger.info("Replication Slave Stop");
        await dbRepl.stopReplSlaves();
    }
    else if (cmd.slice(0,7) === define.CMD.REPL_RESET)
    {
        logger.info("Replication Slave Reset");

        //
        await repl.clrReplMyData();

        //
        await dbRepl.resetReplSlaves();
    }
    else if (cmd.slice(0,7) === define.CMD.REPL_START)
    {
        logger.info("Replication Slave Start");
        await dbRepl.startReplSlaves();
    }
    else if (cmd.slice(0, 9) === define.CMD.REPL_GET_SLAVE)
    {
        await dbRepl.getReplSlaves();
    }
    else if (cmd.slice(0, 8) === define.CMD.REPL_SAVE_MINE)
    {
        //
    }
    //
    else if  (cmd.slice(0,3) === define.CMD.GET_MY_IPS)
    {
        let localIPs = util.getMyIPs();
        //
        await util.asyncForEach(localIPs, async(element, index) => {
            logger.debug("ip[" + index + "] : " + element);
        });
    }
    //
    else if(cmd.slice(0,15) === "test webapi get")
    {
        let apiRoutePath = '/kafka/broker/list';
        let apiKey1 = 'subNetId';
        let apiVal1 = 24580;

        //
        let apiPath = `${apiRoutePath}`;
        logger.debug("apiPath : " + apiPath);

        let postData = `${apiKey1}=${apiVal1}`;

        //
        let apiRes = await webApi.APICallProc(apiPath, config.FBN_CONFIG, webApi.WEBAPI_DEFINE.METHOD.POST, postData);

        logger.debug("apiRes : " + JSON.stringify(apiRes));
    }
    else if(cmd.slice(0,16) === "test webapi post")
    {
        let apiRoutePath = '/kafka/broker/list';
        let apiKey1 = 'subNetId';
        let apiVal1 = 24580;

        //
        let apiPath = `${apiRoutePath}`;
        logger.debug("apiPath : " + apiPath);

        let postData = `${apiKey1}=${apiVal1}`;

        //
        let apiRes = await webApi.APICallProc(apiPath, config.FBN_CONFIG, webApi.WEBAPI_DEFINE.METHOD.POST, postData);

        logger.debug("apiRes : " + JSON.stringify(apiRes));
    }
    else
    {
        retVal = false;
        logger.error("[CLI] " + cmd + ' is an incorrect command. See is --help');
    }

    return retVal;
}