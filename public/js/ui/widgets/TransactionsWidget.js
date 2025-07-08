/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (!element ) {
      throw new Error("Пустой элемент.");
    }

    this.element = element;
    this.registerEvents();
  }

  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    this.element.addEventListener('click', (e) => {
      e.preventDefault();

      const incomeButton = e.target.closest('.create-income-button');
      const expenseButton = e.target.closest('.create-expense-button');

      if (incomeButton) {
        App.getModal('newIncome').open();
      }
      if (expenseButton) {
        App.getModal('newExpense').open();
      }
    })
  }
}