import { NewPrismaClient } from '../_utils/types'
import testMatrix from './_matrix'
// @ts-ignore
import type { PrismaClient } from './node_modules/@prisma/client'

declare let newPrismaClient: NewPrismaClient<typeof PrismaClient>

testMatrix.setupTestSuite(
  ({ provider, providerFlavor }, suiteMeta, clientMeta) => {
    const envVarName = providerFlavor ? `DATABASE_URI_${providerFlavor}` : `DATABASE_URI_${provider}`

    testIf(clientMeta.dataProxy === false)('using accelerate without --no-engine produces a warning at runtime', () => {
      process.env[envVarName] = 'prisma://accelerate.net/?api_key=doesNotMatter'
      const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation()

      newPrismaClient()

      // should only warn once
      newPrismaClient()

      expect(consoleWarnMock).toHaveBeenCalledTimes(1)
      expect(consoleWarnMock.mock.calls[0]).toMatchInlineSnapshot(`
        [
          prisma:warn In production, we recommend using \`prisma generate --no-engine\` (See: \`prisma generate --help\`),
        ]
      `)

      consoleWarnMock.mockRestore()
    })

    testIf(clientMeta.dataProxy === true)('using accelerate with --no-engine produces no warning at runtime', () => {
      process.env[envVarName] = 'prisma://accelerate.net/?api_key=doesNotMatter'
      const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation()

      newPrismaClient()

      expect(consoleWarnMock).toHaveBeenCalledTimes(0)
      consoleWarnMock.mockRestore()
    })
  },
  {
    optOut: {
      from: ['cockroachdb', 'mongodb', 'mysql', 'sqlserver', 'sqlite'],
      reason: 'warnOnce can only be tested one time per process',
    },
    skipDefaultClientInstance: true,
  },
)
