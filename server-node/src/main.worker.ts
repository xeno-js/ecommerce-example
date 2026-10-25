import 'dotenv/config';
import { bootstrap } from './bootstrap';

async function main() {
    const app = await bootstrap('worker')
    const { logger, worker } = app.getServices()
    logger.info('Avvio worker')
    try {
        worker.start(5000)
    } catch (err) {
        process.exit(1);
    }
}

main();
