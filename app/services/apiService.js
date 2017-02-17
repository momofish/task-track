import Promise from 'promise';

function handleError(reject) {
  return reason => {
    if (reject(...arguments) == undefined) {
      var message = reason.responseJSON && reason.responseJSON.message || reason.statusText;
      toastr.error(message);
    }
  }
}

export function get(url, id) {
  return new Promise((resolve, reject) =>
    $.ajax({
      url: `${url}${id ? `/${id}` : ''}`,
      success: resolve, error: handleError(reject)
    })
  );
}

export function put(url, object) {
  return new Promise((resolve, reject) =>
    $.ajax({
      url: url, type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(object),
      success: resolve, error: handleError(reject)
    })
  );
}

export function post(url, object) {
  return new Promise((resolve, reject) =>
    $.ajax({
      url: url, type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(object),
      success: resolve, error: handleError(reject)
    })
  );
}

export function save(url, object) {
  return new Promise((resolve, reject) =>
    $.ajax({
      url: url, type: object._id ? 'POST' : 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(object),
      success: resolve, error: handleError(reject)
    })
  );
}

export function remove(url, id) {
  return new Promise((resolve, reject) =>
    $.ajax({
      url: `${url}/${id || ''}`, type: 'DELETE',
      success: resolve, error: handleError(reject)
    })
  );
}

export default { get, put, post, save, remove }