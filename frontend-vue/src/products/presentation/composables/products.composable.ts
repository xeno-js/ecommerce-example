import { ref } from 'vue'
import { ServicesUtils } from '@xeno-js/vue'
import { GetProductsQuery, GetProductByIdQuery } from '../../application'
import type { ProductDto } from '../../infrastructure/schemas/product.schema.ts'
import type { Optional, IPaginatedResult } from '@xeno-js/core'
import { getFriendlyError } from '@/commons/shared/utils/error.utils.ts'

export function useProducts() {
    const products = ref<ProductDto[]>([])
    const product = ref<Optional<ProductDto>>(undefined)

    const currentPage = ref<number>(1)
    const pageSize = ref<number>(10)
    const totalPages = ref<number>(1)
    const totalItems = ref<number>(0)
    const hasNextPage = ref<boolean>(false)
    const hasPreviousPage = ref<boolean>(false)

    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchProducts(page: number = 1, size: number = 10, cacheOpts?: {
        ttl?: number;
        bypassCache?: boolean;
        consistentRead?: boolean;
    }) {
        loading.value = true
        error.value = null
        products.value = []

        const { mediator } = ServicesUtils.useApp()
        const query = new GetProductsQuery(page, size, cacheOpts)
        const result = await mediator.query<IPaginatedResult<ProductDto>>(query)

        if (result.isOk()) {
            const paginatedData = result.getValueOrThrow()
            products.value = paginatedData?.items ? [...paginatedData.items] : []
            currentPage.value = Number(paginatedData?.page) ?? page
            pageSize.value = Number(paginatedData?.pageSize) ?? size
            totalPages.value = Number(paginatedData?.totalPages) ?? 1
            totalItems.value = Number(paginatedData?.total) ?? 0
            hasNextPage.value = Boolean(paginatedData?.hasNextPage)
            hasPreviousPage.value = Boolean(paginatedData?.hasPreviousPage)
        } else {
            error.value = getFriendlyError(result.getErrorOrThrow().message)
        }
        loading.value = false
    }

    async function fetchProductById(id: string, cacheOpts?: {
        ttl?: number;
        bypassCache?: boolean;
        consistentRead?: boolean;
    }) {
        loading.value = true
        error.value = null
        const { mediator } = ServicesUtils.useApp()
        const query = new GetProductByIdQuery(id, cacheOpts)
        const result = await mediator.query<Optional<ProductDto>>(query)

        if (result.isOk()) {
            product.value = result.getValueOrThrow()
        } else {
            error.value = getFriendlyError(result.getErrorOrThrow().message)
        }
        loading.value = false
    }

    return {
        products,
        product,
        currentPage,
        pageSize,
        totalPages,
        totalItems,
        hasNextPage,
        hasPreviousPage,
        loading,
        error,
        fetchProducts,
        fetchProductById
    }
}