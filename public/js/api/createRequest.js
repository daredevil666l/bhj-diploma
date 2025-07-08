const createRequest = (options = {}) => {
  const xhr = new XMLHttpRequest();

  xhr.responseType = 'json';

  let requestData = options.data;

  if (options.method === 'GET') {
    const params = new URLSearchParams();
    for (const key in options.data) {
      params.append(key, options.data[key]);
    }
    options.url += '?' + params.toString();
  } else {
    requestData = new FormData();
    for (const key in options.data) {
      requestData.append(key, options.data[key]);
    }
  }

  xhr.addEventListener('load',  () => {
      options.callback(null, xhr.response);
  });

  xhr.open(options.method, options.url, true);
  try {
    xhr.send(requestData);
  } catch (err) {
    options.callback(err, null);
  }
  return xhr;
};