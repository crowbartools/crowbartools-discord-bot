import { authIssues } from './auth-issues';
import { bitDefender } from './bit-defender';
import { butAnother } from './but-another';
import { cloudBackups } from './cloud-backup';
import { dataFolder } from './data-folder';
import { discordMentions } from './discord-mentions';
import { expert } from './expert';
import { firebotLogs } from './firebot-logs';
import { instalLog } from './install-log';
import { manualRestore } from './manual-restore';
import { nightly } from './nightly-builds';
import { obsTroubleShooting } from './obs-troubleshooting';
import { offScreen } from './offscreen';
import { tuts } from './tutorials';
import { InfoTopic } from '../info-helpers';
import { arm64InstallError } from './arm64';
import { overlayIssues } from './overlay-issues';

export const infoTopics: Array<InfoTopic> = [
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
    arm64InstallError,
    overlayIssues,
];
