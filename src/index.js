import { get } from 'https';
import { parse } from 'url';
import { globalAgent } from 'http';

export default function download (uri) {
	return new Promise((resolve, reject) => {
		const data = [];
		const opts = parse(uri);
		opts.agent = opts.protocol === 'http:' ? globalAgent : void 0;
		get(opts, res => {
			res.on('data', chunk => data.push(chunk));
			res.on('end', () => {
				if (res.statusCode >= 400) return reject(res);
				if (res.statusCode > 300 && res.headers.location)
					resolve(download(res.headers.location));
				resolve({ res, buffer: Buffer.concat(data) })
			});
		}).on('error', reject);
	});
}
