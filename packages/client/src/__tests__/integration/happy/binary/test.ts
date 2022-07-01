import { getNodeAPIName, getPlatform } from '@prisma/get-platform'
import { ClientEngineType, getClientEngineType } from '@prisma/internals'
import fs from 'fs'
import path from 'path'

import { generateTestClient } from '../../../../utils/getTestClient'

test('query engine file exists', async () => {
  expect.assertions(1)
  await generateTestClient()

  const platform = await getPlatform()
  let enginePath =
    getClientEngineType() === ClientEngineType.Library
      ? path.join(__dirname, 'node_modules/.prisma/client', getNodeAPIName(platform, 'fs'))
      : path.join(__dirname, 'node_modules/.prisma/client', `query-engine-${platform}`)

  if (process.platform === 'win32' && getClientEngineType() === ClientEngineType.Binary) {
    enginePath += '.exe'
  }

  expect(fs.existsSync(enginePath)).toBe(true)
})
