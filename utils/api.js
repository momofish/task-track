import nodeFetch from 'node-fetch';

export async function fetch(url, opts) {
  let options = Object.assign({headers: { 'Content-Type': 'application/json' }}, opts);
  console.log(`${options.method || 'GET'} ${url}`);
  let result = await nodeFetch(url, options);
  if (result.status >= 400) {
    let error = await result.json();
    throw new Error(error.ExceptionMessage || error.MessageDetail || error.Message);
  }

  return await result.json();
}