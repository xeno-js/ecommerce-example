import { GetXenoBuilder } from '@ecommerce/core-logic';
import { withNodeHttpServer } from '@xeno-js/node'; 

export async function bootstrap(mode: 'api' | 'worker') {
    const builder = GetXenoBuilder(mode)
    builder.addHttpServer(withNodeHttpServer())

    return builder.build()
}