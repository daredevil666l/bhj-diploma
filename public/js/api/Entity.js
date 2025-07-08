class Entity {
  /**
   * Запрашивает с сервера список данных.
   * Это могут быть счета или доходы/расходы
   * (в зависимости от того, что наследуется от Entity)
   * */
  static URL = ''
  static list(data, callback){
    return createRequest({
      url: this.URL,
      method: 'GET',
      data: data,
      callback,
      });
  }

  /**
   * Создаёт счёт или доход/расход с помощью запроса
   * на сервер. (в зависимости от того,
   * что наследуется от Entity)
   * */
  static create(data, callback = f => f) {
    return createRequest({
      url: this.URL,
      method: 'PUT',
      responseType: 'json',
      data: data,
      callback
      });
  }

  /**
   * Удаляет информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static remove(id, callback = f => f ) {
    return createRequest({
      url: this.URL,
      method: 'DELETE',
      responseType: 'json',
      data: {id},
      callback,
      });
  }
}