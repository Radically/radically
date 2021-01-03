// encapsulates getting and catching unihan data

import { UNIHAN_ZIP_URL, DATA_CACHE_DIR } from './constants';
import axios from 'axios';
import progress from 'progress';
import path from 'path';
import fs from 'fs';

const fetchUnihanData = async () => {

  console.log('Connecting …')
  const { data, headers } = await axios({
    url: UNIHAN_ZIP_URL,
    method: 'GET',
    responseType: 'stream'
  })
  const totalLength = headers['content-length']

  console.log('Starting download')
  const progressBar = new progress('-> downloading [:bar] :percent :etas', {
    width: 40,
    complete: '=',
    incomplete: ' ',
    renderThrottle: 1,
    total: parseInt(totalLength)
  })

  const writer = fs.createWriteStream(
    path.resolve(__dirname, 'images', 'Unihan.zip')
  )

  data.on('data', (chunk: string | any[]) => progressBar.tick(chunk.length, {}))
  data.pipe(writer)
}

export const getRawIRGSources = async () => {
  // check if already downloaded
  await fetchUnihanData();
  // download with progress bar
}