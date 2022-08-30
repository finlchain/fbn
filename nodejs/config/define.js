//
const config = require('./../config/config.js');

// Define

const ENABLED = true;
const DISABLED = false;

module.exports.ERR_CODE ={
    ERROR : -1,
    SUCCESS : 1
}

//APP Info
module.exports.APP_INFO = {
    //
    PS_NODE: "ps aux | awk '/node/' | awk '!/isa/' | awk '!/awk/' | awk '{print $2}'", 
    KILL_NODE: "kill -9 $(ps aux | awk '/node/' | awk '!/isa/' | awk '!/awk/' | awk '{print $2}')",
    
    APP_STATUS_1: "ps -ef |grep node | awk '{print $8}'",
    APP_STATUS_2: "ps -ef |grep node | awk '{print $9}'"
};

module.exports.APP_NAME = {
    CPP: './bin/node',
    NODE: 'main.js'
}

module.exports.NODE_ROLE = {
    STR : {
        NN : 'NN',
        DN : 'DN',
        DBN : 'DBN',
        SCA : 'SCA',
        ISAG: 'ISAg',
        RN : 'RN',
        BN : 'BN'
    },
    NUM : {
        NN: 0,
        // DN: 1,
        DBN: 2,
        ISAG: 4
    },
}

module.exports.getRoleInt = (roleStr) => {
    let roleInt = this.ERR_CODE.ERROR;

    if (roleStr === this.NODE_ROLE.STR.NN)
    {
        roleInt = this.NODE_ROLE.NUM.NN;
    }
    else if (roleStr === this.NODE_ROLE.STR.DBN)
    {
        roleInt = this.NODE_ROLE.NUM.DBN;
    }
    else if (roleStr === this.NODE_ROLE.STR.ISAG)
    {
        roleInt = this.NODE_ROLE.NUM.ISAG;
    }

    return roleInt;
}

module.exports.getRoleStr = (roleInt) => {
    let roleStr = '';

    if (roleInt === this.NODE_ROLE.NUM.NN)
    {
        roleStr = this.NODE_ROLE.STR.NN;
    }
    else if (roleInt === this.NODE_ROLE.NUM.DBN)
    {
        roleStr = this.NODE_ROLE.STR.DBN;
    }
    else if (roleInt === this.NODE_ROLE.NUM.ISAG)
    {
        roleStr = this.NODE_ROLE.STR.ISAG;
    }

    return roleStr;
}

module.exports.SOCKET_ARG = {
    SEPARATOR: "\r"
}

module.exports.CRYPTO_ARG = {
    //
    HASH: 'sha256',
    // digest
    HEX: 'hex',
    BASE64: 'base64',
    //
    EDDSA: 'ed25519'
}

module.exports.CMD = {
    ENCODING:       'utf8', 
    DB_DT:          'dt', 
    DB_INIT:        'init db', 
    DB_ACT_QUERY:   'act query', 
    GET_MY_IPS:     'ips', 
    //
    REPL_INFO:      'fb rinfo',
    REPL_SET:       'fb rset', 
    REPL_GET:       'fb rget', 
    REPL_RESET:     'fb rrst', 
    REPL_STOP:      'fb rstop', 
    REPL_START:     'fb rstt', 
    //
    REPL_SAVE_MINE: 'fb rsave', 
    REPL_GET_SLAVE: 'replS get', 
}

module.exports.START_MSG = "=================================================="
    + "\n= FINL Block Chain                               ="
    + "\n= [ FBN Ver : " + config.VERSION_INFO + "]                              ="
    + "\n==================================================";

module.exports.REGEX = {
    NEW_LINE_REGEX: /\n+/, 
    WHITE_SPACE_REGEX: /\s/, 
    IP_ADDR_REGEX: /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/, 
    HASH_REGEX: /^[a-z0-9+]{5,65}$/, 
    HEX_STR_REGEX: /^[a-fA-F0-9]+$/, 
    // ID_REGEX: /^(?=.*[A-Z])(?!.*[a-z])(?!.*[\s()|!@#\$%\^&\*])(?=.{4,})/, 
    ID_REGEX: /^([A-Z0-9_]){4,20}$/,
    PW_STRONG_REGEX : /^([a-zA-Z0-9!@$%^~*+=_-]){10,}$/, 
    PW_STRONG_COND_REGEX : /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?!.*[])(?=.*[!@$%^~*+=_-]).{10,}$/, 
    // PW_STRONG_COND_REGEX : /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?!.*[~#&()<>?:{}])(?=.*[!@$%^~*+=_-]).{10,}$/, 
    PW_MEDIUM_REGEX : /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/, 
    FINL_ADDR_REGEX: /^(FINL){1}[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{1, }$/, 
    PURE_ADDR_REGEX: /^(PURE){1}[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{1, }$/
}

module.exports.COMMON_DEFINE = {
    PADDING_DELIMITER : {
        FRONT : 0,
        BACK : 1
    },
    ENABLED : ENABLED,
    DISABLED : DISABLED
}

//
module.exports.DB_DEFINE = {
    HEX_DB_KEY_LEN : {
        KEY_NUM_LEN : 12,
        KEY_INDEX_LEN : 4,
        DB_KEY_LEN : 16
    },
    REPL_QUERY_INDEX : {
        DROP_USER_INDEX : 0,
        CREATE_USER_INDEX : 1,
        GRANT_REPL_INDEX : 2
    },
    SHARD_USERS_QUERY_INDEX : {
        DROP_USER_INDEX : 0,
        CREATE_USER_INDEX : 1,
        GRANT_ALL_INDEX : 2
    },

    REPL_PORT : 13306, 
}

module.exports.P2P_DEFINE = {
    P2P_ROOT_SPLIT_INDEX : {
        START : 10,
        END : 14
    },
    P2P_TOPIC_NAME_SPLIT_INDEX : {
        START : 2,
        END : 14
    }
}
