import Promise from 'promise';

function handleError(reject) {
  return reason => {
    if (reject(...arguments) == undefined) {
      var message = reason.responseJSON && reason.responseJSON.message;
      toastr.error(message);
    }
  }
}

export function get(url, id) {
  return new Promise((resolve, reject) =>
    $.ajax({
      url: `${url}/${id || ''}`,
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