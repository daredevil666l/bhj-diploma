
/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list(User.current(), (err, response) => {
    const lists = this.element.querySelector('.accounts-select');
      if (response && response.success) {
        lists.innerHTML = response.data.reduce((html, account) => {
          return html + `<option value="${account.id}">${account.name}</option>`;
        }, '')
      }
    })
  }
  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (response && response.success) {

        this.element.reset();
        const modalName = 'new' + data.type[0].toUpperCase() + data.type.substring(1);
        App.getModal(modalName).close();
        App.update();
      }
    })
  }
}