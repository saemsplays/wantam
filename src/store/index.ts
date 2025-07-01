
import { proxy } from 'valtio';

interface AppState {
  isDarkMode: boolean;
}

const state = proxy<AppState>({
  isDarkMode: false,
});

export default state;
