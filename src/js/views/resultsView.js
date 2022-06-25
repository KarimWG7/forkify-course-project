import previewView from './previewView';
import { View } from './view';
class ReasultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'No recipes found to your query! Please try again ';
  _message = '';
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}
export default new ReasultsView();
