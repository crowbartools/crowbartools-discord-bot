import { BaseMessageOptions } from "discord.js";

import { authIssues } from "./subjects/auth-issues";
import { bitDefender } from "./subjects/bit-defender";
import { butAnother } from "./subjects/but-another";
import { cloudBackups } from "./subjects/cloud-backup";
import { dataFolder } from "./subjects/data-folder";
import { discordMentions } from "./subjects/discrod-mentions";
import { expert } from "./subjects/expert";
import { firebotLogs } from "./subjects/firebot-logs";
import { instalLog } from "./subjects/install-log";
import { manualRestore } from "./subjects/manual-restore";
import { nightly } from "./subjects/nightly-builds";
import { obsTroubleShooting } from "./subjects/obs-troubleshooting";
import { offScreen } from "./subjects/offscreen";
import { tuts } from "./subjects/tutorials";

export const infoSubjects: Array<{
    name: string;
    message: BaseMessageOptions;
}> = [
        authIssues,
        bitDefender,
        butAnother,
        cloudBackups,
        dataFolder,
        discordMentions,
        expert,
        firebotLogs,
        instalLog,
        manualRestore,
        nightly,
        obsTroubleShooting,
        offScreen,
        tuts,
    ];
