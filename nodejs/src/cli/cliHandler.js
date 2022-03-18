//
const os = require('os');

//
const config = require('./../../config/config.js');
const define = require('./../../config/define.js');
const util = require('./../utils/commonUtil.js');
const dbUtil = require('./../db/dbUtil.js');
const dbNN = require('./../db/dbNN.js');
const dbFB = require('./../db/dbFB.js');
const dbFBHandler = require('./../db/dbFBHandler.js');
const dbMain = require('./../db/dbMain.js');
const dbRepl = require("./../db/dbRepl.js");
const repl = require("./../reg/replication.js");
const webApi = require("./../net/webApi.js");
const logger = require('./../utils/winlog.js');

//
let replDataArrInfo;

//
module.exports.handler = async (cmd) => {
    let retVal = true;

    logger.info('ISAg CLI Received Data : ' + cmd);

    let cmdSplit = cmd.split(' ');

    //
    if(cmd.toString() === "dt") 
    {
        logger.info("DB Truncated");

        //
        await dbNN.truncateScDB();
        await dbNN.truncateBlockDB();
        await dbNN.truncateAccountDB();

        //
        await dbFB.truncateFbDB();
    }
    else if(cmd.slice(0,7) === "init db")
    {
        //
        await dbMain.initDatabase();
    }
    else if(cmd.slice(0,9) === "act query")
    {
        await dbUtil.actQuery(cmd.slice(10));
    }
    else if(cmd.slice(0,12) === "maria passwd")
    {
        //
    }
    // else if()
    // {
    //     let element = replSetArr[0];

    //     let clusterP2pAddr = element.cluster_p2p_addr;

    //     let ip = element.ip;
    //     let logFile = element.log_file;
    //     let logPos = element.log_pos;

    //     logger.info("clusterP2pAddr : " + clusterP2pAddr);
    //     logger.info("ip : " + ip + ", logFile : " + logFile + ", logPos : " + logPos);

    //     await dbRepl.setReplSlaveInfo(0, ip, logFile, logPos);
    // }
    else if(cmd.slice(0,15) === "webapi get test")
    {
        let apiRoutePath = '/kafka/broker/list';
        let apiKey1 = 'subNetId';
        let apiVal1 = 24580;

        //
        let apiPath = `${apiRoutePath}`;
        logger.debug("apiPath : " + apiPath);

        let postData = `${apiKey1}=${apiVal1}`;

        //
        let apiRes = await webApi.APICallProc(apiPath, config.ISAG_CONFIG, webApi.WEBAPI_DEFINE.METHOD.POST, postData);

        logger.debug("apiRes : " + JSON.stringify(apiRes));
    }
    else if(cmd.slice(0,16) === "webapi post test")
    {
        let apiRoutePath = '/kafka/broker/list';
        let apiKey1 = 'subNetId';
        let apiVal1 = 24580;

        //
        let apiPath = `${apiRoutePath}`;
        logger.debug("apiPath : " + apiPath);

        let postData = `${apiKey1}=${apiVal1}`;

        //
        let apiRes = await webApi.APICallProc(apiPath, config.ISAG_CONFIG, webApi.WEBAPI_DEFINE.METHOD.POST, postData);

        logger.debug("apiRes : " + JSON.stringify(apiRes));
    }
    else if(cmd.slice(0,8) === "fb rinfo")
    {
        let apiRoutePath = '/fb/repl/info';
        let apiRes = await webApi.APICallProc(apiRoutePath, config.ISAG_CONFIG, webApi.WEBAPI_DEFINE.METHOD.GET);

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
    else if(cmd.slice(0,7) === "fb rset")
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
                            let replData = replDataArrInfo[idx];

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
    else if (cmd.slice(0,7) === "fb rget")
    {
        logger.info("Replication No Action");

        let replDataArr = await repl.getReplDataArr();
        if (replDataArr.length)
        {
            logger.debug("replDataArr : " + JSON.stringify(replDataArr));
        }
    }
    else if (cmd.slice(0,8) === "fb rstop")
    {
        logger.info("Replication Slave Stop");
        await dbRepl.stopReplSlaves();
    }
    else if (cmd.slice(0,7) === "fb rrst")
    {
        logger.info("Replication Slave Reset");
        await dbRepl.resetReplSlaves();
    }
    else if (cmd.slice(0,7) === "fb rstt")
    {
        logger.info("Replication Slave Start");
        await dbRepl.startReplSlaves();
    }
    else if  (cmd.slice(0,3) === "ips")
    {
        let localIPs = util.getMyIPs();
        //
        await util.asyncForEach(localIPs, async(element, index) => {
            logger.debug("ip[" + index + "] : " + element);
        });
    }
    else
    {
        retVal = false;
        logger.error("[CLI] " + cmd + ' is an incorrect command. See is --help');
    }

    return retVal;
}