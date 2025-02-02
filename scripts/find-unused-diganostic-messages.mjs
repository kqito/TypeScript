// @ts-check
// This file requires a modern version of node 14+, and grep to be available.

// node scripts/find-unused-diagnostic-messages.mjs
import { readFileSync } from "fs";
import {EOL} from "os";
import { execSync } from "child_process";

const diags = readFileSync("src/compiler/diagnosticInformationMap.generated.ts", "utf8");
const startOfDiags = diags.split("export const Diagnostics")[1];

const missingNames = [];
startOfDiags.split(EOL).forEach(line => {
    if (!line.includes(":")) return;
    const diagName = line.split(":")[0].trim();

    try {
        execSync(`grep -rnw 'src' -e 'Diagnostics.${diagName}'`).toString();
        process.stdout.write(".");
    }
    catch (error) {
        missingNames.push(diagName);
        process.stdout.write("x");
    }
});

if (missingNames.length) {
    process.exitCode = 1;
    console.log("Could not find usage of these diagnostics in the codebase:");
    console.log(missingNames);
}
