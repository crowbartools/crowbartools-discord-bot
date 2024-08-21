import * as bot from './bot';
import { config } from './config';

(() => {
    if (!config.loadAndValidate()) {
        process.exit();
    }
    bot.init();
})();
