//
const define = require('./config/define.js');
const dbMain = require('./src/db/dbMain.js');
const cli = require('./src/cli/cli.js');

const main = async() => {
    //
    console.log(define.START_MSG);

    // //
    // await dbMain.initDatabase();

    //
    await cli.cliCallback();
}

main();

