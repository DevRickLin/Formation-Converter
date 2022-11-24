#!/usr/bin/env node
const fs = require('fs').promises;
const yargs = require("yargs");

const options = yargs
    .usage("usage")
    .option("t", 
        { alias: "target", describe: "target file(json format)", type: "string", demandOption: true })
    .option("f",
        { alias: "format", describe: "output format", type: "string", default: "json", demandOption: false}
    )
    .option("o",
        { alias: "output", describe: "output file (default is the origin file)", type: "string", demandOption: false}
    )
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
    return result;
}

function json2v3(formation) {
    let result = "";
    result += `Formation ${formation['method']} 2\n`;
    result += "Begin Roles\n";
    formation['role'].forEach((role,idx)=>{
        result += `${role.number} ${role.name} ${role.pair < role.number ? role.pair : '-1'}\n`
    });
    result += "End Roles\n";
    result += `Begin Samples 2 ${formation['data'].length}\n`;
    formation['data'].forEach(
        (data,idx) => {
            result += `----- ${idx} -----\n`;
            result += `Ball ${data.ball.x} ${data.ball.y}\n`;
            for(const unum of Array(11).keys()) {
                const { x, y } = data[`${unum + 1}`]; 
                result += `${unum + 1} ${x} ${y}\n`;
            }
        }
    )
    result += "End Samples\n";
    result += "End";
    return result;
}

function convert(format,formation) {
    switch(format) {
        case 'v3':
            return json2v3(formation);
        case 'json':
            return JSON.stringify(formation, null, 4);
        default:
            break;
    }
}

async function main() {

const targetFileName = options['target'];

const formation = await fs.readFile(targetFileName, 'utf-8');

const fixed = fixRoleTypeOfFormation(formation);

try{
    fs.writeFile(options['output'] || targetFileName,convert(options['format'],fixed));
}catch(err){
    console.log(err);
}
}

main();
