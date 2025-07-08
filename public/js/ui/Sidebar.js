/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {

  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  static initToggleButton() {
    const toggleButton = document.querySelector('.sidebar-toggle')
    const body = document.querySelector('.sidebar-mini');

    toggleButton.addEventListener('click', (e) => {
      e.preventDefault();

      ['sidebar-open', 'sidebar-collapse'].forEach(className => {
        body.classList.toggle(className);
      });
    })
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {

    document.querySelector('.menu-item_register').addEventListener('click', (e) => {
      e.preventDefault();
      App.getModal('register').open();
    });

    document.querySelector('.menu-item_login').addEventListener('click', (e) => {
      e.preventDefault();
      App.getModal('login').open();
    });

    document.querySelector('.menu-item_logout').addEventListener('click', (e) => {
      e.preventDefault();
      User.logout((err, response) => {
        if (response && response.success) {
          App.setState('init');
        }
      });
    });

  }
}