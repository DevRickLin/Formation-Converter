#!/usr/bin/env node
const fs = require('fs').promises;
const yargs = require("yargs");

const options = yargs
    .usage("usage")
    .option("f", 
        { alias: "file", describe: "需要修复的目标文件", type: "string", demandOption: false })
    .help(true)
    .argv;

function fixRoleTypeOfFormation(formation) {
    const result = JSON.parse(formation);
    for(const line of result.role) {
        switch(line['name']) {
            case 'Goalie':
                line['type'] = "G";
                break;
            case 'CenterBack': case 'SideBack':
                line['type'] = "DF";
                break;
            case 'DefensiveHalf': case 'OffensiveHalf':
                line['type'] = "MF";
                break;
            case 'SideForward': case 'CenterForward':
                line['type'] = "FW";
                break;
            default:
                throw Error(`[ERR] no match type of ${line['name']}`);
        }
    }
    return JSON.stringify(result, null, 4);
}

async function main() {

const targetFileName = options.file;

if(!targetFileName) {
    console.log(`[ERR] please specify target formation file`);
    return;
}

const formation = await fs.readFile(targetFileName, 'utf-8');
try{
    fs.writeFile(targetFileName,fixRoleTypeOfFormation(formation));
}catch(err){
    console.log(err);
}
}

main();
