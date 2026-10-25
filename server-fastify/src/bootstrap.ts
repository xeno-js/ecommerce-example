import { GetXenoBuilder } from '@ecommerce/core-logic';
import { withFastify } from '@xeno-js/fastify'; 

export async function bootstrap(mode: 'api' | 'worker') {
    const builder = GetXenoBuilder(mode)
    builder.addHttpServer(withFastify())

    return builder.build()
}