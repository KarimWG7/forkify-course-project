import { View } from './view';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');
  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    //page 1 , and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupBtn('next', 'right');
    }

    // last page
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupBtn('prev', 'left');
    }

    //other page
    if (curPage < numPages) {
      return `
     ${this._generateMarkupBtn('next', 'right')}
     ${this._generateMarkupBtn('prev', 'left')}
    
      `;
    }
    //page 1 , and there are no other pages
    return '';
  }
  _generateMarkupBtn(direction, arrow) {
    const curPage = this._data.page;
    const con = direction === 'next' ? curPage + 1 : curPage - 1;
    return `
    <button data-goto=" ${con}" class="btn--inline pagination__btn--${direction}">
          <span>Page ${con}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-${arrow}"></use>
          </svg>
        </button>
    `;
  }
}
export default new PaginationView();
