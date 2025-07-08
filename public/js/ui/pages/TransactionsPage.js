/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (!element) {
      throw new Error('Пустой элемент');
    }
    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener('click', (e) => {
      e.preventDefault();
      const removeAccount = e.target.closest('.remove-account');
      const transactionRemove = e.target.closest('.transaction__remove');

      if (removeAccount) {
        this.removeAccount();
      }
      if (transactionRemove) {
        this.removeTransaction(transactionRemove.dataset.id);
      }
    })
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.lastOptions) {
      return;
    }
    const isConfirm = confirm('Удалить счет?')
    if (isConfirm) {
      Account.remove(this.lastOptions.account_id, (err, response) => {
        if (err || !response?.success) {
          console.error('Ошибка удаления:', err || response);
          return;
        }
        this.clear();
        App.update();
      })
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    const isConfirm = confirm('Удалить транзакцию')
    if (isConfirm) {
      Transaction.remove( id, (err, response) => {
        if (response && response.success) {
          this.update();
          App.updateWidgets();
          App.updateForms();
        }else {
          console.log('Удаление не удалось', response);
        }
      })
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if (!options) {
      return;
    }

    this.lastOptions = options;

    Account.get(options.account_id, (err, account) => {
      if (err) {
        console.error('Failed to load account:', err);
        return;
      }

      if (!account) {
        console.error('Account not found');
        return;
      }

      this.renderTitle(`Название счета: ${account.name}`);
    });

    Transaction.list(options, (err, transactions) => {
      if (err) {
        console.error('Failed to load transactions:', err);
        return;
      }

      if (transactions) {
        this.renderTransactions(transactions);
      } else {
        this.renderTransactions([]);
      }
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счета');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    document.querySelector('.content-title').textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    let newDate = new Date(date);
    const datePart = new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(newDate);

    const timePart = new Intl.DateTimeFormat('ru-RU', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }).format(newDate);

    return `${datePart} в ${timePart}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    const date = this.formatDate(item.created_at);
    return `
      <div class="transaction transaction_${item.type} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
              <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
              <h4 class="transaction__title">${item.name}</h4>
              <!-- дата -->
              <div class="transaction__date">${date}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
          <!--  сумма -->
              ${item.sum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
            <!-- в data-id нужно поместить id -->
            <button class="btn btn-danger transaction__remove" data-id=${item.id}>
                <i class="fa fa-trash"></i>  
            </button>
        </div>
      </div>
    `
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const element = document.querySelector('.content')
    if (data.length === 0) {
      element.innerHTML = '';
      return;
    }
    if(data) {
      element.innerHTML = data.data.reduce((html, transaction) => {
        return html + this.getTransactionHTML(transaction);
      }, '');
    }
  }
}