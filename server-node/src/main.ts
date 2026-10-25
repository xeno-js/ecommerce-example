import 'dotenv/config';
import { bootstrap } from './bootstrap';

async function main() {
    const app = await bootstrap('api')
    const { logger, configurationService } = app.getServices()

    logger.info('Avvio app')

    const port = configurationService.getNumber('PORT', 3000);

    try {
        app.listen({
            port,
            host: 'localhost',
            onListening: (address) => {
                logger.info(`🚀 Xeno Node server is running on http://${address.host}:${address.port}`);
            }
        })
    } catch (err) {
        process.exit(1);
    }
}

main();
